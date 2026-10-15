import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Settings, 
  Sparkles,
  Layers,
  FileSpreadsheet,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Video,
  X
} from 'lucide-react';
import { SubExperiment } from '../types';

interface DemoVideoProps {
  demo?: SubExperiment['demoVideo'];
  onUpdateDemo?: (updated?: SubExperiment['demoVideo']) => void;
  subExpTitle?: string;
}

export const DemoVideo: React.FC<DemoVideoProps> = ({ demo, onUpdateDemo, subExpTitle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const totalDuration = 15; // 15 seconds demo

  // Edit / Add Video Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [title, setTitle] = useState(demo?.title || '');
  const [subtitle, setSubtitle] = useState(demo?.subtitle || '');
  const [tech, setTech] = useState(demo?.tech || 'Pandas v2.2');
  const [videoUrl, setVideoUrl] = useState(demo?.videoUrl || '');

  useEffect(() => {
    setTitle(demo?.title || '');
    setSubtitle(demo?.subtitle || '');
    setTech(demo?.tech || 'Pandas v2.2');
    setVideoUrl(demo?.videoUrl || '');
  }, [demo]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleRestart = () => {
    setSeconds(0);
    setIsPlaying(true);
  };

  const progressPercent = (seconds / totalDuration) * 100;

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (onUpdateDemo) {
      onUpdateDemo({
        duration: '0:15',
        title,
        subtitle,
        tech,
        accentColor: '#009F9A',
        videoUrl: videoUrl || undefined,
      });
    }
    setIsEditModalOpen(false);
  };

  const handleDeleteVideo = () => {
    if (confirm('Delete this demo video?')) {
      if (onUpdateDemo) {
        onUpdateDemo(undefined);
      }
    }
  };

  const handleUploadVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  // If no demo exists, provide an "Add Demo Video" state
  if (!demo) {
    return (
      <div className="rounded-2xl bg-white dark:bg-[#0D1E2A] border border-dashed border-[#E3EDF2] dark:border-slate-800 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#009F9A]/10 text-[#009F9A] flex items-center justify-center mx-auto">
          <Video className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-base text-[#0B2538] dark:text-white">
            No Demo Video Attached
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Upload an MP4 walkthrough or attach an interactive simulation tutorial for "{subExpTitle}".
          </p>
        </div>
        <button
          onClick={() => {
            setTitle(subExpTitle || 'Module Tutorial Demo');
            setSubtitle('Hands-on walkthrough of code transformations');
            setIsEditModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#009F9A] to-[#14B8A6] text-white font-bold text-xs shadow-md shadow-[#009F9A]/20 inline-flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Demo Video</span>
        </button>

        {/* Modal for adding */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-left">
            <div className="w-full max-w-md bg-white dark:bg-[#0D1E2A] rounded-2xl shadow-2xl border border-[#E3EDF2] dark:border-slate-800 p-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3EDF2] dark:border-slate-800 mb-4">
                <h3 className="font-bold text-base text-[#0B2538] dark:text-white">
                  Add Demo Video
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Subtitle / Description
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Framework / Tech Tag
                  </label>
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => setTech(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Upload MP4 Video File (or External URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://... or upload local file"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-xs text-[#0B2538] dark:text-white outline-none"
                    />
                    <label className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer text-xs font-bold text-[#009F9A] flex items-center shrink-0">
                      <Upload className="w-3.5 h-3.5 mr-1" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleUploadVideoFile}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl border text-gray-600 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#009F9A] text-white font-bold"
                  >
                    Save Video
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#07111C] border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      
      {/* Video Viewport Stage */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-[#061019] via-[#091D2C] to-[#040C13] flex items-center justify-center overflow-hidden">
        
        {/* If user uploaded a physical video URL, render HTML5 Video Player */}
        {demo.videoUrl ? (
          <video
            src={demo.videoUrl}
            controls
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <>
            {/* Subtle grid and ambient backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(#009F9A_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#009F9A]/15 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#2563EB]/15 blur-3xl" />

            {/* Video Overlay Content Mockup */}
            <div className="relative z-10 text-center p-6 max-w-md select-none">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#14B8A6] text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Short Interactive Demo (15 sec)</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {demo.title}
              </h3>

              <p className="text-xs sm:text-sm text-cyan-200/90 mt-2">
                {demo.subtitle}
              </p>

              <div className="flex items-center justify-center gap-3 mt-4 text-xs font-mono text-slate-300">
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#009F9A]" />
                  {demo.tech}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                  1080p 60fps HD
                </span>
              </div>

              {/* Central Play/Pause Action Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="mt-6 w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#009F9A] to-[#2563EB] text-white flex items-center justify-center shadow-lg shadow-[#009F9A]/40 hover:scale-105 active:scale-95 transition-all group"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                )}
              </button>
            </div>

            {/* Live Step Progression Indicator during playback */}
            {isPlaying && (
              <div className="absolute bottom-14 left-6 right-6 flex items-center justify-between p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-300 animate-in fade-in">
                <span>
                  {seconds < 5 && 'Step 1/3: Resolving remote TLS certificate...'}
                  {seconds >= 5 && seconds < 10 && 'Step 2/3: Decoding gzip chunk buffers...'}
                  {seconds >= 10 && 'Step 3/3: Constructing Pandas 2.2 Table...'}
                </span>
                <span className="text-emerald-400 font-bold">{seconds}s / {totalDuration}s</span>
              </div>
            )}
          </>
        )}

        {/* Top-Right Action Badges: Edit & Delete Video */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#009F9A] transition-colors"
            title="Edit Video Details"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteVideo}
            className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-red-500 transition-colors"
            title="Delete Video"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Video Control Bar (when simulation mode) */}
      {!demo.videoUrl && (
        <div className="p-3 bg-[#050D15] border-t border-slate-800 flex flex-col gap-2">
          {/* Progress Timeline Scrubber */}
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              setSeconds(Math.round(clickPos * totalDuration));
            }}
            className="relative h-1.5 bg-slate-800 rounded-full cursor-pointer overflow-hidden group"
          >
            <div 
              className="h-full bg-gradient-to-r from-[#009F9A] to-[#2563EB] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 hover:text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleRestart}
                className="p-1 hover:text-white transition-colors" 
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <span>
                00:{seconds < 10 ? `0${seconds}` : seconds} / 00:15
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="p-1 hover:text-white transition-colors"
                title="Video Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-1 hover:text-white transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-left">
          <div className="w-full max-w-md bg-white dark:bg-[#0D1E2A] rounded-2xl shadow-2xl border border-[#E3EDF2] dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3EDF2] dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-[#0B2538] dark:text-white">
                Edit Video Details
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Technology Tag
                </label>
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => setTech(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Upload MP4 Video File (or External URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://... or upload local file"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-xs text-[#0B2538] dark:text-white outline-none"
                  />
                  <label className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer text-xs font-bold text-[#009F9A] flex items-center shrink-0">
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleUploadVideoFile}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#009F9A] text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
