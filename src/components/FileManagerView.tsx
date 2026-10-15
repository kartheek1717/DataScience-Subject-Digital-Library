import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { 
  Files, 
  Upload, 
  FolderPlus, 
  FileCode, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  X,
  Save
} from 'lucide-react';
import { LabFile } from '../types';

export const FileManagerView: React.FC = () => {
  const { files, addFile, deleteFile, updateFile, addToast } = useLab();
  const [activeFile, setActiveFile] = useState<LabFile | null>(null);
  const [fileEditContent, setFileEditContent] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New File state
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<LabFile['type']>('.py');
  const [newFileContent, setNewFileContent] = useState('');

  const handleOpenFile = (file: LabFile) => {
    setActiveFile(file);
    setFileEditContent(file.content);
  };

  const handleSaveFile = () => {
    if (!activeFile) return;
    updateFile(activeFile.id, fileEditContent);
    setActiveFile({ ...activeFile, content: fileEditContent, modified: 'Just now' });
  };

  const handleDownload = (file: LabFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Downloaded ${file.name} ✓`);
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const fullName = newFileName.endsWith(newFileType) ? newFileName : `${newFileName}${newFileType}`;
    addFile({
      id: `file-${Date.now()}`,
      name: fullName,
      type: newFileType,
      size: `${(newFileContent.length / 1024).toFixed(1)} KB`,
      modified: 'Just now',
      content: newFileContent || `# ${fullName}\n`,
    });

    setIsUploadModalOpen(false);
    setNewFileName('');
    setNewFileContent('');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case '.py':
      case '.ipynb':
        return <FileCode className="w-4 h-4 text-[#009F9A]" />;
      case '.csv':
      case '.xlsx':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
      default:
        return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3EDF2] dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Files className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B2538] dark:text-white">
              My Files
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Manage laboratory CSV datasets, Python scripts, configuration JSON, and Jupyter notebooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer text-xs font-bold text-[#009F9A] flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload From Computer</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const content = typeof reader.result === 'string' ? reader.result : '';
                    const ext = (file.name.substring(file.name.lastIndexOf('.')) as LabFile['type']) || '.txt';
                    addFile({
                      id: `file-${Date.now()}`,
                      name: file.name,
                      type: ['.py', '.csv', '.txt', '.json', '.xlsx', '.ipynb'].includes(ext) ? ext : '.txt',
                      size: `${(file.size / 1024).toFixed(1)} KB`,
                      modified: 'Just now',
                      content: content,
                    });
                  };
                  reader.readAsText(file);
                }
              }}
            />
          </label>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#009F9A] to-[#2563EB] text-white font-bold text-xs shadow-md shadow-[#009F9A]/20 flex items-center gap-1.5 hover:opacity-95 transition-opacity"
          >
            <span>+ New File</span>
          </button>
        </div>
      </div>

      {/* Main Files Table */}
      <div className="rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E3EDF2] dark:border-slate-800 bg-[#F6FAFC] dark:bg-slate-900/60 text-gray-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Size</th>
                <th className="py-3 px-4 font-semibold">Modified</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3EDF2]/60 dark:divide-slate-800/60 font-mono">
              {files.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-[#DFF8F7]/20 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      {getFileIcon(file.type)}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-xs">
                      {file.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 dark:text-slate-400">{file.size}</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-slate-400 font-sans text-xs">
                    {file.modified}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 font-sans">
                      <button
                        onClick={() => handleOpenFile(file)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-[#009F9A]"
                        title="View & Edit"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-blue-500"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete file "${file.name}"?`)) {
                            deleteFile(file.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Editor Modal */}
      {activeFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl bg-[#091522] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-[#07111C] border-b border-slate-800 flex items-center justify-between text-white font-mono text-xs">
              <div className="flex items-center gap-2">
                {getFileIcon(activeFile.type)}
                <span className="font-bold">{activeFile.name}</span>
                <span className="text-gray-400">({activeFile.size})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveFile}
                  className="px-3 py-1.5 rounded-lg bg-[#009F9A] text-white font-sans font-bold text-xs flex items-center gap-1.5 hover:bg-[#009F9A]/90"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setActiveFile(null)}
                  className="p-1.5 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-auto">
              <textarea
                value={fileEditContent}
                onChange={(e) => setFileEditContent(e.target.value)}
                spellCheck={false}
                rows={16}
                className="w-full h-full bg-transparent text-slate-100 font-mono text-xs leading-relaxed outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload/Create Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0D1E2A] rounded-2xl shadow-2xl border border-[#E3EDF2] dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3EDF2] dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-[#0B2538] dark:text-white">
                Upload or Create New File
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. data_pipeline"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-transparent text-sm text-[#0B2538] dark:text-white outline-none focus:border-[#009F9A]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Extension
                </label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E3EDF2] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-[#0B2538] dark:text-white outline-none"
                >
                  <option value=".py">.py (Python Script)</option>
                  <option value=".csv">.csv (Comma-Separated Values)</option>
                  <option value=".json">.json (JSON Payload)</option>
                  <option value=".txt">.txt (Plain Text)</option>
                  <option value=".xlsx">.xlsx (Excel)</option>
                  <option value=".ipynb">.ipynb (Jupyter Notebook)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Initial Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste initial text or data..."
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl font-mono border border-[#E3EDF2] dark:border-slate-800 bg-[#091522] text-slate-100 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#009F9A] text-white font-bold"
                >
                  Create File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
