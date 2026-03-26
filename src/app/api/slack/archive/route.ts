import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const botToken = process.env.SLACK_BOT_TOKEN;

    if (!botToken) {
      return NextResponse.json({ error: "Slack token not configured" }, { status: 401 });
    }

    const { channelId, messageTs } = await request.json();

    if (!channelId || !messageTs) {
      return NextResponse.json(
        { error: "channelId and messageTs required" },
        { status: 400 }
      );
    }

    // Mark message as read by adding a reaction
    const reactionRes = await fetch("https://slack.com/api/reactions.add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "eyes",
        channel: channelId,
        timestamp: messageTs,
      }),
    });

    if (!reactionRes.ok) {
      console.error("Slack reaction error:", reactionRes.status);
      return NextResponse.json({ error: "Failed to archive message" }, { status: 500 });
    }

    const reactionData = await reactionRes.json();

    if (!reactionData.ok) {
      console.error("Slack API error:", reactionData.error);
      return NextResponse.json({ error: "Failed to archive message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error archiving Slack message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
