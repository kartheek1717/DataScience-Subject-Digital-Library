import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Trash2, 
  Camera,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Experiment } from '../../types';

export const CURATED_COVER_PRESETS = [
  {
    id: 'data-formats',
    label: '01 Data Formats & CSV',
    category: 'Tabular / Spreadsheets',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    description: 'Spreadsheet matrices, CSV rows and tabular Excel cells',
  },
  {
    id: 'web-apis',
    label: '02 Web APIs & Databases',
    category: 'Network / SQL',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    description: 'Server infrastructure, REST endpoints and API requests',
  },
  {
    id: 'data-cleaning',
    label: '03 Data Cleaning',
    category: 'Hygiene / Filtering',
    url: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=80',
    description: 'Data auditing, checklist validation and outlier hygiene',
  },
  {
    id: 'data-wrangling',
    label: '04 Data Wrangling',
    category: 'Reshaping / Joins',
    url: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=1200&q=80',
    description: 'Hierarchical schema restructuring, indexing and merging',
  },
  {
    id: 'visualization',
    label: '05 Data Visualization',
    category: 'Charts / Seaborn',
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    description: 'Multi-panel statistical charts, histograms and heatmaps',
  },
  {
    id: 'time-series',
    label: '06 Time Series Analysis',
    category: 'Temporal / Trends',
    url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
    description: 'Temporal trendlines, rolling averages and datetime sequences',
  },
  {
    id: 'aggregation',
    label: '07 Data Aggregation',
    category: 'GroupBy / Pivots',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    description: 'Aggregated analytics, metrics rollups and categorical tables',
  },
  {
    id: 'sentiment',
    label: '08 Sentiment Analysis',
    category: 'Reviews / Web Scraping',
    url: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=1200&q=80',
    description: 'Product reviews, star feedback ratings and text feedback',
  },
  {
    id: 'clustering',
    label: '09 Customer Segmentation',
    category: 'Clustering / Personas',
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    description: 'Customer cohorts, personas and demographic K-Means clusters',
  },
  {
    id: 'nlp-emotion',
    label: '10 NLP Emotion Detection',
    category: 'Text Mining / Vectors',
    url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    description: 'Linguistic expressions, semantic vectors and emotion classification',
  },
  {
    id: 'neural-networks',
    label: '11 AI & Deep Learning',
    category: 'Neural Nets',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    description: 'Abstract computational neural network architectures',
  },
  {
    id: 'code-terminal',
    label: '12 Python Lab Terminal',
    category: 'IDE / Code',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    description: 'Terminal code execution and data science programming',
  },
];

interface CoverPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiment: Experiment;
  defaultCoverUrl: string;
  onSave: (url: string) => void;
}

export const CoverPhotoModal: React.FC<CoverPhotoModalProps> = ({
  isOpen,
  onClose,
  experiment,
  defaultCoverUrl,
  onSave,
}) => {
  const currentCover = experiment.coverImage || experiment.thumbnail || defaultCoverUrl;
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentCover);
      setUrlInput(currentCover.startsWith('data:') ? '' : currentCover);
      setFileError('');
      setActiveTab('upload');
    }
  }, [isOpen, currentCover]);

  if (!isOpen) return null;

  const displayNum = experiment.displayNumber || String(experiment.number).padStart(2, '0');

  // Handle local file selection
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (.png, .jpg, .jpeg, .webp, .svg).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit. Please choose a smaller photo.');
      return;
    }

    setFileError('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSave = () => {
    if (!previewUrl.trim()) return;
    onSave(previewUrl.trim());
    onClose();
  };

  const handleResetToDefault = () => {
    setPreviewUrl(defaultCoverUrl);
    setUrlInput(defaultCoverUrl);
    setFileError('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#0D1E2A] border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-[#009F9A] dark:text-cyan-400 border border-teal-200/50 dark:border-teal-800/50 flex items-center justify-center shrink-0 shadow-2xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#0F2231] text-white">
                  EXP {displayNum}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Edit Cover Photo
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {experiment.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* 1. LIVE EXPERIMENT CARD BANNER PREVIEW */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-2 text-gray-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#009F9A]" />
                Card Cover Live Preview (16:6 Aspect Ratio)
              </span>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] text-[#009F9A] dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                title="Reset to original curated cover photo"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Default
              </button>
            </div>

            <div className="relative w-full h-[140px] sm:h-[155px] rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm group">
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Cover Preview"
                    className="w-full h-full object-cover object-center transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />
                  
                  {/* Mock Card Badges & Title to show exact look */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 pointer-events-none">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black bg-[#0F2231] text-white shadow-2xs border border-white/20">
                        {displayNum}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-teal-500/90 text-white backdrop-blur-xs">
                        {experiment.category || 'Python'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white drop-shadow-md truncate">
                      {experiment.title}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-slate-500">
                  <ImageIcon className="w-8 h-8 mb-1.5 opacity-60" />
                  <span className="text-xs font-medium">No cover image selected</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. TAB CONTROLS: Upload / URL / Presets */}
          <div className="flex items-center p-1 bg-gray-100 dark:bg-slate-800/80 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-[#0D1E2A] text-[#009F9A] dark:text-cyan-400 shadow-2xs'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload from PC</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-white dark:bg-[#0D1E2A] text-[#009F9A] dark:text-cyan-400 shadow-2xs'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Web Image Link</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-white dark:bg-[#0D1E2A] text-[#009F9A] dark:text-cyan-400 shadow-2xs'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Presets</span>
            </button>
          </div>

          {/* TAB 1: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center p-7 sm:p-9 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#009F9A] bg-teal-50/50 dark:bg-teal-950/20'
                    : 'border-gray-300 dark:border-slate-700 hover:border-[#009F9A] bg-gray-50/50 dark:bg-slate-850/40 hover:bg-teal-50/30'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-[#009F9A] dark:text-cyan-400 flex items-center justify-center mb-3 shadow-2xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-gray-800 dark:text-slate-200">
                    Click to browse or drag & drop image
                  </span>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Supports PNG, JPG, JPEG, WEBP or SVG up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>

              {fileError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WEB URL LINK */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Direct Image URL
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <LinkIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUrlInput(val);
                      if (val.trim()) {
                        setPreviewUrl(val.trim());
                      }
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#009F9A]"
                  />
                  {urlInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setUrlInput('');
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">
                Paste any high-resolution image link from Unsplash, university image hosts, or GitHub repository.
              </p>
            </div>
          )}

          {/* TAB 3: CURATED PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                Select from verified high-quality Data Science & Laboratory covers:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[260px] overflow-y-auto pr-1">
                {CURATED_COVER_PRESETS.map((preset) => {
                  const isSelected = previewUrl === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        setPreviewUrl(preset.url);
                        setUrlInput(preset.url);
                      }}
                      className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#009F9A] ring-2 ring-[#009F9A]/40 shadow-sm'
                          : 'border-gray-200 dark:border-slate-800 hover:border-[#009F9A]/50'
                      }`}
                    >
                      <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#009F9A] text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-white dark:bg-[#0D1E2A] text-left">
                        <div className="text-[11px] font-bold text-gray-900 dark:text-white truncate">
                          {preset.label}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
                          {preset.category}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!previewUrl}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
              previewUrl
                ? 'bg-[#009F9A] hover:bg-[#008783] text-white hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-300 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Save Cover Photo</span>
          </button>
        </div>

      </div>
    </div>
  );
};
