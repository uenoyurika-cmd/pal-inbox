import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { UnifiedMessage } from "@/lib/types";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json([], { status: 200 });
    }

    const botToken = session.settings?.slackBotToken || process.env.SLACK_BOT_TOKEN;
    const slackUserId = session.settings?.slackUserId || "U06NTAMKRF1";

    if (!botToken) {
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

        // Filter messages mentioning the user
        for (const msg of historyData.messages) {
          if (msg.text && msg.text.includes(`<@${slackUserId}>`)) {
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
              receivedAt: new Date(
                parseInt(msg.ts.split(".")[0]) * 1000
              ).toISOString(),
              channelName: channel.name,
              isRead: false,
              isArchived: false,
            });
          }
        }
      } catch (error) {
        console.error(
          `Error fetching messages from channel ${channel.id}:`,
          error
        );
        continue;
      }
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching Slack messages:", error);
    return NextResponse.json([], { status: 200 });
  }
}
