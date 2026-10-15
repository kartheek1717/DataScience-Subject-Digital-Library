import React from 'react';
import { useLab } from '../context/LabContext';
import { 
  BookMarked, 
  Play, 
  Plus, 
  Trash2, 
  Save, 
  Code, 
  Type, 
  Table, 
  Clock, 
  Sparkles,
  Terminal,
  Upload,
  Download
} from 'lucide-react';

export const NotebookView: React.FC = () => {
  const { 
    notebookCells, 
    setNotebookCells, 
    addNotebookCell, 
    runNotebookCell, 
    runAllNotebookCells, 
    deleteNotebookCell, 
    addToast 
  } = useLab();

  const handleCellContentChange = (id: string, newContent: string) => {
    setNotebookCells((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content: newContent } : c))
    );
  };

  const handleSaveNotebook = () => {
    localStorage.setItem('dslab_notebook', JSON.stringify(notebookCells));
    addToast('Notebook saved successfully ✓');
  };

  return (
    <div className="space-y-6">
      
      {/* Notebook Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3EDF2] dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
              <BookMarked className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B2538] dark:text-white">
              Notebook Workspace
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Interactive cellular programming environment powered by Python &amp; Markdown kernels.
          </p>
        </div>

        {/* Buttons: New Cell, Run All, Save */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => addNotebookCell('code')}
            className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#0D1E2A] text-xs font-semibold text-gray-700 dark:text-slate-300 hover:border-[#009F9A] flex items-center gap-1.5"
          >
            <Code className="w-3.5 h-3.5 text-[#009F9A]" />
            <span>+ Code</span>
          </button>

          <button
            onClick={() => addNotebookCell('markdown')}
            className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#0D1E2A] text-xs font-semibold text-gray-700 dark:text-slate-300 hover:border-[#8B5CF6] flex items-center gap-1.5"
          >
            <Type className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>+ Markdown</span>
          </button>

          <label className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#0D1E2A] text-xs font-semibold text-gray-700 dark:text-slate-300 hover:border-[#009F9A] flex items-center gap-1.5 cursor-pointer" title="Upload Jupyter Notebook (.ipynb) or script">
            <Upload className="w-3.5 h-3.5 text-[#009F9A]" />
            <span>Upload .ipynb</span>
            <input
              type="file"
              accept=".ipynb,.py,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    try {
                      const text = typeof reader.result === 'string' ? reader.result : '';
                      if (file.name.endsWith('.ipynb')) {
                        const parsed = JSON.parse(text);
                        if (parsed.cells && Array.isArray(parsed.cells)) {
                          const newCells = parsed.cells.map((c: any, i: number) => ({
                            id: `cell-${Date.now()}-${i}`,
                            type: c.cell_type === 'markdown' ? 'markdown' : 'code',
                            content: Array.isArray(c.source) ? c.source.join('') : (c.source || ''),
                          }));
                          setNotebookCells(newCells);
                          addToast(`Imported ${newCells.length} cells from ${file.name} ✓`);
                          return;
                        }
                      }
                      // Fallback text/python script
                      addNotebookCell('code');
                      handleCellContentChange(notebookCells[notebookCells.length - 1]?.id || 'cell-1', text);
                      addToast(`Loaded ${file.name} as code cell ✓`);
                    } catch (err) {
                      addToast(`Could not parse notebook file`, 'error');
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
          </label>

          <button
            onClick={() => {
              const fullContent = notebookCells.map(c => `# [${c.type.toUpperCase()}]\n${c.content}\n`).join('\n\n');
              const blob = new Blob([fullContent], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `dslab_notebook_${Date.now()}.py`;
              a.click();
              URL.revokeObjectURL(url);
              addToast('Notebook exported as .py ✓');
            }}
            className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#0D1E2A] text-xs font-semibold text-gray-700 dark:text-slate-300 hover:border-blue-400 flex items-center gap-1.5"
            title="Download notebook script"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>Export</span>
          </button>

          <button
            onClick={runAllNotebookCells}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#009F9A] to-[#2563EB] text-white font-bold text-xs shadow-md shadow-[#009F9A]/20 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run All</span>
          </button>

          <button
            onClick={handleSaveNotebook}
            className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#0D1E2A] text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Cells List */}
      <div className="space-y-5">
        {notebookCells.map((cell, idx) => (
          <div
            key={cell.id}
            className="rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 overflow-hidden shadow-xs hover:border-[#009F9A]/40 transition-colors"
          >
            {/* Cell Control Header */}
            <div className="px-4 py-2 bg-gray-50/70 dark:bg-slate-900/60 border-b border-[#E3EDF2] dark:border-slate-800 flex items-center justify-between text-xs text-gray-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#009F9A]">[{idx + 1}]</span>
                <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200/60 dark:bg-slate-800">
                  {cell.type}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {cell.type === 'code' && (
                  <button
                    onClick={() => runNotebookCell(cell.id)}
                    disabled={cell.isExecuting}
                    className="p-1 rounded-md text-[#009F9A] hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    title="Execute Cell"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotebookCell(cell.id)}
                  className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Delete Cell"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cell Content Input */}
            <div className={`p-4 ${cell.type === 'code' ? 'bg-[#091522] font-mono text-slate-100 text-xs sm:text-sm' : 'bg-transparent text-gray-800 dark:text-slate-200 text-sm'}`}>
              <textarea
                value={cell.content}
                onChange={(e) => handleCellContentChange(cell.id, e.target.value)}
                spellCheck={false}
                rows={cell.content.split('\n').length || 2}
                className="w-full bg-transparent resize-none outline-none leading-relaxed border-none"
              />
            </div>

            {/* Cell Execution Output */}
            {cell.output && (
              <div className="border-t border-[#E3EDF2] dark:border-slate-800 p-4 bg-gray-50/40 dark:bg-slate-900/40">
                {cell.output.data && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#E3EDF2] dark:border-slate-800 text-[#009F9A]">
                          {cell.output.data.columns.map((c: string, ci: number) => (
                            <th key={ci} className="py-2 px-3 font-semibold">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {cell.output.data.rows.map((r: any[], ri: number) => (
                          <tr key={ri} className="hover:bg-gray-100/50 dark:hover:bg-slate-800/50">
                            {r.map((val, vi) => (
                              <td key={vi} className="py-1.5 px-3 text-gray-700 dark:text-slate-300">
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {cell.output.logs && (
                  <div className="mt-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    {cell.output.logs.map((log: string, li: number) => (
                      <div key={li}>{log}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
