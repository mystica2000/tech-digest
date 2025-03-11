import ora from "ora";
import { getResponseFromLLMModel } from "./ollama/llm-model";
import { callToolsModel } from "./ollama/tools-model";

const spinner = ora("🚀 tech from Engineering Blogs").start();
const userPrompt = "What are the latest news from the engineering blogs?";

try {
	const messages = await callToolsModel(userPrompt);

	if (messages && messages.length > 0) {
		spinner.text = `🔄 Processing ${messages.length} messages...`;

		for (const msg of messages) {
			try {
				spinner.text = `🔄 Summarizing ${msg.title}`;
				const response = await getResponseFromLLMModel(msg);
				console.log("\n 📝 Response: ", response);
			} catch (error) {
				console.error("❌ Error processing message:", error);
			}
		}

		spinner.stop();
	} else {
		spinner.warn("⚠️ No messages received.");
	}
} catch (error) {
	spinner.fail("❌ Error occurred!");
	console.error("Error:", error);
}
