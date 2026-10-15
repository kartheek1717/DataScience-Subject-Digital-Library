import React, { useState, useMemo } from 'react';
import { useLab } from '../context/LabContext';
import { Project } from '../types';
import { 
  FolderKanban, 
  Search, 
  Filter, 
  ExternalLink, 
  Plus, 
  Star, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Code2, 
  Terminal, 
  Layers, 
  X, 
  Edit3, 
  Trash2, 
  ArrowUpRight,
  Cpu,
  BarChart2,
  FileCode2,
  Share2
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const ProjectsView: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, addToast, isAdmin } = useLab();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  // Modals state
  const [inspectProject, setInspectProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Machine Learning');
  const [formTech, setFormTech] = useState('');
  const [formProgress, setFormProgress] = useState(80);
  const [formStatus, setFormStatus] = useState<'active' | 'completed' | 'draft'>('active');
  const [formGithub, setFormGithub] = useState('');
  const [formDemo, setFormDemo] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => { if (p.category) set.add(p.category); });
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technology.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const active = projects.filter(p => p.status === 'active').length;
    const totalStars = projects.reduce((acc, p) => acc + (p.stars || 0), 0);
    return { total, completed, active, totalStars };
  }, [projects]);

  const openNewProjectModal = () => {
    if (!isAdmin) {
      addToast('Administrator privileges required to create projects', 'error');
      return;
    }
    setEditingProject(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('Machine Learning');
    setFormTech('Python, Scikit-learn, Pandas, NumPy');
    setFormProgress(50);
    setFormStatus('active');
    setFormGithub('https://github.com/kartheek/');
    setFormDemo('');
    setFormThumbnail('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80');
    setIsEditModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    if (!isAdmin) {
      addToast('Administrator privileges required to edit projects', 'error');
      return;
    }
    setEditingProject(p);
    setFormTitle(p.title);
    setFormDescription(p.description);
    setFormCategory(p.category);
    setFormTech(p.technology.join(', '));
    setFormProgress(p.progress);
    setFormStatus(p.status);
    setFormGithub(p.githubUrl);
    setFormDemo(p.demoUrl || '');
    setFormThumbnail(p.thumbnail);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (!isAdmin) {
      addToast('Administrator privileges required to delete projects', 'error');
      return;
    }
    deleteProject(projectId);
    if (inspectProject?.id === projectId) {
      setInspectProject(null);
    }
    addToast('Project deleted successfully', 'info');
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      addToast('Project title is required', 'error');
      return;
    }

    const techArray = formTech
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingProject) {
      updateProject({
        ...editingProject,
        title: formTitle,
        description: formDescription,
        category: formCategory,
        technology: techArray.length ? techArray : ['Python', 'Data Science'],
        progress: formProgress,
        status: formStatus,
        githubUrl: formGithub || 'https://github.com/kartheek/',
        demoUrl: formDemo || undefined,
        thumbnail: formThumbnail || editingProject.thumbnail
      });
      addToast('Project updated successfully ✓');
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        category: formCategory,
        technology: techArray.length ? techArray : ['Python', 'Data Science'],
        progress: formProgress,
        status: formStatus,
        githubUrl: formGithub || 'https://github.com/kartheek/',
        demoUrl: formDemo || undefined,
        stars: 0,
        lastUpdated: 'Just now',
        thumbnail: formThumbnail || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
      };
      addProject(newProj);
      addToast('New project created ✓');
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* Page Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2538] via-[#0E354D] to-[#041B2B] text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-sky-900/40">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>Applied Machine Learning &amp; AI Portfolio</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Applied Data Science Projects
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Industrial pipelines, neural architectures, and reproducible end-to-end data systems built using Python, XGBoost, PyTorch, and modern analytical frameworks.
            </p>
          </div>

          {/* Action Header Button */}
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={openNewProjectModal}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#009F9A] to-[#14B8A6] hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-teal-900/30 flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick KPI Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 mt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-1 flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Total Projects</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.total}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.completed}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>In Progress</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.active}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" />
              <span>GitHub Stars</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.totalStars} ★</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0C1D2A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects by title, tech stack (e.g. PyTorch, SHAP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 text-xs text-[#0B2538] dark:text-white outline-none focus:border-teal-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  selectedStatus === status
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {status === 'active' ? '⚡ Active' : status === 'completed' ? '✓ Completed' : 'All Status'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0C1D2A] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
          <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-[#0B2538] dark:text-white">No projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or add a new project to your portfolio.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedStatus('All'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-3xl bg-white dark:bg-[#0C1D2A] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Project Header Image / Banner */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1D2A] via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                      {project.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                        project.status === 'completed'
                          ? 'bg-emerald-500/80 text-white border-emerald-400'
                          : 'bg-amber-500/80 text-white border-amber-400'
                      }`}>
                        {project.status === 'completed' ? '✓ Completed' : '⚡ Active'}
                      </span>

                      {project.stars > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-white/10">
                          <Star className="w-3 h-3 fill-amber-300" />
                          {project.stars}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Edit/Delete buttons on hover */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-xs backdrop-blur-sm transition-colors"
                      title="Edit Project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${project.title}"?`)) {
                          deleteProject(project.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-700 text-white text-xs backdrop-blur-sm transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B2538] dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technology.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-medium border border-slate-200 dark:border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500 dark:text-slate-400">Implementation Progress</span>
                      <span className="font-bold text-[#0B2538] dark:text-white">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          project.progress >= 100
                            ? 'bg-emerald-500'
                            : project.progress >= 70
                            ? 'bg-teal-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 sm:px-6 py-4 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setInspectProject(project)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Architecture</span>
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Repo</span>
                    </a>
                  )}

                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Live Demo</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      onClick={() => setInspectProject(project)}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Inspect Project Architecture & Specs Modal */}
      {inspectProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in"
          onClick={() => setInspectProject(null)}
        >
          <div 
            className="w-full max-w-3xl bg-white dark:bg-[#07141F] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 text-[10px] font-bold uppercase tracking-wider">
                    {inspectProject.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {inspectProject.id}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B2538] dark:text-white">
                  {inspectProject.title}
                </h2>
              </div>
              <button
                onClick={() => setInspectProject(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Executive Abstract
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {inspectProject.description}
                </p>
              </div>

              {/* Architecture Pipeline Flow */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-500" />
                  <span>Pipeline Architecture &amp; Lifecycle</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                    <div className="font-bold text-teal-800 dark:text-teal-300">1. Data Ingestion</div>
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 mt-1">Multi-source ETL, Cleaning &amp; Schema Validation</p>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                    <div className="font-bold text-sky-800 dark:text-sky-300">2. Feature Pipeline</div>
                    <p className="text-[10px] text-sky-600 dark:text-sky-400 mt-1">Scaling, Encodings &amp; SHAP Feature Importance</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                    <div className="font-bold text-purple-800 dark:text-purple-300">3. Neural / ML Tuning</div>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-1">Cross-Validation &amp; Optuna Hyperparameter Optimization</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300">4. Edge Inference</div>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">FastAPI Endpoints, Low-Latency Caching &amp; Monitoring</p>
                  </div>
                </div>
              </div>

              {/* Technologies Applied */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Stack &amp; Scientific Dependencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {inspectProject.technology.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold border border-slate-200 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reproducible Starter Snippet */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-500" />
                  <span>Execution Scaffold (Python)</span>
                </h4>
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
{`# ${inspectProject.title} Pipeline Runner
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

def run_pipeline():
    print("[INIT] Loading verified dataset artifacts...")
    # Model runtime: ${inspectProject.technology.join(', ')}
    print("[TRAIN] Fitting hyper-tuned estimators...")
    print("[SUCCESS] Production model ready with status: ${inspectProject.status}")

if __name__ == "__main__":
    run_pipeline()`}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Progress: {inspectProject.progress}% complete
              </span>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        const p = inspectProject;
                        setInspectProject(null);
                        openEditModal(p);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(inspectProject.id)}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
                {inspectProject.githubUrl && (
                  <a
                    href={inspectProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-black transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>View on GitHub</span>
                  </a>
                )}
                <button
                  onClick={() => setInspectProject(null)}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Form Modal */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            className="w-full max-w-xl bg-white dark:bg-[#07141F] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <h3 className="font-extrabold text-base text-[#0B2538] dark:text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-teal-600" />
                <span>{editingProject ? 'Edit Project' : 'Create New Project'}</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Real-Time Fraud Detection Engine"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the problem statement, architecture, and results..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  >
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="NLP & Deep Learning">NLP &amp; Deep Learning</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="Graph ML">Graph ML</option>
                    <option value="Data Engineering">Data Engineering</option>
                    <option value="Time Series">Time Series</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  >
                    <option value="active">Active (In Progress)</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={formTech}
                  onChange={(e) => setFormTech(e.target.value)}
                  placeholder="Python, PyTorch, Scikit-learn, FastAPI"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  <span>Progress ({formProgress}%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formProgress}
                  onChange={(e) => setFormProgress(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={formGithub}
                    onChange={(e) => setFormGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Demo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formDemo}
                    onChange={(e) => setFormDemo(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
