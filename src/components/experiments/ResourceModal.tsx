import React, { useState, useEffect } from 'react';
import { X, Check, FileText, Database, Code, BookOpen, Link as LinkIcon, FileCode } from 'lucide-react';
import { ExperimentResource } from '../../types';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceToEdit?: ExperimentResource | null;
  onSave: (resource: ExperimentResource) => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  resourceToEdit,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<string>('dataset');
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'enrolled' | 'hidden'>('public');

  useEffect(() => {
    if (resourceToEdit) {
      setTitle(resourceToEdit.title || '');
      setType(resourceToEdit.type || 'dataset');
      setUrl(resourceToEdit.url || '');
      setFilename(resourceToEdit.filename || '');
      setDescription(resourceToEdit.description || '');
      setVisibility(resourceToEdit.visibility || 'public');
    } else {
      setTitle('');
      setType('dataset');
      setUrl('');
      setFilename('');
      setDescription('');
      setVisibility('public');
    }
  }, [resourceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: resourceToEdit?.id,
      title: title.trim(),
      type,
      url: url.trim() || undefined,
      filename: filename.trim() || undefined,
      description: description.trim() || undefined,
      visibility,
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
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {resourceToEdit ? 'Edit Experiment Resource' : 'Add New Resource'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide student reference materials, datasets, or links.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Resource Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. housing_missing_data.csv, Pandas Cheat Sheet"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Resource Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="dataset">Dataset (.csv / .json)</option>
                <option value="python">Python Script (.py)</option>
                <option value="notebook">Jupyter Notebook (.ipynb)</option>
                <option value="pdf">Documentation / PDF</option>
                <option value="github">GitHub Repository</option>
                <option value="link">External Web Link</option>
                <option value="other">Other Reference</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Student Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="public">Public (All students)</option>
                <option value="enrolled">Enrolled Cohort Only</option>
                <option value="hidden">Hidden / Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              URL or Download Endpoint
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://raw.githubusercontent.com/... or /datasets/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Filename (optional)
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="e.g. data_cleaning_template.py"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description (optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief note on how to use this resource in the lab..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
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
              <Check className="w-4 h-4" />
              {resourceToEdit ? 'Save Resource' : 'Add Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
