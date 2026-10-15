import React, { useState } from 'react';
import { Experiment, SubExperiment } from '../../types';
import { useLab } from '../../context/LabContext';
import { 
  ChevronRight, 
  CheckCircle2, 
  CircleDot, 
  ArrowRight, 
  ArrowLeft,
  BookOpen, 
  Code, 
  Video, 
  Sparkles,
  FolderGit2,
  ExternalLink,
  FileCode,
  FileSpreadsheet,
  Download,
  Layers,
  Award,
  Pencil,
  Plus,
  Image as ImageIcon,
  Trash2,
  Upload
} from 'lucide-react';
import { ResourceModal } from './ResourceModal';
import { MediaUploadModal } from './MediaUploadModal';
import { ConfirmationDialog } from './ConfirmationDialog';
import { GithubLinkModal } from './GithubLinkModal';
import { CoverPhotoModal } from './CoverPhotoModal';
import { BreadcrumbNav } from './BreadcrumbNav';

interface ExperimentDetailsPageProps {
  experiment: Experiment;
  onBackToDashboard: () => void;
  onViewOverview: () => void;
  onOpenPart: (subExpId: string) => void;
  onContinueExperiment: () => void;
  onEditExperiment?: (expId: string) => void;
  onManageParts?: (expId: string) => void;
}

