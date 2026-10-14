import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/store.js';
import { config } from '../config/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate JWT
function generateToken(userId, email, role = 'candidate') {
  return jwt.sign({ userId, email, role }, config.jwtSecret, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await db.findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = `usr-${uuidv4()}`;
    const newUser = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: 'candidate',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
      createdAt: new Date()
    };

    await db.createUser(newUser);

    // Initialize blank profile and readiness profile
    await db.upsertProfile(userId, {
      college: '',
      degree: 'B.Tech / B.E.',
      department: 'Computer Science and Engineering',
      graduationYear: 2026,
      skills: ['Data Structures', 'JavaScript', 'Algorithms'],
      programmingLanguages: ['Java', 'Python', 'C++'],
      targetRoles: ['Software Development Engineer'],
      targetCompanies: ['Zoho Corporation', 'TCS Digital', 'Amazon'],
      preferredDifficulty: 'Medium',
      onboardingCompleted: false
    });

    await db.upsertReadinessProfile(userId, {
      overallReadiness: 0,
      streakDays: 1,
      skillMatrix: {
        dsa: { score: 0, trend: 'stable' },
        dbms: { score: 0, trend: 'stable' },
        oop: { score: 0, trend: 'stable' },
        systemDesign: { score: 0, trend: 'stable' },
        webTech: { score: 0, trend: 'stable' },
        communication: { score: 0, trend: 'stable' },
        projectDefense: { score: 0, trend: 'stable' },
        problemSolving: { score: 0, trend: 'stable' }
      },
      weaknessEvolution: [],
      companyReadinessScores: [
        { companySlug: 'zoho', companyName: 'Zoho Corporation', score: 0, status: 'Not Evaluated' },
        { companySlug: 'tcs', companyName: 'TCS Digital', score: 0, status: 'Not Evaluated' },
        { companySlug: 'amazon', companyName: 'Amazon', score: 0, status: 'Not Evaluated' },
        { companySlug: 'accenture', companyName: 'Accenture', score: 0, status: 'Not Evaluated' },
        { companySlug: 'infosys', companyName: 'Infosys SP', score: 0, status: 'Not Evaluated' }
      ],
      nextBestAction: {
        title: "Complete your Placement Profile & First Technical Assessment",
        actionType: "profile_setup",
        targetModule: "profile",
        reasoning: "Configure your target companies and upload your resume to generate tailored interview questions.",
        estimatedMinutes: 5
      },
      recentAchievements: []
    });

    // CRITICAL: DO NOT automatically log in on register. Show success message & redirect to sign-in
    return res.status(201).json({
      success: true,
      message: 'Registration successful! Please sign in with your credentials to enter the platform.',
      redirectTo: '/login'
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server error occurred during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await db.findUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user.id, user.email, user.role);
    const profile = await db.findProfileByUserId(user.id);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      profile: profile || null,
      onboardingCompleted: profile ? profile.onboardingCompleted : false
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during authentication.' });
  }
});

// POST /api/auth/google-login
router.post('/google-login', async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;
    const cleanEmail = (email || 'google_user@interviewai.dev').toLowerCase().trim();
    const displayName = name || 'Google Candidate';

    let user = await db.findUserByEmail(cleanEmail);

    if (!user) {
      const userId = `usr-g-${uuidv4()}`;
      const dummySalt = await bcrypt.genSalt(10);
      const dummyHash = await bcrypt.hash(uuidv4(), dummySalt);

      user = {
        id: userId,
        name: displayName,
        email: cleanEmail,
        passwordHash: dummyHash,
        role: 'candidate',
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
        createdAt: new Date()
      };
      await db.createUser(user);

      await db.upsertProfile(userId, {
        college: '',
        degree: 'B.Tech / B.E.',
        department: 'Computer Science and Engineering',
        graduationYear: 2026,
        skills: ['Data Structures', 'JavaScript', 'Algorithms'],
        programmingLanguages: ['Java', 'Python', 'C++'],
        targetRoles: ['Software Development Engineer'],
        targetCompanies: ['Zoho Corporation', 'TCS Digital', 'Amazon'],
        preferredDifficulty: 'Medium',
        onboardingCompleted: false
      });
    }

    const token = generateToken(user.id, user.email, user.role);
    const profile = await db.findProfileByUserId(user.id);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      profile: profile || null,
      onboardingCompleted: profile ? profile.onboardingCompleted : false
    });
  } catch (err) {
    console.error('Google auth error:', err);
    return res.status(500).json({ error: 'Google sign-in authentication error.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  return res.json({
    success: true,
    message: `If an account with ${email} exists, password reset instructions have been dispatched.`
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.findUserById(req.user.id);
    const profile = await db.findProfileByUserId(req.user.id);
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      profile
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

export default router;
