import { NextResponse } from "next/server";
import { UnifiedMessage } from "@/lib/types";

const BOT_USER_ID = "U06NTAMKRF1";

export async function GET(request: Request) {
  try {
    const botToken = process.env.SLACK_BOT_TOKEN;

    if (!botToken) {
      console.error("SLACK_BOT_TOKEN not set");
      return NextResponse.json([], { status: 200 });
    }

    // List all conversations
    const conversationsRes = await fetch(
      "https://slack.com/api/conversations.list?exclude_archived=true&limit=100",
      {
        headers: {
          Authorization: `Bearer ${botToken}`,
        },
      }
    );

    if (!conversationsRes.ok) {
      console.error("Slack conversations error:", conversationsRes.status);
      return NextResponse.json([], { status: 200 });
    }

    const conversationsData = await conversationsRes.json();

    if (!conversationsData.ok || !conversationsData.channels) {
      console.error("Slack API error:", conversationsData.error);
      return NextResponse.json([], { status: 200 });
    }

    const messages: UnifiedMessage[] = [];

    // Fetch messages from each channel
    for (const channel of conversationsData.channels) {
      try {
        const historyRes = await fetch(
          `https://slack.com/api/conversations.history?channel=${channel.id}&limit=50`,
          {
            headers: {
              Authorization: `Bearer ${botToken}`,
            },
          }
        );

        if (!historyRes.ok) continue;

        const historyData = await historyRes.json();

        if (!historyData.ok || !historyData.messages) continue;

        // Filter messages mentioning the bot user
        for (const msg of historyData.messages) {
          if (msg.text && msg.text.includes(`<@${BOT_USER_ID}>`)) {
            const userRes = await fetch(
              `https://slack.com/api/users.info?user=${msg.user}`,
              {
                headers: {
                  Authorization: `Bearer ${botToken}`,
                },
              }
            );

            let userName = "Unknown";
            if (userRes.ok) {
              const userData = await userRes.json();
              if (userData.ok && userData.user) {
                userName = userData.user.real_name || userData.user.name;
              }
            }

            messages.push({
              id: `${channel.id}-${msg.ts}`,
              source: "slack",
              from: userName,
              subject: `Message from #${channel.name}`,
              body: msg.text || "",
              snippet: (msg.text || "").substring(0, 100),
              receivedAt: new Date(parseInt(msg.ts.split(".")[0]) * 1000).toISOString(),
              channelName: channel.name,
              isRead: false,
              isArchived: false,
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching messages from channel ${channel.id}:`, error);
        continue;
      }
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching Slack messages:", error);
    return NextResponse.json([], { status: 200 });
  }
}
