import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { PrioritizeResponse } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    const client = getOpenAIClient();

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
