import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { codeRunner } from '../services/codeRunner.service.js';

const router = express.Router();

// GET /api/technical/problems
router.get('/problems', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    let problems = db.getTechnicalProblems();

    if (category && category !== 'All') {
      const catLower = category.toLowerCase();
      if (catLower.includes('zoho')) {
        problems = problems.filter(p => p.companyTag?.toLowerCase().includes('zoho'));
      } else if (catLower.includes('amazon')) {
        problems = problems.filter(p => p.companyTag?.toLowerCase().includes('amazon'));
      } else if (catLower.includes('tcs')) {
        problems = problems.filter(p => p.companyTag?.toLowerCase().includes('tcs'));
      } else if (catLower.includes('recommend')) {
        // Return diverse top recommendations for placement candidate
        problems = problems.filter(p => p.difficulty === 'Easy' || p.difficulty === 'Medium');
      } else {
        problems = problems.filter(p => p.category.toLowerCase() === catLower || p.category.toLowerCase().includes(catLower));
      }
    }
    if (difficulty && difficulty !== 'All') {
      problems = problems.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    return res.json({ problems });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch technical problems.' });
  }
});

// GET /api/technical/problems/:id
router.get('/problems/:id', async (req, res) => {
  try {
    const problem = db.getTechnicalProblemById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found in technical arena.' });
    }
    return res.json({ problem });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve problem details.' });
  }
});

// POST /api/technical/execute
router.post('/execute', authenticateToken, async (req, res) => {
  try {
    const { problemId, language = 'javascript', code } = req.body;

    if (!problemId || !code) {
      return res.status(400).json({ error: 'Problem ID and source code are required.' });
    }

    const problem = db.getTechnicalProblemById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    const runResult = await codeRunner.executeCode({
      problemId,
      language,
      code,
      testCases: problem.testCases || []
    });

    const attemptId = `att-${uuidv4()}`;
    const newAttempt = {
      id: attemptId,
      userId: req.user.id,
      problemId,
      problemTitle: problem.title,
      category: problem.category,
      language,
      codeSubmitted: code,
      testResults: runResult.testResults,
      allPassed: runResult.allPassed,
      executionTimeMs: runResult.executionTimeMs,
      timeComplexity: runResult.timeComplexity,
      spaceComplexity: runResult.spaceComplexity,
      codeDefense: [],
      submittedAt: new Date()
    };

    await db.createTechnicalAttempt(newAttempt);

    // Prompt the first Code Defense question
    const defenseQuestion = problem.defenseQuestions?.[0] || 'Explain the time and space complexity of your solution.';

    return res.json({
      success: true,
      attemptId,
      runResult,
      defensePrompt: {
        question: defenseQuestion,
        instruction: "Solve → Execute → Explain → Defend. Defend your algorithmic design choices below."
      }
    });
  } catch (err) {
    console.error('Code execution error:', err);
    return res.status(500).json({ error: 'Failed to execute code in sandbox.' });
  }
});

// POST /api/technical/defense
router.post('/defense', authenticateToken, async (req, res) => {
  try {
    const { attemptId, question, answer } = req.body;

    const evalResult = codeRunner.evaluateCodeDefense({
      question,
      answerText: answer
    });

    return res.json({
      success: true,
      score: evalResult.score,
      feedback: evalResult.feedback
    });
  } catch (err) {
    console.error('Code defense error:', err);
    return res.status(500).json({ error: 'Failed to evaluate code defense answer.' });
  }
});

export default router;
