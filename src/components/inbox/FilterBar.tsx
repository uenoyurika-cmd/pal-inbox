"use client";

import React from "react";
import { Mail, Hash } from "lucide-react";
import { useStore } from "@/lib/store";

export const FilterBar: React.FC = () => {
  const filter = useStore((state) => state.filter);
  const setFilter = useStore((state) => state.setFilter);

  const filters = [
    { id: "all" as const, label: "All", icon: null },
    { id: "gmail" as const, label: "Gmail", icon: Mail },
    { id: "slack" as const, label: "Slack", icon: Hash },
  ];

  return (
    <div className="glass-card-sm p-3 flex gap-2 mb-4">
      {filters.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setFilter(id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            filter === id
              ? "bg-purple-500 text-white shadow-lg"
              : "text-gray-600 hover:bg-white/50"
          }`}
        >
          {Icon && <Icon size={18} />}
          {label}
        </button>
      ))}
    </div>
  );
};
