import React, { useState, useEffect } from 'react';
import { useLab } from '../context/LabContext';
import { 
  Award, 
  CheckCircle2, 
  Upload, 
  Edit3, 
  Save, 
  X,
  UserCheck,
  School,
  Briefcase,
  GraduationCap,
  Building2,
  ExternalLink
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, experiments, projects, setCurrentTab, addToast } = useLab();
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(profile.name);
  const [rollNo, setRollNo] = useState(profile.rollNo);
  const [branch, setBranch] = useState(profile.branch);
  const [section, setSection] = useState(profile.section);
  const [email, setEmail] = useState(profile.email);
  const [collegeName, setCollegeName] = useState(profile.collegeName || 'Mohan Babu University');
  const [designation, setDesignation] = useState(profile.designation || 'Assistant Professor');
  const [facultyName, setFacultyName] = useState(profile.facultyName || 'S Bosubabu');
  const [avatar, setAvatar] = useState(profile.avatar || '/kartheek_profile.jpg');
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || 'https://www.linkedin.com/in/kartheek-badabagni-950431323/');

  useEffect(() => {
    setName(profile.name);
    setRollNo(profile.rollNo);
    setBranch(profile.branch);
    setSection(profile.section);
    setEmail(profile.email);
    setCollegeName(profile.collegeName || 'Mohan Babu University');
    setDesignation(profile.designation || 'Assistant Professor');
    setFacultyName(profile.facultyName || 'S Bosubabu');
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
          if (addToast) addToast('Profile photo updated successfully ✓');
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
      avatar,
      collegeName,
      designation,
      facultyName,
      labIncharge: designation,
      linkedinUrl,
    });
    setIsEditing(false);
    if (addToast) addToast('Profile details updated ✓');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      
      {/* Profile Card Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B2538] via-[#0F354F] to-[#0A1F2F] text-white border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#009F9A]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          
          {/* Avatar with photo upload capability */}
          <div className="relative group shrink-0">
            <img
              src={profile.avatar || avatar || '/kartheek_profile.jpg'}
              alt={profile.name}
              className="w-24 h-24 rounded-2xl object-cover object-top ring-4 ring-[#009F9A] shadow-lg"
            />
            <label className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[10px] font-bold text-white">
              <Upload className="w-5 h-5 mb-1 text-cyan-300" />
              <span>Change</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold capitalize">
                  {profile.name}
                </h2>
                <p className="text-xs font-mono text-cyan-300 font-semibold">
                  Roll No: {profile.rollNo}
                </p>
              </div>

              <div className="flex items-center gap-2 justify-center">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  Honors Standing • {profile.overallProgress}% Overall
                </span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1 border border-white/20 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Close' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>

            {/* College Name Prominent Badge */}
            <p className="text-xs sm:text-sm text-cyan-200/90 font-medium flex items-center gap-1.5 justify-center sm:justify-start">
              <School className="w-4 h-4 text-cyan-300 shrink-0" />
              <span>{profile.collegeName || 'Mohan Babu University'}</span>
            </p>

            <p className="text-xs sm:text-sm text-slate-300">
              Department of {profile.branch} • Section {profile.section} • Enrolled {profile.joinedDate}
            </p>

            {/* Social Profile Links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <a
                href={profile.linkedinUrl || 'https://www.linkedin.com/in/kartheek-badabagni-950431323/'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3 text-sky-300" />
              </a>
              <a
                href={profile.githubUrl || 'https://github.com/kartheek1717'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-600/40 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-3">
              <button
                onClick={() => setCurrentTab('experiments')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-md transition-colors"
              >
                🧪 Experiments ({experiments.length})
              </button>
              <button
                onClick={() => setCurrentTab('modules')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-md transition-colors"
              >
                📚 Modules
              </button>
              <button
                onClick={() => setCurrentTab('tools')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-md transition-colors"
              >
                🛠️ Tools
              </button>
              <button
                onClick={() => setCurrentTab('settings')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-md transition-colors"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>

        {/* Inline Profile Editing Drawer */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-5 border-t border-white/15 space-y-3 text-xs animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-bold mb-1">Roll Number</label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-bold mb-1">Branch</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">College Name</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. Mohan Babu University"
                className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Faculty Name</label>
                <input
                  type="text"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  placeholder="e.g. S Bosubabu"
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-bold mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Assistant Professor"
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Section</label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">LinkedIn Profile URL</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/kartheek-badabagni-950431323/"
                className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white outline-none font-mono text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl border border-white/20 text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#009F9A] text-white font-bold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Institutional & Academic Supervision Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* College Name Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1.5">
            <School className="w-4 h-4" />
            <span>College Name</span>
          </div>
          <div className="font-extrabold text-sm text-[#0B2538] dark:text-white">
            {profile.collegeName || 'Mohan Babu University'}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
            Campus Affiliation
          </p>
        </div>

        {/* Faculty Advisor */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>Faculty Name</span>
          </div>
          <div className="font-extrabold text-sm text-[#0B2538] dark:text-white line-clamp-1">
            {profile.facultyName || 'S Bosubabu'}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
            Department of {profile.branch}
          </p>
        </div>

        {/* Designation (replaced Lab Incharge) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <Briefcase className="w-4 h-4" />
            <span>Designation</span>
          </div>
          <div className="font-extrabold text-sm text-[#0B2538] dark:text-white line-clamp-1">
            {profile.designation || profile.labIncharge || 'Assistant Professor'}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
            Academic / Lab Designation
          </p>
        </div>
      </div>

      {/* Gamification Achievements Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1E2A] border border-[#E3EDF2] dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E3EDF2] dark:border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-[#0B2538] dark:text-white">
              Student Badges &amp; Achievements
            </h3>
          </div>
          <span className="text-xs text-[#009F9A] font-bold">
            {profile.achievements.filter((a) => a.isUnlocked).length} / {profile.achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all ${
                ach.isUnlocked
                  ? 'border-[#009F9A]/30 bg-gradient-to-br from-[#E4FAF8]/40 to-transparent dark:from-[#009F9A]/5 dark:to-transparent'
                  : 'border-gray-200 dark:border-slate-800 opacity-60 bg-gray-50 dark:bg-slate-900/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0">
                  {ach.icon}
                </span>
                <div>
                  <div className="font-bold text-sm text-[#0B2538] dark:text-white">
                    {ach.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {ach.description}
                  </div>
                  {ach.unlockedAt && (
                    <div className="text-[10px] text-[#009F9A] font-medium mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 3-3" /> Unlocked {ach.unlockedAt}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
