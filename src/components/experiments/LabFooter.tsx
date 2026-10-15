import React from 'react';
import { GraduationCap, BookOpen, ShieldCheck, Cpu } from 'lucide-react';

export const LabFooter: React.FC = () => {
  return (
    <footer className="mt-16 pt-8 pb-12 border-t border-[#E3EDF2] dark:border-slate-800/80 text-xs text-gray-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: University & Lab Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 text-center sm:text-left">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-gray-800 dark:text-slate-200 text-sm tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <span>Mohan Babu University</span>
              <span className="text-gray-300 dark:text-slate-700">•</span>
              <span className="text-[#009F9A] dark:text-cyan-400 font-semibold">Data Science Laboratory</span>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span>Course Code: <strong className="font-mono text-gray-700 dark:text-slate-300">22DS102006</strong></span>
              <span>•</span>
              <span>Academic Year: <strong className="font-medium text-gray-700 dark:text-slate-300">2025–2026</strong></span>
              <span>•</span>
              <span>Curriculum: Autonomous B.Tech Regulation</span>
            </div>
          </div>
        </div>

        {/* Right: Environment & Verification Badges */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 font-mono text-[11px]">
            <Cpu className="w-3 h-3 text-[#009F9A]" />
            <span>Python 3.10 Engine</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium text-[11px]">
            <ShieldCheck className="w-3 h-3" />
            <span>Syllabus Verified</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
