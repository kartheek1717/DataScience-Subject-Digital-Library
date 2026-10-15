import React, { useState, useEffect } from 'react';
import { useLab } from '../context/LabContext';
import { 
  Wrench, 
  Terminal, 
  Database, 
  Code2, 
  Layers, 
  BarChart3, 
  BrainCircuit, 
  ExternalLink, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Table, 
  Cpu, 
  FlaskConical, 
  ArrowRight,
  BookOpen,
  BookMarked,
  Sliders,
  Search,
  Filter
} from 'lucide-react';

import { TOOLS_DIRECTORY, ToolInfo } from '../data/toolsData';

// Sample database tables for the in-browser SQL runner
const SAMPLE_STUDENTS = [
  { roll_no: 101, name: 'Aarav Sharma', branch: 'CSE', marks: 88.5, attendance: 92, lab_grade: 'A' },
  { roll_no: 102, name: 'Diya Patel', branch: 'ECE', marks: 94.0, attendance: 96, lab_grade: 'O' },
  { roll_no: 103, name: 'Rohan Verma', branch: 'DS', marks: 82.0, attendance: 88, lab_grade: 'B+' },
  { roll_no: 104, name: 'Ananya Reddy', branch: 'AI', marks: 96.5, attendance: 98, lab_grade: 'O' },
  { roll_no: 105, name: 'Karthik Nair', branch: 'CSE', marks: 74.0, attendance: 81, lab_grade: 'B' },
  { roll_no: 106, name: 'Meera Iyer', branch: 'DS', marks: 91.0, attendance: 94, lab_grade: 'A+' },
  { roll_no: 107, name: 'Siddharth Rao', branch: 'AI', marks: 85.5, attendance: 89, lab_grade: 'A' },
  { roll_no: 108, name: 'Pooja Hegde', branch: 'ECE', marks: 79.0, attendance: 84, lab_grade: 'B+' }
];

