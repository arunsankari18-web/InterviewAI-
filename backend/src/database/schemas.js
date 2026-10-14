import mongoose from 'mongoose';

const { Schema } = mongoose;

export const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'candidate' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const ProfileSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  college: { type: String, default: '' },
  degree: { type: String, default: '' },
  department: { type: String, default: '' },
  graduationYear: { type: Number, default: 2026 },
  skills: [{ type: String }],
  programmingLanguages: [{ type: String }],
  targetRoles: [{ type: String }],
  targetCompanies: [{ type: String }],
  preferredDifficulty: { type: String, default: 'Medium' },
  resumeUrl: { type: String, default: '' },
  resumeText: { type: String, default: '' },
  resumeParsedData: { type: Object, default: {} },
  onboardingCompleted: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

export const CompanySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logo: { type: String, default: '' },
  tier: { type: String, default: 'Tier 1' },
  overview: { type: String, required: true },
  difficulty: { type: String, default: 'Medium' },
  roles: [{ type: String }],
  hiringFocus: { type: String, default: '' },
  interviewRounds: [{
    roundNumber: Number,
    name: String,
    type: String,
    description: String,
    durationMinutes: Number,
    eliminationRate: String
  }],
  blueprint: {
    codingIntensity: Number, // 0-100
    technicalDepth: Number,
    systemDesignDepth: Number,
    problemSolvingWeight: Number,
    csCoreWeight: Number,
    behavioralWeight: Number,
    topFocusAreas: [String]
  },
  reportedExperiences: [{
    candidateRole: String,
    year: String,
    outcome: String,
    difficultyRating: String,
    summary: String,
    roundsDetailed: [String]
  }],
  placementTips: [String]
});

export const QuestionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  companySlug: { type: String, default: 'general' },
  role: { type: String, default: 'Software Engineer' },
  roundType: { type: String, default: 'Technical' }, // Technical, Coding, CS Core, System Design, Behavioral
  topic: { type: String, required: true },
  subTopic: { type: String, default: '' },
  difficulty: { type: String, default: 'Medium' }, // Easy, Medium, Hard
  questionText: { type: String, required: true },
  sourceType: {
    type: String,
    enum: ['Verified / Reported Question', 'Reported Interview Pattern', 'Company-Style Question', 'AI-Generated Follow-up'],
    default: 'Company-Style Question'
  },
  sourceMetadata: {
    reportedBy: String,
    reportingPeriod: String,
    frequencyScore: Number
  },
  expectedConcepts: [String],
  sampleAnswerSummary: String,
  followUpStarters: [String]
});

export const InterviewSessionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  companySlug: { type: String, default: 'general' },
  companyName: { type: String, default: 'General Placement' },
  targetRole: { type: String, default: 'Software Engineer' },
  roundType: { type: String, default: 'Technical' },
  difficulty: { type: String, default: 'Medium' },
  durationMinutes: { type: Number, default: 20 },
  mode: { type: String, default: 'voice_camera' }, // voice_camera, voice_only, text_only
  status: { type: String, default: 'in_progress' }, // in_progress, completed, abandoned
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  turns: [{
    turnNumber: Number,
    questionId: String,
    questionText: String,
    questionType: String,
    timestamp: String,
    answerText: String,
    audioDurationSeconds: Number,
    evaluation: {
      score: Number, // 0 - 100
      technicalDepth: Number,
      completeness: Number,
      clarity: Number,
      coveredConcepts: [String],
      missingConcepts: [String],
      strengths: [String],
      weaknesses: [String],
      improvementAdvice: String,
      isContextualFollowUp: Boolean
    }
  }],
  behaviorMetrics: {
    faceDetectedPercentage: { type: Number, default: 92 },
    eyeContactConsistency: { type: Number, default: 85 },
    gazeAwayIncidents: { type: Number, default: 3 },
    averageSpeakingPaceWpm: { type: Number, default: 135 },
    fillerWordCount: { type: Number, default: 6 },
    longPausesCount: { type: Number, default: 2 },
    speechClarityScore: { type: Number, default: 88 }
  },
  overallEvaluation: {
    overallScore: Number,
    technicalScore: Number,
    communicationScore: Number,
    problemSolvingScore: Number,
    companyFitScore: Number,
    summaryVerdic: String,
    keyStrengths: [String],
    criticalGaps: [String],
    actionableTips: [String]
  },
  replayTimeline: [{
    timeOffset: String,
    eventTitle: String,
    eventType: String,
    description: String,
    turnIndex: Number
  }]
});

export const ResumeDefenseSessionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  resumeClaims: [{
    claimId: String,
    category: String, // skill, project, technology, internship
    text: String,
    techStack: [String]
  }],
  interrogations: [{
    claimId: String,
    question: String,
    userAnswer: String,
    verdict: {
      type: String,
      enum: ['Explained well', 'Partially explained', 'Needs deeper understanding', 'Unable to explain']
    },
    technicalDepthScore: Number,
    feedback: String,
    missingImplementationDetails: [String]
  }],
  credibilityMap: [{
    skillOrTech: String,
    status: String, // 'Explained well', 'Partially explained', 'Needs deeper understanding', 'Unable to explain'
    notes: String
  }],
  unsupportedClaims: [String],
  createdAt: { type: Date, default: Date.now }
});

export const TechnicalAttemptSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  problemId: { type: String, required: true },
  problemTitle: { type: String, required: true },
  category: { type: String, required: true },
  language: { type: String, default: 'javascript' },
  codeSubmitted: { type: String, required: true },
  testResults: [{
    testIndex: Number,
    input: String,
    expected: String,
    actual: String,
    passed: Boolean
  }],
  allPassed: { type: Boolean, default: false },
  executionTimeMs: { type: Number, default: 12 },
  timeComplexity: { type: String, default: 'O(N)' },
  spaceComplexity: { type: String, default: 'O(1)' },
  codeDefense: [{
    question: String,
    answer: String,
    feedback: String,
    score: Number
  }],
  submittedAt: { type: Date, default: Date.now }
});

export const ChallengeResultSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  challengeType: { type: String, required: true }, // pressure_round, technical_deep_dive, weakness_attack, communication_challenge, project_defense, hr_challenge, final_placement
  challengeTitle: { type: String, required: true },
  score: { type: Number, required: true },
  timeSpentSeconds: { type: Number, default: 0 },
  metrics: { type: Object, default: {} },
  feedback: [String],
  achievementsUnlocked: [String],
  createdAt: { type: Date, default: Date.now }
});

export const ReadinessProfileSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  overallReadiness: { type: Number, default: 0 },
  streakDays: { type: Number, default: 1 },
  lastActiveDate: { type: Date, default: Date.now },
  skillMatrix: {
    dsa: { score: Number, trend: String },
    dbms: { score: Number, trend: String },
    oop: { score: Number, trend: String },
    systemDesign: { score: Number, trend: String },
    webTech: { score: Number, trend: String },
    communication: { score: Number, trend: String },
    projectDefense: { score: Number, trend: String },
    problemSolving: { score: Number, trend: String }
  },
  weaknessEvolution: [{
    topic: String,
    history: [{
      sessionDate: String,
      score: Number,
      sessionType: String
    }]
  }],
  companyReadinessScores: [{
    companySlug: String,
    companyName: String,
    score: Number,
    status: String
  }],
  nextBestAction: {
    title: String,
    actionType: String,
    targetModule: String,
    reasoning: String,
    estimatedMinutes: Number
  },
  recentAchievements: [{
    id: String,
    title: String,
    icon: String,
    unlockedAt: String,
    description: String
  }],
  updatedAt: { type: Date, default: Date.now }
});
