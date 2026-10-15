import React from 'react';
import { CheckCircle2, Clock, Table, Terminal, FileCode } from 'lucide-react';

interface OutputPanelProps {
  output: {
    columns?: string[];
    rows?: (string | number)[][];
    totalRows?: number;
    totalColumns?: number;
    executionTime?: string;
    logs?: string[];
    rawText?: string;
    plotType?: string;
  };
  hasExecuted: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ output, hasExecuted }) => {
  return (
    <div className="rounded-2xl glass-card border border-[#E3EDF2] dark:border-slate-800 shadow-md overflow-hidden animate-in fade-in duration-200">
      
      {/* Output Panel Header */}
      <div className="px-5 py-3.5 border-b border-[#E3EDF2] dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#009F9A]" />
          <span className="font-bold text-sm text-[#122333] dark:text-white font-mono">
            Execution Output
          </span>
          {hasExecuted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Execution completed ✓
            </span>
          )}
        </div>

        {/* Runtime Metrics */}
        <div className="flex items-center gap-3 text-xs font-mono text-gray-500 dark:text-gray-400">
          {output.totalRows && output.totalColumns && (
            <span className="bg-gray-100/80 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-gray-200/60 dark:border-slate-700">
              {output.totalRows} rows × {output.totalColumns} cols
            </span>
          )}
          <span className="flex items-center gap-1.5 text-[#009F9A] font-semibold bg-[#DFF8F7] dark:bg-[#009F9A]/20 px-2.5 py-1 rounded-lg border border-[#009F9A]/20">
            <Clock className="w-3.5 h-3.5" />
            {output.executionTime || '0.12s'}
          </span>
        </div>
      </div>

      {/* Raw Output Terminal Console */}
      {output.rawText ? (
        <div className="p-4 bg-[#07131E] font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre selection:bg-emerald-500/20">
          {output.rawText}
        </div>
      ) : output.columns && output.rows ? (
        /* Structured DataFrame Table */
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono">
            <thead>
              <tr className="border-b border-[#E3EDF2] dark:border-slate-800 bg-[#F6FAFC] dark:bg-slate-900/60 text-gray-600 dark:text-slate-300">
                <th className="py-2.5 px-3 font-semibold text-gray-400 text-xs">#</th>
                {output.columns.map((col, idx) => (
                  <th key={idx} className="py-2.5 px-3 font-semibold text-[#009F9A] dark:text-cyan-300">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3EDF2]/60 dark:divide-slate-800/60">
              {output.rows.map((row, rIdx) => (
                <tr 
                  key={rIdx}
                  className="hover:bg-[#DFF8F7]/20 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2 px-3 text-gray-400 text-xs">{rIdx}</td>
                  {row.map((val, cIdx) => (
                    <td key={cIdx} className="py-2 px-3 text-gray-800 dark:text-slate-200 truncate max-w-[200px]">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-gray-400 font-mono">
          Run the code to see the output.
        </div>
      )}

      {/* Execution Logs Terminal */}
      {output.logs && output.logs.length > 0 && (
        <div className="px-5 py-3 border-t border-[#E3EDF2] dark:border-slate-800 bg-[#091522] text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2 text-slate-500 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Stdout &amp; Diagnostics
          </div>
          <div className="space-y-1">
            {output.logs.map((log, idx) => (
              <div key={idx} className="text-emerald-400/90 leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
