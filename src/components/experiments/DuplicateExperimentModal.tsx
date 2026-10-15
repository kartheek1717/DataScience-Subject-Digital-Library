import React, { useState, useEffect } from 'react';
import { Copy, X, CheckSquare, Square, Info } from 'lucide-react';
import { Experiment, DuplicateOptions } from '../../types';

interface DuplicateExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiment: Experiment | null;
  onConfirm: (options: DuplicateOptions) => void;
}

export const DuplicateExperimentModal: React.FC<DuplicateExperimentModalProps> = ({
  isOpen,
  onClose,
  experiment,
  onConfirm,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeParts, setIncludeParts] = useState(true);
  const [includeCode, setIncludeCode] = useState(true);
  const [includeResources, setIncludeResources] = useState(true);
  const [includeProgress, setIncludeProgress] = useState(false); // Unchecked by default

  useEffect(() => {
    if (experiment) {
      setNewTitle(`${experiment.title} (Copy)`);
      setIncludeDetails(true);
      setIncludeParts(true);
      setIncludeCode(true);
      setIncludeResources(true);
      setIncludeProgress(false);
    }
  }, [experiment, isOpen]);

  if (!isOpen || !experiment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      newTitle: newTitle.trim() || `${experiment.title} (Copy)`,
      includeDetails,
      includeParts,
      includeCode,
      includeResources,
      includeProgress,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Copy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Duplicate Experiment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cloning from Experiment #{experiment.number}: {experiment.title}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              New Experiment Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new experiment title..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-2 pb-1">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select elements to duplicate
            </div>
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-slate-800 dark:text-slate-200">
                  Experiment Overview & Academic Metadata
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={includeParts}
                  onChange={(e) => setIncludeParts(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-slate-800 dark:text-slate-200">
                  Experiment Parts Structure ({experiment.subExperiments?.length || 0} parts)
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={includeCode}
                  onChange={(e) => setIncludeCode(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-slate-800 dark:text-slate-200">
                  Starter Code & Lab Implementations
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={includeResources}
                  onChange={(e) => setIncludeResources(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-slate-800 dark:text-slate-200">
                  Associated Resources & Datasets
                </span>
              </label>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={includeProgress}
                    onChange={(e) => setIncludeProgress(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      Copy Completion / Student Progress State
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Leave unchecked to provide a fresh 0% progress start for the new duplicate.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] font-semibold text-sm text-white shadow-sm transition-all min-h-[44px] flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Create Duplicate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
