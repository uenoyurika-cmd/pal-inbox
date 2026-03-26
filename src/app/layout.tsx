import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pal Inbox - Gmail & Slack を一括管理",
  description:
    "未読メール・Slack通知をAIで優先順位付け＆返信ドラフト生成するタスク管理ツール",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full" style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>{children}</body>
    </html>
  );
}
