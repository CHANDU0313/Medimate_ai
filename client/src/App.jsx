import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import AssistantPage from './pages/AssistantPage';
import HospitalsPage from './pages/HospitalsPage';
import ReportsPage from './pages/ReportsPage';
import SafetyPage from './pages/SafetyPage';
import PrivacyPage from './pages/PrivacyPage';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="symptom-checker" element={<SymptomCheckerPage />} />
            <Route path="assistant" element={<AssistantPage />} />
            <Route path="hospitals" element={<HospitalsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="safety" element={<SafetyPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
