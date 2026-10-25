import { Router } from 'express';
import { checkSafety } from '../utils/safetyCheck.js';
import { generateChatReply } from '../services/geminiService.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';
import { chatRequestSchema } from '../utils/schemas.js';

const router = Router();

router.post('/', submissionLimiter, async (req, res) => {
  try {
    // 1. Zod Schema Validation
    const validation = chatRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error?.issues?.[0]?.message || 'Invalid chat request format.',
        details: validation.error?.issues || []
      });
    }

    const { messages, language } = validation.data;

    // 2. RULE-BASED EMERGENCY SAFETY CHECK RUNS FIRST (BEFORE ANY AI CALL)
    const safetyResult = checkSafety({ messages }, language);

    if (safetyResult.isEmergency) {
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

    // 3. SAFE TO PROCEED WITH AI OR DEMO GENERATION
    const aiResponse = await generateChatReply(messages, language);

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
    console.error('[Chat Error]', error.message);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while processing your request. Please try again.',
      urgency: 'routine'
    });
  }
});

export default router;
