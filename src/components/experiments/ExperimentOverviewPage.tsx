import React, { useState } from 'react';
import { Experiment } from '../../types';
import { useLab } from '../../context/LabContext';
import { 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  CircleDot, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Code, 
  Layers, 
  FileCode, 
  Award,
  ExternalLink,
  FolderGit2,
  Pencil,
  Plus
} from 'lucide-react';
import { GithubLinkModal } from './GithubLinkModal';
import { BreadcrumbNav } from './BreadcrumbNav';

interface ExperimentOverviewPageProps {
  experiment: Experiment;
  onBackToDashboard: () => void;
  onOpenPart: (subExpId: string) => void;
}

export const ExperimentOverviewPage: React.FC<ExperimentOverviewPageProps> = ({
  experiment,
  onBackToDashboard,
  onOpenPart,
}) => {
  const { setCurrentTab, updateExperimentGithubUrl } = useLab();
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);

  // Find next part to continue or default to first
  const nextIncompletePart =
    experiment.subExperiments.find((s) => !s.isCompleted) ||
    experiment.subExperiments[0];

  // Learning Objectives (either defined in experiment or generated from sub-experiments)
  const learningObjectives = experiment.learningObjectives || [
    'Understand underlying data representations and data science paradigms.',
    'Master DataFrame operations, column manipulations, and slicing techniques.',
    'Execute real-time data ingestion and structured output generation.',
    'Apply clean coding principles to prevent runtime pitfalls and indexing discrepancies.',
  ];

  // Skills chips
  const skillChips = experiment.skillsChips || [
    'Python',
    experiment.category,
    experiment.technology,
    'Data Science',
    'DataFrames',
    'Automation',
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* 1. HEADER & BREADCRUMB */}
      <div className="space-y-3">
        {/* Breadcrumb: Home → Experiments → Experiment 01 → Overview (Modern Box Cards) */}
        <BreadcrumbNav
          items={[
            { label: 'Home', onClick: () => setCurrentTab('home'), icon: 'home' },
            { label: 'Experiments', onClick: onBackToDashboard, icon: 'experiments' },
            { 
              label: `Experiment ${experiment.displayNumber || experiment.number}`, 
              onClick: onBackToDashboard, 
              icon: 'experiment',
              tooltip: experiment.title
            },
            { 
              label: 'Overview', 
              icon: 'overview', 
              isCurrent: true 
            },
          ]}
        />

        {/* Title & Subtitle */}
        <div className="pt-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#0B2538] text-white dark:bg-cyan-500/10 dark:text-cyan-400 dark:border dark:border-cyan-500/30">
              EXPERIMENT {experiment.displayNumber || experiment.number}
            </span>
            <span className="text-xs font-mono text-[#009F9A] dark:text-cyan-400 font-medium">
              Syllabus Overview
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B2538] dark:text-white leading-tight">
            {experiment.title}
          </h1>

          <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {experiment.subtitle || experiment.description}
          </p>
        </div>
      </div>

      {/* 2. COMPACT HORIZONTAL PART NAVIGATION STRIP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
          <span className="font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
            Laboratory Modules & Parts ({experiment.subExperiments.length})
          </span>
          <span className="font-mono text-[11px]">Click any part to launch code editor</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {experiment.subExperiments.map((sub, idx) => {
            const letter = sub.partLetter || String.fromCharCode(65 + idx);
            return (
              <div
                key={sub.id}
                onClick={() => onOpenPart(sub.id)}
                className="p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group bg-white dark:bg-[#0D1E2A] border-[#E3EDF2] dark:border-slate-800 hover:border-[#009F9A]/50 dark:hover:border-cyan-500/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200">
                      PART {letter}
                    </span>
                    <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 15 mins
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#009F9A] dark:group-hover:text-cyan-400 transition-colors leading-snug">
                    {sub.title}
                  </h4>
                </div>

                <div className="pt-3 mt-2 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 font-mono">Python 3.10</span>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 group-hover:bg-[#009F9A] text-[#009F9A] group-hover:text-white dark:text-cyan-400 dark:group-hover:text-white border border-teal-200/80 dark:border-teal-800 text-[11px] font-bold transition-all shadow-2xs inline-flex items-center gap-1">
                    <span>Open Part</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN CONTENT: Left/Main = Learning Content, Right = Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT / MAIN COLUMN (~8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* About this Experiment */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#009F9A] dark:text-cyan-400" />
              <span>About this Experiment</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              {experiment.description}
            </p>
          </div>

          {/* Learning Objectives */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#009F9A] dark:text-cyan-400" />
              <span>Learning Objectives</span>
            </h3>

            <ul className="space-y-2.5">
              {learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-[#009F9A] dark:text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What You Will Learn (Visual cards / chips) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#009F9A] dark:text-cyan-400" />
              <span>What You Will Learn</span>
            </h3>

            <div className="flex flex-wrap gap-2.5">
              {skillChips.map((chip, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700/80 text-xs font-medium text-gray-800 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs hover:border-[#009F9A]/40 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009F9A] dark:bg-cyan-400" />
                  <span>{chip}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR (~4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Experiment Info Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-[#E3EDF2] dark:border-slate-800 pb-3">
              Experiment Info
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-slate-400">Subject Code</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {experiment.subjectCode || '22DS102006'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-slate-400">Academic Year</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {experiment.academicYear || '2025–2026'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-slate-400">Language</span>
                <span className="font-bold text-[#009F9A] dark:text-cyan-400">
                  {experiment.language || 'Python'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-slate-400">Parts</span>
                <span className="font-bold text-gray-900 dark:text-white font-mono">
                  {experiment.subExperiments.length}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800">
                <span className="text-gray-500 dark:text-slate-400 font-medium">Difficulty</span>
                <span className="font-mono font-bold text-[#009F9A] dark:text-cyan-400 text-sm">
                  {experiment.difficulty || 'Beginner'}
                </span>
              </div>
            </div>

            {/* Quick Navigation list */}
            <div className="pt-4 border-t border-[#E3EDF2] dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                Quick Navigation
              </div>
              <div className="space-y-1">
                {experiment.subExperiments.map((sub, idx) => {
                  const letter = sub.partLetter || String.fromCharCode(65 + idx);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onOpenPart(sub.id)}
                      className="w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-xs text-gray-700 dark:text-slate-300 flex items-center justify-between transition-colors group"
                    >
                      <span className="truncate pr-2">
                        Part {letter}: {sub.title}
                      </span>
                      <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-slate-750 flex items-center justify-center text-gray-400 group-hover:bg-[#009F9A] group-hover:text-white transition-all shrink-0">
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* GitHub Repository Link */}
          {experiment.githubUrl ? (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 flex items-center justify-between group shadow-xs">
              <a
                href={experiment.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 min-w-0 flex-1 hover:text-[#009F9A] transition-colors"
                title="Open GitHub code repository in new tab"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>GitHub Code Repository</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-cyan-400 shrink-0" />
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono truncate">
                    {experiment.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '') || 'Source notebooks & datasets'}
                  </div>
                </div>
              </a>
              <button
                type="button"
                onClick={() => setIsGithubModalOpen(true)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
                title="Edit GitHub repository link"
                aria-label="Edit GitHub repository link"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsGithubModalOpen(true)}
              className="p-4 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-dashed border-[#E3EDF2] dark:border-slate-800 flex items-center justify-between group hover:border-[#009F9A]/40 transition-colors shadow-xs w-full text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    + Attach GitHub Repository
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Connect source notebooks & datasets
                  </div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </button>
          )}

        </div>

      </div>

      {/* 4. BOTTOM ACTION BAR: Primary Start Part A + Secondary Back to Experiments */}
      <div className="pt-6 border-t border-[#E3EDF2] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Experiments</span>
        </button>

        <button
          onClick={() => onOpenPart(experiment.subExperiments[0]?.id || '')}
          className="group w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#009F9A] to-[#14B8A6] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#009F9A]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>
            Open Part {experiment.subExperiments[0]?.partLetter || 'A'} Code Lab
          </span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* GitHub Repository Modal */}
      <GithubLinkModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
        currentUrl={experiment.githubUrl}
        experimentTitle={experiment.title}
        onSave={(url) => {
          updateExperimentGithubUrl(experiment.id, url);
        }}
      />

    </div>
  );
};
