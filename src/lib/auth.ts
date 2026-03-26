import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    slackAccessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    slackAccessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify",
        },
      },
    }),
    {
      id: "slack",
      name: "Slack",
      type: "oauth",
      clientId: process.env.SLACK_CLIENT_ID || "",
      clientSecret: process.env.SLACK_CLIENT_SECRET || "",
      authorization: {
        url: "https://slack.com/oauth/v2/authorize",
        params: {
          scope: "channels:history,channels:read,chat:write,users:read",
        },
      },
      token: "https://slack.com/api/oauth.v2.access",
      userinfo: "https://slack.com/api/auth.test",
      profile(profile: Record<string, string>) {
        return {
          id: profile.user_id,
          name: profile.user,
          email: profile.user,
        };
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        if (account.provider === "google") {
          token.accessToken = account.access_token;
        } else if (account.provider === "slack") {
          token.slackAccessToken = account.access_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.slackAccessToken = token.slackAccessToken;
      return session;
    },
  },
};
