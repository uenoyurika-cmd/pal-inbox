"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { PalIcon } from "@/components/pal/PalIcon";
import { UnifiedMessage, Priority } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface TaskCardProps {
  message: UnifiedMessage;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onArchive: (id: string) => void;
}

const getPriorityVariant = (priority?: Priority) => {
  switch (priority) {
    case "high":
      return "alert";
    case "medium":
      return "sitting";
    case "low":
      return "sleeping";
    default:
      return "sitting";
  }
};

const getPriorityColor = (priority?: Priority) => {
  switch (priority) {
    case "high":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-green-500";
    default:
      return "text-gray-400";
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  message,
  isSelected,
  onSelect,
  onArchive,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const relativeTime = formatDistanceToNow(
    new Date(message.receivedAt),
    {
      addSuffix: true,
      locale: ja,
    }
  );

  const sourceColor =
    message.source === "gmail"
      ? "bg-red-100 text-red-700"
      : "bg-blue-100 text-blue-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onClick={() => onSelect(message.id)}
      className={`glass-card-sm p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? "border-2 border-purple-500" : "border border-white/30"
      } ${isHovering ? "scale-[1.02] shadow-lg" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Priority Icon */}
        <div className="pt-1">
          <PalIcon
            variant={getPriorityVariant(message.priority)}
            size={32}
            className={getPriorityColor(message.priority)}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900 truncate">
              {message.from}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${sourceColor}`}>
              {message.source === "gmail" ? "Gmail" : "Slack"}
            </span>
            <span className="text-xs text-gray-500">{relativeTime}</span>
          </div>

          <h3 className="font-semibold text-gray-900 truncate mb-1">
            {message.subject || message.channelName || "No subject"}
          </h3>

          <p className="text-sm text-gray-500 truncate">
            {message.aiSummary || message.snippet}
          </p>
        </div>

        {/* Priority Dot */}
        <div className="pt-1">
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              message.priority === "high"
                ? "bg-red-500"
                : message.priority === "medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
          />
        </div>

        {/* Archive Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onArchive(message.id);
          }}
          className="text-gray-400 hover:text-purple-500 transition-colors"
        >
          <CheckCircle2 size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};
