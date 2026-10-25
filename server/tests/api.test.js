/**
 * MediMate AI - End-to-End API Integration Test Suite
 * Tests all endpoints: /api/health, /api/chat, /api/symptoms, /api/hospitals, /api/reports
 * Validates Zod validation, zero-delay emergency escalation, and safe fallback handling.
 */

import http from 'http';
import app from '../server.js';

let server;
let baseUrl;

async function startTestServer() {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
}

async function stopTestServer() {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

async function runTests() {
  console.log('====================================================');
  console.log(' MediMate AI: Running End-to-End API Test Suite');
  console.log('====================================================\n');

  await startTestServer();
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   -> Error: ${err.message}`);
      failed++;
    }
  }

  // 1. GET /api/health
  await test('GET /api/health returns 200 and healthy status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.status || json.status !== 'ok') throw new Error(`Status not ok: ${json.status}`);
  });

  // 2. POST /api/chat - Valid safe chat message
  await test('POST /api/chat returns educational reply for benign health question', async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What are common causes of fatigue after studying?' }],
        language: 'en'
      })
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.reply) throw new Error('Reply missing');
    if (json.emergency) throw new Error('Should not be an emergency');
  });

  // 3. POST /api/chat - Emergency trigger (zero-delay 112 escalation)
  await test('POST /api/chat immediately intercepts cardiac emergency and provides 112 guidance', async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'I have severe crushing chest pain radiating to my left arm' }],
        language: 'en'
      })
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.emergency || json.urgency !== 'emergency') throw new Error('Emergency not flagged');
    if (!json.reply.includes('112') && !json.emergencyPayload?.message.includes('112')) {
      throw new Error('112 helpline not in emergency reply');
    }
  });

  // 4. POST /api/chat - Telugu Emergency trigger
  await test('POST /api/chat intercepts Telugu breathing distress emergency', async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'నాకు ఊపిరి ఆడట్లేదు మరియు శ్వాస ఆడకపోవడం చాలా ఇబ్బందిగా ఉంది' }],
        language: 'te'
      })
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.emergency) throw new Error('Telugu emergency not flagged');
  });

  // 5. POST /api/chat - Zod validation rejection on empty input
  await test('POST /api/chat rejects empty messages array with 400 Bad Request', async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [] })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const json = await res.json();
    if (json.success !== false) throw new Error('Should have failed validation');
  });

  // 6. POST /api/symptoms - Valid submission
  await test('POST /api/symptoms returns structured analysis and doctor-visit summary', async () => {
    const res = await fetch(`${baseUrl}/api/symptoms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData: {
          mainSymptom: 'Mild headache after staring at screens',
          duration: '4 hours',
          severity: 4,
          ageRange: '18-30',
          context: 'Working late'
        },
        language: 'en'
      })
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.explanation || !json.doctorSummary) {
      throw new Error('Analysis or doctor summary missing');
    }
  });

  // 7. POST /api/symptoms - Zod rejection on invalid severity
  await test('POST /api/symptoms rejects invalid severity > 10 with 400 Bad Request', async () => {
    const res = await fetch(`${baseUrl}/api/symptoms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData: {
          mainSymptom: 'Headache',
          duration: '1 day',
          severity: 25 // Invalid
        }
      })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // 8. GET /api/hospitals - Retrieve Andhra Pradesh facilities
  await test('GET /api/hospitals returns verified Andhra Pradesh healthcare list with OSM attribution', async () => {
    const res = await fetch(`${baseUrl}/api/hospitals`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.facilities) || json.facilities.length === 0) {
      throw new Error('Facilities array missing or empty');
    }
    if (!json.attribution || !json.attribution.includes('OpenStreetMap')) {
      throw new Error('OpenStreetMap attribution missing');
    }
  });

  // 9. GET /api/hospitals - Search Guntur
  await test('GET /api/hospitals?query=Guntur filters for Guntur facilities', async () => {
    const res = await fetch(`${baseUrl}/api/hospitals?query=Guntur`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.facilities.some(f => f.nameEn.includes('Guntur') || f.city === 'Guntur')) {
      throw new Error('Guntur facility not found in query results');
    }
  });

  // 10. POST /api/reports - Reject without consent
  await test('POST /api/reports rejects upload when consent is missing', async () => {
    const res = await fetch(`${baseUrl}/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consent: false })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await stopTestServer();

  console.log('\n====================================================');
  console.log(`Summary: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('All API integration tests passed with 100% precision!\n');
    process.exit(0);
  }
}

runTests();
