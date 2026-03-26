import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { UnifiedMessage } from "@/lib/types";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json([], { status: 200 });
    }

    const googleToken = session.googleAccessToken;
    const userEmail =
      session.settings?.userEmail || session.userEmail || "uenoyurika@basicinc.jp";

    if (!googleToken) {
      // No Google token - return empty (user needs to configure Google OAuth)
      return NextResponse.json([], { status: 200 });
    }

    // List messages to the user's email and is:unread
    const listRes = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=to:${encodeURIComponent(userEmail)}%20is:unread&maxResults=20`,
      {
        headers: {
          Authorization: `Bearer ${googleToken}`,
        },
      }
    );

    if (!listRes.ok) {
      console.error("Gmail list error:", listRes.status);
      return NextResponse.json([], { status: 200 });
    }

    const listData = await listRes.json();
    const messageIds =
      listData.messages?.map((m: { id: string }) => m.id) || [];

    if (messageIds.length === 0) {
      return NextResponse.json([]);
    }

    const messages: UnifiedMessage[] = [];
    const batchSize = 20;

    for (let i = 0; i < messageIds.length; i += batchSize) {
      const batch = messageIds.slice(i, i + batchSize);

      const detailPromises = batch.map((id: string) =>
        fetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${id}`,
          {
            headers: {
              Authorization: `Bearer ${googleToken}`,
            },
          }
        )
      );

      const detailResponses = await Promise.all(detailPromises);

      for (const res of detailResponses) {
        if (!res.ok) continue;

        const message = await res.json();
        const headers: { name: string; value: string }[] =
          message.payload?.headers || [];

        const getHeader = (name: string) =>
          headers.find((h) => h.name === name)?.value || "";

        const fromEmail =
          getHeader("From").match(/<(.+?)>/)?.[1] || getHeader("From");
        const from = getHeader("From").split("<")[0].trim();

        const body = message.payload?.parts?.find(
          (p: { mimeType: string }) => p.mimeType === "text/plain"
        )?.body?.data
          ? Buffer.from(
              message.payload.parts.find(
                (p: { mimeType: string }) => p.mimeType === "text/plain"
              ).body.data,
              "base64"
            ).toString()
          : message.payload?.body?.data
            ? Buffer.from(message.payload.body.data, "base64").toString()
            : "";

        const snippet = message.snippet || body.substring(0, 100);

        messages.push({
          id: message.id,
          source: "gmail",
          from,
          fromEmail,
          subject: getHeader("Subject"),
          body,
          snippet,
          receivedAt: new Date(
            parseInt(message.internalDate)
          ).toISOString(),
          threadId: message.threadId,
          isRead: !message.labelIds?.includes("UNREAD"),
          isArchived: false,
        });
      }
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching Gmail messages:", error);
    return NextResponse.json([], { status: 200 });
  }
}
