import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DisclaimerBanner from '../components/DisclaimerBanner';
import UrgencyAlert from '../components/UrgencyAlert';
import ChatWindow from '../components/ChatWindow';
import SymptomForm from '../components/SymptomForm';
import SymptomResultCard from '../components/SymptomResultCard';
import DoctorSummaryCard from '../components/DoctorSummaryCard';
import RecentConversations from '../components/RecentConversations';
import PrivacyModal from '../components/PrivacyModal';
import translations from '../i18n/translations';
import {
  getSavedSessions,
  saveSessions,
  getActiveSessionId,
  setActiveSessionId,
  clearAllSessionData,
  hasGivenConsent,
  setConsentGiven,
  getStoredLanguage,
  setStoredLanguage,
  SAMPLE_CONVERSATION
} from '../utils/storage';
import { MessageSquare, Stethoscope, FileText, History, Check, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  // 1. Language State
  const [language, setLanguage] = useState(getStoredLanguage());
  const t = translations[language] || translations.en;

  // 2. Sessions & Chat State
  const [sessions, setSessions] = useState(getSavedSessions());
  const [activeSessionId, setActiveId] = useState(getActiveSessionId());
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  // 3. Symptom Checker & Results State
  const [symptomResult, setSymptomResult] = useState(null);
  const [doctorSummary, setDoctorSummary] = useState(null);
  const [isSymptomLoading, setIsSymptomLoading] = useState(false);

  // 4. Urgency & Emergency Alert State
  const [currentUrgency, setCurrentUrgency] = useState(null); // 'emergency' | 'urgent' | 'routine' | null
  const [emergencyPayload, setEmergencyPayload] = useState(null);

  // 5. System & API Health State
  const [isLiveAI, setIsLiveAI] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // 6. Navigation Tabs (Mobile & Tablet)
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'symptoms' | 'summary' | 'history'

  // 7. Modals and Toasts
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(!hasGivenConsent());
  const [toastMessage, setToastMessage] = useState(null);

  // Load API Health status on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setIsLiveAI(data.aiConnected);
        setIsDemoMode(data.demoMode);
      })
      .catch(() => {
        // Fallback to demo mode if backend is starting or offline
        setIsLiveAI(false);
        setIsDemoMode(true);
      });
  }, []);

  // Update language and persist
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setStoredLanguage(newLang);
  };

  // Find active session
  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || SAMPLE_CONVERSATION;

  // Show Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Switch Conversation Session
  const handleSelectSession = (id) => {
    setActiveId(id);
    setActiveSessionId(id);
    setActiveTab('chat');
  };

  // Create New Conversation Session
  const handleNewSession = () => {
    const newId = `session_${Date.now()}`;
    const newSession = {
      id: newId,
      isSample: false,
      title: 'New Health Checkup',
      createdAt: new Date().toISOString(),
      messages: []
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveSessions(updated);
    setActiveId(newId);
    setActiveSessionId(newId);
    setCurrentUrgency(null);
    setEmergencyPayload(null);
    setActiveTab('chat');
  };

  // Clear Session Data
  const handleClearData = () => {
    if (window.confirm(t?.app?.clearDataConfirm || 'Are you sure you want to clear your current session data?')) {
      clearAllSessionData();
      setSessions([SAMPLE_CONVERSATION]);
      setActiveId(SAMPLE_CONVERSATION.id);
      setActiveSessionId(SAMPLE_CONVERSATION.id);
      setSymptomResult(null);
      setDoctorSummary(null);
      setCurrentUrgency(null);
      setEmergencyPayload(null);
      triggerToast(t?.app?.dataClearedToast || 'All session data cleared securely.');
    }
  };

  // Send Chat Message
  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    setChatError(null);
    setLastFailedMessage(null);

    const userMessage = {
      id: `m_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    // Optimistic UI update
    const updatedMessages = [...currentSession.messages, userMessage];
    const updatedSessions = sessions.map(s => {
      if (s.id === currentSession.id) {
        return {
          ...s,
          title: s.title === 'New Health Checkup' ? content.slice(0, 35) + '...' : s.title,
          messages: updatedMessages
        };
      }
      return s;
    });

    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          language
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || t?.chat?.errorNetwork || 'Request failed');
      }

      const data = await response.json();

      // Handle Urgency Guidance
      if (data.urgency) {
        setCurrentUrgency(data.urgency);
      }
      if (data.emergency) {
        setEmergencyPayload(data.emergencyPayload);
        setCurrentUrgency('emergency');
      }

      const assistantMessage = {
        id: `m_ai_${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        urgency: data.urgency,
        emergency: data.emergency,
        suggestedFollowUps: data.suggestedFollowUps || [],
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalSessions = sessions.map(s => {
        if (s.id === currentSession.id) {
          return { ...s, messages: finalMessages };
        }
        return s;
      });

      setSessions(finalSessions);
      saveSessions(finalSessions);

      // Auto-update doctor summary if user asked health questions
      if (!doctorSummary) {
        setDoctorSummary({
          symptoms: content,
          duration: 'Reported in chat',
          severity: 'Moderate',
          patientAgeRange: 'Adult',
          context: 'Discussed via AI Health Chat',
          urgency: data.urgency === 'emergency' ? 'EMERGENCY' : 'Self-Care & Routine Checkup',
          suggestedQuestionsForDoctor: data.suggestedFollowUps || [
            'What might be causing this discomfort?',
            'What symptoms indicate I should follow up?'
          ],
          summaryOverview: data.reply.slice(0, 250) + '...'
        });
      }

    } catch (err) {
      console.error('Chat error:', err);
      setChatError(err.message || t?.chat?.errorNetwork || 'Network error');
      setLastFailedMessage(content);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Submit Symptom Form
  const handleSymptomSubmit = async (formData) => {
    setIsSymptomLoading(true);
    setCurrentUrgency(null);
    setEmergencyPayload(null);

    try {
      const response = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          language
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze symptoms.');
      }

      const data = await response.json();

      setSymptomResult(data.explanation);
      setDoctorSummary(data.doctorSummary);

      if (data.urgency) {
        setCurrentUrgency(data.urgency);
      }
      if (data.emergency) {
        setEmergencyPayload(data.emergencyPayload);
        setCurrentUrgency('emergency');
      }

      // Switch view on mobile to show results
      if (window.innerWidth < 1024) {
        setActiveTab('summary');
      }

      triggerToast('Symptom analysis & Doctor summary ready!');
    } catch (err) {
      console.error('Symptom error:', err);
      alert(err.message || 'Error analyzing symptoms. Please try again.');
    } finally {
      setIsSymptomLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        onClearData={handleClearData}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        isLive={isLiveAI}
        isDemo={isDemoMode}
        t={t}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Full-Width Urgency Alert (prominent red for emergencies) */}
        {currentUrgency && (
          <UrgencyAlert
            urgency={currentUrgency}
            emergencyPayload={emergencyPayload}
            language={language}
            onClose={() => setCurrentUrgency(null)}
          />
        )}

        {/* Mobile / Tablet Tab Selector */}
        <div className="lg:hidden flex items-center bg-slate-200/80 p-1.5 rounded-2xl gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t?.nav?.chatTab || 'Chat'}</span>
          </button>

          <button
            onClick={() => setActiveTab('symptoms')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'symptoms'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>{t?.nav?.symptomTab || 'Form'}</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'summary'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t?.nav?.summaryTab || 'Summary'}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{t?.nav?.historyTab || 'History'}</span>
          </button>
        </div>

        {/* DESKTOP 3-COLUMN DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLUMN 1 (Desktop Left, 3 cols): Recent Conversations Panel */}
          <div className={`lg:col-span-3 ${activeTab === 'history' ? 'block' : 'hidden lg:block'}`}>
            <RecentConversations
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onNewSession={handleNewSession}
              t={t}
            />
          </div>

          {/* COLUMN 2 (Center, 5 cols): Main Chat or Symptom Checker */}
          <div className={`lg:col-span-5 space-y-6 ${
            activeTab === 'chat' || activeTab === 'symptoms' ? 'block' : 'hidden lg:block'
          }`}>
            {/* Center Tab Toggle between Chat and Symptom Form */}
            <div className="hidden lg:flex items-center bg-slate-200/80 p-1 rounded-2xl gap-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t?.nav?.chatTab || 'AI Health Chat'}</span>
              </button>

              <button
                onClick={() => setActiveTab('symptoms')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'symptoms'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>{t?.nav?.symptomTab || 'Symptom Information Form'}</span>
              </button>
            </div>

            {/* Render Chat or Symptom Form */}
            {activeTab === 'symptoms' ? (
              <SymptomForm
                onSubmit={handleSymptomSubmit}
                isLoading={isSymptomLoading}
                t={t}
                language={language}
              />
            ) : (
              <ChatWindow
                messages={currentSession.messages}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
                error={chatError}
                onRetry={lastFailedMessage ? () => handleSendMessage(lastFailedMessage) : null}
                isSample={currentSession.isSample}
                t={t}
                language={language}
              />
            )}
          </div>

          {/* COLUMN 3 (Desktop Right, 4 cols): Doctor-Visit Summary & Symptom Results */}
          <div className={`lg:col-span-4 space-y-6 ${activeTab === 'summary' ? 'block' : 'hidden lg:block'}`}>
            {/* Doctor-Visit Summary Card with Copy to Clipboard */}
            <DoctorSummaryCard
              summary={doctorSummary}
              onToast={triggerToast}
              t={t}
              language={language}
            />

            {/* Educational Symptom Result Card */}
            <SymptomResultCard
              result={symptomResult}
              t={t}
            />
          </div>
        </div>
      </main>

      {/* Persistent Disclaimer Banner */}
      <DisclaimerBanner text={t?.app?.disclaimer} />

      {/* First-load Privacy & Consent Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onAccept={() => {
          setConsentGiven();
          setIsPrivacyOpen(false);
        }}
        onClearData={handleClearData}
        t={t}
      />

      {/* Success Toast */}
      {toastMessage && (
        <div 
          role="status"
          className="fixed bottom-14 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-medium animate-in slide-in-from-bottom-2 fade-in duration-200"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
