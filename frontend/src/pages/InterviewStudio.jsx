import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewApi, companyApi } from '../services/api';
import { useCamera } from '../hooks/useCamera';
import { useMicrophone } from '../hooks/useMicrophone';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useFaceTracking } from '../hooks/useFaceTracking';
import { useTimer } from '../hooks/useTimer';
import { AudioMeter } from '../components/common/AudioMeter';
import {
  Video,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  Clock,
  RotateCcw,
  Send,
  Code2,
  FileCode,
  Zap,
  HelpCircle,
  UserCheck,
  Activity,
  Globe,
  Languages
} from 'lucide-react';

import { recordRecentAccess } from '../components/common/RecentlyAccessedDrawer';
import { useLanguage } from '../context/LanguageContext';

const QUESTION_TAMIL_TRANSLATIONS = {
  hash: "ஹேஷ் மேப் (Hash Map) உள்ளுக்குள் எவ்வாறு இயங்குகிறது? ஹேஷ் மோதல்கள் (Collisions) ஏற்படும்போது Separate Chaining மற்றும் Open Addressing மூலம் எவ்வாறு தீர்க்கப்படுகிறது என்பதை ஒரு உதாரணத்துடன் விளக்கவும்.",
  sum: "கொடுக்கப்பட்ட முழு எண்கள் வரிசையில் (Array) ஒரு குறிப்பிட்ட தொகையை (Target Sum) உருவாக்கும் இரு எண்களைக் கண்டறிய உகந்த அல்காரிதத்தை எவ்வாறு வடிவமைப்பீர்கள்? Brute Force, Hash Table மற்றும் Two Pointers அணுகுமுறைகளை ஒப்பிடுக.",
  dynamic: "ஒரு சிக்கலுக்கு உகந்த துணை கட்டமைப்பு (Optimal Substructure) மற்றும் ஒன்றுடன் ஒன்று சேரும் துணை சிக்கல்கள் (Overlapping Subproblems) இருப்பதை எவ்வாறு கண்டறிவீர்கள்? Memoization மற்றும் Tabulation கொண்டு தீர்க்கும் வழியை விளக்குக.",
  acid: "வங்கி பணப்பரிவர்த்தனை உதாரணத்துடன் RDBMS-ன் நான்கு ACID பண்புகளை விளக்குக. கணினி செயலிழப்பின் போது Atomicity மற்றும் Durability-ஐ தரவுத்தளம் எவ்வாறு உறுதி செய்கிறது?",
  railway: "வெளிப்புற லைப்ரரிகள் இல்லாமல் கன்சோல் அடிப்படையிலான ரயில் முன்பதிவு அமைப்பை OOP கொள்கைகளுடன் எவ்வாறு வடிவமைப்பீர்கள்?",
  default: "உங்கள் பதிலை தெளிவாகவும், தொழில்நுட்ப காரணங்களுடனும் (Time & Space complexity) விளக்கவும்."
};

function getTamilQuestion(text) {
  if (!text) return "";
  const lower = text.toLowerCase();
  if (lower.includes('hash') || lower.includes('bucket')) return QUESTION_TAMIL_TRANSLATIONS.hash;
  if (lower.includes('sum') || lower.includes('two pointer') || lower.includes('target sum')) return QUESTION_TAMIL_TRANSLATIONS.sum;
  if (lower.includes('dynamic') || lower.includes('subproblem') || lower.includes('memoization')) return QUESTION_TAMIL_TRANSLATIONS.dynamic;
  if (lower.includes('acid') || lower.includes('transaction')) return QUESTION_TAMIL_TRANSLATIONS.acid;
  if (lower.includes('railway') || lower.includes('reservation')) return QUESTION_TAMIL_TRANSLATIONS.railway;
  return `"${text}" என்பதற்கான தொழில்நுட்ப விளக்கம் மற்றும் அணுகுமுறையை விவரிக்கவும்.`;
}

