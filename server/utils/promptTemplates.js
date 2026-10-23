/**
 * MediMate AI - System Prompts and Output Schemas
 * Enforces medical safety rules, educational framing, and clean JSON outputs.
 */

export const SYSTEM_SAFETY_PROMPT = `You are MediMate AI, a compassionate, plain-language health educator.
Your tagline: "Your health questions, explained simply."
Your mission: "Reimagine Everyday Life — Make the Complex Simple."

STRICT MEDICAL SAFETY RULES (NON-NEGOTIABLE):
1. You are an educational health-literacy tool, NOT a licensed doctor or clinician.
2. NEVER diagnose a condition definitively. Always present ideas as "possible, common explanations, NOT a diagnosis".
3. NEVER prescribe medications or suggest specific drug dosages, brand names, or medication changes. Always refer users to a licensed physician or pharmacist for medicines.
4. NEVER delay emergency care. If any symptoms resemble life-threatening signs (severe chest pain, difficulty breathing, stroke symptoms, uncontrolled bleeding, suicidal thoughts), classify urgency as "emergency" and urge immediate emergency care.
5. NO fake credentials, NO fake clinical validation claims, NO false guarantees.
6. Language: Provide your entire response in the requested language (English, Telugu, or Hindi). Use simple, friendly words that an everyday person without a medical background can understand clearly.
7. Always respond ONLY with a valid JSON object matching the requested schema. Do not include markdown code block syntax if possible, or use standard \`\`\`json fences that can be parsed.`;

export const SYMPTOM_ANALYSIS_SCHEMA = {
  urgency: 'routine | urgent | emergency', // routine = self-care & monitor; urgent = see a doctor soon; emergency = seek immediate emergency care
  urgencyLabel: 'Short badge title e.g. Self-Care & Monitor, See a Doctor Soon, Emergency Care Required',
  possibleExplanations: [
    {
      title: 'Common possible explanation name',
      description: 'Simple 1-2 sentence explanation of why this might happen, framed cautiously.'
    }
  ],
  selfCareInfo: [
    'General, safe comfort measures (e.g. resting, drinking water, gentle warm compress) — no prescription dosages.'
  ],
  warningSigns: [
    'Red-flag symptoms that mean the user should seek prompt care.'
  ],
  whenToSeeDoctor: [
    'Clear criteria (e.g. if fever lasts > 3 days, if pain worsens, etc.).'
  ],
  questionsForClinician: [
    '3-4 simple, empowering questions the user can take to their doctor visit.'
  ],
  doctorSummaryText: 'A concise 2-3 sentence clinical overview summarizing symptoms, duration, and key observations for their doctor visit.'
};

export function buildSymptomPrompt(formData, language = 'en') {
  const languageNames = {
    en: 'English (simple, everyday words)',
    te: 'Telugu (సరళమైన తెలుగు, everyday simple language)',
    hi: 'Hindi (सरल हिंदी, everyday clear language)'
  };

  const targetLang = languageNames[language] || languageNames.en;

  return `Please analyze the following symptom report and return a structured JSON response.

LANGUAGE INSTRUCTION: Write all explanation text, titles, tips, and questions in ${targetLang}.

USER SYMPTOM REPORT:
- Main Symptoms: ${formData.mainSymptom || 'Not specified'}
- Duration: ${formData.duration || 'Not specified'}
- Severity: ${formData.severity ? `${formData.severity}/10` : 'Not specified'}
- Age Range: ${formData.ageRange || 'Not specified'}
- Relevant Context (Pre-existing conditions / lifestyle / changes): ${formData.context || 'None provided'}
- Additional Details: ${formData.otherDetails || 'None provided'}

CRITICAL GUIDELINES:
- Output MUST be valid JSON adhering strictly to this shape:
{
  "urgency": "routine" or "urgent" or "emergency",
  "urgencyLabel": "...",
  "possibleExplanations": [
    { "title": "...", "description": "..." }
  ],
  "selfCareInfo": ["..."],
  "warningSigns": ["..."],
  "whenToSeeDoctor": ["..."],
  "questionsForClinician": ["..."],
  "doctorSummaryText": "..."
}
- Do NOT provide a definitive diagnosis or specific prescription dosages.
- Frame all causes as possibilities to discuss with a clinician.`;
}

export function buildChatPrompt(messages, language = 'en') {
  const languageNames = {
    en: 'English (simple, conversational, empathetic)',
    te: 'Telugu (సరళమైన తెలుగు)',
    hi: 'Hindi (सरल हिंदी)'
  };
  const targetLang = languageNames[language] || languageNames.en;

  const conversationHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'MediMate AI'}: ${m.content}`).join('\n');

  return `The user is having a conversation with MediMate AI about general health education.

LANGUAGE INSTRUCTION: Reply in ${targetLang}. Keep explanations simple, reassuring, and jargon-free.

CONVERSATION HISTORY:
${conversationHistory}

CRITICAL GUIDELINES:
- Return ONLY a valid JSON object with the following structure:
{
  "reply": "Your helpful, compassionate educational answer in plain language (2-4 paragraphs max). Frame any explanations as possibilities, not diagnoses.",
  "urgency": "routine" or "urgent" or "emergency",
  "suggestedFollowUps": [
    "Suggested question 1",
    "Suggested question 2",
    "Suggested question 3"
  ]
}
- Refuse any request to prescribe medicines or calculate drug dosages; kindly advise asking a doctor or pharmacist.
- If danger signs are detected, urgency MUST be 'emergency'.`;
}
