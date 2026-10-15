import React, { useState, useMemo, useEffect } from 'react';
import { Experiment, DuplicateOptions } from '../../types';
import { useLab } from '../../context/LabContext';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  ChevronRight, 
  Eye, 
  Plus, 
  MoreVertical, 
  Pencil, 
  Copy, 
  Layers, 
  Trash2, 
  Archive, 
  ArchiveRestore, 
  Globe, 
  Award, 
  Check, 
  LayoutGrid, 
  StretchHorizontal,
  Clock,
  Code2,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { DuplicateExperimentModal } from './DuplicateExperimentModal';
import { ReorderModal } from './ReorderModal';
import { ConfirmationDialog } from './ConfirmationDialog';
import { CoverPhotoModal } from './CoverPhotoModal';
import { BreadcrumbNav } from './BreadcrumbNav';

// Professional educational cover images tailored specifically to each experiment subject
const EXPERIMENT_COVERS: Record<string, string> = {
  'exp-1': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', // Exp 01: CSV, JSON, Excel, tabular data & Pandas DataFrames
  'exp-2': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', // Exp 02: REST APIs, database servers & network endpoints
  'exp-3': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', // Exp 03: Messy-to-clean data, quality validation & outlier detection
  'exp-4': 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80', // Exp 04: Data wrangling, MultiIndex reshaping & relational table joins
  'exp-5': 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=80', // Exp 05: Statistical visualization, bar charts, line plots & scatter plots
  'exp-6': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80', // Exp 06: Time series, chronological date trends & frequency resampling
  'exp-7': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', // Exp 07: Data aggregation, groupby matrices, pivot tables & summaries
  'exp-8': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', // Exp 08: Product reviews, customer feedback ratings & text sentiment analysis
  'exp-9': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80', // Exp 09: Customer personality personas, K-Means clusters (NOT trading!)
  'exp-10': 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80', // Exp 10: NLP emotion detection, language vectors (NOT trading!)
};

interface ExperimentsDashboardProps {
  onSelectExperiment: (expId: string) => void;
  onOpenDirectPart?: (expId: string, subExpId: string) => void;
  onAddExperiment: () => void;
  onEditExperiment: (expId: string) => void;
  onManageParts: (expId: string) => void;
}

