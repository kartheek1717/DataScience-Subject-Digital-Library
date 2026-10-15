import React, { useState, useMemo, useEffect } from 'react';
import { useLab } from '../context/LabContext';
import { 
  CURRICULUM_MODULES, 
  TOTAL_CURRICULUM_PERIODS,
  CurriculumModule 
} from '../data/modulesData';
import { 
  Search, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Copy, 
  Check, 
  FlaskConical, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  SlidersHorizontal,
  FileText,
  Sparkles,
  Layers,
  CheckCircle2,
  Play
} from 'lucide-react';
import { ModulePdfViewer } from './modules/ModulePdfViewer';
import { ModuleResourcesList } from './modules/ModuleResourcesList';
import { MODULE_CURATED_RESOURCES } from '../data/moduleResourcesData';

interface ModuleColorPalette {
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentText: string;
  accentHover: string;
  primaryBtn: string;
  secondaryPill: string;
  syllabusBox: string;
  syllabusHeader: string;
  topicCardBorder: string;
  topicBadge: string;
  bulletColor: string;
  keywordPill: string;
  outcomesBox: string;
  checkColor: string;
  labBorder: string;
  labBadge: string;
  labCta: string;
  studyTabActive: string;
  indicatorColor: string;
}

const getModuleColorPalette = (moduleNumber: number): ModuleColorPalette => {
  switch (moduleNumber) {
    case 1:
      return {
        cardBg: 'bg-[#F4F9FE] dark:bg-[#0B1E2E]',
        cardBorder: 'border-sky-200/90 hover:border-sky-400 dark:border-sky-900/60',
        badgeBg: 'bg-sky-100 dark:bg-sky-950/70',
        badgeText: 'text-sky-800 dark:text-sky-200',
        badgeBorder: 'border-sky-200 dark:border-sky-800',
        accentText: 'text-sky-700 dark:text-sky-300',
        accentHover: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
        primaryBtn: 'bg-sky-500 hover:bg-sky-600 text-white',
        secondaryPill: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/80',
        syllabusBox: 'bg-sky-50/80 dark:bg-sky-950/30 border-l-4 border-sky-500 text-sky-950 dark:text-sky-100',
        syllabusHeader: 'text-sky-700 dark:text-sky-300',
        topicCardBorder: 'border-sky-100/90 dark:border-sky-950/80 hover:border-sky-300',
        topicBadge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
        bulletColor: 'text-sky-500',
        keywordPill: 'bg-sky-50/80 hover:bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200 border-sky-200/70 hover:border-sky-300',
        outcomesBox: 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/40',
        checkColor: 'text-sky-600 dark:text-sky-400',
        labBorder: 'border-sky-200/80 hover:border-sky-400',
        labBadge: 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-200',
        labCta: 'text-sky-600 dark:text-sky-400',
        studyTabActive: 'bg-white dark:bg-[#07141F] text-sky-700 dark:text-sky-300 border-sky-200',
        indicatorColor: '#0284C7'
      };
    case 2:
      return {
        cardBg: 'bg-[#FFFBF5] dark:bg-[#0B1E2E]',
        cardBorder: 'border-orange-200/90 hover:border-orange-400 dark:border-orange-950/60',
        badgeBg: 'bg-orange-100 dark:bg-orange-950/70',
        badgeText: 'text-orange-800 dark:text-orange-200',
        badgeBorder: 'border-orange-200 dark:border-orange-800',
        accentText: 'text-orange-700 dark:text-orange-300',
        accentHover: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
        primaryBtn: 'bg-orange-500 hover:bg-orange-600 text-white',
        secondaryPill: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200/80',
        syllabusBox: 'bg-orange-50/80 dark:bg-orange-950/30 border-l-4 border-orange-500 text-orange-950 dark:text-orange-100',
        syllabusHeader: 'text-orange-700 dark:text-orange-300',
        topicCardBorder: 'border-orange-100/90 dark:border-orange-950/80 hover:border-orange-300',
        topicBadge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
        bulletColor: 'text-orange-500',
        keywordPill: 'bg-orange-50/80 hover:bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-200 border-orange-200/70 hover:border-orange-300',
        outcomesBox: 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/40',
        checkColor: 'text-orange-600 dark:text-orange-400',
        labBorder: 'border-orange-200/80 hover:border-orange-400',
        labBadge: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200',
        labCta: 'text-orange-600 dark:text-orange-400',
        studyTabActive: 'bg-white dark:bg-[#07141F] text-orange-700 dark:text-orange-300 border-orange-200',
        indicatorColor: '#EA580C'
      };
    case 3:
      return {
        cardBg: 'bg-[#F4F9FE] dark:bg-[#0B1E2E]',
        cardBorder: 'border-sky-200/90 hover:border-sky-400 dark:border-sky-900/60',
        badgeBg: 'bg-sky-100 dark:bg-sky-950/70',
        badgeText: 'text-sky-800 dark:text-sky-200',
        badgeBorder: 'border-sky-200 dark:border-sky-800',
        accentText: 'text-sky-700 dark:text-sky-300',
        accentHover: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
        primaryBtn: 'bg-sky-500 hover:bg-sky-600 text-white',
        secondaryPill: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/80',
        syllabusBox: 'bg-sky-50/80 dark:bg-sky-950/30 border-l-4 border-sky-500 text-sky-950 dark:text-sky-100',
        syllabusHeader: 'text-sky-700 dark:text-sky-300',
        topicCardBorder: 'border-sky-100/90 dark:border-sky-950/80 hover:border-sky-300',
        topicBadge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
        bulletColor: 'text-sky-500',
        keywordPill: 'bg-sky-50/80 hover:bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200 border-sky-200/70 hover:border-sky-300',
        outcomesBox: 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/40',
        checkColor: 'text-sky-600 dark:text-sky-400',
        labBorder: 'border-sky-200/80 hover:border-sky-400',
        labBadge: 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-200',
        labCta: 'text-sky-600 dark:text-sky-400',
        studyTabActive: 'bg-white dark:bg-[#07141F] text-sky-700 dark:text-sky-300 border-sky-200',
        indicatorColor: '#0284C7'
      };
    case 4:
      return {
        cardBg: 'bg-[#FFFBF5] dark:bg-[#0B1E2E]',
        cardBorder: 'border-orange-200/90 hover:border-orange-400 dark:border-orange-950/60',
        badgeBg: 'bg-orange-100 dark:bg-orange-950/70',
        badgeText: 'text-orange-800 dark:text-orange-200',
        badgeBorder: 'border-orange-200 dark:border-orange-800',
        accentText: 'text-orange-700 dark:text-orange-300',
        accentHover: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
        primaryBtn: 'bg-orange-500 hover:bg-orange-600 text-white',
        secondaryPill: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200/80',
        syllabusBox: 'bg-orange-50/80 dark:bg-orange-950/30 border-l-4 border-orange-500 text-orange-950 dark:text-orange-100',
        syllabusHeader: 'text-orange-700 dark:text-orange-300',
        topicCardBorder: 'border-orange-100/90 dark:border-orange-950/80 hover:border-orange-300',
        topicBadge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
        bulletColor: 'text-orange-500',
        keywordPill: 'bg-orange-50/80 hover:bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-200 border-orange-200/70 hover:border-orange-300',
        outcomesBox: 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/40',
        checkColor: 'text-orange-600 dark:text-orange-400',
        labBorder: 'border-orange-200/80 hover:border-orange-400',
        labBadge: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200',
        labCta: 'text-orange-600 dark:text-orange-400',
        studyTabActive: 'bg-white dark:bg-[#07141F] text-orange-700 dark:text-orange-300 border-orange-200',
        indicatorColor: '#EA580C'
      };
    case 5:
    default:
      return {
        cardBg: 'bg-gradient-to-br from-[#FFFBF5] via-[#FFFDF9] to-[#F4F9FE] dark:bg-[#0B1E2E]',
        cardBorder: 'border-orange-200/90 hover:border-sky-400 dark:border-slate-800',
        badgeBg: 'bg-gradient-to-r from-orange-100 to-sky-100 dark:bg-slate-800',
        badgeText: 'text-slate-800 dark:text-slate-200',
        badgeBorder: 'border-orange-200 dark:border-slate-700',
        accentText: 'text-orange-700 dark:text-orange-300',
        accentHover: 'group-hover:text-orange-600 dark:group-hover:text-sky-400',
        primaryBtn: 'bg-gradient-to-r from-orange-500 to-sky-500 hover:from-orange-600 hover:to-sky-600 text-white',
        secondaryPill: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200/80',
        syllabusBox: 'bg-orange-50/80 dark:bg-orange-950/30 border-l-4 border-orange-500 text-orange-950 dark:text-orange-100',
        syllabusHeader: 'text-orange-700 dark:text-orange-300',
        topicCardBorder: 'border-orange-100/90 dark:border-slate-800 hover:border-sky-300',
        topicBadge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
        bulletColor: 'text-orange-500',
        keywordPill: 'bg-orange-50/80 hover:bg-sky-50 text-slate-800 dark:text-slate-200 border-orange-200/70 hover:border-sky-300',
        outcomesBox: 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/40',
        checkColor: 'text-sky-600 dark:text-sky-400',
        labBorder: 'border-orange-200/80 hover:border-sky-400',
        labBadge: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200',
        labCta: 'text-orange-600 dark:text-orange-400',
        studyTabActive: 'bg-white dark:bg-[#07141F] text-orange-700 dark:text-orange-300 border-orange-200',
        indicatorColor: '#F97316'
      };
  }
};

