import React from 'react';
import { useLab } from '../context/LabContext';

export const QuickAccess: React.FC = () => {
  const { setCurrentTab, setSelectedExpId, setSelectedSubExpId } = useLab();

  const items = [
    {
      id: 'experiments',
      title: '🧪 Experiments',
      desc: 'Interactive lab modules & code',
      bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-[#009F9A]/40',
      badgeBg: 'bg-[#DFF8F7] text-[#009F9A] dark:bg-[#009F9A]/20 dark:text-[#14B8A6]',
      action: () => {
        setSelectedExpId('exp-1');
        setSelectedSubExpId('1a');
        setCurrentTab('experiments');
      }
    },
    {
      id: 'modules',
      title: '📚 Modules',
      desc: 'Comprehensive syllabus & tasks',
      bg: 'hover:bg-cyan-50 dark:hover:bg-cyan-950/20 hover:border-cyan-400',
      badgeBg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300',
      action: () => setCurrentTab('modules')
    },
    {
      id: 'tools',
      title: '🛠️ Tools',
      desc: 'Interactive sandboxes & toolchains',
      bg: 'hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-400',
      badgeBg: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
      action: () => setCurrentTab('tools')
    },
    {
      id: 'profile',
      title: '👤 Profile',
      desc: 'Academic profile & credentials',
      bg: 'hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-400',
      badgeBg: 'bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
      action: () => setCurrentTab('profile')
    },
    {
      id: 'settings',
      title: '⚙️ Settings',
      desc: 'Lab preferences & appearance',
      bg: 'hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-400',
      badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
      action: () => setCurrentTab('settings')
    }
  ];

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl border border-[#E3EDF2] dark:border-slate-800 shadow-xs relative overflow-hidden">
      {/* Background soft ambient highlight */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-l from-[#DFF8F7]/20 via-transparent to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#009F9A] animate-pulse" />
          <h3 className="text-sm font-extrabold tracking-tight text-[#122333] dark:text-white uppercase font-mono">
            Quick Hub Access
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-mono">Instant Lab Routes</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 relative z-10">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`p-4 rounded-xl border border-gray-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 text-left transition-all duration-200 group flex flex-col justify-between hover:scale-[1.02] hover:shadow-md ${item.bg}`}
          >
            <div className="font-bold text-sm text-[#122333] dark:text-white group-hover:text-[#009F9A] transition-colors">
              {item.title}
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-1">
              {item.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
