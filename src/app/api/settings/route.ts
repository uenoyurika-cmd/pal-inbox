import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// GET: retrieve current settings (keys are masked)
export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const settings = session.settings || {};

    // Return masked keys for display
    return NextResponse.json({
      openaiApiKey: settings.openaiApiKey
        ? "sk-..." + settings.openaiApiKey.slice(-4)
        : "",
      slackBotToken: settings.slackBotToken
        ? "xoxb-..." + settings.slackBotToken.slice(-4)
        : "",
      slackUserId: settings.slackUserId || "U06NTAMKRF1",
      userEmail: settings.userEmail || session.userEmail || "",
      isConfigured: settings.isConfigured || false,
    });
  } catch (error) {
    console.error("Error getting settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: save settings (keys stored encrypted in cookie)
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await request.json();
    const { openaiApiKey, slackBotToken, slackUserId, userEmail } = body;

    // Update only provided fields (don't overwrite with empty strings)
    const currentSettings = session.settings || {};

    session.settings = {
      openaiApiKey: openaiApiKey || currentSettings.openaiApiKey,
      slackBotToken: slackBotToken || currentSettings.slackBotToken,
      slackUserId: slackUserId || currentSettings.slackUserId || "U06NTAMKRF1",
      userEmail:
        userEmail || currentSettings.userEmail || session.userEmail || "",
      isConfigured: true,
    };

    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
