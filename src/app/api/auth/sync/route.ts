import { redirect } from "next/navigation";
import { getToken } from "next-auth/jwt";
import { getSession } from "@/lib/session";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Support custom redirect destination (e.g., /settings)
  const redirectTo =
    request.nextUrl.searchParams.get("redirect") || "/";

  try {
    // Read the NextAuth JWT to get the Google access token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      redirect("/login");
    }

    // Save Google OAuth data into iron-session
    const session = await getSession();
    session.isLoggedIn = true;
    session.userName = token.name || undefined;
    session.userEmail = token.email || undefined;
    session.userImage = (token.picture as string) || undefined;
    session.googleAccessToken = (token.accessToken as string) || undefined;

    // Initialize settings if not exists, set email
    if (!session.settings) {
      session.settings = {};
    }
    session.settings.userEmail = token.email || undefined;

    await session.save();
  } catch (error) {
    console.error("Sync error:", error);
    redirect("/login");
  }

  redirect(redirectTo);
}
