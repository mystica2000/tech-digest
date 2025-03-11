# AI Experiment - Tool Calling

Tool Calling Or Function Calling helps to bridge the LLM Models to communicate with the external api points!

In this project,

- It retrieves the latest engineering blogs feeds and summarizes
- This project uses two LLM Models for tooling and summarizing (text generation)

As of now, Deepseek have unstable support for the function calling. so i have used other fine tuned model built on top of llama that is optimized for the tool calling.

For Tool Calling,
`llama3-groq-tool-use` for the tool calling

For summarizing,
`DeepseekR1` for the summarizing

To run it locally,

Pre-req

- make sure [ollama](https://ollama.com/) and download [deepseek](https://ollama.com/library/deepseek-r1:1.5b) and [llama3-groq-tool-use](https://ollama.com/library/llama3-groq-tool-use) models
- make sure ollama is running

For project,

- `npm i`
- `npm run start` to start! (Note it might run slow according to the device spec)

Disclaimer: ⚠️ UX is not that great, it was more of an experiment than a real product :)

To play around with different tooling models locally, checkout https://ollama.com/search?c=tools

### Extensions that can be made:

Instead of retrieving every time, use vector embedding to store the result along with timestamp, perform simularity search and retrive accordingly.
Storing timestamp to avoid stale data since latest blogs gets updated every day.
It would be much faster.

`messages.json` will contain the prompt history like a memory! (In read world, it would be stored in DB or as vector embeddings)
However, it is not useful for the **current** implementation. It will be useful to have a memory for the chat apps or for the Extensions of this implementation (Context aware applications)

Currently this implementation has tool and then reasoning. When in real world, it has to switch dynamically between models for tooling as well as reasoning.
It can be done via model routing where specific keywords might trigger a tooling model instead!

```
if user_query in ["latest", "engineering", "blogs"]
  then process using tool
else
  reasoning
```

Or use semantic search that marks the user query to the set of keywords in the embeddings or any other advanced mechanism!
