import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { config } from '../config/index.js';
import {
  UserSchema,
  ProfileSchema,
  CompanySchema,
  QuestionSchema,
  InterviewSessionSchema,
  ResumeDefenseSessionSchema,
  TechnicalAttemptSchema,
  ChallengeResultSchema,
  ReadinessProfileSchema
} from './schemas.js';
import { seedCompanies, seedQuestions, seedTechnicalProblems, seedChallengeModes } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Mongoose Models
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
export const CompanyModel = mongoose.models.Company || mongoose.model('Company', CompanySchema);
export const QuestionModel = mongoose.models.Question || mongoose.model('Question', QuestionSchema);
export const InterviewSessionModel = mongoose.models.InterviewSession || mongoose.model('InterviewSession', InterviewSessionSchema);
export const ResumeDefenseModel = mongoose.models.ResumeDefense || mongoose.model('ResumeDefense', ResumeDefenseSessionSchema);
export const TechnicalAttemptModel = mongoose.models.TechnicalAttempt || mongoose.model('TechnicalAttempt', TechnicalAttemptSchema);
export const ChallengeResultModel = mongoose.models.ChallengeResult || mongoose.model('ChallengeResult', ChallengeResultSchema);
export const ReadinessProfileModel = mongoose.models.ReadinessProfile || mongoose.model('ReadinessProfile', ReadinessProfileSchema);

let isMongoConnected = false;

// Fallback JSON DB State
let localDb = {
  users: [],
  profiles: [],
  companies: [...seedCompanies],
  questions: [...seedQuestions],
  technicalProblems: [...seedTechnicalProblems],
  challengeModes: [...seedChallengeModes],
  interviewSessions: [],
  resumeDefenseSessions: [],
  technicalAttempts: [],
  challengeResults: [],
  readinessProfiles: []
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadLocalDb() {
  ensureDataDir();
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      localDb = {
        ...localDb,
        ...parsed,
        companies: seedCompanies,
        questions: seedQuestions,
        technicalProblems: seedTechnicalProblems,
        challengeModes: seedChallengeModes
      };
    } catch (err) {
      console.warn('Could not read existing fallback db file, initializing with seeds:', err.message);
    }
  } else {
    saveLocalDb();
  }
}

function saveLocalDb() {
  ensureDataDir();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local fallback database:', err);
  }
}

export async function initDatabase() {
  loadLocalDb();
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB at:', config.mongoUri);
    await seedMongoIfEmpty();
  } catch (err) {
    isMongoConnected = false;
    console.warn(`⚠️ MongoDB connection unavailable (${err.message}). Using high-fidelity resilient persistent store.`);
  }
}

async function seedMongoIfEmpty() {
  if (!isMongoConnected) return;
  try {
    const compCount = await CompanyModel.countDocuments();
    if (compCount === 0) {
      await CompanyModel.insertMany(seedCompanies);
      console.log('🌱 Seeded Companies into MongoDB');
    }
    const qCount = await QuestionModel.countDocuments();
    if (qCount === 0) {
      await QuestionModel.insertMany(seedQuestions);
      console.log('🌱 Seeded Questions into MongoDB');
    }
  } catch (e) {
    console.warn('Mongo seeding error:', e.message);
  }
}

