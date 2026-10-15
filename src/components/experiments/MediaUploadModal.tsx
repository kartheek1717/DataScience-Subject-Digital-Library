import React, { useState, useEffect } from 'react';
import { X, Upload, Link as LinkIcon, Image, Video, Check, Trash2 } from 'lucide-react';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  mediaType: 'image' | 'video';
  currentUrl?: string;
  requireTitle?: boolean;
  titlePlaceholder?: string;
  onSave: (url: string, mediaTitle?: string) => void;
}

export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  title,
  mediaType,
  currentUrl = '',
  requireTitle = false,
  titlePlaceholder = 'e.g. Architecture Flowchart, Execution Output',
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [mediaTitle, setMediaTitle] = useState('');
  const [preview, setPreview] = useState<string>('');
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrl(currentUrl || '');
      setPreview(currentUrl || '');
      setMediaTitle('');
      setFileError('');
      setActiveTab('upload');
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit for local storage friendliness (e.g., max ~8MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB. Please select a smaller file or use a web link.');
      return;
    }

    setFileError('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setPreview(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSave(url.trim(), mediaTitle.trim() || undefined);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            {mediaType === 'image' ? <Image className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mediaType === 'image'
                ? 'Upload an image file (.png, .jpg, .svg) or provide an image link'
                : 'Upload a video file (.mp4, .webm) or link from YouTube / Vimeo'}
            </p>
          </div>
        </div>

        {/* Tab switch: File Upload vs URL Link */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Web Link / URL</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
          {requireTitle && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Photo Caption / Diagram Title
              </label>
              <input
                type="text"
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                placeholder={titlePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}

          {activeTab === 'upload' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Select File from Computer
              </label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 rounded-xl cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Click to browse or drop {mediaType === 'image' ? 'image' : 'video'}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {mediaType === 'image' ? 'PNG, JPG, GIF, SVG up to 10MB' : 'MP4, WebM, MOV up to 10MB'}
                </span>
                <input
                  type="file"
                  accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {fileError && (
                <p className="text-xs text-rose-500 mt-1.5">{fileError}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Media Web URL
              </label>
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder={
                  mediaType === 'image'
                    ? 'https://images.unsplash.com/... or https://...'
                    : 'https://www.youtube.com/embed/... or https://...mp4'
                }
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}

          {/* Media Preview Box */}
          {preview && (
            <div className="mt-2">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Preview
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center max-h-52">
                {mediaType === 'image' ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-52 w-auto object-contain"
                    onError={() => setFileError('Failed to load image preview')}
                  />
                ) : (
                  preview.includes('youtube.com') || preview.includes('youtu.be') ? (
                    <iframe
                      src={preview}
                      title="Preview"
                      className="w-full aspect-video border-0"
                    />
                  ) : (
                    <video
                      src={preview}
                      controls
                      className="max-h-52 w-full object-contain"
                    />
                  )
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url.trim()}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] disabled:opacity-50 font-semibold text-sm text-white shadow-sm transition-all min-h-[44px] flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Media
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
