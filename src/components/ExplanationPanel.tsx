import React from 'react';
import { HelpCircle, CheckCircle } from 'lucide-react';

interface ExplanationPanelProps {
  explanation: {
    title: string;
    steps: {
      number: number;
      title: string;
      description: string;
    }[];
  };
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ explanation }) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 p-6 shadow-sm space-y-6">
      
      <div className="flex items-center gap-2.5 pb-4 border-b border-[#E3EDF2] dark:border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-[#009F9A]/10 text-[#009F9A] flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-base text-[#122333] dark:text-white">
            {explanation.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Step-by-step beginner-friendly breakdown of algorithmic logic
          </p>
        </div>
      </div>

      {/* Visual Numbered Steps */}
      <div className="space-y-4">
        {explanation.steps.map((step) => (
          <div 
            key={step.number}
            className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/70 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800/80 hover:border-[#009F9A]/30 transition-colors group"
          >
            {/* Step Number Badge */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#009F9A] to-[#2563EB] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-[#009F9A]/20 group-hover:scale-105 transition-transform">
              {step.number}
            </div>

            <div className="flex-1">
              <h4 className="font-bold text-sm text-[#0B2538] dark:text-white mb-1 group-hover:text-[#009F9A] transition-colors">
                {step.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
