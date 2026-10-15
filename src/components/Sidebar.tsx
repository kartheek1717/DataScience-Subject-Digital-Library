import React, { useEffect } from 'react';
import { useLab, NavTab } from '../context/LabContext';
import { 
  Home, 
  Layers, 
  FlaskConical, 
  FolderKanban,
  FileUser,
  Wrench, 
  Settings, 
  X 
} from 'lucide-react';
import { DataScienceLogo } from './DataScienceLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentTab, setCurrentTab, setExperimentViewMode } = useLab();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'modules', label: 'Modules', icon: Layers },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'profile', label: 'Profile', icon: FileUser },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Full-screen Backdrop for all devices when opened */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer (Closed by default all the time, opens only on button click) */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 z-50 h-[100dvh] w-72 max-w-[85vw]
          bg-white dark:bg-[#07141F] border-r border-[#E3EDF2] dark:border-slate-800
          shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Navigation Sidebar"
      >
        {/* Drawer Header with Logo & Close Button */}
        <div className="flex items-center justify-between p-4.5 border-b border-[#E3EDF2] dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0B2538] via-[#009F9A] to-[#14B8A6] flex items-center justify-center text-white shadow-xs">
              <DataScienceLogo className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#0B2538] dark:text-white block">
                Data Science
              </span>
              <span className="text-[10px] text-slate-500 font-medium block -mt-0.5">
                Subject Digital Library
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Navigation"
            title="Close menu (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items List (No "PLATFORM MENU" text heading) */}
        <div className="p-4 space-y-1.5 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id || (item.id === 'profile' && currentTab === 'resume');

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'experiments') {
                    setExperimentViewMode('dashboard');
                  }
                  setCurrentTab(item.id);
                  onClose();
                }}
                className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-[#E3EDF2] dark:border-slate-800 text-[11px] text-slate-400 font-mono text-center bg-slate-50/50 dark:bg-slate-900/40">
          Mohan Babu University • B.Tech DS
        </div>
      </aside>
    </>
  );
};