// Unified Store Methods
export const db = {
  get isMongo() {
    return isMongoConnected;
  },

  // USERS
  async findUserByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (isMongoConnected) {
      return await UserModel.findOne({ email: cleanEmail }).lean();
    }
    return localDb.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findUserById(id) {
    if (isMongoConnected) {
      return await UserModel.findOne({ id }).lean();
    }
    return localDb.users.find(u => u.id === id) || null;
  },

  async getAllUsers() {
    if (isMongoConnected) {
      return await UserModel.find().lean();
    }
    return localDb.users;
  },

  async deleteUser(userId) {
    if (isMongoConnected) {
      await UserModel.deleteOne({ id: userId });
      await ProfileModel.deleteOne({ userId });
      await ReadinessProfileModel.deleteOne({ userId });
      return true;
    }
    localDb.users = localDb.users.filter(u => u.id !== userId);
    localDb.profiles = localDb.profiles.filter(p => p.userId !== userId);
    localDb.readinessProfiles = localDb.readinessProfiles.filter(r => r.userId !== userId);
    saveLocalDb();
    return true;
  },

  async createUser(userData) {
    if (isMongoConnected) {
      const doc = new UserModel(userData);
      await doc.save();
      return doc.toObject();
    }
    localDb.users.push(userData);
    saveLocalDb();
    return userData;
  },

  // PROFILES
  async getAllProfiles() {
    if (isMongoConnected) {
      return await ProfileModel.find().lean();
    }
    return localDb.profiles;
  },

  async findProfileByUserId(userId) {
    if (isMongoConnected) {
      return await ProfileModel.findOne({ userId }).lean();
    }
    return localDb.profiles.find(p => p.userId === userId) || null;
  },

  async upsertProfile(userId, profileData) {
    const now = new Date();
    if (isMongoConnected) {
      const updated = await ProfileModel.findOneAndUpdate(
        { userId },
        { ...profileData, updatedAt: now },
        { upsert: true, new: true }
      ).lean();
      return updated;
    }
    const idx = localDb.profiles.findIndex(p => p.userId === userId);
    const newProfile = { userId, ...profileData, updatedAt: now };
    if (idx >= 0) {
      localDb.profiles[idx] = { ...localDb.profiles[idx], ...newProfile };
    } else {
      localDb.profiles.push(newProfile);
    }
    saveLocalDb();
    return idx >= 0 ? localDb.profiles[idx] : newProfile;
  },

  // COMPANIES
  async getCompanies() {
    if (isMongoConnected) {
      return await CompanyModel.find().lean();
    }
    return localDb.companies;
  },

  async getCompanyBySlug(slug) {
    if (isMongoConnected) {
      return await CompanyModel.findOne({ slug }).lean();
    }
    return localDb.companies.find(c => c.slug === slug) || null;
  },

  // QUESTIONS
  async getQuestions(filters = {}) {
    if (isMongoConnected) {
      const q = {};
      if (filters.companySlug) q.companySlug = filters.companySlug;
      if (filters.roundType) q.roundType = filters.roundType;
      if (filters.difficulty) q.difficulty = filters.difficulty;
      return await QuestionModel.find(q).lean();
    }
    return localDb.questions.filter(q => {
      if (filters.companySlug && q.companySlug !== filters.companySlug && q.companySlug !== 'general') return false;
      if (filters.roundType && q.roundType !== filters.roundType) return false;
      if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
      return true;
    });
  },

  // TECHNICAL PROBLEMS
  getTechnicalProblems() {
    return localDb.technicalProblems?.length >= seedTechnicalProblems.length
      ? localDb.technicalProblems
      : seedTechnicalProblems;
  },

  getTechnicalProblemById(id) {
    return (
      localDb.technicalProblems?.find(p => p.id === id) ||
      seedTechnicalProblems.find(p => p.id === id) ||
      null
    );
  },

  // CHALLENGE MODES
  getChallengeModes() {
    return localDb.challengeModes;
  },

  getChallengeModeById(id) {
    return localDb.challengeModes.find(c => c.id === id) || null;
  },

  // INTERVIEW SESSIONS
  async createInterviewSession(session) {
    if (isMongoConnected) {
      const doc = new InterviewSessionModel(session);
      await doc.save();
      return doc.toObject();
    }
    localDb.interviewSessions.push(session);
    saveLocalDb();
    return session;
  },

  async getInterviewSessionById(id) {
    if (isMongoConnected) {
      return await InterviewSessionModel.findOne({ id }).lean();
    }
    return localDb.interviewSessions.find(s => s.id === id) || null;
  },

  async updateInterviewSession(id, updates) {
    if (isMongoConnected) {
      return await InterviewSessionModel.findOneAndUpdate({ id }, updates, { new: true }).lean();
    }
    const idx = localDb.interviewSessions.findIndex(s => s.id === id);
    if (idx >= 0) {
      localDb.interviewSessions[idx] = { ...localDb.interviewSessions[idx], ...updates };
      saveLocalDb();
      return localDb.interviewSessions[idx];
    }
    return null;
  },

  async getUserInterviewSessions(userId) {
    if (isMongoConnected) {
      return await InterviewSessionModel.find({ userId }).sort({ startedAt: -1 }).lean();
    }
    return localDb.interviewSessions
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  },

  async getAllInterviewSessions() {
    if (isMongoConnected) {
      return await InterviewSessionModel.find().sort({ startedAt: -1 }).lean();
    }
    return [...localDb.interviewSessions].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  },

  // RESUME DEFENSE SESSIONS
  async createResumeDefenseSession(session) {
    if (isMongoConnected) {
      const doc = new ResumeDefenseModel(session);
      await doc.save();
      return doc.toObject();
    }
    localDb.resumeDefenseSessions.push(session);
    saveLocalDb();
    return session;
  },

  async getResumeDefenseSessionById(id) {
    if (isMongoConnected) {
      return await ResumeDefenseModel.findOne({ id }).lean();
    }
    return localDb.resumeDefenseSessions.find(s => s.id === id) || null;
  },

  async updateResumeDefenseSession(id, updates) {
    if (isMongoConnected) {
      return await ResumeDefenseModel.findOneAndUpdate({ id }, updates, { new: true }).lean();
    }
    const idx = localDb.resumeDefenseSessions.findIndex(s => s.id === id);
    if (idx >= 0) {
      localDb.resumeDefenseSessions[idx] = { ...localDb.resumeDefenseSessions[idx], ...updates };
      saveLocalDb();
      return localDb.resumeDefenseSessions[idx];
    }
    return null;
  },

  async getUserResumeDefenseSessions(userId) {
    if (isMongoConnected) {
      return await ResumeDefenseModel.find({ userId }).sort({ createdAt: -1 }).lean();
    }
    return localDb.resumeDefenseSessions
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getAllResumeDefenseSessions() {
    if (isMongoConnected) {
      return await ResumeDefenseModel.find().sort({ createdAt: -1 }).lean();
    }
    return [...localDb.resumeDefenseSessions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // TECHNICAL ATTEMPTS
  async createTechnicalAttempt(attempt) {
    if (isMongoConnected) {
      const doc = new TechnicalAttemptModel(attempt);
      await doc.save();
      return doc.toObject();
    }
    localDb.technicalAttempts.push(attempt);
    saveLocalDb();
    return attempt;
  },

  async getUserTechnicalAttempts(userId) {
    if (isMongoConnected) {
      return await TechnicalAttemptModel.find({ userId }).sort({ submittedAt: -1 }).lean();
    }
    return localDb.technicalAttempts
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },

  async getAllTechnicalAttempts() {
    if (isMongoConnected) {
      return await TechnicalAttemptModel.find().sort({ submittedAt: -1 }).lean();
    }
    return [...localDb.technicalAttempts].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },

  // CHALLENGE RESULTS
  async createChallengeResult(result) {
    if (isMongoConnected) {
      const doc = new ChallengeResultModel(result);
      await doc.save();
      return doc.toObject();
    }
    localDb.challengeResults.push(result);
    saveLocalDb();
    return result;
  },

  async getUserChallengeResults(userId) {
    if (isMongoConnected) {
      return await ChallengeResultModel.find({ userId }).sort({ createdAt: -1 }).lean();
    }
    return localDb.challengeResults
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // READINESS PROFILES
  async getReadinessProfile(userId) {
    if (isMongoConnected) {
      return await ReadinessProfileModel.findOne({ userId }).lean();
    }
    return localDb.readinessProfiles.find(r => r.userId === userId) || null;
  },

  async upsertReadinessProfile(userId, profileData) {
    if (isMongoConnected) {
      return await ReadinessProfileModel.findOneAndUpdate(
        { userId },
        { ...profileData, updatedAt: new Date() },
        { upsert: true, new: true }
      ).lean();
    }
    const idx = localDb.readinessProfiles.findIndex(r => r.userId === userId);
    const newProfile = { userId, ...profileData, updatedAt: new Date() };
    if (idx >= 0) {
      localDb.readinessProfiles[idx] = { ...localDb.readinessProfiles[idx], ...newProfile };
    } else {
      localDb.readinessProfiles.push(newProfile);
    }
    saveLocalDb();
    return idx >= 0 ? localDb.readinessProfiles[idx] : newProfile;
  }
};
