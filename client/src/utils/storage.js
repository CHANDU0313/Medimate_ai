/**
 * MediMate AI - Session Storage & Privacy Utility
 * Manages client-only session persistence without touching any server database.
 */

const STORAGE_KEYS = {
  SESSIONS: 'medimate_sessions_v1',
  ACTIVE_SESSION_ID: 'medimate_active_session_id',
  LANGUAGE: 'medimate_selected_lang',
  CONSENT_GIVEN: 'medimate_consent_agreed'
};

const SAMPLE_SESSION_ID = 'session_sample_demo_1';

export const SAMPLE_CONVERSATION = {
  id: SAMPLE_SESSION_ID,
  isSample: true,
  title: "I've had a headache since this morning",
  createdAt: new Date().toISOString(),
  messages: [
    {
      id: 'm1',
      role: 'user',
      content: "I've had a dull headache since this morning after working on my laptop for 4 hours. What could be causing this?",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
      id: 'm2',
      role: 'assistant',
      content: `Headaches that develop after long periods on a computer or phone are very commonly linked to eye strain, muscle tension in the neck and shoulders, or mild dehydration. When we focus on bright screens, we tend to blink less frequently and hold our neck in a fixed position.

Here are a few gentle, non-medical comfort measures you can try right now:
• Take a 20-second break to look at an object 20 feet away (the 20-20-20 rule).
• Slowly sip a tall glass of room-temperature water.
• Dim harsh overhead lighting and apply a cool or warm cloth to your forehead or the back of your neck.

Remember: If a headache comes on suddenly like a "thunderclap", is accompanied by fever or a stiff neck, or causes vision changes, please seek urgent medical attention. For any over-the-counter pain relievers, always consult a pharmacist or your doctor.`,
      urgency: 'routine',
      suggestedFollowUps: [
        'How much water should I drink daily?',
        'Can neck posture affect headaches?',
        'When should I see a doctor for a headache?'
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString()
    }
  ]
};

/**
 * Initializes sessions in sessionStorage.
 * Preloads the sample conversation if no sessions exist.
 */
export function getSavedSessions() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      const initial = [SAMPLE_CONVERSATION];
      sessionStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Session storage read error:', e);
    return [SAMPLE_CONVERSATION];
  }
}

/**
 * Saves sessions list to sessionStorage
 */
export function saveSessions(sessions) {
  try {
    sessionStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.warn('Session storage save error:', e);
  }
}

/**
 * Gets currently active session ID
 */
export function getActiveSessionId() {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION_ID) || SAMPLE_SESSION_ID;
  } catch (e) {
    return SAMPLE_SESSION_ID;
  }
}

/**
 * Sets active session ID
 */
export function setActiveSessionId(id) {
  try {
    sessionStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, id);
  } catch (e) {
    console.warn('Error saving active session ID:', e);
  }
}

/**
 * Clears all user data from sessionStorage
 */
export function clearAllSessionData() {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.SESSIONS);
    sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
    // Re-seed with fresh sample conversation so demo remains functional
    sessionStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([SAMPLE_CONVERSATION]));
    sessionStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, SAMPLE_SESSION_ID);
    return true;
  } catch (e) {
    console.error('Failed to clear session data:', e);
    return false;
  }
}

/**
 * Consent agreement check
 */
export function hasGivenConsent() {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.CONSENT_GIVEN) === 'true';
  } catch (e) {
    return false;
  }
}

export function setConsentGiven() {
  try {
    sessionStorage.setItem(STORAGE_KEYS.CONSENT_GIVEN, 'true');
  } catch (e) {
    console.warn('Consent save failed:', e);
  }
}

/**
 * Language persistence
 */
export function getStoredLanguage() {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
  } catch (e) {
    return 'en';
  }
}

export function setStoredLanguage(lang) {
  try {
    sessionStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch (e) {
    console.warn('Language save failed:', e);
  }
}
