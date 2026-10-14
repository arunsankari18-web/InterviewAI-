import React, { useState, useEffect } from 'react';
import { challengeApi } from '../services/api';
import {
  Flame,
  Zap,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building2,
  RotateCcw,
  Target,
  Brain,
  Mic,
  Code2,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function ChallengeHub() {
  const [modes, setModes] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeSession, setChallengeSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [answeredHistory, setAnsweredHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModes() {
      try {
        const res = await challengeApi.getModes();
        setModes(res.data.modes || []);
      } catch (err) {
        console.warn('Modes fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadModes();
  }, []);

  // Countdown timer for each question
  useEffect(() => {
    if (!challengeSession || result || isAnswerRevealed) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleRevealAnswer(null);
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [challengeSession, currentQuestionIndex, result, isAnswerRevealed]);

  const handleStartChallenge = async (mode) => {
    try {
      setActiveChallenge(mode);
      setSecondsLeft(mode.durationSeconds || 45);
      const res = await challengeApi.startChallenge({ challengeType: mode.id });
      setChallengeSession(res.data);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setUserScore(0);
      setAnsweredHistory([]);
      setResult(null);
    } catch (err) {
      alert('Could not start challenge mode.');
    }
  };

  const handleSelectOption = (idx) => {
    if (isAnswerRevealed) return;
    setSelectedOption(idx);
  };

  const handleRevealAnswer = (chosenIdx = selectedOption) => {
    if (isAnswerRevealed) return;
    setIsAnswerRevealed(true);

    const currQ = challengeSession.questions[currentQuestionIndex];
    const isCorrect = chosenIdx === currQ.correctOptionIndex;

    let pointsToAdd = isCorrect ? 10 : 0;
    if (isCorrect) {
      setUserScore(prev => prev + 10);
    }

    setAnsweredHistory(prev => [
      ...prev,
      {
        questionId: currQ.id,
        isCorrect,
        chosenIdx,
        correctIdx: currQ.correctOptionIndex
      }
    ]);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex + 1 < (challengeSession?.questions?.length || 10)) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setSecondsLeft(activeChallenge?.durationSeconds || 45);
    } else {
      // Submit full challenge results
      setIsSubmitting(true);
      try {
        const finalScore = Math.min(100, Math.round((userScore / (challengeSession.questions.length * 10)) * 100));
        const res = await challengeApi.submitChallenge({
          challengeType: activeChallenge.id,
          challengeTitle: activeChallenge.title,
          answers: answeredHistory,
          score: finalScore,
          timeSpentSeconds: 120
        });
        setResult(res.data);
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        alert('Failed to record challenge results.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-56 bg-slate-200 rounded-2xl" />
          <div className="h-56 bg-slate-200 rounded-2xl" />
          <div className="h-56 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const currentQ = challengeSession?.questions?.[currentQuestionIndex];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Interactive Placement Challenge Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Daily 10-Question Placement Sprint
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test yourself with high-frequency technical questions curated from Zoho, Amazon, TCS Digital, and Accenture placement rounds.
          </p>
        </div>

        {!challengeSession && (
          <button
            type="button"
            onClick={() => handleStartChallenge(modes[0] || { id: 'pressure_round', title: 'Pressure Round', durationSeconds: 45 })}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Launch Quick 10-Q Sprint</span>
          </button>
        )}
      </div>

      {/* ACTIVE INTERACTIVE CHALLENGE PLAYER */}
      {challengeSession && (
        <div className="bg-[#111827] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6 animate-fade-in">
          {!result ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Question Header & Timer Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-sm">
                    {currentQuestionIndex + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span className="text-brand-400 font-bold">{currentQ?.company || 'Placement Round'}</span>
                      <span>·</span>
                      <span>{currentQ?.topic || 'Core CS'}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200">
                      Question {currentQuestionIndex + 1} of {challengeSession.questions.length}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] text-slate-400 font-medium">Score</div>
                    <div className="text-sm font-bold text-emerald-400">{userScore} pts</div>
                  </div>

                  <div className="flex items-center space-x-2 bg-slate-800/90 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold text-amber-400 border border-slate-700">
                    <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>{secondsLeft}s</span>
                  </div>
                </div>
              </div>

              {/* Step Progress Dots */}
              <div className="flex space-x-1.5">
                {challengeSession.questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      i < currentQuestionIndex
                        ? answeredHistory[i]?.isCorrect
                          ? 'bg-emerald-500'
                          : 'bg-rose-500'
                        : i === currentQuestionIndex
                        ? 'bg-amber-400'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              {/* Question Text */}
              <div className="p-5 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">
                  {currentQ?.round || 'Technical Interview Question'}
                </span>
                <h2 className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                  {currentQ?.question}
                </h2>
              </div>

              {/* Interactive Options List */}
              <div className="space-y-3">
                {currentQ?.options?.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctOptionIndex;

                  let optStyle = "bg-slate-800/40 border-slate-700/80 hover:bg-slate-800/80 hover:border-slate-600 text-slate-200";

                  if (isAnswerRevealed) {
                    if (isCorrect) {
                      optStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold";
                    } else if (isChosen && !isCorrect) {
                      optStyle = "bg-rose-950/80 border-rose-500 text-rose-200";
                    } else {
                      optStyle = "bg-slate-900/40 border-slate-800 text-slate-500";
                    }
                  } else if (isChosen) {
                    optStyle = "bg-brand-500/20 border-brand-500 text-white font-semibold";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswerRevealed}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-start space-x-3 cursor-pointer ${optStyle}`}
                    >
                      <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                      {isAnswerRevealed && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                      {isAnswerRevealed && isChosen && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Model Answer & Explanation when Revealed */}
              {isAnswerRevealed && (
                <div className="p-4 bg-slate-800/90 border border-slate-700 rounded-2xl space-y-1.5 animate-fade-in text-xs">
                  <div className="flex items-center space-x-1.5 text-brand-400 font-bold uppercase text-[10px] tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Placement Panel Explanation:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {currentQ?.explanation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setChallengeSession(null)}
                  className="text-xs text-slate-400 hover:text-slate-200 font-medium"
                >
                  Exit Drill
                </button>

                {!isAnswerRevealed ? (
                  <button
                    type="button"
                    disabled={selectedOption === null}
                    onClick={() => handleRevealAnswer(selectedOption)}
                    className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center space-x-2"
                  >
                    <span>Confirm Answer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-2"
                  >
                    <span>{currentQuestionIndex + 1 === challengeSession.questions.length ? 'Complete Drill & View Report' : 'Next Question'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Final Report Screen */
            <div className="text-center space-y-6 max-w-xl mx-auto py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-3xl mx-auto shadow-lg">
                🏆
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-display font-extrabold text-white">
                  Sprint Complete! Placement Score: {result.score}%
                </h2>
                <p className="text-xs text-slate-400">
                  Your answers have been analyzed and synced with your Placement Readiness Matrix.
                </p>
              </div>

              {/* Achievements Unlocked */}
              {result.achievementsUnlocked?.length > 0 && (
                <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2 text-left text-xs">
                  <span className="font-bold text-amber-400 block text-[11px] uppercase">Achievements & Upgrades:</span>
                  {result.achievementsUnlocked.map((ach, i) => (
                    <div key={i} className="text-emerald-400 font-medium flex items-center space-x-2">
                      <span>✓</span>
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setChallengeSession(null)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Return to Challenge Modes
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Available Placement Challenge Mode Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-display font-bold text-slate-900 uppercase tracking-wider">
            Specialized Placement Drills
          </h2>
          <span className="text-xs font-semibold text-brand-600">6 Interactive Modes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{mode.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {mode.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-slate-900 text-base">{mode.title}</h3>
                  <div className="text-xs font-semibold text-brand-600 mt-0.5">{mode.tagline}</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{mode.description}</p>

                {/* Clean interactive stats pills instead of long text */}
                <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-100">
                  <span className="text-[11px] font-semibold bg-slate-50 text-slate-700 px-2 py-1 rounded-lg border border-slate-200">
                    ⏱️ {mode.durationSeconds || 45}s per Qn
                  </span>
                  <span className="text-[11px] font-semibold bg-slate-50 text-slate-700 px-2 py-1 rounded-lg border border-slate-200">
                    🎯 10 Questions
                  </span>
                  <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-1 rounded-lg border border-emerald-200">
                    🏢 Zoho & Amazon Blueprints
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartChallenge(mode)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
              >
                <span>Start 10-Q Sprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

