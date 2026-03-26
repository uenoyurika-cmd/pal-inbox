import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { DraftResponse } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { subject, body, from, source, tone = "business" } = await request.json();

    if (!subject || !body) {
      return NextResponse.json({ error: "subject and body required" }, { status: 400 });
    }

    const client = getOpenAIClient();

    const systemPrompt = `You are a helpful assistant that drafts email/message replies in Japanese. Write polite, professional responses. The tone should be: ${tone}.`;

    const userPrompt = `Please draft a reply to the following message:

From: ${from}
Subject: ${subject}
Body: ${body}

Write a professional Japanese reply that addresses the key points in the message.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    const draftResponse: DraftResponse = {
      draft: content,
      tone: tone as "casual" | "business" | "formal",
    };

    return NextResponse.json(draftResponse);
  } catch (error) {
    console.error("Error generating draft:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
