import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Experiment, 
  Project, 
  Resource, 
  LabFile, 
  StudentProfile, 
  NotificationItem, 
  NotebookCell, 
  SubExperiment,
  UserRole,
  DuplicateOptions,
  ExperimentResource,
  ExperimentPhoto
} from '../types';
import { 
  INITIAL_EXPERIMENTS, 
  INITIAL_PROJECTS, 
  INITIAL_RESOURCES, 
  INITIAL_FILES, 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_NOTEBOOK_CELLS 
} from '../data/initialData';

export type NavTab = 'home' | 'modules' | 'experiments' | 'projects' | 'resume' | 'tools' | 'settings' | 'profile';

export type ExperimentViewMode = 
  | 'dashboard' 
  | 'details' 
  | 'overview' 
  | 'part' 
  | 'add-experiment' 
  | 'edit-experiment' 
  | 'manage-parts';

export type ToolTab = 'directory' | 'sql-sandbox' | 'numpy-calculator' | 'jupyter-colab';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface LabContextType {
  // Navigation & Theme
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Search Command Palette
  isCommandOpen: boolean;
  setIsCommandOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Experiment Navigation & Workspace View Mode
  experimentViewMode: ExperimentViewMode;
  setExperimentViewMode: (mode: ExperimentViewMode) => void;
  navigateToExperiment: (expId: string, mode?: ExperimentViewMode, subExpId?: string) => void;

  // Modules Navigation
  moduleNavTrigger: number;
  navigateToModule: (moduleNum: number | 'all') => void;

  // Tools Navigation
  selectedToolTab: ToolTab;
  setSelectedToolTab: (tab: ToolTab) => void;
  selectedToolCategory: string;
  setSelectedToolCategory: (category: string) => void;
  targetedToolId: string | null;
  setTargetedToolId: (toolId: string | null) => void;
  navigateToTool: (tab?: ToolTab, category?: string, toolId?: string) => void;

  // Data & State
  experiments: Experiment[];
  selectedExpId: string;
  setSelectedExpId: (id: string) => void;
  selectedSubExpId: string;
  setSelectedSubExpId: (id: string) => void;
  selectedModuleNumber: number | 'all';
  setSelectedModuleNumber: (num: number | 'all') => void;
  addExperiment: (exp: Experiment) => void;
  updateExperiment: (exp: Experiment) => void;
  deleteExperiment: (id: string) => void;
  duplicateExperiment: (id: string) => void;
  duplicateExperimentWithOptions: (id: string, options: DuplicateOptions) => Experiment | undefined;
  reorderExperiments: (newOrder: Experiment[]) => void;
  archiveExperiment: (id: string) => void;
  unarchiveExperiment: (id: string) => void;

  // Role & Admin Authentication
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  toggleUserRole: () => void;
  isAdmin: boolean;
  adminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;

  // Parts Management
  addPartToExperiment: (expId: string, part: SubExperiment) => void;
  updatePartInExperiment: (expId: string, part: SubExperiment) => void;
  deletePartFromExperiment: (expId: string, partId: string) => void;
  duplicatePartInExperiment: (expId: string, partId: string) => void;
  reorderPartsInExperiment: (expId: string, newParts: SubExperiment[]) => void;

  // Experiment Resources Management
  addResourceToExperiment: (expId: string, resource: ExperimentResource) => void;
  updateResourceInExperiment: (expId: string, resourceIndex: number, resource: ExperimentResource) => void;
  deleteResourceFromExperiment: (expId: string, resourceIndex: number) => void;

  // Media Management (Photos & Video)
  updateExperimentThumbnail: (expId: string, thumbnailUrl: string) => void;
  deleteExperimentThumbnail: (expId: string) => void;
  updateExperimentVideo: (expId: string, videoUrl?: string) => void;
  deleteExperimentVideo: (expId: string) => void;
  addPhotoToExperiment: (expId: string, photo: Omit<ExperimentPhoto, 'id'> & { id?: string }) => void;
  deletePhotoFromExperiment: (expId: string, photoId: string) => void;
  updateExperimentGithubUrl: (expId: string, githubUrl: string) => void;

  updateSubExpCode: (expId: string, subExpId: string, code: string) => void;
  updateSubExpDemoVideo: (expId: string, subExpId: string, demoVideo?: SubExperiment['demoVideo']) => void;
  markSubExpCompleted: (expId: string, subExpId: string) => void;
  restoreInitialExperiments: () => void;
  resetAllData: () => void;

  // Projects
  projects: Project[];
  addProject: (proj: Project) => void;
  updateProject: (proj: Project) => void;
  deleteProject: (id: string) => void;

  // Resources
  resources: Resource[];
  addResource: (res: Resource) => void;
  updateResource: (res: Resource) => void;
  deleteResource: (id: string) => void;

  // Files
  files: LabFile[];
  addFile: (file: LabFile) => void;
  deleteFile: (id: string) => void;
  updateFile: (id: string, newContent: string) => void;

  // Notebook
  notebookCells: NotebookCell[];
  setNotebookCells: React.Dispatch<React.SetStateAction<NotebookCell[]>>;
  addNotebookCell: (type: 'code' | 'markdown') => void;
  runNotebookCell: (id: string) => void;
  runAllNotebookCells: () => void;
  deleteNotebookCell: (id: string) => void;

  // Profile & Gamification
  profile: StudentProfile;
  updateProfile: (profile: Partial<StudentProfile>) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export const LabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & theme
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('dslab_theme') as 'light' | 'dark') || 'light';
  });

  // Modals & Search
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast messages
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync theme with DOM document element
  useEffect(() => {
    localStorage.setItem('dslab_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    addToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  // Keyboard shortcut '/' and 'Cmd+K / Ctrl+K' for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const headerSearch = document.getElementById('global-header-search');
        if (headerSearch) {
          headerSearch.focus();
        } else {
          setIsCommandOpen((prev) => !prev);
        }
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        const headerSearch = document.getElementById('global-header-search');
        if (headerSearch) {
          headerSearch.focus();
        } else {
          setIsCommandOpen(true);
        }
      } else if (e.key === 'Escape') {
        setIsCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const EXPERIMENTS_STORAGE_KEY = 'dslab_experiments_v17';

  // Experiments State with localStorage persistence and automatic repair
  const [experiments, setExperiments] = useState<Experiment[]>(() => {
    try {
      localStorage.removeItem('dslab_experiments');
      localStorage.removeItem('dslab_experiments_v2');
      localStorage.removeItem('dslab_experiments_v10');
      localStorage.removeItem('dslab_experiments_v11');
      localStorage.removeItem('dslab_experiments_v12');
      localStorage.removeItem('dslab_experiments_v13');
      localStorage.removeItem('dslab_experiments_v14');
      localStorage.removeItem('dslab_experiments_v15');
      localStorage.removeItem('dslab_experiments_v16');
      const saved = localStorage.getItem(EXPERIMENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10 && (parsed[0].number === 1 || parsed[0].displayNumber === '01')) {
          return parsed.map((exp: Experiment) => {
            const initialMatch = INITIAL_EXPERIMENTS.find((e) => e.id === exp.id || e.number === exp.number);
            return {
              ...exp,
              demoVideoUrl: exp.demoVideoUrl || `/videos/${exp.id}.mp4`,
              githubUrl: (!exp.githubUrl || exp.githubUrl.includes('ds-lab-new') || exp.githubUrl.includes('github.com/kartheek/'))
                ? (initialMatch?.githubUrl || exp.githubUrl)
                : exp.githubUrl
            };
          });
        }
      }
    } catch {
      // Fallback to default
    }
    return INITIAL_EXPERIMENTS;
  });

  const [selectedExpId, setSelectedExpId] = useState<string>('exp-1');
  const [selectedSubExpId, setSelectedSubExpId] = useState<string>('1a');
  const [selectedModuleNumber, setSelectedModuleNumber] = useState<number | 'all'>('all');

  // Experiment Workspace View Mode
  const [experimentViewMode, setExperimentViewMode] = useState<ExperimentViewMode>('dashboard');

  const navigateToExperiment = (expId: string, mode: ExperimentViewMode = 'details', subExpId?: string) => {
    setSelectedExpId(expId);
    const targetExp = experiments.find((e) => e.id === expId);
    if (subExpId) {
      setSelectedSubExpId(subExpId);
    } else if (targetExp?.subExperiments?.length) {
      const nextPart = targetExp.subExperiments.find((s) => !s.isCompleted) || targetExp.subExperiments[0];
      setSelectedSubExpId(nextPart.id);
    }
    setExperimentViewMode(mode);
    setCurrentTab('experiments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modules Navigation
  const [moduleNavTrigger, setModuleNavTrigger] = useState<number>(0);

  const navigateToModule = (moduleNum: number | 'all') => {
    setSelectedModuleNumber(moduleNum);
    setSearchQuery('');
    setModuleNavTrigger((prev) => prev + 1);
    setCurrentTab('modules');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tools Navigation
  const [selectedToolTab, setSelectedToolTab] = useState<ToolTab>('directory');
  const [selectedToolCategory, setSelectedToolCategory] = useState<string>('All');
  const [targetedToolId, setTargetedToolId] = useState<string | null>(null);

  const navigateToTool = (tab: ToolTab = 'directory', category?: string, toolId?: string) => {
    setSelectedToolTab(tab);
    if (category) {
      setSelectedToolCategory(category);
    } else {
      setSelectedToolCategory('All');
    }
    if (toolId) {
      setTargetedToolId(toolId);
    } else {
      setTargetedToolId(null);
    }
    setCurrentTab('tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    localStorage.setItem(EXPERIMENTS_STORAGE_KEY, JSON.stringify(experiments));
  }, [experiments]);

  const addExperiment = (exp: Experiment) => {
    setExperiments((prev) => [exp, ...prev]);
    addToast(`Experiment #${exp.number} added successfully ✓`);
  };

  const updateExperiment = (exp: Experiment) => {
    setExperiments((prev) => prev.map((item) => (item.id === exp.id ? exp : item)));
    addToast(`Experiment #${exp.number} updated ✓`);
  };

  const deleteExperiment = (id: string) => {
    const exp = experiments.find((e) => e.id === id);
    setExperiments((prev) => prev.filter((item) => item.id !== id));
    if (selectedExpId === id) {
      const remaining = experiments.filter((e) => e.id !== id);
      if (remaining.length > 0) {
        setSelectedExpId(remaining[0].id);
        setSelectedSubExpId(remaining[0].subExperiments[0]?.id || '');
      }
    }
    addToast(`Experiment "${exp?.title || id}" deleted`, 'info');
  };

  // User Role & Admin Authentication
  // Default mode for any visitor/link click is 'student' (User Mode / Read-Only).
  // Admin Mode is unlocked exclusively via Admin Login in Settings.
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const isAuth = sessionStorage.getItem('dslab_admin_authenticated') === 'true' ||
                     localStorage.getItem('dslab_admin_authenticated') === 'true';
      return isAuth ? 'admin' : 'student';
    } catch {
      return 'student';
    }
  });

  const isAdmin = userRole === 'admin' || userRole === 'instructor';

  const adminLogin = (username: string, password: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Accepted Admin Credentials
    const isValidUser = cleanUser === 'admin' || cleanUser === 'kartheek' || cleanUser === 'admin@datascience.edu';
    const isValidPass = cleanPass === 'admin123' || cleanPass === 'kartheek1717';

    if (isValidUser && isValidPass) {
      setUserRole('admin');
      try {
        sessionStorage.setItem('dslab_admin_authenticated', 'true');
        localStorage.setItem('dslab_admin_authenticated', 'true');
        localStorage.setItem('dslab_user_role', 'admin');
      } catch {
        // storage fallback
      }
      addToast('Welcome back, Admin! Full edit access granted ✓', 'success');
      return true;
    } else {
      addToast('Invalid administrator username or password', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setUserRole('student');
    try {
      sessionStorage.removeItem('dslab_admin_authenticated');
      localStorage.removeItem('dslab_admin_authenticated');
      localStorage.setItem('dslab_user_role', 'student');
    } catch {
      // storage fallback
    }
    addToast('Logged out of Admin mode. Now in User / Viewer mode (Read-Only).', 'info');
  };

  useEffect(() => {
    try {
      localStorage.setItem('dslab_user_role', userRole);
    } catch {
      // fallback
    }
  }, [userRole]);

  const toggleUserRole = () => {
    if (isAdmin) {
      adminLogout();
    } else {
      addToast('To switch to Admin Mode, please log in from Settings.', 'info');
    }
  };

  const reorderExperiments = (newOrder: Experiment[]) => {
    const renumbered = newOrder.map((exp, index) => {
      const num = index + 1;
      const displayNumber = num < 10 ? `0${num}` : `${num}`;
      return {
        ...exp,
        number: num,
        displayNumber: exp.displayNumber && exp.displayNumber.includes('(') ? exp.displayNumber : displayNumber,
      };
    });
    setExperiments(renumbered);
    addToast('Experiments reordered successfully ✓');
  };

  const duplicateExperimentWithOptions = (id: string, options: DuplicateOptions): Experiment | undefined => {
    const target = experiments.find((e) => e.id === id);
    if (!target) return undefined;

    const newNumber = experiments.length + 1;
    const newDisplayNumber = newNumber < 10 ? `0${newNumber}` : `${newNumber}`;
    const newId = `exp-${Date.now()}`;

    let clonedParts: SubExperiment[] = [];
    if (options.includeParts && target.subExperiments && target.subExperiments.length > 0) {
      clonedParts = target.subExperiments.map((sub, sIdx) => ({
        ...sub,
        id: `${newId}-sub-${sIdx + 1}`,
        code: options.includeCode ? sub.code : (sub.solutionCode ? '# Starter Code\nimport pandas as pd\nimport numpy as np\n' : ''),
        isCompleted: options.includeProgress ? sub.isCompleted : false,
      }));
    } else {
      clonedParts = [{
        id: `${newId}-sub-1`,
        partLetter: 'A',
        title: 'Initial Practical Exercise',
        description: 'Starter exercise for this new experiment.',
        code: '# Write your Python code here\nimport pandas as pd\nimport numpy as np\n',
        output: {
          logs: ['Workspace initialized. Click Run Code to execute.'],
          plotType: 'none',
        },
        isCompleted: false,
      }];
    }

    const clonedResources = (options.includeResources && target.resources)
      ? target.resources.map((r) => ({ ...r, id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` }))
      : [];

    const newExp: Experiment = {
      ...target,
      id: newId,
      number: newNumber,
      displayNumber: newDisplayNumber,
      title: options.newTitle ? options.newTitle : `${target.title} (Copy)`,
      status: options.includeProgress ? target.status : 'not-started',
      progress: options.includeProgress ? target.progress : 0,
      subExperiments: clonedParts,
      resources: clonedResources,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setExperiments((prev) => [newExp, ...prev]);
    setSelectedExpId(newExp.id);
    setSelectedSubExpId(newExp.subExperiments[0]?.id || '');
    addToast(`Duplicated into Experiment #${newExp.number} ✓`);
    return newExp;
  };

  const duplicateExperiment = (id: string) => {
    duplicateExperimentWithOptions(id, {
      includeDetails: true,
      includeParts: true,
      includeCode: true,
      includeResources: true,
      includeProgress: false,
    });
  };

  const archiveExperiment = (id: string) => {
    setExperiments((prev) => prev.map((exp) => (exp.id === id ? { ...exp, isArchived: true } : exp)));
    addToast('Experiment moved to archive', 'info');
  };

  const unarchiveExperiment = (id: string) => {
    setExperiments((prev) => prev.map((exp) => (exp.id === id ? { ...exp, isArchived: false } : exp)));
    addToast('Experiment restored from archive ✓', 'success');
  };

  const addPartToExperiment = (expId: string, part: SubExperiment) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nextLetter = letters[exp.subExperiments.length] || `${exp.subExperiments.length + 1}`;
        const newPart: SubExperiment = {
          ...part,
          id: part.id || `${expId}-sub-${Date.now()}`,
          partLetter: part.partLetter || nextLetter,
        };
        const updatedParts = [...exp.subExperiments, newPart];
        const completedCount = updatedParts.filter((s) => s.isCompleted).length;
        const totalCount = updatedParts.length || 1;
        const newProgress = Math.round((completedCount / totalCount) * 100);
        return {
          ...exp,
          subExperiments: updatedParts,
          progress: newProgress,
          status: newProgress >= 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'not-started',
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast(`Part "${part.title || 'New Part'}" added ✓`);
  };

  const updatePartInExperiment = (expId: string, updatedPart: SubExperiment) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        const updatedParts = exp.subExperiments.map((sub) => (sub.id === updatedPart.id ? updatedPart : sub));
        const completedCount = updatedParts.filter((s) => s.isCompleted).length;
        const totalCount = updatedParts.length || 1;
        const newProgress = Math.round((completedCount / totalCount) * 100);
        return {
          ...exp,
          subExperiments: updatedParts,
          progress: newProgress,
          status: newProgress >= 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'not-started',
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast(`Part "${updatedPart.title}" updated ✓`);
  };

  const deletePartFromExperiment = (expId: string, partId: string) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        const updatedParts = exp.subExperiments.filter((sub) => sub.id !== partId);
        const completedCount = updatedParts.filter((s) => s.isCompleted).length;
        const totalCount = updatedParts.length || 1;
        const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        return {
          ...exp,
          subExperiments: updatedParts,
          progress: newProgress,
          status: newProgress >= 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'not-started',
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast(`Part removed`, 'info');
  };

  const duplicatePartInExperiment = (expId: string, partId: string) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        const source = exp.subExperiments.find((s) => s.id === partId);
        if (!source) return exp;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nextLetter = letters[exp.subExperiments.length] || `${exp.subExperiments.length + 1}`;
        const clonedPart: SubExperiment = {
          ...source,
          id: `${expId}-sub-${Date.now()}`,
          partLetter: nextLetter,
          title: `${source.title} (Copy)`,
          isCompleted: false,
        };
        const updatedParts = [...exp.subExperiments, clonedPart];
        const completedCount = updatedParts.filter((s) => s.isCompleted).length;
        const totalCount = updatedParts.length || 1;
        const newProgress = Math.round((completedCount / totalCount) * 100);
        return {
          ...exp,
          subExperiments: updatedParts,
          progress: newProgress,
          status: newProgress >= 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'not-started',
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast(`Part duplicated ✓`);
  };

  const reorderPartsInExperiment = (expId: string, newParts: SubExperiment[]) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const renumberedParts = newParts.map((p, idx) => ({
          ...p,
          partLetter: letters[idx] || `${idx + 1}`,
        }));
        return {
          ...exp,
          subExperiments: renumberedParts,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast(`Parts reordered ✓`);
  };

  const addResourceToExperiment = (expId: string, resource: ExperimentResource) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        const resources = exp.resources || [];
        const newRes: ExperimentResource = {
          ...resource,
          id: resource.id || `res-${Date.now()}`,
        };
        return {
          ...exp,
          resources: [...resources, newRes],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast(`Resource "${resource.title}" added ✓`);
  };

  const updateResourceInExperiment = (expId: string, resourceIndex: number, resource: ExperimentResource) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        const resources = [...(exp.resources || [])];
        if (resourceIndex >= 0 && resourceIndex < resources.length) {
          resources[resourceIndex] = resource;
        }
        return {
          ...exp,
          resources,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast(`Resource updated ✓`);
  };

  const deleteResourceFromExperiment = (expId: string, resourceIndex: number) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        const resources = (exp.resources || []).filter((_, idx) => idx !== resourceIndex);
        return {
          ...exp,
          resources,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast(`Resource removed`, 'info');
  };

  const updateExperimentThumbnail = (expId: string, thumbnailUrl: string) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          thumbnail: thumbnailUrl,
          coverImage: thumbnailUrl,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast('Experiment cover photo updated ✓');
  };

  const deleteExperimentThumbnail = (expId: string) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          thumbnail: '',
          coverImage: '',
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast('Cover photo removed', 'info');
  };

  const updateExperimentVideo = (expId: string, videoUrl?: string) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          demoVideoUrl: videoUrl,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast(videoUrl ? 'Experiment walkthrough video updated ✓' : 'Video removed', 'info');
  };

  const deleteExperimentVideo = (expId: string) => {
    updateExperimentVideo(expId, undefined);
  };

  const addPhotoToExperiment = (expId: string, photo: Omit<ExperimentPhoto, 'id'> & { id?: string }) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        const photos = exp.photos || [];
        const newPhoto: ExperimentPhoto = {
          ...photo,
          id: photo.id || `photo-${Date.now()}`,
          uploadedAt: photo.uploadedAt || new Date().toISOString(),
        };
        return {
          ...exp,
          photos: [...photos, newPhoto],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast('Photo uploaded successfully ✓');
  };

  const deletePhotoFromExperiment = (expId: string, photoId: string) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        const photos = (exp.photos || []).filter((p) => p.id !== photoId);
        return {
          ...exp,
          photos,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast('Photo removed', 'info');
  };

  const updateExperimentGithubUrl = (expId: string, githubUrl: string) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          githubUrl: githubUrl.trim(),
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast(githubUrl.trim() ? 'GitHub repository link updated ✓' : 'GitHub link removed', 'info');
  };

  const updateSubExpCode = (expId: string, subExpId: string, code: string) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          subExperiments: exp.subExperiments.map((sub) =>
            sub.id === subExpId ? { ...sub, code } : sub
          ),
        };
      })
    );
  };

  const updateSubExpDemoVideo = (expId: string, subExpId: string, demoVideo?: SubExperiment['demoVideo']) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          subExperiments: exp.subExperiments.map((sub) =>
            sub.id === subExpId ? { ...sub, demoVideo } : sub
          ),
        };
      })
    );
    addToast(demoVideo ? 'Video demo updated ✓' : 'Video demo removed', 'info');
  };

  const markSubExpCompleted = (expId: string, subExpId: string) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== expId) return exp;
        const updatedSubs = exp.subExperiments.map((sub) =>
          sub.id === subExpId ? { ...sub, isCompleted: true } : sub
        );
        const completedCount = updatedSubs.filter((s) => s.isCompleted).length;
        const totalCount = updatedSubs.length || 1;
        const newProgress = Math.round((completedCount / totalCount) * 100);
        const newStatus: Experiment['status'] =
          newProgress >= 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'not-started';
        return {
          ...exp,
          subExperiments: updatedSubs,
          progress: newProgress,
          status: newStatus,
        };
      })
    );
    addToast('Progress updated! Part completed ✓', 'success');
  };

  const restoreInitialExperiments = () => {
    localStorage.removeItem(EXPERIMENTS_STORAGE_KEY);
    setExperiments(INITIAL_EXPERIMENTS);
    setSelectedExpId(INITIAL_EXPERIMENTS[0]?.id || 'exp-1');
    setSelectedSubExpId(INITIAL_EXPERIMENTS[0]?.subExperiments[0]?.id || '1a');
    addToast('All default laboratory experiments restored successfully ✓');
  };

  const resetAllData = () => {
    localStorage.removeItem(EXPERIMENTS_STORAGE_KEY);
    localStorage.removeItem('dslab_projects');
    localStorage.removeItem('dslab_projects_v3');
    localStorage.removeItem('dslab_profile');
    localStorage.removeItem('dslab_notifications');
    setExperiments(INITIAL_EXPERIMENTS);
    setProjects(INITIAL_PROJECTS);
    setSelectedExpId(INITIAL_EXPERIMENTS[0]?.id || 'exp-1');
    setSelectedSubExpId(INITIAL_EXPERIMENTS[0]?.subExperiments[0]?.id || '1a');
    addToast('All DS LAB platform experiments and records reset to default ✓');
  };

  // Projects State (Version 3.0: Only BTC AI Trader and Block Survive)
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const version = localStorage.getItem('dslab_projects_v3');
      if (version !== '3.0') {
        localStorage.setItem('dslab_projects_v3', '3.0');
        localStorage.setItem('dslab_projects', JSON.stringify(INITIAL_PROJECTS));
        return INITIAL_PROJECTS;
      }
      const saved = localStorage.getItem('dslab_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((p: Project) => p.id !== 'proj-1' && p.id !== 'proj-2');
          const hasBtc = filtered.some((p: Project) => p.id === 'proj-btc');
          const hasBlockSurvive = filtered.some((p: Project) => p.id === 'proj-block-survive');
          if (!hasBtc || !hasBlockSurvive) {
            return INITIAL_PROJECTS;
          }
          return filtered;
        }
      }
      return INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('dslab_projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (proj: Project) => {
    setProjects((prev) => [proj, ...prev]);
    addToast(`Project "${proj.title}" created ✓`);
  };

  const updateProject = (proj: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === proj.id ? proj : p)));
    addToast(`Project updated ✓`);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addToast(`Project removed`, 'info');
  };

  // Resources
  const [resources, setResources] = useState<Resource[]>(() => {
    try {
      const saved = localStorage.getItem('dslab_resources');
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  useEffect(() => {
    localStorage.setItem('dslab_resources', JSON.stringify(resources));
  }, [resources]);

  const addResource = (res: Resource) => {
    setResources((prev) => [res, ...prev]);
    addToast(`Resource added to library ✓`);
  };

  const updateResource = (res: Resource) => {
    setResources((prev) => prev.map((r) => (r.id === res.id ? res : r)));
    addToast(`Resource updated ✓`);
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    addToast(`Resource deleted`, 'info');
  };

  // Files
  const [files, setFiles] = useState<LabFile[]>(() => {
    try {
      const saved = localStorage.getItem('dslab_files');
      return saved ? JSON.parse(saved) : INITIAL_FILES;
    } catch {
      return INITIAL_FILES;
    }
  });

  useEffect(() => {
    localStorage.setItem('dslab_files', JSON.stringify(files));
  }, [files]);

  const addFile = (file: LabFile) => {
    setFiles((prev) => [file, ...prev]);
    addToast(`File "${file.name}" uploaded successfully ✓`);
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    addToast(`File deleted`, 'info');
  };

  const updateFile = (id: string, newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, content: newContent, modified: 'Just now' } : f))
    );
    addToast(`File saved ✓`);
  };

  // Notebook
  const [notebookCells, setNotebookCells] = useState<NotebookCell[]>(() => {
    try {
      const saved = localStorage.getItem('dslab_notebook');
      return saved ? JSON.parse(saved) : INITIAL_NOTEBOOK_CELLS;
    } catch {
      return INITIAL_NOTEBOOK_CELLS;
    }
  });

  useEffect(() => {
    localStorage.setItem('dslab_notebook', JSON.stringify(notebookCells));
  }, [notebookCells]);

  const addNotebookCell = (type: 'code' | 'markdown') => {
    const newCell: NotebookCell = {
      id: `cell-${Date.now()}`,
      type,
      content: type === 'code' ? `# Enter Python code\nimport pandas as pd\n` : `### New Markdown Section\nEnter notes here...`,
    };
    setNotebookCells((prev) => [...prev, newCell]);
    addToast(`Added new ${type} cell`);
  };

  const runNotebookCell = (id: string) => {
    setNotebookCells((prev) =>
      prev.map((cell) => {
        if (cell.id !== id) return cell;
        return {
          ...cell,
          isExecuting: true,
        };
      })
    );

    setTimeout(() => {
      setNotebookCells((prev) =>
        prev.map((cell) => {
          if (cell.id !== id) return cell;
          return {
            ...cell,
            isExecuting: false,
            output: {
              type: 'dataframe',
              data: {
                columns: ['Epoch', 'Train_Loss', 'Val_Accuracy'],
                rows: [
                  [1, 0.4521, 0.884],
                  [2, 0.3120, 0.921],
                  [3, 0.2014, 0.957]
                ]
              },
              logs: ['[RUNTIME] Python 3.12.2 environment', '[RESULT] Execution finished in 0.18s'],
              executionTime: '0.18s'
            }
          };
        })
      );
      addToast('Cell executed successfully ✓');
    }, 600);
  };

  const runAllNotebookCells = () => {
    addToast('Executing full notebook...', 'info');
    setTimeout(() => {
      setNotebookCells((prev) =>
        prev.map((cell) =>
          cell.type === 'code'
            ? {
                ...cell,
                output: {
                  type: 'dataframe',
                  data: {
                    columns: ['Metric', 'Score'],
                    rows: [
                      ['F1-Score', 0.941],
                      ['Precision', 0.958],
                      ['Recall', 0.925]
                    ]
                  },
                  logs: ['All cells executed sequentially.'],
                  executionTime: '0.34s'
                }
              }
            : cell
        )
      );
      addToast('All cells executed ✓');
    }, 800);
  };

  const deleteNotebookCell = (id: string) => {
    setNotebookCells((prev) => prev.filter((c) => c.id !== id));
    addToast('Cell removed');
  };

  // Student Profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('dslab_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.rollNo === '24102A03 0040' || !parsed.rollNo) {
          parsed.rollNo = '24102A030006';
        }
        const currentAvatarVersion = localStorage.getItem('dslab_avatar_version_v4');
        if (currentAvatarVersion !== '4.0') {
          parsed.avatar = '/kartheek_profile.jpg';
          localStorage.setItem('dslab_avatar_version_v4', '4.0');
        }
        if (!parsed.collegeName || parsed.collegeName.includes('University College of Engineering') || parsed.collegeName.trim() === '') {
          parsed.collegeName = 'Mohan Babu University';
        }
        if (!parsed.facultyName || parsed.facultyName.includes('Ramanathan') || parsed.facultyName === 'S.Bosubabu' || parsed.facultyName.trim() === '') {
          parsed.facultyName = 'S Bosubabu';
        }
        if (!parsed.designation || parsed.designation.includes('Ananya Sen') || parsed.designation.trim() === '') {
          parsed.designation = 'Assistant Professor';
          parsed.labIncharge = 'Assistant Professor';
        }
        if (!parsed.bio) {
          parsed.bio = INITIAL_STUDENT_PROFILE.bio;
        }
        if (!parsed.skills || !parsed.skills.length) {
          parsed.skills = INITIAL_STUDENT_PROFILE.skills;
        }
        if (!parsed.phone) {
          parsed.phone = INITIAL_STUDENT_PROFILE.phone;
        }
        if (!parsed.githubUrl) {
          parsed.githubUrl = INITIAL_STUDENT_PROFILE.githubUrl;
        }
        const resumeVersion = localStorage.getItem('dslab_resume_sync_v3');
        if (resumeVersion !== '3.0') {
          parsed.name = 'BADABAGNI KARTHEEK';
          parsed.email = 'kartheek1717@gmail.com';
          parsed.phone = '+91 7569270943';
          parsed.location = 'Nellore, Andhra Pradesh, India';
          parsed.githubUrl = 'https://github.com/kartheek1717';
          parsed.linkedinUrl = 'https://www.linkedin.com/in/kartheek-badabagni-950431323/';
          parsed.leetcodeUrl = 'https://leetcode.com/u/pandu_17/';
          parsed.bio = INITIAL_STUDENT_PROFILE.bio;
          parsed.skills = INITIAL_STUDENT_PROFILE.skills;
          parsed.education = INITIAL_STUDENT_PROFILE.education;
          parsed.certifications = INITIAL_STUDENT_PROFILE.certifications;
          parsed.achievements = INITIAL_STUDENT_PROFILE.achievements;
          localStorage.setItem('dslab_resume_sync_v3', '3.0');
        }
        if (!parsed.linkedinUrl || parsed.linkedinUrl === 'https://linkedin.com/in/kartheek-badabagni' || !parsed.linkedinUrl.includes('950431323')) {
          parsed.linkedinUrl = 'https://www.linkedin.com/in/kartheek-badabagni-950431323/';
        }
        if (!parsed.location) parsed.location = INITIAL_STUDENT_PROFILE.location;
        if (!parsed.leetcodeUrl) parsed.leetcodeUrl = INITIAL_STUDENT_PROFILE.leetcodeUrl;
        if (!parsed.education) parsed.education = INITIAL_STUDENT_PROFILE.education;
        if (!parsed.certifications) parsed.certifications = INITIAL_STUDENT_PROFILE.certifications;
        return parsed;
      }
      return INITIAL_STUDENT_PROFILE;
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  });

  useEffect(() => {
    localStorage.setItem('dslab_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (data: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
    addToast('Profile updated ✓');
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('dslab_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem('dslab_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read');
  };

  return (
    <LabContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        theme,
        setTheme,
        toggleTheme,
        isCommandOpen,
        setIsCommandOpen,
        searchQuery,
        setSearchQuery,
        experimentViewMode,
        setExperimentViewMode,
        navigateToExperiment,
        moduleNavTrigger,
        navigateToModule,
        selectedToolTab,
        setSelectedToolTab,
        selectedToolCategory,
        setSelectedToolCategory,
        targetedToolId,
        setTargetedToolId,
        navigateToTool,
        experiments,
        selectedExpId,
        setSelectedExpId,
        selectedSubExpId,
        setSelectedSubExpId,
        selectedModuleNumber,
        setSelectedModuleNumber,
        addExperiment,
        updateExperiment,
        deleteExperiment,
        duplicateExperiment,
        duplicateExperimentWithOptions,
        reorderExperiments,
        archiveExperiment,
        unarchiveExperiment,
        userRole,
        setUserRole,
        toggleUserRole,
        isAdmin,
        adminLogin,
        adminLogout,
        addPartToExperiment,
        updatePartInExperiment,
        deletePartFromExperiment,
        duplicatePartInExperiment,
        reorderPartsInExperiment,
        addResourceToExperiment,
        updateResourceInExperiment,
        deleteResourceFromExperiment,
        updateExperimentThumbnail,
        deleteExperimentThumbnail,
        updateExperimentVideo,
        deleteExperimentVideo,
        addPhotoToExperiment,
        deletePhotoFromExperiment,
        updateExperimentGithubUrl,
        updateSubExpCode,
        updateSubExpDemoVideo,
        markSubExpCompleted,
        restoreInitialExperiments,
        resetAllData,
        projects,
        addProject,
        updateProject,
        deleteProject,
        resources,
        addResource,
        updateResource,
        deleteResource,
        files,
        addFile,
        deleteFile,
        updateFile,
        notebookCells,
        setNotebookCells,
        addNotebookCell,
        runNotebookCell,
        runAllNotebookCells,
        deleteNotebookCell,
        profile,
        updateProfile,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </LabContext.Provider>
  );
};

export const useLab = () => {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error('useLab must be used within a LabProvider');
  }
  return context;
};
