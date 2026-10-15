import React, { useState, useEffect } from 'react';
import { useLab } from '../context/LabContext';
import { Hero3DCanvas } from './Hero3DCanvas';
import { 
  ArrowRight, 
  Upload, 
  Edit3, 
  GraduationCap, 
  Save, 
  X,
  School,
  Briefcase,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { 
    setCurrentTab, 
    setSelectedExpId, 
    setSelectedSubExpId, 
    profile, 
    updateProfile, 
    addToast,
    isAdmin 
  } = useLab();

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [rollNo, setRollNo] = useState(profile.rollNo);
  const [branch, setBranch] = useState(profile.branch);
  const [section, setSection] = useState(profile.section);
  const [facultyName, setFacultyName] = useState(profile.facultyName || 'S Bosubabu');
  const [designation, setDesignation] = useState(profile.designation || 'Assistant Professor');
  const [collegeName, setCollegeName] = useState(profile.collegeName || 'Mohan Babu University');
  const [avatar, setAvatar] = useState(profile.avatar || '/kartheek_profile.jpg');
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || 'https://www.linkedin.com/in/kartheek-badabagni-950431323/');

  // Interactive 3D Parallax Tilt State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
    setTilt({
      x: -(y / rect.height) * 8,
      y: (x / rect.width) * 8,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    setName(profile.name);
    setRollNo(profile.rollNo);
    setBranch(profile.branch);
    setSection(profile.section);
    setFacultyName(profile.facultyName || 'S Bosubabu');
    setDesignation(profile.designation || 'Assistant Professor');
    setCollegeName(profile.collegeName || 'Mohan Babu University');
    setAvatar(profile.avatar || '/kartheek_profile.jpg');
    setLinkedinUrl(profile.linkedinUrl || 'https://www.linkedin.com/in/kartheek-badabagni-950431323/');
  }, [profile]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          updateProfile({ avatar: reader.result });
          addToast('Profile photo updated successfully ✓');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      rollNo,
      branch,
      section,
      facultyName,
      designation,
      collegeName,
      labIncharge: designation,
      avatar,
      linkedinUrl,
    });
    setIsEditing(false);
    addToast('Profile details updated ✓');
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#075985] text-white p-4 sm:p-8 lg:p-10 shadow-2xl border border-sky-300/30"
    >
      
      {/* 3D Interactive Canvas & Cyber Data Grid (Remaining Part Background) */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 overflow-hidden pointer-events-none z-0">
        <Hero3DCanvas mousePos={mousePos} />
        <div className="absolute -bottom-8 left-0 right-0 h-44 cyber-grid-3d opacity-30 pointer-events-none" />
      </div>

      {/* Background ambient lighting effects in sky blue & cyan */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sky-300/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-cyan-400/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: 3D Interactive Hero Content */}
        <div 
          className="lg:col-span-6 space-y-5 relative z-10 preserve-3d transition-transform duration-200 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Main 3D Title with Extruded Metallic Depth & Spin Sparkle */}
          <div style={{ transform: 'translateZ(45px)' }}>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight flex items-center gap-2 text-3d-title">
              <span>DATA SCIENCE</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-100 to-white animate-spin-sparkle inline-block drop-shadow-[0_0_14px_rgba(34,211,238,0.9)]">
                ✦
              </span>
            </h1>
            <h2 className="text-base sm:text-lg font-semibold text-sky-100 mt-1.5 flex items-center gap-2 tracking-wide drop-shadow-sm">
              <span>Subject Digital Library</span>
            </h2>
          </div>

          {/* Description */}
          <p 
            className="text-sm sm:text-base text-sky-50/95 leading-relaxed max-w-xl font-normal drop-shadow-sm"
            style={{ transform: 'translateZ(25px)' }}
          >
            Hands-on university laboratory experiments, reproducible code routines, interactive visual benchmarks, and industrial Data Science projects.
          </p>

          {/* Quick highlights 3D pill row */}
          <div 
            className="flex flex-wrap items-center gap-2 pt-1 text-xs text-sky-100 font-mono"
            style={{ transform: 'translateZ(35px)' }}
          >
            <span className="px-3 py-1.5 rounded-xl bg-sky-950/40 border border-sky-200/30 backdrop-blur-md flex items-center gap-2 shadow-md hover:scale-105 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-cyan-500/20 transition-all cursor-default group">
              <span className="w-2 h-2 rounded-full bg-cyan-300 group-hover:animate-ping" />
              <span>Python 3.12 Kernel</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-sky-950/40 border border-sky-200/30 backdrop-blur-md flex items-center gap-2 shadow-md hover:scale-105 hover:-translate-y-1 hover:border-sky-300 hover:shadow-sky-500/20 transition-all cursor-default group">
              <span className="w-2 h-2 rounded-full bg-sky-300 group-hover:animate-ping" />
              <span>Pandas &amp; NumPy</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-sky-950/40 border border-sky-200/30 backdrop-blur-md flex items-center gap-2 shadow-md hover:scale-105 hover:-translate-y-1 hover:border-white hover:shadow-white/20 transition-all cursor-default group">
              <span className="w-2 h-2 rounded-full bg-white group-hover:animate-ping" />
              <span>10 Full Experiments</span>
            </span>
          </div>

          {/* Action Buttons with 3D Physical Push Feedback */}
          <div 
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            style={{ transform: 'translateZ(50px)' }}
          >
            <button
              onClick={() => {
                setSelectedExpId('exp-1');
                setSelectedSubExpId('1a');
                setCurrentTab('experiments');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-sky-900 font-bold text-sm btn-3d-primary flex items-center justify-center gap-2 ring-2 ring-white/80 cursor-pointer"
            >
              <span>🧪 Start Exploring</span>
              <ArrowRight className="w-4 h-4 text-sky-600 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setCurrentTab('modules')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-950/50 border border-sky-200/40 text-white font-semibold text-sm backdrop-blur-md btn-3d-secondary flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📚 Course Modules</span>
            </button>
          </div>

        </div>

        {/* Right Column: Prominent Big Profile Card (Sky Blue Theme) */}
        <div className="lg:col-span-6 relative z-10">
          
          <div className="rounded-2xl bg-sky-950/30 backdrop-blur-xl border border-sky-200/35 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            
            {/* Header row: Status + Edit Trigger */}
            <div className="flex items-center justify-between pb-4 border-b border-sky-200/20 mb-4 text-xs font-mono">
              <span className="flex items-center gap-2 text-sky-200 font-bold tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-pulse shadow-sm shadow-cyan-300/50" />
                STUDENT PROFILE &amp; FACULTY
              </span>
              {isAdmin ? (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1 rounded-lg bg-sky-900/50 hover:bg-sky-800/60 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-sky-200/30 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sky-300" />
                  <span>{isEditing ? 'Close' : 'Edit'}</span>
                </button>
              ) : (
                <span className="text-[10px] text-sky-200/80 font-mono flex items-center gap-1 bg-sky-950/40 px-2.5 py-0.5 rounded-md border border-sky-200/20">
                  <ShieldCheck className="w-3 h-3 text-cyan-300" />
                  Verified
                </span>
              )}
            </div>

            {/* Profile Core Row: Large Uploadable Photo & Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
              
              {/* Big Photo with Hover Upload (Admin only) */}
              <div className="relative group shrink-0">
                <img
                  src={profile.avatar || avatar || '/kartheek_profile.jpg'}
                  alt={name || profile.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top ring-4 ring-sky-300/80 shadow-2xl bg-sky-950"
                />
                {isAdmin && (
                  <label 
                    className="absolute inset-0 bg-sky-950/75 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[11px] font-bold text-white backdrop-blur-xs"
                    title="Upload New Photo"
                  >
                    <Upload className="w-5 h-5 mb-1 text-sky-300 animate-bounce" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                )}
              </div>

              {/* Student Identification */}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white capitalize leading-tight">
                    {profile.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-cyan-400/20 text-cyan-200 border border-cyan-400/40">
                    Active
                  </span>
                </div>

                <p className="text-xs font-mono text-sky-200 font-bold">
                  Roll No: {profile.rollNo}
                </p>

                <p className="text-xs font-semibold text-sky-100">
                  Department of Data Science • Section {profile.section}
                </p>

                <p className="text-xs text-sky-200/90 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-0.5 font-medium leading-relaxed">
                  <School className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                  <span>Mohan Babu University, Tirupathi, Andhra Pradesh, India</span>
                </p>

                <div className="flex items-center justify-center sm:justify-start pt-1">
                  <a
                    href={profile.linkedinUrl || 'https://www.linkedin.com/in/kartheek-badabagni-950431323/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950/60 hover:bg-sky-900/80 text-sky-200 border border-sky-300/30 text-[11px] font-mono font-medium transition-all hover:border-cyan-300 hover:text-white cursor-pointer shadow-xs"
                    title="Open LinkedIn Profile"
                  >
                    <span>in/kartheek-badabagni-950431323</span>
                    <ExternalLink className="w-3 h-3 text-cyan-300" />
                  </a>
                </div>

              </div>

            </div>

            {/* Faculty & Designation Information Grid */}
            <div className="pt-3 border-t border-sky-200/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Faculty Advisor */}
                <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-200/20">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-200 mb-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Faculty Name</span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {profile.facultyName || 'S Bosubabu'}
                  </div>
                </div>

                {/* Designation */}
                <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-200/20">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-200 mb-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-sky-300" />
                    <span>Designation</span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {profile.designation || profile.labIncharge || 'Assistant Professor'}
                  </div>
                </div>
              </div>
            </div>

            {/* Inline Edit Form Drawer */}
            {isEditing && (
              <form 
                onSubmit={handleSaveProfile} 
                className="mt-4 p-4 rounded-xl bg-[#07141F]/95 border border-white/20 space-y-3 text-xs animate-in fade-in"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/15">
                  <span className="font-bold text-white">Edit Student &amp; Academic Details</span>
                  <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">Roll No</label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">Branch</label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">Section</label>
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">College Name</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. Mohan Babu University"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">Faculty Name</label>
                    <input
                      type="text"
                      value={facultyName}
                      onChange={(e) => setFacultyName(e.target.value)}
                      placeholder="e.g. S Bosubabu"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Assistant Professor"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-[10px] uppercase font-bold mb-1">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/in/kartheek-badabagni-950431323/"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white outline-none font-mono text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 rounded-lg border border-white/20 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded-lg bg-[#009F9A] text-white font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