export const ModulesView: React.FC = () => {
  const { 
    experiments, 
    setCurrentTab, 
    setSelectedExpId, 
    setSelectedSubExpId,
    selectedModuleNumber,
    setSelectedModuleNumber,
    moduleNavTrigger,
    navigateToExperiment,
    addToast 
  } = useLab();

  const [search, setSearch] = useState('');
  
  // Accordion state: by default, all modules are closed (only open when clicked or specifically targeted)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    if (selectedModuleNumber && selectedModuleNumber !== 'all') {
      return {
        'module-1': selectedModuleNumber === 1,
        'module-2': selectedModuleNumber === 2,
        'module-3': selectedModuleNumber === 3,
        'module-4': selectedModuleNumber === 4,
        'module-5': selectedModuleNumber === 5,
      };
    }
    return {
      'module-1': false,
      'module-2': false,
      'module-3': false,
      'module-4': false,
      'module-5': false,
    };
  });

  // Keywords "+X more" state per module
  const [expandedKeywords, setExpandedKeywords] = useState<Record<string, boolean>>({});

  // Active study media tab per module: 'pdf' vs 'resources'
  const [moduleStudyTabs, setModuleStudyTabs] = useState<Record<string, 'pdf' | 'resources'>>({});
  const setModuleStudyTab = (moduleId: string, tab: 'pdf' | 'resources') => {
    setModuleStudyTabs(prev => ({ ...prev, [moduleId]: tab }));
  };
  
  const [copiedModuleId, setCopiedModuleId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Sync when selectedModuleNumber changes externally (e.g. from Home page click)
  useEffect(() => {
    if (selectedModuleNumber && selectedModuleNumber !== 'all') {
      setSearch(''); // Clear search filter so targeted module is visible
      setExpandedModules(prev => ({
        ...prev,
        [`module-${selectedModuleNumber}`]: true
      }));

      const tryScroll = () => {
        const el = document.getElementById(`module-${selectedModuleNumber}`);
        if (el) {
          const yOffset = -110;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      };

      const timer1 = setTimeout(tryScroll, 100);
      const timer2 = setTimeout(tryScroll, 350);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else if (selectedModuleNumber === 'all') {
      setSearch('');
      setExpandedModules({
        'module-1': false,
        'module-2': false,
        'module-3': false,
        'module-4': false,
        'module-5': false,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedModuleNumber, moduleNavTrigger]);

  // Toggle single module accordion
  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Check if all modules are currently expanded
  const areAllExpanded = useMemo(() => {
    return CURRICULUM_MODULES.every(m => expandedModules[m.id]);
  }, [expandedModules]);

  // Toggle all modules
  const handleToggleAll = () => {
    const nextState = !areAllExpanded;
    const updated: Record<string, boolean> = {};
    CURRICULUM_MODULES.forEach(m => {
      updated[m.id] = nextState;
    });
    setExpandedModules(updated);
  };

  // Jump to specific module via compact sticky navigation
  const handleJumpToModule = (moduleId: string, moduleNum: number) => {
    setSelectedModuleNumber(moduleNum);
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: true
    }));

    const el = document.getElementById(moduleId);
    if (el) {
      const yOffset = -110;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Toggle keyword pills expansion (+X more)
  const toggleKeywords = (moduleId: string) => {
    setExpandedKeywords(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Filter modules based on search query
  const filteredModules = useMemo(() => {
    if (!search.trim()) return CURRICULUM_MODULES;

    const q = search.toLowerCase();
    return CURRICULUM_MODULES.filter(mod => {
      const inTitle = mod.title.toLowerCase().includes(q);
      const inSyllabus = mod.syllabusRaw.toLowerCase().includes(q);
      const inOverview = mod.overview.toLowerCase().includes(q);
      const inTopics = mod.allTopics.some(t => t.toLowerCase().includes(q));
      const inSections = mod.sections.some(s => 
        s.heading.toLowerCase().includes(q) || 
        s.topics.some(t => t.toLowerCase().includes(q))
      );
      const inOutcomes = mod.learningOutcomes.some(o => o.toLowerCase().includes(q));
      const inExps = mod.relatedExperiments.some(e => 
        e.title.toLowerCase().includes(q) || 
        e.technology.toLowerCase().includes(q)
      );

      return inTitle || inSyllabus || inOverview || inTopics || inSections || inOutcomes || inExps;
    });
  }, [search]);

  // Automatically expand modules that have active search matches
  useEffect(() => {
    if (search.trim()) {
      const updated: Record<string, boolean> = {};
      filteredModules.forEach(m => {
        updated[m.id] = true;
      });
      setExpandedModules(prev => ({ ...prev, ...updated }));
    }
  }, [search, filteredModules]);

  // Copy full syllabus text
  const handleCopyFullSyllabus = () => {
    const fullText = CURRICULUM_MODULES.map(m => 
      `${m.code}: ${m.title} (${m.periods} Periods)\n${m.syllabusRaw}\n`
    ).join('\n') + `\nTotal Periods: ${TOTAL_CURRICULUM_PERIODS}`;

    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    addToast('Complete 5-Module Syllabus copied to clipboard!', 'success');
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Copy single module syllabus
  const handleCopyModule = (e: React.MouseEvent, mod: CurriculumModule) => {
    e.stopPropagation();
    const text = `${mod.code}: ${mod.title} (${mod.periods} Periods)\n${mod.syllabusRaw}`;
    navigator.clipboard.writeText(text);
    setCopiedModuleId(mod.id);
    addToast(`${mod.code} syllabus copied to clipboard!`, 'success');
    setTimeout(() => setCopiedModuleId(null), 2500);
  };

  // Launch mapped experiment
  const handleLaunchExperiment = (expId: string) => {
    navigateToExperiment(expId, 'details');
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto animate-in fade-in duration-300 pb-16">
      
      {/* ============================================================ */}
      {/* 1. TOP HEADER: LIGHT ORANGE & SKY BLUE DUAL BANNER           */}
      {/* ============================================================ */}
      <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-orange-50/80 via-[#FFFDF9] to-sky-50/80 dark:from-[#0B1E2E] dark:via-[#0E2436] dark:to-[#0A2030] border border-orange-200/70 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
        {/* Soft background ambient radial glows */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Breadcrumb & Course Metadata Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800">
              <GraduationCap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Course Code: 22DS102006</span>
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 font-medium border border-orange-200/70 dark:border-orange-800">
              Academic Year: 2025–2026
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-xs">
              <Clock className="w-3 h-3" />
              <span>45 Total Periods</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFullSyllabus}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-orange-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-xs font-bold text-orange-800 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
              title="Copy complete syllabus"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-orange-600" /> : <Copy className="w-3.5 h-3.5 text-orange-500" />}
              <span>{copiedAll ? 'Syllabus Copied' : 'Copy Syllabus'}</span>
            </button>
            <button
              onClick={() => setCurrentTab('experiments')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Lab Practicals</span>
            </button>
          </div>
        </div>

        {/* Title & Concise Subtitle */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>Data Science Curriculum Modules</span>
              <Sparkles className="w-5 h-5 text-orange-500" />
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Official university curriculum spanning 45 instructional periods across 5 core modules, seamlessly aligned with hands-on Python laboratory experiments.
            </p>
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics, concepts, algorithms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-sky-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500 shadow-2xs transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. COMPACT STICKY MODULE NAVIGATION BAR                      */}
      {/* ============================================================ */}
      <div className="sticky top-18 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2.5 bg-[#FFFDF9]/95 dark:bg-[#07141F]/95 backdrop-blur-md border-y border-orange-200/70 dark:border-slate-800/80 shadow-2xs">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          
          {/* Quick Jump Module Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 mr-1 hidden lg:inline">
              Jump:
            </span>

            {CURRICULUM_MODULES.map((m) => {
              const isExpanded = expandedModules[m.id];
              const isOdd = m.number % 2 !== 0;
              return (
                <button
                  key={m.id}
                  onClick={() => handleJumpToModule(m.id, m.number)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isExpanded
                      ? isOdd 
                        ? 'bg-sky-500 text-white shadow-xs' 
                        : 'bg-orange-500 text-white shadow-xs'
                      : isOdd
                        ? 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80'
                        : 'bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200/80'
                  }`}
                  title={`Jump to ${m.code}: ${m.title}`}
                >
                  <span>M{m.number}: {m.title.split(' ')[0]}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isExpanded ? 'bg-white/25 text-white' : isOdd ? 'bg-sky-100 text-sky-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {m.periods}P
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: Expand All / Collapse All */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleAll}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 text-orange-800 dark:text-orange-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {areAllExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-orange-600" />
                  <span>Collapse All</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-orange-600" />
                  <span>Expand All</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Active search filter notice */}
      {search && (
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Showing results matching "<strong>{search}</strong>" across {filteredModules.length} module{filteredModules.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setSearch('')}
            className="text-orange-600 dark:text-orange-400 hover:underline font-semibold"
          >
            Clear search
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. ACCORDION-STYLE MODULE CARDS LIST (LIGHT ORANGE & SKY BLUE) */}
      {/* ============================================================ */}
      <div className="space-y-4">
        {filteredModules.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFDF9] dark:bg-[#0B1E2E] rounded-3xl border border-orange-200 dark:border-slate-800 p-8">
            <Search className="w-10 h-10 text-orange-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No matching topics found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              We couldn't find any curriculum topics matching "{search}". Try searching for SVD, Entropy, PMF, or Seaborn.
            </p>
            <button
              onClick={() => setSearch('')}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 cursor-pointer shadow-xs"
            >
              Clear Search
            </button>
          </div>
        ) : (
          filteredModules.map((module) => {
            const isExpanded = expandedModules[module.id] ?? false;
            const periodPercentage = ((module.periods / TOTAL_CURRICULUM_PERIODS) * 100).toFixed(1);
            
            const isKeywordsExpanded = expandedKeywords[module.id] ?? false;
            const initialKeywordLimit = 7;
            const visibleKeywords = isKeywordsExpanded 
              ? module.allTopics 
              : module.allTopics.slice(0, initialKeywordLimit);
            const extraKeywordsCount = module.allTopics.length - initialKeywordLimit;

            const currentStudyTab = moduleStudyTabs[module.id] || 'pdf';
            const moduleResources = MODULE_CURATED_RESOURCES[module.number] || [];
            const palette = getModuleColorPalette(module.number);

            return (
              <div
                id={module.id}
                key={module.id}
                className={`rounded-3xl border shadow-sm transition-all overflow-hidden scroll-mt-32 ${palette.cardBg} ${palette.cardBorder}`}
              >
                
                {/* ---------------------------------------------------- */}
                {/* MODULE HEADER BAR                                    */}
                {/* ---------------------------------------------------- */}
                <div
                  onClick={() => toggleModule(module.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-black/[0.015] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Module Number Accent Badge */}
                    <div className="shrink-0 pt-0.5">
                      <span className={`inline-block text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-xl border shadow-2xs ${palette.badgeBg} ${palette.badgeText} ${palette.badgeBorder}`}>
                        {module.code}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {/* Visually Dominant Module Title */}
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <span>{module.title}</span>
                      </h2>

                      {/* Periods, Percentage & Quick Meta */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                        <span className={`font-bold px-2 py-0.5 rounded-md border ${palette.secondaryPill}`}>
                          {module.periods} Periods
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-sky-700 dark:text-sky-300">
                          {periodPercentage}% of Curriculum
                        </span>
                        <span>•</span>
                        <span className="text-orange-700 dark:text-orange-300 font-semibold">
                          {module.relatedExperiments.length} Linked Practical{module.relatedExperiments.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Collapsed One-Line Snippet Preview */}
                      {!isExpanded && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 pt-1 font-sans">
                          {module.overview}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Expand/Collapse Control & Copy */}
                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    <button
                      onClick={(e) => handleCopyModule(e, module)}
                      className="p-2 rounded-xl text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-slate-800 transition-colors"
                      title="Copy module syllabus"
                    >
                      {copiedModuleId === module.id ? (
                        <Check className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <div className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs ${
                      isExpanded 
                        ? `${palette.primaryBtn}` 
                        : `border ${palette.secondaryPill}`
                    }`}>
                      <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-white" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* EXPANDED CONTENT                                     */}
                {/* ---------------------------------------------------- */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 space-y-6 border-t border-slate-200/50 dark:border-slate-800/80 animate-in fade-in duration-200">
                    
                    {/* A. PRESCRIBED CURRICULUM SYLLABUS SECTION */}
                    <div className={`p-4 sm:p-5 rounded-2xl space-y-2 ${palette.syllabusBox}`}>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className={`font-bold uppercase tracking-wider flex items-center gap-1.5 ${palette.syllabusHeader}`}>
                          <FileText className="w-3.5 h-3.5" />
                          <span>Prescribed Curriculum</span>
                        </span>
                        <span className="opacity-75 font-semibold">
                          Duration: {module.periods} Instructional Periods
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed font-sans font-medium">
                        {module.syllabusRaw}
                      </p>
                    </div>

                    {/* B. CURRICULUM TOPICS & CONCEPTUAL BREAKDOWN */}
                    <div className="space-y-3">
                      <h3 className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${palette.accentText}`}>
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Curriculum Topics &amp; Conceptual Breakdown</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {module.sections.map((section, sIdx) => (
                          <div 
                            key={sIdx}
                            className={`p-4 rounded-2xl bg-white dark:bg-slate-900/60 border space-y-2.5 shadow-2xs ${palette.topicCardBorder}`}
                          >
                            <div className="text-xs font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-md text-[11px] font-mono font-bold flex items-center justify-center shrink-0 ${palette.topicBadge}`}>
                                {sIdx + 1}
                              </span>
                              <span className="line-clamp-1">{section.heading}</span>
                            </div>

                            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                              {section.topics.map((t, tIdx) => {
                                const isMatched = search && t.toLowerCase().includes(search.toLowerCase());
                                return (
                                  <li 
                                    key={tIdx}
                                    className={`flex items-start gap-2 ${
                                      isMatched ? 'text-orange-700 dark:text-orange-300 font-bold bg-orange-100/70 dark:bg-orange-950/40 px-1 py-0.5 rounded' : ''
                                    }`}
                                  >
                                    <span className={`${palette.bulletColor} mt-1 text-xs`}>•</span>
                                    <span className="leading-snug">{t}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* C. KEY CONCEPTS & KEYWORDS (WITH +X MORE EXPANSION) */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className={`font-bold uppercase tracking-wider ${palette.accentText}`}>
                          Key Concepts &amp; Keywords ({module.allTopics.length})
                        </span>
                        {extraKeywordsCount > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleKeywords(module.id)}
                            className="text-orange-700 dark:text-orange-400 hover:underline font-bold cursor-pointer"
                          >
                            {isKeywordsExpanded ? 'Show fewer' : `+${extraKeywordsCount} more keywords`}
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 items-center">
                        {visibleKeywords.map((topic, kIdx) => {
                          const isMatched = search && topic.toLowerCase().includes(search.toLowerCase());
                          return (
                            <span
                              key={kIdx}
                              onClick={() => setSearch(topic)}
                              className={`text-xs px-2.5 py-1 rounded-xl font-sans font-medium transition-all cursor-pointer border shadow-2xs ${
                                isMatched
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold border-orange-600 shadow-xs'
                                  : `${palette.keywordPill}`
                              }`}
                              title={`Filter by "${topic}"`}
                            >
                              {topic}
                            </span>
                          );
                        })}

                        {extraKeywordsCount > 0 && !isKeywordsExpanded && (
                          <button
                            type="button"
                            onClick={() => toggleKeywords(module.id)}
                            className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-orange-100/70 hover:bg-orange-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-orange-800 dark:text-orange-300 transition-colors cursor-pointer"
                          >
                            +{extraKeywordsCount} more
                          </button>
                        )}
                      </div>
                    </div>

                    {/* D. EXPECTED COMPETENCIES & LEARNING OUTCOMES */}
                    <div className="pt-2 space-y-2">
                      <h3 className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${palette.accentText}`}>
                        <CheckCircle2 className={`w-3.5 h-3.5 ${palette.checkColor}`} />
                        <span>Expected Competencies &amp; Learning Outcomes</span>
                      </h3>

                      <div className={`p-4 rounded-2xl space-y-2 ${palette.outcomesBox}`}>
                        {module.learningOutcomes.map((outcome, oIdx) => (
                          <div key={oIdx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                            <span className={`${palette.checkColor} font-bold mt-0.5 text-sm shrink-0`}>✓</span>
                            <span className="leading-relaxed">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* E. MAPPED HANDS-ON LABORATORY PRACTICALS */}
                    {module.relatedExperiments.length > 0 && (
                      <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={`font-bold uppercase tracking-wider flex items-center gap-1.5 ${palette.accentText}`}>
                            <FlaskConical className="w-3.5 h-3.5" />
                            <span>LAB PRACTICALS</span>
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 font-semibold">
                            {module.relatedExperiments.length} Linked Experiment{module.relatedExperiments.length > 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {module.relatedExperiments.map((relExp) => (
                            <div
                              key={relExp.id}
                              onClick={() => handleLaunchExperiment(relExp.id)}
                              className={`p-4 rounded-2xl border bg-white dark:bg-slate-900/60 transition-all cursor-pointer group flex flex-col justify-between shadow-2xs hover:shadow-md ${palette.labBorder}`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-mono">
                                  <span className={`font-bold px-2.5 py-0.5 rounded-lg border ${palette.labBadge}`}>
                                    Experiment {relExp.displayNumber}
                                  </span>
                                  <span className="text-slate-500 font-semibold">
                                    {relExp.technology}
                                  </span>
                                </div>

                                <h4 className={`text-base font-bold text-slate-900 dark:text-white transition-colors leading-snug group-hover:${palette.accentText}`}>
                                  {relExp.title}
                                </h4>

                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                  {relExp.description}
                                </p>
                              </div>

                              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                <span className="font-mono text-slate-400">
                                  Python 3.10 Lab
                                </span>
                                <span className={`px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 font-bold inline-flex items-center gap-1 border border-slate-200/60 dark:border-slate-700 shadow-2xs group-hover:scale-105 transition-all ${palette.labCta}`}>
                                  <span>Practice in Lab</span>
                                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* F. STUDY MATERIAL & CURATED LEARNING HUB (PDF & VIDEOS/READINGS) */}
                    {(module.pdfUrl || moduleResources.length > 0) && (
                      <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800 space-y-3.5">
                        
                        {/* Section Header with Tabs */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 ${palette.accentText}`}>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Course Study Materials &amp; Media</span>
                            </span>
                          </div>

                          {/* Tab Selector Pills */}
                          <div className="flex items-center gap-1 p-1 rounded-xl bg-orange-100/60 dark:bg-slate-900 border border-orange-200/60 dark:border-slate-800 self-start sm:self-center">
                            {module.pdfUrl && (
                              <button
                                type="button"
                                onClick={() => setModuleStudyTab(module.id, 'pdf')}
                                className={`min-h-[32px] px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  currentStudyTab === 'pdf'
                                    ? `${palette.studyTabActive} shadow-2xs border`
                                    : 'text-slate-600 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Lecture Notes (PDF)</span>
                                {module.pdfPages && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold">
                                    {module.pdfPages}p
                                  </span>
                                )}
                              </button>
                            )}

                            {moduleResources.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setModuleStudyTab(module.id, 'resources')}
                                className={`min-h-[32px] px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  currentStudyTab === 'resources'
                                    ? `${palette.studyTabActive} shadow-2xs border`
                                    : 'text-slate-600 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                <Play className="w-3.5 h-3.5 text-rose-500 fill-current" />
                                <span>Videos &amp; Readings</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold">
                                  {moduleResources.length}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Content Tab 1: PDF Viewer */}
                        {currentStudyTab === 'pdf' && module.pdfUrl && (
                          <ModulePdfViewer
                            moduleNumber={module.number}
                            moduleCode={module.code}
                            moduleTitle={module.title}
                            pdfUrl={module.pdfUrl}
                            totalPages={module.pdfPages}
                            accentColor={palette.indicatorColor}
                          />
                        )}

                        {/* Content Tab 2: Curated Video Tutorials & Reading Resources */}
                        {currentStudyTab === 'resources' && moduleResources.length > 0 && (
                          <ModuleResourcesList
                            resources={moduleResources}
                            moduleCode={module.code}
                            moduleTitle={module.title}
                          />
                        )}

                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* ============================================================ */}
      {/* 4. CURRICULUM PERIOD DISTRIBUTION BREAKDOWN (BOTTOM)         */}
      {/* ============================================================ */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-50/60 via-[#FFFDF9] to-sky-50/60 dark:bg-[#0B1E2E] border border-orange-200/80 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Instructional Periods Distribution (45 Periods)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              100% of theoretical curriculum and laboratory alignment accounted for across 5 modules.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full bg-orange-100/70 border border-orange-200">
            Total: 45 Periods
          </span>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div className="h-3.5 w-full rounded-full bg-slate-200/60 dark:bg-slate-800 overflow-hidden flex shadow-inner">
          {CURRICULUM_MODULES.map((m) => {
            const widthPct = (m.periods / TOTAL_CURRICULUM_PERIODS) * 100;
            const palette = getModuleColorPalette(m.number);
            return (
              <div
                key={m.id}
                style={{ width: `${widthPct}%`, backgroundColor: palette.indicatorColor }}
                className="h-full relative group transition-all hover:brightness-110"
                title={`${m.code}: ${m.title} (${m.periods} Periods, ${widthPct.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Mini Legend Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {CURRICULUM_MODULES.map((m) => {
            const palette = getModuleColorPalette(m.number);
            return (
              <button
                key={m.id}
                onClick={() => handleJumpToModule(m.id, m.number)}
                className={`p-3 rounded-2xl border text-left hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-2xs ${palette.cardBg} ${palette.cardBorder}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs" 
                    style={{ backgroundColor: palette.indicatorColor }}
                  />
                  <span className={`text-[11px] font-mono font-bold truncate ${palette.accentText}`}>
                    {m.code}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {m.title}
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  {m.periods} Periods ({((m.periods / TOTAL_CURRICULUM_PERIODS) * 100).toFixed(1)}%)
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
