import React, { useState, useEffect } from 'react';
import { useLab } from '../context/LabContext';
import { 
  Upload, 
  Edit3, 
  Save, 
  UserCheck, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Mail, 
  Hash, 
  Building2, 
  Calendar,
  CheckCircle2,
  X,
  School,
  Briefcase,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const BigProfileCard: React.FC = () => {
  const { profile, updateProfile, addToast, setCurrentTab, experiments, projects } = useLab();
  const [isEditing, setIsEditing] = useState(false);

  // Editable Form State
  const [name, setName] = useState(profile.name);
  const [rollNo, setRollNo] = useState(profile.rollNo);
  const [branch, setBranch] = useState(profile.branch);
  const [section, setSection] = useState(profile.section);
  const [email, setEmail] = useState(profile.email);
  const [facultyName, setFacultyName] = useState(profile.facultyName || 'S Bosubabu');
  const [designation, setDesignation] = useState(profile.designation || 'Assistant Professor');
  const [collegeName, setCollegeName] = useState(profile.collegeName || 'Mohan Babu University');
  const [avatar, setAvatar] = useState(profile.avatar || '/kartheek_profile.jpg');
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || 'https://www.linkedin.com/in/kartheek-badabagni-950431323/');

  useEffect(() => {
    setName(profile.name);
    setRollNo(profile.rollNo);
    setBranch(profile.branch);
    setSection(profile.section);
    setEmail(profile.email);
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
      email,
      facultyName,
      designation,
      collegeName,
      labIncharge: designation,
      avatar,
      linkedinUrl,
    });
    setIsEditing(false);
    addToast('Student & Academic details updated ✓');
  };

  const completedExps = experiments.filter((e) => e.status === 'completed').length;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 shadow-md overflow-hidden transition-all duration-300">
      
      {/* Decorative Gradient Banner Top */}
      <div className="h-28 sm:h-36 bg-gradient-to-r from-[#0B2538] via-[#009F9A] to-[#2563EB] relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-black/20 blur-2xl pointer-events-none" />
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
            DS LAB STUDENT PORTAL
          </span>
        </div>
      </div>

      <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 -mt-14 relative z-10">
        
        {/* Main Row: Avatar + Details + Edit Trigger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E3EDF2] dark:border-slate-800">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* Uploadable Large Avatar */}
            <div className="relative group shrink-0">
              <img
                src={profile.avatar || avatar || '/kartheek_profile.jpg'}
                alt={name || profile.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover object-top ring-4 ring-white dark:ring-[#0D1E2A] shadow-xl bg-slate-800"
              />
              <label 
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-xs font-bold text-white backdrop-blur-xs"
                title="Upload Profile Picture"
              >
                <Upload className="w-6 h-6 mb-1 text-cyan-300 animate-bounce" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>

            {/* Student Identity Headers */}
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2538] dark:text-white capitalize">
                  {profile.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DFF8F7] text-[#009F9A] dark:bg-[#009F9A]/20 dark:text-[#14B8A6]">
                  Active Student
                </span>
              </div>

              <p className="text-sm font-mono text-[#009F9A] font-bold">
                Roll No: {profile.rollNo}
              </p>

              <p className="text-xs text-[#009F9A] dark:text-[#14B8A6] font-semibold flex items-center justify-center sm:justify-start gap-1">
                <School className="w-3.5 h-3.5" />
                <span>{profile.collegeName || 'Mohan Babu University'}</span>
              </p>

              <p className="text-xs text-gray-500 dark:text-slate-400">
                Department of {profile.branch} • Section {profile.section}
              </p>

              <div className="flex items-center justify-center sm:justify-start pt-1">
                <a
                  href={profile.linkedinUrl || 'https://www.linkedin.com/in/kartheek-badabagni-950431323/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[#009F9A] dark:text-cyan-400 border border-teal-200 dark:border-teal-800 text-[11px] font-mono font-semibold transition-all hover:bg-teal-100 dark:hover:bg-teal-900/60 cursor-pointer shadow-2xs"
                  title="Open LinkedIn Profile"
                >
                  <span>in/kartheek-badabagni-950431323</span>
                  <ExternalLink className="w-3 h-3 text-[#009F9A] dark:text-cyan-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#009F9A] to-[#14B8A6] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#009F9A]/20 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Close Editor' : 'Edit Details'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('profile')}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-[#009F9A] dark:hover:border-teal-500 bg-white dark:bg-slate-800/80 hover:bg-teal-50/50 dark:hover:bg-slate-800 text-xs font-semibold text-gray-700 hover:text-[#009F9A] dark:text-slate-200 dark:hover:text-teal-300 transition-all flex items-center gap-1.5 shadow-2xs group cursor-pointer"
            >
              <span>View Full Profile</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#009F9A] dark:group-hover:text-teal-300 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>

        {/* Academic Faculty & Lab Information Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
          
          {/* College Name */}
          <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-900/40 border border-[#E3EDF2] dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1.5">
              <School className="w-4 h-4" />
              <span>College Name</span>
            </div>
            <div className="font-extrabold text-sm text-[#0B2538] dark:text-white line-clamp-1">
              {profile.collegeName || 'Mohan Babu University'}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
              Campus Affiliation
            </p>
          </div>

          {/* Faculty / Advisor */}
          <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-900/40 border border-[#E3EDF2] dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Faculty Advisor</span>
            </div>
            <div className="font-extrabold text-sm text-[#0B2538] dark:text-white line-clamp-1">
              {profile.facultyName || 'S Bosubabu'}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
              Data Science Department
            </p>
          </div>

          {/* Designation (replaces Lab Incharge) */}
          <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-900/40 border border-[#E3EDF2] dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
              <Briefcase className="w-4 h-4" />
              <span>Designation</span>
            </div>
            <div className="font-extrabold text-sm text-[#0B2538] dark:text-white line-clamp-1">
              {profile.designation || profile.labIncharge || 'Assistant Professor'}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
              Lab &amp; Academic Role
            </p>
          </div>

          {/* Enrolled Academic Branch & Section */}
          <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-900/40 border border-[#E3EDF2] dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#009F9A] mb-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Academic Cohort</span>
            </div>
            <div className="font-extrabold text-sm text-[#0B2538] dark:text-white">
              {profile.branch} • Sec {profile.section}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
              Roll: {profile.rollNo}
            </p>
          </div>

          {/* Progress & Completion Metrics */}
          <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-900/40 border border-[#E3EDF2] dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
              <Award className="w-4 h-4" />
              <span>Curriculum Progress</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-extrabold text-sm text-[#0B2538] dark:text-white">
                {completedExps} of {experiments.length} Done
              </span>
              <span className="text-xs font-bold text-[#009F9A]">{profile.overallProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#009F9A] to-[#2563EB] rounded-full" 
                style={{ width: `${profile.overallProgress}%` }} 
              />
            </div>
          </div>

        </div>

        {/* Inline Edit Form Drawer */}
        {isEditing && (
          <form 
            onSubmit={handleSaveProfile} 
            className="mt-2 p-5 rounded-2xl bg-[#F6FAFC] dark:bg-slate-900/80 border border-[#E3EDF2] dark:border-slate-800 space-y-4 animate-in fade-in text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-slate-800">
              <span className="font-bold text-sm text-[#0B2538] dark:text-white">
                Edit Student &amp; Faculty Information
              </span>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0B2538] dark:text-white text-xs outline-none focus:border-[#009F9A]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0B2538] dark:text-white text-xs font-mono outline-none focus:border-[#009F9A]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0B2538] dark:text-white text-xs outline-none focus:border-[#009F9A]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Section
                </label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0B2538] dark:text-white text-xs outline-none focus:border-[#009F9A]"
                />
              </div>
            </div>

            {/* College Name Input */}
            <div className="pt-1">
              <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                College / Institution Name
              </label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. Mohan Babu University"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0B2538] dark:text-white text-xs outline-none focus:border-sky-500"
              />
            </div>

            {/* Faculty & Designation inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Faculty Advisor Name
                </label>
                <input
                  type="text"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  placeholder="e.g. S Bosubabu"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0B2538] dark:text-white text-xs outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Assistant Professor"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0B2538] dark:text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/kartheek-badabagni-950431323/"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0B2538] dark:text-white text-xs outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#009F9A] to-[#14B8A6] text-white font-bold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Details</span>
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};
