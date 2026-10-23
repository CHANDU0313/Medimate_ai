/**
 * MediMate AI - Gemini AI Service
 * Calls the Google Gemini API directly from the backend.
 * Features:
 * - Native fetch (no heavy SDK dependency, easy to swap with OpenAI / Anthropic / local LLM)
 * - Strict JSON extraction with resilient parsing
 * - Automatic fallback to demoService if key is missing or API errors
 * - Sanitization ensuring no raw API keys or health data are exposed in logs
 */

import { SYSTEM_SAFETY_PROMPT, buildChatPrompt, buildSymptomPrompt } from '../utils/promptTemplates.js';
import demoService from './demoService.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim() || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Checks if the Gemini API provider is configured
 */
export function isAIConfigured() {
  return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.length > 5 && !GEMINI_API_KEY.includes('your_gemini_api_key'));
}

/**
 * Safely parses JSON strings returned by LLMs, stripping markdown fences if present
 */
function extractAndParseJSON(rawText) {
  if (!rawText) return null;
  let cleaned = rawText.trim();

  // Strip ```json and ``` code blocks if returned
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }

  // Attempt direct JSON parse
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt to locate first { and last }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonSubstr = cleaned.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonSubstr);
      } catch (innerErr) {
        // Fall through
      }
    }
    return null;
  }
}

/**
 * Calls Gemini API with system instructions and user prompt
 */
async function callGemini(promptText, systemPrompt = SYSTEM_SAFETY_PROMPT) {
  if (!isAIConfigured()) {
    throw new Error('NO_API_KEY');
  }

  const endpoint = `${API_URL}?key=${GEMINI_API_KEY}`;
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\n${promptText}` }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      topP: 0.95,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json'
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Gemini API HTTP ${response.status}: ${errorBody.slice(0, 150)}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('No candidate content received from Gemini');
    }

    const parsed = extractAndParseJSON(candidateText);
    if (!parsed) {
      throw new Error('Failed to parse Gemini output as structured JSON');
    }

    return parsed;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Generates an educational chat reply using Gemini or Demo fallback
 */
export async function generateChatReply(messages, language = 'en') {
  if (!isAIConfigured()) {
    return demoService.getDemoChatReply(messages, language);
  }

  try {
    const prompt = buildChatPrompt(messages, language);
    const result = await callGemini(prompt, SYSTEM_SAFETY_PROMPT);

    return {
      isDemo: false,
      reply: result.reply || 'Thank you for your question. As an educational guide, I encourage discussing these observations with your doctor.',
      urgency: ['emergency', 'urgent', 'routine'].includes(result.urgency) ? result.urgency : 'routine',
      suggestedFollowUps: Array.isArray(result.suggestedFollowUps) ? result.suggestedFollowUps : []
    };
  } catch (err) {
    // Seamless fallback to demo service if API fails
    const fallback = demoService.getDemoChatReply(messages, language);
    fallback.apiError = true;
    return fallback;
  }
}

/**
 * Generates structured symptom analysis using Gemini or Demo fallback
 */
export async function analyzeSymptoms(formData, language = 'en') {
  if (!isAIConfigured()) {
    return demoService.getDemoSymptomAnalysis(formData, language);
  }

  try {
    const prompt = buildSymptomPrompt(formData, language);
    const result = await callGemini(prompt, SYSTEM_SAFETY_PROMPT);

    // Validate structured fields
    return {
      isDemo: false,
      urgency: ['emergency', 'urgent', 'routine'].includes(result.urgency) ? result.urgency : 'routine',
      urgencyLabel: result.urgencyLabel || (result.urgency === 'urgent' ? 'See a Doctor Soon' : 'Self-Care & Monitor'),
      possibleExplanations: Array.isArray(result.possibleExplanations) ? result.possibleExplanations : [
        {
          title: 'Common physiological response',
          description: 'Possible common explanation to discuss with a qualified clinician.'
        }
      ],
      selfCareInfo: Array.isArray(result.selfCareInfo) ? result.selfCareInfo : [
        'Rest in a quiet, comfortable space.',
        'Stay properly hydrated by sipping water throughout the day.'
      ],
      warningSigns: Array.isArray(result.warningSigns) ? result.warningSigns : [
        'Sudden, severe worsening of symptoms.',
        'Difficulty breathing or extreme pain.'
      ],
      whenToSeeDoctor: Array.isArray(result.whenToSeeDoctor) ? result.whenToSeeDoctor : [
        'If symptoms persist for more than 48 hours without relief.'
      ],
      questionsForClinician: Array.isArray(result.questionsForClinician) ? result.questionsForClinician : [
        'What diagnostic tests do you recommend?',
        'What lifestyle adjustments might prevent this from returning?'
      ],
      doctorSummaryText: result.doctorSummaryText || `Symptoms: ${formData.mainSymptom}. Duration: ${formData.duration}. Severity: ${formData.severity}/10.`
    };
  } catch (err) {
    // Seamless fallback to demo service
    const fallback = demoService.getDemoSymptomAnalysis(formData, language);
    fallback.apiError = true;
    return fallback;
  }
}

export default {
  isAIConfigured,
  generateChatReply,
  analyzeSymptoms
};
