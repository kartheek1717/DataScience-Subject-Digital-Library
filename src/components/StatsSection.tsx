import React from 'react';
import { useLab } from '../context/LabContext';
import { 
  FlaskConical, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

export const StatsSection: React.FC = () => {
  const { experiments, setCurrentTab } = useLab();

  const totalExps = experiments.length;
  const totalSubExps = experiments.reduce((acc, curr) => acc + (curr.subExperiments?.length || 0), 0);
  const completedExps = experiments.filter((e) => e.status === 'completed').length;
  const inProgressExps = experiments.filter((e) => e.status === 'in-progress').length;

  const stats = [
    {
      id: 'total-experiments',
      label: 'TOTAL EXPERIMENTS',
      value: totalExps,
      growth: '+2',
      growthText: 'Hands-on experiments',
      icon: FlaskConical,
      color: 'text-[#009F9A]',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-200/60 dark:border-emerald-800/40',
      onClick: () => setCurrentTab('experiments'),
    },
    {
      id: 'modules',
      label: 'LAB MODULES',
      value: totalSubExps,
      growth: 'Interactive',
      growthText: 'Sub-experiments & exercises',
      icon: Layers,
      color: 'text-[#2563EB]',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200/60 dark:border-blue-800/40',
      onClick: () => setCurrentTab('experiments'),
    },
    {
      id: 'completed',
      label: 'COMPLETED',
      value: completedExps,
      growth: '+3',
      growthText: 'Experiments finished',
      icon: CheckCircle2,
      color: 'text-[#16A34A]',
      bg: 'bg-green-50 dark:bg-green-950/20',
      border: 'border-green-200/60 dark:border-green-800/40',
      onClick: () => setCurrentTab('experiments'),
    },
    {
      id: 'in-progress',
      label: 'IN PROGRESS',
      value: inProgressExps,
      growth: 'Active',
      growthText: 'Keep going!',
      icon: Clock,
      color: 'text-[#F59E0B]',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-200/60 dark:border-amber-800/40',
      onClick: () => setCurrentTab('experiments'),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            onClick={stat.onClick}
            className={`p-5 rounded-2xl glass-card border ${stat.border} shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden`}
          >
            {/* Top subtle highlight line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: stat.color.replace('text-', '') }} />

            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase font-mono">
                {stat.label}
              </span>
              <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-115 shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-extrabold text-[#0B2538] dark:text-white font-mono tracking-tight">
                {stat.value}
              </span>
              <span className="inline-flex items-center text-xs font-bold text-[#009F9A] dark:text-[#14B8A6] bg-[#DFF8F7] dark:bg-[#009F9A]/20 px-2 py-0.5 rounded-md border border-[#009F9A]/20">
                {stat.growth}
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="truncate">{stat.growthText}</span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 group-hover:bg-[#009F9A] group-hover:text-white transition-colors duration-200">
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
