import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Code, 
  CheckCircle2, 
  Layers, 
  AlertCircle,
  Play,
  FileCode
} from 'lucide-react';
import { useLab } from '../../context/LabContext';
import { SubExperiment } from '../../types';
import { PartFormModal } from './PartFormModal';
import { ConfirmationDialog } from './ConfirmationDialog';

interface ManagePartsPageProps {
  experimentId: string;
  onBack: () => void;
  onOpenPart: (subExpId: string) => void;
}

export const ManagePartsPage: React.FC<ManagePartsPageProps> = ({
  experimentId,
  onBack,
  onOpenPart,
}) => {
  const { 
    experiments, 
    addPartToExperiment, 
    updatePartInExperiment, 
    deletePartFromExperiment, 
    duplicatePartInExperiment, 
    reorderPartsInExperiment 
  } = useLab();

  const experiment = experiments.find((e) => e.id === experimentId);

  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<SubExperiment | null>(null);

  const [partToDelete, setPartToDelete] = useState<SubExperiment | null>(null);

  if (!experiment) {
    return (
      <div className="p-8 text-center text-slate-500">
        Experiment not found.
        <button onClick={onBack} className="block mx-auto mt-4 text-teal-600 font-semibold">
          Return to Experiments
        </button>
      </div>
    );
  }

  const parts = experiment.subExperiments || [];

  const handleOpenAddPart = () => {
    setEditingPart(null);
    setIsPartModalOpen(true);
  };

  const handleOpenEditPart = (part: SubExperiment) => {
    setEditingPart(part);
    setIsPartModalOpen(true);
  };

  const handleSavePart = (part: SubExperiment) => {
    if (editingPart) {
      updatePartInExperiment(experiment.id, part);
    } else {
      addPartToExperiment(experiment.id, part);
    }
  };

  const handleMovePart = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= parts.length) return;
    const newParts = [...parts];
    const [moved] = newParts.splice(index, 1);
    newParts.splice(targetIndex, 0, moved);
    reorderPartsInExperiment(experiment.id, newParts);
  };

  return (
    <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Experiment Overview
        </button>

        <button
          onClick={handleOpenAddPart}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all active:scale-[0.98] min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          Add Experiment Part
        </button>
      </div>

      {/* Header Info Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                Experiment {experiment.displayNumber || experiment.number}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {parts.length} {parts.length === 1 ? 'Part' : 'Parts'} Configured
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Manage Parts: {experiment.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Organize individual hands-on coding exercises, aims, starter code, and solutions for this curriculum experiment.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto bg-slate-50 dark:bg-slate-800/60 px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Overall Progress
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {experiment.progress}% Complete
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Parts List */}
      {parts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            No parts created yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Experiments need at least one practical coding exercise. Add Part A to get started.
          </p>
          <button
            onClick={handleOpenAddPart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Part A
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {parts.map((part, index) => {
            const letter = part.partLetter || String.fromCharCode(65 + index);
            return (
              <div
                key={part.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Badge */}
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 font-bold text-base flex items-center justify-center shrink-0">
                    {letter}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                        Part {letter}
                      </span>
                      {part.isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/60">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                      {part.difficulty && (
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {part.difficulty}
                        </span>
                      )}
                      {part.estimatedTime && (
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {part.estimatedTime}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {part.title || part.name || `Exercise ${letter}`}
                    </h3>

                    {part.aim && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                        <strong className="text-slate-700 dark:text-slate-300">Aim:</strong> {part.aim}
                      </p>
                    )}

                    {part.description && !part.aim && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {part.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions toolbar */}
                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => handleMovePart(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move Up"
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMovePart(index, 'down')}
                      disabled={index === parts.length - 1}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move Down"
                      aria-label="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => duplicatePartInExperiment(experiment.id, part.id)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors min-w-[40px] flex items-center justify-center"
                    title="Duplicate Part"
                    aria-label="Duplicate Part"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditPart(part)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors min-w-[40px] flex items-center justify-center"
                    title="Edit Part"
                    aria-label="Edit Part"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setPartToDelete(part)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors min-w-[40px] flex items-center justify-center"
                    title="Delete Part"
                    aria-label="Delete Part"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Launch Code Lab */}
                  <button
                    type="button"
                    onClick={() => onOpenPart(part.id)}
                    className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all min-h-[40px]"
                    title="Open in Coding Lab"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Launch Lab
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Part Form Modal */}
      <PartFormModal
        isOpen={isPartModalOpen}
        onClose={() => setIsPartModalOpen(false)}
        partToEdit={editingPart}
        defaultPartLetter={String.fromCharCode(65 + parts.length)}
        onSave={handleSavePart}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!partToDelete}
        onClose={() => setPartToDelete(null)}
        onConfirm={() => {
          if (partToDelete) {
            deletePartFromExperiment(experiment.id, partToDelete.id);
            setPartToDelete(null);
          }
        }}
        title={`Delete Part ${partToDelete?.partLetter || ''}`}
        message={`Are you sure you want to delete "${partToDelete?.title || 'this part'}"? This action cannot be undone.`}
        confirmText="Delete Part"
        type="danger"
        hasProgressWarning={partToDelete?.isCompleted}
        progressWarningText="This part has been marked completed by the student. Deleting it will update progress calculations."
      />
    </div>
  );
};
