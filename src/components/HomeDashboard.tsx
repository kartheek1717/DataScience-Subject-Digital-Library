import React from 'react';
import { useLab } from '../context/LabContext';
import { HeroBanner } from './HeroBanner';
import { 
  ArrowRight, 
  FlaskConical, 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Database, 
  BookOpen
} from 'lucide-react';

const CurriculumArt: React.FC = () => (
  <svg className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 drop-shadow-md select-none pointer-events-none" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="68" cy="55" r="44" fill="#FEF3C7" fillOpacity="0.85" />
    {/* Stacked Book 1 (Purple - bottom) */}
    <g transform="translate(18, 62)">
      <path d="M12 22C28 22 45 16 75 16L72 26C45 26 28 32 12 32L12 22Z" fill="#7E22CE" />
      <path d="M10 20C26 20 44 14 74 14L77 17C47 17 29 23 13 23L10 20Z" fill="#A855F7" />
      <path d="M14 24L70 18L72 22L16 28Z" fill="#F8FAFC" />
      <path d="M6 19C6 17 8 16 10 16L12 16L12 26L10 26C8 26 6 24 6 22L6 19Z" fill="#6B21A8" />
    </g>
    {/* Stacked Book 2 (Amber - middle) */}
    <g transform="translate(20, 48)">
      <path d="M10 22C26 22 44 16 74 16L71 25C44 25 26 31 10 31L10 22Z" fill="#D97706" />
      <path d="M8 19C24 19 43 13 73 13L76 16C46 16 27 22 11 22L8 19Z" fill="#F59E0B" />
      <path d="M12 23L69 17L71 21L14 27Z" fill="#FFFFFF" />
      <path d="M5 18C5 16 7 15 9 15L11 15L11 25L9 25C7 25 5 23 5 21L5 18Z" fill="#B45309" />
    </g>
    {/* 3D Bar chart on right */}
    <g transform="translate(82, 45)">
      <rect x="0" y="24" width="7" height="20" rx="2" fill="#10B981" />
      <rect x="0" y="22" width="7" height="3" rx="1.5" fill="#34D399" />
      <rect x="9" y="14" width="7" height="30" rx="2" fill="#06B6D4" />
      <rect x="9" y="12" width="7" height="3" rx="1.5" fill="#22D3EE" />
      <rect x="18" y="4" width="7" height="40" rx="2" fill="#0284C7" />
      <rect x="18" y="2" width="7" height="3" rx="1.5" fill="#38BDF8" />
    </g>
    {/* Graduation Mortarboard Cap (Top) */}
    <g transform="translate(32, 10)">
      <path d="M35 12L68 25L35 38L2 25L35 12Z" fill="#0F172A" />
      <path d="M35 12L68 25L35 27L2 25L35 12Z" fill="#1E293B" />
      <path d="M15 28C15 36 24 43 35 43C46 43 55 36 55 28L55 29C55 37 46 45 35 45C24 45 15 37 15 29Z" fill="#0F172A" />
      <circle cx="35" cy="25" r="2.5" fill="#F59E0B" />
      <path d="M35 25C44 26 50 30 52 38" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="52" cy="40" r="2.5" fill="#F59E0B" />
    </g>
  </svg>
);

