import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { aiEngine } from '../services/aiEngine.service.js';

const router = express.Router();

// POST /api/resume-defense/initiate
router.post('/initiate', authenticateToken, async (req, res) => {
  try {
    const profile = await db.findProfileByUserId(req.user.id);
    const parsed = profile?.resumeParsedData || {};
    let claims = parsed.projectClaims || [];

    if (claims.length === 0) {
      // Generate default claims based on profile skills
      const userSkills = profile?.skills?.length ? profile.skills : ['React', 'Node.js', 'MongoDB', 'Redis', 'Python'];
      claims = [
        { claimId: 'c1', category: 'project', text: `Engineered a full-stack platform using ${userSkills.slice(0, 2).join(' and ')} with REST API architecture.`, techStack: userSkills.slice(0, 2) },
        { claimId: 'c2', category: 'technology', text: `Managed database queries, indexing and data caching with ${userSkills[2] || 'PostgreSQL'} and ${userSkills[3] || 'Redis'}.`, techStack: [userSkills[2] || 'PostgreSQL', userSkills[3] || 'Redis'] },
        { claimId: 'c3', category: 'skill', text: `Designed asynchronous workflows and state management using ${userSkills[0] || 'React'} and modern event handlers.`, techStack: [userSkills[0] || 'React'] }
      ];
    }

    const firstClaim = claims[0];
    const initialQuestion = aiEngine.generateResumeInterrogation(firstClaim);

    const defenseId = `rd-${uuidv4()}`;
    const newDefenseSession = {
      id: defenseId,
      userId: req.user.id,
      resumeClaims: claims,
      interrogations: [],
      credibilityMap: claims.map(c => ({
        skillOrTech: c.techStack?.[0] || c.category,
        status: 'Needs deeper understanding',
        notes: 'Pending candidate defense interrogation'
      })),
      unsupportedClaims: [],
      createdAt: new Date()
    };

    await db.createResumeDefenseSession(newDefenseSession);

    return res.status(201).json({
      success: true,
      defenseId,
      claimsCount: claims.length,
      firstInterrogation: {
        claimId: firstClaim.claimId,
        claimText: firstClaim.text,
        techStack: firstClaim.techStack,
        question: initialQuestion
      }
    });
  } catch (err) {
    console.error('Initiate resume defense error:', err);
    return res.status(500).json({ error: 'Failed to initiate Resume Defense session.' });
  }
});

// POST /api/resume-defense/:id/interrogate
router.post('/:id/interrogate', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { claimId, question, userAnswer } = req.body;

    const session = await db.getResumeDefenseSessionById(id);
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ error: 'Resume defense session not found.' });
    }

    const currentClaim = session.resumeClaims.find(c => c.claimId === claimId) || session.resumeClaims[0];
    const evaluation = aiEngine.evaluateResumeDefense({
      claim: currentClaim,
      question,
      answerText: userAnswer
    });

    const interrogationEntry = {
      claimId,
      question,
      userAnswer,
      verdict: evaluation.verdict,
      technicalDepthScore: evaluation.technicalDepthScore,
      feedback: evaluation.feedback,
      missingImplementationDetails: evaluation.missingImplementationDetails
    };

    const updatedInterrogations = [...(session.interrogations || []), interrogationEntry];

    // Update credibility map
    const skillName = currentClaim.techStack?.[0] || 'Project Claim';
    const updatedMap = (session.credibilityMap || []).map(item => {
      if (item.skillOrTech === skillName || item.skillOrTech === currentClaim.category) {
        return {
          skillOrTech: skillName,
          status: evaluation.verdict,
          notes: evaluation.feedback
        };
      }
      return item;
    });

    // Check if skill was already in map
    if (!updatedMap.some(m => m.skillOrTech === skillName)) {
      updatedMap.push({
        skillOrTech: skillName,
        status: evaluation.verdict,
        notes: evaluation.feedback
      });
    }

    const unsupported = [...(session.unsupportedClaims || [])];
    if (evaluation.verdict === 'Unable to explain') {
      unsupported.push(`Claim: "${currentClaim.text}" — unable to articulate architecture or trade-offs.`);
    }

    // Determine next claim
    const answeredIds = updatedInterrogations.map(i => i.claimId);
    const nextClaim = session.resumeClaims.find(c => !answeredIds.includes(c.claimId));
    let nextInterrogation = null;

    if (nextClaim) {
      const nextQ = aiEngine.generateResumeInterrogation(nextClaim);
      nextInterrogation = {
        claimId: nextClaim.claimId,
        claimText: nextClaim.text,
        techStack: nextClaim.techStack,
        question: nextQ
      };
    }

    const updatedSession = await db.updateResumeDefenseSession(id, {
      interrogations: updatedInterrogations,
      credibilityMap: updatedMap,
      unsupportedClaims: unsupported
    });

    return res.json({
      success: true,
      evaluation,
      credibilityMap: updatedMap,
      unsupportedClaims: unsupported,
      nextInterrogation,
      isFinished: !nextInterrogation
    });
  } catch (err) {
    console.error('Resume defense interrogation error:', err);
    return res.status(500).json({ error: 'Failed to process resume defense answer.' });
  }
});

// GET /api/resume-defense/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const session = await db.getResumeDefenseSessionById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Resume defense session not found.' });
    }
    return res.json({ session });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve defense report.' });
  }
});

export default router;
