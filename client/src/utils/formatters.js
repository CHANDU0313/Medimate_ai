/**
 * MediMate AI - Text Formatting & Clipboard Utilities
 */

/**
 * Copies plain text to clipboard safely across modern and legacy browser APIs
 */
export async function copyToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard writeText failed, falling back to execCommand:', err);
    }
  }

  // Fallback using textarea execCommand
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err);
    return false;
  }
}

/**
 * Generates structured, print-ready text for doctor visits
 */
export function formatDoctorVisitSummary(summary, language = 'en') {
  if (!summary) return '';

  const timestamp = new Date().toLocaleString();
  const divider = '--------------------------------------------------';

  const lines = [
    '==================================================',
    '       MEDIMATE AI - DOCTOR-VISIT SUMMARY NOTE    ',
    '==================================================',
    `Generated on: ${timestamp}`,
    `Purpose: Prepared by patient to guide clinician consultation`,
    `Disclaimer: Not a diagnosis. Educational self-report.`,
    divider,
    `REPORTED SYMPTOMS : ${summary.symptoms || 'Not specified'}`,
    `DURATION           : ${summary.duration || 'Not specified'}`,
    `SEVERITY RATING    : ${summary.severity || 'Not rated'} (on a scale of 1-10)`,
    `PATIENT AGE GROUP  : ${summary.patientAgeRange || summary.ageRange || 'Adult'}`,
    `CONTEXT & HISTORY  : ${summary.context || 'None reported'}`,
    `ADDITIONAL DETAILS : ${summary.otherDetails || 'None'}`,
    `URGENCY GUIDANCE   : ${summary.urgency || 'Self-Care & Routine Checkup'}`,
    divider,
    'SUMMARY OVERVIEW:',
    summary.summaryOverview || summary.doctorSummaryText || 'Patient reported the symptoms above.',
    divider,
    'SUGGESTED QUESTIONS TO ASK YOUR DOCTOR:'
  ];

  const questions = summary.suggestedQuestionsForDoctor || summary.questionsForClinician || [];
  if (questions.length > 0) {
    questions.forEach((q, i) => lines.push(` [ ] ${i + 1}. ${q}`));
  } else {
    lines.push(' [ ] 1. What could be the primary cause of these symptoms?');
    lines.push(' [ ] 2. What warning signs should I watch out for?');
    lines.push(' [ ] 3. Are any lab tests or imaging indicated?');
  }

  lines.push(divider);
  lines.push('PATIENT CLINICAL APPOINTMENT NOTES:');
  lines.push('Physician Notes: _________________________________');
  lines.push('Next Steps:      _________________________________');
  lines.push('==================================================');

  return lines.join('\n');
}

/**
 * Formats timestamps into readable strings
 */
export function formatTime(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}
