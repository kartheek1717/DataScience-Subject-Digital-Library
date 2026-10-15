import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { 
  BookOpen, 
  ExternalLink, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Upload,
  FileText
} from 'lucide-react';
import { Resource } from '../types';

export const ResourcesView: React.FC = () => {
  const { resources, addResource, updateResource, deleteResource, addFile } = useLab();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  // Resource Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Resource['category']>('Python');
  const [type, setType] = useState<Resource['type']>('Documentation');
  const [url, setUrl] = useState('https://');
  const [readTime, setReadTime] = useState('10 min');

  const categories = [
    'All',
    'Python',
    'Pandas',
    'NumPy',
    'Matplotlib',
    'Machine Learning',
    'Statistics',
    'SQL',
  ];

  const filteredResources = resources.filter((r) => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openCreateModal = () => {
    setEditingResource(null);
    setTitle('');
    setDescription('');
    setCategory('Python');
    setType('Documentation');
    setUrl('https://docs.python.org/3/');
    setReadTime('10 min');
    setIsModalOpen(true);
  };

  const openEditModal = (res: Resource) => {
    setEditingResource(res);
    setTitle(res.title);
    setDescription(res.description);
    setCategory(res.category);
    setType(res.type);
    setUrl(res.url);
    setReadTime(res.readTime);
    setIsModalOpen(true);
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingResource) {
      updateResource({
        ...editingResource,
        title,
        description,
        category,
        type,
        url,
        readTime,
      });
    } else {
      addResource({
        id: `res-${Date.now()}`,
        title,
        description,
        category,
        type,
        url,
        readTime,
      });
    }

    setIsModalOpen(false);
  };

  // Upload a local resource file (PDF, TXT, MD, etc.)
  const handleUploadResourceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const content = typeof reader.result === 'string' ? reader.result : '';
        // Add to files
        addFile({
          id: `file-${Date.now()}`,
          name: file.name,
          type: file.name.endsWith('.py') ? '.py' : file.name.endsWith('.csv') ? '.csv' : '.txt',
          size: `${(file.size / 1024).toFixed(1)} KB`,
          modified: 'Just now',
          content: content || `# Resource file ${file.name}\n`,
        });

        // Also add as Resource item
        addResource({
          id: `res-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: `Uploaded reference manual & course dataset (${(file.size / 1024).toFixed(1)} KB).`,
          category: 'Python',
          type: 'Notes',
          url: '#',
          readTime: 'File Download',
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3EDF2] dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B2538] dark:text-white">
              Resources Library
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Curated documentation, cheatsheets, notes, and uploadable documents.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-white dark:bg-[#0D1E2A] text-xs text-[#122333] dark:text-white outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <label className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer text-xs font-bold text-gray-700 dark:text-slate-200 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Upload Document</span>
            <input
              type="file"
              className="hidden"
              onChange={handleUploadResourceFile}
            />
          </label>

          <button
            onClick={openCreateModal}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#2563EB] text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 hover:opacity-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Resource</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === c
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-purple-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] dark:text-purple-300">
                  {res.type}
                </span>
                <span className="text-xs text-gray-400 font-mono">{res.readTime}</span>
              </div>

              <h3 className="font-extrabold text-base text-[#0B2538] dark:text-white group-hover:text-[#8B5CF6] transition-colors mb-2">
                {res.title}
              </h3>

              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
                {res.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E3EDF2] dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">{res.category}</span>
              
              <div className="flex items-center gap-2">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 hover:bg-[#8B5CF6] text-[#8B5CF6] hover:text-white dark:text-purple-300 dark:hover:text-white border border-purple-200/80 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs group/btn cursor-pointer"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>

                <button
                  onClick={() => openEditModal(res)}
                  className="p-1 text-gray-400 hover:text-[#8B5CF6] rounded"
                  title="Edit Resource"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Delete resource "${res.title}"?`)) {
                      deleteResource(res.id);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 rounded"
                  title="Delete Resource"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Modal: Create & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#0D1E2A] rounded-2xl shadow-2xl border border-[#E3EDF2] dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3EDF2] dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-[#0B2538] dark:text-white">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Scikit-learn Pipelines Tutorial"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-[#0B2538] dark:text-white outline-none"
                  >
                    {categories.filter(c => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Resource Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-[#0B2538] dark:text-white outline-none"
                  >
                    <option value="Documentation">Documentation</option>
                    <option value="Notes">Notes</option>
                    <option value="Cheatsheet">Cheatsheet</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Video">Video</option>
                    <option value="Guide">Guide</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    URL Link
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white font-bold"
                >
                  {editingResource ? 'Save Changes' : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
