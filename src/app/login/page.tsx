"use client";

import React from "react";
import { motion } from "framer-motion";
import { PalIcon } from "@/components/pal/PalIcon";
import { Mail, Hash } from "lucide-react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/signin/google";
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

        {/* Login Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/30 text-gray-700 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mail size={20} className="text-red-500" />
            Googleアカウントで始める
          </button>

          <button
            onClick={handleSlackLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/30 text-gray-700 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Hash size={20} className="text-purple-500" />
            Slackアカウントで始める
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-gray-400 mt-8"
        >
          Gmail と Slack の未読をAIが整理してくれます
        </motion.p>
      </motion.div>
    </div>
  );
}
