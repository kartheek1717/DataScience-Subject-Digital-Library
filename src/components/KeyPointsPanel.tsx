import { Bookmark, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

interface KeyPointsPanelProps {
  keyPoints: {
    term: string;
    description: string;
    badge?: string;
  }[];
  resources?: {
    title: string;
    type: string;
    url: string;
  }[];
}

export const KeyPointsPanel: React.FC<KeyPointsPanelProps> = ({ keyPoints, resources }) => {
  return (
    <div className="space-y-6">
      
      {/* Key Points Grid */}
      <div className="rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#E3EDF2] dark:border-slate-800 mb-5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#122333] dark:text-white">
              Key Concepts &amp; Signatures
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Core functions and properties essential for technical interviews
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {keyPoints.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-100 dark:border-slate-800/80 bg-gray-50/50 dark:bg-slate-900/30 hover:border-[#009F9A]/30 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-1.5">
                <code className="text-sm font-bold text-[#009F9A] dark:text-[#14B8A6] font-mono">
                  {item.term}
                </code>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DFF8F7] text-[#009F9A] dark:bg-[#009F9A]/20 dark:text-[#14B8A6]">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Linked Documentation & External References */}
      {resources && resources.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E3EDF2] dark:border-slate-800 mb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#122333] dark:text-white">
                Linked Documentation &amp; Reference Guides
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Official documentation pages and deep-dive cheatsheets
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {resources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-slate-800/80 hover:border-[#009F9A] hover:bg-[#DFF8F7]/20 dark:hover:bg-[#009F9A]/10 transition-colors group"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-slate-200 group-hover:text-[#009F9A] transition-colors">
                    {res.title}
                  </div>
                  <div className="text-xs text-gray-400">{res.type}</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 group-hover:bg-[#009F9A] text-[#009F9A] group-hover:text-white dark:text-cyan-400 dark:group-hover:text-white border border-teal-200/80 dark:border-teal-800 text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1 shrink-0">
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
