import ollama from "ollama";
import type { RSSFeed } from "../tools/newsAggregator";
import { summarizeSystemPrompt } from "../systemPrompt";
import { addMessage } from "../db";
const model = "deepseek-r1:1.5b";

export const getResponseFromLLMModel = async (feed: RSSFeed) => {
	if (!feed) {
		return "No engineering blog posts found.";
	}

	let formattedText = "\n";

	formattedText += `"${feed.title}"\n`;
	formattedText += `   Published: ${feed.publishedDate}\n`;
	formattedText += `   Source: ${feed.name}\n`;
	formattedText += `   Link: ${feed.link}\n\n`;
	formattedText += `   Content: ${feed.content}\n\n`;

	const updatedMessage = [
		{
			role: "system",
			content: summarizeSystemPrompt,
		},
		{
			role: "user",
			content: formattedText,
		},
	];

	await addMessage(updatedMessage);

	const response = await ollama.chat({
		model: model,
		messages: updatedMessage,
	});

	await addMessage({ role: "assistant", content: response.message.content });

	const cleanedText =
		response.message.content.split("</think>")[1]?.trim() || "";

	return cleanedText;
};
