import React from 'react';
import { useLab, ExperimentViewMode } from '../context/LabContext';
import { ExperimentsDashboard } from './experiments/ExperimentsDashboard';
import { ExperimentDetailsPage } from './experiments/ExperimentDetailsPage';
import { ExperimentOverviewPage } from './experiments/ExperimentOverviewPage';
import { ExperimentPartCodePage } from './experiments/ExperimentPartCodePage';
import { ExperimentFormPage } from './experiments/ExperimentFormPage';
import { ManagePartsPage } from './experiments/ManagePartsPage';
import { LabFooter } from './experiments/LabFooter';

export type { ExperimentViewMode };

export const ExperimentWorkspace: React.FC = () => {
  const {
    experiments,
    selectedExpId,
    setSelectedExpId,
    selectedSubExpId,
    setSelectedSubExpId,
    experimentViewMode: viewMode,
    setExperimentViewMode: setViewMode,
    isAdmin,
    addToast
  } = useLab();

  // Redirect non-admins away from edit/manage views
  React.useEffect(() => {
    if (!isAdmin && (viewMode === 'add-experiment' || viewMode === 'edit-experiment' || viewMode === 'manage-parts')) {
      setViewMode('dashboard');
      addToast('Admin access required to modify experiments. Please log in from Settings.', 'info');
    }
  }, [isAdmin, viewMode, setViewMode, addToast]);

  // Currently active experiment
  const currentExp = experiments.find((e) => e.id === selectedExpId) || experiments[0];

  // Currently active sub-experiment / part
  const currentSubExpId =
    selectedSubExpId && currentExp?.subExperiments?.some((s) => s.id === selectedSubExpId)
      ? selectedSubExpId
      : currentExp?.subExperiments?.[0]?.id || '';

  // Handler: When student clicks an experiment card from Dashboard
  const handleSelectExperiment = (expId: string) => {
    setSelectedExpId(expId);
    const targetExp = experiments.find((e) => e.id === expId);
    if (targetExp && targetExp.subExperiments && targetExp.subExperiments.length > 0) {
      const nextPart = targetExp.subExperiments.find((s) => !s.isCompleted) || targetExp.subExperiments[0];
      setSelectedSubExpId(nextPart.id);
    }
    setViewMode('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: When student clicks a specific part directly (e.g. from A/B/C badges)
  const handleDirectPart = (expId: string, subExpId: string) => {
    setSelectedExpId(expId);
    setSelectedSubExpId(subExpId);
    setViewMode('part');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Add Experiment (Admin only)
  const handleOpenAddExperiment = () => {
    if (!isAdmin) {
      addToast('Admin access required to add experiments. Please log in from Settings.', 'info');
      return;
    }
    setViewMode('add-experiment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Edit Experiment (Admin only)
  const handleOpenEditExperiment = (expId: string) => {
    if (!isAdmin) {
      addToast('Admin access required to edit experiments. Please log in from Settings.', 'info');
      return;
    }
    setSelectedExpId(expId);
    setViewMode('edit-experiment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Manage Parts (Admin only)
  const handleOpenManageParts = (expId: string) => {
    if (!isAdmin) {
      addToast('Admin access required to manage parts. Please log in from Settings.', 'info');
      return;
    }
    setSelectedExpId(expId);
    setViewMode('manage-parts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Continue Experiment from Details page
  const handleContinueExperiment = () => {
    if (!currentExp) return;
    const nextPart = currentExp.subExperiments?.find((s) => !s.isCompleted) || currentExp.subExperiments?.[0];
    if (nextPart) {
      setSelectedSubExpId(nextPart.id);
    }
    setViewMode('part');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Open specific part from details or overview
  const handleOpenPart = (subExpId: string) => {
    setSelectedSubExpId(subExpId);
    setViewMode('part');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between animate-in fade-in duration-300">
      
      {/* Dynamic View rendering based on learning / management stage */}
      <div className="flex-1">
        {viewMode === 'dashboard' && (
          <ExperimentsDashboard
            onSelectExperiment={handleSelectExperiment}
            onOpenDirectPart={handleDirectPart}
            onAddExperiment={handleOpenAddExperiment}
            onEditExperiment={handleOpenEditExperiment}
            onManageParts={handleOpenManageParts}
          />
        )}

        {viewMode === 'details' && currentExp && (
          <ExperimentDetailsPage
            experiment={currentExp}
            onBackToDashboard={() => {
              setViewMode('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewOverview={() => {
              setViewMode('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPart={handleOpenPart}
            onContinueExperiment={handleContinueExperiment}
            onEditExperiment={handleOpenEditExperiment}
            onManageParts={handleOpenManageParts}
          />
        )}

        {viewMode === 'overview' && currentExp && (
          <ExperimentOverviewPage
            experiment={currentExp}
            onBackToDashboard={() => {
              setViewMode('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPart={handleOpenPart}
          />
        )}

        {viewMode === 'part' && currentExp && (
          <ExperimentPartCodePage
            experiment={currentExp}
            activeSubExpId={currentSubExpId}
            onSelectSubExp={(subId) => {
              setSelectedSubExpId(subId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToDashboard={() => {
              setViewMode('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToOverview={() => {
              setViewMode('details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {viewMode === 'add-experiment' && (
          <ExperimentFormPage
            mode="add"
            onCancel={() => {
              setViewMode('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSaved={(newExpId) => {
              setSelectedExpId(newExpId);
              setViewMode('details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {viewMode === 'edit-experiment' && currentExp && (
          <ExperimentFormPage
            mode="edit"
            experimentId={currentExp.id}
            onCancel={() => {
              setViewMode('details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSaved={(savedExpId) => {
              setSelectedExpId(savedExpId);
              setViewMode('details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {viewMode === 'manage-parts' && currentExp && (
          <ManagePartsPage
            experimentId={currentExp.id}
            onBack={() => {
              setViewMode('details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPart={handleOpenPart}
          />
        )}
      </div>

      {/* Universal Mohan Babu University Laboratory Footer */}
      <LabFooter />

    </div>
  );
};
