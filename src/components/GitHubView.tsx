import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { 
  GitBranch, 
  ExternalLink, 
  Star, 
  GitFork, 
  CheckCircle2, 
  FolderGit2, 
  Sparkles,
  Link2,
  Copy,
  Check,
  Search,
  Plus,
  ShieldCheck,
  RefreshCw,
  Terminal
} from 'lucide-react';

export const GitHubView: React.FC = () => {
  const { addToast } = useLab();
  const [isConnected, setIsConnected] = useState(true);
  const [searchRepo, setSearchRepo] = useState('');
  const [copiedRepo, setCopiedRepo] = useState<string | null>(null);

  const repos = [
    {
      name: 'ds-lab-exp1-io',
      desc: 'Pandas data ingestion from remote URLs, CSV, TXT, JSON, and multi-sheet Excel files.',
      language: 'Python',
      langColor: 'bg-blue-500',
      stars: 14,
      forks: 5,
      updated: '3 hours ago',
      url: 'https://github.com/kartheek/ds-lab-exp1-io',
      cloneUrl: 'https://github.com/kartheek/ds-lab-exp1-io.git'
    },
    {
      name: 'ds-lab-exp2-numpy',
      desc: 'Vectorized NumPy missing value imputation, boolean bitmasks and normalizations.',
      language: 'Python',
      langColor: 'bg-blue-500',
      stars: 9,
      forks: 2,
      updated: 'Yesterday',
      url: 'https://github.com/kartheek/ds-lab-exp2-numpy',
      cloneUrl: 'https://github.com/kartheek/ds-lab-exp2-numpy.git'
    },
    {
      name: 'customer-churn-ml',
      desc: 'Predictive churn classification pipeline using XGBoost and SHAP explainability.',
      language: 'Jupyter Notebook',
      langColor: 'bg-amber-500',
      stars: 24,
      forks: 8,
      updated: '2 days ago',
      url: 'https://github.com/kartheek/customer-churn-ml',
      cloneUrl: 'https://github.com/kartheek/customer-churn-ml.git'
    },
    {
      name: 'financial-sentiment-finbert',
      desc: 'Fine-tuned FinBERT transformer parsing SEC 10-K regulatory earnings filings.',
      language: 'Python',
      langColor: 'bg-blue-500',
      stars: 48,
      forks: 16,
      updated: '1 week ago',
      url: 'https://github.com/kartheek/financial-sentiment-finbert',
      cloneUrl: 'https://github.com/kartheek/financial-sentiment-finbert.git'
    },
  ];

  const handleCopyClone = (name: string, url: string) => {
    navigator.clipboard.writeText(`git clone ${url}`);
    setCopiedRepo(name);
    addToast(`Clone command copied for ${name}!`, 'success');
    setTimeout(() => setCopiedRepo(null), 2500);
  };

  const filteredRepos = repos.filter(r => 
    r.name.toLowerCase().includes(searchRepo.toLowerCase().trim()) ||
    r.desc.toLowerCase().includes(searchRepo.toLowerCase().trim()) ||
    r.language.toLowerCase().includes(searchRepo.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B2538] dark:text-white">
                GitHub Projects &amp; Lab Repositories
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Synchronized code repositories, upstream git pull requests, and experiment branches.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setIsConnected(!isConnected);
            addToast(isConnected ? 'GitHub disconnected' : 'GitHub connected successfully ✓', 'info');
          }}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
            isConnected
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
              : 'bg-[#0B2538] dark:bg-white text-white dark:text-[#0B2538] hover:bg-black dark:hover:bg-slate-100'
          }`}
        >
          {isConnected ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Connected (@kartheek)</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span>Connect GitHub</span>
            </>
          )}
        </button>
      </div>

      {/* DISCONNECTED EMPTY STATE */}
      {!isConnected ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#07141F] border border-slate-200/80 dark:border-slate-800 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mx-auto shadow-inner">
            <GitBranch className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-[#0B2538] dark:text-white">
              Connect Your GitHub Account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Link your GitHub profile to automatically back up your laboratory solutions, track pull requests, and commit code directly from the web editor.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setIsConnected(true);
                addToast('GitHub account connected successfully ✓', 'success');
              }}
              className="min-h-[48px] px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/25 inline-flex items-center gap-2 transition-transform active:scale-95"
            >
              <Link2 className="w-4 h-4" />
              <span>Authorize &amp; Connect GitHub</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter repositories by name, language or topic..."
                value={searchRepo}
                onChange={(e) => setSearchRepo(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07141F] text-xs sm:text-sm text-[#0B2538] dark:text-white outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {filteredRepos.length} Repositories
              </span>
            </div>
          </div>

          {/* Repositories Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRepos.map((repo) => (
              <div
                key={repo.name}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#07141F] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-teal-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-base text-[#0B2538] dark:text-white hover:text-teal-600 dark:hover:text-teal-400 hover:underline flex items-center gap-2"
                    >
                      <FolderGit2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="truncate">{repo.name}</span>
                    </a>
                    <span className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0">
                      Public
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {repo.desc}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-3.5">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className={`w-2.5 h-2.5 rounded-full ${repo.langColor}`} />
                        {repo.language}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5" />
                        {repo.forks}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      {repo.updated}
                    </span>
                  </div>

                  {/* Clone & View Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleCopyClone(repo.name, repo.cloneUrl)}
                      className="min-h-[44px] flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                      title="Copy git clone command"
                    >
                      {copiedRepo === repo.name ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                          <span className="text-teal-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Clone</span>
                        </>
                      )}
                    </button>

                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};
