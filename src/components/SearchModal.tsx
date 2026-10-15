import React, { useState, useEffect, useRef } from 'react';
import { useLab } from '../context/LabContext';
import { CURRICULUM_MODULES } from '../data/modulesData';
import { TOOLS_DIRECTORY } from '../data/toolsData';
import { APP_PAGES } from '../data/pagesData';
import { 
  Search, 
  FlaskConical, 
  Sparkles, 
  ArrowRight, 
  X,
  Layers,
  Code2,
  Wrench,
  FileText,
  Filter,
  FolderKanban,
  FileUser
} from 'lucide-react';

type SearchCategory = 'all' | 'pages' | 'modules' | 'experiments' | 'parts' | 'projects' | 'profile' | 'tools' | 'resources';

interface SearchResultItem {
  id: string;
  category: 'pages' | 'modules' | 'experiments' | 'parts' | 'projects' | 'profile' | 'tools' | 'resources';
  categoryLabel: string;
  title: string;
  subtitle: string;
  badge?: string;
  onSelect: () => void;
  icon: React.FC<{ className?: string }>;
  iconColor: string;
  iconBg: string;
}

export const SearchModal: React.FC = () => {
  const { 
    isCommandOpen, 
    setIsCommandOpen, 
    experiments, 
    projects,
    profile,
    setCurrentTab, 
    setSelectedExpId, 
    navigateToExperiment,
    navigateToModule,
    navigateToTool,
    setExperimentViewMode
  } = useLab();
  
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultListRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isCommandOpen) {
      setQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandOpen]);

  if (!isCommandOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // 0. PAGES RESULTS
  const pageResults: SearchResultItem[] = APP_PAGES.filter(p => {
    if (!cleanQuery) return false;
    return (
      p.title.toLowerCase().includes(cleanQuery) ||
      p.subtitle.toLowerCase().includes(cleanQuery) ||
      p.id.toLowerCase().includes(cleanQuery) ||
      p.keywords.some(k => k.toLowerCase().includes(cleanQuery)) ||
      cleanQuery.includes(p.id) ||
      cleanQuery === 'page' ||
      cleanQuery === 'pages' ||
      cleanQuery === 'tab' ||
      cleanQuery === 'tabs' ||
      cleanQuery === 'navigation' ||
      cleanQuery === 'nav'
    );
  }).map(p => ({
    id: `page-${p.id}`,
    category: 'pages' as const,
    categoryLabel: 'Page',
    title: p.title,
    subtitle: p.subtitle,
    badge: 'Page',
    icon: p.icon,
    iconColor: p.iconColor,
    iconBg: p.iconBg,
    onSelect: () => {
      setCurrentTab(p.id);
      if (p.id === 'experiments') {
        setExperimentViewMode('dashboard');
      }
      setIsCommandOpen(false);
    }
  }));

  const moduleResults: SearchResultItem[] = CURRICULUM_MODULES.filter(m => {
    if (!cleanQuery) return false;
    return (
      m.title.toLowerCase().includes(cleanQuery) ||
      m.code.toLowerCase().includes(cleanQuery) ||
      m.overview.toLowerCase().includes(cleanQuery) ||
      m.allTopics.some(t => t.toLowerCase().includes(cleanQuery))
    );
  }).map(m => ({
    id: `mod-${m.number}`,
    category: 'modules' as const,
    categoryLabel: 'Module',
    title: `${m.code} • ${m.title}`,
    subtitle: `${m.periods} Periods • ${m.allTopics.slice(0, 3).join(', ')}...`,
    badge: `${m.periods} Periods`,
    icon: Layers,
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    onSelect: () => {
      navigateToModule(m.number);
      setIsCommandOpen(false);
    }
  }));

  // 2. EXPERIMENTS RESULTS
  const expResults: SearchResultItem[] = experiments.filter(e => {
    if (!cleanQuery) return false;
    return (
      e.title.toLowerCase().includes(cleanQuery) ||
      e.category.toLowerCase().includes(cleanQuery) ||
      e.description.toLowerCase().includes(cleanQuery) ||
      `exp ${e.number}`.includes(cleanQuery)
    );
  }).map(e => ({
    id: `exp-${e.id}`,
    category: 'experiments' as const,
    categoryLabel: 'Experiment',
    title: `Exp ${e.displayNumber || e.number} • ${e.title}`,
    subtitle: `${e.category} • ${e.subExperiments?.length || 0} Practical Parts`,
    badge: e.category,
    icon: FlaskConical,
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-50 dark:bg-teal-950/50',
    onSelect: () => {
      navigateToExperiment(e.id, 'details');
      setIsCommandOpen(false);
    }
  }));

  // 3. PARTS RESULTS (SubExperiments)
  const partResults: SearchResultItem[] = experiments.flatMap(e => 
    (e.subExperiments || [])
      .filter(sub => {
        if (!cleanQuery) return false;
        return (
          sub.title.toLowerCase().includes(cleanQuery) ||
          (sub.aim && sub.aim.toLowerCase().includes(cleanQuery)) ||
          sub.description.toLowerCase().includes(cleanQuery) ||
          sub.code.toLowerCase().includes(cleanQuery) ||
          sub.id.toLowerCase().includes(cleanQuery)
        );
      })
      .map(sub => ({
        id: `part-${e.id}-${sub.id}`,
        category: 'parts' as const,
        categoryLabel: 'Part Code',
        title: `Part ${sub.partLetter || sub.id.toUpperCase()}: ${sub.title}`,
        subtitle: `In ${e.title} • ${sub.estimatedTime || '30 mins'}`,
        badge: sub.difficulty || 'Medium',
        icon: Code2,
        iconColor: 'text-sky-600 dark:text-sky-400',
        iconBg: 'bg-sky-50 dark:bg-sky-950/50',
        onSelect: () => {
          navigateToExperiment(e.id, 'part', sub.id);
          setIsCommandOpen(false);
        }
      }))
  );

  // 4. TOOLS RESULTS
  const toolResults: SearchResultItem[] = TOOLS_DIRECTORY.filter(t => {
    if (!cleanQuery) return false;
    return (
      t.name.toLowerCase().includes(cleanQuery) ||
      t.description.toLowerCase().includes(cleanQuery) ||
      t.category.toLowerCase().includes(cleanQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(cleanQuery))
    );
  }).map(t => ({
    id: `tool-${t.id}`,
    category: 'tools' as const,
    categoryLabel: 'Tool',
    title: `${t.name} (${t.version})`,
    subtitle: `${t.category} • ${t.description.slice(0, 60)}...`,
    badge: t.category,
    icon: Wrench,
    iconColor: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-50 dark:bg-violet-950/50',
    onSelect: () => {
      navigateToTool('directory', t.category, t.id);
      setIsCommandOpen(false);
    }
  }));

  // 5. PROJECTS RESULTS
  const projectResults: SearchResultItem[] = (projects || []).filter(p => {
    if (!cleanQuery) return false;
    return (
      p.title.toLowerCase().includes(cleanQuery) ||
      p.description.toLowerCase().includes(cleanQuery) ||
      p.category.toLowerCase().includes(cleanQuery) ||
      (p.technology && p.technology.some(t => t.toLowerCase().includes(cleanQuery))) ||
      p.status.toLowerCase().includes(cleanQuery)
    );
  }).map(p => ({
    id: `proj-${p.id}`,
    category: 'projects' as const,
    categoryLabel: 'Project',
    title: p.title,
    subtitle: `${p.status.toUpperCase()} • ${p.technology?.slice(0, 3).join(', ') || p.category}`,
    badge: p.status,
    icon: FolderKanban,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    onSelect: () => {
      setCurrentTab('projects');
      setIsCommandOpen(false);
    }
  }));

  // 6. PROFILE RESULT
  const profileResults: SearchResultItem[] = (
    cleanQuery && ('profile resume cv curriculum vitae portfolio skills education experience'.includes(cleanQuery) || cleanQuery.includes('profile') || cleanQuery.includes('resume') || cleanQuery.includes('cv'))
  ) ? [{
    id: 'nav-profile',
    category: 'profile' as const,
    categoryLabel: 'Profile',
    title: `${profile.name}'s Profile & Portfolio`,
    subtitle: `B.Tech ${profile.branch} • ${profile.collegeName || 'Mohan Babu University'}`,
    badge: 'Profile',
    icon: FileUser,
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-50 dark:bg-sky-950/50',
    onSelect: () => {
      setCurrentTab('profile');
      setIsCommandOpen(false);
    }
  }] : [];

  // 7. RESOURCES RESULTS
  const resourceResults: SearchResultItem[] = experiments.flatMap(e =>
    (e.resources || [])
      .filter(r => {
        if (!cleanQuery) return false;
        return (
          r.title.toLowerCase().includes(cleanQuery) ||
          (r.description && r.description.toLowerCase().includes(cleanQuery)) ||
          (r.filename && r.filename.toLowerCase().includes(cleanQuery)) ||
          r.type.toLowerCase().includes(cleanQuery)
        );
      })
      .map((r, idx) => ({
        id: `res-${e.id}-${idx}`,
        category: 'resources' as const,
        categoryLabel: 'Resource',
        title: r.title,
        subtitle: `${r.type.toUpperCase()} • For ${e.title}`,
        badge: r.type,
        icon: FileText,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
        onSelect: () => {
          if (r.url) {
            window.open(r.url, '_blank');
          } else {
            setSelectedExpId(e.id);
            setCurrentTab('experiments');
          }
          setIsCommandOpen(false);
        }
      }))
  );

  // Flatten based on active filter
  const allResults = [
    ...pageResults,
    ...moduleResults,
    ...expResults,
    ...partResults,
    ...projectResults,
    ...profileResults,
    ...toolResults,
    ...resourceResults
  ];

  const displayedResults = activeCategory === 'all'
    ? allResults
    : allResults.filter(item => item.category === activeCategory);

  const effectiveSelectedIndex = displayedResults.length === 0 ? 0 : Math.min(selectedIndex, displayedResults.length - 1);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (displayedResults.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % displayedResults.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (displayedResults.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + displayedResults.length) % displayedResults.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (displayedResults[effectiveSelectedIndex]) {
        displayedResults[effectiveSelectedIndex].onSelect();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsCommandOpen(false);
    }
  };

  const categoryCounts = {
    all: allResults.length,
    pages: pageResults.length,
    modules: moduleResults.length,
    experiments: expResults.length,
    parts: partResults.length,
    projects: projectResults.length,
    profile: profileResults.length,
    tools: toolResults.length,
    resources: resourceResults.length
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsCommandOpen(false)}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#07141F] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/70 dark:bg-slate-900/60">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, modules, experiments, coding parts, tools, datasets... (e.g. Home, Pandas, CSV)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent border-none outline-none text-[#0B2538] dark:text-white placeholder:text-slate-400 text-sm sm:text-base font-medium"
          />
          {query ? (
            <button 
              onClick={() => setQuery('')}
              className="min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-mono text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
              ESC
            </kbd>
          )}
        </div>

        {/* Category Filter Badges */}
        {cleanQuery && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#07141F] overflow-x-auto scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
            </span>
            {(
              [
                { id: 'all', label: 'All Results', count: categoryCounts.all },
                { id: 'pages', label: 'Pages', count: categoryCounts.pages },
                { id: 'modules', label: 'Modules', count: categoryCounts.modules },
                { id: 'experiments', label: 'Experiments', count: categoryCounts.experiments },
                { id: 'parts', label: 'Parts', count: categoryCounts.parts },
                { id: 'projects', label: 'Projects', count: categoryCounts.projects },
                { id: 'profile', label: 'Profile', count: categoryCounts.profile },
                { id: 'tools', label: 'Tools', count: categoryCounts.tools },
                { id: 'resources', label: 'Resources', count: categoryCounts.resources },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-teal-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Results Body */}
        <div ref={resultListRef} className="overflow-y-auto p-3 sm:p-4 space-y-4 max-h-[60vh]">
          {/* No results state */}
          {cleanQuery && displayedResults.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <FlaskConical className="w-10 h-10 mx-auto mb-2 opacity-30 text-teal-500" />
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                No matches found for "{query}"
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Try searching for concepts like "CSV", "Histogram", "Normal distribution", "Decision tree", or "NumPy".
              </p>
            </div>
          )}

          {/* Quick Suggestions (When query is empty) */}
          {!cleanQuery && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Jump to Syllabus Modules
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CURRICULUM_MODULES.slice(0, 4).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        navigateToModule(m.number);
                        setIsCommandOpen(false);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 hover:bg-teal-50/30 dark:hover:bg-teal-950/20 text-left transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
                          {m.number}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors">
                            {m.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {m.periods} Periods
                          </div>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-teal-500 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Quick Lab Practicals
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: 'Read CSV & JSON Formats', cat: 'Pandas', expId: 'exp-1', subId: '1a' },
                    { label: 'Vectorized Missing Values', cat: 'NumPy', expId: 'exp-2', subId: '2a' },
                    { label: 'Relational SQLite Queries', cat: 'Database', expId: 'exp-4', subId: '4a' },
                    { label: 'Decision Tree Classifier', cat: 'ML', expId: 'exp-5', subId: '5a' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigateToExperiment(item.expId, 'part', item.subId);
                        setIsCommandOpen(false);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 hover:bg-teal-50/30 dark:hover:bg-teal-950/20 text-left transition-all group"
                    >
                      <div>
                        <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider font-mono">
                          {item.cat}
                        </div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors">
                          {item.label}
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-teal-500 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results List */}
          {displayedResults.length > 0 && (
            <div className="space-y-1">
              {displayedResults.map((item, idx) => {
                const IconComponent = item.icon;
                const isSelected = idx === effectiveSelectedIndex;

                return (
                  <div
                    key={item.id}
                    onClick={item.onSelect}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/40 ring-1 ring-teal-500/50 text-slate-900 dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] uppercase font-bold font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                            {item.categoryLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {item.badge && (
                        <span className="hidden sm:inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {item.badge}
                        </span>
                      )}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-teal-500 text-white shadow-2xs' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-teal-500 group-hover:text-white'
                      }`}>
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px]">↓</kbd>
              <span className="text-[11px]">navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px]">↵</kbd>
              <span className="text-[11px]">open</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px]">ESC</kbd>
              <span className="text-[11px]">close</span>
            </span>
          </div>
          <span className="text-teal-600 dark:text-teal-400 font-medium text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> DS LAB Multi-Index Search
          </span>
        </div>
      </div>
    </div>
  );
};
