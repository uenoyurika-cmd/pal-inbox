import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { getSession } from "@/lib/session";
import { PrioritizeResponse } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const apiKey = session.settings?.openaiApiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI APIキーが設定されていません" },
        { status: 400 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    const client = getOpenAIClient(apiKey);

    const messageText = messages
      .map(
        (m: { id: string; from: string; subject: string; snippet: string; receivedAt: string }) =>
          `ID: ${m.id}\nFrom: ${m.from}\nSubject: ${m.subject}\nSnippet: ${m.snippet}\nReceived: ${m.receivedAt}`
      )
      .join("\n---\n");

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a message priority analyzer. Analyze messages and assign priority levels.
Respond ONLY in valid JSON format:
{
  "messages": [
    {"id": "...", "priority": "high|medium|low", "reason": "...", "summary": "..."}
  ]
}`,
        },
        {
          role: "user",
          content: `Analyze these messages and assign a priority level (high, medium, or low) to each one based on urgency, importance, and whether action is required.

Messages to analyze:
${messageText}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    const parsedResponse = JSON.parse(content) as PrioritizeResponse;

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error prioritizing messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
