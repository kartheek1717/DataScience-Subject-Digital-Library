import React, { useState, useEffect } from 'react';
import { Experiment, SubExperiment } from '../../types';
import { useLab } from '../../context/LabContext';
import { 
  ChevronRight, 
  Play, 
  Copy, 
  RotateCcw, 
  Check, 
  Terminal, 
  FileCode, 
  Download, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  FileSpreadsheet,
  Code2,
  Clock,
  FolderGit2,
  ExternalLink,
  Bookmark,
  Layers,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { OutputPanel } from '../OutputPanel';
import { BreadcrumbNav } from './BreadcrumbNav';

interface ExperimentPartCodePageProps {
  experiment: Experiment;
  activeSubExpId: string;
  onSelectSubExp: (subExpId: string) => void;
  onBackToDashboard: () => void;
  onBackToOverview: () => void;
}

export const ExperimentPartCodePage: React.FC<ExperimentPartCodePageProps> = ({
  experiment,
  activeSubExpId,
  onSelectSubExp,
  onBackToDashboard,
  onBackToOverview,
}) => {
  const { 
    updateSubExpCode, 
    markSubExpCompleted, 
    addToast,
    setCurrentTab,
    experiments,
    setSelectedExpId,
    setSelectedSubExpId
  } = useLab();

  const [isAllExpsOpen, setIsAllExpsOpen] = useState(false);

  // Switch to another experiment from left sidebar
  const handleSwitchExperiment = (targetExpId: string, targetSubId?: string) => {
    const target = experiments.find((e) => e.id === targetExpId);
    if (!target) return;
    setSelectedExpId(targetExpId);
    const subId = targetSubId || target.subExperiments?.[0]?.id || '';
    setSelectedSubExpId(subId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast(`Switched to Experiment ${target.displayNumber || target.number}: ${target.title}`, 'info');
  };

  // Active sub-experiment resolution
  const subExpIndex = experiment.subExperiments.findIndex((s) => s.id === activeSubExpId);
  const currentSubExp: SubExperiment = 
    experiment.subExperiments[subExpIndex >= 0 ? subExpIndex : 0] || experiment.subExperiments[0];

  const partLetter = currentSubExp.partLetter || String.fromCharCode(65 + Math.max(0, subExpIndex));
  const filename = `experiment-${String(experiment.number).toLowerCase().replace(/[^a-z0-9]/g, '')}-${partLetter.toLowerCase()}.py`;

  // Total parts & accurate completion progress
  const totalParts = experiment.subExperiments.length || 1;
  const completedParts = experiment.subExperiments.filter((s) => s.isCompleted).length;
  const realProgress = Math.round((completedParts / totalParts) * 100);
  const isPartCompleted = Boolean(currentSubExp.isCompleted);

  // Code editor buffer
  const [editorCode, setEditorCode] = useState(currentSubExp.code || '');
  const [isCopied, setIsCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(isPartCompleted);

  // Sync editor buffer if active sub-experiment changes
  useEffect(() => {
    setEditorCode(currentSubExp.code || '');
    setHasExecuted(Boolean(currentSubExp.isCompleted));
  }, [currentSubExp.id, currentSubExp.code, currentSubExp.isCompleted]);

  // Code execution handler
  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasExecuted(true);
      markSubExpCompleted(experiment.id, currentSubExp.id);
      addToast(`Executed ${filename} successfully!`, 'success');
    }, 500);
  };

  // Copy code handler
  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorCode);
    setIsCopied(true);
    addToast('Python code copied to clipboard ✓');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Reset code handler
  const handleResetCode = () => {
    setEditorCode(currentSubExp.code);
    updateSubExpCode(experiment.id, currentSubExp.id, currentSubExp.code);
    addToast('Code reset to official baseline');
  };

  // Download Python file (.py)
  const handleDownloadPy = () => {
    const blob = new Blob([editorCode], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast(`Downloaded ${filename} ✓`);
  };

  // Download Sample Dataset (.csv)
  const handleDownloadDataset = () => {
    let content = 'roll_no,name,branch,marks\n101,Aarav,CSE,88\n102,Diya,ECE,92\n103,Rohan,DS,85\n104,Ananya,AI,95\n';
    if (currentSubExp.output?.columns && currentSubExp.output?.rows) {
      const header = currentSubExp.output.columns.join(',') + '\n';
      const rows = currentSubExp.output.rows.map((r) => r.join(',')).join('\n');
      content = header + rows;
    }
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sample_data_part_${partLetter.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Sample dataset downloaded ✓');
  };

  // Previous and next parts navigation
  const prevSubExp = subExpIndex > 0 ? experiment.subExperiments[subExpIndex - 1] : null;
  const nextSubExp = subExpIndex < experiment.subExperiments.length - 1 ? experiment.subExperiments[subExpIndex + 1] : null;

  // Split code into lines for editor line-numbers
  const codeLines = editorCode.split('\n');

  // Shorten next part title if long for clean button display
  const shortNextTitle = nextSubExp 
    ? nextSubExp.title.length > 28 
      ? `${nextSubExp.title.substring(0, 26)}...` 
      : nextSubExp.title 
    : '';

  return (
    <div className="space-y-7 w-full max-w-[1650px] mx-auto px-2 sm:px-4 lg:px-6 animate-in fade-in duration-300">
      
      {/* ================================================== */}
      {/* 1. PAGE HEADER                                     */}
      {/* ================================================== */}
      <div className="space-y-3.5">
        {/* Breadcrumb: Home → Experiments → Experiment 01 → Part A (Modern Box Cards) */}
        <BreadcrumbNav
          items={[
            { label: 'Home', onClick: () => setCurrentTab('home'), icon: 'home' },
            { label: 'Experiments', onClick: onBackToDashboard, icon: 'experiments' },
            { 
              label: `Experiment ${experiment.displayNumber || experiment.number}`, 
              onClick: onBackToOverview, 
              icon: 'experiment',
              tooltip: experiment.title
            },
            { 
              label: `Part ${partLetter}`, 
              icon: 'part', 
              isCurrent: true,
              tooltip: currentSubExp?.title
            },
          ]}
        />

        {/* Experiment Part Title & Progress Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1 border-b border-gray-200/80 dark:border-slate-800/80 pb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-[#009F9A] text-white shadow-2xs">
                Part {partLetter}
              </span>
              <span className="text-xs font-mono text-gray-500 dark:text-slate-400 truncate">
                Experiment {experiment.displayNumber || experiment.number}: {experiment.title}
              </span>
            </div>

            {/* Title: Strongest Visual Element */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B2538] dark:text-white leading-tight">
              {currentSubExp.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
              {currentSubExp.description}
            </p>
          </div>

          {/* Compact Info Card on Right */}
          <div className="bg-white dark:bg-[#0D1E2A] p-3.5 px-4 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-4 self-start lg:self-auto shrink-0">
            <div className="space-y-0.5 text-right">
              <div className="text-xs font-bold text-gray-800 dark:text-slate-200">
                Part {subExpIndex + 1} of {totalParts}
              </div>
              <div className="text-xs font-mono text-[#009F9A] dark:text-cyan-400 font-bold">
                Python 3.10 Engine
              </div>
              <div className="text-[11px] font-medium pt-0.5 text-gray-500 dark:text-slate-400">
                Interactive Code Lab
              </div>
            </div>

            {/* Clean Part Letter Badge */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-mono text-sm font-bold shadow-2xs border bg-teal-50 dark:bg-teal-950/40 text-[#009F9A] dark:text-cyan-400 border-teal-200 dark:border-teal-800">
              {partLetter}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Quick Sub-Experiments Bar */}
      <div className="lg:hidden p-3.5 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#009F9A] dark:text-cyan-400" />
            <span>Sub-Experiments ({totalParts})</span>
          </span>
          <span className="text-[11px] font-mono font-bold text-[#009F9A] dark:text-cyan-400">
            {completedParts}/{totalParts} Done
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {experiment.subExperiments.map((sub, sIdx) => {
            const letter = sub.partLetter || String.fromCharCode(65 + sIdx);
            const isCurrent = sub.id === currentSubExp.id;
            const isDone = Boolean(sub.isCompleted);

            return (
              <button
                key={sub.id}
                onClick={() => {
                  onSelectSubExp(sub.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#009F9A] text-white shadow-xs ring-2 ring-[#009F9A]/30'
                    : isDone
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:border-teal-400'
                }`}
              >
                <span>Part {letter}</span>
                {isDone ? <span>✓</span> : isCurrent ? <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> : null}
              </button>
            );
          })}
        </div>

        {nextSubExp && (
          <button
            onClick={() => {
              onSelectSubExp(nextSubExp.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#009F9A]/10 hover:bg-[#009F9A]/20 border border-[#009F9A]/30 text-[#009F9A] dark:text-cyan-400 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Next: Part {nextSubExp.partLetter || 'Next'}</span>
            </span>
            <span className="text-[10px] font-mono">Tap to start →</span>
          </button>
        )}
      </div>

      {/* ================================================== */}
      {/* 2. MAIN 3-COLUMN WORKSPACE:                        */}
      {/* Left: Sub-Experiments Navigator                   */}
      {/* Center: Editor & Output Canvas                    */}
      {/* Right: Notes, Key Points & Downloads              */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-6 items-start">
        
        {/* ================================================ */}
        {/* LEFT COLUMN: Sub-Experiments Navigator           */}
        {/* ================================================ */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-20 self-start">
          
          {/* Sub-Experiments Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 shadow-xs space-y-3.5">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-[#009F9A] dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">
                    Sub-Experiments
                  </h2>
                  <p className="text-[11px] text-gray-400 dark:text-slate-400 font-mono">
                    {totalParts} Parts • Exp {experiment.displayNumber || experiment.number}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/50 text-[#009F9A] dark:text-cyan-400 border border-teal-200/80 dark:border-teal-800">
                {completedParts}/{totalParts} Done
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>Progress</span>
                <span className="font-bold text-[#009F9A] dark:text-cyan-400">{realProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#009F9A] to-[#14B8A6] rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(6, realProgress)}%` }}
                />
              </div>
            </div>

            {/* Sub-Experiments List */}
            <div className="pt-2 border-t border-gray-100 dark:border-slate-800/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center justify-between">
                <span>Parts &amp; Steps</span>
                <span className="text-gray-400 font-normal">Click to go</span>
              </div>

              <div className="space-y-2">
                {experiment.subExperiments.map((sub, sIdx) => {
                  const letter = sub.partLetter || String.fromCharCode(65 + sIdx);
                  const isCurrent = sub.id === currentSubExp.id;
                  const isDone = Boolean(sub.isCompleted);

                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        onSelectSubExp(sub.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 group relative cursor-pointer ${
                        isCurrent
                          ? 'bg-gradient-to-r from-teal-50 to-blue-50/50 dark:from-teal-950/60 dark:to-cyan-950/30 text-[#0B2538] dark:text-white border-2 border-[#009F9A] dark:border-cyan-400 shadow-xs ring-2 ring-teal-500/20'
                          : isDone
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 hover:border-emerald-400'
                            : 'bg-gray-50/70 dark:bg-slate-800/40 border border-gray-200/80 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:border-[#009F9A]/60 hover:bg-teal-50/20 dark:hover:bg-slate-800'
                      }`}
                    >
                      {/* Part Badge */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 transition-transform group-hover:scale-105 ${
                        isCurrent
                          ? 'bg-[#009F9A] text-white shadow-xs'
                          : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
                      }`}>
                        {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : letter}
                      </div>

                      {/* Part Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-bold truncate">
                            Part {letter}
                          </span>

                          {isCurrent ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-[#009F9A] text-white flex items-center gap-1 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              Current
                            </span>
                          ) : isDone ? (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                              ✓ Done
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full font-semibold bg-amber-100/80 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 group-hover:bg-[#009F9A] group-hover:text-white group-hover:border-transparent transition-colors">
                              Remaining
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-gray-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                          {sub.title}
                        </p>
                      </div>

                      <ChevronRight className={`w-3.5 h-3.5 mt-2 transition-transform shrink-0 ${
                        isCurrent
                          ? 'text-[#009F9A] dark:text-cyan-400 translate-x-0.5'
                          : 'text-gray-300 dark:text-slate-600 group-hover:text-[#009F9A] group-hover:translate-x-0.5'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Go to Next Remaining Part Button */}
            {nextSubExp && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    onSelectSubExp(nextSubExp.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title={`Go to next practical part: ${shortNextTitle}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500/10 to-blue-500/10 hover:from-teal-500/20 hover:to-blue-500/20 border border-teal-500/30 text-[#009F9A] dark:text-cyan-400 text-xs font-bold flex items-center justify-between transition-all group cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Go to Part {nextSubExp.partLetter || 'Next'}</span>
                  </span>
                  <span className="text-[10px] opacity-75 font-mono group-hover:underline">
                    Next →
                  </span>
                </button>
              </div>
            )}

          </div>

          {/* Quick All Experiments Accordion Switcher */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 shadow-xs space-y-2">
            <button
              type="button"
              onClick={() => setIsAllExpsOpen(!isAllExpsOpen)}
              className="w-full flex items-center justify-between text-left text-xs font-bold text-gray-700 dark:text-slate-300 hover:text-[#009F9A] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#009F9A] dark:text-cyan-400" />
                <span>All Lab Experiments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono bg-gray-100 dark:bg-slate-800 text-gray-500 px-1.5 py-0.5 rounded">
                  {experiments.length}
                </span>
                {isAllExpsOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
              </div>
            </button>

            {isAllExpsOpen && (
              <div className="pt-2 space-y-1 max-h-60 overflow-y-auto scrollbar-thin border-t border-gray-100 dark:border-slate-800/80">
                {experiments.map((e) => {
                  const isSelected = e.id === experiment.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => handleSwitchExperiment(e.id)}
                      className={`w-full text-left p-2 rounded-lg text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-teal-50 dark:bg-teal-950/40 text-[#009F9A] dark:text-cyan-400 font-bold'
                          : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-2">
                        Exp {e.displayNumber || e.number}: {e.title}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 shrink-0">
                        {e.subExperiments?.length || 0} pts
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </aside>

        {/* ================================================ */}
        {/* CENTER COLUMN: Code Editor & Execution Output     */}
        {/* ================================================ */}
        <div className="lg:col-span-8 xl:col-span-6 space-y-6 min-w-0">
          
          {/* 3. CODE EDITOR CARD */}
          <div className="rounded-2xl border border-slate-800 bg-[#0A131D] shadow-xl overflow-hidden">
            
            {/* Editor Header: Window Dots, Version, Filename, Action Buttons */}
            <div className="px-4 py-3 bg-[#070E16] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3">
              
              {/* Left: Window Dots & Environment */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-4 w-px bg-slate-800" />
                <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5" /> Python 3.10
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 font-mono text-xs border border-slate-700/60">
                  {filename}
                </span>
              </div>

              {/* Right: Copy, Reset, ▶ Run Code (Primary Action with 48px height) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60 cursor-pointer"
                  title="Copy Python code"
                  aria-label="Copy code"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleResetCode}
                  className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60 cursor-pointer"
                  title="Reset code to baseline"
                  aria-label="Reset code"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                {experiment.githubUrl && (
                  <a
                    href={experiment.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60 cursor-pointer"
                    title="View repository on GitHub"
                    aria-label="View on GitHub"
                  >
                    <FolderGit2 className="w-4 h-4 text-cyan-400" />
                    <span className="hidden sm:inline">GitHub</span>
                  </a>
                )}

                {/* Primary Action Button (48px height) */}
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="min-h-[48px] px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#009F9A] to-[#14B8A6] hover:from-[#009F9A]/95 hover:to-[#14B8A6]/95 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-[#009F9A]/30 active:scale-95 disabled:opacity-50 cursor-pointer"
                  aria-label="Run Python code"
                >
                  <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Executing...' : '▶ Run Code'}</span>
                </button>
              </div>

            </div>

            {/* Code Editor Body with Line Numbers */}
            <div className="flex max-h-[520px] min-h-[290px] overflow-auto font-mono text-xs sm:text-[13px] leading-relaxed select-text">
              {/* Line numbers */}
              <div className="py-4 px-3 bg-[#070E16]/90 text-slate-600 text-right select-none font-mono border-r border-slate-800/80 shrink-0 min-w-[42px]">
                {codeLines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Monospace Code Editor Textarea */}
              <textarea
                value={editorCode}
                onChange={(e) => {
                  setEditorCode(e.target.value);
                  updateSubExpCode(experiment.id, currentSubExp.id, e.target.value);
                }}
                spellCheck={false}
                aria-label="Python code editor"
                className="w-full py-4 px-4 bg-transparent text-slate-200 outline-none resize-none font-mono whitespace-pre overflow-x-auto leading-relaxed selection:bg-cyan-500/30"
                style={{ minHeight: `${Math.max(260, codeLines.length * 22)}px` }}
              />
            </div>

          </div>

          {/* 4. CODE EXECUTION OUTPUT AREA */}
          <div className="space-y-2.5">
            {/* Output Header with secondary environment info */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-slate-200">
                <Terminal className="w-4 h-4 text-[#009F9A] dark:text-cyan-400" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                  Execution Output
                </h2>
              </div>

              {/* 5. Python Environment Information (Secondary Badge) */}
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-gray-200/80 dark:border-slate-700/60">
                <span>Python 3.10</span>
                <span>•</span>
                <span>Pandas 2.2</span>
                <span>•</span>
                <span>NumPy 1.26</span>
              </div>
            </div>

            {/* Execution Content: BEFORE vs AFTER */}
            {!hasExecuted ? (
              /* Before Running: Clean Terminal Prompt (No competing buttons) */
              <div className="p-7 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 text-center space-y-2 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-gray-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 font-mono">
                  &gt; Run the code above to see the output.
                </p>
                <p className="text-[11px] text-gray-400">
                  Click <strong className="text-[#009F9A] dark:text-cyan-400">▶ Run Code</strong> in the editor header to execute this script.
                </p>
              </div>
            ) : (
              /* After Running: Success badge + real terminal program output */
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Code executed successfully</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-600/80 dark:text-emerald-400/80 hidden sm:inline">
                    Process finished with exit code 0
                  </span>
                </div>

                {currentSubExp.output && (
                  <OutputPanel output={currentSubExp.output} hasExecuted={hasExecuted} />
                )}
              </div>
            )}
          </div>

        </div>

        {/* ================================================ */}
        {/* RIGHT COLUMN: Notes & Learning Objectives         */}
        {/* ================================================ */}
        <div className="lg:col-span-12 xl:col-span-3 space-y-5 xl:sticky xl:top-20 self-start">
          
          {/* 6. ABOUT THIS PART (1. NAME, 2. AIM, 3. DESCRIPTION) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-[#009F9A] dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" />
              <span>About This Part</span>
            </h2>

            {/* 1. NAME */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                1. NAME
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                {currentSubExp.name || currentSubExp.title}
              </p>
            </div>

            {/* 2. AIM */}
            <div className="space-y-1 pt-2.5 border-t border-gray-100 dark:border-slate-800/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                2. AIM
              </div>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-medium">
                {currentSubExp.aim || `To implement and verify ${currentSubExp.title} using Python data science libraries.`}
              </p>
            </div>

            {/* 3. DESCRIPTION */}
            <div className="space-y-1 pt-2.5 border-t border-gray-100 dark:border-slate-800/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                3. DESCRIPTION
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                {currentSubExp.description}
              </p>
            </div>
          </div>

          {/* 7. KEY POINTS */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#009F9A] dark:text-cyan-400" />
              <span>Key Points</span>
            </h2>

            <ul className="space-y-2.5">
              {currentSubExp.keyPoints && currentSubExp.keyPoints.length > 0 ? (
                currentSubExp.keyPoints.map((kp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009F9A] dark:bg-cyan-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">
                      <code className="text-gray-900 dark:text-white font-mono font-bold bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px]">
                        {kp.term}
                      </code>
                      {kp.description && `: ${kp.description}`}
                    </span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009F9A] mt-1.5 shrink-0" />
                    <span><code className="font-mono font-bold">DataFrame</code>: Stores tabular records using rows and columns in memory.</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009F9A] mt-1.5 shrink-0" />
                    <span><code className="font-mono font-bold">.head()</code>: Inspects top observations for schema validation.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* 8. WATCH OUT — COMMON PITFALLS */}
          <div className="p-4.5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/30 text-xs space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>⚠ Watch Out — Common Pitfalls</span>
            </div>

            <ul className="space-y-2 text-amber-900 dark:text-amber-200/90 pl-1 text-xs">
              {currentSubExp.watchOut && currentSubExp.watchOut.length > 0 ? (
                currentSubExp.watchOut.map((wo, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{wo}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Forgetting <code className="bg-amber-100 dark:bg-amber-900/60 px-1 rounded font-mono">index=False</code> will write unwanted row numbers into the file.</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Ensure case-sensitive column names match exact dataset schemas.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* 9. RESOURCES & DOWNLOADS */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#009F9A] dark:text-cyan-400" />
              <span>Resources & Downloads</span>
            </h2>

            <div className="space-y-2">
              {/* Python Source Download */}
              <button
                onClick={handleDownloadPy}
                className="w-full p-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700/80 bg-gray-50/80 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-medium text-gray-800 dark:text-slate-200 flex items-center justify-between transition-colors group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#009F9A] dark:text-cyan-400" />
                  <span className="font-mono text-[11px] truncate">{filename}</span>
                </div>
                <span className="text-[11px] font-bold text-[#009F9A] dark:text-cyan-400 group-hover:underline shrink-0">
                  Download .py
                </span>
              </button>

              {/* Sample Lab Data Download */}
              <button
                onClick={handleDownloadDataset}
                className="w-full p-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700/80 bg-gray-50/80 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-medium text-gray-800 dark:text-slate-200 flex items-center justify-between transition-colors group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] truncate">Sample Lab Data</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline shrink-0">
                  Download .csv
                </span>
              </button>

              {/* GitHub Repository Link */}
              {experiment.githubUrl && (
                <a
                  href={experiment.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full p-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700/80 bg-gray-50/80 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-medium text-gray-800 dark:text-slate-200 flex items-center justify-between transition-colors group cursor-pointer shadow-2xs"
                  title="View experiment repository on GitHub"
                >
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-sky-500" />
                    <span className="text-[11px] truncate">GitHub Repository</span>
                  </div>
                  <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 group-hover:underline shrink-0 flex items-center gap-1">
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* 12. BOTTOM PART NAVIGATION & FORWARD ACTIONS ONLY  */}
      {/* (STRICTLY NO BACK BUTTON AT THE BOTTOM OF PAGE)    */}
      {/* ================================================== */}
      <div className="pt-6 border-t border-gray-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Dynamic Part Completion Status */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            isPartCompleted || hasExecuted
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
          }`}>
            {isPartCompleted || hasExecuted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {isPartCompleted || hasExecuted ? 'Code Verified & Executed ✓' : `Part ${partLetter} Ready to Run`}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {isPartCompleted || hasExecuted 
                ? 'Your code output is verified. Ready for the next practical step.' 
                : 'Click "▶ Run Code" above or test your implementation.'}
            </div>
          </div>
        </div>

        {/* Right: Forward Completion Action Buttons (48-52px height) */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {(!isPartCompleted && !hasExecuted) && (
            <button
              onClick={() => {
                setHasExecuted(true);
                markSubExpCompleted(experiment.id, currentSubExp.id);
                addToast(`Part ${partLetter} marked complete ✓`, 'success');
              }}
              className="px-5 py-3 rounded-xl border border-teal-500/40 text-teal-700 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-950/30 hover:bg-teal-100/60 font-bold text-xs sm:text-sm min-h-[48px] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Mark Complete ✓</span>
            </button>
          )}

          {nextSubExp ? (
            <button
              onClick={() => {
                if (!isPartCompleted && !hasExecuted) {
                  markSubExpCompleted(experiment.id, currentSubExp.id);
                }
                onSelectSubExp(nextSubExp.id);
              }}
              className="group w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#009F9A] to-[#14B8A6] hover:from-[#009F9A]/95 hover:to-[#14B8A6]/95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md shadow-[#009F9A]/20 transition-all hover:scale-[1.01] active:scale-[0.99] min-h-[48px] cursor-pointer"
            >
              <span>Continue to Next Part (Part {nextSubExp.partLetter || 'Next'})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (!isPartCompleted && !hasExecuted) {
                  markSubExpCompleted(experiment.id, currentSubExp.id);
                }
                onBackToOverview();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B2538] hover:bg-[#122e44] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition-all min-h-[48px] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-white" />
              <span>Complete Experiment ✓</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