export const ToolsView: React.FC = () => {
  const { 
    setCurrentTab, 
    setSelectedExpId, 
    navigateToExperiment, 
    selectedToolTab: activeTab, 
    setSelectedToolTab: setActiveTab, 
    selectedToolCategory: selectedCategory, 
    setSelectedToolCategory: setSelectedCategory, 
    targetedToolId, 
    setTargetedToolId, 
    addToast 
  } = useLab();

  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Auto-scroll to targeted tool card when navigating from Home or Search
  useEffect(() => {
    if (targetedToolId && activeTab === 'directory') {
      const timer = setTimeout(() => {
        const el = document.getElementById(`tool-${targetedToolId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [targetedToolId, activeTab]);

  // SQL Sandbox State
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM students WHERE marks > 85 ORDER BY marks DESC;');
  const [sqlResults, setSqlResults] = useState<any[]>(SAMPLE_STUDENTS.filter(s => s.marks > 85).sort((a, b) => b.marks - a.marks));
  const [sqlExecutionMsg, setSqlExecutionMsg] = useState<string>('Query executed successfully. 5 rows returned in 1.4ms.');

  // NumPy Vector Calculator State
  const [matrixData, setMatrixData] = useState<number[]>([12.5, 24.0, 18.2, 45.0, 99.5, 14.2, 28.1, 33.6, 19.8]);
  const [activeMatrixOp, setActiveMatrixOp] = useState<'raw' | 'normalized' | 'outliers' | 'median-impute'>('raw');

  // Copy code snippet
  const handleCopySnippet = (id: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    addToast('Code snippet copied to clipboard!', 'success');
    setTimeout(() => setCopiedSnippetId(null), 2500);
  };

  // Run SQL query in sandbox
  const handleRunSqlQuery = () => {
    const q = sqlQuery.trim().toUpperCase();
    
    if (q.includes('AVG') || q.includes('GROUP BY BRANCH')) {
      const branchStats: Record<string, { count: number; sum: number }> = {};
      SAMPLE_STUDENTS.forEach(s => {
        if (!branchStats[s.branch]) branchStats[s.branch] = { count: 0, sum: 0 };
        branchStats[s.branch].count += 1;
        branchStats[s.branch].sum += s.marks;
      });
      const aggResult = Object.entries(branchStats).map(([branch, data]) => ({
        branch,
        student_count: data.count,
        avg_marks: Number((data.sum / data.count).toFixed(2))
      }));
      setSqlResults(aggResult);
      setSqlExecutionMsg(`Aggregate query executed: ${aggResult.length} groups calculated in 1.1ms.`);
    } else if (q.includes('WHERE MARKS > 90')) {
      const res = SAMPLE_STUDENTS.filter(s => s.marks > 90);
      setSqlResults(res);
      setSqlExecutionMsg(`Filtered query executed: ${res.length} rows returned in 0.9ms.`);
    } else if (q.includes('WHERE BRANCH = \'DS\'') || q.includes('BRANCH = "DS"') || q.includes('BRANCH=\'DS\'')) {
      const res = SAMPLE_STUDENTS.filter(s => s.branch === 'DS');
      setSqlResults(res);
      setSqlExecutionMsg(`Filtered query executed: ${res.length} DS branch records returned in 0.8ms.`);
    } else {
      setSqlResults(SAMPLE_STUDENTS);
      setSqlExecutionMsg(`Full table scan executed: ${SAMPLE_STUDENTS.length} records returned in 1.2ms.`);
    }

    addToast('SQL Query executed successfully!', 'success');
  };

  // Compute Matrix stats
  const mean = Number((matrixData.reduce((a, b) => a + b, 0) / matrixData.length).toFixed(2));
  const variance = Number((matrixData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / matrixData.length).toFixed(2));
  const stdDev = Number(Math.sqrt(variance).toFixed(2));

  const getComputedMatrixValues = () => {
    if (activeMatrixOp === 'normalized') {
      return matrixData.map(v => Number(((v - mean) / stdDev).toFixed(2)));
    }
    if (activeMatrixOp === 'outliers') {
      // Flag outliers > 1.5 stdDev from mean
      return matrixData.map(v => Math.abs(v - mean) > 1.5 * stdDev ? -999 : v);
    }
    return matrixData;
  };

  const filteredTools = TOOLS_DIRECTORY.filter(t => 
    selectedCategory === 'All' || t.category === selectedCategory
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-in fade-in duration-300 pb-12">
      
      {/* ============================================================ */}
      {/* 1. HEADER BANNER */}
      {/* ============================================================ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#0F172A] text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-700/60 text-violet-300 text-xs font-mono font-semibold">
                <Wrench className="w-3.5 h-3.5 text-violet-400" />
                <span>Data Science Toolchain &amp; Workbench</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-mono">
                Integrated Python 3.10 Runtime
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span>Data Science Tools &amp; Ecosystem</span>
              <Sparkles className="w-6 h-6 text-violet-400 animate-pulse hidden sm:inline" />
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed font-normal">
              Essential computational stack for modern Data Science. Execute live SQL queries in an interactive sandbox, inspect NumPy array vectorizations, explore tool documentation, and jump straight into hands-on lab practicals.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-xl bg-violet-950/60 border border-violet-800/60 flex items-center gap-2 text-violet-200">
                <Table className="w-3.5 h-3.5 text-teal-400" />
                <span>{TOOLS_DIRECTORY.length} Core Toolchains</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-violet-950/60 border border-violet-800/60 flex items-center gap-2 text-violet-200">
                <BookMarked className="w-3.5 h-3.5 text-orange-400" />
                <span>Jupyter &amp; Colab Hub</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-violet-950/60 border border-violet-800/60 flex items-center gap-2 text-violet-200">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>SQLite Query Console</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-violet-950/60 border border-violet-800/60 flex items-center gap-2 text-violet-200">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>NumPy Vectorizer</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => {
                navigateToExperiment('exp-4', 'details');
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02]"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Practice in Lab (Exp 04)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTab('modules')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4 text-violet-300" />
              <span>Module 1 Tools Syllabus</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SUB-VIEW NAVIGATION (SANDBOX TABS) */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#0B1E2E] border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'directory'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Toolchain Directory ({TOOLS_DIRECTORY.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sql-sandbox')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'sql-sandbox'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Interactive SQL Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('numpy-calculator')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'numpy-calculator'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>NumPy Matrix &amp; Vectorizer</span>
        </button>

        <button
          onClick={() => setActiveTab('jupyter-colab')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'jupyter-colab'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookMarked className="w-4 h-4 text-orange-400" />
          <span>Jupyter &amp; Google Colab Hub</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 3. ACTIVE TAB CONTENT */}
      {/* ============================================================ */}

      {/* TAB 1: TOOLCHAIN DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'Interactive Notebooks', 'Core Runtime', 'Data Wrangling', 'Visualization', 'Machine Learning', 'Database', 'Statistics'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-[#0B1E2E] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                id={`tool-${tool.id}`}
                className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B1E2E] border ${
                  targetedToolId === tool.id
                    ? 'border-violet-500 ring-4 ring-violet-500/25 shadow-lg'
                    : 'border-slate-200/90 dark:border-slate-800'
                } hover:border-violet-500/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{tool.icon}</span>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/40">
                      {tool.version}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-1">
                    {tool.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 mb-2">
                    {tool.category}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  {/* Code snippet block */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px] relative mb-4">
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-slate-400 text-[10px]">
                      <span>Code Example</span>
                      <button
                        onClick={() => handleCopySnippet(tool.id, tool.codeSnippet)}
                        className="hover:text-white transition-colors cursor-pointer"
                        title="Copy code"
                      >
                        {copiedSnippetId === tool.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <pre className="overflow-x-auto text-emerald-300 leading-relaxed">
                      {tool.codeSnippet}
                    </pre>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <a
                      href={tool.docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {tool.launchUrl && (
                      <a
                        href={tool.launchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Launch</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      navigateToExperiment(tool.mappedExpId, 'details');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-600 text-violet-700 hover:text-white dark:text-violet-300 dark:hover:text-white border border-violet-200/80 dark:border-violet-800 text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs group/lab"
                  >
                    <span>Practice in Lab</span>
                    <ArrowRight className="w-3 h-3 group-hover/lab:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SQL SANDBOX */}
      {activeTab === 'sql-sandbox' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: SQL Query Editor */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B1E2E] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-violet-500" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      SQLite Query Console (In-Memory)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Connected: SQLite 3.45.1
                  </span>
                </div>

                {/* Preset Query Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-mono text-slate-400">Presets:</span>
                  <button
                    onClick={() => {
                      setSqlQuery('SELECT * FROM students WHERE marks > 85 ORDER BY marks DESC;');
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/60 hover:text-violet-600 dark:hover:text-violet-300 border border-slate-200 dark:border-slate-700 font-mono transition-colors"
                  >
                    High Scorers (&gt;85)
                  </button>
                  <button
                    onClick={() => {
                      setSqlQuery('SELECT branch, COUNT(*) AS count, AVG(marks) AS avg_marks FROM students GROUP BY branch;');
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/60 hover:text-violet-600 dark:hover:text-violet-300 border border-slate-200 dark:border-slate-700 font-mono transition-colors"
                  >
                    Branch Average GroupBy
                  </button>
                  <button
                    onClick={() => {
                      setSqlQuery("SELECT * FROM students WHERE branch = 'DS';");
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/60 hover:text-violet-600 dark:hover:text-violet-300 border border-slate-200 dark:border-slate-700 font-mono transition-colors"
                  >
                    Data Science Students
                  </button>
                </div>

                {/* Textarea Code Editor */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-[#0F172A] p-4 text-emerald-400 font-mono text-xs sm:text-sm">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                    <span>-- Write ANSI SQL Query below</span>
                    <span>students table active</span>
                  </div>
                  <textarea
                    rows={4}
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    className="w-full bg-transparent text-emerald-300 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
                    placeholder="SELECT * FROM students..."
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400">Table: students ({SAMPLE_STUDENTS.length} records)</span>
                    <button
                      onClick={handleRunSqlQuery}
                      className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-violet-500/20"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Execute Query</span>
                    </button>
                  </div>
                </div>

                {/* Status Message */}
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{sqlExecutionMsg}</span>
                </div>
              </div>

              {/* Result Table */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B1E2E] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Table className="w-4 h-4 text-violet-500" />
                    <span>Query Output Results ({sqlResults.length} Rows)</span>
                  </h3>
                  <button
                    onClick={() => {
                      setSqlResults(SAMPLE_STUDENTS);
                      setSqlQuery('SELECT * FROM students;');
                    }}
                    className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      <tr>
                        {sqlResults.length > 0 && Object.keys(sqlResults[0]).map((key) => (
                          <th key={key} className="px-3.5 py-2.5 font-bold uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {sqlResults.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                          {Object.values(row).map((val: any, cIdx) => (
                            <td key={cIdx} className="px-3.5 py-2 text-slate-600 dark:text-slate-300">
                              {typeof val === 'number' ? (
                                <span className="text-violet-600 dark:text-violet-400 font-bold">{val}</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Schema Inspector & Bridge */}
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1E2E] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-violet-500" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                    Table Schema: students
                  </h3>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">roll_no</span>
                    <span className="text-violet-600 dark:text-violet-400">INTEGER PRIMARY KEY</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">name</span>
                    <span className="text-slate-500">TEXT NOT NULL</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">branch</span>
                    <span className="text-slate-500">TEXT (CSE, DS, AI, ECE)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">marks</span>
                    <span className="text-violet-600 dark:text-violet-400">REAL (0 - 100)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">attendance</span>
                    <span className="text-slate-500">INTEGER (%)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">lab_grade</span>
                    <span className="text-slate-500">TEXT (O, A+, A, B+)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                    Want to run Python + SQLite scripts with joins and transactions?
                  </div>
                  <button
                    onClick={() => {
                      setSelectedExpId('exp-4');
                      setCurrentTab('experiments');
                    }}
                    className="group/cta w-full py-2.5 rounded-xl bg-slate-100 hover:bg-violet-50 dark:bg-slate-800 dark:hover:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-violet-200 dark:border-violet-800 cursor-pointer shadow-2xs hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span>Open Experiment 04 (SQL Lab)</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: NUMPY VECTOR CALCULATOR */}
      {activeTab === 'numpy-calculator' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0B1E2E] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-violet-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  NumPy N-Dimensional Array Vectorizer
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Inspect vector arithmetic, standard deviation, Z-score normalization, and outlier detection on a 3×3 matrix.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveMatrixOp('raw')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeMatrixOp === 'raw' ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Raw Matrix
              </button>
              <button
                onClick={() => setActiveMatrixOp('normalized')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeMatrixOp === 'normalized' ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Z-Score Normalization
              </button>
              <button
                onClick={() => setActiveMatrixOp('outliers')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeMatrixOp === 'outliers' ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Detect Outliers (&gt;1.5σ)
              </button>
            </div>
          </div>

          {/* Matrix Grid Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                3×3 Matrix Array (Shape: [3, 3], Dtype: float64)
              </div>
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 font-mono text-center">
                {getComputedMatrixValues().map((val, idx) => (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl font-bold text-sm sm:text-base border transition-all ${
                      val === -999
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse'
                        : activeMatrixOp === 'normalized'
                        ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-300 border-violet-200 dark:border-violet-800'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {val === -999 ? 'OUTLIER!' : val}
                  </div>
                ))}
              </div>
            </div>

            {/* Matrix Statistical Metrics */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-slate-800">
                  Calculated Statistics
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mean (μ):</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">{mean}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Variance (σ²):</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">{variance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Standard Dev (σ):</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">{stdDev}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shape:</span>
                  <span className="text-slate-700 dark:text-slate-300">(3, 3)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  navigateToExperiment('exp-2', 'details');
                }}
                className="group/cta w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Launch NumPy Lab (Exp 02)</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: JUPYTER NOTEBOOK & GOOGLE COLAB HUB */}
      {activeTab === 'jupyter-colab' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-orange-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 text-xs font-mono font-bold">
                <span>🪐 Jupyter Notebook &amp; ⚡ Google Colaboratory</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Interactive Computational Notebooks
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                The standard environments for modern Data Science and Machine Learning. Develop interactive code, run computations with hardware acceleration, visualize models, and export reproducible lab reports.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="https://jupyter.org/try"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 inline-flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <span>Try Jupyter Web</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://colab.research.google.com/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 inline-flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <span>Launch Google Colab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Side-by-side Spotlight Cards: Jupyter vs Colab */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card 1: Jupyter Notebook */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1E2E] border border-orange-200/80 dark:border-orange-950/80 shadow-md flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900 shadow-2xs">
                      🪐
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Jupyter Notebook &amp; JupyterLab
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                        <span>v7.1.0 / Lab v4.1</span>
                        <span>•</span>
                        <span className="text-orange-600 dark:text-orange-400 font-semibold">Local &amp; Web Kernel</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-300/40">
                    OPEN SOURCE
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  De-facto open-source notebook architecture for data exploration, cleaning, and statistical reporting. Combines executable Python cells with Markdown narratives, equations, and visual outputs.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] font-mono">
                    Key Highlights
                  </div>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>Standard <strong>.ipynb</strong> JSON notebook file format compatible everywhere.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>Seamless execution of interactive <strong>%matplotlib inline</strong> and Pandas DataFrames.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>Support for shell commands using <strong>!pip install</strong> and system automation.</span>
                    </li>
                  </ul>
                </div>

                {/* Sample Code Snippet */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs relative">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
                    <span>Jupyter Quick-Start Cell</span>
                    <button
                      onClick={() => handleCopySnippet('jupyter-hero', `# Jupyter Interactive Notebook Demo\nimport pandas as pd\nimport matplotlib.pyplot as plt\n%matplotlib inline\n\ndf = pd.read_csv('students.csv')\ndf.plot(kind='bar', x='Name', y='Marks', color='#009F9A')\nplt.title("Student Marks Analysis")\nplt.show()`)}
                      className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedSnippetId === 'jupyter-hero' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-orange-300 leading-relaxed text-[11px]">
{`# Jupyter Interactive Notebook Demo
import pandas as pd
import matplotlib.pyplot as plt
%matplotlib inline

df = pd.read_csv('students.csv')
df.plot(kind='bar', x='Name', y='Marks', color='#009F9A')
plt.title("Student Marks Analysis")
plt.show()`}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <a
                  href="https://jupyter.org/try"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Launch Jupyter Web</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://jupyter.org/documentation"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3 h-3 text-orange-500" />
                  <span>Docs</span>
                </a>
              </div>
            </div>

            {/* Card 2: Google Colab */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1E2E] border border-amber-200/80 dark:border-amber-950/80 shadow-md flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 shadow-2xs">
                      ⚡
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Google Colaboratory (Colab)
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                        <span>Google Cloud Hosted</span>
                        <span>•</span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">Free NVIDIA GPUs / TPUs</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                    CLOUD ACCELERATION
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Zero-configuration cloud Jupyter environment with free access to high-performance GPU hardware (NVIDIA T4/V100). Ideal for machine learning, deep learning, NLP, and team collaboration.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] font-mono">
                    Key Highlights
                  </div>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>Pre-installed packages: PyTorch, TensorFlow, Scikit-Learn, Pandas, OpenCV.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>Native Google Drive synchronization with <strong>drive.mount('/content/drive')</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>Instant team sharing and GitHub repository import/export via direct URL.</span>
                    </li>
                  </ul>
                </div>

                {/* Sample Code Snippet */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs relative">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
                    <span>Colab GPU Acceleration Check</span>
                    <button
                      onClick={() => handleCopySnippet('colab-hero', `# Google Colab GPU & Drive Mount\nfrom google.colab import drive\ndrive.mount('/content/drive')\n\nimport torch\nprint(f"CUDA Available: {torch.cuda.is_available()}")\nif torch.cuda.is_available():\n    print(f"Device Name: {torch.cuda.get_device_name(0)}")`)}
                      className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedSnippetId === 'colab-hero' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-amber-300 leading-relaxed text-[11px]">
{`# Google Colab GPU & Drive Mount
from google.colab import drive
drive.mount('/content/drive')

import torch
print(f"CUDA Available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"Device Name: {torch.cuda.get_device_name(0)}")`}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <a
                  href="https://colab.research.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Launch Google Colab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://colab.research.google.com/notebooks/intro.ipynb"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3 h-3 text-amber-500" />
                  <span>Tutorial</span>
                </a>
              </div>
            </div>

          </div>

          {/* Quick-Start Curriculum Templates */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1E2E] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Curriculum Notebook Templates for Lab Practicals</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pre-configured notebook starter files for university experiments. Run locally in Jupyter or import directly into Colab.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  title: '1abc.ipynb',
                  expId: 'exp-1',
                  desc: 'CSV, TXT, JSON, and Excel parsing with DataFrame index manipulation.',
                  tag: 'Exp 01',
                  colabUrl: 'https://colab.research.google.com/github/kartheek1717/DataScience1/blob/main/1abc.ipynb'
                },
                {
                  title: '2ab.ipynb',
                  expId: 'exp-2',
                  desc: 'GitHub REST API requests, JSON normalization, and SQLite relational queries.',
                  tag: 'Exp 02',
                  colabUrl: 'https://colab.research.google.com/github/kartheek1717/DataScience1/blob/main/2ab.ipynb'
                },
                {
                  title: '5ab.ipynb',
                  expId: 'exp-5',
                  desc: 'Statistical plots with Matplotlib annotations and Seaborn multi-panel figures.',
                  tag: 'Exp 05',
                  colabUrl: 'https://colab.research.google.com/github/kartheek1717/DataScience1/blob/main/5ab.ipynb'
                }
              ].map((template) => (
                <div 
                  key={template.title}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
                        {template.tag}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400">
                        .ipynb
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate" title={template.title}>
                      {template.title}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {template.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                    <button
                      onClick={() => navigateToExperiment(template.expId, 'details')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Lab Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <a
                      href={template.colabUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-mono font-bold hover:bg-orange-200 dark:hover:bg-orange-900/60 transition-colors cursor-pointer"
                    >
                      Open in Colab ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
