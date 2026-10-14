import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resumeDefenseApi, profileApi } from '../services/api';
import {
  ShieldCheck,
  FileText,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  Plus,
  X,
  Check,
  ArrowRight,
  Sparkles,
  Send,
  Layers,
  ChevronRight,
  RefreshCw,
  FolderPlus
} from 'lucide-react';

import { recordRecentAccess } from '../components/common/RecentlyAccessedDrawer';

export function ResumeDefense() {
  const { user, profile, updateProfileState } = useAuth();
  const [resumeData, setResumeData] = useState(profile?.resumeParsedData || null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  const [uploadTab, setUploadTab] = useState('file'); // 'file' | 'paste'
  const [pastedResumeText, setPastedResumeText] = useState('');

  // Skills Editing state
  const [newSkillInput, setNewSkillInput] = useState('');

  // Claims Editing state
  const [editingClaimId, setEditingClaimId] = useState(null);
  const [editClaimText, setEditClaimText] = useState('');
  const [editClaimTech, setEditClaimTech] = useState('');
  const [showAddClaimForm, setShowAddClaimForm] = useState(false);
  const [newClaimText, setNewClaimText] = useState('');
  const [newClaimTech, setNewClaimTech] = useState('');
  const [newClaimCategory, setNewClaimCategory] = useState('project');

  // Active Defense Session state
  const [defenseId, setDefenseId] = useState(null);
  const [currentInterrogation, setCurrentInterrogation] = useState(null);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credibilityMap, setCredibilityMap] = useState([]);
  const [unsupportedClaims, setUnsupportedClaims] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [interrogationHistory, setInterrogationHistory] = useState([]);

  useEffect(() => {
    recordRecentAccess({
      title: 'Resume Defense Studio',
      path: '/app/resume-defense',
      type: 'defense',
      icon: '🛡️'
    });

    if (profile?.resumeParsedData) {
      setResumeData(profile.resumeParsedData);
    }
  }, [profile]);

  // Clear feedback message automatically after 5 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // 1. File Upload Handler (PDF / TXT / DOCX)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFeedback(null);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await profileApi.uploadResume(formData);
      if (res.data?.success) {
        setResumeData(res.data.parsedData);
        if (res.data.profile) {
          updateProfileState(res.data.profile);
        }
        setFeedback({
          type: 'success',
          message: `Resume "${file.name}" uploaded successfully! Extracted ${res.data.parsedData?.skills?.length || 0} skills and ${res.data.parsedData?.projectClaims?.length || 0} project claims.`
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errMsg = err.response?.data?.error || err.message || 'Failed to parse resume file.';
      setFeedback({
        type: 'error',
        message: `Upload Failed: ${errMsg}`
      });
    } finally {
      setUploading(false);
      // reset file input
      e.target.value = '';
    }
  };

  // 2. Paste Resume Text Handler
  const handlePasteResumeUpload = async () => {
    if (!pastedResumeText.trim()) {
      setFeedback({ type: 'error', message: 'Please paste your resume text before analyzing.' });
      return;
    }

    setUploading(true);
    setFeedback(null);

    try {
      const res = await profileApi.uploadResumeText(pastedResumeText);
      if (res.data?.success) {
        setResumeData(res.data.parsedData);
        if (res.data.profile) {
          updateProfileState(res.data.profile);
        }
        setPastedResumeText('');
        setFeedback({
          type: 'success',
          message: `Resume text analyzed successfully! Extracted ${res.data.parsedData?.skills?.length || 0} skills and ${res.data.parsedData?.projectClaims?.length || 0} project claims.`
        });
      }
    } catch (err) {
      console.error('Paste analyze error:', err);
      const errMsg = err.response?.data?.error || err.message || 'Failed to analyze resume text.';
      setFeedback({ type: 'error', message: `Analysis Failed: ${errMsg}` });
    } finally {
      setUploading(false);
    }
  };

  // 3. Delete Entire Resume
  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete the uploaded resume and all extracted claims?')) {
      return;
    }

    try {
      const res = await profileApi.deleteResume();
      if (res.data?.success) {
        setResumeData(null);
        if (res.data.profile) {
          updateProfileState(res.data.profile);
        }
        setDefenseId(null);
        setCurrentInterrogation(null);
        setInterrogationHistory([]);
        setFeedback({ type: 'success', message: 'Resume and claims removed successfully.' });
      }
    } catch (err) {
      console.error('Delete error:', err);
      setFeedback({ type: 'error', message: 'Failed to delete resume.' });
    }
  };

  // 4. Skills Management (Delete & Add)
  const currentSkills = resumeData?.skills?.length
    ? resumeData.skills
    : (profile?.skills?.length ? profile.skills : ['React', 'Node.js', 'MongoDB', 'Python', 'SQL']);

  const handleDeleteSkill = async (skillToRemove) => {
    const updatedSkills = currentSkills.filter(s => s !== skillToRemove);
    try {
      const res = await profileApi.updateSkills(updatedSkills);
      if (res.data?.profile) {
        updateProfileState(res.data.profile);
        setResumeData(prev => ({
          ...(prev || {}),
          skills: updatedSkills
        }));
      }
    } catch (err) {
      console.error('Failed to remove skill:', err);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const clean = newSkillInput.trim();
    if (!clean) return;
    if (currentSkills.includes(clean)) {
      setNewSkillInput('');
      return;
    }

    const updatedSkills = [...currentSkills, clean];
    try {
      const res = await profileApi.updateSkills(updatedSkills);
      if (res.data?.profile) {
        updateProfileState(res.data.profile);
        setResumeData(prev => ({
          ...(prev || {}),
          skills: updatedSkills
        }));
      }
      setNewSkillInput('');
    } catch (err) {
      console.error('Failed to add skill:', err);
    }
  };

  // 5. Claims Management (Add, Edit, Delete)
  const claimsList = resumeData?.projectClaims || [];

  const handleStartEditClaim = (claim) => {
    setEditingClaimId(claim.claimId);
    setEditClaimText(claim.text);
    setEditClaimTech(Array.isArray(claim.techStack) ? claim.techStack.join(', ') : '');
  };

  const handleSaveEditClaim = async (claimId) => {
    if (!editClaimText.trim()) return;

    const techArray = editClaimTech
      .split(',')
      .map(t => t.trim().toUpperCase())
      .filter(Boolean);

    const updatedClaims = claimsList.map(c => {
      if (c.claimId === claimId) {
        return {
          ...c,
          text: editClaimText.trim(),
          techStack: techArray
        };
      }
      return c;
    });

    try {
      const res = await profileApi.updateResumeClaims(updatedClaims);
      if (res.data?.profile) {
        updateProfileState(res.data.profile);
        setResumeData(prev => ({
          ...(prev || {}),
          projectClaims: updatedClaims
        }));
      }
      // If the currently interrogated claim was edited, update its preview
      if (currentInterrogation && currentInterrogation.claimId === claimId) {
        setCurrentInterrogation(prev => ({
          ...prev,
          claimText: editClaimText.trim(),
          techStack: techArray
        }));
      }
      setEditingClaimId(null);
      setFeedback({ type: 'success', message: 'Project claim updated successfully.' });
    } catch (err) {
      console.error('Edit claim error:', err);
      setFeedback({ type: 'error', message: 'Failed to update claim.' });
    }
  };

  const handleDeleteClaim = async (claimId) => {
    try {
      const res = await profileApi.deleteResumeClaim(claimId);
      if (res.data?.profile) {
        updateProfileState(res.data.profile);
        setResumeData(prev => ({
          ...(prev || {}),
          projectClaims: (prev?.projectClaims || []).filter(c => c.claimId !== claimId)
        }));
      }
      // If currently interrogated claim was deleted, switch to next or finish
      if (currentInterrogation && currentInterrogation.claimId === claimId) {
        const remaining = claimsList.filter(c => c.claimId !== claimId);
        if (remaining.length > 0) {
          setCurrentInterrogation({
            claimId: remaining[0].claimId,
            claimText: remaining[0].text,
            techStack: remaining[0].techStack,
            question: `Explain your core implementation approach and technical trade-offs in: "${remaining[0].text}"`
          });
        } else {
          setCurrentInterrogation(null);
        }
      }
      setFeedback({ type: 'success', message: 'Claim removed from interrogation pool.' });
    } catch (err) {
      console.error('Delete claim error:', err);
      setFeedback({ type: 'error', message: 'Failed to delete claim.' });
    }
  };

  const handleAddNewClaim = async (e) => {
    e.preventDefault();
    if (!newClaimText.trim()) {
      alert('Please enter a project description or claim.');
      return;
    }

    try {
      const res = await profileApi.addResumeClaim({
        text: newClaimText.trim(),
        techStack: newClaimTech,
        category: newClaimCategory
      });

      if (res.data?.profile) {
        updateProfileState(res.data.profile);
        setResumeData(prev => ({
          ...(prev || {}),
          projectClaims: res.data.claims || [...(prev?.projectClaims || []), res.data.newClaim]
        }));
      }
      setNewClaimText('');
      setNewClaimTech('');
      setShowAddClaimForm(false);
      setFeedback({ type: 'success', message: 'Custom project claim added successfully.' });
    } catch (err) {
      console.error('Add claim error:', err);
      setFeedback({ type: 'error', message: 'Failed to add custom claim.' });
    }
  };

  // Switch Interrogation directly to a specific claim
  const handleInterrogateSpecificClaim = (claim) => {
    setDefenseId(defenseId || `rd-manual-${Date.now()}`);
    setIsFinished(false);
    setCurrentInterrogation({
      claimId: claim.claimId,
      claimText: claim.text,
      techStack: claim.techStack || [],
      question: `Your resume highlights: "${claim.text}". In a production deployment, what was the primary architectural bottleneck with ${claim.techStack?.[0] || 'your core stack'}, and how did you resolve it?`
    });
    setCandidateAnswer('');
  };

  // 6. Start / Submit Defense Handlers
  const handleStartDefense = async () => {
    try {
      const res = await resumeDefenseApi.initiate();
      const { defenseId: dId, firstInterrogation } = res.data;
      setDefenseId(dId);
      setCurrentInterrogation(firstInterrogation);
      setIsFinished(false);
      setInterrogationHistory([]);
    } catch (err) {
      alert('Could not start Resume Defense session. Please ensure your resume or skills are loaded.');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!candidateAnswer.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await resumeDefenseApi.submitInterrogation(defenseId, {
        claimId: currentInterrogation.claimId,
        question: currentInterrogation.question,
        userAnswer: candidateAnswer
      });

      const { evaluation, credibilityMap: updatedMap, unsupportedClaims: unsupp, nextInterrogation, isFinished: finished } = res.data;

      setInterrogationHistory(prev => [
        ...prev,
        {
          claim: currentInterrogation.claimText,
          question: currentInterrogation.question,
          answer: candidateAnswer,
          evaluation
        }
      ]);

      setCredibilityMap(updatedMap || []);
      setUnsupportedClaims(unsupp || []);
      setCandidateAnswer('');

      if (finished || !nextInterrogation) {
        setIsFinished(true);
        setCurrentInterrogation(null);
      } else {
        setCurrentInterrogation(nextInterrogation);
      }
    } catch (err) {
      alert('Failed to evaluate defense answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasUploadedResume = Boolean(profile?.resumeFileName || resumeData?.rawSummary || resumeData?.projectClaims?.length);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Resume Defense & Architecture Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Defend Your Resume Projects & Tech Stack
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-examination of resume projects, technology choices, architectural trade-offs, and failure recovery.
          </p>
        </div>

        {!defenseId && (
          <button
            onClick={handleStartDefense}
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center space-x-2 self-start sm:self-auto"
          >
            <span>Start Resume Defense Interrogation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Global Toast / Feedback Notification */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between border text-xs font-medium animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload, Resume Status, Skills & Credibility */}
        <div className="space-y-6">
          {/* Target Resume & Claims Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Target Resume & Claims
              </h2>
              {hasUploadedResume && (
                <button
                  type="button"
                  onClick={handleDeleteResume}
                  title="Delete Resume & Reset Claims"
                  className="inline-flex items-center space-x-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Resume</span>
                </button>
              )}
            </div>

            {/* Currently Active Resume Badge */}
            {hasUploadedResume && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {profile?.resumeFileName || 'Candidate_Resume.pdf'}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      <span>Parsed & Active in Audit</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Method Tabs */}
            <div className="flex border-b border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUploadTab('file')}
                className={`flex-1 pb-2 text-center transition-colors ${
                  uploadTab === 'file'
                    ? 'border-b-2 border-brand-500 text-brand-600'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Upload PDF / File
              </button>
              <button
                type="button"
                onClick={() => setUploadTab('paste')}
                className={`flex-1 pb-2 text-center transition-colors ${
                  uploadTab === 'paste'
                    ? 'border-b-2 border-brand-500 text-brand-600'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Paste Resume Text
              </button>
            </div>

            {/* Tab 1: File Upload Box */}
            {uploadTab === 'file' && (
              <div className="border-2 border-dashed border-brand-200 rounded-xl p-4 text-center bg-brand-50/30 hover:bg-brand-50/70 transition-colors relative cursor-pointer group">
                <input
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <UploadCloud className="w-7 h-7 text-brand-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800">
                  {uploading ? 'Parsing PDF resume...' : hasUploadedResume ? 'Replace / Update Resume PDF' : 'Upload Resume PDF'}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Click or drag PDF (.pdf, .txt)</p>
              </div>
            )}

            {/* Tab 2: Paste Resume Text Box */}
            {uploadTab === 'paste' && (
              <div className="space-y-2">
                <textarea
                  value={pastedResumeText}
                  onChange={(e) => setPastedResumeText(e.target.value)}
                  placeholder="Paste your resume content, project descriptions, or skills here..."
                  rows={4}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={handlePasteResumeUpload}
                  disabled={uploading || !pastedResumeText.trim()}
                  className="w-full py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-all flex items-center justify-center space-x-1.5"
                >
                  {uploading ? (
                    <span>Analyzing text...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze & Extract Claims</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Extracted Skills Section with Edit & Delete */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Extracted Skill Tags:</span>
                <span className="text-[10px] text-slate-400">{currentSkills.length} skills</span>
              </div>

              {/* Skill Tags List with Delete (x) Button */}
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {currentSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="group inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 transition-colors"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill)}
                      title={`Remove ${skill}`}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add New Skill Input */}
              <form onSubmit={handleAddSkill} className="flex items-center space-x-1.5 pt-1">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  placeholder="Add custom skill (e.g. Docker)..."
                  className="flex-1 px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={!newSkillInput.trim()}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </form>
            </div>
          </div>

          {/* Live Resume Credibility Map */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Resume Credibility Map</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">Live Audit</span>
            </div>

            <div className="space-y-2 pt-1">
              {(credibilityMap.length > 0
                ? credibilityMap
                : [
                    { skillOrTech: 'React / Frontend', status: 'Explained well', notes: 'Demonstrated clear lifecycle & Virtual DOM ownership.' },
                    { skillOrTech: 'MongoDB / Database', status: 'Partially explained', notes: 'Basic schema design explained; missed sharding trade-offs.' },
                    { skillOrTech: 'Redis Caching', status: 'Needs deeper understanding', notes: 'Conceptual awareness; unable to articulate eviction policies.' }
                  ]
              ).map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{item.skillOrTech}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Explained well'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Partially explained'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'Needs deeper understanding'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  {item.notes && <p className="text-[11px] text-slate-500 leading-snug">{item.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Active Interrogation Panel + Resume Claims List with Edit/Delete */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Interrogation Panel */}
          {defenseId && !isFinished && currentInterrogation ? (
            <div className="bg-white border border-brand-200 rounded-2xl p-6 shadow-sm space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-800 px-2.5 py-0.5 rounded-md">
                  Active Claim Under Interrogation
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Tech: {currentInterrogation.techStack?.join(', ') || 'System Architecture'}
                </span>
              </div>

              {/* The Claim */}
              <div className="p-3.5 bg-slate-50 border-l-4 border-brand-500 rounded-r-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Claim written on resume:
                </span>
                <p className="text-xs font-semibold text-slate-800 italic">
                  "{currentInterrogation.claimText}"
                </p>
              </div>

              {/* Cross-Question Prompt */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Interviewer Cross-Question:</span>
                <h3 className="text-base sm:text-lg font-display font-bold text-brand-900 leading-snug">
                  "{currentInterrogation.question}"
                </h3>
              </div>

              {/* Defense Input Area */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Your Technical Defense & Architectural Explanation:
                </label>
                <textarea
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Explain why you chose this technology, how you benchmarked alternatives, and how your architecture handles failovers and scaling bottlenecks..."
                  rows={5}
                  className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed font-sans"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isSubmitting || !candidateAnswer.trim()}
                    onClick={handleSubmitAnswer}
                    className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center space-x-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Evaluating architectural depth...</span>
                    ) : (
                      <>
                        <span>Submit Defense & Next Claim</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
              <ShieldCheck className="w-12 h-12 text-brand-600 mx-auto" />
              <h2 className="text-lg font-display font-bold text-slate-900">
                {isFinished ? 'Resume Defense Session Completed!' : 'Ready to Test Your Resume Claims?'}
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Placement interviewers aggressively cross-examine every library, framework, and database listed on your resume. You can edit, add, or delete claims below, or click below to launch the defense session.
              </p>
              <button
                onClick={handleStartDefense}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <span>{isFinished ? 'Start Another Defense Session' : 'Initiate Defense Interrogation'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Core Feature: Resume Claims & Projects Management (Full Edit & Delete) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-display font-bold text-slate-900 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-brand-600" />
                  <span>Resume Projects & Claims Pool ({claimsList.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  You can edit claims, delete claims, or add your custom projects to simulate real interview cross-questioning.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddClaimForm(!showAddClaimForm)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-xl text-xs font-semibold transition-all self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddClaimForm ? 'Cancel' : 'Add Custom Project / Claim'}</span>
              </button>
            </div>

            {/* Inline Add Claim Form */}
            {showAddClaimForm && (
              <form onSubmit={handleAddNewClaim} className="p-4 bg-slate-50 border border-brand-200 rounded-xl space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Add New Project or Architecture Claim</span>
                  <button type="button" onClick={() => setShowAddClaimForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Project / Claim Description:
                  </label>
                  <textarea
                    value={newClaimText}
                    onChange={(e) => setNewClaimText(e.target.value)}
                    placeholder="e.g. Developed an e-commerce platform using Node.js, Express, and Redis caching with Stripe payment integration..."
                    rows={2}
                    className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Technologies Used (comma separated):
                    </label>
                    <input
                      type="text"
                      value={newClaimTech}
                      onChange={(e) => setNewClaimTech(e.target.value)}
                      placeholder="e.g. React, Node.js, MongoDB"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Category:
                    </label>
                    <select
                      value={newClaimCategory}
                      onChange={(e) => setNewClaimCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="project">Project Claim</option>
                      <option value="technology">Technology & Database</option>
                      <option value="architecture">System Architecture</option>
                      <option value="skill">Core Skill</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddClaimForm(false)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold shadow-sm"
                  >
                    Save Project Claim
                  </button>
                </div>
              </form>
            )}

            {/* Claims List */}
            {claimsList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">No resume claims found. Upload a resume or click "Add Custom Project" above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {claimsList.map((claim, idx) => {
                  const isEditing = editingClaimId === claim.claimId;
                  const isCurrent = currentInterrogation?.claimId === claim.claimId;

                  return (
                    <div
                      key={claim.claimId || idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-brand-50/40 border-brand-300 ring-1 ring-brand-300'
                          : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isEditing ? (
                        /* Inline Edit Form */
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Edit Project Claim #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => setEditingClaimId(null)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Claim Text:</label>
                            <textarea
                              value={editClaimText}
                              onChange={(e) => setEditClaimText(e.target.value)}
                              rows={2}
                              className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Technologies (comma-separated):</label>
                            <input
                              type="text"
                              value={editClaimTech}
                              onChange={(e) => setEditClaimTech(e.target.value)}
                              className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                            />
                          </div>
                          <div className="flex justify-end space-x-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingClaimId(null)}
                              className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEditClaim(claim.claimId)}
                              className="inline-flex items-center space-x-1 px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded text-xs font-semibold"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save Changes</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal Claim View */
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-200/80 text-slate-700 rounded">
                                {claim.category || 'project'}
                              </span>
                              {claim.techStack?.map((t, ti) => (
                                <span
                                  key={ti}
                                  className="text-[10px] font-semibold px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-200/50 rounded"
                                >
                                  {t}
                                </span>
                              ))}
                              {isCurrent && (
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center space-x-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  <span>Now Interrogating</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-medium text-slate-800 leading-relaxed">
                              "{claim.text}"
                            </p>
                          </div>

                          {/* Action Buttons: Defend, Edit, Delete */}
                          <div className="flex items-center space-x-1.5 self-end sm:self-start pt-1 sm:pt-0">
                            <button
                              type="button"
                              onClick={() => handleInterrogateSpecificClaim(claim)}
                              title="Test & Interrogate this claim directly"
                              className="px-2.5 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[11px] font-semibold shadow-xs transition-colors flex items-center space-x-1"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>Defend</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartEditClaim(claim)}
                              title="Edit claim description or tech stack"
                              className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-white rounded-lg border border-slate-200 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteClaim(claim.claimId)}
                              title="Delete this claim"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interrogation History & Feedback Log */}
          {interrogationHistory.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-display font-bold text-slate-900">
                Interrogation Defense Transcript & Scoring
              </h3>

              <div className="space-y-3">
                {interrogationHistory.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Question {idx + 1}: {item.question}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.evaluation.verdict === 'Explained well'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.evaluation.verdict} ({item.evaluation.technicalDepthScore}%)
                      </span>
                    </div>
                    <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 text-[11px] leading-relaxed">
                      "{item.answer}"
                    </p>
                    <div className="text-[11px] text-brand-900 font-medium">
                      💡 {item.evaluation.feedback}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
