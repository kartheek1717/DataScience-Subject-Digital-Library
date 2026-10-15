import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLab, NavTab } from '../context/LabContext';
import { CURRICULUM_MODULES } from '../data/modulesData';
import { TOOLS_DIRECTORY } from '../data/toolsData';
import { APP_PAGES } from '../data/pagesData';
import { 
  Home,
  FlaskConical, 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Code2,
  Layers,
  Wrench,
  FolderKanban,
  FileUser,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { DataScienceLogo } from './DataScienceLogo';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { 
    currentTab,
    setIsCommandOpen, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    profile, 
    setCurrentTab,
    addToast,
    experiments,
    navigateToExperiment,
    navigateToModule,
    navigateToTool,
    setExperimentViewMode,
    isAdmin,
    adminLogout
  } = useLab();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns and search popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
        if (!searchQuery.trim()) {
          setIsSearchExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const cleanQuery = searchQuery.trim().toLowerCase();

  // Instant reactive search results across Pages, Experiments, Parts, Modules, and Tools
  const searchResults = useMemo(() => {
    if (!cleanQuery) return null;

    // 0. Matched Pages & Navigation (limit 7)
    const matchedPages = APP_PAGES.filter(p => 
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
    ).slice(0, 7);

    // 1. Matched Experiments (limit 4)
    const matchedExperiments = experiments.filter(e => 
      e.title.toLowerCase().includes(cleanQuery) ||
      e.category.toLowerCase().includes(cleanQuery) ||
      e.description.toLowerCase().includes(cleanQuery) ||
      `exp ${e.number}`.includes(cleanQuery) ||
      `experiment ${e.number}`.includes(cleanQuery) ||
      (e.displayNumber && e.displayNumber.toLowerCase().includes(cleanQuery))
    ).slice(0, 4);

    // 2. Matched Practical Parts (limit 5)
    const matchedParts = experiments.flatMap(exp => 
      (exp.subExperiments || []).map(sub => ({ sub, exp }))
    ).filter(({ sub }) =>
      sub.title.toLowerCase().includes(cleanQuery) ||
      sub.description.toLowerCase().includes(cleanQuery) ||
      (sub.aim && sub.aim.toLowerCase().includes(cleanQuery)) ||
      (sub.code && sub.code.toLowerCase().includes(cleanQuery)) ||
      `part ${sub.partLetter}`.toLowerCase().includes(cleanQuery)
    ).slice(0, 5);

    // 3. Matched Curriculum Modules (limit 3)
    const matchedModules = CURRICULUM_MODULES.filter(m => 
      m.title.toLowerCase().includes(cleanQuery) ||
      m.code.toLowerCase().includes(cleanQuery) ||
      m.overview.toLowerCase().includes(cleanQuery) ||
      m.allTopics.some(t => t.toLowerCase().includes(cleanQuery))
    ).slice(0, 3);

    // 4. Matched Tools (limit 3)
    const matchedTools = TOOLS_DIRECTORY.filter(t => 
      t.name.toLowerCase().includes(cleanQuery) ||
      t.description.toLowerCase().includes(cleanQuery) ||
      t.category.toLowerCase().includes(cleanQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(cleanQuery))
    ).slice(0, 3);

    const totalCount = matchedPages.length + matchedExperiments.length + matchedParts.length + matchedModules.length + matchedTools.length;

    return {
      pages: matchedPages,
      experiments: matchedExperiments,
      parts: matchedParts,
      modules: matchedModules,
      tools: matchedTools,
      totalCount
    };
  }, [cleanQuery, experiments]);

  const handleSelectPage = (pageId: NavTab) => {
    setCurrentTab(pageId);
    if (pageId === 'experiments') {
      setExperimentViewMode('dashboard');
    }
    setIsSearchFocused(false);
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  const handleSelectExp = (expId: string) => {
    navigateToExperiment(expId, 'details');
    setIsSearchFocused(false);
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  const handleSelectPart = (expId: string, partId: string) => {
    navigateToExperiment(expId, 'part', partId);
    setIsSearchFocused(false);
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  const handleSelectModule = (moduleNumber: number) => {
    navigateToModule(moduleNumber);
    setIsSearchFocused(false);
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  const handleSelectTool = (toolId?: string, category?: string) => {
    navigateToTool('directory', category || 'All', toolId);
    setIsSearchFocused(false);
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsSearchFocused(false);
      setIsSearchExpanded(false);
      searchInputRef.current?.blur();
    } else if (e.key === 'Enter') {
      if (searchResults && searchResults.totalCount > 0) {
        if (searchResults.pages.length > 0) {
          handleSelectPage(searchResults.pages[0].id);
        } else if (searchResults.parts.length > 0) {
          handleSelectPart(searchResults.parts[0].exp.id, searchResults.parts[0].sub.id);
        } else if (searchResults.experiments.length > 0) {
          handleSelectExp(searchResults.experiments[0].id);
        } else if (searchResults.modules.length > 0) {
          handleSelectModule(searchResults.modules[0].number);
        } else if (searchResults.tools.length > 0) {
          handleSelectTool(searchResults.tools[0].id, searchResults.tools[0].category);
        }
      }
    }
  };

  const pageNavButtons: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'modules', label: 'Modules', icon: Layers },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'profile', label: 'Profile', icon: FileUser },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#07141F]/90 backdrop-blur-xl border-b border-[#E3EDF2]/90 dark:border-slate-800/90 shadow-xs transition-colors">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Menu Drawer Toggle & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="w-10 h-10 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-[#F6FAFC] dark:bg-[#0D1E2A] text-slate-700 dark:text-gray-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            aria-label="Toggle Navigation Drawer"
            title="Open Platform Navigation"
          >
            <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </button>

          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B2538] via-[#009F9A] to-[#14B8A6] flex items-center justify-center text-white shadow-md shadow-[#009F9A]/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <DataScienceLogo className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-lg sm:text-xl tracking-tight text-[#0B2538] dark:text-white block leading-tight">
                Data Science
              </span>
              <p className="text-[10px] sm:text-[11px] font-medium text-[#64748B] dark:text-slate-400 hidden sm:block -mt-0.5">
                Subject Digital Library
              </p>
            </div>
          </div>
        </div>

        {/* Center: Same-Sized Page Navigation Icons & Expandable Search Bar on Right Side */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* All Page Icons (Same Size as Search Button) - visible on tablet/desktop */}
          <div className="hidden md:flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
            {pageNavButtons.map((btn) => {
              const Icon = btn.icon;
              const isActive = currentTab === btn.id || (btn.id === 'profile' && currentTab === 'resume');

              return (
                <button
                  key={btn.id}
                  onClick={() => {
                    if (btn.id === 'experiments') {
                      setExperimentViewMode('dashboard');
                    }
                    setCurrentTab(btn.id);
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0 ${
                    isActive
                      ? 'bg-[#009F9A] text-white shadow-sm ring-2 ring-[#009F9A]/30 font-bold'
                      : 'border border-[#E3EDF2] dark:border-slate-800 bg-[#F6FAFC] dark:bg-[#0D1E2A] text-slate-600 dark:text-slate-300 hover:text-[#009F9A] hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
                  }`}
                  title={btn.label}
                  aria-label={btn.label}
                >
                  <Icon className={`w-4.5 h-4.5 transition-transform ${isActive ? 'scale-105 text-white' : ''}`} />
                </button>
              );
            })}
          </div>
          
          {/* Expandable Search Bar Container (On Right of Page Icons) */}
          <div ref={searchContainerRef} className="relative">
            {!isSearchExpanded ? (
              /* Compact Search Button matching page icon sizes */
              <button
                type="button"
                onClick={() => {
                  setIsSearchExpanded(true);
                  setTimeout(() => searchInputRef.current?.focus(), 80);
                }}
                className="w-10 h-10 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-[#F6FAFC] dark:bg-[#0D1E2A] hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#009F9A]/50 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
                aria-label="Open Search"
                title="Search (Click to expand, or press Ctrl+K)"
              >
                <Search className="w-4.5 h-4.5 text-slate-600 dark:text-slate-300" />
              </button>
            ) : (
              /* Expanded Search Input */
              <div className="relative flex items-center h-10 w-44 xs:w-56 sm:w-72 md:w-88 max-w-[calc(100vw-130px)] rounded-xl border border-[#009F9A] ring-2 ring-[#009F9A]/20 bg-white dark:bg-[#0D1E2A] shadow-lg transition-all duration-300 animate-in fade-in">
                <Search className="w-4 h-4 ml-3 text-[#009F9A] shrink-0" />
                <input
                  ref={searchInputRef}
                  id="global-header-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search pages, experiments, code, topics..."
                  className="w-full py-2 pl-2.5 pr-8 text-xs sm:text-sm bg-transparent border-none outline-none text-[#0F2231] dark:text-slate-100 placeholder-[#64748B] dark:placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchExpanded(false);
                    setIsSearchFocused(false);
                  }}
                  className="mr-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md transition-colors cursor-pointer shrink-0"
                  title="Close search (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Live Search Dropdown */}
            {isSearchExpanded && isSearchFocused && (
              <div className="absolute top-full right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-96 bg-white dark:bg-[#0D1E2A] rounded-2xl shadow-2xl border border-[#E3EDF2] dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 max-h-[460px] flex flex-col">
                {searchQuery.trim() ? (
                  searchResults && searchResults.totalCount > 0 ? (
                    <div className="overflow-y-auto p-2 divide-y divide-gray-100 dark:divide-slate-800/60 max-h-[380px]">
                      {/* Pages & Navigation Matches */}
                      {searchResults.pages.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> Pages & Navigation ({searchResults.pages.length})
                          </div>
                          {searchResults.pages.map(page => {
                            const PageIcon = page.icon;
                            return (
                              <div
                                key={`page-${page.id}`}
                                onClick={() => handleSelectPage(page.id)}
                                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/70 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-7 h-7 rounded-lg ${page.iconBg} ${page.iconColor} flex items-center justify-center shrink-0`}>
                                    <PageIcon className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {page.title}
                                      </span>
                                      <span className="shrink-0 px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 rounded">
                                        Page
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                      {page.subtitle}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                                    Go to Page
                                  </span>
                                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Experiments Matches */}
                      {searchResults.experiments.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#009F9A] dark:text-teal-400 flex items-center gap-1.5">
                            <FlaskConical className="w-3.5 h-3.5" /> Experiments ({searchResults.experiments.length})
                          </div>
                          {searchResults.experiments.map(exp => (
                            <div
                              key={exp.id}
                              onClick={() => handleSelectExp(exp.id)}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F0FAF9] dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E6F7F6] text-[#008985] dark:bg-teal-950/80 dark:text-teal-300">
                                  Exp {exp.displayNumber || exp.number}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-gray-900 dark:text-white truncate group-hover:text-[#009F9A] transition-colors">
                                    {exp.title}
                                  </div>
                                  <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                    {exp.category}
                                  </div>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#009F9A] group-hover:translate-x-0.5 transition-all shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Practical Parts Matches */}
                      {searchResults.parts.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5" /> Practical Parts ({searchResults.parts.length})
                          </div>
                          {searchResults.parts.map(({ sub, exp }) => (
                            <div
                              key={`${exp.id}-${sub.id}`}
                              onClick={() => handleSelectPart(exp.id, sub.id)}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/60 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300">
                                  Part {sub.partLetter || sub.id.toUpperCase()}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-gray-900 dark:text-white truncate group-hover:text-sky-600 transition-colors">
                                    {sub.title}
                                  </div>
                                  <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                    Exp #{exp.number} • {exp.title}
                                  </div>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Modules Matches */}
                      {searchResults.modules.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" /> Curriculum Modules ({searchResults.modules.length})
                          </div>
                          {searchResults.modules.map(m => (
                            <div
                              key={`mod-${m.number}`}
                              onClick={() => handleSelectModule(m.number)}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
                                  M{m.number}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                                    {m.title}
                                  </div>
                                  <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                    {m.periods} Periods
                                  </div>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tools Matches */}
                      {searchResults.tools.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5" /> Tools & Libraries ({searchResults.tools.length})
                          </div>
                          {searchResults.tools.map(t => (
                            <div
                              key={`tool-${t.id}`}
                              onClick={() => handleSelectTool(t.id, t.category)}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-violet-50/60 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300">
                                  {t.name}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-gray-900 dark:text-white truncate group-hover:text-violet-600 transition-colors">
                                    {t.name}
                                  </div>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-gray-400">
                        <Search className="w-5 h-5" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        No matches for "{searchQuery}"
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-3">
                    <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#009F9A]" /> Quick Suggestions
                    </div>
                    <div className="space-y-1 mt-1">
                      {experiments.slice(0, 4).map(exp => (
                        <div
                          key={exp.id}
                          onClick={() => handleSelectExp(exp.id)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F0FAF9] dark:hover:bg-slate-800/70 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[#009F9A] dark:text-teal-400">
                              Exp {exp.displayNumber || exp.number}
                            </span>
                            <span className="text-xs font-medium text-gray-700 dark:text-slate-300 group-hover:text-[#009F9A]">
                              {exp.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dropdown Footer */}
                <div className="p-2.5 bg-gray-50/80 dark:bg-slate-900/80 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 font-mono text-[10px]">Esc</kbd> to close</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCommandOpen(true);
                      setIsSearchFocused(false);
                      setIsSearchExpanded(false);
                    }}
                    className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 hover:bg-[#009F9A] text-[#009F9A] hover:text-white dark:text-cyan-400 dark:hover:text-white border border-teal-200/80 dark:border-teal-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                  >
                    <span>Full Dialog</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right: Notifications & Profile (No Dark Theme Button) */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-[#F6FAFC] dark:bg-[#0D1E2A] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-gray-300 relative flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-96 bg-white dark:bg-[#0D1E2A] rounded-2xl shadow-2xl border border-[#E3EDF2] dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-[#E3EDF2] dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#122333] dark:text-white">Recent Notifications</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-[#009F9A]/10 text-[#009F9A] font-bold">
                      {notifications.length}
                    </span>
                  </div>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-[#009F9A] hover:underline font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#E3EDF2] dark:divide-slate-800/60">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        !n.read ? 'bg-[#DFF8F7]/20 dark:bg-[#009F9A]/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs font-semibold ${!n.read ? 'text-[#009F9A]' : 'text-gray-700 dark:text-gray-300'}`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="h-10 flex items-center gap-2 px-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-[#F6FAFC] dark:bg-[#0D1E2A] hover:border-gray-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-left cursor-pointer shadow-2xs"
              title="User Account"
            >
              <img
                src={profile.avatar || '/kartheek_profile.jpg'}
                alt={profile.name}
                className="w-7 h-7 rounded-lg object-cover object-top ring-2 ring-[#009F9A]/30 shrink-0"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-[#122333] dark:text-white capitalize leading-tight flex items-center gap-1.5">
                  <span>{profile.name}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      ADMIN
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-64 bg-white dark:bg-[#0D1E2A] rounded-2xl shadow-2xl border border-[#E3EDF2] dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {/* Profile Header */}
                <div className="p-4 border-b border-[#E3EDF2] dark:border-slate-800 bg-gradient-to-br from-[#E4FAF8]/60 to-[#EAF4FF]/40 dark:from-slate-900 dark:to-slate-900/60">
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatar || '/kartheek_profile.jpg'}
                      alt={profile.name}
                      className="w-11 h-11 rounded-xl object-cover object-top ring-2 ring-[#009F9A]"
                    />
                    <div>
                      <div className="font-bold text-sm text-[#122333] dark:text-white capitalize">
                        {profile.name}
                      </div>
                      <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                        {profile.rollNo}
                      </div>
                      <div className="text-[10px] text-[#009F9A] font-semibold mt-0.5">
                        {profile.branch} • Sec {profile.section}
                      </div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold font-mono text-[9px] ${
                          isAdmin 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}>
                          {isAdmin ? '🛡️ Admin Mode' : '👁️ User Mode'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Links */}
                <div className="p-2 space-y-0.5">
                  <button
                    onClick={() => {
                      setCurrentTab('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-[#DFF8F7]/40 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#009F9A]" />
                    Profile &amp; CV
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('projects');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-[#DFF8F7]/40 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <FolderKanban className="w-4 h-4 text-[#059669]" />
                    Projects
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-[#DFF8F7]/40 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-[#8B5CF6]" />
                    Settings
                  </button>
                </div>

                {/* Admin Mode Switch / Logout */}
                <div className="p-2 border-t border-[#E3EDF2] dark:border-slate-800">
                  {isAdmin ? (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        adminLogout();
                        addToast('Logged out of Administrator Mode. Switched to User Mode.', 'info');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Exit Admin Mode
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setCurrentTab('settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-xl transition-colors cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      Admin Login (in Settings)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
