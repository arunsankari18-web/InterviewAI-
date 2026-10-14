import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { aiEngine } from '../services/aiEngine.service.js';

const router = express.Router();

// POST /api/interviews/start
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const {
      companySlug = 'zoho',
      targetRole = 'Software Development Engineer',
      roundType = 'Technical',
      difficulty = 'Medium',
      durationMinutes = 20,
      mode = 'voice_camera'
    } = req.body;

    const company = await db.getCompanyBySlug(companySlug);
    const companyName = company ? company.name : 'General Placement';

    // Fetch suitable questions
    let candidateQuestions = await db.getQuestions({ companySlug, roundType });
    if (candidateQuestions.length === 0) {
      candidateQuestions = await db.getQuestions({ roundType });
    }
    if (candidateQuestions.length === 0) {
      candidateQuestions = await db.getQuestions();
    }

    const firstQ = candidateQuestions[0] || {
      id: 'q-default-1',
      questionText: 'Can you introduce yourself and walk me through an end-to-end technical system you built?',
      topic: 'Introduction & Architecture',
      expectedConcepts: ['Architecture overview', 'Database choice', 'Key trade-offs', 'Scalability'],
      followUpStarters: ['Why did you choose that database architecture?']
    };

    const sessionId = `ses-${uuidv4()}`;
    const newSession = {
      id: sessionId,
      userId: req.user.id,
      companySlug,
      companyName,
      targetRole,
      roundType,
      difficulty,
      durationMinutes: Number(durationMinutes) || 20,
      mode,
      status: 'in_progress',
      startedAt: new Date(),
      turns: [],
      behaviorMetrics: {
        faceDetectedPercentage: 94,
        eyeContactConsistency: 88,
        gazeAwayIncidents: 2,
        averageSpeakingPaceWpm: 138,
        fillerWordCount: 4,
        longPausesCount: 1,
        speechClarityScore: 90
      },
      overallEvaluation: null,
      replayTimeline: [
        {
          timeOffset: "00:00",
          eventTitle: "Interview Room Initialized",
          eventType: "system",
          description: `Environment check passed for ${companyName} (${roundType} Round).`,
          turnIndex: -1
        }
      ]
    };

    await db.createInterviewSession(newSession);

    return res.status(201).json({
      success: true,
      sessionId,
      companyName,
      targetRole,
      roundType,
      firstQuestion: {
        questionId: firstQ.id,
        questionText: firstQ.questionText,
        topic: firstQ.topic,
        expectedConcepts: firstQ.expectedConcepts || []
      }
    });
  } catch (err) {
    console.error('Start interview error:', err);
    return res.status(500).json({ error: 'Failed to initialize interview studio session.' });
  }
});

// POST /api/interviews/:id/answer
router.post('/:id/answer', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { questionId, questionText, answerText, durationSeconds = 45, topic = 'General' } = req.body;

    const session = await db.getInterviewSessionById(id);
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ error: 'Interview session not found.' });
    }

    // Look up question details for expected concepts
    const questionObj = (await db.getQuestions()).find(q => q.id === questionId) || {
      expectedConcepts: ['Reasoning', 'Trade-offs', 'Correctness', 'Time Complexity'],
      followUpStarters: ['Can you optimize this further?']
    };

    const evaluationResult = aiEngine.evaluateInterviewAnswer({
      question: questionObj,
      answerText,
      history: session.turns,
      companySlug: session.companySlug,
      difficulty: session.difficulty
    });

    const turnNumber = (session.turns || []).length + 1;
    const turnEntry = {
      turnNumber,
      questionId,
      questionText,
      questionType: questionObj.roundType || session.roundType,
      timestamp: new Date().toLocaleTimeString(),
      answerText,
      audioDurationSeconds: Number(durationSeconds) || 45,
      evaluation: evaluationResult.evaluation
    };

    const updatedTurns = [...(session.turns || []), turnEntry];

    // Compute timeline offset (e.g. 01:15)
    const elapsedSeconds = updatedTurns.reduce((acc, t) => acc + (t.audioDurationSeconds || 45), 0);
    const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
    const timeOffset = `${mins}:${secs}`;

    const newTimelineEvents = [...(session.replayTimeline || [])];
    newTimelineEvents.push({
      timeOffset,
      eventTitle: `Question ${turnNumber} Evaluation`,
      eventType: evaluationResult.isFollowUp ? "follow_up" : "question",
      description: `Candidate scored ${evaluationResult.evaluation.score}% on ${topic}.`,
      turnIndex: turnNumber - 1
    });

    // Select next question
    let nextQuestionText = '';
    let nextQuestionId = '';
    let nextTopic = '';
    let isFollowUp = evaluationResult.isFollowUp;

    if (isFollowUp && evaluationResult.adaptiveNextQuestion) {
      nextQuestionText = evaluationResult.adaptiveNextQuestion;
      nextQuestionId = `fup-${turnNumber}`;
      nextTopic = `${topic} (Follow-up Deep Dive)`;
    } else {
      // Pick next unasked question from pool
      const pool = await db.getQuestions({ companySlug: session.companySlug, roundType: session.roundType });
      const askedIds = updatedTurns.map(t => t.questionId);
      const nextQ = pool.find(q => !askedIds.includes(q.id)) || (await db.getQuestions()).find(q => !askedIds.includes(q.id));

      if (nextQ && turnNumber < 5) {
        nextQuestionText = nextQ.questionText;
        nextQuestionId = nextQ.id;
        nextTopic = nextQ.topic;
      } else {
        // End of interview rounds reached
        nextQuestionText = null;
      }
    }

    await db.updateInterviewSession(id, {
      turns: updatedTurns,
      replayTimeline: newTimelineEvents
    });

    return res.json({
      success: true,
      turnNumber,
      turnEvaluation: evaluationResult.evaluation,
      nextQuestion: nextQuestionText ? {
        questionId: nextQuestionId,
        questionText: nextQuestionText,
        topic: nextTopic,
        isFollowUp
      } : null,
      isCompleted: !nextQuestionText
    });
  } catch (err) {
    console.error('Answer evaluation error:', err);
    return res.status(500).json({ error: 'Failed to process answer.' });
  }
});