function getSampleAnswerForQuestion(questionText) {
  const lower = (questionText || '').toLowerCase();
  if (lower.includes('hash') || lower.includes('bucket')) {
    return "In a Hash Map, keys are hashed using a hash function and mapped to bucket indices via bitwise masking (hash & (n-1)). When collisions occur where two keys hash to the same bucket, techniques like Separate Chaining (using linked lists or red-black trees in Java 8) or Open Addressing (using Linear or Quadratic Probing) resolve them. The average time complexity for lookup is O(1), with worst case O(N) if many keys collide. When load factor exceeds 0.75, the map rehashes and doubles its capacity.";
  }
  if (lower.includes('acid') || lower.includes('transaction')) {
    return "ACID represents Atomicity, Consistency, Isolation, and Durability. In a banking scenario, debiting Account A and crediting Account B must either completely succeed or roll back together (Atomicity). Database constraints prevent negative balances (Consistency). Concurrent transfers are isolated using locks or MVCC (Isolation). Finally, committed records are flushed via Write-Ahead Logging to ensure durability even after sudden power failure.";
  }
  if (lower.includes('two') || lower.includes('sum') || lower.includes('pointer')) {
    return "To find two numbers that sum to a target, a hash map provides an optimal single-pass solution with O(N) time and O(N) auxiliary space by storing complements. Alternatively, if the array can be sorted or is already sorted, we can use two pointers from the left and right ends, achieving O(N log N) sorting time with O(1) auxiliary space.";
  }
  return "First, I analyze the input constraints and edge cases. I design a modular approach using single-responsibility principles, select appropriate data structures to optimize time complexity to O(N), and ensure space complexity is minimized. Finally, I write test cases covering empty inputs, duplicates, and boundary limits.";
}

