import React, { useState } from 'react';
import { Experiment } from '../types';
import { useLab } from '../context/LabContext';
import { 
  FolderGit2, 
  ExternalLink, 
  MoreVertical, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Copy, 
  Trash2,
  Layers
} from 'lucide-react';

interface ExperimentCardProps {
  experiment: Experiment;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  layout?: 'grid' | 'list';
}

export const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment,
  isSelected,
  onSelect,
  onEdit,
  layout = 'grid',
}) => {
  const { deleteExperiment, duplicateExperiment } = useLab();
  const [showMenu, setShowMenu] = useState(false);

  if (layout === 'list') {
    return (
      <div 
        onClick={onSelect}
        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group ${
          isSelected 
            ? 'bg-[#DFF8F7]/30 dark:bg-[#009F9A]/10 border-[#009F9A] shadow-md shadow-[#009F9A]/10' 
            : 'bg-white dark:bg-[#0D1E2A] border-[#E3EDF2] dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <img
            src={experiment.thumbnail}
            alt={experiment.title}
            className="w-14 h-14 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#009F9A]/10 text-[#009F9A] dark:text-[#14B8A6]">
                EXP {experiment.number}
              </span>
              <span className="text-xs text-gray-500 font-medium">{experiment.technology}</span>
            </div>
            <h4 className="text-sm font-bold text-[#0B2538] dark:text-white truncate group-hover:text-[#009F9A] transition-colors">
              {experiment.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate max-w-md">
              {experiment.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-[#009F9A]">{experiment.progress}%</span>
            <div className="w-16 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-[#009F9A] rounded-full" style={{ width: `${experiment.progress}%` }} />
            </div>
          </div>

          {experiment.githubUrl ? (
            <a
              href={experiment.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="View on GitHub"
            >
              <FolderGit2 className="w-4 h-4" />
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between group ${
        isSelected
          ? 'bg-[#DFF8F7]/20 dark:bg-[#009F9A]/10 border-[#009F9A] shadow-lg shadow-[#009F9A]/15 scale-[1.01]'
          : 'bg-white dark:bg-[#0D1E2A] border-[#E3EDF2] dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 shadow-xs hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      {/* Top Image Section with Thumbnail and Category Badge */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={experiment.thumbnail}
          alt={experiment.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm">
            {experiment.category}
          </span>
        </div>

        {/* Top-Right: Three-Dot Menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#0D1E2A] rounded-xl shadow-xl border border-[#E3EDF2] dark:border-slate-800 py-1 z-30 animate-in fade-in"
              >
                {onEdit && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit();
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

        {/* Experiment Number Label on Image */}
        <div className="absolute bottom-2.5 left-3 text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#009F9A]" />
          exp {experiment.number}
        </div>
      </div>

      {/* Body Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold text-[#009F9A] dark:text-[#14B8A6] mb-1">
            {experiment.technology}
          </div>
          <h4 className="font-bold text-sm text-[#0B2538] dark:text-white line-clamp-1 group-hover:text-[#009F9A] transition-colors mb-1.5">
            {experiment.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {experiment.description}
          </p>
        </div>

        {/* Sub-experiments count & progress */}
        <div className="mt-4 pt-3 border-t border-[#E3EDF2] dark:border-slate-800 flex items-center justify-between text-xs">
          {experiment.githubUrl ? (
            <a
              href={experiment.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1.5 transition-colors font-medium group/link"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-gray-400 group-hover/link:text-[#009F9A]" />
              <span>View on GitHub</span>
              <ExternalLink className="w-3 h-3 text-gray-400 group-hover/link:text-[#009F9A] group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          ) : (
            <span className="text-gray-400 text-[11px] flex items-center gap-1 font-mono">
              <FolderGit2 className="w-3.5 h-3.5 opacity-40" />
              <span>No repo linked</span>
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">
              {experiment.progress}%
            </span>
            <div className="w-10 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#009F9A] rounded-full" 
                style={{ width: `${experiment.progress}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
