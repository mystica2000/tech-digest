import { JSONFilePreset } from "lowdb/node";

interface Message {
	role: string;
	content: string;
}

interface MessagesDatabase {
	messages: Message[];
}

const db = await JSONFilePreset<MessagesDatabase>("messages.json", {
	messages: [],
});

export async function getMessages() {
	await db.read();
	return db.data?.messages || [];
}

export async function addMessage(message: Message | Message[]) {
	await db.read();

	if ("length" in message) {
		for (const msg of message) {
			db.data.messages.push(msg);
		}
	} else {
		db.data.messages.push(message);
	}

	await db.write();
}
