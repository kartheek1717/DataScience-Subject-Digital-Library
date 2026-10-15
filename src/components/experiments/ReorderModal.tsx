import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, X, Check, GripVertical } from 'lucide-react';
import { Experiment } from '../../types';

interface ReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiments: Experiment[];
  onSave: (reordered: Experiment[]) => void;
}

export const ReorderModal: React.FC<ReorderModalProps> = ({
  isOpen,
  onClose,
  experiments,
  onSave,
}) => {
  const [items, setItems] = useState<Experiment[]>([]);

  useEffect(() => {
    if (experiments) {
      setItems([...experiments]);
    }
  }, [experiments, isOpen]);

  if (!isOpen) return null;

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    setItems(newItems);
  };

  const handleSave = () => {
    onSave(items);
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
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden relative flex flex-col max-h-[85vh]"
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
            <ArrowUpDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reorder Curriculum Experiments
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adjust sequence. Numbering will update automatically upon saving.
            </p>
          </div>
        </div>

        <div className="overflow-y-auto space-y-2.5 pr-1 my-2 flex-1">
          {items.map((exp, idx) => (
            <div
              key={exp.id}
              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl transition-all"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs shrink-0">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {exp.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{exp.technology}</span>
                  <span>•</span>
                  <span>{exp.subExperiments?.length || 0} Parts</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="Move Up"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'down')}
                  disabled={idx === items.length - 1}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="Move Down"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
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
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] font-semibold text-sm text-white shadow-sm transition-all min-h-[44px] flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Apply New Order
          </button>
        </div>
      </div>
    </div>
  );
};
