import { toolsSystemPrompt } from "../systemPrompt";
const model = "llama3-groq-tool-use";
import ollama from "ollama";
import { newsAggregator } from "../tools/newsAggregator";
import type { RSSFeed } from "../tools/newsAggregator";
import { fetchArticleContent } from "../helpers/puppeteer";
import ora from "ora";
import { addMessage } from "../db";

export const callToolsModel = async (userPrompt: string) => {
	const messages = [
		{
			role: "system",
			content: toolsSystemPrompt,
		},
		{
			role: "user",
			content: userPrompt,
		},
	];

	const response = await ollama.chat({
		model: model,
		messages: messages,
		format: "json",
		tools: [
			{
				type: "function",
				function: {
					name: "get_latest_engineering_news",
					description: "Get the latest news from the engineering blogs",
					parameters: {
						type: "object",
						properties: {
							name: {
								type: "string",
								description: "name of the tech blog",
							},
						},
						required: [],
					},
				},
			},
		],
	});

	if (
		!response.message.tool_calls ||
		response.message.tool_calls.length === 0
	) {
		console.log("\n Model didn't used the tool! Reason: ", response.message);
		process.exit(-1);
	}

	if (response.message.tool_calls) {
		const availableFunction = {
			get_latest_engineering_news: await newsAggregator,
		};

		let functionResponse: RSSFeed[] = [];
		for (const tool of response.message.tool_calls) {
			const functionName = tool.function.name;
			const functionArgs = tool.function.arguments;

			if (functionName === "get_latest_engineering_news") {
				const functionToCall = availableFunction[functionName];
				functionResponse = await functionToCall(functionArgs);
			}
		}

		const spinner = ora("🚀 Fetching articles...").start();

		const contentPromises = functionResponse.map(async (article) => {
			try {
				const content = await fetchArticleContent(article);
				console.log(`✅ Fetched: ${content}`);

				return content; // Return article with content
			} catch (error) {
				console.error(`❌ Failed to fetch ${article.title}:`, error);
				return null;
			}
		});

		const results = await Promise.all(contentPromises);

		const successfulResponses = results.filter((result) => result !== null);

		spinner.succeed(`✅ Fetched ${successfulResponses.length} articles!`);

		addMessage({
			role: "tool",
			content: JSON.stringify(successfulResponses),
		});

		return successfulResponses;
	}
	return null;
};
