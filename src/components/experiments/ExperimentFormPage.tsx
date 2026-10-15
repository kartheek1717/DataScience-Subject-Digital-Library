import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Layers, 
  FileText, 
  Trash2, 
  Pencil,
  BookOpen,
  Sparkles,
  Image as ImageIcon,
  Video,
  Upload,
  Link as LinkIcon,
  FolderGit2,
  ExternalLink
} from 'lucide-react';
import { useLab } from '../../context/LabContext';
import { Experiment, SubExperiment, ExperimentResource, ExperimentPhoto } from '../../types';
import { PartFormModal } from './PartFormModal';
import { ResourceModal } from './ResourceModal';
import { ConfirmationDialog } from './ConfirmationDialog';
import { MediaUploadModal } from './MediaUploadModal';

interface ExperimentFormPageProps {
  mode: 'add' | 'edit';
  experimentId?: string;
  onCancel: () => void;
  onSaved: (expId: string) => void;
}

export const ExperimentFormPage: React.FC<ExperimentFormPageProps> = ({
  mode,
  experimentId,
  onCancel,
  onSaved,
}) => {
  const { experiments, addExperiment, updateExperiment } = useLab();
  const existingExp = mode === 'edit' && experimentId ? experiments.find((e) => e.id === experimentId) : null;

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [number, setNumber] = useState<number>(experiments.length + 1);
  const [displayNumber, setDisplayNumber] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [subjectCode, setSubjectCode] = useState('22DS102006');
  const [academicYear, setAcademicYear] = useState('2025–2026');
  const [category, setCategory] = useState('Data Cleaning & Preprocessing');
  const [technology, setTechnology] = useState('NumPy & Pandas');
  const [language, setLanguage] = useState('Python');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [estimatedDuration, setEstimatedDuration] = useState('90 mins');
  const [githubUrl, setGithubUrl] = useState('https://github.com/kartheek1717/DataScience1');
  const [learningObjectivesText, setLearningObjectivesText] = useState('');
  const [prerequisitesText, setPrerequisitesText] = useState('');

  // Media states (Cover Photo, Walkthrough Video, Reference Photos)
  const [thumbnail, setThumbnail] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [photos, setPhotos] = useState<ExperimentPhoto[]>([]);

  // Parts and Resources in draft form
  const [parts, setParts] = useState<SubExperiment[]>([]);
  const [resources, setResources] = useState<ExperimentResource[]>([]);

  // Modals for part/resource adding during form editing
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [editingPartIndex, setEditingPartIndex] = useState<number | null>(null);

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingResourceIndex, setEditingResourceIndex] = useState<number | null>(null);

  // Modals for media upload
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Unsaved changes confirmation
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  useEffect(() => {
    if (existingExp) {
      setTitle(existingExp.title || '');
      setSubtitle(existingExp.subtitle || '');
      setNumber(Number(existingExp.number) || 1);
      setDisplayNumber(existingExp.displayNumber || String(existingExp.number));
      setDescription(existingExp.description || '');
      setDetailedDescription(existingExp.detailedDescription || existingExp.description || '');
      setSubjectCode(existingExp.subjectCode || '22DS102006');
      setAcademicYear(existingExp.academicYear || '2025–2026');
      setCategory(existingExp.category || 'Data Science Laboratory');
      setTechnology(existingExp.technology || 'Python');
      setLanguage(existingExp.language || 'Python');
      setDifficulty(existingExp.difficulty || 'Intermediate');
      setEstimatedDuration(existingExp.estimatedDuration || '90 mins');
      setGithubUrl(existingExp.githubUrl || 'https://github.com/kartheek1717/DataScience1');
      setLearningObjectivesText(existingExp.learningObjectives ? existingExp.learningObjectives.join('\n') : '');
      setPrerequisitesText(existingExp.prerequisites ? existingExp.prerequisites.join('\n') : '');
      setParts(existingExp.subExperiments || []);
      setResources(existingExp.resources || []);
      setThumbnail(existingExp.coverImage || existingExp.thumbnail || '');
      setDemoVideoUrl(existingExp.demoVideoUrl || '');
      setPhotos(existingExp.photos || []);
      setIsDirty(false);
    } else {
      const nextNum = experiments.length + 1;
      const formattedNum = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
      setNumber(nextNum);
      setDisplayNumber(formattedNum);
      setTitle('');
      setSubtitle('');
      setDescription('');
      setDetailedDescription('');
      setLearningObjectivesText('Understand fundamental data science principles\nImplement algorithms with vectorized performance\nAnalyze output distribution and metrics');
      setPrerequisitesText('Basic Python 3.x syntax\nFamiliarity with arrays and lists');
      setParts([
        {
          id: `sub-init-1`,
          partLetter: 'A',
          title: 'Primary Practical Implementation',
          name: 'Primary Practical Implementation',
          aim: 'Execute initial algorithms in the virtual laboratory.',
          description: 'Hands-on coding exercise for this curriculum experiment.',
          code: `# Practical Experiment Implementation\nimport pandas as pd\nimport numpy as np\n\n# Step 1: Initialize data structure\nprint("Virtual lab runtime initialized.")\n`,
          difficulty: 'Medium',
          estimatedTime: '30 mins',
          output: {
            logs: ['Ready to execute.'],
            plotType: 'none',
          },
          isCompleted: false,
        },
      ]);
      setResources([]);
      setThumbnail('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80');
      setDemoVideoUrl('');
      setPhotos([]);
      setIsDirty(false);
    }
  }, [existingExp, mode, experiments.length]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onCancel();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const learningObjectives = learningObjectivesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const prerequisites = prerequisitesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const expId = existingExp?.id || `exp-${Date.now()}`;
    const formattedDisplay = displayNumber.trim() || (number < 10 ? `0${number}` : `${number}`);

    // Compute progress
    const completedParts = parts.filter((p) => p.isCompleted).length;
    const totalParts = parts.length || 1;
    const progress = Math.round((completedParts / totalParts) * 100);

    const finalExp: Experiment = {
      id: expId,
      number,
      displayNumber: formattedDisplay,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim(),
      detailedDescription: detailedDescription.trim() || description.trim(),
      subjectCode: subjectCode.trim(),
      academicYear: academicYear.trim(),
      category: category.trim(),
      technology: technology.trim(),
      language: language.trim(),
      difficulty,
      estimatedDuration: estimatedDuration.trim(),
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      coverImage: thumbnail.trim() || existingExp?.coverImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      githubUrl: githubUrl.trim(),
      demoVideoUrl: demoVideoUrl.trim() || undefined,
      photos: photos.length > 0 ? photos : undefined,
      progress: existingExp ? progress : 0,
      status: existingExp ? (progress >= 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started') : 'not-started',
      subExperiments: parts,
      tags: [technology, category, language].filter(Boolean),
      learningObjectives: learningObjectives.length > 0 ? learningObjectives : undefined,
      prerequisites: prerequisites.length > 0 ? prerequisites : undefined,
      resources: resources.length > 0 ? resources : undefined,
      createdAt: existingExp?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (mode === 'add') {
      addExperiment(finalExp);
    } else {
      updateExperiment(finalExp);
    }

    setIsDirty(false);
    onSaved(finalExp.id);
  };

  // Part management helpers
  const handleSavePartModal = (savedPart: SubExperiment) => {
    if (editingPartIndex !== null && editingPartIndex >= 0) {
      const updated = [...parts];
      updated[editingPartIndex] = savedPart;
      setParts(updated);
    } else {
      setParts([...parts, savedPart]);
    }
    markDirty();
  };

  const handleDeletePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
    markDirty();
  };

  // Resource management helpers
  const handleSaveResourceModal = (savedRes: ExperimentResource) => {
    if (editingResourceIndex !== null && editingResourceIndex >= 0) {
      const updated = [...resources];
      updated[editingResourceIndex] = savedRes;
      setResources(updated);
    } else {
      setResources([...resources, savedRes]);
    }
    markDirty();
  };

  const handleDeleteResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
    markDirty();
  };

  return (
    <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={handleCancelClick}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancelClick}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] font-semibold text-sm text-white shadow-sm transition-all min-h-[48px] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {mode === 'add' ? 'Create Experiment' : 'Save Experiment'}
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
            {mode === 'add' ? 'Curriculum Authoring' : 'Curriculum Editor'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Subject: {subjectCode} • {academicYear}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {mode === 'add' ? 'Add New Laboratory Experiment' : `Edit Experiment: ${title || 'Untitled'}`}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
          Define syllabus details, learning outcomes, interactive coding parts, and downloadable resources.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Basic Information */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            1. Core Curriculum Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Exp Number *
              </label>
              <input
                type="number"
                min="1"
                value={number}
                onChange={(e) => {
                  setNumber(Number(e.target.value));
                  markDirty();
                }}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Display ID (e.g. 01, 02)
              </label>
              <input
                type="text"
                value={displayNumber}
                onChange={(e) => {
                  setDisplayNumber(e.target.value);
                  markDirty();
                }}
                placeholder="01"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Experiment Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  markDirty();
                }}
                placeholder="e.g. Data Cleaning with NumPy & Pandas"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-12">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Short Description / Subtitle
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  markDirty();
                }}
                placeholder="Brief summary of what this experiment covers..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Subject Code
              </label>
              <input
                type="text"
                value={subjectCode}
                onChange={(e) => {
                  setSubjectCode(e.target.value);
                  markDirty();
                }}
                placeholder="22DS102006"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => {
                  setAcademicYear(e.target.value);
                  markDirty();
                }}
                placeholder="2025–2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Technology / Library
              </label>
              <input
                type="text"
                value={technology}
                onChange={(e) => {
                  setTechnology(e.target.value);
                  markDirty();
                }}
                placeholder="e.g. Pandas, Matplotlib, Scikit-learn"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Language
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  markDirty();
                }}
                placeholder="Python"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Curriculum Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  markDirty();
                }}
                placeholder="Data Cleaning & Preprocessing"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value as any);
                  markDirty();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Estimated Duration
              </label>
              <input
                type="text"
                value={estimatedDuration}
                onChange={(e) => {
                  setEstimatedDuration(e.target.value);
                  markDirty();
                }}
                placeholder="90 mins"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-12">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  GitHub Code Repository URL
                </span>
                {githubUrl && (githubUrl.startsWith('http://') || githubUrl.startsWith('https://')) && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <LinkIcon className="w-4 h-4" />
                </span>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    markDirty();
                  }}
                  placeholder="https://github.com/organization/ds-lab-experiment"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {githubUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setGithubUrl('');
                      markDirty();
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Clear GitHub link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Public or university repository URL where students can browse notebooks, clone starter templates, and verify solutions.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: Syllabus & Pedagogy */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            2. Learning Outcomes & Prerequisites
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Learning Objectives (One outcome per line)
              </label>
              <textarea
                rows={4}
                value={learningObjectivesText}
                onChange={(e) => {
                  setLearningObjectivesText(e.target.value);
                  markDirty();
                }}
                placeholder="Impute missing array data using Boolean masking&#10;Evaluate outlier thresholds using interquartile range"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Prerequisites (One per line)
              </label>
              <textarea
                rows={4}
                value={prerequisitesText}
                onChange={(e) => {
                  setPrerequisitesText(e.target.value);
                  markDirty();
                }}
                placeholder="Familiarity with Python list comprehensions&#10;Understanding of statistical mean and median"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Parts Management */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              3. Laboratory Coding Parts ({parts.length})
            </h2>

            <button
              type="button"
              onClick={() => {
                setEditingPartIndex(null);
                setIsPartModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Part
            </button>
          </div>

          {parts.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-sm">
              No parts configured. Click "Add Part" to add an interactive coding part.
            </div>
          ) : (
            <div className="space-y-3">
              {parts.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {p.partLetter || String.fromCharCode(65 + idx)}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {p.title || `Part ${p.partLetter || String.fromCharCode(65 + idx)}`}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {p.aim || p.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPartIndex(idx);
                        setIsPartModalOpen(true);
                      }}
                      className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Edit Part"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePart(idx)}
                      className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Part"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 4: Resources Management */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              4. Experiment Resources & Datasets ({resources.length})
            </h2>

            <button
              type="button"
              onClick={() => {
                setEditingResourceIndex(null);
                setIsResourceModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Resource
            </button>
          </div>

          {resources.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-sm">
              No supplementary resources added yet. Click "Add Resource" to attach files or links.
            </div>
          ) : (
            <div className="space-y-3">
              {resources.map((res, idx) => (
                <div
                  key={res.id || idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {res.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="uppercase text-[10px] font-semibold tracking-wider text-teal-600 dark:text-teal-400">
                        {res.type}
                      </span>
                      {res.url && <span>• {res.url}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingResourceIndex(idx);
                        setIsResourceModalOpen(true);
                      }}
                      className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Edit Resource"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteResource(idx)}
                      className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 5: Media, Video & Reference Diagrams */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              5. Media, Video Walkthrough & Reference Diagrams
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add visual assets including the experiment cover thumbnail, laboratory video walkthrough, and architecture diagrams.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 5A: Cover Photo / Thumbnail */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-sky-500" />
                  Cover Photo / Thumbnail
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCoverModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{thumbnail ? 'Change Cover' : 'Upload Cover'}</span>
                  </button>
                  {thumbnail && (
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnail('');
                        markDirty();
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Remove Cover Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {thumbnail ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900">
                  <img
                    src={thumbnail}
                    alt="Experiment Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center text-slate-400 bg-white/50 dark:bg-slate-900/30">
                  <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-1" />
                  <span className="text-xs font-medium">No cover photo set</span>
                  <span className="text-[11px] text-slate-400">Click upload to choose an image or enter a URL</span>
                </div>
              )}
            </div>

            {/* 5B: Walkthrough Video */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-cyan-500" />
                  Laboratory Walkthrough Video
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{demoVideoUrl ? 'Change Video' : 'Upload Video'}</span>
                  </button>
                  {demoVideoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setDemoVideoUrl('');
                        markDirty();
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Remove Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {demoVideoUrl ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 flex items-center justify-center">
                  {demoVideoUrl.includes('youtube.com') || demoVideoUrl.includes('youtu.be') ? (
                    <iframe
                      src={demoVideoUrl.replace('watch?v=', 'embed/')}
                      title="Video preview"
                      className="w-full h-full pointer-events-none"
                    />
                  ) : (
                    <video
                      src={demoVideoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              ) : (
                <div className="aspect-video rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center text-slate-400 bg-white/50 dark:bg-slate-900/30">
                  <Video className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-1" />
                  <span className="text-xs font-medium">No video uploaded</span>
                  <span className="text-[11px] text-slate-400">Upload a lab demo video clip or YouTube link</span>
                </div>
              )}
            </div>
          </div>

          {/* 5C: Reference Photos & Diagrams (Directly after video) */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Reference Diagrams & Output Photos ({photos.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Flowcharts, model schematics, or expected output screenshots displayed below the video.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Upload Photo / Diagram
              </button>
            </div>

            {photos.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-xs bg-slate-50/50 dark:bg-slate-800/30">
                No reference diagrams or output photos added. Click "Upload Photo / Diagram" to attach visuals.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                      <img
                        src={photo.url}
                        alt={photo.title || 'Diagram'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {photo.title || 'Reference Diagram'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {photo.uploadedAt ? new Date(photo.uploadedAt).toLocaleDateString() : 'Uploaded'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotos(photos.filter((_, i) => i !== idx));
                          markDirty();
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleCancelClick}
            className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[48px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] font-bold text-sm text-white shadow-md transition-all min-h-[48px] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {mode === 'add' ? 'Create Experiment' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Part Form Modal */}
      <PartFormModal
        isOpen={isPartModalOpen}
        onClose={() => setIsPartModalOpen(false)}
        partToEdit={editingPartIndex !== null ? parts[editingPartIndex] : null}
        defaultPartLetter={String.fromCharCode(65 + parts.length)}
        onSave={handleSavePartModal}
      />

      {/* Resource Modal */}
      <ResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        resourceToEdit={editingResourceIndex !== null ? resources[editingResourceIndex] : null}
        onSave={handleSaveResourceModal}
      />

      {/* Cover Photo Upload Modal */}
      <MediaUploadModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        title="Upload Experiment Cover Photo"
        mediaType="image"
        currentUrl={thumbnail}
        onSave={(url) => {
          setThumbnail(url);
          setIsCoverModalOpen(false);
          markDirty();
        }}
      />

      {/* Video Upload Modal */}
      <MediaUploadModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title="Upload Walkthrough Video"
        mediaType="video"
        currentUrl={demoVideoUrl}
        onSave={(url) => {
          setDemoVideoUrl(url);
          setIsVideoModalOpen(false);
          markDirty();
        }}
      />

      {/* Reference Photo Upload Modal */}
      <MediaUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title="Upload Reference Photo or Diagram"
        mediaType="image"
        requireTitle={true}
        titlePlaceholder="e.g. Architecture Diagram, Pipeline Flowchart"
        onSave={(url, mediaTitle) => {
          setPhotos([
            ...photos,
            {
              id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              url,
              title: mediaTitle || 'Reference Diagram',
              uploadedAt: new Date().toISOString(),
            },
          ]);
          setIsPhotoModalOpen(false);
          markDirty();
        }}
      />

      {/* Discard confirmation */}
      <ConfirmationDialog
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        onConfirm={() => {
          setShowDiscardConfirm(false);
          onCancel();
        }}
        title="Discard Unsaved Changes?"
        message="You have unsaved changes in this experiment form. If you leave now, your changes will be lost."
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        type="warning"
      />
    </div>
  );
};