export const ExperimentDetailsPage: React.FC<ExperimentDetailsPageProps> = ({
  experiment,
  onBackToDashboard,
  onViewOverview,
  onOpenPart,
  onContinueExperiment,
  onEditExperiment,
  onManageParts,
}) => {
  const { 
    setCurrentTab, 
    addToast, 
    addResourceToExperiment,
    updateExperimentThumbnail,
    deleteExperimentThumbnail,
    updateExperimentVideo,
    deleteExperimentVideo,
    updateExperimentGithubUrl,
    isAdmin
  } = useLab();
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);

  const [isVideoDeleteConfirmOpen, setIsVideoDeleteConfirmOpen] = useState(false);
  const [isCoverDeleteConfirmOpen, setIsCoverDeleteConfirmOpen] = useState(false);

  // 1. Precise State & Progress Calculations (strictly derived from completed parts)
  const totalParts = experiment.subExperiments.length || 1;
  const completedParts = experiment.subExperiments.filter((s) => s.isCompleted).length;
  const isAllCompleted = completedParts === totalParts && totalParts > 0;

  // Next target part to continue or review
  const targetPart: SubExperiment = isAllCompleted
    ? experiment.subExperiments[0]
    : (experiment.subExperiments.find((s) => !s.isCompleted) || experiment.subExperiments[0]);

  const targetPartLetter = targetPart?.partLetter || 'A';

  // Video availability verification (defaults to generated walkthrough video if available)
  const effectiveVideoUrl = experiment.demoVideoUrl?.trim() || `/videos/${experiment.id}.mp4`;
  const hasVideo = Boolean(effectiveVideoUrl && effectiveVideoUrl.trim() !== '');

  // Learning Objectives (syllabus-grounded)
  const learningObjectives = experiment.learningObjectives || [
    `Understand fundamental data science principles in ${experiment.category}.`,
    'Process, clean, and validate in-memory structured data arrays.',
    'Apply vectorized computational routines to optimize data transformation pipelines.',
    'Inspect tabular schemas and prevent runtime indexing anomalies.',
  ];

  // Topics / Skills Covered
  const topicsCovered = experiment.skillsChips || experiment.tags || [
    'Python',
    experiment.category,
    experiment.technology,
    'Data Science',
    'Data Cleaning',
    'Vectorization'
  ];

  // Download Python code handler
  const handleDownloadCode = () => {
    const code = targetPart?.code || `# Experiment ${experiment.number}\n# ${experiment.title}\nimport pandas as pd\nimport numpy as np\n`;
    const filename = `experiment_${String(experiment.number).replace(/[^a-zA-Z0-9]/g, '')}_part_${targetPartLetter.toLowerCase()}.py`;
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8;' });
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

  // Download Sample Dataset handler
  const handleDownloadDataset = () => {
    let csvData = 'id,feature_1,feature_2,label\n1,12.5,0.85,1\n2,14.2,0.92,1\n3,10.8,0.78,0\n4,15.6,0.95,1\n';
    if (targetPart?.output?.columns && targetPart?.output?.rows) {
      const header = targetPart.output.columns.join(',') + '\n';
      const rows = targetPart.output.rows.map((r) => r.join(',')).join('\n');
      csvData = header + rows;
    }
    const filename = `sample_dataset_exp${String(experiment.number).replace(/[^a-zA-Z0-9]/g, '')}.csv`;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
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

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-1 sm:px-2 animate-in fade-in duration-300">
      
      {/* ================================================== */}
      {/* 1. TOP HEADER & BREADCRUMB                         */}
      {/* ================================================== */}
      <div className="space-y-4">
        {/* Breadcrumb: Home → Experiments → Experiment 01 (Modern Box Cards) */}
        <BreadcrumbNav
          items={[
            { label: 'Home', onClick: () => setCurrentTab('home'), icon: 'home' },
            { label: 'Experiments', onClick: onBackToDashboard, icon: 'experiments' },
            { 
              label: `Experiment ${experiment.displayNumber || experiment.number}`, 
              icon: 'experiment', 
              isCurrent: true,
              tooltip: experiment.title
            },
          ]}
        />

        {/* Experiment Badges + Main Heading */}
        <div className="pt-1">
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span className="px-3 py-1 rounded-xl text-xs font-mono font-black bg-[#0B2538] text-white dark:bg-slate-800 dark:text-cyan-400 border border-slate-700/60 shadow-2xs">
              EXPERIMENT {experiment.displayNumber || experiment.number}
            </span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-cyan-500/10 text-[#009F9A] dark:text-cyan-400 border border-cyan-500/20 font-mono">
              {experiment.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0B2538] dark:text-white leading-tight">
            {experiment.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {experiment.subtitle || experiment.description}
          </p>

          {/* ================================================== */}
          {/* 2. METADATA & ACTIONS TOOLBAR STRIP               */}
          {/* ================================================== */}
          <div className="mt-6 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#0C1D2A] border border-slate-200/80 dark:border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-3 shadow-2xs">
            
            {/* Left: Academic Curriculum Metadata Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Subject Code */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Code</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {experiment.subjectCode || '22DS102006'}
                </span>
              </div>

              {/* Academic Year */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Year</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {experiment.academicYear || '2025–2026'}
                </span>
              </div>

              {/* Parts Count */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Structure</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {totalParts} {totalParts === 1 ? 'Part' : 'Parts'}
                </span>
              </div>

              {/* Language / Stack */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/60 text-[#008985] dark:text-teal-300 font-medium">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600/70 dark:text-teal-400/70">Language</span>
                <span className="font-mono font-bold text-[#007A76] dark:text-teal-300">
                  {experiment.language || 'Python'}
                </span>
              </div>
            </div>

            {/* Right: Unified Action Toolbar (Admin Only) */}
            {isAdmin && (
              <div className="flex flex-wrap items-center gap-2">
                {/* Cover Photo Segmented Button */}
                <div className="inline-flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsCoverModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-sky-700 dark:text-slate-200 dark:hover:text-sky-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title={experiment.thumbnail ? "Change experiment cover photo" : "Upload experiment cover photo"}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                    <span>{experiment.thumbnail ? "Change Cover" : "Add Cover"}</span>
                  </button>
                  {experiment.thumbnail && (
                    <button
                      type="button"
                      onClick={() => setIsCoverDeleteConfirmOpen(true)}
                      className="px-2 py-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border-l border-slate-200/90 dark:border-slate-700/80 transition-colors cursor-pointer"
                      title="Remove Cover Photo"
                      aria-label="Remove Cover Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Edit Experiment */}
                {onEditExperiment && (
                  <button
                    type="button"
                    onClick={() => onEditExperiment(experiment.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-800 text-slate-700 hover:text-teal-700 dark:text-slate-200 dark:hover:text-teal-300 border border-slate-200/90 dark:border-slate-700/80 hover:border-teal-300 dark:hover:border-teal-700 transition-all text-xs font-semibold shadow-2xs cursor-pointer"
                    title="Edit experiment title, description and curriculum metadata"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Experiment</span>
                  </button>
                )}

                {/* Manage Parts */}
                {onManageParts && (
                  <button
                    type="button"
                    onClick={() => onManageParts(experiment.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-800 text-slate-700 hover:text-amber-700 dark:text-slate-200 dark:hover:text-amber-300 border border-slate-200/90 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-700 transition-all text-xs font-semibold shadow-2xs cursor-pointer"
                    title="Manage laboratory parts and coding exercises"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-500" />
                    <span>Manage Parts</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {totalParts}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. MAIN CONTENT: Left ~65% Media, Right ~35% Progress */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================================================ */}
        {/* 4. LEFT COLUMN (~65% / 8 cols): Video / Code Lab */}
        {/* ================================================ */}
        <div className="lg:col-span-8 space-y-6">
          {/* VIDEO WALKTHROUGH CARD */}
          <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 shadow-xs">
            
            {/* Video Card Header Controls */}
            <div className="px-4 py-3 bg-slate-50/90 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                <Video className="w-4 h-4 text-[#009F9A] dark:text-cyan-400" />
                <span className="text-sm">Walkthrough Video</span>
                {hasVideo && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium border border-emerald-500/20">
                    Ready
                  </span>
                )}
              </div>

              {/* Action Buttons above Video: Prominent GitHub Repo + Video Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {/* HIGH VISIBILITY GITHUB REPOSITORY BUTTON */}
                {experiment.githubUrl ? (
                  <div className="inline-flex items-center rounded-xl bg-[#0B2538] hover:bg-[#123652] dark:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-xs border border-slate-700/80 overflow-hidden transition-all group">
                    <a
                      href={experiment.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                      title="Open GitHub code repository in a new tab"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span>GitHub Repository</span>
                      <ExternalLink className="w-3 h-3 text-cyan-300/80 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsGithubModalOpen(true)}
                      className="px-2 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 border-l border-white/15 transition-colors cursor-pointer"
                      title="Edit GitHub repository URL"
                      aria-label="Edit GitHub repository URL"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsGithubModalOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B2538] hover:bg-[#123652] text-white dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer group"
                    title="Attach GitHub Repository URL"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>+ Link GitHub Repository</span>
                  </button>
                )}

                {/* Upload Video Button */}
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
                  title={hasVideo ? "Change / Upload New Video" : "Upload Video Walkthrough"}
                >
                  <Upload className="w-3 h-3 text-teal-600 dark:text-cyan-400" />
                  <span>{hasVideo ? "Change Video" : "Upload Video"}</span>
                </button>

                {hasVideo && (
                  <button
                    type="button"
                    onClick={() => setIsVideoDeleteConfirmOpen(true)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete Video"
                    aria-label="Delete Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {hasVideo ? (
              /* Real Video Player */
              <div className="relative aspect-video bg-black flex items-center justify-center">
                {effectiveVideoUrl.includes('youtube.com') || effectiveVideoUrl.includes('youtu.be') ? (
                  <iframe
                    src={effectiveVideoUrl}
                    title={experiment.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    key={effectiveVideoUrl}
                    src={effectiveVideoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    poster={experiment.thumbnail}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : (
              /* Professional Video Coming Soon Empty State with Upload Action */
              <div className="relative aspect-video bg-gradient-to-br from-[#0B2538] via-[#0D1E2A] to-[#07141F] flex flex-col items-center justify-center text-center p-8 overflow-hidden">
                <div className="relative z-10 max-w-md space-y-3.5">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-inner">
                    <Video className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Video Coming Soon
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      The laboratory walkthrough video for this experiment is currently being prepared.
                    </p>
                  </div>

                  {/* Actions: Upload Video or Open Interactive Code Lab */}
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsVideoModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-sm cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Video</span>
                    </button>
                    <button
                      onClick={onContinueExperiment}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Open Interactive Code Lab →</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Information Strip below media card */}
            <div className="p-3.5 px-4 border-t border-gray-100 dark:border-slate-800/80 bg-gray-50/50 dark:bg-slate-900/40 flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#009F9A] dark:text-cyan-400" />
                <span className="font-medium">Interactive Python exercises available</span>
              </div>
              <span className="font-mono text-[11px] text-gray-400">
                {totalParts} {totalParts === 1 ? 'part' : 'parts'} ready to run
              </span>
            </div>
          </div>
        </div>

        {/* ================================================ */}
        {/* 5. RIGHT COLUMN (~35% / 4 cols): Your Progress   */}
        {/* ================================================ */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 shadow-xs space-y-6">
            
            {/* Header: LABORATORY MODULE Overview */}
            <div className="space-y-3 pb-5 border-b border-gray-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
                  LABORATORY MODULE
                </h3>
                <span className="font-mono font-bold text-sm sm:text-base text-[#009F9A] dark:text-cyan-400">
                  {totalParts} {totalParts === 1 ? 'Part' : 'Parts'}
                </span>
              </div>

              <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center justify-between">
                <span>Curriculum Code: {experiment.subjectCode || '22DS102006'}</span>
                <span className="font-medium text-[#009F9A] dark:text-cyan-400">Python 3.10</span>
              </div>
            </div>

            {/* ============================================== */}
            {/* 6. LABORATORY PARTS LIST                       */}
            {/* ============================================== */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                LABORATORY PARTS
              </h4>

              <div className="space-y-2.5">
                {experiment.subExperiments.map((sub, idx) => {
                  const letter = sub.partLetter || String.fromCharCode(65 + idx);

                  return (
                    <div
                      key={sub.id}
                      onClick={() => onOpenPart(sub.id)}
                      className="group p-3.5 rounded-xl border border-gray-200/80 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/40 hover:border-[#009F9A]/50 dark:hover:border-cyan-500/50 hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition-all flex items-start justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="shrink-0 mt-0.5">
                          <CircleDot className="w-4 h-4 text-[#009F9A] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">
                              Part {letter}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {sub.title}
                          </p>
                        </div>
                      </div>

                      {/* Part Action Link */}
                      <div className="shrink-0">
                        <span className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 group-hover:bg-[#009F9A] text-[#009F9A] group-hover:text-white dark:text-cyan-400 dark:group-hover:text-white border border-teal-200/80 dark:border-teal-800 text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5">
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ============================================== */}
            {/* 7. PRIMARY ACTION BUTTON                       */}
            {/* ============================================== */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={onContinueExperiment}
                className="group w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#009F9A] to-[#14B8A6] hover:from-[#009F9A]/95 hover:to-[#14B8A6]/95 text-white flex items-center justify-center gap-2 shadow-md shadow-[#009F9A]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <span>Launch Part {targetPartLetter} Code Lab</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onViewOverview}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-gray-800 dark:text-slate-200 border border-transparent dark:border-slate-700/60 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#009F9A] dark:text-cyan-400" />
                <span>View Full Experiment Overview</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ================================================== */}
      {/* 8. ABOUT THIS EXPERIMENT (SYNOPSIS)                */}
      {/* ================================================== */}
      <section className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 shadow-xs space-y-3">
        <h2 className="text-sm sm:text-base font-bold text-[#0B2538] dark:text-white uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#009F9A] dark:text-cyan-400" />
          <span>About This Experiment</span>
        </h2>
        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed max-w-4xl">
          {experiment.description} This practical lab equips students with hands-on methodology to prepare, manipulate, and validate experimental datasets using standard Python data science libraries. You will write code to perform step-by-step data transformations, verify program outputs against IEEE constraints, and eliminate common indexing and computational pitfalls.
        </p>
      </section>

      {/* ================================================== */}
      {/* 9. LEARNING OBJECTIVES & 10. TOPICS COVERED GRID   */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 9. Learning Objectives */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#0B2538] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#009F9A] dark:text-cyan-400" />
            <span>Learning Objectives</span>
          </h2>
          <ul className="space-y-2.5">
            {learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-slate-300">
                <span className="w-4 h-4 rounded-full bg-cyan-500/10 text-[#009F9A] dark:text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 10. Topics Covered */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#0B2538] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#009F9A] dark:text-cyan-400" />
            <span>Topics Covered</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {topicsCovered.map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-xs font-medium text-gray-800 dark:text-slate-200 border border-gray-200/80 dark:border-slate-700/80 flex items-center gap-1.5 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#009F9A] dark:bg-cyan-400" />
                <span>{topic}</span>
              </span>
            ))}
          </div>
        </section>

      </div>

      {/* ================================================== */}
      {/* 11. RESOURCES (Verified downloads & repository)     */}
      {/* ================================================== */}
      <section className="p-6 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0B2538] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Download className="w-4 h-4 text-[#009F9A] dark:text-cyan-400" />
            <span>Resources & Datasets ({3 + (experiment.resources?.length || 0)})</span>
          </h2>

          <button
            type="button"
            onClick={() => setIsResourceModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Resource</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Resource 1: Python Source */}
          <button
            onClick={handleDownloadCode}
            className="p-3.5 rounded-xl border border-gray-200/90 dark:border-slate-700/80 bg-gray-50/70 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left flex items-center justify-between group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <FileCode className="w-5 h-5 text-[#009F9A] dark:text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-800 dark:text-slate-200 truncate">
                  Python Source (.py)
                </div>
                <div className="text-[11px] text-gray-500">
                  Executable script
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400 group-hover:text-[#009F9A] transition-colors shrink-0" />
          </button>

          {/* Resource 2: Sample Dataset */}
          <button
            onClick={handleDownloadDataset}
            className="p-3.5 rounded-xl border border-gray-200/90 dark:border-slate-700/80 bg-gray-50/70 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left flex items-center justify-between group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-800 dark:text-slate-200 truncate">
                  Sample Dataset (.csv)
                </div>
                <div className="text-[11px] text-gray-500">
                  Tabular test data
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors shrink-0" />
          </button>

          {/* Resource 3: GitHub Repo */}
          {experiment.githubUrl ? (
            <div className="p-3.5 rounded-xl border border-gray-200/90 dark:border-slate-700/80 bg-gray-50/70 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left flex items-center justify-between group shadow-2xs">
              <a
                href={experiment.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                title="Open GitHub repository in new tab"
              >
                <FolderGit2 className="w-5 h-5 text-sky-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-800 dark:text-slate-200 truncate flex items-center gap-1.5">
                    <span>GitHub Repository</span>
                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-sky-500 shrink-0" />
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono truncate">
                    {experiment.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '') || 'Source & notebooks'}
                  </div>
                </div>
              </a>
              <button
                type="button"
                onClick={() => setIsGithubModalOpen(true)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200/80 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0 ml-2"
                title="Edit GitHub link"
                aria-label="Edit GitHub repository URL"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsGithubModalOpen(true)}
              className="p-3.5 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 bg-gray-50/40 dark:bg-slate-900/30 hover:bg-gray-100/70 dark:hover:bg-slate-800/50 flex items-center justify-between group text-left cursor-pointer transition-colors w-full"
              title="Attach GitHub repository link"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FolderGit2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-gray-700 dark:text-slate-300">
                    + Attach GitHub Repository
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Add link to course code & notebooks
                  </div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            </button>
          )}

          {/* Custom user resources */}
          {experiment.resources && experiment.resources.map((res, idx) => (
            <div
              key={res.id || idx}
              className="p-3.5 rounded-xl border border-gray-200/90 dark:border-slate-700/80 bg-gray-50/70 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCode className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-800 dark:text-slate-200 truncate">
                    {res.title}
                  </div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-wider">
                    {res.type}
                  </div>
                </div>
              </div>
              {res.url && (
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-500" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Resource Modal */}
      <ResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onSave={(resource) => addResourceToExperiment(experiment.id, resource)}
      />

      {/* Cover Photo Upload Modal */}
      <CoverPhotoModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        experiment={experiment}
        defaultCoverUrl={experiment.coverImage || experiment.thumbnail}
        onSave={(url) => {
          updateExperimentThumbnail(experiment.id, url);
          setIsCoverModalOpen(false);
        }}
      />

      {/* Video Upload Modal */}
      <MediaUploadModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title="Walkthrough Video"
        mediaType="video"
        currentUrl={experiment.demoVideoUrl}
        onSave={(url) => {
          updateExperimentVideo(experiment.id, url);
          setIsVideoModalOpen(false);
          addToast('Experiment video updated ✓');
        }}
      />



      {/* Delete Video Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isVideoDeleteConfirmOpen}
        onClose={() => setIsVideoDeleteConfirmOpen(false)}
        onConfirm={() => {
          deleteExperimentVideo(experiment.id);
          setIsVideoDeleteConfirmOpen(false);
          addToast('Experiment video removed ✓');
        }}
        title="Delete Walkthrough Video"
        message="Are you sure you want to remove this video? The experiment will revert to the placeholder until another video is uploaded."
        confirmText="Remove Video"
        type="danger"
      />

      {/* Delete Cover Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isCoverDeleteConfirmOpen}
        onClose={() => setIsCoverDeleteConfirmOpen(false)}
        onConfirm={() => {
          deleteExperimentThumbnail(experiment.id);
          setIsCoverDeleteConfirmOpen(false);
          addToast('Cover photo removed ✓');
        }}
        title="Delete Cover Photo"
        message="Are you sure you want to remove the cover photo for this experiment?"
        confirmText="Remove Cover"
        type="danger"
      />



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

      {/* ================================================== */}
      {/* 12. BOTTOM NAVIGATION BAR                          */}
      {/* ================================================== */}
      <div className="pt-6 border-t border-gray-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Simple Back button */}
        <button
          onClick={onBackToDashboard}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Experiments</span>
        </button>

        {/* View Full Experiment Overview */}
        <button
          onClick={onViewOverview}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-[#0D1E2A] hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200 border border-gray-300 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs group"
        >
          <span>View Full Experiment Overview</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
};
