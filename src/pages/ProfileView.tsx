import React, { useState, useEffect } from 'react';
import { User, UserProfile, SkillItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User as UserIcon, Save, Plus, Trash2, CheckCircle2, Award, BookOpen, Briefcase } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, profile, updateProfileState } = useAuth();
  const [degree, setDegree] = useState(profile?.degree || 'B.Tech Computer Science');
  const [university, setUniversity] = useState(profile?.university || 'Apex Institute of Technology');
  const [graduationYear, setGraduationYear] = useState(profile?.graduation_year || '2026');
  const [experienceLevel, setExperienceLevel] = useState(profile?.experience_level || 'Student');
  const [targetRole, setTargetRole] = useState(profile?.target_role || 'AI/ML Engineer');
  const [targetIndustry, setTargetIndustry] = useState(profile?.target_industry || 'Artificial Intelligence & Software');
  const [bio, setBio] = useState(profile?.bio || '');
  const [fullName, setFullName] = useState(profile?.full_name || user?.full_name || '');

  // Skills
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setDegree(profile.degree);
      setUniversity(profile.university);
      setGraduationYear(profile.graduation_year);
      setExperienceLevel(profile.experience_level);
      setTargetRole(profile.target_role);
      setTargetIndustry(profile.target_industry);
      setBio(profile.bio);
      setFullName(profile.full_name);
    }
    api.getUserSkills().then(setSkills).catch(console.error);
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const updated = await api.updateProfile({
        degree,
        university,
        graduation_year: graduationYear,
        experience_level: experienceLevel,
        target_role: targetRole,
        target_industry: targetIndustry,
        bio,
        full_name: fullName
      });
      updateProfileState(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      const added = await api.addUserSkill(newSkillName.trim(), newSkillProficiency);
      setSkills(prev => [...prev, added]);
      setNewSkillName('');
    } catch (err) {
      console.error('Failed to add skill:', err);
    }
  };

  return (
    <div id="careeriq-profile-view" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Candidate Profile</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Verified Track
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Manage your educational background, target career roles, and verified technical competencies</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Profile Updated Successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 pb-2 border-b border-slate-100">
              <UserIcon className="w-4 h-4" />
              General Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Academic Background */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 pt-2 pb-2 border-b border-slate-100">
              <BookOpen className="w-4 h-4" />
              Academic Background
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">University / College</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Degree & Major</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Student">Student (Pre-Final/Final)</option>
                  <option value="Fresher">Fresher (0-1 yr)</option>
                  <option value="Junior">Junior (1-2 yrs)</option>
                  <option value="Mid-Level">Mid-Level (2-4 yrs)</option>
                </select>
              </div>
            </div>

            {/* Target Career Track */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 pt-2 pb-2 border-b border-slate-100">
              <Briefcase className="w-4 h-4" />
              Target Career Goals
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Cloud/DevOps Engineer">Cloud/DevOps Engineer</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Industry</label>
                <input
                  type="text"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Summary / Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Summarize your engineering journey, key interests, and portfolio focus..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>

          </form>
        </div>

        {/* Right 1 Col: Verified Technical Skills Inventory */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Skill Inventory</h3>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {skills.length} Detected
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Skills extracted from uploaded resumes and manual verifications.
            </p>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700">Add Technical Skill</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Docker, PyTorch"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newSkillProficiency}
                  onChange={(e: any) => setNewSkillProficiency(e.target.value)}
                  className="text-[11px] px-2 py-1.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Beginner">Beg</option>
                  <option value="Intermediate">Int</option>
                  <option value="Advanced">Adv</option>
                </select>
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Skills Badges List */}
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                >
                  <span>{skill.name}</span>
                  <span className="text-[9px] text-slate-400 font-mono">({skill.proficiency || 'Int'})</span>
                </span>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
