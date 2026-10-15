import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLab } from '../context/LabContext';
import { 
  Settings, 
  Bell, 
  ShieldCheck, 
  Palette, 
  RotateCcw, 
  RefreshCw, 
  GraduationCap, 
  Sliders, 
  Download, 
  Upload, 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle, 
  Code2, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  HardDrive,
  Database,
  Search,
  Eye,
  EyeOff,
  Trash2,
  Play,
  X,
  Lock,
  LogIn,
  LogOut,
  Info
} from 'lucide-react';

type SettingsTab = 'appearance' | 'learning' | 'notifications' | 'integrations' | 'appData' | 'admin';

export const SettingsView: React.FC = () => {
  const { 
    profile, 
    updateProfile,
    addToast, 
    restoreInitialExperiments, 
    resetAllData,
    userRole,
    experiments,
    projects,
    isAdmin,
    adminLogin,
    adminLogout,
    setCurrentTab
  } = useLab();

  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [searchQuery, setSearchQuery] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetConfirmationText, setResetConfirmationText] = useState('');
  const importInputRef = useRef<HTMLInputElement>(null);

  // --- Admin Login State ---
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSelectTab = (tabId: SettingsTab) => {
    setActiveTab(tabId);
    if (tabId === 'admin') {
      setAdminUsername('');
      setAdminPassword('');
      setAdminError('');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setAdminError('Please enter both administrator username and password.');
      return;
    }
    setIsLoggingIn(true);
    setTimeout(() => {
      const success = adminLogin(adminUsername.trim(), adminPassword.trim());
      setIsLoggingIn(false);
      if (success) {
        setAdminPassword('');
        setAdminError('');
      } else {
        setAdminError('Invalid administrator username or password.');
      }
    }, 250);
  };

  // --- Appearance & Code Canvas State ---
  const [editorFontSize, setEditorFontSize] = useState<string>(() => {
    return localStorage.getItem('dslab_setting_fontsize') || '13';
  });
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(() => {
    return localStorage.getItem('dslab_setting_linenumbers') !== 'false';
  });
  const [wordWrap, setWordWrap] = useState<boolean>(() => {
    return localStorage.getItem('dslab_setting_wordwrap') === 'true';
  });
  const [tabSize, setTabSize] = useState<string>(() => {
    return localStorage.getItem('dslab_setting_tabsize') || '4';
  });
  const [editorThemeName] = useState<string>(() => {
    return localStorage.getItem('dslab_setting_editortheme') || 'vscode-dark';
  });

  // --- Learning & Execution State ---
  const [autoRunOnSwitch, setAutoRunOnSwitch] = useState<boolean>(() => {
    return localStorage.getItem('dslab_setting_autorun') === 'true';
  });
  const [showInlineHints, setShowInlineHints] = useState<boolean>(() => {
    return localStorage.getItem('dslab_setting_hints') !== 'false';
  });
  const [executionTimeout, setExecutionTimeout] = useState<string>(() => {
    return localStorage.getItem('dslab_setting_timeout') || '10';
  });
  const [dataframeDisplay, setDataframeDisplay] = useState<string>(() => {
    return localStorage.getItem('dslab_setting_df_display') || 'table';
  });
  const [autoComplete, setAutoComplete] = useState<boolean>(() => {
    return localStorage.getItem('dslab_setting_autocomplete') !== 'false';
  });

  // --- Notifications State ---
  const [notifExp, setNotifExp] = useState<boolean>(() => {
    return localStorage.getItem('dslab_setting_notif_exp') !== 'false';
  });
  const [notifProjects, setNotifProjects] = useState<boolean>(() => {
    return localStorage.getItem('dslab_setting_notif_proj') !== 'false';
  });
  const [notifResources, setNotifResources] = useState<boolean>(() => {
    return localStorage.getItem('dslab_setting_notif_res') === 'true';
  });
  const [audioFeedback, setAudioFeedback] = useState<boolean>(() => {
    return localStorage.getItem('dslab_setting_audio') !== 'false';
  });

  // --- Integrations State ---
  const [githubSync, setGithubSync] = useState<boolean>(() => {
    return localStorage.getItem('dslab_setting_github_sync') !== 'false';
  });
  const [githubUser, setGithubUser] = useState<string>(() => {
    return localStorage.getItem('dslab_setting_github_user') || 'kartheek1717';
  });
  const [colabHardware, setColabHardware] = useState<string>(() => {
    return localStorage.getItem('dslab_setting_colab_hw') || 'standard';
  });
  const [jupyterServerUrl, setJupyterServerUrl] = useState<string>(() => {
    return localStorage.getItem('dslab_setting_jupyter_url') || 'http://localhost:8888';
  });

  // --- Storage Metrics ---
  const [storageMetrics, setStorageMetrics] = useState({ kb: '0', percentage: 0 });

  const calculateStorage = () => {
    try {
      let totalBytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key) || '';
          totalBytes += (key.length + val.length) * 2;
        }
      }
      const kb = (totalBytes / 1024).toFixed(1);
      const percentage = Math.min(100, Math.round((totalBytes / (5 * 1024 * 1024)) * 100));
      setStorageMetrics({ kb, percentage });
    } catch {
      setStorageMetrics({ kb: '0', percentage: 0 });
    }
  };

  useEffect(() => {
    calculateStorage();
  }, [experiments, projects, profile]);

  // Synthesized Web Audio Chime for feedback testing
  const playAudioFeedbackChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio context may require gesture
    }
  };

  // Export Full JSON Backup
  const handleExportData = () => {
    const backupData = {
      version: '2.4.0',
      exportDate: new Date().toISOString(),
      profile: {
        ...profile
      },
      userRole,
      experiments,
      projects,
      settings: {
        editorFontSize,
        showLineNumbers,
        wordWrap,
        tabSize,
        editorThemeName,
        autoRunOnSwitch,
        showInlineHints,
        executionTimeout,
        dataframeDisplay,
        autoComplete,
        notifExp,
        notifProjects,
        notifResources,
        audioFeedback,
        githubSync,
        githubUser,
        colabHardware
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dslab-full-backup-${profile.rollNo || 'student'}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Complete laboratory backup exported to JSON ✓', 'success');
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid JSON structure');
        }

        if (data.profile) {
          updateProfile(data.profile);
        }
        if (Array.isArray(data.experiments)) {
          localStorage.setItem('dslab_experiments', JSON.stringify(data.experiments));
        }
        if (Array.isArray(data.projects)) {
          localStorage.setItem('dslab_projects', JSON.stringify(data.projects));
        }

        addToast('Backup restored successfully! Refreshing view...', 'success');
        setTimeout(() => window.location.reload(), 1200);
      } catch {
        addToast('Failed to import backup: invalid file format', 'error');
      }
    };
    reader.readAsText(file);
    if (importInputRef.current) importInputRef.current.value = '';
  };

  interface TabItem {
    id: SettingsTab;
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  // Navigation Tabs Definition
  const tabs: TabItem[] = useMemo(() => [
    { 
      id: 'appearance', 
      label: 'Appearance & Canvas', 
      desc: 'Monaco Editor, Syntax & Typography',
      icon: Palette 
    },
    { 
      id: 'learning', 
      label: 'Learning & Execution', 
      desc: 'Python Runner, Hints & Timeouts',
      icon: Sliders 
    },
    { 
      id: 'notifications', 
      label: 'Notifications & Audio', 
      desc: 'Alert Channels & Completion Chimes',
      icon: Bell 
    },
    { 
      id: 'integrations', 
      label: 'GitHub & Notebooks', 
      desc: 'Classroom Repos & Google Colab',
      icon: GitBranch 
    },
    { 
      id: 'appData', 
      label: 'Storage & Recovery', 
      desc: 'Backup, Safe Reset & Factory Wipe',
      icon: RotateCcw,
      badge: `${storageMetrics.percentage}% Used`
    },
    { 
      id: 'admin', 
      label: 'Admin Access & Login', 
      desc: isAdmin ? 'Authenticated: Full Edit Rights' : 'Login to Edit Experiments & Profile',
      icon: ShieldCheck,
      badge: isAdmin ? 'Active Admin' : 'Visitor'
    },
  ], [isAdmin, storageMetrics.percentage]);

  // Filter tabs when searching
  const filteredTabs = useMemo(() => {
    if (!searchQuery.trim()) return tabs;
    const query = searchQuery.toLowerCase();
    return tabs.filter(t => 
      t.label.toLowerCase().includes(query) || 
      t.desc.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query)
    );
  }, [searchQuery, tabs]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B2538] via-[#0D304A] to-[#081B2B] p-6 sm:p-8 text-white border border-slate-700/60 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#009F9A] to-[#2563EB] flex items-center justify-center shadow-lg shadow-teal-500/20 text-white shrink-0">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                  Settings &amp; Preferences
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Synced
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                Configure your code editor canvas, runtime parameters, classroom integrations, and lab recovery safeguards.
              </p>
            </div>
          </div>

          {/* Quick Search in Settings */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
              className="w-full min-h-[42px] pl-9.5 pr-8 py-2 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/15 focus:border-teal-400 text-xs sm:text-sm text-white placeholder:text-slate-400 outline-none backdrop-blur-md transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Platform Mode Status Banner */}
      <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
        isAdmin 
          ? 'bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border-emerald-500/40 text-emerald-100 shadow-lg shadow-emerald-950/20'
          : 'bg-gradient-to-r from-slate-900 via-[#0B2538] to-[#0A1A2A] border-slate-700/70 text-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isAdmin 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {isAdmin ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <Eye className="w-5 h-5 text-blue-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  {isAdmin ? 'Administrator Mode Active' : 'Current Mode: User Mode (Read-Only)'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isAdmin 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-700 text-slate-300 border border-slate-600'
                }`}>
                  {isAdmin ? 'Full Edit Access' : 'View Only'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {isAdmin
                  ? 'You have root privileges enabled. All edits to experiments, student profile, projects, and curriculum are live and saved.'
                  : 'Visitors opening the site link start in User Mode by default. Edits are restricted to administrators. Login below to unlock editing.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  adminLogout();
                  addToast('Logged out of Administrator Mode. Switched to User Mode (Read-Only).', 'info');
                }}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 hover:border-slate-500 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Log Out Admin</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSelectTab('admin')}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-teal-700/30 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Tab Scroller */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filteredTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id as SettingsTab)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs ring-2 ring-teal-500/30'
                  : 'bg-white dark:bg-[#07141F] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label.split('&')[0].trim()}</span>
              {tab.id === 'admin' && !isAdmin && <Lock className="w-3 h-3 text-amber-400" />}
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Vertical Navigation Tabs (Desktop) */}
        <div className="hidden lg:block lg:col-span-4 space-y-4">
          
          {/* Navigation Tab Buttons List */}
          <div className="bg-white dark:bg-[#07141F] rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-xs space-y-1">
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id as SettingsTab)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-50 to-blue-50/50 dark:from-teal-950/50 dark:to-blue-950/20 text-teal-800 dark:text-teal-200 border border-teal-200/80 dark:border-teal-800/80 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg mt-0.5 transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs sm:text-sm truncate">
                        {tab.label}
                      </span>
                      {tab.badge && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          tab.badge === 'Unsaved'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-normal">
                      {tab.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Storage Status Footer Widget */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#07141F] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Browser Storage Quota
              </span>
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                {storageMetrics.kb} KB used
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(4, storageMetrics.percentage)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              LocalStorage maintains all custom code edits, notebook sessions &amp; project media offline.
            </p>
          </div>
        </div>

        {/* Right Column: Tab Content Canvas */}
        <div className="lg:col-span-8 space-y-6">

          {/* ========================================================
              TAB 1: APPEARANCE & CODE CANVAS
             ======================================================== */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#07141F] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                
                <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-base sm:text-lg font-bold text-[#0B2538] dark:text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    Laboratory Visual Canvas &amp; Editor
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Fine-tune high-contrast themes, typography, and editor styling for long coding periods.
                  </p>
                </div>

                {/* Monaco Editor Canvas Preferences */}
                <div className="space-y-4 pt-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Code Editor Configuration
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Font Size */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-[#0B2538] dark:text-white">
                          Editor Font Size
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Code script scale across exercises.
                        </div>
                      </div>
                      <select
                        value={editorFontSize}
                        onChange={(e) => {
                          setEditorFontSize(e.target.value);
                          localStorage.setItem('dslab_setting_fontsize', e.target.value);
                          addToast(`Editor font set to ${e.target.value}px`, 'info');
                        }}
                        className="min-h-[38px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E2E] text-xs font-mono text-slate-800 dark:text-slate-200 outline-none"
                      >
                        <option value="12">12px (Compact)</option>
                        <option value="13">13px (Default)</option>
                        <option value="14">14px (Comfortable)</option>
                        <option value="15">15px (Readable)</option>
                        <option value="16">16px (Large)</option>
                      </select>
                    </div>

                    {/* Tab Size */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-[#0B2538] dark:text-white">
                          Indentation Tab Size
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Python spaces per indent level.
                        </div>
                      </div>
                      <select
                        value={tabSize}
                        onChange={(e) => {
                          setTabSize(e.target.value);
                          localStorage.setItem('dslab_setting_tabsize', e.target.value);
                          addToast(`Tab spacing set to ${e.target.value} spaces`, 'info');
                        }}
                        className="min-h-[38px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E2E] text-xs font-mono text-slate-800 dark:text-slate-200 outline-none"
                      >
                        <option value="2">2 Spaces</option>
                        <option value="4">4 Spaces (PEP 8)</option>
                      </select>
                    </div>

                    {/* Show Line Numbers */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-[#0B2538] dark:text-white">
                          Show Line Numbers
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Gutter line numbers in code panel.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !showLineNumbers;
                          setShowLineNumbers(next);
                          localStorage.setItem('dslab_setting_linenumbers', String(next));
                        }}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                          showLineNumbers ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          showLineNumbers ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* Word Wrap */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-[#0B2538] dark:text-white">
                          Soft Word Wrap
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Wrap long code lines without scrolling.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !wordWrap;
                          setWordWrap(next);
                          localStorage.setItem('dslab_setting_wordwrap', String(next));
                        }}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                          wordWrap ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          wordWrap ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                  </div>
                </div>

                {/* Live Code Preview Canvas */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-teal-600" />
                      Live Typography &amp; Editor Preview
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Font: {editorFontSize}px • Tab: {tabSize}sp
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0B1E2E] text-slate-100 font-mono border border-slate-800 shadow-inner overflow-x-auto" style={{ fontSize: `${editorFontSize}px` }}>
                    <div className="text-slate-500 select-none"># DS LAB Python Pipeline Sample</div>
                    <div className="text-emerald-400">import <span className="text-cyan-300">pandas</span> as <span className="text-cyan-300">pd</span></div>
                    <div className="text-emerald-400">import <span className="text-cyan-300">numpy</span> as <span className="text-cyan-300">np</span></div>
                    <div className="mt-2 text-blue-300">def <span className="text-yellow-300">calculate_pmf</span>(values):</div>
                    <div className="text-slate-300" style={{ paddingLeft: `${parseInt(tabSize) * 8}px` }}>
                      freq = pd.Series(values).value_counts(normalize=True)
                    </div>
                    <div className="text-slate-300" style={{ paddingLeft: `${parseInt(tabSize) * 8}px` }}>
                      <span className="text-pink-400">return</span> freq.to_dict()
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              TAB 3: LEARNING & EXECUTION ENGINE
             ======================================================== */}
          {activeTab === 'learning' && (
            <div className="space-y-6">
              
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#07141F] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                
                <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-base sm:text-lg font-bold text-[#0B2538] dark:text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    Python Execution &amp; Pedagogical Aids
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Customize sandbox timeouts, auto-execution triggers, and step-by-step guidance cards.
                  </p>
                </div>

                <div className="space-y-4">
                  
                  {/* Step-by-Step Code Explanations */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="pr-4">
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white">
                        Show Step-by-Step Code Explanations
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Render interactive breakdown cards beneath code blocks explaining algorithmic mechanics.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !showInlineHints;
                        setShowInlineHints(next);
                        localStorage.setItem('dslab_setting_hints', String(next));
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        showInlineHints ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        showInlineHints ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Auto-Run on Part Switch */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="pr-4">
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white">
                        Auto-Run Sample on Part Switching
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Automatically trigger code runner when switching between sub-experiment parts (A, B, C).
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !autoRunOnSwitch;
                        setAutoRunOnSwitch(next);
                        localStorage.setItem('dslab_setting_autorun', String(next));
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        autoRunOnSwitch ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        autoRunOnSwitch ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* IntelliSense Autocomplete */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="pr-4">
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white">
                        Code IntelliSense &amp; Autocomplete
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Suggest Pandas methods, NumPy arrays, and Python built-ins as you type.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !autoComplete;
                        setAutoComplete(next);
                        localStorage.setItem('dslab_setting_autocomplete', String(next));
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        autoComplete ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        autoComplete ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Execution Timeout Limit */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="pr-4">
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white">
                        Execution Timeout Limit
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Maximum allowed runtime for complex algorithms before automated cancellation.
                      </div>
                    </div>
                    <select
                      value={executionTimeout}
                      onChange={(e) => {
                        setExecutionTimeout(e.target.value);
                        localStorage.setItem('dslab_setting_timeout', e.target.value);
                        addToast(`Timeout set to ${e.target.value}s`, 'info');
                      }}
                      className="min-h-[40px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E2E] text-xs font-mono text-slate-800 dark:text-slate-200 outline-none shrink-0"
                    >
                      <option value="5">5 seconds (Quick)</option>
                      <option value="10">10 seconds (Recommended)</option>
                      <option value="30">30 seconds (Long computations)</option>
                      <option value="60">60 seconds (Heavy data)</option>
                    </select>
                  </div>

                  {/* DataFrame Output Style */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="pr-4">
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white">
                        DataFrame Output Display Style
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Preferred visual formatting for Pandas tables rendered in output panels.
                      </div>
                    </div>
                    <select
                      value={dataframeDisplay}
                      onChange={(e) => {
                        setDataframeDisplay(e.target.value);
                        localStorage.setItem('dslab_setting_df_display', e.target.value);
                        addToast(`DataFrame view: ${e.target.value}`, 'info');
                      }}
                      className="min-h-[40px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E2E] text-xs font-mono text-slate-800 dark:text-slate-200 outline-none shrink-0"
                    >
                      <option value="table">Interactive Table (Sortable)</option>
                      <option value="text">Classic Terminal Output</option>
                      <option value="json">Structured JSON Tree</option>
                    </select>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              TAB 4: NOTIFICATIONS & AUDIO
             ======================================================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#07141F] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                
                <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-base sm:text-lg font-bold text-[#0B2538] dark:text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    Notification Channels &amp; Audio Feedback
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Configure laboratory pop-up toasts, event subscriptions, and execution audio chimes.
                  </p>
                </div>

                <div className="space-y-3">
                  
                  {/* Autograder Updates */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="pr-4">
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white">
                        Experiment Autograder Updates
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Notify upon automated test evaluation and code output generation.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !notifExp;
                        setNotifExp(next);
                        localStorage.setItem('dslab_setting_notif_exp', String(next));
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        notifExp ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        notifExp ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Project Deadlines */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="pr-4">
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white">
                        Project Deadlines &amp; Milestone Reminders
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Gentle notifications for practical submission cycles and midterm milestones.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !notifProjects;
                        setNotifProjects(next);
                        localStorage.setItem('dslab_setting_notif_proj', String(next));
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        notifProjects ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        notifProjects ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Curriculum Resource Additions */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="pr-4">
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white">
                        Curriculum Resource Updates
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Alerts when new cheat sheets, datasets, or video explanations are uploaded.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !notifResources;
                        setNotifResources(next);
                        localStorage.setItem('dslab_setting_notif_res', String(next));
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        notifResources ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        notifResources ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Audio Feedback with Live Preview Chime */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                    <div className="pr-4">
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white flex items-center gap-2">
                        {audioFeedback ? (
                          <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-slate-400" />
                        )}
                        <span>Audio Completion Chime</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Play a subtle acoustic notification when Python code cell runs with 0 errors.
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={playAudioFeedbackChime}
                        className="min-h-[36px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                        title="Test Sound Output"
                      >
                        <Play className="w-3 h-3 text-teal-600 fill-teal-600" />
                        <span>Test Sound</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const next = !audioFeedback;
                          setAudioFeedback(next);
                          localStorage.setItem('dslab_setting_audio', String(next));
                          if (next) playAudioFeedbackChime();
                        }}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                          audioFeedback ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          audioFeedback ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              TAB 5: GITHUB & INTEGRATIONS
             ======================================================== */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#07141F] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                
                <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-base sm:text-lg font-bold text-[#0B2538] dark:text-white flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    GitHub &amp; Cloud Notebook Environments
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Link university classroom repositories, Google Colab kernels, and local Jupyter notebook servers.
                  </p>
                </div>

                <div className="space-y-4">
                  
                  {/* GitHub Account Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                          <GitBranch className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#0B2538] dark:text-white">
                            GitHub Academic Sync
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Synchronizes lab experiment commits and project repositories.
                          </div>
                        </div>
                      </div>

                      <a
                        href={`https://github.com/${githubUser}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 hover:underline"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>@{githubUser}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={githubUser}
                        onChange={(e) => setGithubUser(e.target.value)}
                        placeholder="GitHub username (e.g. kartheek1717)"
                        className="flex-1 min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E2E] text-xs font-mono text-slate-800 dark:text-slate-200 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('dslab_setting_github_user', githubUser);
                          addToast(`GitHub username set to @${githubUser} ✓`, 'success');
                        }}
                        className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all"
                      >
                        Save Handle
                      </button>
                    </div>
                  </div>

                  {/* Auto Git Commit */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="pr-4">
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white">
                        Automatic Git Commit on Part Completion
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Generates a formatted commit message to your repository when marking sub-experiments complete.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !githubSync;
                        setGithubSync(next);
                        localStorage.setItem('dslab_setting_github_sync', String(next));
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        githubSync ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        githubSync ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Google Colab Runtime Preference */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="pr-4">
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white">
                        Google Colab Accelerator Default
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Target hardware when dispatching notebooks via "Open in Google Colab".
                      </div>
                    </div>
                    <select
                      value={colabHardware}
                      onChange={(e) => {
                        setColabHardware(e.target.value);
                        localStorage.setItem('dslab_setting_colab_hw', e.target.value);
                        addToast(`Colab accelerator set: ${e.target.value}`, 'info');
                      }}
                      className="min-h-[40px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E2E] text-xs font-mono text-slate-800 dark:text-slate-200 outline-none shrink-0"
                    >
                      <option value="standard">Standard CPU (Fast launch)</option>
                      <option value="t4_gpu">T4 GPU (Deep Learning)</option>
                      <option value="tpu">TPU v2 (Tensor Processing)</option>
                    </select>
                  </div>

                  {/* Local Jupyter Server URL */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-[#0B2538] dark:text-white">
                        Local Jupyter Lab Endpoint URL
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Port 8888
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={jupyterServerUrl}
                        onChange={(e) => setJupyterServerUrl(e.target.value)}
                        placeholder="http://localhost:8888"
                        className="flex-1 min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E2E] text-xs font-mono text-slate-800 dark:text-slate-200 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('dslab_setting_jupyter_url', jupyterServerUrl);
                          addToast('Jupyter server endpoint saved ✓', 'success');
                        }}
                        className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              TAB 6: STORAGE, BACKUP & DANGER ZONE
             ======================================================== */}
          {activeTab === 'appData' && (
            <div className="space-y-6">
              
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#07141F] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                
                <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-base sm:text-lg font-bold text-[#0B2538] dark:text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    Laboratory Data, Backup &amp; Safe Recovery
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Export full snapshots of your assignments, import previous saves, or restore official curriculum templates.
                  </p>
                </div>

                <div className="space-y-4">
                  
                  {/* Backup JSON Download */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
                    <div>
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white flex items-center gap-2">
                        <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span>Export Complete Laboratory Snapshot (JSON)</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-lg leading-relaxed">
                        Downloads an encrypted JSON backup file containing all 10 experiments, custom coding revisions, submitted projects, and student credentials.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportData}
                      className="min-h-[42px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shrink-0 transition-transform active:scale-95 shadow-md shadow-teal-600/20"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download JSON Backup</span>
                    </button>
                  </div>

                  {/* Restore from JSON File */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
                    <div>
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Import &amp; Restore from Backup File</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-lg leading-relaxed">
                        Restore code, custom experiments, or projects from a previously generated <code className="font-mono text-[11px] bg-slate-200 dark:bg-slate-800 px-1 rounded">.json</code> snapshot.
                      </p>
                    </div>

                    <div className="shrink-0">
                      <input
                        ref={importInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => importInputRef.current?.click()}
                        className="min-h-[42px] px-4 py-2 rounded-xl border border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Backup File</span>
                      </button>
                    </div>
                  </div>

                  {/* Restore Initial Standard Experiments */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-sky-100 dark:border-sky-900/40 bg-sky-50/60 dark:bg-sky-950/20">
                    <div>
                      <div className="font-bold text-sm text-[#0B2538] dark:text-white flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        <span>Restore Official 10 Curriculum Experiments</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-200/60 dark:bg-sky-800/60 text-sky-800 dark:text-sky-200 font-bold">
                          Safe
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-lg leading-relaxed">
                        Accidentally modified or deleted an experiment? This resets the 10 university lab exercises to default without affecting your profile or projects.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        restoreInitialExperiments();
                        if (audioFeedback) playAudioFeedbackChime();
                      }}
                      className="min-h-[42px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shrink-0 transition-transform active:scale-95 shadow-sm shadow-sky-600/25"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restore Standard 10</span>
                    </button>
                  </div>

                  {/* Danger Zone: Factory Reset */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-sm text-rose-800 dark:text-rose-300 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          <span>Danger Zone: Clear Local Data &amp; Reset</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-lg leading-relaxed">
                          Permanently wipes all local code changes, custom projects, notifications, and student profile back to fresh install state.
                        </p>
                      </div>

                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={() => {
                            setResetConfirmationText('');
                            setIsResetModalOpen(true);
                          }}
                          className="min-h-[42px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shrink-0 transition-all shadow-md shadow-rose-600/20"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Factory Reset...</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            addToast('Factory reset requires Administrator access. Please log in first.', 'error');
                            handleSelectTab('admin');
                          }}
                          className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center gap-2 shrink-0 transition-all cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Admin Auth Required</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: ADMIN ACCESS & AUTHENTICATION                           */}
          {/* ============================================================== */}
          {activeTab === 'admin' && (
            <div className="bg-white dark:bg-[#07141F] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-8 animate-in fade-in duration-200">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#0B2538] dark:text-white">
                      Administrator Authentication &amp; Permissions
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                    Secure workspace management. When visitors open this website, it defaults to read-only User Mode. Only logged-in administrators can edit experiments, student profile, or project code.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                    isAdmin 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    {isAdmin ? 'Admin Authenticated' : 'User Mode (Read-Only)'}
                  </span>
                </div>
              </div>

              {isAdmin ? (
                /* Authenticated Administrator View */
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-900/10 border border-emerald-500/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-extrabold text-base text-[#0B2538] dark:text-white">
                            Administrator Session Active
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Authenticated with Verified Full Edit Privileges
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          adminLogout();
                          addToast('Administrator session ended. Switched to User Mode.', 'info');
                        }}
                        className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 shadow-md shadow-rose-600/20 cursor-pointer self-start sm:self-auto"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out to User Mode</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-emerald-500/20">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-3">
                        Active Unlocked Permissions:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Full create, edit &amp; delete access to all 10 Experiments &amp; Parts</span>
                        </div>
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Editable student identity, avatar photo upload &amp; resume details</span>
                        </div>
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Add, modify, and delete Machine Learning portfolio projects</span>
                        </div>
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Authorized for data recovery, JSON backups &amp; factory wipes</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Shortcuts to Editable Sections */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Quick Links to Edit Surfaces
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentTab('experiments')}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-left transition-all bg-slate-50/50 dark:bg-slate-900/30 group cursor-pointer"
                      >
                        <div className="font-bold text-xs text-[#0B2538] dark:text-white group-hover:text-teal-600 flex items-center justify-between">
                          <span>Experiments Studio</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Edit exercises, manage parts &amp; solution codes
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentTab('profile')}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-left transition-all bg-slate-50/50 dark:bg-slate-900/30 group cursor-pointer"
                      >
                        <div className="font-bold text-xs text-[#0B2538] dark:text-white group-hover:text-teal-600 flex items-center justify-between">
                          <span>Student Profile &amp; CV</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Edit identity details, roll no, photo &amp; bio
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentTab('projects')}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-left transition-all bg-slate-50/50 dark:bg-slate-900/30 group cursor-pointer"
                      >
                        <div className="font-bold text-xs text-[#0B2538] dark:text-white group-hover:text-teal-600 flex items-center justify-between">
                          <span>Applied Projects</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Create and configure ML project showcases
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Unauthenticated Login Form View */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Form Column */}
                  <div className="lg:col-span-7 space-y-6">
                    <form 
                      onSubmit={handleAdminSubmit} 
                      className="space-y-4"
                      autoComplete="off"
                    >
                      {/* Hidden dummy fields to defeat browser credential autofill */}
                      <input 
                        type="text" 
                        name="prevent_autofill_user" 
                        tabIndex={-1} 
                        style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} 
                        autoComplete="off" 
                      />
                      <input 
                        type="password" 
                        name="prevent_autofill_pass" 
                        tabIndex={-1} 
                        style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} 
                        autoComplete="new-password" 
                      />

                      {adminError && (
                        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-in shake">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{adminError}</span>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                            Admin Username
                          </label>
                          {adminUsername && (
                            <button
                              type="button"
                              onClick={() => setAdminUsername('')}
                              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            name="dslab_adm_uid"
                            id="dslab_adm_uid"
                            autoComplete="new-password"
                            data-lpignore="true"
                            data-form-type="other"
                            value={adminUsername}
                            onChange={(e) => {
                              setAdminUsername(e.target.value);
                              setAdminError('');
                            }}
                            placeholder="Enter administrator username"
                            className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 text-xs sm:text-sm text-[#0B2538] dark:text-white outline-none focus:border-teal-500 font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                            Admin Password
                          </label>
                          {adminPassword && (
                            <button
                              type="button"
                              onClick={() => setAdminPassword('')}
                              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showAdminPassword ? 'text' : 'password'}
                            name="dslab_adm_pwd"
                            id="dslab_adm_pwd"
                            autoComplete="new-password"
                            data-lpignore="true"
                            data-form-type="other"
                            value={adminPassword}
                            onChange={(e) => {
                              setAdminPassword(e.target.value);
                              setAdminError('');
                            }}
                            placeholder="Enter administrator password"
                            className="w-full min-h-[44px] pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 text-xs sm:text-sm text-[#0B2538] dark:text-white outline-none focus:border-teal-500 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                            title={showAdminPassword ? 'Hide password' : 'Show password'}
                          >
                            {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoggingIn}
                          className="w-full min-h-[44px] px-5 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-600/25 active:scale-98 cursor-pointer disabled:opacity-60"
                        >
                          {isLoggingIn ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <LogIn className="w-4 h-4" />
                          )}
                          <span>{isLoggingIn ? 'Verifying Credentials...' : 'Sign In as Administrator'}</span>
                        </button>
                      </div>
                    </form>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="font-bold text-xs text-[#0B2538] dark:text-white flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-teal-600" />
                        <span>No Login Page or Barrier for Visitors</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Whenever someone opens or clicks the site link, they will directly enter the library in <strong className="text-slate-700 dark:text-slate-300">User Mode (Read-Only)</strong>. No popup or login screen blocks them. Only you use this Settings section when you want to make edits.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Security Policy & Privileges Notice (No credentials shown) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/10 via-teal-900/10 to-blue-900/10 border border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <h3 className="font-bold text-sm text-[#0B2538] dark:text-white">
                          Administrator Access Policy
                        </h3>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Administrative access grants full write and edit capabilities across all laboratory records, student credentials, and curriculum modules.
                      </p>

                      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                          <span>Visitors and students browse, test and execute code freely without needing any login.</span>
                        </div>
                        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                          <span>Only verified administrators can create, edit, reorder or delete experiments and projects.</span>
                        </div>
                        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                          <span>Admin sessions are maintained securely in your current browser session.</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Protected by secure session authentication.</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Two-Step Factory Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#07141F] rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/60 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0B2538] dark:text-white">
                  Confirm Laboratory Factory Reset
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This action is irreversible and clears all stored data.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              To proceed with resetting all 10 experiments, custom projects, student profile, and notes to fresh factory defaults, type <span className="font-mono font-bold text-rose-600 dark:text-rose-400">RESET</span> below:
            </p>

            <input
              type="text"
              value={resetConfirmationText}
              onChange={(e) => setResetConfirmationText(e.target.value)}
              placeholder="Type RESET to confirm"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E2E] text-xs font-mono font-bold text-rose-600 outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetConfirmationText !== 'RESET'}
                onClick={() => {
                  if (!isAdmin) {
                    addToast('Administrator privileges required to perform factory reset', 'error');
                    setIsResetModalOpen(false);
                    return;
                  }
                  resetAllData();
                  setIsResetModalOpen(false);
                }}
                className={`min-h-[42px] px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  resetConfirmationText === 'RESET'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                Permanently Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
