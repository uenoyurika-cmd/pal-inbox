import React from 'react';
import { Mail, Archive, BarChart3 } from 'lucide-react';
import { PalIcon } from '@/components/pal/PalIcon';

type TabType = 'inbox' | 'archived' | 'stats';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const isActive = (tab: TabType) => activeTab === tab;
  const getActiveClasses = (tab: TabType) => 
    isActive(tab) 
      ? 'text-accent-purple bg-white bg-opacity-30' 
      : 'text-text-secondary hover:text-text-primary';

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
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-glass-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-accent-purple bg-opacity-20 flex items-center justify-center">
            <span className="text-xs font-bold text-accent-purple">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              user@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
