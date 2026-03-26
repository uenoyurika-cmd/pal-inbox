"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PalIcon } from "@/components/pal/PalIcon";
import { ArrowLeft, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface Settings {
  openaiApiKey: string;
  slackBotToken: string;
  slackUserId: string;
  userEmail: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    openaiApiKey: "",
    slackBotToken: "",
    slackUserId: "U06NTAMKRF1",
    userEmail: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to load settings");
      }
      const data = await response.json();
      setSettings({
        openaiApiKey: data.openaiApiKey || "",
        slackBotToken: data.slackBotToken || "",
        slackUserId: data.slackUserId || "U06NTAMKRF1",
        userEmail: data.userEmail || "",
      });

      // Check Google connection status
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      setIsGoogleConnected(!!meData.isGoogleConnected);
    } catch (error) {
      console.error("Error loading settings:", error);
      showToast("設定の読み込みに失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          openaiApiKey: settings.openaiApiKey || undefined,
          slackBotToken: settings.slackBotToken || undefined,
          slackUserId: settings.slackUserId,
          userEmail: settings.userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      showToast("設定を保存しました", "success");
      setTimeout(() => {
        loadSettings();
      }, 500);
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast("設定の保存に失敗しました", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleGoogleReconnect = () => {
    signIn("google", { callbackUrl: "/api/auth/sync?redirect=/settings" });
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <PalIcon
            variant="tilting"
            size={64}
            className="text-purple-500"
          />
          <p className="text-gray-600">読み込み中...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card p-12 max-w-md w-full"
      >
        {/* Pal Character */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="mb-6 flex justify-center"
        >
          <PalIcon
            variant="sitting"
            size={96}
            className="text-purple-500"
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">設定</h1>
          <p className="text-gray-500 text-sm">
            APIキーを設定して、パルを活性化させよう
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4 mb-8"
        >
          {/* Google Connection Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gmail 接続
            </label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/30 backdrop-blur-md border border-white/50">
              {isGoogleConnected ? (
                <>
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                  <span className="text-sm text-green-700 flex-1">
                    Google アカウント接続済み
                  </span>
                  <button
                    onClick={handleGoogleReconnect}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="再接続"
                  >
                    <RefreshCw size={16} />
                  </button>
                </>
              ) : (
                <>
                  <XCircle size={18} className="text-orange-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 flex-1">
                    未接続
                  </span>
                  <button
                    onClick={handleGoogleReconnect}
                    className="text-xs px-3 py-1 rounded-lg bg-accent-purple text-white hover:bg-purple-600 transition-colors"
                  >
                    接続する
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {isGoogleConnected
                ? "Gmail API にアクセスできます"
                : "Google ログインで Gmail を読み取れるようになります"}
            </p>
          </div>

          {/* OpenAI API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              placeholder="sk-..."
              value={settings.openaiApiKey}
              onChange={(e) =>
                handleInputChange("openaiApiKey", e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl bg-white/30 backdrop-blur-md border border-white/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Slack Bot Token */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slack Bot Token
            </label>
            <input
              type="password"
              placeholder="xoxb-..."
              value={settings.slackBotToken}
              onChange={(e) =>
                handleInputChange("slackBotToken", e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl bg-white/30 backdrop-blur-md border border-white/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Slack User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slack User ID
            </label>
            <input
              type="text"
              value={settings.slackUserId}
              onChange={(e) =>
                handleInputChange("slackUserId", e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl bg-white/30 backdrop-blur-md border border-white/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Gmail Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gmail Address
            </label>
            <input
              type="text"
              value={settings.userEmail}
              disabled
              className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/50 text-gray-600 cursor-not-allowed opacity-60 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">
              Google ログイン情報から自動入力
            </p>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full px-6 py-3 rounded-xl bg-accent-purple text-white font-medium transition-all hover:bg-purple-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mb-6"
        >
          {saving ? "保存中..." : "保存"}
        </motion.button>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Inboxに戻る
          </Link>
        </motion.div>
      </motion.div>

      {/* Toast Message */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl text-white font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-green-500/80 backdrop-blur-md"
              : "bg-red-500/80 backdrop-blur-md"
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
}
