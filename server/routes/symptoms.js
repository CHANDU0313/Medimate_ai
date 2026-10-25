import { Router } from 'express';
import { checkSafety } from '../utils/safetyCheck.js';
import { analyzeSymptoms } from '../services/geminiService.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';
import { symptomRequestSchema } from '../utils/schemas.js';

const router = Router();

router.post('/', submissionLimiter, async (req, res) => {
  try {
    // 1. Zod Schema Validation
    const validation = symptomRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error?.issues?.[0]?.message || 'Invalid symptom form data.',
        details: validation.error?.issues || []
      });
    }

    const { formData, language } = validation.data;

    // 2. RULE-BASED EMERGENCY SAFETY CHECK RUNS FIRST
    const safetyResult = checkSafety(formData, language);

    if (safetyResult.isEmergency) {
      return res.json({
        success: true,
        urgency: 'emergency',
        emergency: true,
        emergencyCategory: safetyResult.category,
        emergencyPayload: safetyResult.emergencyPayload,
        explanation: {
          urgency: 'emergency',
          urgencyLabel: safetyResult.emergencyPayload.title,
          possibleExplanations: [
            {
              title: safetyResult.emergencyPayload.title,
              description: safetyResult.emergencyPayload.message
            }
          ],
          selfCareInfo: [
            'Do NOT wait to see if symptoms improve at home.',
            'Keep calm and call emergency help immediately.'
          ],
          warningSigns: safetyResult.emergencyPayload.actionSteps,
          whenToSeeDoctor: ['Immediate emergency department evaluation required.'],
          questionsForClinician: ['What was the immediate cause of this emergency event?'],
          doctorSummaryText: `EMERGENCY ALERT: Patient reported dangerous symptoms (${formData.mainSymptom}). Advised immediate emergency evaluation.`
        },
        doctorSummary: {
          symptoms: formData.mainSymptom,
          duration: formData.duration,
          severity: `${formData.severity}/10`,
          ageRange: formData.ageRange || 'Not provided',
          context: formData.context || 'None',
          urgency: 'EMERGENCY - SEEK IMMEDIATE HOSPITAL CARE',
          recommendedQuestions: ['What caused this acute episode?']
        }
      });
    }

    // 3. SAFE TO RUN SYMPTOM ANALYSIS VIA AI OR DEMO
    const analysis = await analyzeSymptoms(formData, language);

    // Standardized Doctor-Visit Summary
    const doctorSummary = {
      symptoms: formData.mainSymptom,
      duration: formData.duration,
      severity: `${formData.severity}/10`,
      ageRange: formData.ageRange || 'Not provided',
      context: formData.context || 'None reported',
      urgency: analysis.urgencyLabel || analysis.urgency?.toUpperCase() || 'ROUTINE',
      recommendedQuestions: analysis.questionsForClinician || [
        'What could be causing these symptoms?',
        'Are there any red flags I should monitor for?',
        'Do you recommend any specific diagnostic tests?'
      ]
    };

    return res.json({
      success: true,
      urgency: analysis.urgency || 'routine',
      emergency: false,
      explanation: analysis,
      doctorSummary,
      isDemo: analysis.isDemo || false,
      demoNotice: analysis.demoNotice || null
    });

  } catch (error) {
    console.error('[Symptoms Error]', error.message);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while analyzing symptoms. Please try again.',
      urgency: 'routine'
    });
  }
});

export default router;
