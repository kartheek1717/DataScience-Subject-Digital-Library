import React, { useState } from 'react';
import { 
  ModuleResourceItem, 
  ResourceType 
} from '../../data/moduleResourcesData';
import { 
  Play, 
  BookOpen, 
  Book, 
  ExternalLink, 
  Clock, 
  Sparkles,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface ModuleResourcesListProps {
  resources: ModuleResourceItem[];
  moduleCode: string;
  moduleTitle: string;
}

export const ModuleResourcesList: React.FC<ModuleResourcesListProps> = ({
  resources,
  moduleCode,
  moduleTitle
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | ResourceType>('all');

  const filteredResources = activeFilter === 'all'
    ? resources
    : resources.filter(r => r.type === activeFilter);

  const counts = {
    all: resources.length,
    video: resources.filter(r => r.type === 'video').length,
    doc: resources.filter(r => r.type === 'doc').length,
    book: resources.filter(r => r.type === 'book').length,
  };

  const getBadgeDetails = (type: ResourceType) => {
    switch (type) {
      case 'video':
        return {
          label: 'Video Tutorial',
          icon: Play,
          badgeClasses: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60',
          iconColor: 'text-rose-600 dark:text-rose-400'
        };
      case 'book':
        return {
          label: 'Textbook Guide',
          icon: Book,
          badgeClasses: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60',
          iconColor: 'text-purple-600 dark:text-purple-400'
        };
      case 'doc':
      default:
        return {
          label: 'Official Docs',
          icon: BookOpen,
          badgeClasses: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/60',
          iconColor: 'text-sky-600 dark:text-sky-400'
        };
    }
  };

  return (
    <div className="space-y-3.5">
      
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>All Resources</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {counts.all}
            </span>
          </button>

          {counts.video > 0 && (
            <button
              onClick={() => setActiveFilter('video')}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFilter === 'video'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Videos</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeFilter === 'video' ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {counts.video}
              </span>
            </button>
          )}

          {counts.doc > 0 && (
            <button
              onClick={() => setActiveFilter('doc')}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFilter === 'doc'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Documentation</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeFilter === 'doc' ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {counts.doc}
              </span>
            </button>
          )}

          {counts.book > 0 && (
            <button
              onClick={() => setActiveFilter('book')}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFilter === 'book'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Book className="w-3 h-3" />
              <span>Books</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeFilter === 'book' ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {counts.book}
              </span>
            </button>
          )}
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          Curated for {moduleCode}
        </span>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredResources.map((item) => {
          const badge = getBadgeDetails(item.type);
          const BadgeIcon = badge.icon;

          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#07141F] shadow-2xs hover:shadow-md hover:border-teal-500/50 dark:hover:border-teal-500/50 hover:-translate-y-0.5 transition-all flex flex-col justify-between text-left relative overflow-hidden"
            >
              {/* Top Accent Stripe on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-2.5">
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${badge.badgeClasses}`}>
                    <BadgeIcon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{item.duration_or_read_time}</span>
                  </span>
                </div>

                {/* Resource Title */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-teal-700/80 dark:text-teal-400/80 font-medium font-mono pt-1">
                    {item.source}
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Bottom Footer Action */}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  Open Learning Link
                </span>
                <span className="font-semibold text-teal-600 dark:text-teal-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          );
        })}
      </div>

    </div>
  );
};
