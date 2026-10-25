# 🩺 MediMate AI — Your Health Questions, Explained Simply

> **A bilingual English and Telugu (తెలుగు) health education and healthcare navigation platform for users across Andhra Pradesh, India.**  
> *Theme: Reimagine Everyday Life — Make the Complex Simple.*

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Safety Verified](https://img.shields.io/badge/Safety_Check-28%2F28_Passed-emerald.svg)](server/tests/)
[![Languages](https://img.shields.io/badge/Languages-English_%7C_Telugu_(తెలుగు)-indigo.svg)](#bilingual-translation-system)

**MediMate AI** empowers everyday individuals and families in Andhra Pradesh to understand bodily symptoms, learn safe non-medical comfort measures, recognize acute red-flag warning signs, find nearby healthcare clinics and hospitals, and understand complex laboratory test reports without dense medical jargon.

---

## 🌟 Key Features & Routes

| Route | Page | Core Functionality |
| :--- | :--- | :--- |
| `/` | **Home** | Hero section with quick-action CTAs (*Check Symptoms*, *Ask AI*), interactive demo conversation card, 4 core feature cards, 3-step *How it works*, trust & disclaimer callouts. |
| `/symptom-checker` | **Symptom Checker** | Multi-field form (symptom, duration, 1-10 severity slider with dynamic face emoji scale, age bracket, context), rule-based emergency triage, and copyable Doctor-Visit Summary note. |
| `/assistant` | **AI Health Assistant** | Plain-language chat, speech-to-text recognition with privacy disclaimer, text-to-speech read-aloud (`te-IN` and `en-IN`), verified health sources sidebar, and 112 emergency card. |
| `/hospitals` | **AP Healthcare Search** | City/town/PIN code lookup across Andhra Pradesh, distance calculation via consent-based geolocation, facility filters (*All*, *Hospital*, *Clinic*, *Within 10 km*), OpenStreetMap embed, and directions links. |
| `/reports` | **Lab Report Explainer** | Privacy-first upload (PDF/JPG/PNG up to 10 MB), magic number validation, client consent checkbox, structured summary table (`Test` \| `Your value` \| `Lab range` \| `Report flag`), clinician questions, and memory-only processing. |
| `/safety` | **Safety & 112 Protocol** | Indian national emergency helplines (112, 108, Tele-MANAS 14416, Poison Centre 1800-116-117), red-flag symptom guidelines, and zero-delay safety engine architecture. |
| `/privacy` | **Privacy & DPDP Act** | Ephemeral browser `sessionStorage`, zero server-side health databases, DPDP Act 2023 alignment notice, map privacy guarantee, and one-click session purge. |

---

## 🛡️ Health Safety, Emergency & Privacy Safeguards

1. **Non-Diagnostic Device**: MediMate AI is strictly an educational health-literacy tool. It never provides definitive medical diagnoses, fabricated probabilities, or medication prescriptions/dosages.
2. **Zero-Delay Emergency Escalation (112)**:
   - Rule-based emergency engine intercepts chest pain, stroke FAST symptoms, acute breathing distress, severe hemorrhage, and mental health crises before any AI processing.
   - Emergency guidance and direct `tel:112` links are rendered immediately without waiting for chat follow-ups.
3. **Privacy-Preserving Architecture**:
   - Zero health chats or symptom submissions are persisted in server databases.
   - Chat interactions are kept in browser `sessionStorage` (never in `localStorage`).
   - Medical reports are processed in memory and never written to permanent disk storage.
   - User symptoms and health queries are **never** transmitted to OpenStreetMap or mapping services.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide React icons.
- **Backend**: Node.js, Express, Helmet (Security Headers), CORS origin protection, Express-Rate-Limit, Multer (in-memory file handling), PDF-Parse.
- **Validation**: Zod runtime schema validation on all API requests.
- **AI Integration**: Google Gemini API adapter (`gemini-1.5-flash`) with automatic, high-fidelity offline fallback to `demoService`.
- **Testing**: Automated emergency safety regression test suite (18 scenarios) and end-to-end API integration tests (10 test cases).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# In project root:
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 2. Configure Environment Variables (Optional for Live Gemini AI)
```bash
cp server/.env.example server/.env
```
Inside `server/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_ORIGIN=http://localhost:5173
```
*(If `GEMINI_API_KEY` is omitted, MediMate AI runs in Demo Mode with medically realistic responses).*

### 3. Run Automated Tests
```bash
npm test
```
*Executes all 28 automated tests (18 safety check tests + 10 API integration tests).*

### 4. Build & Run as One Unified Full-Stack Website (Single URL)
MediMate AI combines both the React frontend and Express backend into a single integrated server on port 5000:
```bash
npm run serve
# Or: npm run build && npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser to access the complete application!

### 5. Development Mode (Hot-Reloading)
```bash
npm run dev
```

---

## 📋 Acceptance Criteria & QA Verification

- [x] **Top Emergency 112 Banner**: Unmissable on every page with active `tel:112` link.
- [x] **All 7 Routes Verified**: Responsive navigation, active indicators, and mobile drawer.
- [x] **Bilingual Parity**: 100% Telugu and English localization across UI strings and error states.
- [x] **Zod Validation**: Rejects malformed requests with clean 400 Bad Request responses.
- [x] **Rule-Based Emergency Safety**: Intercepts emergency inputs in English, Telugu, and Hindi.
- [x] **Andhra Pradesh Care Search**: Real facilities with OpenStreetMap attribution and zero symptom leakage.
- [x] **Ephemeral Medical Report Explainer**: Memory-only parsing, consent checkbox, lab reference table, and clinician questions.
- [x] **Web Speech Support**: Bi-directional voice with explicit browser accuracy disclaimers.
