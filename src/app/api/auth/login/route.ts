import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { email, name, image } = await request.json();

    const session = await getSession();
    session.isLoggedIn = true;
    session.userName = name;
    session.userEmail = email;
    session.userImage = image;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
