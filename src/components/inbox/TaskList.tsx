"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PalIcon } from "@/components/pal/PalIcon";
import { FilterBar } from "./FilterBar";
import { TaskCard } from "./TaskCard";
import { useStore } from "@/lib/store";
import { PawprintEffect } from "./PawprintEffect";

interface TaskListProps {
  onArchiveAnimationComplete?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  onArchiveAnimationComplete,
}) => {
  const messages = useStore((state) => state.messages);
  const filter = useStore((state) => state.filter);
  const selectedMessageId = useStore((state) => state.selectedMessageId);
  const isLoading = useStore((state) => state.isLoading);
  const selectMessage = useStore((state) => state.selectMessage);
  const archiveMessage = useStore((state) => state.archiveMessage);
  const incrementArchived = useStore((state) => state.incrementArchived);

  const [pawprintKey, setPawprintKey] = React.useState(0);

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    if (filter === "gmail") return msg.source === "gmail";
    if (filter === "slack") return msg.source === "slack";
    return true;
  });

  // Sort by priority (high first, then medium, then low)
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = priorityOrder[a.priority || "low"];
    const bPriority = priorityOrder[b.priority || "low"];
    return aPriority - bPriority;
  });

  const handleArchive = (id: string) => {
    archiveMessage(id);
    incrementArchived();
    setPawprintKey((prev) => prev + 1);
    onArchiveAnimationComplete?.();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <FilterBar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PalIcon
              variant="tilting"
              size={64}
              className="text-purple-500 mb-4"
            />
            <p className="text-gray-600 text-lg">メッセージを取得中...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (sortedMessages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <FilterBar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <PalIcon
              variant="jumping"
              size={80}
              className="text-purple-500 mb-4 mx-auto"
            />
            <p className="text-gray-600 text-lg font-medium">
              Perfect! すべて処理しました！
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {sortedMessages.map((message) => (
            <TaskCard
              key={message.id}
              message={message}
              isSelected={selectedMessageId === message.id}
              onSelect={selectMessage}
              onArchive={handleArchive}
            />
          ))}
        </AnimatePresence>
      </div>
      <PawprintEffect key={pawprintKey} />
    </div>
  );
};