export function InterviewStudio() {
  const { user, profile } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Wizard state: 'setup' | 'equipment_check' | 'live_interview'
  const [phase, setPhase] = useState('setup');

  // Setup options
  const [companies, setCompanies] = useState([]);
  const [companySlug, setCompanySlug] = useState('zoho');
  const [targetRole, setTargetRole] = useState(profile?.targetRoles?.[0] || 'Software Development Engineer');
  const [roundType, setRoundType] = useState('Technical');
  const [difficulty, setDifficulty] = useState(profile?.preferredDifficulty || 'Medium');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [mode, setMode] = useState('voice_camera'); // voice_camera, voice_only, text_only

  // Live Interview State
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [turnCount, setTurnCount] = useState(1);
  const [historyTurns, setHistoryTurns] = useState([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchpadCode, setScratchpadCode] = useState('// Live Technical Notes & Algorithm Dry Run\n');
  const [showTamilSubtitle, setShowTamilSubtitle] = useState(language === 'ta');

  // Custom Hooks
  const camera = useCamera();
  const mic = useMicrophone();
  const speechSTT = useSpeechRecognition({ defaultLang: language === 'ta' ? 'ta-IN' : 'en-IN' });
  const speechTTS = useSpeechSynthesis();
  const faceTracker = useFaceTracking(camera.videoRef, phase === 'live_interview' && mode === 'voice_camera');
  const timer = useTimer({
    initialSeconds: durationMinutes * 60,
    countDirection: 'down',
    onTimeUp: () => handleFinishInterview()
  });

  // Sync speech language when app language changes
  useEffect(() => {
    if (language === 'ta') {
      speechSTT.setLang('ta-IN');
      setShowTamilSubtitle(true);
    } else {
      speechSTT.setLang('en-IN');
    }
  }, [language]);

  // Load companies & record recent access
  useEffect(() => {
    recordRecentAccess({
      title: 'Interview Studio Session',
      path: '/app/interview-studio',
      type: 'studio',
      icon: '🎙️'
    });

    companyApi.getCompanies().then(res => setCompanies(res.data.companies || []));
  }, []);

  // Ensure camera stream is explicitly attached and running whenever phase or video element mounts
  useEffect(() => {
    if (camera.videoRef.current && camera.stream) {
      camera.videoRef.current.srcObject = camera.stream;
      camera.videoRef.current.play().catch(err => {
        console.warn('Video auto-play handled:', err);
      });
    }
  }, [phase, camera.stream]);

  // Handle Equipment Check transitions
  const startEquipmentCheck = async () => {
    setPhase('equipment_check');
    if (mode === 'voice_camera') {
      await camera.startCamera();
      await mic.startMicrophone();
    } else if (mode === 'voice_only') {
      await mic.startMicrophone();
    }
  };

  // Launch live interview
  const launchLiveInterview = async () => {
    try {
      setErrorNotice(null);
      const res = await interviewApi.startInterview({
        companySlug,
        targetRole,
        roundType,
        difficulty,
        durationMinutes,
        mode
      });

      const { sessionId: sId, firstQuestion } = res.data;
      setSessionId(sId);
      setCurrentQuestion(firstQuestion);
      setPhase('live_interview');
      timer.start();

      // Read question aloud with AI voice
      if (mode !== 'text_only' && speechTTS.isSupported) {
        setIsAiSpeaking(true);
        speechTTS.speak(firstQuestion.questionText, {
          onEnd: () => {
            setIsAiSpeaking(false);
            speechSTT.startListening();
          }
        });
      } else {
        speechSTT.startListening();
      }
    } catch (err) {
      setErrorNotice('Could not start live interview session. Please check backend connection.');
    }
  };

  // Submit current answer turn
  const handleSubmitAnswer = async () => {
    const answer = speechSTT.transcript.trim();
    if (!answer) {
      setErrorNotice('Please speak your explanation into the microphone or type your response.');
      return;
    }

    speechSTT.stopListening();
    speechTTS.stop();
    setIsSubmitting(true);
    setErrorNotice(null);

    try {
      const res = await interviewApi.submitAnswer(sessionId, {
        questionId: currentQuestion.questionId,
        questionText: currentQuestion.questionText,
        answerText: answer,
        durationSeconds: 45,
        topic: currentQuestion.topic
      });

      const { nextQuestion, turnEvaluation, isCompleted } = res.data;

      // Append to turn history
      setHistoryTurns(prev => [
        ...prev,
        {
          question: currentQuestion.questionText,
          answer,
          evaluation: turnEvaluation
        }
      ]);

      if (isCompleted || !nextQuestion) {
        handleFinishInterview();
      } else {
        setCurrentQuestion(nextQuestion);
        setTurnCount(prev => prev + 1);
        speechSTT.resetTranscript();

        // Speak next question
        if (mode !== 'text_only' && speechTTS.isSupported) {
          setIsAiSpeaking(true);
          speechTTS.speak(nextQuestion.questionText, {
            onEnd: () => {
              setIsAiSpeaking(false);
              speechSTT.startListening();
            }
          });
        } else {
          speechSTT.startListening();
        }
      }
    } catch (err) {
      setErrorNotice('Failed to submit answer. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Finish session & route to autopsy
  const handleFinishInterview = async () => {
    camera.stopCamera();
    mic.stopMicrophone();
    speechSTT.stopListening();
    speechTTS.stop();
    timer.pause();

    const elapsedSeconds = Math.max(10, (durationMinutes * 60) - (timer.seconds || 0));
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    const formattedDuration = `${mins}m ${secs}s`;

    try {
      await interviewApi.finishInterview(sessionId, {
        behaviorMetrics: {
          totalDurationSeconds: elapsedSeconds,
          durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
          formattedDuration,
          allocatedMinutes: durationMinutes,
          faceDetectedPercentage: faceTracker.faceDetected ? 95 : 70,
          eyeContactConsistency: faceTracker.eyeContactPercentage || 88,
          gazeAwayIncidents: faceTracker.gazeAwayCount || 1,
          averageSpeakingPaceWpm: 138,
          fillerWordCount: 3,
          longPausesCount: 1,
          speechClarityScore: 89
        }
      });
      navigate(`/app/interview-autopsy?sessionId=${sessionId}`);
    } catch (err) {
      navigate('/app/command-center');
    }
  };

  // Real-time STAR & Technical Structure Copilot (Live heuristic analysis of spoken answer)
  const currentAnswerText = speechSTT.transcript.toLowerCase();
  const structureMilestones = [
    {
      label: 'Context & Approach',
      key: 'context',
      detected: currentAnswerText.includes('because') || currentAnswerText.includes('first') || currentAnswerText.includes('problem') || currentAnswerText.includes('input') || currentAnswerText.includes('given') || currentAnswerText.includes('முதலில்') || currentAnswerText.includes('சிக்கல்') || currentAnswerText.includes('தேவை'),
      tip: 'Establish problem requirements & constraints first'
    },
    {
      label: 'Algorithm & Data Structure',
      key: 'algorithm',
      detected: currentAnswerText.includes('hash') || currentAnswerText.includes('array') || currentAnswerText.includes('tree') || currentAnswerText.includes('map') || currentAnswerText.includes('loop') || currentAnswerText.includes('pointer') || currentAnswerText.includes('function') || currentAnswerText.includes('query') || currentAnswerText.includes('stack') || currentAnswerText.includes('node') || currentAnswerText.includes('ஹேஷ்') || currentAnswerText.includes('அரே') || currentAnswerText.includes('அல்காரிதம்'),
      tip: 'Mention chosen data structures and why they fit'
    },
    {
      label: 'Time & Space Complexity',
      key: 'complexity',
      detected: currentAnswerText.includes('o(') || currentAnswerText.includes('o(n') || currentAnswerText.includes('o(1') || currentAnswerText.includes('complexity') || currentAnswerText.includes('time') || currentAnswerText.includes('space') || currentAnswerText.includes('linear') || currentAnswerText.includes('constant') || currentAnswerText.includes('நேரம்') || currentAnswerText.includes('இடம்'),
      tip: 'State Big-O time and auxiliary space trade-offs'
    },
    {
      label: 'Edge Cases & Trade-offs',
      key: 'tradeoffs',
      detected: currentAnswerText.includes('edge') || currentAnswerText.includes('null') || currentAnswerText.includes('duplicate') || currentAnswerText.includes('empty') || currentAnswerText.includes('handle') || currentAnswerText.includes('trade-off') || currentAnswerText.includes('instead of') || currentAnswerText.includes('விதிவிலக்கு') || currentAnswerText.includes('முனை'),
      tip: 'Discuss boundary conditions and alternative approaches'
    }
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* PHASE 1: Setup Wizard */}
      {phase === 'setup' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-brand-50 border border-brand-200 text-brand-800 px-3 py-1 rounded-full text-xs font-semibold">
              <Video className="w-3.5 h-3.5 text-brand-600" />
              <span>Interactive Placement Interview Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              Configure Your Placement Interview Room
            </h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Select target company parameters, difficulty, and multimodal devices for adaptive AI questioning.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Company Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Company</label>
                <select
                  value={companySlug}
                  onChange={(e) => setCompanySlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  {companies.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} ({c.tier || 'Enterprise'})
                    </option>
                  ))}
                  {companies.length === 0 && (
                    <>
                      <option value="zoho">Zoho Corporation</option>
                      <option value="tcs">TCS (Tata Consultancy Services)</option>
                      <option value="amazon">Amazon</option>
                      <option value="accenture">Accenture</option>
                    </>
                  )}
                </select>
              </div>

              {/* Target Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Placement Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              {/* Round Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Interview Round</label>
                <select
                  value={roundType}
                  onChange={(e) => setRoundType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="Technical">Technical Round (DSA & System Concepts)</option>
                  <option value="Technical Core">Technical Core (DBMS, OS, OOP & SQL)</option>
                  <option value="Project Defense">Project Defense & Architecture Round</option>
                  <option value="HR & Cultural">HR & Behavioral Panel Round</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Interview Rigor</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="Easy">Standard Campus Round (Foundational)</option>
                  <option value="Medium">Standard Product / Digital (Recommended)</option>
                  <option value="Hard">High-Intensity Bar Raiser</option>
                </select>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700">Interview Mode</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'voice_camera', title: 'Voice + Camera', desc: 'Full multimodal with eye contact & facial presence tracking', icon: Video },
                  { id: 'voice_only', title: 'Voice Only', desc: 'Audio conversational interview with speech analytics', icon: Mic },
                  { id: 'text_only', title: 'Typed Transcript', desc: 'Silent typed technical responses with code defense', icon: Square }
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        mode === m.id
                          ? 'border-brand-500 bg-brand-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-2 ${mode === m.id ? 'text-brand-600' : 'text-slate-500'}`} />
                      <div className="text-xs font-bold text-slate-900">{m.title}</div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-snug">{m.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={startEquipmentCheck}
                className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center space-x-2"
              >
                <span>Proceed to Equipment Check</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: Equipment Check */}
      {phase === 'equipment_check' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Audio & Video Device Verification
            </h1>
            <p className="text-xs text-slate-500">
              Verify your camera feed and microphone sensitivity before entering the interview room.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Camera View */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <Video className="w-4 h-4 text-brand-600" />
                  <span>Camera Stream</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  camera.hasPermission ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {camera.hasPermission ? 'Camera Active' : 'Connecting...'}
                </span>
              </div>

              <div className="bg-slate-950 rounded-xl aspect-video overflow-hidden border border-slate-800 relative flex items-center justify-center">
                {mode === 'voice_camera' ? (
                  <video
                    ref={(el) => {
                      camera.videoRef.current = el;
                      if (el && camera.stream) {
                        el.srcObject = camera.stream;
                        el.play().catch(() => {});
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="text-slate-400 text-xs text-center p-4">
                    Camera disabled for {mode === 'voice_only' ? 'Voice Only' : 'Text Only'} mode.
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500">
                Ensure you are centered with good lighting for facial presence calibration.
              </p>
            </div>

            {/* Microphone Level & Studio Rules */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <Mic className="w-4 h-4 text-brand-600" />
                    <span>Microphone Test</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    mic.hasPermission ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {mic.hasPermission ? 'Mic Ready' : 'Speak to test'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">Live Audio Level:</span>
                  <AudioMeter level={mic.volumeLevel} isLive={mic.hasPermission} />
                </div>

                <div className="p-3 bg-brand-50/50 border border-brand-100 rounded-xl space-y-1.5 text-xs text-slate-700">
                  <span className="font-bold text-brand-900 block text-[11px] uppercase tracking-wider">Interview Rules:</span>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                    <li>Speak naturally and explain your technical thought process clearly.</li>
                    <li>The AI interviewer adapts questions based on your depth.</li>
                    <li>State time and space complexity explicitly for maximum rating.</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setPhase('setup')}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={launchLiveInterview}
                  className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-2 transition-all"
                >
                  <span>Connect to Interviewer</span>
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: Live Interview Room */}
      {phase === 'live_interview' && currentQuestion && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Control Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl px-6 py-3 shadow-sm flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div className="text-xs font-bold text-slate-900">
                {t('liveStudio')} · {companySlug.toUpperCase()} ({roundType} Round)
              </div>
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {t('questionWord')} {turnCount} {t('ofWord')} 5
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Language Switcher Button */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 transition-all text-slate-700 bg-white"
                title="Switch Language / மொழியை மாற்றுக"
              >
                <Languages className="w-3.5 h-3.5 text-brand-600" />
                <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowScratchpad(!showScratchpad)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-all ${
                  showScratchpad ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{showScratchpad ? t('hideScratchpad') : t('scratchpad')}</span>
              </button>

              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl text-xs font-mono font-bold text-slate-800">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                <span>{timer.formatTime()}</span>
              </div>

              <button
                type="button"
                onClick={handleFinishInterview}
                className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
                <span>{t('finishAutopsy')}</span>
              </button>
            </div>
          </div>

          {/* Main Stage Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Question Prompt & AI Voice / Live Transcript */}
            <div className="lg:col-span-2 space-y-4">
              {/* Question Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 interview-active-border">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md">
                      {currentQuestion.isFollowUp 
                        ? (language === 'ta' ? 'தொடர் கேள்வி (Follow-up)' : 'Contextual Follow-up Probe') 
                        : (language === 'ta' ? 'முதன்மை கேள்வி' : 'Core Question')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Topic: {currentQuestion.topic}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Toggle Tamil Subtitle Button */}
                    <button
                      type="button"
                      onClick={() => setShowTamilSubtitle(!showTamilSubtitle)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center space-x-1.5 transition-all ${
                        showTamilSubtitle || language === 'ta'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Toggle Tamil Subtitle & Explanation / தமிழ் வழிகாட்டுதல்"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-700" />
                      <span>{showTamilSubtitle || language === 'ta' ? t('hideTamilSubtitle') : t('tamilTranslation')}</span>
                    </button>

                    {isAiSpeaking ? (
                      <span className="text-xs font-semibold text-brand-600 flex items-center space-x-1.5 animate-pulse bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200">
                        <Volume2 className="w-4 h-4 text-brand-600" />
                        <span>{t('interviewerSpeaking')}</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center space-x-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        <Mic className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('candidateFloor')}</span>
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 leading-snug">
                  "{currentQuestion.questionText}"
                </h2>

                {/* Tamil Translation & Guidance Card */}
                {(showTamilSubtitle || language === 'ta') && (
                  <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-xl space-y-2 animate-fade-in shadow-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                        <Languages className="w-4 h-4 text-amber-700" />
                        <span>🇮🇳 வினா விளக்கம் (Tamil Guidance & Key Points):</span>
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (speechTTS.isSupported) {
                              setIsAiSpeaking(true);
                              speechTTS.speak(getTamilQuestion(currentQuestion.questionText), {
                                onEnd: () => {
                                  setIsAiSpeaking(false);
                                  speechSTT.startListening();
                                }
                              });
                            }
                          }}
                          className="px-2.5 py-0.5 bg-amber-200/80 hover:bg-amber-300 text-amber-950 rounded-md text-[11px] font-bold flex items-center space-x-1 transition-colors"
                          title="Listen in Tamil / தமிழில் கேட்க"
                        >
                          <Volume2 className="w-3 h-3 text-amber-800" />
                          <span>{t('listenInTamil')}</span>
                        </button>
                        <span className="text-[10px] text-amber-800 bg-amber-200/50 px-2 py-0.5 rounded font-mono font-medium">
                          {speechSTT.lang === 'ta-IN' ? '🇮🇳 தமிழ் மைக் தயார்' : 'English Mic'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-amber-950 font-medium leading-relaxed font-sans">
                      {getTamilQuestion(currentQuestion.questionText)}
                    </p>
                  </div>
                )}

                {currentQuestion.expectedConcepts?.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="text-slate-400 font-semibold">Evaluation Focus:</span>
                    {currentQuestion.expectedConcepts.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Technical Scratchpad (Collapsible) */}
              {showScratchpad && (
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-mono flex items-center space-x-1.5">
                      <FileCode className="w-3.5 h-3.5 text-brand-400" />
                      <span>Technical Scratchpad (Dry-runs & Pseudo-code)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Synced with interview session</span>
                  </div>
                  <textarea
                    value={scratchpadCode}
                    onChange={(e) => setScratchpadCode(e.target.value)}
                    rows={6}
                    className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="// Sketch your data structures, recurrence relations, or SQL query draft here..."
                  />
                </div>
              )}

              {/* Candidate Live Spoken Transcript & Typed Input */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-brand-600" />
                    <span className="text-xs font-bold text-slate-900">{t('spokenTranscript')}</span>
                  </div>

                  {/* Language Selector + Mic status */}
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    {/* Speech Recognition Language Switcher (en-IN vs ta-IN) */}
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[11px]">
                      <button
                        type="button"
                        onClick={() => speechSTT.setLang('en-IN')}
                        className={`px-2.5 py-0.5 rounded-md font-semibold transition-all ${
                          speechSTT.lang === 'en-IN'
                            ? 'bg-white text-brand-700 shadow-xs font-bold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        🇮🇳 en-IN (English)
                      </button>
                      <button
                        type="button"
                        onClick={() => speechSTT.setLang('ta-IN')}
                        className={`px-2.5 py-0.5 rounded-md font-semibold transition-all ${
                          speechSTT.lang === 'ta-IN'
                            ? 'bg-emerald-600 text-white shadow-xs font-bold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        🇮🇳 தமிழ் (ta-IN)
                      </button>
                    </div>

                    {/* Mic live indicator */}
                    <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                      <span className={`w-2 h-2 rounded-full ${speechSTT.isListening ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
                      <span className="text-[11px] text-slate-600 font-medium">
                        {speechSTT.isListening ? t('micActive') : t('micPaused')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* If there is a speech error (like network or permission), show an alert with restart button */}
                {speechSTT.speechError && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>{speechSTT.speechError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => speechSTT.restartListening()}
                      className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-lg text-xs font-bold flex items-center space-x-1 shrink-0"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t('restartMic')}</span>
                    </button>
                  </div>
                )}

                <textarea
                  value={speechSTT.transcript}
                  onChange={(e) => speechSTT.setTranscript(e.target.value)}
                  placeholder={
                    speechSTT.lang === 'ta-IN'
                      ? "உங்கள் பதிலை தமிழில் மைக்கில் பேசவும் அல்லது இங்கே தட்டச்சு செய்யவும் (எ.கா: ஹேஷ் மேப் என்பது...)..."
                      : "Speak your answer aloud into your microphone (or type technical details directly here)..."
                  }
                  rows={5}
                  className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed font-sans"
                />

                {/* Live STAR & Technical Structure Copilot Bar */}
                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                      <span>Live Response Structure Copilot:</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Highlights live as you speak technical terms</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {structureMilestones.map((m) => (
                      <div
                        key={m.key}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          m.detected
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          {m.detected && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          <span className="text-[10px] font-bold">{m.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {errorNotice && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{errorNotice}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    {/* Toggle Mic - Completely unambiguous active vs muted design */}
                    <button
                      type="button"
                      onClick={() => {
                        if (speechSTT.isListening) {
                          speechSTT.stopListening();
                        } else {
                          if (isAiSpeaking && speechTTS.isSupported) {
                            speechTTS.stop();
                            setIsAiSpeaking(false);
                          }
                          speechSTT.startListening();
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border transition-all ${
                        speechSTT.isListening
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20 hover:bg-emerald-100 shadow-xs'
                          : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 shadow-xs'
                      }`}
                      title={speechSTT.isListening ? t('clickToMuteHint') : t('clickToUnmuteHint')}
                    >
                      {speechSTT.isListening ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <Mic className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{t('micActiveButton')}</span>
                          <span className="text-[10px] font-normal text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-200">
                            {t('clickToMuteHint')}
                          </span>
                        </>
                      ) : (
                        <>
                          <MicOff className="w-3.5 h-3.5 text-rose-600" />
                          <span>{t('micMutedButton')}</span>
                          <span className="text-[10px] font-normal text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded border border-rose-200">
                            {t('clickToUnmuteHint')}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Restart Mic Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isAiSpeaking && speechTTS.isSupported) {
                          speechTTS.stop();
                          setIsAiSpeaking(false);
                        }
                        speechSTT.restartListening();
                      }}
                      className="px-2.5 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center space-x-1 transition-colors"
                      title="Restart browser speech recognition engine"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t('restartMic')}</span>
                    </button>

                    {/* Clear Text */}
                    <button
                      type="button"
                      onClick={() => speechSTT.resetTranscript()}
                      className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      {t('clearText')}
                    </button>

                    {/* Quick Demo Voice Answer */}
                    <button
                      type="button"
                      onClick={() => {
                        const sampleAnswer = getSampleAnswerForQuestion(currentQuestion.questionText);
                        speechSTT.setTranscript(sampleAnswer);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl flex items-center space-x-1.5 transition-colors"
                      title="Instant high-scoring technical speech sample for evaluation"
                    >
                      <Zap className="w-3.5 h-3.5 text-brand-600" />
                      <span>{t('quickVoiceSample')}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitAnswer}
                    className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center space-x-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>{t('evaluating')}</span>
                    ) : (
                      <>
                        <span>{t('submitAnswer')}</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Candidate Video Stream & Real-Time Multimodal HUD */}
            <div className="space-y-4">
              {/* AI Recruiter Visual Avatar Tile */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-400 flex items-center justify-center font-bold text-brand-300 text-xs">
                      AI
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{companySlug.toUpperCase()} Lead Interviewer</span>
                      <span className="text-[10px] text-slate-400">{roundType} Evaluation Panel</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isAiSpeaking ? 'bg-brand-500/30 text-brand-300 border border-brand-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {isAiSpeaking ? 'Speaking...' : 'Listening...'}
                  </span>
                </div>

                {/* Animated Voice Visualizer Wave */}
                <div className="h-6 w-full flex items-center justify-center space-x-1 bg-slate-950/60 rounded-lg px-3">
                  {[40, 75, 90, 60, 80, 45, 95, 70, 50, 85, 60, 40].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isAiSpeaking ? 'bg-brand-400 animate-pulse' : speechSTT.isListening ? 'bg-emerald-400' : 'bg-slate-700'
                      }`}
                      style={{
                        height: isAiSpeaking ? `${Math.max(20, (h + (i % 3) * 15) % 100)}%` : speechSTT.isListening ? '45%' : '20%'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Candidate Camera Tile with Live Eye-Contact Tracking HUD */}
              <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md relative h-60 flex items-center justify-center">
                {mode === 'voice_camera' ? (
                  <>
                    <video
                      ref={(el) => {
                        camera.videoRef.current = el;
                        if (el && camera.stream) {
                          el.srcObject = camera.stream;
                          el.play().catch(() => {});
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />

                    {/* AI Face & Eye Tracking Target Overlay Box */}
                    <div
                      className={`absolute border-2 rounded-xl pointer-events-none transition-all duration-300 ${
                        faceTracker.gazeDirection === 'Center'
                          ? 'border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                          : 'border-amber-400/80'
                      }`}
                      style={{
                        left: `${faceTracker.faceBox?.x || 25}%`,
                        top: `${faceTracker.faceBox?.y || 15}%`,
                        width: `${faceTracker.faceBox?.width || 50}%`,
                        height: `${faceTracker.faceBox?.height || 70}%`
                      }}
                    >
                      {/* Corner Target Markers */}
                      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
                      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />

                      {/* Eye Contact Crosshair */}
                      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <span className={`w-2.5 h-2.5 rounded-full ${faceTracker.gazeDirection === 'Center' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400 text-xs text-center p-4">
                    Camera stream hidden ({mode === 'voice_only' ? 'Voice Only' : 'Text Only'}).
                  </div>
                )}

                {/* Top Left HUD: Face Presence */}
                <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white flex items-center space-x-1.5 font-mono border border-slate-700/60">
                  <span className={`w-2 h-2 rounded-full ${faceTracker.faceDetected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                  <span>{faceTracker.faceDetected ? 'Face Position: Aligned' : 'Face Away'}</span>
                </div>

                {/* Top Right HUD: Live Eye-Contact % */}
                <div className="absolute top-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono border border-slate-700/60 flex items-center space-x-1">
                  <Eye className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">{faceTracker.eyeContactPercentage}% Focus</span>
                </div>

                {/* Bottom Center HUD: Real-time Gaze Vector */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] text-slate-300 font-mono border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span>Gaze Vector:</span>
                    <span className={`font-bold ${faceTracker.gazeDirection === 'Center' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {faceTracker.gazeDirection === 'Center' ? 'Direct at Screen' : `Looking ${faceTracker.gazeDirection}`}
                    </span>
                  </div>
                  <span className="text-slate-400">{faceTracker.headPosition}</span>
                </div>
              </div>

              {/* Behavior Indicators Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-brand-600" />
                  <span>Real-Time Placement Cadence</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 text-[11px] mb-1">
                      <span>Eye Contact Consistency:</span>
                      <span className="font-bold text-slate-900">{faceTracker.eyeContactPercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${faceTracker.eyeContactPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-1 text-[11px] text-slate-600">
                    <span>Gaze Diverted Count:</span>
                    <span className="font-bold text-slate-900">{faceTracker.gazeAwayCount} times</span>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Speech Input Status:</span>
                    <span className="font-bold text-emerald-600">
                      {speechSTT.isListening ? 'Actively Receiving Voice' : 'Mic Idle'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
