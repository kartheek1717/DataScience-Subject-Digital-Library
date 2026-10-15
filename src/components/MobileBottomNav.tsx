import React from 'react';
import { useLab, NavTab } from '../context/LabContext';
import { 
  Home, 
  Layers, 
  FlaskConical, 
  FolderKanban, 
  FileUser, 
  Menu 
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenDrawer }) => {
  const { currentTab, setCurrentTab, setExperimentViewMode } = useLab();

  const navItems: { id: NavTab | 'more'; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'modules', label: 'Modules', icon: Layers },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'profile', label: 'Profile', icon: FileUser },
    { id: 'more', label: 'Menu', icon: Menu },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#07141F]/95 backdrop-blur-xl border-t border-[#E3EDF2]/90 dark:border-slate-800/90 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.5)] transition-all select-none"
    >
      <div className="flex items-center justify-around h-16 px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id !== 'more' && (
            currentTab === item.id || 
            (item.id === 'profile' && currentTab === 'resume')
          );

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'more') {
                  onOpenDrawer();
                } else {
                  if (item.id === 'experiments') {
                    setExperimentViewMode('dashboard');
                  }
                  setCurrentTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-all cursor-pointer relative min-h-[48px] touch-manipulation ${
                isActive
                  ? 'text-[#009F9A] dark:text-cyan-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              aria-label={item.label}
              title={item.label}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-full bg-[#009F9A] dark:bg-cyan-400 shadow-sm" />
              )}
              <div className={`p-1 rounded-xl transition-all ${
                isActive 
                  ? 'bg-teal-50 dark:bg-teal-950/60 scale-105' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}>
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-full ${
                isActive ? 'font-extrabold text-[#009F9A] dark:text-cyan-400' : 'font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
