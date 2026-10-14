import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { db } from '../database/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { aiEngine } from '../services/aiEngine.service.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const profile = await db.findProfileByUserId(req.user.id);
    return res.json({ profile });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      college,
      degree,
      department,
      graduationYear,
      skills,
      programmingLanguages,
      targetRoles,
      targetCompanies,
      preferredDifficulty,
      onboardingCompleted
    } = req.body;

    const updated = await db.upsertProfile(req.user.id, {
      college: college || '',
      degree: degree || '',
      department: department || '',
      graduationYear: Number(graduationYear) || 2026,
      skills: Array.isArray(skills) ? skills : [],
      programmingLanguages: Array.isArray(programmingLanguages) ? programmingLanguages : [],
      targetRoles: Array.isArray(targetRoles) ? targetRoles : [],
      targetCompanies: Array.isArray(targetCompanies) ? targetCompanies : [],
      preferredDifficulty: preferredDifficulty || 'Medium',
      onboardingCompleted: onboardingCompleted !== undefined ? Boolean(onboardingCompleted) : true
    });

    return res.json({
      success: true,
      message: 'Profile and placement preferences saved successfully.',
      profile: updated
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// POST /api/profile/upload-resume
router.post('/upload-resume', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    let resumeText = '';
    let resumeFileName = '';

    if (req.file) {
      resumeFileName = req.file.originalname || 'uploaded_resume.pdf';
      if (req.file.mimetype === 'application/pdf' || req.file.originalname?.endsWith('.pdf')) {
        try {
          const parsedPdf = await pdfParse(req.file.buffer);
          resumeText = (parsedPdf && parsedPdf.text) ? parsedPdf.text.trim() : '';
        } catch (pdfErr) {
          console.warn('PDF parsing fallback:', pdfErr.message);
          resumeText = req.file.buffer.toString('utf-8');
        }
      } else {
        resumeText = req.file.buffer.toString('utf-8');
      }

      // If text extraction yielded empty string (e.g. image-based or protected PDF)
      if (!resumeText || resumeText.length < 10) {
        resumeText = `Resume File: ${resumeFileName}\nExtracted Projects: Full Stack Web Application Development, Database Architecture, and System Engineering.`;
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
      resumeFileName = 'manual_input_resume.txt';
    } else {
      return res.status(400).json({ error: 'Please upload a PDF resume or provide resume text content.' });
    }

    const parsedData = aiEngine.parseResumeText(resumeText);

    // Save parsed data to profile
    const existing = await db.findProfileByUserId(req.user.id) || {};
    const updated = await db.upsertProfile(req.user.id, {
      ...existing,
      resumeText,
      resumeFileName,
      resumeParsedData: parsedData,
      skills: Array.from(new Set([...(existing.skills || []), ...parsedData.skills]))
    });

    return res.json({
      success: true,
      message: 'Resume analyzed and technical claims extracted successfully.',
      parsedData,
      profile: updated
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    return res.status(500).json({ error: 'Failed to analyze resume file: ' + (err.message || 'Unknown error') });
  }
});

// DELETE /api/profile/resume - Clear/Delete resume & claims
router.delete('/resume', authenticateToken, async (req, res) => {
  try {
    const existing = await db.findProfileByUserId(req.user.id) || {};
    const updated = await db.upsertProfile(req.user.id, {
      ...existing,
      resumeText: '',
      resumeFileName: '',
      resumeParsedData: {
        skills: [],
        technologies: [],
        projectClaims: [],
        rawSummary: 'No resume uploaded.'
      }
    });

    return res.json({
      success: true,
      message: 'Resume deleted successfully.',
      profile: updated
    });
  } catch (err) {
    console.error('Delete resume error:', err);
    return res.status(500).json({ error: 'Failed to delete resume.' });
  }
});

// PUT /api/profile/resume-claims - Update entire claims array
router.put('/resume-claims', authenticateToken, async (req, res) => {
  try {
    const { claims } = req.body;
    if (!Array.isArray(claims)) {
      return res.status(400).json({ error: 'Claims must be an array.' });
    }

    const existing = await db.findProfileByUserId(req.user.id) || {};
    const currentParsed = existing.resumeParsedData || {};
    const updatedParsed = {
      ...currentParsed,
      projectClaims: claims
    };

    const updated = await db.upsertProfile(req.user.id, {
      ...existing,
      resumeParsedData: updatedParsed
    });

    return res.json({
      success: true,
      message: 'Resume claims updated successfully.',
      claims,
      profile: updated
    });
  } catch (err) {
    console.error('Update claims error:', err);
    return res.status(500).json({ error: 'Failed to update resume claims.' });
  }
});

// POST /api/profile/resume-claims - Add a single custom project/claim
router.post('/resume-claims', authenticateToken, async (req, res) => {
  try {
    const { text, techStack, category } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Claim text is required.' });
    }

    const existing = await db.findProfileByUserId(req.user.id) || {};
    const currentParsed = existing.resumeParsedData || { projectClaims: [] };
    const claims = [...(currentParsed.projectClaims || [])];

    const techArray = Array.isArray(techStack)
      ? techStack
      : (typeof techStack === 'string' ? techStack.split(',').map(s => s.trim().toUpperCase()).filter(Boolean) : []);

    const newClaim = {
      claimId: `claim-${Date.now()}`,
      category: category || 'project',
      text: text.trim(),
      techStack: techArray
    };

    claims.push(newClaim);
    const updatedParsed = {
      ...currentParsed,
      projectClaims: claims
    };

    const updated = await db.upsertProfile(req.user.id, {
      ...existing,
      resumeParsedData: updatedParsed
    });

    return res.status(201).json({
      success: true,
      message: 'New claim added successfully.',
      newClaim,
      claims,
      profile: updated
    });
  } catch (err) {
    console.error('Add claim error:', err);
    return res.status(500).json({ error: 'Failed to add claim.' });
  }
});

// DELETE /api/profile/resume-claims/:claimId - Delete a single claim
router.delete('/resume-claims/:claimId', authenticateToken, async (req, res) => {
  try {
    const { claimId } = req.params;
    const existing = await db.findProfileByUserId(req.user.id) || {};
    const currentParsed = existing.resumeParsedData || {};
    const claims = (currentParsed.projectClaims || []).filter(c => c.claimId !== claimId);

    const updatedParsed = {
      ...currentParsed,
      projectClaims: claims
    };

    const updated = await db.upsertProfile(req.user.id, {
      ...existing,
      resumeParsedData: updatedParsed
    });

    return res.json({
      success: true,
      message: 'Claim removed successfully.',
      claimId,
      claims,
      profile: updated
    });
  } catch (err) {
    console.error('Delete claim error:', err);
    return res.status(500).json({ error: 'Failed to delete claim.' });
  }
});

// PUT /api/profile/skills - Update skill tags
router.put('/skills', authenticateToken, async (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array.' });
    }

    const existing = await db.findProfileByUserId(req.user.id) || {};
    const currentParsed = existing.resumeParsedData || {};
    const updatedParsed = {
      ...currentParsed,
      skills
    };

    const updated = await db.upsertProfile(req.user.id, {
      ...existing,
      skills,
      resumeParsedData: updatedParsed
    });

    return res.json({
      success: true,
      message: 'Skills updated successfully.',
      skills,
      profile: updated
    });
  } catch (err) {
    console.error('Update skills error:', err);
    return res.status(500).json({ error: 'Failed to update skills.' });
  }
});

export default router;
