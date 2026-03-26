"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PalIcon } from "@/components/pal/PalIcon";
import { useStore } from "@/lib/store";

const generateHourlyData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: hour.getHours().toString().padStart(2, "0") + ":00",
      count: Math.floor(Math.random() * 5),
    });
  }
  return data;
};

export const PerformanceChart: React.FC = () => {
  const archivedToday = useStore((state) => state.archivedToday);
  const [chartData] = React.useState(generateHourlyData());

  const totalCount = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">
            Today's Performance
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {archivedToday || totalCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            メッセージ処理済み
          </p>
        </div>
        <PalIcon
          variant="sitting"
          size={48}
          className="text-purple-500/30"
        />
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="colorCount"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#C084FC" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#D8B4FE" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="time"
              stroke="rgba(107, 114, 128, 0.5)"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#9CA3AF" }}
            />
            <YAxis
              stroke="rgba(107, 114, 128, 0.5)"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#9CA3AF" }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#1A1A2E" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8B5CF6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
