"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RotateCcw } from "lucide-react";
import { PalIcon } from "@/components/pal/PalIcon";
import { useStore } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

type ToneType = "casual" | "business" | "formal";

const toneLabels: Record<ToneType, string> = {
  casual: "カジュアル",
  business: "ビジネス",
  formal: "フォーマル",
};

export const PreviewPanel: React.FC = () => {
  const selectedMessageId = useStore((state) => state.selectedMessageId);
  const messages = useStore((state) => state.messages);
  const draft = useStore((state) => state.draft);
  const isDraftLoading = useStore((state) => state.isDraftLoading);
  const generateDraft = useStore((state) => state.generateDraft);
  const setDraft = useStore((state) => state.setDraft);

  const [selectedTone, setSelectedTone] = useState<ToneType>("business");
  const [copyFeedback, setCopyFeedback] = useState(false);

  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  useEffect(() => {
    if (selectedMessageId) {
      setDraft(null);
      generateDraft(selectedMessageId);
    }
  }, [selectedMessageId, generateDraft, setDraft]);

  const handleCopyDraft = () => {
    if (draft) {
      navigator.clipboard.writeText(draft);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const handleRegenerate = () => {
    if (selectedMessageId) {
      generateDraft(selectedMessageId);
    }
  };

  if (!selectedMessage) {
    return (
      <div className="glass-card h-full flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <PalIcon
            variant="sitting"
            size={64}
            className="text-purple-500 mb-4 mx-auto"
          />
          <p className="text-gray-600 text-lg">メッセージを選んでね</p>
        </motion.div>
      </div>
    );
  }

  const relativeTime = formatDistanceToNow(
    new Date(selectedMessage.receivedAt),
    {
      addSuffix: true,
      locale: ja,
    }
  );

  const sourceColor =
    selectedMessage.source === "gmail"
      ? "bg-red-100 text-red-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="glass-card h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/20 p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="font-bold text-gray-900 mb-1">
              {selectedMessage.from}
            </h2>
            <p className="text-sm text-gray-500">{relativeTime}</p>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${sourceColor}`}
          >
            {selectedMessage.source === "gmail" ? "Gmail" : "Slack"}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900">
          {selectedMessage.subject || selectedMessage.channelName}
        </h3>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 text-gray-700">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {selectedMessage.body || selectedMessage.snippet}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20" />

      {/* AI Draft Section */}
      <div className="p-6 border-t border-white/20">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>AI返信ドラフト</span>
        </h4>

        <AnimatePresence mode="wait">
          {isDraftLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <PalIcon
                variant="thinking"
                size={40}
                className="text-purple-500"
              />
              <p className="text-gray-600">パルが返信を考え中...</p>
            </motion.div>
          ) : draft ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <PalIcon
                  variant="suggesting"
                  size={24}
                  className="text-purple-500"
                />
              </div>

              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full h-32 p-3 rounded-lg border border-white/30 bg-white/30 text-gray-900 text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Tone Selector */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2 font-medium">トーン:</p>
                <div className="flex gap-2">
                  {(["casual", "business", "formal"] as const).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                        selectedTone === tone
                          ? "bg-purple-500 text-white"
                          : "bg-white/30 text-gray-700 hover:bg-white/50"
                      }`}
                    >
                      {toneLabels[tone]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRegenerate}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 font-medium text-sm transition-colors"
                >
                  <RotateCcw size={16} />
                  再生成
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyDraft}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    copyFeedback
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-500 text-white hover:bg-purple-600"
                  }`}
                >
                  <Copy size={16} />
                  {copyFeedback ? "コピーしました" : "コピー"}
                </motion.button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};