export const ExperimentsDashboard: React.FC<ExperimentsDashboardProps> = ({
  onSelectExperiment,
  onOpenDirectPart,
  onAddExperiment,
  onEditExperiment,
  onManageParts,
}) => {
  const { 
    experiments, 
    restoreInitialExperiments, 
    setCurrentTab,
    deleteExperiment,
    duplicateExperimentWithOptions,
    reorderExperiments,
    archiveExperiment,
    unarchiveExperiment,
    updateExperimentThumbnail,
    isAdmin
  } = useLab();

  const [searchQuery, setSearchQuery] = useState('');
  const [techFilter, setTechFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'number' | 'title'>('number');
  const [showArchived, setShowArchived] = useState(false);
  const [viewLayout, setViewLayout] = useState<'detailed' | 'grid'>('detailed');

  // Active menu dropdowns
  const [activeMenuExpId, setActiveMenuExpId] = useState<string | null>(null);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

  // Modals state
  const [duplicateModalExp, setDuplicateModalExp] = useState<Experiment | null>(null);
  const [deleteConfirmExp, setDeleteConfirmExp] = useState<Experiment | null>(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [coverEditExp, setCoverEditExp] = useState<Experiment | null>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuExpId(null);
      setIsMoreOptionsOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Unique technologies
  const availableTechs = useMemo(() => {
    const set = new Set<string>();
    experiments.forEach((e) => {
      if (e.technology) set.add(e.technology);
    });
    return Array.from(set);
  }, [experiments]);

  // Filter and sort experiments
  const filteredExperiments = useMemo(() => {
    return experiments
      .filter((exp) => {
        // Archive filter
        if (!showArchived && exp.isArchived) return false;
        if (showArchived && !exp.isArchived) return false;

        // Technology filter
        if (techFilter !== 'all' && exp.technology !== techFilter) {
          return false;
        }

        // Difficulty filter
        if (difficultyFilter !== 'all' && exp.difficulty !== difficultyFilter) {
          return false;
        }

        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const matchesTitle = exp.title.toLowerCase().includes(q);
        const matchesDesc = exp.description.toLowerCase().includes(q);
        const matchesCode = exp.subjectCode?.toLowerCase().includes(q);
        const matchesTech = exp.technology?.toLowerCase().includes(q);
        const matchesSubs = exp.subExperiments?.some(
          (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
        );

        return matchesTitle || matchesDesc || matchesCode || matchesTech || matchesSubs;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        // Numeric sort by experiment number (01, 02, 03, ...)
        const numA = typeof a.number === 'number' ? a.number : parseFloat(String(a.number).replace(/[^\d.]/g, '')) || 0;
        const numB = typeof b.number === 'number' ? b.number : parseFloat(String(b.number).replace(/[^\d.]/g, '')) || 0;
        return numA - numB;
      });
  }, [experiments, searchQuery, techFilter, difficultyFilter, sortBy, showArchived]);

  // Aggregate stats
  const totalExperiments = experiments.length;
  const totalParts = useMemo(() => {
    return experiments.reduce((acc, curr) => acc + (curr.subExperiments?.length || 0), 0);
  }, [experiments]);

  return (
    <div className="space-y-7 max-w-6xl mx-auto">
      
      {/* 1. TOP BREADCRUMB & STUDENT/INSTRUCTOR VIEW PILL */}
      <div className="flex items-center justify-between">
        <BreadcrumbNav
          items={[
            { label: 'Home', onClick: () => setCurrentTab('home'), icon: 'home' },
            { label: 'Experiments', icon: 'experiments', isCurrent: true },
          ]}
        />


      </div>

      {/* 2. HEADER ROW: Title + Subtitle on Left, Curriculum Info Cards on Right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-1">
        <div className="max-w-xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2231] dark:text-white">
            Experiments
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-1.5 leading-relaxed">
            Explore, practice, and complete your Data Science laboratory experiments with verified datasets and step-by-step code.
          </p>
        </div>

        {/* Right Header Cards */}
        <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-3.5">
          {/* Card 1: Curriculum Overview */}
          <div className="bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 min-w-[220px] sm:min-w-[240px] shadow-2xs flex-1 sm:flex-initial">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-600 dark:text-slate-400">Curriculum</span>
              <span className="font-mono text-gray-900 dark:text-white font-bold">
                {totalExperiments} Lab Experiments
              </span>
            </div>

            {/* Segmented Curriculum Indicator */}
            <div 
              className="grid gap-1 my-2.5 h-2 rounded-full overflow-hidden"
              style={{ gridTemplateColumns: `repeat(${experiments.length || 10}, minmax(0, 1fr))` }}
            >
              {experiments.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="h-full rounded-xs bg-[#009F9A] opacity-90 transition-opacity"
                  title={`Exp ${idx + 1}: ${exp.title}`}
                />
              ))}
            </div>

            {/* Subtext Stats */}
            <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-slate-400">
              <span className="text-[#009F9A] dark:text-teal-400 font-semibold flex items-center gap-0.5">
                <Code2 className="w-3.5 h-3.5" /> {totalParts} Coding Parts
              </span>
              <span className="font-mono text-gray-500 dark:text-slate-400">
                Python 3.10
              </span>
            </div>
          </div>

          {/* Card 2: Featured Lab */}
          <div 
            onClick={() => {
              if (onOpenDirectPart) {
                onOpenDirectPart('exp-1', '1a');
              } else {
                onSelectExperiment('exp-1');
              }
            }}
            className="bg-[#E8F8F5] dark:bg-teal-950/40 border border-[#BDEFE7] dark:border-teal-800/60 rounded-2xl p-3.5 sm:p-4 min-w-[220px] sm:min-w-[240px] shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:shadow-md transition-all group flex-1 sm:flex-initial"
            title="Click to launch: Reading and Writing Data"
          >
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-[#008985] dark:text-teal-400 font-bold">
                Featured Lab
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white truncate mt-0.5 group-hover:text-[#009F9A] transition-colors">
                Reading and Writing Data
              </div>
              <div className="text-xs text-gray-600 dark:text-slate-300 font-medium mt-0.5">
                5 Coding Parts Available
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#009F9A] group-hover:bg-[#008783] text-white flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTER CONTROLS BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search experiments by title, topic, or part..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-[#0D1E2A] text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:border-[#009F9A] dark:focus:border-cyan-400 transition-colors shadow-2xs"
          />
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Technology Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800 px-3 py-2 rounded-xl shadow-2xs">
            <Globe className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <select
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              aria-label="Filter by technology"
              className="bg-transparent text-xs font-medium text-gray-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="all">All Technologies</option>
              {availableTechs.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800 px-3 py-2 rounded-xl shadow-2xs">
            <Award className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              aria-label="Filter by difficulty"
              className="bg-transparent text-xs font-medium text-gray-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800 px-3 py-2 rounded-xl shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort experiments"
              className="bg-transparent text-xs font-medium text-gray-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="number">Sort: Number</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>

          {/* View Layout Toggle (Detailed 3-Panel vs Grid) */}
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-0.5 rounded-xl border border-gray-200/80 dark:border-slate-700">
            <button
              onClick={() => setViewLayout('detailed')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewLayout === 'detailed'
                  ? 'bg-white dark:bg-[#0D1E2A] text-[#009F9A] dark:text-cyan-400 shadow-2xs'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
              }`}
              title="Detailed 3-Panel View for All Experiments"
            >
              <StretchHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Detailed</span>
            </button>
            <button
              onClick={() => setViewLayout('grid')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewLayout === 'grid'
                  ? 'bg-white dark:bg-[#0D1E2A] text-[#009F9A] dark:text-cyan-400 shadow-2xs'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          {/* Reorder Button (Admin Only) */}
          {isAdmin && (
            <button
              onClick={() => setIsReorderModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-[#0D1E2A] text-xs font-medium text-gray-700 dark:text-slate-300 hover:text-[#009F9A] dark:hover:text-cyan-400 shadow-2xs cursor-pointer transition-colors"
              title="Reorder Curriculum Experiments"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reorder</span>
            </button>
          )}

          {/* More Options Dropdown (⋮) */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMoreOptionsOpen(!isMoreOptionsOpen);
              }}
              className="p-2 rounded-xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-[#0D1E2A] text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white shadow-2xs cursor-pointer transition-colors"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMoreOptionsOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-10 z-40 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl py-1 text-xs animate-in fade-in duration-150"
              >
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        setIsMoreOptionsOpen(false);
                        onAddExperiment();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#009F9A]" />
                      Add Experiment
                    </button>
                    <button
                      onClick={() => {
                        setIsMoreOptionsOpen(false);
                        restoreInitialExperiments();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
                      Reset Defaults
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setIsMoreOptionsOpen(false);
                    setShowArchived(!showArchived);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 text-gray-500" />
                  {showArchived ? 'Hide Archived' : 'Show Archived'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. MAIN EXPERIMENTS LIST (DETAILED 3-PANEL VIEW FOR ALL EXPERIMENTS) */}
      {filteredExperiments.length > 0 ? (
        viewLayout === 'detailed' ? (
          <div className="space-y-6">
            {filteredExperiments.map((exp) => {
              const parts = exp.subExperiments || [];
              const totalExpParts = parts.length;
              const displayNum = exp.displayNumber || String(exp.number).padStart(2, '0');
              const isMenuOpen = activeMenuExpId === exp.id;
              const coverPhoto = exp.coverImage || EXPERIMENT_COVERS[exp.id] || exp.thumbnail;

              return (
                <div 
                  key={exp.id}
                  className="rounded-2xl bg-white dark:bg-[#0D1E2A] p-6 transition-all duration-200 shadow-2xs hover:shadow-md border border-gray-200/90 dark:border-slate-800 hover:border-[#009F9A]/50 dark:hover:border-teal-500/50"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* PANEL 1: Experiment Details & Action Button (~38% width, lg:col-span-4) */}
                    <div className="lg:col-span-4 flex flex-col justify-between">
                      <div>
                        {/* 1. Professional Cover Photo Section (Editable) */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCoverEditExp(exp);
                          }}
                          className="group/cover relative w-full h-[130px] sm:h-[135px] lg:h-[140px] rounded-2xl overflow-hidden mb-3.5 border border-gray-100 dark:border-slate-800 shadow-2xs bg-slate-100 dark:bg-slate-800 cursor-pointer"
                          title="Click to edit or change cover photo"
                        >
                          <img
                            src={coverPhoto}
                            alt={`${exp.title} cover`}
                            className="w-full h-full object-cover object-center group-hover/cover:scale-[1.03] transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent group-hover/cover:from-slate-950/60 transition-colors pointer-events-none" />

                          {/* Quick Edit Cover Button (Admin only) */}
                          {isAdmin && (
                            <div className="absolute top-2.5 right-2.5 z-10 opacity-90 group-hover/cover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCoverEditExp(exp);
                                }}
                                className="px-2.5 py-1 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
                                title="Edit cover photo"
                              >
                                <Camera className="w-3.5 h-3.5 text-teal-300" />
                                <span>Edit Cover</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 2. Number Badge, Category Pill, and Action Menu */}
                        <div className="flex items-center justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-xl font-mono text-xs font-black bg-[#0F2231] text-white shadow-2xs">
                              {displayNum}
                            </span>

                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-[#009F9A] dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 font-mono">
                              {exp.category || 'Python'}
                            </span>
                          </div>

                          {/* 3-Dot Dropdown for this Experiment */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuExpId(isMenuOpen ? null : exp.id);
                              }}
                              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              aria-label="Experiment actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-7 z-30 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl py-1 text-xs animate-in fade-in duration-150"
                              >
                                <button
                                  onClick={() => {
                                    setActiveMenuExpId(null);
                                    onSelectExperiment(exp.id);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-teal-600" />
                                  View Experiment
                                </button>
                                {isAdmin && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setActiveMenuExpId(null);
                                        setCoverEditExp(exp);
                                      }}
                                      className="w-full text-left px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Camera className="w-3.5 h-3.5 text-teal-600" />
                                      Edit Cover Photo
                                    </button>
                                    <button
                                      onClick={() => {
                                        setActiveMenuExpId(null);
                                        onEditExperiment(exp.id);
                                      }}
                                      className="w-full text-left px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Pencil className="w-3.5 h-3.5 text-blue-600" />
                                      Edit Experiment
                                    </button>
                                    <button
                                      onClick={() => {
                                        setActiveMenuExpId(null);
                                        setDuplicateModalExp(exp);
                                      }}
                                      className="w-full text-left px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-indigo-600" />
                                      Duplicate Experiment
                                    </button>
                                    <button
                                      onClick={() => {
                                        setActiveMenuExpId(null);
                                        onManageParts(exp.id);
                                      }}
                                      className="w-full text-left px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                                      Manage Parts ({totalExpParts})
                                    </button>
                                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                                    {exp.isArchived ? (
                                      <button
                                        onClick={() => {
                                          setActiveMenuExpId(null);
                                          unarchiveExperiment(exp.id);
                                        }}
                                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"
                                      >
                                        <ArchiveRestore className="w-3.5 h-3.5 text-emerald-600" />
                                        Restore Experiment
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setActiveMenuExpId(null);
                                          archiveExperiment(exp.id);
                                        }}
                                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer"
                                      >
                                        <Archive className="w-3.5 h-3.5 text-slate-500" />
                                        Archive Experiment
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        setActiveMenuExpId(null);
                                        setDeleteConfirmExp(exp);
                                      }}
                                      className="w-full text-left px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Delete Experiment
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h2 className="text-xl font-extrabold text-[#0F2231] dark:text-white mt-2 leading-tight">
                          {exp.title}
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                          {exp.description}
                        </p>

                        {/* Parts Info & Interactive Part Buttons */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-2 font-medium">
                            <span className="font-semibold text-gray-900 dark:text-white">Laboratory Parts</span>
                            <span className="font-mono text-gray-600 dark:text-slate-400">
                              {totalExpParts} Parts
                            </span>
                          </div>

                          {/* Horizontal Part Badges: [ Part A ] [ Part B ] [ Part C ] [ Part D ] [ Part E ] */}
                          <div className="flex flex-wrap items-center gap-2 my-2.5">
                            {parts.map((part, idx) => {
                              const letter = part.partLetter || String.fromCharCode(65 + idx);

                              return (
                                <button
                                  key={part.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onOpenDirectPart) {
                                      onOpenDirectPart(exp.id, part.id);
                                    } else {
                                      onSelectExperiment(exp.id);
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-gray-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/40 text-gray-700 hover:text-[#009F9A] dark:text-slate-300 dark:hover:text-teal-300 border border-gray-200/80 hover:border-teal-300 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
                                  title={`Launch Part ${letter}: ${part.title}`}
                                >
                                  Part {letter}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Key Info Metadata Badges: Technologies, Methods & Time */}
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/80 space-y-1.5 text-xs text-gray-500 dark:text-slate-400 font-medium">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 shrink-0">Technologies:</span>
                            <span className="text-gray-800 dark:text-slate-200 font-semibold truncate">{exp.technology}</span>
                          </div>
                          {exp.methods && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#009F9A] dark:text-teal-400 shrink-0">Methods:</span>
                              <span className="text-gray-700 dark:text-slate-300 truncate">{exp.methods}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {exp.estimatedDuration || '2-3 hours'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/40 text-[#008985] dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                              {exp.difficulty || 'Intermediate'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-5">
                        <button
                          onClick={() => onSelectExperiment(exp.id)}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-[#009F9A] hover:bg-[#008783] text-white shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer group/cta"
                        >
                          <span>Open Experiment</span>
                          <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* PANEL 2: Part Details List (Expanded width to prevent title truncation, lg:col-span-5) */}
                    <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-slate-800 pt-5 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-[#0F2231] dark:text-white">
                            <span>📖</span>
                            <span>Part Details</span>
                          </div>
                          <button
                            onClick={() => onSelectExperiment(exp.id)}
                            className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 hover:bg-[#009F9A] text-[#009F9A] hover:text-white dark:text-cyan-400 dark:hover:text-white border border-teal-200/60 dark:border-teal-800 text-xs font-semibold cursor-pointer flex items-center gap-1 transition-all shadow-2xs group/all"
                          >
                            <span>View All Parts</span>
                            <ArrowRight className="w-3 h-3 group-hover/all:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        {/* Vertical Part list: full two-line wrapped titles, zero truncation */}
                        <div className="space-y-1.5">
                          {parts.map((part, idx) => {
                            const letter = part.partLetter || String.fromCharCode(65 + idx);

                            return (
                              <div
                                key={part.id}
                                onClick={() => {
                                  if (onOpenDirectPart) {
                                    onOpenDirectPart(exp.id, part.id);
                                  } else {
                                    onSelectExperiment(exp.id);
                                  }
                                }}
                                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-teal-50/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group border border-transparent hover:border-teal-200/60 dark:hover:border-teal-900/40"
                              >
                                <div className="flex items-start gap-2.5 min-w-0 pr-2 flex-1">
                                  <span className="font-mono font-bold text-xs text-[#009F9A] dark:text-cyan-400 shrink-0 mt-0.5">
                                    Part {letter}
                                  </span>
                                  <span 
                                    title={part.title}
                                    className="text-xs text-gray-700 dark:text-slate-300 leading-snug line-clamp-2 break-words group-hover:text-[#009F9A] transition-colors"
                                  >
                                    {part.title}
                                  </span>
                                </div>

                                <div className="shrink-0 flex items-center pl-1.5">
                                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-[#009F9A] group-hover:text-white group-hover:scale-105 border border-transparent group-hover:border-teal-300 dark:group-hover:border-teal-600 flex items-center justify-center transition-all shadow-2xs">
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* PANEL 3: Experiment Overview & Learnings (lg:col-span-3) */}
                    <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-slate-800 pt-5 lg:pt-0 lg:pl-6">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-[#0F2231] dark:text-white mb-3.5">
                        <span>📋</span>
                        <span>Experiment Overview</span>
                      </div>

                      {/* Structured Metadata Rows */}
                      <div className="space-y-2.5">
                        <div className="flex flex-col gap-0.5 text-xs py-0.5">
                          <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider">
                            <Globe className="w-3.5 h-3.5 text-gray-400" />
                            Technologies
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white leading-tight">
                            {exp.technology || 'Python'}
                          </span>
                        </div>

                        {exp.methods && (
                          <div className="flex flex-col gap-0.5 text-xs py-0.5">
                            <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider">
                              <Code2 className="w-3.5 h-3.5 text-[#009F9A]" />
                              Methods
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white leading-tight">
                              {exp.methods}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs py-0.5">
                          <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-gray-400" />
                            Difficulty
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-[11px]">
                            {exp.difficulty || 'Beginner'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs py-0.5">
                          <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            Estimated Time
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {exp.estimatedDuration || '2-3 hours'}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100 dark:border-slate-800 my-2.5" />

                        {/* What you'll learn */}
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">
                            What you'll learn
                          </h4>
                          <ul className="space-y-1.5">
                            {(exp.learningObjectives && exp.learningObjectives.length > 0
                              ? exp.learningObjectives.slice(0, 4)
                              : [
                                  'Core algorithmic concepts & implementations',
                                  'Data processing & verified test cases',
                                  'Practical analysis and performance metrics'
                                ]
                            ).map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-slate-300 leading-snug">
                                <Check className="w-3.5 h-3.5 text-[#009F9A] shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((exp) => {
              const partCount = exp.subExperiments?.length || 0;
              const displayNum = exp.displayNumber || String(exp.number).padStart(2, '0');
              const coverPhoto = exp.coverImage || EXPERIMENT_COVERS[exp.id] || exp.thumbnail;

              return (
                <div
                  key={exp.id}
                  onClick={() => onSelectExperiment(exp.id)}
                  className="group relative rounded-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800/80 hover:border-[#009F9A]/50 dark:hover:border-teal-500/50 transition-all duration-200 flex flex-col justify-between cursor-pointer p-5 sm:p-6 shadow-2xs hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div>
                    {/* Cover Photo (Editable) */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverEditExp(exp);
                      }}
                      className="group/cover relative w-full h-[125px] sm:h-[135px] rounded-xl overflow-hidden mb-3 border border-gray-100 dark:border-slate-800 shadow-2xs bg-slate-100 dark:bg-slate-800 cursor-pointer"
                      title="Click to edit or change cover photo"
                    >
                      <img
                        src={coverPhoto}
                        alt={`${exp.title} cover`}
                        className="w-full h-full object-cover object-center group-hover/cover:scale-[1.03] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent group-hover/cover:from-slate-950/50 transition-colors pointer-events-none" />

                      {/* Edit Cover Photo Pill */}
                      <div className="absolute top-2 right-2 z-10 opacity-90 group-hover/cover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCoverEditExp(exp);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-black/60 hover:bg-black/85 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
                          title="Edit cover photo"
                        >
                          <Camera className="w-3 h-3 text-teal-300" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-xl font-mono text-xs font-black bg-[#0F2231] text-white shadow-2xs">
                        {displayNum}
                      </span>

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-[#009F9A] dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 font-mono">
                        {exp.category || 'Python'}
                      </span>
                    </div>

                    <div className="h-14 flex items-start mb-1.5">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#009F9A] dark:group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                        {exp.title}
                      </h3>
                    </div>

                    <div className="h-10 text-xs text-gray-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">
                      {exp.description}
                    </div>
                  </div>

                  <div className="space-y-4 pt-3 border-t border-gray-100 dark:border-slate-800/80">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-2 font-medium">
                        <span className="font-semibold text-gray-700 dark:text-slate-300">
                          {partCount} Parts
                        </span>
                        <span className="text-[11px] font-mono text-gray-500">
                          {exp.technology}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 min-h-[2rem]">
                        {exp.subExperiments?.map((sub, idx) => {
                          const letter = sub.partLetter || String.fromCharCode(65 + idx);

                          return (
                            <span
                              key={sub.id}
                              onClick={(e) => {
                                if (onOpenDirectPart) {
                                  e.stopPropagation();
                                  onOpenDirectPart(exp.id, sub.id);
                                }
                              }}
                              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-gray-100 hover:bg-teal-50 dark:bg-slate-800 text-gray-700 hover:text-[#009F9A] dark:text-slate-300 border border-gray-200/80 hover:border-teal-300 dark:border-slate-700 transition-all cursor-pointer"
                            >
                              Part {letter}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectExperiment(exp.id);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-white dark:bg-[#0D1E2A] hover:bg-[#009F9A]/5 dark:hover:bg-slate-800 text-[#0F2231] dark:text-slate-200 border border-teal-600/30 dark:border-slate-700 hover:border-[#009F9A] dark:hover:border-cyan-500 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer group/cta"
                      >
                        <span>Open Experiment</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#009F9A] group-hover/cta:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="py-16 text-center rounded-2xl border border-dashed border-gray-300 dark:border-slate-800 bg-white dark:bg-[#0D1E2A] p-8">
          <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No experiments found
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            No experiments matched your search query or filters. Clear filters or add a new experiment.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => {
                setSearchQuery('');
                setTechFilter('all');
                setDifficultyFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
            <button
              onClick={onAddExperiment}
              className="px-4 py-2 rounded-xl bg-[#009F9A] text-white text-xs font-semibold hover:bg-[#008783] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Experiment
            </button>
          </div>
        </div>
      )}

      {/* 5. BOTTOM SUMMARY FOOTER BAR */}
      <div className="pt-4 border-t border-gray-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-slate-400 gap-2">
        <div className="font-medium font-mono">
          <span className="text-gray-800 dark:text-slate-200 font-bold">{totalExperiments} Experiments</span>
          <span className="mx-2">•</span>
          <span>{totalParts} Parts</span>
          <span className="mx-2">•</span>
          <span>Python 3.10</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span>Mohan Babu University • Department of Data Science</span>
        </div>
      </div>

      {/* MODALS */}
      {/* Duplicate Modal */}
      <DuplicateExperimentModal
        isOpen={!!duplicateModalExp}
        onClose={() => setDuplicateModalExp(null)}
        experiment={duplicateModalExp}
        onConfirm={(options: DuplicateOptions) => {
          if (duplicateModalExp) {
            duplicateExperimentWithOptions(duplicateModalExp.id, options);
          }
        }}
      />

      {/* Reorder Modal */}
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        experiments={experiments}
        onSave={reorderExperiments}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteConfirmExp}
        onClose={() => setDeleteConfirmExp(null)}
        onConfirm={() => {
          if (deleteConfirmExp) {
            deleteExperiment(deleteConfirmExp.id);
            setDeleteConfirmExp(null);
          }
        }}
        title={`Delete Experiment #${deleteConfirmExp?.number}`}
        message={
          <div>
            <p>Are you sure you want to delete <strong>"{deleteConfirmExp?.title}"</strong>?</p>
            <p className="mt-1 text-xs text-slate-500">
              This will remove {deleteConfirmExp?.subExperiments?.length || 0} coding parts and all associated resources.
            </p>
          </div>
        }
        confirmText="Delete Experiment"
        type="danger"
      />

      {/* Cover Photo Modal */}
      {coverEditExp && (
        <CoverPhotoModal
          isOpen={!!coverEditExp}
          onClose={() => setCoverEditExp(null)}
          experiment={coverEditExp}
          defaultCoverUrl={EXPERIMENT_COVERS[coverEditExp.id] || coverEditExp.thumbnail}
          onSave={(newUrl: string) => {
            updateExperimentThumbnail(coverEditExp.id, newUrl);
            setCoverEditExp(null);
          }}
        />
      )}

    </div>
  );
};
