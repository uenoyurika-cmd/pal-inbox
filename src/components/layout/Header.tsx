"use client";

import React from 'react';
import { RotateCw } from 'lucide-react';

interface HeaderProps {
  title: string;
  onRefresh?: () => void;
  isConfigured?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, onRefresh, isConfigured = false }) => {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-glass-border">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
        {!isConfigured && (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100/60 backdrop-blur-md rounded-full">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-yellow-700">設定が必要</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg hover:bg-white hover:bg-opacity-30 text-text-secondary hover:text-text-primary transition-all"
          aria-label="Refresh"
        >
          <RotateCw size={20} />
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-accent-purple bg-opacity-20 flex items-center justify-center cursor-pointer hover:bg-opacity-30 transition-all">
          <span className="text-sm font-bold text-accent-purple">U</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
