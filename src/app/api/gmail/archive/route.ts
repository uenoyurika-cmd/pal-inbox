import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = await request.json();

    if (!messageId) {
      return NextResponse.json({ error: "messageId required" }, { status: 400 });
    }

    // Modify the message to remove UNREAD and add ARCHIVED labels
    const modifyRes = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          removeLabelIds: ["UNREAD"],
          addLabelIds: ["ARCHIVED"],
        }),
      }
    );

    if (!modifyRes.ok) {
      console.error("Gmail modify error:", modifyRes.status);
      return NextResponse.json({ error: "Failed to archive message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error archiving Gmail message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
