import React from 'react';
import { 
  Home, 
  Layers, 
  FlaskConical, 
  FolderKanban, 
  FileUser, 
  Wrench, 
  Settings 
} from 'lucide-react';
import { NavTab } from '../context/LabContext';

export interface AppPageItem {
  id: NavTab;
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.FC<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  keywords: string[];
}

export const APP_PAGES: AppPageItem[] = [
  {
    id: 'home',
    title: 'Home Dashboard',
    subtitle: 'Laboratory landing, student identity & quick actions',
    badge: 'Page',
    icon: Home,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    keywords: ['home', 'dashboard', 'overview', 'main', 'landing', 'student', 'id', 'card', 'welcome', 'start']
  },
  {
    id: 'modules',
    title: 'Curriculum Modules',
    subtitle: '4 academic units, syllabus topics & period breakdown',
    badge: 'Page',
    icon: Layers,
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    keywords: ['modules', 'module', 'curriculum', 'syllabus', 'units', 'unit', 'topics', 'theory', 'course', 'academic']
  },
  {
    id: 'experiments',
    title: 'Experiments Studio',
    subtitle: '10 hands-on Python laboratory experiments & practical parts',
    badge: 'Page',
    icon: FlaskConical,
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-50 dark:bg-teal-950/60',
    keywords: ['experiments', 'experiment', 'labs', 'lab', 'practical', 'code', 'runner', 'exercises', 'python', 'hands-on']
  },
  {
    id: 'projects',
    title: 'Applied Projects',
    subtitle: 'Industrial machine learning pipelines & AI data systems',
    badge: 'Page',
    icon: FolderKanban,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-950/60',
    keywords: ['projects', 'project', 'portfolio', 'machine learning', 'ml', 'ai', 'showcase', 'pipeline', 'applied']
  },
  {
    id: 'profile',
    title: 'Profile & ATS Resume',
    subtitle: 'Student developer profile, ATS curriculum vitae, skills & bio',
    badge: 'Page',
    icon: FileUser,
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-50 dark:bg-sky-950/60',
    keywords: ['profile', 'resume', 'cv', 'portfolio', 'student', 'bio', 'skills', 'education', 'certifications', 'ats', 'curriculum vitae']
  },
  {
    id: 'tools',
    title: 'Tools & Scientific Libraries',
    subtitle: 'Python ecosystem, Jupyter environment & Google Colab',
    badge: 'Page',
    icon: Wrench,
    iconColor: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-50 dark:bg-violet-950/60',
    keywords: ['tools', 'tool', 'libraries', 'jupyter', 'colab', 'pandas', 'numpy', 'scipy', 'sklearn', 'matplotlib', 'environment']
  },
  {
    id: 'settings',
    title: 'Settings & Admin Access',
    subtitle: 'Editor canvas, appearance, data backup & admin login',
    badge: 'Page',
    icon: Settings,
    iconColor: 'text-slate-600 dark:text-slate-400',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    keywords: ['settings', 'preferences', 'admin', 'administrator', 'login', 'config', 'theme', 'editor', 'backup', 'reset', 'password']
  }
];
