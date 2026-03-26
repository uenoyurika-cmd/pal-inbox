"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PalIcon } from "@/components/pal/PalIcon";
import { Mail } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [loggingIn, setLoggingIn] = useState(false);

  const handleGoogleLogin = () => {
    setLoggingIn(true);
    // NextAuth Google sign-in → after OAuth → redirects to /api/auth/sync → /
    signIn("google", { callbackUrl: "/api/auth/sync" });
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

        {/* Login Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <button
            onClick={handleGoogleLogin}
            disabled={loggingIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/30 text-gray-700 font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loggingIn ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <PalIcon variant="tilting" size={20} className="text-purple-500" />
                </motion.div>
                ログイン中...
              </>
            ) : (
              <>
                <GoogleIcon />
                Googleアカウントでログイン
              </>
            )}
          </button>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Mail size={14} />
            <span>Gmail の未読メッセージを自動取得</span>
          </div>
          <p className="text-xs text-gray-400">
            Slack は設定ページで Bot Token を入力してください
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-gray-400 mt-6"
        >
          Gmail と Slack の未読をAIが整理してくれます
        </motion.p>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
