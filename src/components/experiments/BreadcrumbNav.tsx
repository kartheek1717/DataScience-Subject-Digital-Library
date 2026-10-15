import React from 'react';
import { 
  Home, 
  ChevronRight, 
  FlaskConical, 
  Layers, 
  Code2, 
  BookOpen,
  FolderGit2
} from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isCurrent?: boolean;
  icon?: 'home' | 'experiments' | 'experiment' | 'part' | 'overview' | 'repo';
  badge?: string;
  tooltip?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, className = '' }) => {
  const renderIcon = (type?: BreadcrumbItem['icon'], isCurrent?: boolean) => {
    const iconClass = isCurrent 
      ? "w-4 h-4 text-teal-300 dark:text-cyan-300 shrink-0" 
      : "w-4 h-4 text-gray-500 dark:text-slate-400 group-hover:text-[#009F9A] dark:group-hover:text-cyan-400 transition-colors shrink-0";

    switch (type) {
      case 'home':
        return <Home className={iconClass} />;
      case 'experiments':
        return <FlaskConical className={iconClass} />;
      case 'experiment':
        return <Layers className={iconClass} />;
      case 'part':
        return <Code2 className={iconClass} />;
      case 'overview':
        return <BookOpen className={iconClass} />;
      case 'repo':
        return <FolderGit2 className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex flex-wrap items-center gap-1.5 sm:gap-2 ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1 || item.isCurrent;

        return (
          <React.Fragment key={index}>
            {/* Separator between boxes */}
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-slate-700 shrink-0" />
            )}

            {/* Breadcrumb Item Box */}
            {isLast ? (
              <div
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#0F2231] text-white dark:bg-cyan-950/70 dark:text-cyan-200 border border-[#0F2231] dark:border-cyan-500/40 shadow-xs text-xs sm:text-sm font-bold tracking-tight select-none"
                title={item.tooltip || item.label}
              >
                {renderIcon(item.icon, true)}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-white/15 dark:bg-cyan-500/20 text-white dark:text-cyan-300">
                    {item.badge}
                  </span>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="group inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white dark:bg-[#0D1E2A] border border-gray-200/90 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:text-[#009F9A] dark:hover:text-cyan-400 hover:border-[#009F9A]/40 dark:hover:border-teal-500/40 hover:bg-teal-50/40 dark:hover:bg-slate-800/80 shadow-2xs hover:shadow-xs transition-all duration-150 text-xs sm:text-sm font-semibold cursor-pointer active:scale-98"
                title={item.tooltip || `Navigate to ${item.label}`}
              >
                {renderIcon(item.icon, false)}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-medium bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 group-hover:bg-teal-100/60 dark:group-hover:bg-teal-950/60 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                    {item.badge}
                  </span>
                )}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
