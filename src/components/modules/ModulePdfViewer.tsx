import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  BookOpen,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface ModulePdfViewerProps {
  moduleNumber: number;
  moduleCode: string;
  moduleTitle: string;
  pdfUrl: string;
  totalPages?: number;
  accentColor?: string;
}

export const ModulePdfViewer: React.FC<ModulePdfViewerProps> = ({
  moduleNumber,
  moduleCode,
  moduleTitle,
  pdfUrl,
  totalPages,
  accentColor = '#009F9A'
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerHeight, setViewerHeight] = useState<'normal' | 'tall'>('normal');

  // URL with PDF viewer parameters for seamless vertical scrolling & fitting
  const embedUrl = `${pdfUrl}#toolbar=1&navpanes=0&view=FitH&pagemode=bookmarks`;

  return (
    <>
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#07141F] shadow-xs overflow-hidden transition-all">
        
        {/* PDF VIEWER HEADER TOOLBAR */}
        <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Left: Document Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-200/50 dark:border-teal-800/50 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-[#0B2538] dark:text-white">
                  Official Lecture Notes &amp; Textbook Reading
                </span>
                {totalPages && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {totalPages} Pages
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {moduleCode}: {moduleTitle} • Complete curriculum document
              </p>
            </div>
          </div>

          {/* Right: Quick Reader Actions */}
          <div className="flex items-center gap-1.5 self-end sm:self-center">
            {/* Height toggle */}
            <button
              onClick={() => setViewerHeight(prev => prev === 'normal' ? 'tall' : 'normal')}
              className="min-h-[36px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title={viewerHeight === 'normal' ? 'Expand height' : 'Compact height'}
            >
              <span>{viewerHeight === 'normal' ? 'Tall (750px)' : 'Standard (540px)'}</span>
            </button>

            {/* Open in New Window */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[36px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
              title="Open full PDF in separate browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">New Tab</span>
            </a>

            {/* Direct Download */}
            <a
              href={pdfUrl}
              download={`${moduleCode.replace(/\s+/g, '_')}_Notes.pdf`}
              className="min-h-[36px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
              title="Download PDF to computer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Fullscreen Mode */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="min-h-[36px] px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Open Fullscreen Reader"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>
          </div>

        </div>

        {/* EMBEDDED PDF CONTAINER */}
        <div 
          className={`w-full transition-all duration-200 relative bg-slate-100 dark:bg-slate-900 ${
            viewerHeight === 'normal' ? 'h-[540px]' : 'h-[760px]'
          }`}
        >
          <object
            data={embedUrl}
            type="application/pdf"
            className="w-full h-full block border-none"
            aria-label={`${moduleTitle} PDF Document`}
          >
            {/* Fallback iframe */}
            <iframe
              src={embedUrl}
              title={`${moduleTitle} PDF Document`}
              className="w-full h-full border-none"
            >
              {/* Fallback download card if embedded PDF rendering is blocked */}
              <div className="p-8 text-center flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-slate-900 space-y-3">
                <FileText className="w-12 h-12 text-teal-600 mb-2 opacity-50" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                  PDF Preview Not Supported By Browser
                </h4>
                <p className="text-xs text-slate-500 max-w-md">
                  Your device or browser does not support embedded PDF previewing. You can download the complete document or open it in a new window.
                </p>
                <div className="flex gap-3 pt-2">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
                  >
                    Open in New Window
                  </a>
                  <a
                    href={pdfUrl}
                    download
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            </iframe>
          </object>
        </div>

        {/* BOTTOM READER FOOTER BAR */}
        <div className="p-2.5 px-4 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono">
              Scroll vertically to view all {totalPages ? `${totalPages} pages` : 'pages'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] hidden sm:inline">
              Tip: Use browser pinch or ctrl+scroll inside the viewer to zoom
            </span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>Full Screen View</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

      {/* FULLSCREEN MODAL VIEWER */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        >
          <div 
            className="w-full h-full max-w-7xl mx-auto bg-white dark:bg-[#07141F] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                  {moduleNumber}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {moduleCode}: {moduleTitle}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official Lecture Notes • {totalPages || 20} Pages
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={pdfUrl}
                  download
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  title="Close Fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fullscreen PDF frame */}
            <div className="flex-1 w-full bg-slate-900">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1&view=FitH`}
                title={`${moduleTitle} Fullscreen Reader`}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
