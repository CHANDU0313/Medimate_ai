import { Router } from 'express';
import { checkSafety } from '../utils/safetyCheck.js';
import { analyzeSymptoms } from '../services/geminiService.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Field length constraints
const MAX_FIELD_LENGTH = 1000;

router.post('/', submissionLimiter, async (req, res) => {
  try {
    const { formData, language = 'en' } = req.body;

    if (!formData || typeof formData !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Form data is required.'
      });
    }

    const { mainSymptom, duration, severity, ageRange, context, otherDetails } = formData;

    // Required fields validation
    if (!mainSymptom || typeof mainSymptom !== 'string' || !mainSymptom.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Main symptom is required.'
      });
    }

    if (!duration || typeof duration !== 'string' || !duration.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Duration is required.'
      });
    }

    const numericSeverity = Number(severity);
    if (isNaN(numericSeverity) || numericSeverity < 1 || numericSeverity > 10) {
      return res.status(400).json({
        success: false,
        error: 'Severity must be a number between 1 and 10.'
      });
    }

    // Length limit checks
    if (mainSymptom.length > MAX_FIELD_LENGTH || (context && context.length > MAX_FIELD_LENGTH) || (otherDetails && otherDetails.length > MAX_FIELD_LENGTH)) {
      return res.status(400).json({
        success: false,
        error: `Input fields cannot exceed ${MAX_FIELD_LENGTH} characters.`
      });
    }

    const lang = ['en', 'te', 'hi'].includes(language) ? language : 'en';

    // 1. RULE-BASED SAFETY CHECK RUNS FIRST
    const safetyResult = checkSafety(formData, lang);

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

    // 2. SAFE TO RUN SYMPTOM ANALYSIS VIA AI OR DEMO
    const analysis = await analyzeSymptoms(formData, lang);

    // Auto-generate standardized Doctor-Visit Summary
    const doctorSummary = {
      patientAgeRange: formData.ageRange || 'Adult',
      symptoms: formData.mainSymptom,
      duration: formData.duration,
      severity: `${formData.severity}/10`,
      context: formData.context || 'None noted',
      otherDetails: formData.otherDetails || 'None',
      urgency: analysis.urgencyLabel || (analysis.urgency === 'urgent' ? 'See a Doctor Soon' : 'Self-Care & Monitor'),
      suggestedQuestionsForDoctor: analysis.questionsForClinician || [],
      summaryOverview: analysis.doctorSummaryText
    };

    return res.json({
      success: true,
      urgency: analysis.urgency || 'routine',
      emergency: analysis.urgency === 'emergency',
      isDemo: analysis.isDemo || false,
      demoNotice: analysis.demoNotice || null,
      explanation: analysis,
      doctorSummary
    });

  } catch (error) {
    console.error('Error handling symptom request:', error.message);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while analyzing symptoms. Please try again.'
    });
  }
});

export default router;
