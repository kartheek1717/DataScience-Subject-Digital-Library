export type UserRole = 'student' | 'instructor' | 'admin' | 'user';

export interface ExperimentResource {
  id?: string;
  title: string;
  type: 'python' | 'dataset' | 'pdf' | 'notebook' | 'github' | 'link' | 'other' | string;
  url?: string;
  filename?: string;
  description?: string;
  visibility?: 'public' | 'enrolled' | 'hidden';
}

export interface DuplicateOptions {
  includeDetails: boolean;
  includeParts: boolean;
  includeCode: boolean;
  includeResources: boolean;
  includeProgress: boolean;
  newTitle?: string;
}

export interface ExperimentPhoto {
  id: string;
  url: string;
  title?: string;
  uploadedAt?: string;
}

export interface SubExperiment {
  id: string; // e.g. "1a"
  partLetter?: string; // e.g. "A", "B", "C", "D"
  title: string;
  name?: string; // 1. NAME
  aim?: string; // 2. AIM
  description: string; // 3. DESCRIPTION
  instructions?: string;
  code: string;
  solutionCode?: string;
  executionEnabled?: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  estimatedTime?: string;
  output: {
    columns?: string[];
    rows?: (string | number)[][];
    totalRows?: number;
    totalColumns?: number;
    executionTime?: string;
    logs?: string[];
    rawText?: string;
    plotType?: 'line' | 'bar' | 'stacked-bar' | 'histogram' | 'density' | 'scatter' | 'boxplot' | 'none';
  };
  explanation?: {
    title: string;
    steps: {
      number: number;
      title: string;
      description: string;
    }[];
  };
  keyPoints?: {
    term: string;
    description: string;
    badge?: string;
  }[];
  watchOut?: string[];
  demoVideo?: {
    duration: string;
    title: string;
    subtitle: string;
    tech: string;
    accentColor: string;
    videoUrl?: string; // local blob URL or external mp4/webm/youtube url
  };
  resources?: {
    title: string;
    type: string;
    filename?: string;
    url?: string;
  }[];
  isCompleted?: boolean;
}

export interface Experiment {
  id: string;
  number: number | string;
  displayNumber?: string; // e.g. "01(A)", "01(C)", "02"
  title: string;
  subtitle?: string;
  description: string;
  detailedDescription?: string;
  subjectCode?: string; // "22DS102006"
  academicYear?: string; // "2025–2026"
  category: string;
  technology: string;
  technologiesList?: string[];
  methods?: string;
  methodsList?: string[];
  language?: string; // "Python"
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration?: string;
  thumbnail: string;
  coverImage?: string;
  githubUrl: string;
  demoVideoUrl?: string;
  photos?: ExperimentPhoto[];
  progress: number; // 0 to 100
  status: 'completed' | 'in-progress' | 'not-started';
  subExperiments: SubExperiment[];
  tags: string[];
  learningObjectives?: string[];
  skillsChips?: string[];
  prerequisites?: string[];
  resources?: ExperimentResource[];
  isArchived?: boolean;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  technology: string[];
  progress: number;
  status: 'active' | 'completed' | 'draft';
  githubUrl: string;
  demoUrl?: string;
  stars: number;
  lastUpdated: string;
  thumbnail: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'Python' | 'Pandas' | 'NumPy' | 'Matplotlib' | 'Machine Learning' | 'Statistics' | 'SQL';
  type: 'Documentation' | 'Notes' | 'Cheatsheet' | 'Tutorial' | 'Video' | 'Guide';
  url: string;
  readTime: string;
  featured?: boolean;
}

export interface LabFile {
  id: string;
  name: string;
  type: '.py' | '.csv' | '.txt' | '.json' | '.xlsx' | '.ipynb';
  size: string;
  modified: string;
  content: string;
}

export interface NotebookCell {
  id: string;
  type: 'code' | 'markdown';
  content: string;
  output?: {
    type: 'dataframe' | 'text' | 'chart';
    data?: any;
    logs?: string[];
    executionTime?: string;
  };
  isExecuting?: boolean;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location: string;
  score: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
}

export interface StudentProfile {
  name: string;
  rollNo: string;
  branch: string;
  section: string;
  avatar: string;
  overallProgress: number;
  email: string;
  joinedDate: string;
  facultyName?: string;
  designation?: string;
  collegeName?: string;
  labIncharge?: string;
  phone?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  leetcodeUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  skills?: string[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
    isUnlocked: boolean;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'alert';
  read: boolean;
  link?: string;
}
