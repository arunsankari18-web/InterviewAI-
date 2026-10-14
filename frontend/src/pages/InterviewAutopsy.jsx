import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { autopsyApi, interviewApi } from '../services/api';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import {
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Mic,
  Award,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Play,
  RotateCcw,
  Building2,
  Calendar,
  Activity,
  Timer,
  Volume2,
  VolumeX,
  Square,
  Pause,
  UserCheck
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export function InterviewAutopsy() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [report, setReport] = useState(null);
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionsList, setSessionsList] = useState([]);
  const [playingAudioType, setPlayingAudioType] = useState(null); // 'question' | 'candidate' | null

  const speechTTS = useSpeechSynthesis();

  // Stop audio on tab change
  useEffect(() => {
    speechTTS.stop();
    setPlayingAudioType(null);
  }, [selectedTimelineIndex]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      speechTTS.stop();
    };
  }, []);

  const handlePlayAudio = (type, text) => {
    if (playingAudioType === type) {
      speechTTS.stop();
      setPlayingAudioType(null);
      return;
    }

    if (!text) return;

    speechTTS.stop();
    setPlayingAudioType(type);
    speechTTS.speak(text, {
      rate: type === 'candidate' ? 0.95 : 1.0,
      pitch: type === 'candidate' ? 1.05 : 0.95,
      onEnd: () => setPlayingAudioType(null)
    });
  };

  useEffect(() => {
    async function loadData() {
      try {
        const sessionsRes = await interviewApi.getSessions();
        const list = sessionsRes.data.sessions || [];
        setSessionsList(list);

        const targetId = sessionId || list[0]?.id;
        if (targetId) {
          const autopsyRes = await autopsyApi.getReport(targetId);
          setReport(autopsyRes.data.report);
        }
      } catch (err) {
        console.warn('Autopsy load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4 py-20">
        <FileSearch className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-display font-bold text-slate-900">No Completed Interview Sessions Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Complete your first mock interview in Interview Studio to generate a forensic breakdown report.
        </p>
        <div className="pt-2">
          <Link
            to="/app/interview-studio"
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold inline-flex items-center space-x-2"
          >
            <span>Launch Interview Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const overall = report.overallEvaluation || {};
  const behavior = report.behaviorMetrics || {};
  const questions = report.questionAnalysis || [];
  const timeline = report.replayTimeline || [];

  const activeQuestion = questions[selectedTimelineIndex] || questions[0];

  const durationStr = behavior.formattedDuration || (report.durationMinutes ? `${report.durationMinutes}m` : '15m 00s');
  const totalMins = behavior.durationMinutes || report.durationMinutes || 15;

  const scoreBars = [
    { name: 'Overall', score: overall.overallScore || 78 },
    { name: 'Technical', score: overall.technicalScore || 75 },
    { name: 'Communication', score: overall.communicationScore || 82 },
    { name: 'Problem Solving', score: overall.problemSolvingScore || 76 },
    { name: 'Company Fit', score: overall.companyFitScore || 80 }
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <FileSearch className="w-3.5 h-3.5" />
            <span>Forensic Interview Autopsy & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Interview Performance Breakdown
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Diagnostic report {report.candidateName && <span>for candidate <strong className="text-slate-900">{report.candidateName}</strong> · </span>}
            <span className="font-bold text-slate-900">{report.companyName}</span> ({report.roundType} Round)
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-wrap gap-2">
          {/* Interview Duration Badge */}
          <div className="bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 shadow-xs">
            <Timer className="w-3.5 h-3.5 text-brand-400" />
            <span>Duration: {durationStr}</span>
          </div>

          {sessionsList.length > 1 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">Session:</span>
              <select
                value={sessionId || sessionsList[0]?.id}
                onChange={(e) => window.location.search = `?sessionId=${e.target.value}`}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                {sessionsList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.candidateName ? `${s.candidateName} - ` : ''}{s.companyName} ({s.roundType})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Session Metadata Info Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
        <div className="flex items-center space-x-2.5">
          <Building2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Target Company</span>
            <span className="font-bold text-slate-900">{report.companyName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Interview Minutes</span>
            <span className="font-bold text-slate-900">{durationStr} ({totalMins} min session)</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <Activity className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Speaking Cadence</span>
            <span className="font-bold text-slate-900">{behavior.averageSpeakingPaceWpm || 138} WPM</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Session Date</span>
            <span className="font-bold text-slate-900">
              {new Date(report.startedAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Row 1: Key Metrics Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Overall Composite Rating', val: `${overall.overallScore || 78}%`, sub: 'Placement Readiness Index', color: 'text-brand-600' },
          { label: 'Technical Depth Score', val: `${overall.technicalScore || 75}%`, sub: 'Concepts & Complexity Proofs', color: 'text-indigo-600' },
          { label: 'Verbal Cadence & Clarity', val: `${overall.communicationScore || 82}%`, sub: `${behavior.averageSpeakingPaceWpm || 138} WPM · ${behavior.fillerWordCount || 3} fillers`, color: 'text-emerald-600' },
          { label: 'Eye-Contact Consistency', val: `${behavior.eyeContactConsistency || 88}%`, sub: `${behavior.gazeAwayIncidents || 1} gaze away events`, color: 'text-teal-600' }
        ].map((c, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{c.label}</span>
            <div className={`text-3xl font-display font-black ${c.color}`}>{c.val}</div>
            <p className="text-[11px] text-slate-500 font-medium">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Signature Feature: Interactive Interview Replay Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-display font-bold text-slate-900 flex items-center space-x-2">
              <Play className="w-4 h-4 text-brand-600" />
              <span>Interactive Interview Replay & Chronology</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click any turn below to inspect question timing, answer transcript, and missing technical concepts.
            </p>
          </div>
        </div>

        {/* Timeline Events Scrollbar */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          {questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTimelineIndex(idx)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl border text-left text-xs transition-all space-y-1 ${
                selectedTimelineIndex === idx
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2 font-mono text-[10px]">
                <Clock className="w-3 h-3 text-brand-400" />
                <span>Turn {q.turnNumber} ({q.audioDurationSeconds || 45}s)</span>
              </div>
              <div className="font-bold truncate max-w-[150px]">
                {q.isFollowUp ? 'Follow-up Probe' : `Question ${q.turnNumber}`}
              </div>
              <div className={`text-[10px] font-bold ${
                selectedTimelineIndex === idx ? 'text-brand-300' : 'text-slate-500'
              }`}>
                Score: {q.score}%
              </div>
            </button>
          ))}
        </div>

        {/* Selected Turn Detailed Forensic Breakdown */}
        {activeQuestion && (
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-800 px-2.5 py-0.5 rounded-md">
                Turn {activeQuestion.turnNumber} Forensic Evaluation
              </span>
              <span className="text-xs font-bold text-slate-900 font-mono">
                Duration: {activeQuestion.audioDurationSeconds || 45}s · Score: {activeQuestion.score}%
              </span>
            </div>

            {/* Question Text with Audio Player */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Interviewer Question:</span>
                <button
                  type="button"
                  onClick={() => handlePlayAudio('question', activeQuestion.questionText || activeQuestion.question)}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    playingAudioType === 'question'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                  }`}
                  title="Listen to question audio"
                >
                  {playingAudioType === 'question' ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Question Audio</span>
                      <span className="flex items-end space-x-0.5 h-3 ml-1">
                        <span className="w-0.5 h-2.5 bg-slate-950 animate-pulse" />
                        <span className="w-0.5 h-3.5 bg-slate-950 animate-pulse delay-75" />
                        <span className="w-0.5 h-2 bg-slate-950 animate-pulse delay-150" />
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>🔊 Listen Question</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                "{activeQuestion.questionText || activeQuestion.question}"
              </p>
            </div>

            {/* Candidate Spoken Transcript & Audio Player */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <Mic className="w-3.5 h-3.5 text-brand-600" />
                  <span>Candidate Spoken Answer & Audio:</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {((activeQuestion.transcript || activeQuestion.userAnswer || '').trim().split(/\s+/).filter(Boolean).length)} words
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio('candidate', activeQuestion.transcript || activeQuestion.userAnswer)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      playingAudioType === 'candidate'
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 hover:border-emerald-300'
                    }`}
                  >
                    {playingAudioType === 'candidate' ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-white" />
                        <span>⏹ Stop Audio</span>
                        <span className="flex items-end space-x-0.5 h-3 ml-1">
                          <span className="w-0.5 h-2.5 bg-white animate-pulse" />
                          <span className="w-0.5 h-3.5 bg-white animate-pulse delay-75" />
                          <span className="w-0.5 h-2 bg-white animate-pulse delay-150" />
                        </span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-emerald-700 text-emerald-700" />
                        <span>▶ Replay Spoken Audio</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className={`p-3 rounded-lg text-xs leading-relaxed font-sans border transition-all ${
                playingAudioType === 'candidate'
                  ? 'bg-brand-50/50 border-brand-300 text-slate-900 shadow-xs'
                  : 'bg-slate-50 border-slate-100 text-slate-700'
              }`}>
                "{activeQuestion.transcript || activeQuestion.userAnswer || 'Spoken answer recorded during session.'}"
              </div>
            </div>

            {/* Missing vs Demonstrated Concepts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Demonstrated */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Demonstrated Placement Concepts:</span>
                </div>
                <ul className="text-xs text-emerald-800 space-y-1">
                  {activeQuestion.demonstratedConcepts?.length > 0 ? (
                    activeQuestion.demonstratedConcepts.map((c, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400">Baseline technical rationale provided</li>
                  )}
                </ul>
              </div>

              {/* Missing Gaps */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Missing Gaps (What Cost Points):</span>
                </div>
                <ul className="text-xs text-amber-800 space-y-1">
                  {activeQuestion.missingGaps?.length > 0 ? (
                    activeQuestion.missingGaps.map((g, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{g}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-emerald-700 font-semibold">No critical gaps detected for this turn.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Model Placement Answer */}
            {activeQuestion.modelPlacementAnswer && (
              <div className="p-4 bg-brand-50/40 border border-brand-200 rounded-xl space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-brand-900">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Model Placement Answer:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeQuestion.modelPlacementAnswer}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Row 3: Competency Breakdown & Targeted Action Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Competency Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-display font-bold text-slate-900 flex items-center space-x-2">
            <Award className="w-4 h-4 text-brand-600" />
            <span>Placement Evaluation Pillars</span>
          </h2>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBars} layout="vertical" margin={{ left: 20, right: 30 }}>
                <XAxis type="number" domain={[0, 100]} fontSize={10} stroke="#94A3B8" />
                <YAxis dataKey="name" type="category" fontSize={11} stroke="#64748B" width={110} />
                <Tooltip />
                <Bar dataKey="score" fill="#C85A32" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Next Step Recommendation Card */}
        <div className="bg-gradient-to-br from-brand-50 via-white to-white border border-brand-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-1.5 bg-brand-500 text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Recommended Next Step</span>
            </div>

            <h3 className="text-sm font-display font-bold text-slate-900">
              Practice weak topics in Technical Arena
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Based on the {durationStr} session for {report.companyName}, practicing targeted coding problems and code defense will close detected conceptual gaps.
            </p>
          </div>

          <div className="pt-2 border-t border-brand-100 flex items-center justify-between">
            <Link
              to="/app/technical-arena"
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5"
            >
              <span>Go to Technical Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/app/interview-studio"
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Mock</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