// POST /api/interviews/:id/finish
router.post('/:id/finish', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { behaviorMetrics } = req.body;

    const session = await db.getInterviewSessionById(id);
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ error: 'Interview session not found.' });
    }

    const autopsyEvaluation = aiEngine.generateInterviewAutopsy(session);

    const totalSeconds = behaviorMetrics?.totalDurationSeconds || (session.startedAt ? Math.max(15, Math.round((new Date() - new Date(session.startedAt)) / 1000)) : (session.durationMinutes || 15) * 60);
    const durationMinutes = behaviorMetrics?.durationMinutes || Math.max(1, Math.round(totalSeconds / 60));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const formattedDuration = behaviorMetrics?.formattedDuration || `${mins}m ${secs}s`;

    const mergedBehavior = {
      ...session.behaviorMetrics,
      ...(behaviorMetrics || {}),
      totalDurationSeconds: totalSeconds,
      durationMinutes,
      formattedDuration
    };

    const updatedSession = await db.updateInterviewSession(id, {
      status: 'completed',
      completedAt: new Date(),
      durationMinutes,
      behaviorMetrics: mergedBehavior,
      overallEvaluation: autopsyEvaluation
    });

    // Update user's long-term Readiness Profile
    const currentReadiness = await db.getReadinessProfile(req.user.id) || {};
    const prevOverall = currentReadiness.overallReadiness || 45;
    const newOverall = Math.round((prevOverall * 0.4) + (autopsyEvaluation.overallScore * 0.6));

    const updatedReadiness = await db.upsertReadinessProfile(req.user.id, {
      userId: req.user.id,
      overallReadiness: newOverall,
      streakDays: (currentReadiness.streakDays || 1) + 1,
      lastActiveDate: new Date(),
      skillMatrix: {
        dsa: { score: Math.min(95, (currentReadiness.skillMatrix?.dsa?.score || 55) + 6), trend: 'up' },
        dbms: { score: Math.min(95, (currentReadiness.skillMatrix?.dbms?.score || 50) + 8), trend: 'up' },
        oop: { score: Math.min(95, (currentReadiness.skillMatrix?.oop?.score || 60) + 5), trend: 'up' },
        systemDesign: { score: Math.min(95, (currentReadiness.skillMatrix?.systemDesign?.score || 45) + 7), trend: 'up' },
        webTech: { score: Math.min(95, (currentReadiness.skillMatrix?.webTech?.score || 65) + 4), trend: 'stable' },
        communication: { score: Math.min(95, autopsyEvaluation.communicationScore), trend: 'up' },
        projectDefense: { score: Math.min(95, (currentReadiness.skillMatrix?.projectDefense?.score || 50) + 5), trend: 'up' },
        problemSolving: { score: Math.min(95, autopsyEvaluation.problemSolvingScore), trend: 'up' }
      },
      weaknessEvolution: [
        ...(currentReadiness.weaknessEvolution || []),
        {
          topic: session.turns?.[0]?.questionType || "Technical Problem Solving",
          history: [
            { sessionDate: new Date().toLocaleDateString(), score: autopsyEvaluation.technicalScore, sessionType: session.companyName }
          ]
        }
      ],
      companyReadinessScores: [
        { companySlug: 'zoho', companyName: 'Zoho Corporation', score: Math.min(95, Math.round(newOverall * 0.95)), status: newOverall > 75 ? 'Ready' : 'In Progress' },
        { companySlug: 'tcs', companyName: 'TCS Digital', score: Math.min(95, Math.round(newOverall * 1.05)), status: newOverall > 65 ? 'Ready' : 'In Progress' },
        { companySlug: 'amazon', companyName: 'Amazon SDE-1', score: Math.min(95, Math.round(newOverall * 0.85)), status: newOverall > 80 ? 'Ready' : 'In Progress' },
        { companySlug: 'accenture', companyName: 'Accenture AASE', score: Math.min(95, Math.round(newOverall * 1.02)), status: newOverall > 60 ? 'Ready' : 'In Progress' }
      ],
      nextBestAction: {
        title: "Review Interview Autopsy & Target Weakness Areas",
        actionType: "autopsy_review",
        targetModule: "autopsy",
        reasoning: `Your latest ${session.companyName} session scored ${autopsyEvaluation.overallScore}%. Review timestamped missing concepts before your next attempt.`,
        estimatedMinutes: 10
      }
    });

    return res.json({
      success: true,
      message: 'Interview completed and autopsy report generated.',
      session: updatedSession,
      autopsy: autopsyEvaluation
    });
  } catch (err) {
    console.error('Finish interview error:', err);
    return res.status(500).json({ error: 'Failed to finish interview session.' });
  }
});

// GET /api/interviews/sessions
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const sessions = req.user.role === 'admin'
      ? await db.getAllInterviewSessions()
      : await db.getUserInterviewSessions(req.user.id);
    return res.json({ sessions });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch interview history.' });
  }
});

export default router;
