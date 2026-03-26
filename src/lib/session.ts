import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface UserSettings {
  openaiApiKey?: string;
  slackBotToken?: string;
  slackUserId?: string;
  userEmail?: string;
  isConfigured?: boolean;
}

export interface SessionData {
  isLoggedIn: boolean;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  googleAccessToken?: string;
  settings?: UserSettings;
}

const sessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "complex_password_at_least_32_characters_long_for_pal_inbox_app!",
  cookieName: "pal-inbox-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );
  return session;
}
