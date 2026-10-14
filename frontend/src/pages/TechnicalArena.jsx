import React, { useState, useEffect } from 'react';
import { technicalApi } from '../services/api';
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  ShieldAlert,
  Send,
  Sparkles,
  BookOpen,
  ArrowRight,
  Terminal,
  HelpCircle
} from 'lucide-react';

import { recordRecentAccess } from '../components/common/RecentlyAccessedDrawer';

export function TechnicalArena() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);

  // Execution & Test State
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);

  // Code Defense State
  const [defensePrompt, setDefensePrompt] = useState(null);
  const [defenseAnswer, setDefenseAnswer] = useState('');
  const [defenseScore, setDefenseScore] = useState(null);
  const [defenseFeedback, setDefenseFeedback] = useState(null);
  const [isDefending, setIsDefending] = useState(false);

  useEffect(() => {
    async function loadProblems() {
      try {
        const res = await technicalApi.getProblems({ category: categoryFilter });
        const list = res.data.problems || [];
        setProblems(list);
        if (list.length > 0) {
          selectProblem(list[0]);
        }
      } catch (err) {
        console.warn('Problems fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, [categoryFilter]);

  const selectProblem = (prob) => {
    setSelectedProblem(prob);
    setCode(prob.starterCode?.[language] || prob.starterCode?.javascript || '// Write solution here');
    setRunResult(null);
    setDefensePrompt(null);
    setDefenseScore(null);
    setDefenseFeedback(null);

    if (prob) {
      recordRecentAccess({
        title: `Code: ${prob.title}`,
        path: `/app/technical-arena`,
        type: 'coding',
        icon: '💻'
      });
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (selectedProblem?.starterCode?.[lang]) {
      setCode(selectedProblem.starterCode[lang]);
    }
  };

  const handleRunCode = async () => {
    if (!selectedProblem || !code.trim()) return;
    setIsRunning(true);
    setRunResult(null);
    setDefensePrompt(null);
    setDefenseScore(null);

    try {
      const res = await technicalApi.executeCode({
        problemId: selectedProblem.id,
        language,
        code
      });

      setRunResult(res.data.runResult);
      if (res.data.defensePrompt) {
        setDefensePrompt(res.data.defensePrompt);
      }
    } catch (err) {
      alert('Code execution error in sandbox.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitDefense = async () => {
    if (!defenseAnswer.trim() || !defensePrompt) return;
    setIsDefending(true);

    try {
      const res = await technicalApi.submitDefense({
        attemptId: 'att-live',
        question: defensePrompt.question,
        answer: defenseAnswer
      });

      setDefenseScore(res.data.score);
      setDefenseFeedback(res.data.feedback);
    } catch (err) {
      alert('Failed to evaluate code defense.');
    } finally {
      setIsDefending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 bg-slate-200 rounded-2xl" />
          <div className="h-96 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <Code2 className="w-3.5 h-3.5" />
            <span>Interactive Placement Code Arena</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Technical Arena
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real placement coding problems with test case validation and algorithmic design defense.
          </p>
        </div>

        {/* Category & Company Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
          {['All', 'Zoho', 'Amazon', 'TCS Digital', 'DSA', 'DBMS', 'CS Core', 'Web', 'Recommended'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'Recommended' ? '⭐ Recommended' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (5/12): Problems Selector & Problem Statement */}
        <div className="lg:col-span-5 space-y-5">
          {/* Problem Selector List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Placement Problem Set ({problems.length})
              </span>
              <span className="text-[10px] text-brand-600 font-semibold">{categoryFilter}</span>
            </div>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {problems.map((prob) => {
                const isSelected = selectedProblem?.id === prob.id;
                return (
                  <button
                    key={prob.id}
                    onClick={() => selectProblem(prob)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-brand-50 border border-brand-200 text-brand-900 font-bold shadow-xs'
                        : 'bg-slate-50/70 border border-slate-100 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="truncate font-semibold text-slate-900">{prob.title}</div>
                      {prob.companyTag && (
                        <div className="text-[10px] text-brand-600 font-medium truncate">
                          🏢 {prob.companyTag}
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold flex-shrink-0 ${
                      prob.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                      prob.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Problem Description */}
          {selectedProblem && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                  {selectedProblem.category} · {selectedProblem.subCategory}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Time Limit: {selectedProblem.timeLimitMs}ms
                </span>
              </div>

              <h2 className="text-lg font-display font-bold text-slate-900">
                {selectedProblem.title}
              </h2>

              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedProblem.description}
              </p>

              {/* Sample Test Cases */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Example Assertions:
                </span>
                <div className="space-y-2 font-mono text-[11px]">
                  {selectedProblem.testCases?.map((tc, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
                      <div><span className="text-slate-400">Input:</span> <span className="text-slate-800">{tc.input}</span></div>
                      <div><span className="text-slate-400">Expected:</span> <span className="text-emerald-700 font-semibold">{tc.expected}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col (7/12): Code Editor, Test Results, & Code Defense */}
        <div className="lg:col-span-7 space-y-5">
          {/* Editor Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md overflow-hidden flex flex-col">
            {/* Editor Toolbar */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-bold text-slate-200">Solution Workspace</span>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs font-mono px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none"
                >
                  <option value="javascript">JavaScript (ES6)</option>
                  <option value="python">Python 3</option>
                </select>

                <button
                  type="button"
                  disabled={isRunning}
                  onClick={handleRunCode}
                  className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm disabled:opacity-60"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isRunning ? 'Running Tests...' : 'Run Code'}</span>
                </button>
              </div>
            </div>

            {/* Codearea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              rows={14}
              className="w-full p-4 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none border-none selection:bg-brand-900"
            />
          </div>

          {/* Test Case Execution Output Box */}
          {runResult && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {runResult.allPassed ? (
                    <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>All Test Cases Passed!</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Test Cases Failed</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono text-slate-500">
                  <span>Exec: {runResult.executionTimeMs}ms</span>
                  <span>Time: {runResult.timeComplexity}</span>
                  <span>Space: {runResult.spaceComplexity}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
                {runResult.testResults?.map((tr) => (
                  <div key={tr.testIndex} className={`p-2.5 rounded-xl border text-[11px] ${
                    tr.passed ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-red-50/60 border-red-200 text-red-900'
                  }`}>
                    <div className="font-bold flex items-center justify-between">
                      <span>Test Case {tr.testIndex}</span>
                      <span>{tr.passed ? '✓ Passed' : '✗ Failed'}</span>
                    </div>
                    <div className="truncate text-slate-500 mt-1">Output: {tr.actual}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Defense Prompt (Solve -> Execute -> Explain -> Defend) */}
          {defensePrompt && (
            <div className="bg-gradient-to-br from-brand-50/80 via-white to-white border border-brand-200 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-brand-500 text-white px-2.5 py-0.5 rounded-md flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Code Defense Phase</span>
                </span>
                <span className="text-xs text-brand-800 font-semibold">{defensePrompt.instruction}</span>
              </div>

              <h3 className="text-sm font-display font-bold text-slate-900">
                "{defensePrompt.question}"
              </h3>

              <div className="space-y-2">
                <textarea
                  value={defenseAnswer}
                  onChange={(e) => setDefenseAnswer(e.target.value)}
                  placeholder="Defend your approach: articulate exact Big-O asymptotic bounds, data structure invariants, and why alternative methods were rejected..."
                  rows={3}
                  className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />

                <div className="flex items-center justify-between pt-1">
                  {defenseScore !== null ? (
                    <div className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Defense Rating: {defenseScore}% — {defenseFeedback}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400">Prove time & space complexity bounds.</div>
                  )}

                  <button
                    type="button"
                    disabled={isDefending || !defenseAnswer.trim()}
                    onClick={handleSubmitDefense}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-60"
                  >
                    {isDefending ? 'Scoring Defense...' : 'Submit Code Defense'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