const PracticalsArt: React.FC = () => (
  <svg className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 drop-shadow-md select-none pointer-events-none" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="68" cy="55" r="44" fill="#D1FAE5" fillOpacity="0.85" />
    {/* 3D Erlenmeyer Flask */}
    <g transform="translate(34, 18)">
      <path d="M22 16L22 30L8 56C5 62 9 70 17 70L41 70C49 70 53 62 50 56L36 30L36 16L22 16Z" fill="#E2E8F0" fillOpacity="0.45" stroke="#059669" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M11 58C9.5 62 12.5 68 18 68L40 68C45.5 68 48.5 62 47 58L39 44C36 47 33 46 29 44C25 42 22 43 19 44L11 58Z" fill="#10B981" />
      <path d="M19 44C22 43 25 42 29 44C33 46 36 47 39 44" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="25" cy="54" r="2.5" fill="#A7F3D0" />
      <circle cx="33" cy="60" r="1.5" fill="#A7F3D0" />
      <circle cx="29" cy="40" r="2" fill="#34D399" />
      <circle cx="27" cy="24" r="1.5" fill="#10B981" />
      <rect x="20" y="13" width="18" height="4" rx="2" fill="#047857" />
    </g>
    {/* Test Tube on right */}
    <g transform="translate(76, 36)">
      <rect x="4" y="8" width="10" height="36" rx="5" fill="#E2E8F0" fillOpacity="0.6" stroke="#7C3AED" strokeWidth="2" />
      <path d="M4 24C4 24 8 26 14 24L14 39C14 41.7 11.7 44 9 44C6.3 44 4 41.7 4 39L4 24Z" fill="#8B5CF6" />
      <rect x="3" y="6" width="12" height="3" rx="1.5" fill="#6D28D9" />
    </g>
    <circle cx="28" cy="38" r="3" fill="#06B6D4" />
    <circle cx="34" cy="28" r="2" fill="#F59E0B" />
  </svg>
);

const EcosystemArt: React.FC = () => (
  <svg className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 drop-shadow-md select-none pointer-events-none" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="68" cy="55" r="44" fill="#EDE9FE" fillOpacity="0.85" />
    {/* 3D Database Cylinders */}
    <g transform="translate(24, 40)">
      <path d="M6 34C6 29 20 25 38 25C56 25 70 29 70 34V46C70 51 56 55 38 55C20 55 6 51 6 46V34Z" fill="#4338CA" />
      <ellipse cx="38" cy="34" rx="32" ry="8" fill="#6366F1" />
      <path d="M6 18C6 13 20 9 38 9C56 9 70 13 70 18V28C70 33 56 37 38 37C20 37 6 33 6 28V18Z" fill="#4F46E5" />
      <ellipse cx="38" cy="18" rx="32" ry="8" fill="#818CF8" />
      <path d="M6 2C6 -3 20 -7 38 -7C56 -7 70 -3 70 2V12C70 17 56 21 38 21C20 21 6 17 6 12V2Z" fill="#6366F1" />
      <ellipse cx="38" cy="2" rx="32" ry="8" fill="#A5B4FC" />
      <ellipse cx="38" cy="2" rx="20" ry="5" fill="#EEF2FF" fillOpacity="0.8" />
    </g>
    {/* Terminal / Code Window badge */}
    <g transform="translate(62, 20)">
      <rect x="0" y="0" width="36" height="28" rx="5" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
      <circle cx="6" cy="6" r="1.5" fill="#EF4444" />
      <circle cx="11" cy="6" r="1.5" fill="#F59E0B" />
      <circle cx="16" cy="6" r="1.5" fill="#10B981" />
      <path d="M7 16L12 19L7 22" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="15" y1="22" x2="22" y2="22" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
    </g>
    <g transform="translate(18, 24)">
      <circle cx="10" cy="10" r="7" fill="#F59E0B" />
      <circle cx="10" cy="10" r="3" fill="#FFFBEB" />
    </g>
  </svg>
);

