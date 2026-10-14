import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../services/api';
import { DEGREE_OPTIONS, DEPARTMENT_OPTIONS, GRADUATION_YEAR_OPTIONS } from './Onboarding';
import {
  UserCheck,
  GraduationCap,
  Building2,
  Briefcase,
  FileText,
  Save,
  CheckCircle2,
  UploadCloud,
  Sparkles
} from 'lucide-react';

const COMMON_COMPANIES = ['Zoho Corporation', 'TCS Digital', 'Amazon', 'Accenture', 'Infosys SP', 'Cognizant', 'Capgemini', 'Microsoft'];
const COMMON_ROLES = ['Software Development Engineer', 'Full Stack Developer', 'Frontend Engineer', 'Backend Specialist', 'Data Analyst', 'Cloud Engineer'];
const COMMON_SKILLS = ['Data Structures', 'Algorithms', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'DBMS', 'OOP', 'System Design'];

export function ProfileSettings() {
  const { user, profile, updateProfileState } = useAuth();

  const [college, setCollege] = useState(profile?.college || '');
  const [degree, setDegree] = useState(profile?.degree || 'B.Tech / B.E.');
  const [department, setDepartment] = useState(profile?.department || 'Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState(profile?.graduationYear || 2026);
  const [preferredDifficulty, setPreferredDifficulty] = useState(profile?.preferredDifficulty || 'Medium');

  const [selectedCompanies, setSelectedCompanies] = useState(profile?.targetCompanies || ['Zoho Corporation', 'TCS Digital', 'Amazon']);
  const [selectedRoles, setSelectedRoles] = useState(profile?.targetRoles || ['Software Development Engineer']);
  const [selectedSkills, setSelectedSkills] = useState(profile?.skills || ['Data Structures', 'React', 'SQL']);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setCollege(profile.college || '');
      setDegree(profile.degree || 'B.Tech / B.E.');
      setDepartment(profile.department || 'Computer Science & Engineering');
      setGraduationYear(profile.graduationYear || 2026);
      setPreferredDifficulty(profile.preferredDifficulty || 'Medium');
      if (profile.targetCompanies?.length) setSelectedCompanies(profile.targetCompanies);
      if (profile.targetRoles?.length) setSelectedRoles(profile.targetRoles);
      if (profile.skills?.length) setSelectedSkills(profile.skills);
    }
  }, [profile]);

  const toggleCompany = (comp) => {
    setSelectedCompanies(prev => prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp]);
  };

  const toggleRole = (role) => {
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await profileApi.updateProfile({
        college,
        degree,
        department,
        graduationYear: Number(graduationYear),
        preferredDifficulty,
        targetCompanies: selectedCompanies,
        targetRoles: selectedRoles,
        skills: selectedSkills,
        onboardingCompleted: true
      });
      updateProfileState(res.data.profile);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update placement profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Profile & Placement Calibration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Candidate Profile & Targets
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your academic credentials, target companies, and skill tags for tailored interview simulations.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Academic Details Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-sm font-display font-bold text-slate-900 flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-brand-600" />
            <span>Academic Background</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Name</label>
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. National Institute of Technology"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree</label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium"
              >
                {DEGREE_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium"
              >
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium"
              >
                {GRADUATION_YEAR_OPTIONS.map((yr) => (
                  <option key={yr.value} value={yr.value}>{yr.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Target Companies & Roles */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-sm font-display font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>Target Placement Companies & Preferred Roles</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Target Companies</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_COMPANIES.map((comp) => {
                  const isSelected = selectedCompanies.includes(comp);
                  return (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => toggleCompany(comp)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl border font-semibold transition-all ${
                        isSelected
                          ? 'bg-brand-50 border-brand-300 text-brand-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && '✓ '}
                      {comp}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Target Roles</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_ROLES.map((role) => {
                  const isSelected = selectedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl border font-semibold transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && '✓ '}
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-sm font-display font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Confirmed Technical Skills</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {COMMON_SKILLS.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-brand-500 text-white border-brand-500 font-semibold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && '✓ '}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center space-x-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Placement Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
