import { Router } from 'express';
import { checkSafety } from '../utils/safetyCheck.js';
import { generateChatReply } from '../services/geminiService.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Input length guard
const MAX_MESSAGE_LENGTH = 1500;
const MAX_MESSAGES_COUNT = 30;

router.post('/', submissionLimiter, async (req, res) => {
  try {
    const { messages, language = 'en' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required and cannot be empty.'
      });
    }

    // Guard array length and individual message length
    if (messages.length > MAX_MESSAGES_COUNT) {
      return res.status(400).json({
        success: false,
        error: `Maximum history limit (${MAX_MESSAGES_COUNT} messages) exceeded.`
      });
    }

    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || typeof latestMessage.content !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Latest message content must be a valid string.'
      });
    }

    if (latestMessage.content.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `Message exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`
      });
    }

    const lang = ['en', 'te', 'hi'].includes(language) ? language : 'en';

    // 1. RULE-BASED SAFETY CHECK RUNS FIRST (BEFORE ANY AI CALL)
    // Check both latest message and recent context for red flags
    const safetyResult = checkSafety({ messages }, lang);

    if (safetyResult.isEmergency) {
      // Immediate hard-coded emergency response, NEVER AI-generated
      return res.json({
        success: true,
        urgency: 'emergency',
        emergency: true,
        emergencyCategory: safetyResult.category,
        emergencyPayload: safetyResult.emergencyPayload,
        reply: `${safetyResult.emergencyPayload.title}\n\n${safetyResult.emergencyPayload.message}\n\nImmediate Action Steps:\n${safetyResult.emergencyPayload.actionSteps.map(step => `• ${step}`).join('\n')}`,
        suggestedFollowUps: []
      });
    }

    // 2. SAFE TO PROCEED WITH AI OR DEMO GENERATION
    const aiResponse = await generateChatReply(messages, lang);

    return res.json({
      success: true,
      urgency: aiResponse.urgency || 'routine',
      emergency: aiResponse.urgency === 'emergency',
      reply: aiResponse.reply,
      isDemo: aiResponse.isDemo || false,
      demoNotice: aiResponse.demoNotice || null,
      suggestedFollowUps: aiResponse.suggestedFollowUps || []
    });

  } catch (error) {
    // Note: Privacy protection - never log user message contents
    console.error('Error handling chat request:', error.message);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while processing your request. Please try again.',
      urgency: 'routine'
    });
  }
});

export default router;