const EXP_PALETTES = [
  { bg: 'bg-[#E0F2FE] dark:bg-sky-950/40', border: 'border-[#BAE6FD] dark:border-sky-800/60', text: 'text-[#0369A1] dark:text-sky-300', badge: 'bg-[#0284C7]' },
  { bg: 'bg-[#DCFCE7] dark:bg-emerald-950/40', border: 'border-[#BBF7D0] dark:border-emerald-800/60', text: 'text-[#15803D] dark:text-emerald-300', badge: 'bg-[#16A34A]' },
  { bg: 'bg-[#F3E8FF] dark:bg-purple-950/40', border: 'border-[#E9D5FF] dark:border-purple-800/60', text: 'text-[#7E22CE] dark:text-purple-300', badge: 'bg-[#9333EA]' },
  { bg: 'bg-[#CCFBF1] dark:bg-teal-950/40', border: 'border-[#99F6E4] dark:border-teal-800/60', text: 'text-[#0F766E] dark:text-teal-300', badge: 'bg-[#0D9488]' },
  { bg: 'bg-[#FEF3C7] dark:bg-amber-950/40', border: 'border-[#FDE68A] dark:border-amber-800/60', text: 'text-[#B45309] dark:text-amber-300', badge: 'bg-[#D97706]' },
  { bg: 'bg-[#FFE4E6] dark:bg-rose-950/40', border: 'border-[#FECDD3] dark:border-rose-800/60', text: 'text-[#BE123C] dark:text-rose-300', badge: 'bg-[#E11D48]' },
  { bg: 'bg-[#E0E7FF] dark:bg-indigo-950/40', border: 'border-[#C7D2FE] dark:border-indigo-800/60', text: 'text-[#4338CA] dark:text-indigo-300', badge: 'bg-[#4F46E5]' },
  { bg: 'bg-[#CFFAFE] dark:bg-cyan-950/40', border: 'border-[#A5F3FC] dark:border-cyan-800/60', text: 'text-[#0E7490] dark:text-cyan-300', badge: 'bg-[#0891B2]' },
  { bg: 'bg-[#EDE9FE] dark:bg-violet-950/40', border: 'border-[#DDD6FE] dark:border-violet-800/60', text: 'text-[#6D28D9] dark:text-violet-300', badge: 'bg-[#7C3AED]' },
  { bg: 'bg-[#FAE8FF] dark:bg-fuchsia-950/40', border: 'border-[#F5D0FE] dark:border-fuchsia-800/60', text: 'text-[#A21CAF] dark:text-fuchsia-300', badge: 'bg-[#C026D3]' },
];

