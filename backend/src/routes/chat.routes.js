import express from 'express';
import { chatCounselorService } from '../services/chatCounselor.service.js';

const router = express.Router();

// POST /api/chat/ask - Dynamic Placement Counselor
router.post('/ask', async (req, res) => {
  try {
    const { message = '', language = 'en', context = {} } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const response = await chatCounselorService.generateResponse({
      message: message.trim(),
      language,
      context
    });

    return res.json({
      success: true,
      ...response
    });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({
      error: 'Failed to process chat query.',
      reply: 'An unexpected error occurred while processing your question. Please try asking again.'
    });
  }
});

export default router;
