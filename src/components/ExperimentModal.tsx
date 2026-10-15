import React, { useState, useEffect } from 'react';
import { Experiment, SubExperiment } from '../types';
import { useLab } from '../context/LabContext';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';

interface ExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentToEdit?: Experiment | null;
}

export const ExperimentModal: React.FC<ExperimentModalProps> = ({
  isOpen,
  onClose,
  experimentToEdit,
}) => {
  const { addExperiment, updateExperiment, experiments } = useLab();

  const [number, setNumber] = useState<number | string>(experiments.length + 1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Experiment['category']>('Pandas');
  const [technology, setTechnology] = useState('Pandas');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80');

  const [subExperiments, setSubExperiments] = useState<SubExperiment[]>([
    {
      id: `${experiments.length + 1}a`,
      title: 'Initial Module Run',
      description: 'Step 1 of the experiment module.',
      code: `import pandas as pd\nprint("Hello DS LAB")`,
      output: {
        columns: ['Status', 'Message'],
        rows: [['OK', 'Executed']],
        totalRows: 1,
        totalColumns: 2,
        executionTime: '0.15s',
      },
      explanation: {
        title: 'Initial Setup',
        steps: [{ number: 1, title: 'Bootstrap', description: 'Run test code.' }],
      },
      keyPoints: [{ term: 'pd', description: 'Pandas alias' }],
    },
  ]);

  useEffect(() => {
    if (experimentToEdit) {
      setNumber(experimentToEdit.number);
      setTitle(experimentToEdit.title);
      setDescription(experimentToEdit.description);
      setCategory(experimentToEdit.category);
      setTechnology(experimentToEdit.technology);
      setGithubUrl(experimentToEdit.githubUrl);
      setDemoVideoUrl(experimentToEdit.demoVideoUrl || '');
      setThumbnail(experimentToEdit.thumbnail);
      setSubExperiments(experimentToEdit.subExperiments);
    } else {
      setNumber(experiments.length + 1);
      setTitle('');
      setDescription('');
      setCategory('Pandas');
      setTechnology('Pandas');
      setGithubUrl('https://github.com/kartheek1717/DataScience1');
      setThumbnail('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80');
      setSubExperiments([
        {
          id: `${experiments.length + 1}a`,
          title: 'Initial Module Run',
          description: 'Step 1 of the experiment module.',
          code: `import pandas as pd\nprint("Hello DS LAB")`,
          output: {
            columns: ['Status', 'Message'],
            rows: [['OK', 'Executed']],
            totalRows: 1,
            totalColumns: 2,
            executionTime: '0.15s',
          },
          explanation: {
            title: 'Initial Setup',
            steps: [{ number: 1, title: 'Bootstrap', description: 'Run test code.' }],
          },
          keyPoints: [{ term: 'pd', description: 'Pandas alias' }],
        },
      ]);
    }
  }, [experimentToEdit, experiments.length, isOpen]);

  if (!isOpen) return null;

  const handleAddSubExp = () => {
    const nextChar = String.fromCharCode(97 + subExperiments.length);
    const newSub: SubExperiment = {
      id: `${number}${nextChar}`,
      title: `Sub-experiment ${subExperiments.length + 1}`,
      description: 'Describe what this sub-experiment accomplishes.',
      code: `# Sub-experiment ${number}${nextChar}\nimport pandas as pd\n`,
      output: {
        columns: ['Col1', 'Col2'],
        rows: [['Data1', 'Data2']],
        totalRows: 1,
        totalColumns: 2,
        executionTime: '0.20s',
      },
      explanation: {
        title: 'Walkthrough',
        steps: [{ number: 1, title: 'Step 1', description: 'Execution details.' }],
      },
      keyPoints: [{ term: 'Key Point', description: 'Important note.' }],
    };
    setSubExperiments([...subExperiments, newSub]);
  };

  const handleRemoveSubExp = (index: number) => {
    if (subExperiments.length === 1) return;
    setSubExperiments(subExperiments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (experimentToEdit) {
      updateExperiment({
        ...experimentToEdit,
        number,
        title,
        description,
        category,
        technology,
        githubUrl,
        demoVideoUrl,
        thumbnail,
        subExperiments,
      });
    } else {
      const newExp: Experiment = {
        id: `exp-${Date.now()}`,
        number,
        title,
        description,
        category,
        technology,
        thumbnail,
        githubUrl,
        demoVideoUrl,
        progress: 0,
        status: 'in-progress',
        subExperiments,
        tags: [category, technology],
      };
      addExperiment(newExp);
    }
    onClose();
  };

  const categories: Experiment['category'][] = [
    'Pandas',
    'NumPy',
    'Matplotlib',
    'Scikit-learn',
    'Python',
    'SQL',
    'Statistics',
    'Machine Learning',
    'Data Cleaning',
    'Data Visualization',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-[#0D1E2A] rounded-2xl shadow-2xl border border-[#E3EDF2] dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E3EDF2] dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-extrabold text-lg text-[#0B2538] dark:text-white">
              {experimentToEdit ? `Edit Experiment #${number}` : '+ Add New Experiment'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Configure curriculum metadata, Python code, and sub-experiment modules
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                Exp Number
              </label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm font-bold text-[#0B2538] dark:text-white outline-none focus:border-[#009F9A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                Experiment Title
              </label>
              <input
                type="text"
                placeholder="e.g. Advanced Feature Engineering with Polars"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none focus:border-[#009F9A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Provide a clear description of the experimental objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none focus:border-[#009F9A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-[#0B2538] dark:text-white outline-none focus:border-[#009F9A]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                Technology / Library
              </label>
              <input
                type="text"
                placeholder="e.g. Pandas, NumPy, Scikit-learn"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none focus:border-[#009F9A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none focus:border-[#009F9A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                Thumbnail Image (URL or Upload File)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none focus:border-[#009F9A]"
                />
                <label className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer text-xs font-bold text-[#009F9A] flex items-center shrink-0">
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setThumbnail(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Sub-experiment Builder */}
          <div className="pt-4 border-t border-[#E3EDF2] dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#0B2538] dark:text-white">
                  Sub-experiment Builder
                </h4>
                <p className="text-xs text-gray-500">Configure modules for this experiment</p>
              </div>
              <button
                type="button"
                onClick={handleAddSubExp}
                className="px-3 py-1.5 rounded-xl bg-[#009F9A]/10 text-[#009F9A] hover:bg-[#009F9A]/20 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Sub-experiment</span>
              </button>
            </div>

            <div className="space-y-3">
              {subExperiments.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#009F9A] text-white flex items-center justify-center font-bold text-xs font-mono">
                      {sub.id}
                    </span>
                    <input
                      type="text"
                      placeholder="Sub-experiment title..."
                      value={sub.title}
                      onChange={(e) => {
                        const updated = [...subExperiments];
                        updated[idx].title = e.target.value;
                        setSubExperiments(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#0B2538] dark:text-white outline-none"
                    />
                    {subExperiments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubExp(idx)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Python code for this sub-experiment..."
                    value={sub.code}
                    onChange={(e) => {
                      const updated = [...subExperiments];
                      updated[idx].code = e.target.value;
                      setSubExperiments(updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg font-mono text-xs border border-gray-200 dark:border-slate-700 bg-[#091522] text-slate-100 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#E3EDF2] dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#009F9A] to-[#14B8A6] hover:from-[#009F9A]/90 hover:to-[#14B8A6]/90 text-white font-bold text-xs shadow-md shadow-[#009F9A]/20 transition-transform active:scale-98"
            >
              {experimentToEdit ? 'Save Changes' : 'Save Experiment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