export const HomeDashboard: React.FC = () => {
  const { 
    setCurrentTab, 
    experiments, 
    setSelectedExpId, 
    setSelectedModuleNumber,
    navigateToModule,
    navigateToExperiment,
    setExperimentViewMode,
    navigateToTool
  } = useLab();

  // Calculate live laboratory progress
  const totalExperiments = experiments.length;
  const completedExperiments = experiments.filter((e) => (e.progress || 0) >= 100 || e.status === 'completed').length;

  const handleOpenModule = (e: React.MouseEvent, moduleNum: number) => {
    e.stopPropagation();
    navigateToModule(moduleNum);
  };

  const handleOpenAllModules = () => {
    navigateToModule('all');
  };

  const handleOpenAllExperiments = () => {
    setExperimentViewMode('dashboard');
    setCurrentTab('experiments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 max-w-7xl mx-auto">
      
      {/* ============================================================ */}
      {/* 1. HERO BANNER                                               */}
      {/* ============================================================ */}
      <HeroBanner />

      {/* ============================================================ */}
      {/* 2. THREE CORE CARDS: MODULES, EXPERIMENTS, TOOLS             */}
      {/* ============================================================ */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Curriculum &amp; Interactive Workspaces</span>
              <Sparkles className="w-5 h-5 text-teal-500" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore prescribed theoretical units, code in simulated Python runtimes, or test queries in SQLite.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 font-semibold self-start sm:self-auto">
            Course Code: 22DS102006
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ======================================================== */}
          {/* CARD 1: MODULES PAGE (EXACT REFERENCE MODEL)            */}
          {/* ======================================================== */}
          <div
            onClick={handleOpenAllModules}
            className="p-6 sm:p-7 rounded-[28px] bg-[#FDFBF7] dark:bg-[#0C1D2A] border border-[#F3E8D6] dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Subtle warm glow background accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-200/25 via-amber-100/10 to-transparent pointer-events-none rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-orange-200/20 pointer-events-none rounded-full blur-xl" />

            <div>
              {/* Top Header Row with Squircle, Badge and Art */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#F59E0B] shadow-md shadow-amber-500/25 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="ml-3 px-3.5 py-1 rounded-full bg-[#F6EBDD] dark:bg-amber-950/50 text-[#9A5B13] dark:text-amber-300 text-[11px] font-black tracking-wider uppercase border border-[#EDD9C0]/60 dark:border-amber-900/40">
                    01 - CURRICULUM
                  </span>
                </div>
                <CurriculumArt />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-2xl font-black text-[#1E293B] dark:text-white tracking-tight mt-1 mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Modules
              </h3>
              <div className="text-xs sm:text-sm font-bold text-[#B45309] dark:text-amber-400 mb-2.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 shrink-0" />
                <span>5 Modules • 45 Total Periods</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Official prescribed syllabus for Data Science. Explore theoretical foundations, feature extraction, data visualization, statistical thinking, and time-series modeling.
              </p>

              {/* Click to Jump Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-black tracking-wider uppercase mb-2.5 font-mono">
                <span className="text-slate-500 dark:text-slate-400">CLICK TO JUMP TO MODULE:</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenAllModules();
                  }}
                  className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-[#0F766E] dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 font-bold normal-case tracking-normal flex items-center gap-1.5 cursor-pointer text-[11px] shadow-2xs transition-all hover:scale-[1.02] active:scale-95 group/btn"
                >
                  <span>GO TO ALL MODULES</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* 5 Module Pills (Exact colors and math symbols from screenshot) */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {/* M1 */}
                <button
                  type="button"
                  onClick={(e) => handleOpenModule(e, 1)}
                  className="p-1.5 pr-3 rounded-2xl bg-[#E0F2FE] dark:bg-sky-950/40 border border-[#BAE6FD] dark:border-sky-800/60 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Jump to Module 1: Introduction"
                >
                  <span className="w-7 h-7 rounded-full bg-[#0284C7] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    Σ
                  </span>
                  <span className="text-xs font-bold text-[#0369A1] dark:text-sky-300 truncate">
                    M1: Intro
                  </span>
                </button>

                {/* M2 */}
                <button
                  type="button"
                  onClick={(e) => handleOpenModule(e, 2)}
                  className="p-1.5 pr-3 rounded-2xl bg-[#DCFCE7] dark:bg-emerald-950/40 border border-[#BBF7D0] dark:border-emerald-800/60 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Jump to Module 2: Data Extraction"
                >
                  <span className="w-7 h-7 rounded-full bg-[#16A34A] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    X
                  </span>
                  <span className="text-xs font-bold text-[#15803D] dark:text-emerald-300 truncate">
                    M2: Extraction
                  </span>
                </button>

                {/* M3 */}
                <button
                  type="button"
                  onClick={(e) => handleOpenModule(e, 3)}
                  className="p-1.5 pr-3 rounded-2xl bg-[#F3E8FF] dark:bg-purple-950/40 border border-[#E9D5FF] dark:border-purple-800/60 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Jump to Module 3: Data Visualization"
                >
                  <span className="w-7 h-7 rounded-full bg-[#9333EA] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    ∫
                  </span>
                  <span className="text-xs font-bold text-[#7E22CE] dark:text-purple-300 truncate">
                    M3: Visuals
                  </span>
                </button>

                {/* M4 */}
                <button
                  type="button"
                  onClick={(e) => handleOpenModule(e, 4)}
                  className="p-1.5 pr-3 rounded-2xl bg-[#FEF3C7] dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-800/60 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Jump to Module 4: Statistical Thinking"
                >
                  <span className="w-7 h-7 rounded-full bg-[#D97706] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    ∑
                  </span>
                  <span className="text-xs font-bold text-[#B45309] dark:text-amber-300 truncate">
                    M4: Stats
                  </span>
                </button>

                {/* M5 */}
                <button
                  type="button"
                  onClick={(e) => handleOpenModule(e, 5)}
                  className="col-span-2 p-1.5 pr-3.5 rounded-2xl bg-[#FFE4E6] dark:bg-rose-950/40 border border-[#FECDD3] dark:border-rose-800/60 flex items-center gap-2 hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Jump to Module 5: Predictive Modeling"
                >
                  <span className="w-7 h-7 rounded-full bg-[#E11D48] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    π
                  </span>
                  <span className="text-xs font-bold text-[#BE123C] dark:text-rose-300 truncate">
                    M5: Predictive
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom CTA Row */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenAllModules();
                }}
                className="group px-5 py-2.5 rounded-full bg-gradient-to-r from-[#EA580C] to-[#F97316] text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open All Modules</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-xs font-bold text-[#92400E] dark:text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>45 Periods</span>
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 2: EXPERIMENTS PAGE (DISTINCT COLOR FOR EACH LAB)   */}
          {/* ======================================================== */}
          <div
            onClick={handleOpenAllExperiments}
            className="p-6 sm:p-7 rounded-[28px] bg-[#FDFBF7] dark:bg-[#0C1D2A] border border-[#F3E8D6] dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Subtle emerald glow background accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-200/25 via-emerald-100/10 to-transparent pointer-events-none rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-teal-200/20 pointer-events-none rounded-full blur-xl" />

            <div>
              {/* Top Header Row with Squircle, Badge and Art */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#059669] shadow-md shadow-emerald-500/25 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <span className="ml-3 px-3.5 py-1 rounded-full bg-[#D1FAE5] dark:bg-emerald-950/50 text-[#065F46] dark:text-emerald-300 text-[11px] font-black tracking-wider uppercase border border-[#A7F3D0]/60 dark:border-emerald-900/40">
                    02 - PRACTICALS
                  </span>
                </div>
                <PracticalsArt />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-2xl font-black text-[#1E293B] dark:text-white tracking-tight mt-1 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Experiments
              </h3>
              <div className="text-xs sm:text-sm font-bold text-[#059669] dark:text-emerald-400 mb-2.5 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 shrink-0" />
                <span>{totalExperiments} Experiments • Python 3.10 Runtime</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Interactive hands-on laboratory experiments with live Python execution, dataset inspection, step-by-step guidance, and real-time outputs.
              </p>

              {/* Click to Jump Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-black tracking-wider uppercase mb-2.5 font-mono">
                <span className="text-slate-500 dark:text-slate-400">CLICK TO JUMP TO LAB:</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenAllExperiments();
                  }}
                  className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-[#059669] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-bold normal-case tracking-normal flex items-center gap-1.5 cursor-pointer text-[11px] shadow-2xs transition-all hover:scale-[1.02] active:scale-95 group/btn"
                >
                  <span>GO TO ALL EXPERIMENTS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Dynamic Experiment Pills (Every experiment has its own distinct color!) */}
              <div className="grid grid-cols-2 gap-2 mb-6 max-h-[260px] overflow-y-auto pr-1">
                {experiments.map((exp, idx) => {
                  const palette = EXP_PALETTES[idx % EXP_PALETTES.length];
                  const displayNum = exp.displayNumber || String(exp.number).padStart(2, '0');
                  const categoryOrTitle = exp.category || exp.title;
                  const label = categoryOrTitle.length > 15 ? categoryOrTitle.slice(0, 13) + '…' : categoryOrTitle;

                  return (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToExperiment(exp.id, 'details');
                      }}
                      className={`p-1.5 pr-2.5 rounded-2xl ${palette.bg} border ${palette.border} flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn`}
                      title={`Open Experiment ${displayNum}: ${exp.title}`}
                    >
                      <span className={`w-7 h-7 rounded-full ${palette.badge} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                        {displayNum}
                      </span>
                      <span className={`text-xs font-bold ${palette.text} truncate`}>
                        Exp {exp.number}: {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom CTA Row */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenAllExperiments();
                }}
                className="group px-5 py-2.5 rounded-full bg-gradient-to-r from-[#059669] to-[#10B981] text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Open All Experiments</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-xs font-bold text-[#065F46] dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{completedExperiments}/{totalExperiments} Done</span>
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 3: TOOLS & WORKBENCH (DISTINCT COLOR FOR EACH TOOL) */}
          {/* ======================================================== */}
          <div
            onClick={() => navigateToTool('directory', 'All')}
            className="p-6 sm:p-7 rounded-[28px] bg-[#FDFBF7] dark:bg-[#0C1D2A] border border-[#F3E8D6] dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Subtle lavender/indigo glow background accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-200/25 via-violet-100/10 to-transparent pointer-events-none rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-purple-200/20 pointer-events-none rounded-full blur-xl" />

            <div>
              {/* Top Header Row with Squircle, Badge and Art */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#6366F1] shadow-md shadow-indigo-500/25 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <span className="ml-3 px-3.5 py-1 rounded-full bg-[#EDE9FE] dark:bg-indigo-950/50 text-[#5B21B6] dark:text-indigo-300 text-[11px] font-black tracking-wider uppercase border border-[#DDD6FE]/60 dark:border-indigo-900/40">
                    03 - ECOSYSTEM
                  </span>
                </div>
                <EcosystemArt />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-2xl font-black text-[#1E293B] dark:text-white tracking-tight mt-1 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Tools &amp; Workbench
              </h3>
              <div className="text-xs sm:text-sm font-bold text-[#6366F1] dark:text-indigo-400 mb-2.5 flex items-center gap-1.5">
                <Database className="w-4 h-4 shrink-0" />
                <span>9 Toolchains • 3 Interactive Hubs</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Interactive developer toolchains, database exploration sandboxes, Jupyter &amp; Colab hubs, and data science utilities.
              </p>

              {/* Click to Jump Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-black tracking-wider uppercase mb-2.5 font-mono">
                <span className="text-slate-500 dark:text-slate-400">CLICK TO JUMP TO TOOL:</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToTool('directory', 'All');
                  }}
                  className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-[#6366F1] dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold normal-case tracking-normal flex items-center gap-1.5 cursor-pointer text-[11px] shadow-2xs transition-all hover:scale-[1.02] active:scale-95 group/btn"
                >
                  <span>EXPLORE ALL TOOLS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Tools Pills (Every tool has its own distinct color!) */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {/* Tool 1 - Indigo: SQLite Studio */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToTool('sql-sandbox');
                  }}
                  className="p-1.5 pr-2.5 rounded-2xl bg-[#EEF2FF] dark:bg-indigo-950/40 border border-[#C7D2FE] dark:border-indigo-800/60 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Open SQLite Studio"
                >
                  <span className="w-7 h-7 rounded-full bg-[#4F46E5] text-white text-xs flex items-center justify-center shrink-0 shadow-xs">
                    🗄️
                  </span>
                  <span className="text-xs font-bold text-[#3730A3] dark:text-indigo-300 truncate">
                    SQLite Studio
                  </span>
                </button>

                {/* Tool 2 - Sky Blue: NumPy Matrix */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToTool('numpy-calculator');
                  }}
                  className="p-1.5 pr-2.5 rounded-2xl bg-[#E0F2FE] dark:bg-sky-950/40 border border-[#BAE6FD] dark:border-sky-800/60 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Open NumPy Matrix"
                >
                  <span className="w-7 h-7 rounded-full bg-[#0284C7] text-white text-xs flex items-center justify-center shrink-0 shadow-xs">
                    🔢
                  </span>
                  <span className="text-xs font-bold text-[#0369A1] dark:text-sky-300 truncate">
                    NumPy Matrix
                  </span>
                </button>

                {/* Tool 3 - Orange: Jupyter Hub */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToTool('jupyter-colab');
                  }}
                  className="p-1.5 pr-2.5 rounded-2xl bg-[#FFF7ED] dark:bg-orange-950/40 border border-[#FED7AA] dark:border-orange-800/60 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Open Jupyter Notebook Hub"
                >
                  <span className="w-7 h-7 rounded-full bg-[#EA580C] text-white text-xs flex items-center justify-center shrink-0 shadow-xs">
                    🪐
                  </span>
                  <span className="text-xs font-bold text-[#C2410C] dark:text-orange-300 truncate">
                    Jupyter Hub
                  </span>
                </button>

                {/* Tool 4 - Amber: Google Colab */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToTool('jupyter-colab');
                  }}
                  className="p-1.5 pr-2.5 rounded-2xl bg-[#FEFCE8] dark:bg-amber-950/40 border border-[#FEF08A] dark:border-amber-800/60 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Open Google Colab Cloud Hub"
                >
                  <span className="w-7 h-7 rounded-full bg-[#D97706] text-white text-xs flex items-center justify-center shrink-0 shadow-xs">
                    ⚡
                  </span>
                  <span className="text-xs font-bold text-[#B45309] dark:text-amber-300 truncate">
                    Google Colab
                  </span>
                </button>

                {/* Tool 5 - Mint Green: Pandas Wrangling */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToTool('directory', 'Data Wrangling', 'pandas');
                  }}
                  className="p-1.5 pr-2.5 rounded-2xl bg-[#DCFCE7] dark:bg-emerald-950/40 border border-[#BBF7D0] dark:border-emerald-800/60 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Open Pandas Wrangling"
                >
                  <span className="w-7 h-7 rounded-full bg-[#16A34A] text-white text-xs flex items-center justify-center shrink-0 shadow-xs">
                    🐼
                  </span>
                  <span className="text-xs font-bold text-[#15803D] dark:text-emerald-300 truncate">
                    Pandas Wrangling
                  </span>
                </button>

                {/* Tool 6 - Amber: Matplotlib Plots */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToTool('directory', 'Visualization', 'matplotlib-seaborn');
                  }}
                  className="p-1.5 pr-2.5 rounded-2xl bg-[#FEF3C7] dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-800/60 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Open Matplotlib Plots"
                >
                  <span className="w-7 h-7 rounded-full bg-[#D97706] text-white text-xs flex items-center justify-center shrink-0 shadow-xs">
                    📊
                  </span>
                  <span className="text-xs font-bold text-[#B45309] dark:text-amber-300 truncate">
                    Matplotlib Plots
                  </span>
                </button>

                {/* Tool 7 - Rose: Scikit-Learn ML */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToTool('directory', 'Machine Learning', 'scikit-learn');
                  }}
                  className="p-1.5 pr-2.5 rounded-2xl bg-[#FFE4E6] dark:bg-rose-950/40 border border-[#FECDD3] dark:border-rose-800/60 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Open Scikit-Learn ML"
                >
                  <span className="w-7 h-7 rounded-full bg-[#E11D48] text-white text-xs flex items-center justify-center shrink-0 shadow-xs">
                    🤖
                  </span>
                  <span className="text-xs font-bold text-[#BE123C] dark:text-rose-300 truncate">
                    Scikit-Learn ML
                  </span>
                </button>

                {/* Tool 8 - Fuchsia: SciPy Stats */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToTool('directory', 'Statistics', 'scipy');
                  }}
                  className="p-1.5 pr-2.5 rounded-2xl bg-[#FDF4FF] dark:bg-fuchsia-950/40 border border-[#F0ABFC] dark:border-fuchsia-800/60 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-2xs group/btn"
                  title="Open SciPy Stats"
                >
                  <span className="w-7 h-7 rounded-full bg-[#A21CAF] text-white text-xs flex items-center justify-center shrink-0 shadow-xs">
                    📐
                  </span>
                  <span className="text-xs font-bold text-[#86198F] dark:text-fuchsia-300 truncate">
                    SciPy Stats
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom CTA Row */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToTool('directory', 'All');
                }}
                className="group px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>Open Tools Workbench</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-xs font-bold text-[#5B21B6] dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>9 Toolchains</span>
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
