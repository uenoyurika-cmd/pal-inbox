import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UnifiedMessage } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json([], { status: 200 });
    }

    // List messages to uenoyurika@basicinc.jp and is:unread
    const listRes = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=to:uenoyurika@basicinc.jp%20is:unread&maxResults=20`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!listRes.ok) {
      console.error("Gmail list error:", listRes.status);
      return NextResponse.json([], { status: 200 });
    }

    const listData = await listRes.json();
    const messageIds = listData.messages?.map((m: any) => m.id) || [];

    if (messageIds.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch message details in batches
    const messages: UnifiedMessage[] = [];
    const batchSize = 20;

    for (let i = 0; i < messageIds.length; i += batchSize) {
      const batch = messageIds.slice(i, i + batchSize);

      const detailPromises = batch.map((id: string) =>
        fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })
      );

      const detailResponses = await Promise.all(detailPromises);

      for (const res of detailResponses) {
        if (!res.ok) continue;

        const message = await res.json();
        const headers = message.payload?.headers || [];

        const getHeader = (name: string) =>
          headers.find((h: any) => h.name === name)?.value || "";

        const fromEmail = getHeader("From").match(/<(.+?)>/)?.[1] || getHeader("From");
        const from = getHeader("From").split("<")[0].trim();

        const body = message.payload?.parts?.find((p: any) => p.mimeType === "text/plain")?.body
          ?.data
          ? Buffer.from(
              message.payload.parts.find((p: any) => p.mimeType === "text/plain").body.data,
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
          receivedAt: new Date(parseInt(message.internalDate)).toISOString(),
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
