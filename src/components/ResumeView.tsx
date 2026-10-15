import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { 
  FileText, 
  Printer, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Award, 
  Briefcase, 
  Code2, 
  CheckCircle2, 
  Sparkles, 
  Edit3, 
  X, 
  ExternalLink,
  FlaskConical,
  School,
  Copy,
  Check,
  FolderKanban,
  Terminal,
  Cpu,
  Cloud,
  Layers,
  Gamepad2,
  TrendingUp,
  Heart
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const LeetCodeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .666-1.607L9.36 7.99l4.577-4.887c.532-.544.526-1.42-.015-1.957A1.37 1.37 0 0 0 13.483 0zm-2.88 7.286c-.759 0-1.375.616-1.375 1.375s.616 1.375 1.375 1.375h10.25c.759 0 1.375-.616 1.375-1.375s-.616-1.375-1.375-1.375H10.603z"/>
  </svg>
);

export const ResumeView: React.FC = () => {
  const { profile, updateProfile, projects, experiments, addToast, isAdmin } = useLab();
  const [viewMode, setViewMode] = useState<'modern' | 'ats'>('modern');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form State
  const [editName, setEditName] = useState(profile.name || 'BADABAGNI KARTHEEK');
  const [editRollNo, setEditRollNo] = useState(profile.rollNo || '24102A030006');
  const [editEmail, setEditEmail] = useState(profile.email || 'kartheek1717@gmail.com');
  const [editPhone, setEditPhone] = useState(profile.phone || '+91 7569270943');
  const [editLocation, setEditLocation] = useState(profile.location || 'Nellore, Andhra Pradesh, India');
  const [editCollege, setEditCollege] = useState(profile.collegeName || 'Mohan Babu University');
  const [editBranch, setEditBranch] = useState(profile.branch || 'Data Science');
  const [editBio, setEditBio] = useState(
    profile.bio ||
    'B.Tech Data Science student at Mohan Babu University with certified competencies across full-stack development, AWS cloud concepts, and data analytics. Hands-on experience developing and hosting responsive web applications and algorithmic trading tools using Python, Java, SQL, and modern web frameworks. Proven problem-solving ability in Data Structures and Algorithms with a focus on writing scalable, clean code. Seeking an internship or entry-level software development opportunity to contribute to real-world engineering projects.'
  );
  const [editGithub, setEditGithub] = useState(profile.githubUrl || 'https://github.com/kartheek1717');
  const [editLinkedin, setEditLinkedin] = useState(profile.linkedinUrl || 'https://www.linkedin.com/in/kartheek-badabagni-950431323/');
  const [editLeetcode, setEditLeetcode] = useState(profile.leetcodeUrl || 'https://leetcode.com/u/pandu_17/');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email || 'kartheek1717@gmail.com');
    setCopiedEmail(true);
    addToast('Email copied to clipboard ✓');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      rollNo: editRollNo,
      email: editEmail,
      phone: editPhone,
      location: editLocation,
      collegeName: editCollege,
      branch: editBranch,
      bio: editBio,
      githubUrl: editGithub,
      linkedinUrl: editLinkedin,
      leetcodeUrl: editLeetcode
    });
    setIsEditModalOpen(false);
    addToast('Resume details updated ✓');
  };

  // Structured Technical Skills
  const technicalSkills = [
    {
      category: 'Programming Languages',
      skills: 'Python, Java, SQL, JavaScript (ES6+)'
    },
    {
      category: 'Web & Cloud Technologies',
      skills: 'HTML5, CSS3, Front-End & Back-End Architecture, AWS Cloud Services'
    },
    {
      category: 'Developer Tools',
      skills: 'Git, GitHub, VS Code, IntelliJ IDEA, Render, Whop'
    },
    {
      category: 'Core Fundamentals',
      skills: 'Data Structures & Algorithms (DSA), OOP, Relational Database Management, Data Analysis'
    },
    {
      category: 'Areas of Interest',
      skills: 'Full-Stack Development, Cloud Computing, Data Science, Quantitative Systems'
    }
  ];

  // Specific Resume Projects
  const resumeProjects = [
    {
      id: 'btc-trader',
      title: 'BTC AI Trader — Automated Cryptocurrency Trading & Analytics Platform',
      url: 'https://btc-ai-trader.whop.site/',
      displayUrl: 'https://btc-ai-trader.whop.site/',
      bullets: [
        'Designed and deployed an automated cryptocurrency intelligence platform delivering real-time technical analytics and algorithmic trade signals.',
        'Implemented data ingestion pipelines to compute momentum indicators (RSI, moving averages) and evaluate risk-adjusted trading strategies.',
        'Integrated an end-to-end commercial access and dashboard infrastructure deployed live on Whop with low-latency user access.'
      ],
      techStack: 'Python, Machine Learning, Data Analytics, REST APIs, Whop Platform'
    },
    {
      id: 'block-survive',
      title: 'Block Survive — Interactive Web-Based Survival Game',
      url: 'https://block-survive.onrender.com/',
      displayUrl: 'https://block-survive.onrender.com/',
      bullets: [
        'Built and deployed an interactive 2D survival game featuring real-time collision detection, physics calculation, and persistent score tracking.',
        'Optimized browser canvas redraw cycles and keyboard event handlers to deliver fluid frame rates and low-latency response times.',
        'Managed modular application state for difficulty ramping and obstacle generation; deployed the production build to Render.'
      ],
      techStack: 'JavaScript (ES6+), HTML5 Canvas, CSS3, Node.js / Express, Render Deployment'
    }
  ];

  // Education Records
  const educationHistory = [
    {
      degree: 'B.Tech in Data Science, Mohan Babu University',
      score: 'CGPA: 8.3 / 10',
      period: '2024 – 2028',
      location: 'Tirupati, AP'
    },
    {
      degree: 'Intermediate (Class XII), MPC, Narayana Junior College',
      score: 'Percentage: 95.0%',
      period: '2022 – 2024',
      location: 'Nellore, AP'
    },
    {
      degree: 'Secondary School Certificate (Class X), VBR EM High School',
      score: 'Percentage: 90.0%',
      period: '2022',
      location: 'Nellore, AP'
    }
  ];

  // Certifications
  const certifications = [
    { title: 'Front-End Development Specialization', issuer: 'Coursera' },
    { title: 'Back-End Development Specialization', issuer: 'Coursera' },
    { title: 'AWS Cloud Fundamentals / Practitioner', issuer: 'Coursera' },
    { title: 'Data Analytics Specialization', issuer: 'Coursera' }
  ];

  // Achievements & Activities
  const achievements = [
    'Active problem solver on LeetCode (pandu_17), regularly practicing core data structures, algorithms, and complexity optimization.',
    'Engineered and deployed multiple live, publicly accessible applications across cloud and web hosting environments (Render, Whop).',
    'Interests & Hobbies: Playing cricket, listening to music, and exploring emerging software and AI technologies.'
  ];

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="no-print p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0C1D2A] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B2538] via-[#009F9A] to-[#14B8A6] flex items-center justify-center text-white shadow-xs">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-[#0B2538] dark:text-white leading-tight">
              Student Profile &amp; Curriculum Vitae
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.collegeName || 'Mohan Babu University'} • Department of {profile.branch}
            </p>
          </div>
        </div>

        {/* View Mode & Actions (Interactive Portfolio on left, Document / ATS on right) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('modern')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'modern'
                  ? 'bg-white dark:bg-[#0B1E2E] text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Interactive Portfolio
            </button>
            <button
              onClick={() => setViewMode('ats')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'ats'
                  ? 'bg-white dark:bg-[#0B1E2E] text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Document / ATS View
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Edit Contact & Details"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Resume</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-teal-900/20 active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ATS / DOCUMENT VIEW (MATCHING EXACT RESUME SHEET)                         */}
      {/* ========================================================================= */}
      {viewMode === 'ats' ? (
        <div className="bg-white text-black p-8 sm:p-12 rounded-3xl border border-slate-300 shadow-xl space-y-6 print:p-0 print:border-none print:shadow-none print:rounded-none font-sans leading-normal selection:bg-teal-100">
          
          {/* Header */}
          <div className="border-b-2 border-black pb-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                {profile.name || 'BADABAGNI KARTHEEK'}
              </h1>
              <a 
                href={`tel:${profile.phone || '+917569270943'}`}
                className="text-sm font-bold text-sky-700 hover:underline font-mono"
              >
                {profile.phone || '+91 7569270943'}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-800">
              <a 
                href={`mailto:${profile.email || 'kartheek1717@gmail.com'}`}
                className="text-sky-700 hover:underline flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5 text-black" />
                <span>{profile.email || 'kartheek1717@gmail.com'}</span>
              </a>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-gray-700">
                <MapPin className="w-3.5 h-3.5 text-black" />
                <span>{profile.location || 'Nellore, Andhra Pradesh, India'}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sky-700 font-mono pt-0.5">
              <a 
                href={profile.linkedinUrl || 'https://www.linkedin.com/in/kartheek-badabagni-950431323/'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 font-semibold"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-sky-700" />
                <span>in/kartheek-badabagni-950431323</span>
              </a>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <a 
                href={profile.githubUrl || 'https://github.com/kartheek1717'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 font-semibold"
              >
                <GithubIcon className="w-3.5 h-3.5 text-black" />
                <span>kartheek1717</span>
              </a>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <a 
                href={profile.leetcodeUrl || 'https://leetcode.com/u/pandu_17/'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 font-semibold text-amber-600"
              >
                <LeetCodeIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>pandu_17</span>
              </a>
            </div>
          </div>

          {/* PROFESSIONAL SUMMARY */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-black uppercase tracking-wider border-b border-black pb-0.5 text-black">
              Professional Summary
            </h2>
            <p className="text-[12px] leading-relaxed text-gray-900 text-justify">
              {profile.bio ||
                'B.Tech Data Science student at Mohan Babu University with certified competencies across full-stack development, AWS cloud concepts, and data analytics. Hands-on experience developing and hosting responsive web applications and algorithmic trading tools using Python, Java, SQL, and modern web frameworks. Proven problem-solving ability in Data Structures and Algorithms with a focus on writing scalable, clean code. Seeking an internship or entry-level software development opportunity to contribute to real-world engineering projects.'}
            </p>
          </div>

          {/* TECHNICAL SKILLS */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider border-b border-black pb-0.5 text-black">
              Technical Skills
            </h2>
            <div className="text-[12px] space-y-1 text-gray-900">
              {technicalSkills.map((item) => (
                <div key={item.category} className="grid grid-cols-1 sm:grid-cols-12 gap-1">
                  <span className="sm:col-span-4 font-bold text-black">{item.category}</span>
                  <span className="sm:col-span-8 text-gray-800">{item.skills}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PROJECTS */}
          <div className="space-y-3.5">
            <h2 className="text-xs font-black uppercase tracking-wider border-b border-black pb-0.5 text-black">
              Projects
            </h2>

            {resumeProjects.map((proj) => (
              <div key={proj.id} className="space-y-1 text-[12px]">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <span className="font-bold text-black text-[12.5px]">
                    {proj.title}
                  </span>
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 hover:underline font-mono text-[11px] font-semibold shrink-0"
                  >
                    {proj.displayUrl}
                  </a>
                </div>

                <ul className="list-disc list-outside pl-4 space-y-0.5 text-gray-800">
                  {proj.bullets.map((bullet, i) => (
                    <li key={i} className="leading-snug">{bullet}</li>
                  ))}
                </ul>

                <p className="text-[11.5px] text-gray-900 pt-0.5">
                  <span className="font-bold text-black">Tech Stack: </span>
                  {proj.techStack}
                </p>
              </div>
            ))}
          </div>

          {/* EDUCATION */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider border-b border-black pb-0.5 text-black">
              Education
            </h2>

            <div className="space-y-2 text-[12px]">
              {educationHistory.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-black block">{edu.degree}</span>
                    <span className="text-gray-700">{edu.score}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-semibold text-black block">{edu.period}</span>
                    <span className="text-gray-600 text-[11px]">{edu.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CERTIFICATIONS */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider border-b border-black pb-0.5 text-black">
              Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-[12px] text-gray-900">
              {certifications.map((cert, idx) => (
                <div key={idx} className="flex justify-between items-baseline border-b border-gray-100 pb-0.5">
                  <span className="font-semibold text-black">{cert.title}</span>
                  <span className="text-gray-600 text-xs italic">{cert.issuer}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ACHIEVEMENTS & ACTIVITIES */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider border-b border-black pb-0.5 text-black">
              Achievements &amp; Activities
            </h2>
            <ul className="list-disc list-outside pl-4 space-y-1 text-[12px] text-gray-800">
              {achievements.map((item, idx) => (
                <li key={idx} className="leading-snug">{item}</li>
              ))}
            </ul>
          </div>

        </div>
      ) : (

        /* ========================================================================= */
        /* MODERN INTERACTIVE PORTFOLIO RESUME VIEW                                  */
        /* ========================================================================= */
        <div className="space-y-6">
          
          {/* Main Hero Header Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#0B2538] via-[#0E354D] to-[#041B2B] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-sky-900/40 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
              
              {/* Profile Avatar */}
              <div className="relative shrink-0">
                <img
                  src={profile.avatar || '/kartheek_profile.jpg'}
                  alt={profile.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover object-top ring-4 ring-teal-400/80 shadow-2xl bg-sky-950"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/kartheek_profile.jpg';
                  }}
                />
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold font-mono shadow-md border border-white/20">
                  VERIFIED
                </span>
              </div>

              {/* Identity & Header Info */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-mono font-bold border border-teal-400/30">
                    <Sparkles className="w-3 h-3 text-teal-300" />
                    <span>Data Science Scholar &amp; Full-Stack Developer</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                    {profile.name || 'BADABAGNI KARTHEEK'}
                  </h1>

                  <p className="text-sm sm:text-base font-bold text-sky-200">
                    B.Tech in Computer Science &amp; Engineering ({profile.branch || 'Data Science'})
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                  {profile.bio ||
                    'B.Tech Data Science student at Mohan Babu University with certified competencies across full-stack development, AWS cloud concepts, and data analytics. Hands-on experience developing and hosting responsive web applications and algorithmic trading tools.'}
                </p>

                {/* Contact Pills */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 font-mono">
                    <School className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                    <span>{profile.collegeName || 'Mohan Babu University'}</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 font-mono">
                    <span>ID:</span>
                    <span className="font-bold text-teal-300">{profile.rollNo}</span>
                  </div>

                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 font-mono transition-colors cursor-pointer"
                    title="Click to copy email"
                  >
                    <Mail className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    <span>{profile.email || 'kartheek1717@gmail.com'}</span>
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-400 ml-1" /> : <Copy className="w-3 h-3 text-slate-400 ml-1" />}
                  </button>

                  <a
                    href={`tel:${profile.phone || '+917569270943'}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 font-mono transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span>{profile.phone || '+91 7569270943'}</span>
                  </a>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                    <span>{profile.location || 'Nellore, Andhra Pradesh, India'}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
                  <a
                    href={profile.githubUrl || 'https://github.com/kartheek1717'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 font-mono flex items-center gap-1.5 border border-teal-400/30 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>github.com/kartheek1717</span>
                  </a>

                  <a
                    href={profile.linkedinUrl || 'https://www.linkedin.com/in/kartheek-badabagni-950431323/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 font-mono flex items-center gap-1.5 border border-sky-400/30 transition-colors"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>in/kartheek-badabagni-950431323</span>
                  </a>

                  <a
                    href={profile.leetcodeUrl || 'https://leetcode.com/u/pandu_17/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-mono flex items-center gap-1.5 border border-amber-400/30 transition-colors"
                  >
                    <LeetCodeIcon className="w-3.5 h-3.5" />
                    <span>leetcode.com/u/pandu_17</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Grid Layout: Left Column & Right Column */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Education, Skills, Faculty Advisor */}
            <div className="space-y-6 lg:col-span-1">
              
              {/* Education Box */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0C1D2A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-[#0B2538] dark:text-white font-extrabold text-sm">
                  <GraduationCap className="w-4 h-4 text-teal-600" />
                  <span>Education</span>
                </div>

                <div className="space-y-4">
                  {educationHistory.map((edu, idx) => (
                    <div key={idx} className="space-y-1 relative pl-3 border-l-2 border-teal-500/40">
                      <div className="flex items-center justify-between text-[11px] font-mono text-teal-600 font-bold">
                        <span>{edu.period}</span>
                        <span className="text-slate-400 font-normal">{edu.location}</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-[#0B2538] dark:text-white leading-snug">
                        {edu.degree}
                      </h4>
                      <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {edu.score}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills Matrix */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0C1D2A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-[#0B2538] dark:text-white font-extrabold text-sm">
                  <Code2 className="w-4 h-4 text-teal-600" />
                  <span>Technical Competencies</span>
                </div>

                <div className="space-y-3.5">
                  {technicalSkills.map((cat) => (
                    <div key={cat.category} className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        {cat.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.skills.split(', ').map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0C1D2A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-[#0B2538] dark:text-white font-extrabold text-sm">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Coursera Certifications</span>
                </div>

                <div className="space-y-2.5">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800">
                      <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        ✓
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 dark:text-white block leading-snug">
                          {cert.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {cert.issuer} Verified Specialization
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty Mentorship Card */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-600 font-bold block">
                  Academic Mentorship
                </span>
                <div className="text-xs space-y-1">
                  <strong className="block text-[#0B2538] dark:text-white font-bold text-sm">
                    {profile.facultyName || 'S Bosubabu'}
                  </strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    {profile.designation || 'Assistant Professor'}
                  </p>
                  <p className="text-[11px] text-teal-600 font-medium pt-1">
                    Department of Computer Science &amp; AI, {profile.collegeName || 'Mohan Babu University'}
                  </p>
                </div>
              </div>

            </div>

            {/* Right 2-Columns: Applied Projects & Achievements */}
            <div className="space-y-6 lg:col-span-2">
              
              {/* Featured Resume Projects Section */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0C1D2A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-base sm:text-lg text-[#0B2538] dark:text-white">
                        Production Projects &amp; Software Systems
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Live deployed web platforms, algorithmic trading systems, and game architectures
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {resumeProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-colors space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm sm:text-base text-[#0B2538] dark:text-white flex items-center gap-2">
                            {proj.title}
                          </h4>
                        </div>

                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
                        >
                          <span>Live Site</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {proj.bullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          {proj.techStack.split(', ').map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Live Production
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements & Activities */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0C1D2A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-[#0B2538] dark:text-white">
                      Achievements &amp; Activities
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Problem solving tracks, public cloud deployments, and personal pursuits
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {achievements.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/80 text-teal-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        #{idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coursework & Lab Verification */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0C1D2A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-base sm:text-lg text-[#0B2538] dark:text-white">
                        Laboratory Research &amp; Coursework Rigor
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Course Code: 22DS102006 • Mentored by {profile.facultyName || 'S Bosubabu'} ({profile.designation || 'Assistant Professor'})
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60">
                    10/10 Experiments
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {experiments.slice(0, 6).map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-teal-600">
                          Exp #{exp.number}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Validated
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-white truncate">
                        {exp.title}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Edit Resume Details Modal */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            className="w-full max-w-xl bg-white dark:bg-[#07141F] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <h3 className="font-extrabold text-base text-[#0B2538] dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-teal-600" />
                <span>Edit Resume &amp; Contact Details</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editRollNo}
                    onChange={(e) => setEditRollNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Location (City, State, Country)
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={editCollege}
                    onChange={(e) => setEditCollege(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Department / Branch
                  </label>
                  <input
                    type="text"
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Professional Summary / Bio
                </label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 text-[11px]">
                    GitHub Profile
                  </label>
                  <input
                    type="text"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500 text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 text-[11px]">
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500 text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 text-[11px]">
                    LeetCode Profile
                  </label>
                  <input
                    type="text"
                    value={editLeetcode}
                    onChange={(e) => setEditLeetcode(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C1D2A] text-slate-900 dark:text-white outline-none focus:border-teal-500 text-[11px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
