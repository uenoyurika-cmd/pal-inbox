import OpenAI from "openai";

export function getOpenAIClient(apiKey?: string): OpenAI {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OpenAI API key not configured");
  }
  return new OpenAI({ apiKey: key });
}
