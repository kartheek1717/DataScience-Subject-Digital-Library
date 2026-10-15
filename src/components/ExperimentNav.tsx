import React, { useState } from 'react';
import { Experiment, SubExperiment } from '../types';
import { useLab } from '../context/LabContext';
import { 
  ChevronRight, 
  Bookmark, 
  FolderGit2, 
  MoreVertical, 
  ExternalLink, 
  Edit3, 
  Copy, 
  Trash2,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ExperimentNavProps {
  experiment: Experiment;
  activeSubExpId: string;
  onSelectSubExp: (subId: string) => void;
  onEditExperiment?: () => void;
}

export const ExperimentNav: React.FC<ExperimentNavProps> = ({
  experiment,
  activeSubExpId,
  onSelectSubExp,
  onEditExperiment,
}) => {
  const { deleteExperiment, duplicateExperiment, addToast } = useLab();
  const [showMenu, setShowMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="rounded-2xl glass-card border border-[#E3EDF2] dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
      
      {/* Experiment Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#009F9A] bg-[#DFF8F7] dark:bg-[#009F9A]/20 dark:text-[#14B8A6] px-2.5 py-0.5 rounded-full border border-[#009F9A]/20">
              EXP {experiment.number}
            </span>
            <span className="text-xs text-gray-400 font-medium font-mono">{experiment.category}</span>
          </div>

          {/* Three-dot menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Experiment actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-[#0D1E2A] rounded-xl shadow-xl border border-[#E3EDF2] dark:border-slate-800 py-1 z-30 animate-in fade-in">
                {onEditExperiment && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEditExperiment();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-left"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#009F9A]" /> Edit
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    duplicateExperiment(experiment.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-left"
                >
                  <Copy className="w-3.5 h-3.5 text-blue-500" /> Duplicate
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    if (confirm(`Delete experiment "${experiment.title}"?`)) {
                      deleteExperiment(experiment.id);
                    }
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className="font-extrabold text-base text-[#0B2538] dark:text-white mb-1.5">
          {experiment.title}
        </h3>

        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">
          {experiment.description}
        </p>

        {/* Sub-experiments Navigation list */}
        <div className="space-y-1.5 mb-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Sub-experiments ({experiment.subExperiments.length})
          </div>

          {experiment.subExperiments.map((sub) => {
            const isActive = activeSubExpId === sub.id;

            return (
              <button
                key={sub.id}
                onClick={() => onSelectSubExp(sub.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-[#DFF8F7] dark:bg-[#009F9A]/15 border-l-4 border-[#009F9A] text-[#0B2538] dark:text-white font-bold shadow-xs'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-800/60 text-gray-600 dark:text-slate-300 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    isActive
                      ? 'bg-[#009F9A] text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {sub.id}
                  </span>
                  <span className="text-xs truncate">{sub.title}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-[#009F9A] translate-x-0.5' : 'text-gray-300 dark:text-slate-600 group-hover:translate-x-0.5'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer: Progress and GitHub Repo */}
      <div className="pt-3 border-t border-[#E3EDF2] dark:border-slate-800 flex items-center justify-between">
        <a
          href={experiment.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Repository</span>
        </a>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#009F9A]">
            {experiment.progress}%
          </span>
          <div className="w-16 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#009F9A] rounded-full transition-all duration-500" 
              style={{ width: `${experiment.progress}%` }} 
            />
          </div>
        </div>
      </div>

    </div>
  );
};
