import React, { useState, useEffect } from 'react';
import { X, Check, Layers, Code, Lightbulb, AlertTriangle, Clock } from 'lucide-react';
import { SubExperiment } from '../../types';

interface PartFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  partToEdit?: SubExperiment | null;
  defaultPartLetter?: string;
  onSave: (part: SubExperiment) => void;
}

export const PartFormModal: React.FC<PartFormModalProps> = ({
  isOpen,
  onClose,
  partToEdit,
  defaultPartLetter = 'A',
  onSave,
}) => {
  const [partLetter, setPartLetter] = useState(defaultPartLetter);
  const [title, setTitle] = useState('');
  const [aim, setAim] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [estimatedTime, setEstimatedTime] = useState('25 mins');
  const [code, setCode] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [watchOutText, setWatchOutText] = useState('');
  const [keyPointsText, setKeyPointsText] = useState('');

  useEffect(() => {
    if (partToEdit) {
      setPartLetter(partToEdit.partLetter || defaultPartLetter);
      setTitle(partToEdit.title || partToEdit.name || '');
      setAim(partToEdit.aim || '');
      setDescription(partToEdit.description || '');
      setDifficulty(partToEdit.difficulty || 'Medium');
      setEstimatedTime(partToEdit.estimatedTime || '25 mins');
      setCode(partToEdit.code || '');
      setSolutionCode(partToEdit.solutionCode || '');
      setWatchOutText(partToEdit.watchOut ? partToEdit.watchOut.join('\n') : '');
      setKeyPointsText(
        partToEdit.keyPoints
          ? partToEdit.keyPoints.map((kp) => `${kp.term}: ${kp.description}`).join('\n')
          : ''
      );
    } else {
      setPartLetter(defaultPartLetter);
      setTitle('');
      setAim('');
      setDescription('');
      setDifficulty('Medium');
      setEstimatedTime('25 mins');
      setCode(`# Practical Lab Implementation\nimport pandas as pd\nimport numpy as np\n\n# Step 1: Initialize dataset\n`);
      setSolutionCode('');
      setWatchOutText('');
      setKeyPointsText('');
    }
  }, [partToEdit, defaultPartLetter, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const watchOut = watchOutText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const keyPoints = keyPointsText
      .split('\n')
      .map((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          return { term: parts[0].trim(), description: parts.slice(1).join(':').trim() };
        }
        return { term: 'Key Concept', description: line.trim() };
      })
      .filter((kp) => kp.description.length > 0);

    const savedPart: SubExperiment = {
      id: partToEdit?.id || `sub-${Date.now()}`,
      partLetter: partLetter.trim() || 'A',
      title: title.trim(),
      name: title.trim(),
      aim: aim.trim(),
      description: description.trim(),
      difficulty,
      estimatedTime: estimatedTime.trim(),
      code: code || '# Write Python code here\n',
      solutionCode: solutionCode.trim() || undefined,
      watchOut: watchOut.length > 0 ? watchOut : undefined,
      keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
      isCompleted: partToEdit?.isCompleted || false,
      output: partToEdit?.output || {
        logs: ['Lab runtime ready. Click Run Code to execute.'],
        plotType: 'none',
      },
      resources: partToEdit?.resources,
    };

    onSave(savedPart);
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
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {partToEdit ? `Edit Part ${partToEdit.partLetter || ''}` : `Add Experiment Part`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure part aim, code workspace, explanation, and pedagogical notes.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 space-y-4 my-2 flex-1">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-3 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Letter / ID *
              </label>
              <input
                type="text"
                value={partLetter}
                onChange={(e) => setPartLetter(e.target.value.toUpperCase())}
                placeholder="A"
                maxLength={4}
                required
                className="w-full text-center font-bold px-2 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="col-span-9 sm:col-span-10">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Part Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Handling Missing Values with np.nan and Masking"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Aim / Objective
            </label>
            <input
              type="text"
              value={aim}
              onChange={(e) => setAim(e.target.value)}
              placeholder="e.g. Identify and impute null values using boolean masking."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Conceptual Overview
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What students will accomplish and why it matters..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Time
              </label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="20 mins"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Starter Python Code *
              </label>
            </div>
            <textarea
              rows={5}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Python code provided to students..."
              className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Key Concepts (One per line: Term: Definition)
            </label>
            <textarea
              rows={2}
              value={keyPointsText}
              onChange={(e) => setKeyPointsText(e.target.value)}
              placeholder="np.nan: IEEE 754 floating point representation for missing values&#10;np.isnan(): Boolean mask selector"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              Common Pitfalls / Watch Out (One per line)
            </label>
            <textarea
              rows={2}
              value={watchOutText}
              onChange={(e) => setWatchOutText(e.target.value)}
              placeholder="np.nan == np.nan evaluates to False! Always use np.isnan() instead.&#10;Integer arrays cannot hold np.nan directly without casting to float."
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
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
              {partToEdit ? 'Save Changes' : 'Add Part'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
