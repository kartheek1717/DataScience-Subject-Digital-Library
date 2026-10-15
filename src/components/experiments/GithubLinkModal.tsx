import React, { useState, useEffect } from 'react';
import { X, FolderGit2, ExternalLink, Trash2, Check, Link as LinkIcon } from 'lucide-react';

interface GithubLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl?: string;
  experimentTitle?: string;
  onSave: (url: string) => void;
}

export const GithubLinkModal: React.FC<GithubLinkModalProps> = ({
  isOpen,
  onClose,
  currentUrl = '',
  experimentTitle,
  onSave,
}) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrl(currentUrl || '');
      setError('');
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (trimmed && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setError('Please enter a valid URL starting with https://');
      return;
    }
    setError('');
    onSave(trimmed);
    onClose();
  };

  const handleRemove = () => {
    onSave('');
    onClose();
  };

  const isValidUrl = url.trim().startsWith('http://') || url.trim().startsWith('https://');

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
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white flex items-center justify-center">
              <FolderGit2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentUrl ? 'Edit GitHub Repository' : 'Attach GitHub Repository'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {experimentTitle ? `For: ${experimentTitle}` : 'Source code, notebooks, and reference files'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              GitHub Repository URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LinkIcon className="w-4 h-4" />
              </span>
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError('');
                }}
                placeholder="https://github.com/organization/data-science-lab"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                autoFocus
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Clear field"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {error && (
              <p className="text-xs text-rose-500 mt-1.5">{error}</p>
            )}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              Students can view and clone source notebooks, dataset loaders, and sample solution code.
            </p>
          </div>

          {/* Test Link Preview if valid */}
          {isValidUrl && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <FolderGit2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-mono truncate">
                  {url}
                </span>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 shrink-0 ml-2"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <div>
              {currentUrl && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Link</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Repository</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
