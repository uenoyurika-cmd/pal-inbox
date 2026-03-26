"use client";

import React from 'react';
import { Mail, Archive, BarChart3, Settings, LogOut } from 'lucide-react';
import { PalIcon } from '@/components/pal/PalIcon';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type TabType = 'inbox' | 'archived' | 'stats';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  userEmail = 'user@example.com',
  onLogout,
}) => {
  const router = useRouter();

  const isActive = (tab: TabType) => activeTab === tab;
  const getActiveClasses = (tab: TabType) =>
    isActive(tab)
      ? 'text-accent-purple bg-white bg-opacity-30'
      : 'text-text-secondary hover:text-text-primary';

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      if (onLogout) {
        onLogout();
      }
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitial = (email: string): string => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="glass-sidebar w-64 h-screen flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center gap-3 p-6 border-b border-glass-border">
        <PalIcon variant="sitting" size={32} className="text-accent-purple" />
        <h1 className="text-xl font-bold text-text-primary">Pal Inbox</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {/* Inbox */}
          <button
            onClick={() => onTabChange('inbox')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${getActiveClasses('inbox')}`}
          >
            <PalIcon variant="sitting" size={20} />
            <span className="font-medium">Inbox</span>
          </button>

          {/* Archived */}
          <button
            onClick={() => onTabChange('archived')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${getActiveClasses('archived')}`}
          >
            <Archive size={20} />
            <span className="font-medium">Archived</span>
          </button>

          {/* Stats */}
          <button
            onClick={() => onTabChange('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${getActiveClasses('stats')}`}
          >
            <BarChart3 size={20} />
            <span className="font-medium">Stats</span>
          </button>

          {/* Settings */}
          <Link
            href="/settings"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-text-secondary hover:text-text-primary`}
          >
            <Settings size={20} />
            <span className="font-medium">設定</span>
          </Link>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-glass-border space-y-3">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-accent-purple bg-opacity-20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-accent-purple">
              {getInitial(userEmail)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {userEmail}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white hover:bg-opacity-10 transition-all text-sm"
        >
          <LogOut size={16} />
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
