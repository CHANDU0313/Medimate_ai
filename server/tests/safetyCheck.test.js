/**
 * Automated test suite for MediMate AI Emergency Safety Checker
 * Tests at least 10 emergency scenarios across English, Telugu, and Hindi,
 * as well as normal benign symptoms that should NOT trigger emergency alerts.
 */

import { checkSafety } from '../utils/safetyCheck.js';

const TEST_CASES = [
  // 1. English - Chest pain & breathing distress (Required Acceptance test)
  {
    name: 'Chest pain and shortness of breath',
    input: "I have chest pain and can't breathe",
    lang: 'en',
    expectedEmergency: true,
    expectedCategory: 'cardiac_emergency'
  },
  // 2. English - Heart attack signs
  {
    name: 'Crushing chest pressure radiating to arm',
    input: 'I have severe tightness in chest and crushing chest pressure',
    lang: 'en',
    expectedEmergency: true,
    expectedCategory: 'cardiac_emergency'
  },
  // 3. English - Stroke FAST signs
  {
    name: 'Sudden slurred speech and face drooping',
    input: 'My father has sudden slurred speech and his face drooping on the left side',
    lang: 'en',
    expectedEmergency: true,
    expectedCategory: 'stroke_signs'
  },
  // 4. English - Severe hemorrhage / bleeding
  {
    name: 'Heavy uncontrolled bleeding',
    input: 'There is severe bleeding from a deep wound and blood pouring out',
    lang: 'en',
    expectedEmergency: true,
    expectedCategory: 'severe_hemorrhage'
  },
  // 5. English - Loss of consciousness / seizure
  {
    name: 'Epileptic fit / seizure',
    input: 'My colleague fell to the floor and is having a seizure',
    lang: 'en',
    expectedEmergency: true,
    expectedCategory: 'unconscious_or_seizure'
  },
  // 6. English - Severe allergic reaction / anaphylaxis
  {
    name: 'Throat swelling after eating nuts',
    input: 'My throat swelling up and I feel suffocating after eating peanut butter',
    lang: 'en',
    expectedEmergency: true,
    expectedCategory: 'respiratory_distress'
  },
  // 7. English - Crisis / Suicidal thoughts
  {
    name: 'Suicidal ideation',
    input: 'I feel hopeless and I want to end my life',
    lang: 'en',
    expectedEmergency: true,
    expectedCategory: 'suicide_crisis'
  },
  // 8. Telugu - Cardiac emergency
  {
    name: 'Telugu: గుండె నొప్పి (Chest/Heart pain)',
    input: 'నాకు తీవ్రమైన గుండె నొప్పి మరియు ఛాతీ బరువుగా ఉంది',
    lang: 'te',
    expectedEmergency: true,
    expectedCategory: 'cardiac_emergency'
  },
  // 9. Telugu - Respiratory distress
  {
    name: 'Telugu: శ్వాస ఆడకపోవడం (Trouble breathing)',
    input: 'నాకు ఊపిరి ఆడట్లేదు మరియు శ్వాస ఆడకపోవడం చాలా ఇబ్బందిగా ఉంది',
    lang: 'te',
    expectedEmergency: true,
    expectedCategory: 'respiratory_distress'
  },
  // 10. Telugu - Stroke signs
  {
    name: 'Telugu: పక్షవాతం / మూతి వంకర (Stroke)',
    input: 'అతనికి మాట తడబడటం మరియు మూతి వంకర తిరిగినట్లు కనిపిస్తుంది',
    lang: 'te',
    expectedEmergency: true,
    expectedCategory: 'stroke_signs'
  },
  // 11. Telugu - Mental health crisis
  {
    name: 'Telugu: ఆత్మహత్య (Suicide)',
    input: 'నాకు ఆత్మహత్య చేసుకోవాలనిపిస్తుంది దయచేసి సహాయం చేయండి',
    lang: 'te',
    expectedEmergency: true,
    expectedCategory: 'suicide_crisis'
  },
  // 12. Hindi - Cardiac emergency
  {
    name: 'Hindi: सीने में तेज दर्द (Chest pain)',
    input: 'मुझे अचानक सीने में दर्द और भारीपन महसूस हो रहा है',
    lang: 'hi',
    expectedEmergency: true,
    expectedCategory: 'cardiac_emergency'
  },
  // 13. Hindi - Respiratory distress
  {
    name: 'Hindi: सांस लेने में तकलीफ (Trouble breathing)',
    input: 'मुझे बहुत तेज सांस लेने में तकलीफ हो रही है और दम घुट रहा है',
    lang: 'hi',
    expectedEmergency: true,
    expectedCategory: 'respiratory_distress'
  },
  // 14. Hindi - Stroke signs
  {
    name: 'Hindi: लकवा / मुंह टेढ़ा होना (Stroke signs)',
    input: 'उनके हाथ सुन्न हो गए हैं और मुंह टेढ़ा होना शुरू हो गया है',
    lang: 'hi',
    expectedEmergency: true,
    expectedCategory: 'stroke_signs'
  },
  // 15. Hindi - Poisoning / Overdose
  {
    name: 'Hindi: जहर खा लिया (Poisoning)',
    input: 'किसी ने गलती से जहरीला कीटनाशक जहर पी लिया है',
    lang: 'hi',
    expectedEmergency: true,
    expectedCategory: 'poisoning_or_overdose'
  },
  // 16. Negative Control 1 - Benign routine symptom (Should NOT trigger emergency)
  {
    name: 'Benign symptom: Mild dry cough',
    input: 'I have had a mild dry cough and tickle in my throat for two days',
    lang: 'en',
    expectedEmergency: false
  },
  // 17. Negative Control 2 - Mild headache
  {
    name: 'Benign symptom: Mild afternoon headache',
    input: "I've had a headache since this morning after working on the laptop",
    lang: 'en',
    expectedEmergency: false
  },
  // 18. Structured Form Object Test
  {
    name: 'Structured Form with Chest Pain in Telugu',
    input: {
      mainSymptom: 'రొమ్ము నొప్పి',
      duration: '30 నిమిషాలు',
      severity: 9
    },
    lang: 'te',
    expectedEmergency: true,
    expectedCategory: 'cardiac_emergency'
  }
];

console.log('====================================================');
console.log('MediMate AI: Running Safety Check Test Suite (18 tests)');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

for (const tc of TEST_CASES) {
  const result = checkSafety(tc.input, tc.lang);
  const statusMatch = result.isEmergency === tc.expectedEmergency;
  
  if (statusMatch) {
    console.log(`✅ PASS: ${tc.name}`);
    if (result.isEmergency) {
      console.log(`   -> Triggered keyword: "${result.triggeredKeyword}" | Category: ${result.category}`);
      if (!result.emergencyPayload || !result.emergencyPayload.title || !result.emergencyPayload.actionSteps) {
        console.error(`   ❌ FAIL: Missing emergency payload structure!`);
        failed++;
        continue;
      }
    }
    passed++;
  } else {
    console.error(`❌ FAIL: ${tc.name}`);
    console.error(`   Expected isEmergency=${tc.expectedEmergency}, but got ${result.isEmergency}`);
    failed++;
  }
}

console.log('\n====================================================');
console.log(`Summary: ${passed} passed, ${failed} failed out of ${TEST_CASES.length} tests.`);
console.log('====================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All safety check tests passed with 100% precision!\n');
}
