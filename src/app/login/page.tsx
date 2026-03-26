"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PalIcon } from "@/components/pal/PalIcon";
import { Mail, Hash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("uenoyurika@basicinc.jp");
  const [loggingIn, setLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    setLoggingIn(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: "Demo User",
          image: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("ログインに失敗しました");
      setLoggingIn(false);
    }
  };

  const handleSlackLogin = () => {
    window.location.href = "/api/auth/signin/slack";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card p-12 max-w-md w-full text-center"
      >
        {/* Pal Character */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="mb-6"
        >
          <PalIcon
            variant="tilting"
            size={96}
            className="text-purple-500 mx-auto"
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pal Inbox</h1>
          <p className="text-gray-500 mb-8">一緒に片付けよう！</p>
        </motion.div>

        {/* Email Input (conditional) */}
        {showEmailInput && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              className="w-full px-4 py-3 rounded-xl bg-white/30 backdrop-blur-md border border-white/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <button
              onClick={() => setShowEmailInput(false)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              キャンセル
            </button>
          </motion.div>
        )}

        {/* Login Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <button
            onClick={() => setShowEmailInput(!showEmailInput)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/30 text-gray-700 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mail size={20} className="text-red-500" />
            {showEmailInput ? "ログイン" : "Googleアカウントで始める"}
          </button>

          {showEmailInput && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleGoogleLogin}
              disabled={loggingIn}
              className="w-full px-6 py-3 rounded-xl bg-accent-purple text-white font-medium transition-all hover:bg-purple-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loggingIn ? "ログイン中..." : "パルを開始"}
            </motion.button>
          )}

          <button
            onClick={handleSlackLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/30 text-gray-700 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Hash size={20} className="text-purple-500" />
            Slackアカウントで始める
          </button>
        </motion.div>

        {/* Demo Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xs text-gray-400 mt-8"
        >
          ※ デモモード: メールアドレスを入力してログインできます
        </motion.p>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-gray-400 mt-2"
        >
          Gmail と Slack の未読をAIが整理してくれます
        </motion.p>
      </motion.div>
    </div>
  );
}
