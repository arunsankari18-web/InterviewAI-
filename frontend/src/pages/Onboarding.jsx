import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../services/api';
import {
  GraduationCap,
  Building2,
  Briefcase,
  Code2,
  FileText,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  Sparkles
} from 'lucide-react';

const COMMON_COMPANIES = ['Zoho Corporation', 'TCS Digital', 'Amazon', 'Accenture', 'Infosys SP', 'Cognizant', 'Capgemini', 'Microsoft'];
const COMMON_ROLES = ['Software Development Engineer', 'Full Stack Developer', 'Frontend Engineer', 'Backend Specialist', 'Data Analyst', 'Cloud Engineer'];
const COMMON_SKILLS = ['Data Structures', 'Algorithms', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'DBMS', 'OOP', 'System Design'];

export const DEGREE_OPTIONS = [
  'B.Tech',
  'B.E.',
  'B.Tech / B.E.',
  'B.Sc Computer Science / IT',
  'BCA',
  'M.Tech',
  'M.E.',
  'MCA',
  'M.Sc Data Science / CS',
  'MBA (Tech / Systems)',
  'Ph.D / Dual Degree',
  'Other'
];

export const DEPARTMENT_OPTIONS = [
  'Information Technology',
  'Computer Science and Engineering',
  'Artificial Intelligence & Data Science',
  'Artificial Intelligence & Machine Learning',
  'Computer Science & Business Systems',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Mechatronics',
  'Biotechnology',
  'Data Science & Analytics',
  'Other / Interdisciplinary'
];

export const GRADUATION_YEAR_OPTIONS = [
  { value: 2024, label: '2024 (Immediate Placement)' },
  { value: 2025, label: '2025 (Immediate Placement)' },
  { value: 2026, label: '2026 (Upcoming Placement)' },
  { value: 2027, label: '2027 (Upcoming Placement)' },
  { value: 2028, label: '2028 (Pre-Final Year)' },
  { value: 2029, label: '2029 (Second Year)' },
  { value: 2030, label: '2030 (First Year)' },
  { value: 2023, label: '2023 or Earlier (Experienced / Alumnus)' }
];

export function Onboarding() {
  const { user, profile, updateProfileState } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [college, setCollege] = useState(profile?.college || 'National Engineering College');
  const [degree, setDegree] = useState(profile?.degree || 'B.Tech');
  const [department, setDepartment] = useState(profile?.department || 'Information Technology');
  const [graduationYear, setGraduationYear] = useState(profile?.graduationYear || 2026);
  const [preferredDifficulty, setPreferredDifficulty] = useState(profile?.preferredDifficulty || 'Medium');

  const [selectedCompanies, setSelectedCompanies] = useState(profile?.targetCompanies?.length ? profile.targetCompanies : ['Zoho Corporation', 'TCS Digital']);
  const [selectedRoles, setSelectedRoles] = useState(profile?.targetRoles?.length ? profile.targetRoles : ['Software Development Engineer']);
  const [selectedSkills, setSelectedSkills] = useState(profile?.skills?.length ? profile.skills : ['Data Structures', 'React', 'SQL']);

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeParsed, setResumeParsed] = useState(null);

  const [saving, setSaving] = useState(false);

  const toggleCompany = (comp) => {
    setSelectedCompanies(prev => prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp]);
  };

  const toggleRole = (role) => {
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    setResumeLoading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await profileApi.uploadResume(formData);
      setResumeParsed(res.data.parsedData);
      if (res.data.parsedData.skills?.length) {
        setSelectedSkills(prev => Array.from(new Set([...prev, ...res.data.parsedData.skills])));
      }
    } catch (err) {
      console.warn('Resume parse notice:', err.message);
    } finally {
      setResumeLoading(false);
    }
  };

  const handleFinishOnboarding = async () => {
    setSaving(true);
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
      navigate('/app/command-center');
    } catch (err) {
      navigate('/app/command-center');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-studio-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-brand-50 border border-brand-200 text-brand-800 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Placement Profile Initialization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Welcome, {user?.name || 'Candidate'}! Let’s personalize your preparation.
          </h1>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Interview AI customizes question difficulty, company blueprints, and resume cross-examination based on your profile.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-8 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
          {[
            { num: 1, label: 'Academics & Roles' },
            { num: 2, label: 'Target Companies' },
            { num: 3, label: 'Resume & Skills' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className="flex items-center space-x-2 text-xs font-semibold"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                step === s.num
                  ? 'bg-brand-500 text-white shadow-sm'
                  : step > s.num
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={step === s.num ? 'text-slate-900 font-bold' : 'text-slate-500 hidden sm:inline'}>
                {s.label}
              </span>
            </button>
          ))}
        </div>

        {/* Form Body Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* STEP 1: Academics & Target Role */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-base font-display font-bold text-slate-900 flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-brand-600" />
                <span>Academic & Career Targets</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. National Engineering College"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Degree</label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
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
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
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
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
                  >
                    {GRADUATION_YEAR_OPTIONS.map((yr) => (
                      <option key={yr.value} value={yr.value}>{yr.label}</option>
                    ))}
                  </select>
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
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-brand-50 text-brand-900 border-brand-300 font-semibold shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all"
                >
                  <span>Next: Target Companies</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Target Companies & Difficulty */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-base font-display font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-brand-600" />
                <span>Target Placement Companies</span>
              </h2>

              <p className="text-xs text-slate-500">
                Select the companies you are preparing for. Interview AI generates targeted interview blueprints and questions for these drives.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {COMMON_COMPANIES.map((comp) => {
                  const isSelected = selectedCompanies.includes(comp);
                  return (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => toggleCompany(comp)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'bg-brand-50 border-brand-400 text-brand-900 font-semibold shadow-sm ring-1 ring-brand-400/30'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-base">🏢</span>
                      <span className="leading-snug">{comp}</span>
                      {isSelected ? (
                        <span className="text-[10px] text-brand-700 font-bold">Selected ✓</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Click to add</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Baseline Interview Difficulty</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setPreferredDifficulty(diff)}
                      className={`py-2 px-3 text-xs rounded-xl border font-semibold text-center transition-all ${
                        preferredDifficulty === diff
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-2"
                >
                  <span>Next: Resume & Skills</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Resume & Skills */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-base font-display font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>Upload Resume & Confirm Technical Skills</span>
              </h2>

              {/* Resume Dropzone */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/70 transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-800">
                  {resumeFile ? resumeFile.name : 'Upload your PDF or Text Resume'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Interview AI extracts projects and technologies to conduct realistic **Resume Defense** sessions.
                </p>
                {resumeLoading && (
                  <p className="text-xs text-brand-600 font-semibold mt-2 animate-pulse">
                    Parsing technical claims and frameworks from resume...
                  </p>
                )}
              </div>

              {resumeParsed && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resume claims parsed successfully!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">{resumeParsed.rawSummary}</p>
                </div>
              )}

              {/* Skills Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Technical Skills & Focus Areas</label>
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
                            ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleFinishOnboarding}
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-sm hover:shadow transition-all disabled:opacity-60"
                >
                  {saving ? <span>Launching Command Center...</span> : (
                    <>
                      <span>Enter Command Center</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
