import React, { useState } from 'react';
import { 
  Play, 
  Copy, 
  Download, 
  Check, 
  Terminal, 
  Loader2, 
  Sparkles,
  Maximize2,
  Upload,
  FolderGit2
} from 'lucide-react';
import { useLab } from '../context/LabContext';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onRun: () => void;
  isRunning: boolean;
  language?: string;
  subExpTitle?: string;
  githubUrl?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  isRunning,
  language = 'Python',
  subExpTitle,
  githubUrl,
}) => {
  const { addToast } = useLab();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    addToast('Code copied to clipboard ✓');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subExpTitle ? subExpTitle.toLowerCase().replace(/\s+/g, '_') : 'experiment_code'}.py`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Python script downloaded ✓');
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-2xl bg-[#091522] border border-slate-800 shadow-xl overflow-hidden flex flex-col font-mono text-xs sm:text-sm ring-1 ring-white/5">
      
      {/* Code Editor Header */}
      <div className="px-4 py-3 bg-[#07111C] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 select-none">
        
        {/* Window dots + Language selector & title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-cyan-300 font-semibold text-xs border border-white/10">
            <Terminal className="w-3.5 h-3.5 text-[#009F9A]" />
            <span>{language} 3.12</span>
          </div>
          <span className="text-gray-400 text-xs hidden sm:inline font-mono">
            // Lab Kernel Active
          </span>
        </div>

        {/* Action Buttons: Run Code, Copy, Download */}
        <div className="flex items-center gap-2">
          
          <label className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 text-xs transition-colors cursor-pointer" title="Upload script (.py, .txt)">
            <Upload className="w-3.5 h-3.5 text-[#009F9A]" />
            <span className="hidden sm:inline">Upload</span>
            <input
              type="file"
              accept=".py,.txt,.sql,.json,.csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === 'string') {
                      onChange(reader.result);
                      addToast(`Loaded ${file.name} into editor ✓`);
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
          </label>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 text-xs transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 text-xs transition-colors"
              title="View on GitHub"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          )}

          {/* Premium Teal Run Code Button */}
          <button
            onClick={onRun}
            disabled={isRunning}
            className={`px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 text-white shadow-md transition-all ${
              isRunning
                ? 'bg-slate-700 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-[#009F9A] via-[#14B8A6] to-[#009F9A] hover:opacity-95 shadow-[#009F9A]/30 active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>▶ Run Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers & Editable Area */}
      <div className="relative flex flex-1 min-h-[220px] max-h-[380px] overflow-auto bg-[#091522]">
        
        {/* Line numbers gutter */}
        <div className="py-4 px-3 bg-[#060F18] border-r border-slate-800/80 text-right select-none text-slate-500 font-mono text-xs w-12 shrink-0">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea code container */}
        <div className="relative flex-1 p-4 font-mono text-slate-200">
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className="w-full h-full min-h-[200px] bg-transparent resize-none outline-none font-mono text-xs sm:text-sm leading-6 text-slate-100 placeholder:text-slate-600 focus:ring-0 border-none"
          />
        </div>

      </div>

      {/* Editor Footer Status */}
      <div className="px-4 py-2 bg-[#060F18] border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>UTF-8 • Spaces: 4 • Python LSP Active</span>
        </div>
        <span className="text-cyan-400/80 hidden sm:inline">
          Tip: Click ▶ Run Code to evaluate DataFrame
        </span>
      </div>

    </div>
  );
};
