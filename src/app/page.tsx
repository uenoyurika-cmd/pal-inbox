"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { TaskList } from "@/components/inbox/TaskList";
import { PreviewPanel } from "@/components/inbox/PreviewPanel";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { PalIcon } from "@/components/pal/PalIcon";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

const tabTitles: Record<string, string> = {
  inbox: "Inbox",
  archived: "Archived",
  stats: "Performance",
};

interface SessionUser {
  isLoggedIn: boolean;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  isConfigured?: boolean;
}

export default function Home() {
  const router = useRouter();
  const activeTab = useStore((state) => state.activeTab);
  const setActiveTab = useStore((state) => state.setActiveTab);
  const fetchMessages = useStore((state) => state.fetchMessages);
  const [session, setSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (!data.isLoggedIn) {
          router.push("/login");
          return;
        }

        setSession(data);
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    if (session) {
      fetchMessages();
    }
  }, [fetchMessages, session]);

  const handleRefresh = () => {
    fetchMessages();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <PalIcon variant="tilting" size={64} className="text-purple-500 mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userEmail={session.userEmail}
        userName={session.userName}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          title={tabTitles[activeTab]}
          onRefresh={handleRefresh}
          isConfigured={session.isConfigured}
        />

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          {activeTab === "inbox" && (
            <>
              {/* Task List - Left */}
              <div className="w-[420px] flex-shrink-0 glass-card overflow-hidden flex flex-col">
                <TaskList />
              </div>

              {/* Preview Panel - Right */}
              <div className="flex-1 min-w-0">
                <PreviewPanel />
              </div>
            </>
          )}

          {activeTab === "archived" && (
            <div className="flex-1 glass-card flex flex-col items-center justify-center">
              <PalIcon
                variant="sleeping"
                size={80}
                className="text-purple-400 mb-4"
              />
              <p className="text-gray-500 text-lg">
                アーカイブされたメッセージはここに表示されます
              </p>
              <p className="text-gray-400 text-sm mt-2">
                （API連携後に反映されます）
              </p>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="flex-1">
              <PerformanceChart />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
