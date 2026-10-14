import express from 'express';
import { db } from '../database/store.js';

const router = express.Router();

// GET /api/companies
router.get('/', async (req, res) => {
  try {
    const companies = await db.getCompanies();
    return res.json({ companies });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve companies list.' });
  }
});

// GET /api/companies/:slug
router.get('/:slug', async (req, res) => {
  try {
    const company = await db.getCompanyBySlug(req.params.slug);
    if (!company) {
      return res.status(404).json({ error: 'Company not found in intelligence registry.' });
    }
    const questions = await db.getQuestions({ companySlug: req.params.slug });
    return res.json({ company, reportedQuestions: questions });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve company details.' });
  }
});

// GET /api/companies/compare/:slugA/:slugB
router.get('/compare/:slugA/:slugB', async (req, res) => {
  try {
    const compA = await db.getCompanyBySlug(req.params.slugA);
    const compB = await db.getCompanyBySlug(req.params.slugB);

    if (!compA || !compB) {
      return res.status(404).json({ error: 'One or both companies not found for comparison.' });
    }

    const comparison = {
      companyA: compA,
      companyB: compB,
      matrix: {
        difficulty: { a: compA.difficulty, b: compB.difficulty },
        roundsCount: { a: compA.interviewRounds.length, b: compB.interviewRounds.length },
        codingIntensity: { a: compA.blueprint.codingIntensity, b: compB.blueprint.codingIntensity },
        technicalDepth: { a: compA.blueprint.technicalDepth, b: compB.blueprint.technicalDepth },
        systemDesignDepth: { a: compA.blueprint.systemDesignDepth, b: compB.blueprint.systemDesignDepth },
        problemSolvingWeight: { a: compA.blueprint.problemSolvingWeight, b: compB.blueprint.problemSolvingWeight },
        csCoreWeight: { a: compA.blueprint.csCoreWeight, b: compB.blueprint.csCoreWeight },
        behavioralWeight: { a: compA.blueprint.behavioralWeight, b: compB.blueprint.behavioralWeight }
      }
    };

    return res.json(comparison);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate company comparison.' });
  }
});

export default router;
