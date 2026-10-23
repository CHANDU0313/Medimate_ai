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
import { Home, MessageSquare, Stethoscope, FileText, Check } from 'lucide-react';

export default function Dashboard() {
  const [language, setLanguage] = useState(getStoredLanguage());
  const t = translations[language] || translations.en;

  const [sessions, setSessions] = useState(getSavedSessions());
  const [activeSessionId, setActiveId] = useState(getActiveSessionId());
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  const [symptomResult, setSymptomResult] = useState(null);
  const [doctorSummary, setDoctorSummary] = useState(null);
  const [isSymptomLoading, setIsSymptomLoading] = useState(false);

  const [currentUrgency, setCurrentUrgency] = useState(null);
  const [emergencyPayload, setEmergencyPayload] = useState(null);

  const [isLiveAI, setIsLiveAI] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Tab State: 'chat' | 'symptoms' | 'summary'
  const [activeTab, setActiveTab] = useState('chat');

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(!hasGivenConsent());
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setIsLiveAI(data.aiConnected);
        setIsDemoMode(data.demoMode);
      })
      .catch(() => {
        setIsLiveAI(false);
        setIsDemoMode(true);
      });
  }, []);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setStoredLanguage(newLang);
  };

  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || SAMPLE_CONVERSATION;

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectSession = (id) => {
    setActiveId(id);
    setActiveSessionId(id);
    setActiveTab('chat');
  };

  const handleNewSession = () => {
    const newId = `session_${Date.now()}`;
    const newSession = {
      id: newId,
      isSample: false,
      title: 'New Health Chat',
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

  const handleClearData = () => {
    if (window.confirm('Clear all session data from your browser?')) {
      clearAllSessionData();
      setSessions([SAMPLE_CONVERSATION]);
      setActiveId(SAMPLE_CONVERSATION.id);
      setActiveSessionId(SAMPLE_CONVERSATION.id);
      setSymptomResult(null);
      setDoctorSummary(null);
      setCurrentUrgency(null);
      setEmergencyPayload(null);
      triggerToast('All local session data has been cleared.');
    }
  };

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

    const updatedMessages = [...currentSession.messages, userMessage];
    const updatedSessions = sessions.map(s => {
      if (s.id === currentSession.id) {
        return {
          ...s,
          title: s.title === 'New Health Chat' ? content.slice(0, 30) + '...' : s.title,
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
        throw new Error(errorData.error || 'Request failed');
      }

      const data = await response.json();

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

    } catch (err) {
      console.error('Chat error:', err);
      setChatError(err.message || 'Network error');
      setLastFailedMessage(content);
    } finally {
      setIsChatLoading(false);
    }
  };

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

      triggerToast('Symptom analysis & Doctor summary ready!');
    } catch (err) {
      console.error('Symptom error:', err);
      alert(err.message || 'Error analyzing symptoms.');
    } finally {
      setIsSymptomLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16 lg:pb-0">
      
      {/* Top Navigation Bar matching Mockup */}
      <Navbar
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        onClearData={handleClearData}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        isLive={isLiveAI}
        isDemo={isDemoMode}
        t={t}
      />

      {/* Main 3-Column Dashboard matching Mockup */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-4">
        
        {/* Full-width Emergency Red Alert */}
        {currentUrgency === 'emergency' && (
          <UrgencyAlert
            urgency={currentUrgency}
            emergencyPayload={emergencyPayload}
            language={language}
            onClose={() => setCurrentUrgency(null)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* COLUMN 1 (Desktop Left, 3 cols): Navigation Sidebar matching Mockup */}
          <div className="hidden lg:block lg:col-span-3">
            <RecentConversations
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onNewSession={handleNewSession}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onClearData={handleClearData}
              activeTab={activeTab}
              t={t}
            />
          </div>

          {/* COLUMN 2 (Center, 5 cols): Chat Window OR Symptom Form */}
          <div className="lg:col-span-5 space-y-4">
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

          {/* COLUMN 3 (Desktop Right, 4 cols): Doctor Summary + Symptom Results */}
          <div className="lg:col-span-4 space-y-4">
            <DoctorSummaryCard
              summary={doctorSummary}
              onToast={triggerToast}
              t={t}
              language={language}
            />

            <SymptomResultCard
              result={symptomResult}
              t={t}
            />
          </div>

        </div>
      </main>

      {/* Persistent Medical Disclaimer Banner */}
      <DisclaimerBanner text={t?.app?.disclaimer} />

      {/* Mobile Bottom Navigation Bar matching Mobile Screens 1-4 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-3 shadow-lg">
        <button
          onClick={() => {
            handleNewSession();
            setActiveTab('chat');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            activeTab === 'chat' && currentSession.messages.length === 0
              ? 'text-brand-600'
              : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            activeTab === 'chat' ? 'text-brand-600' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat</span>
        </button>

        <button
          onClick={() => setActiveTab('symptoms')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            activeTab === 'symptoms' ? 'text-brand-600' : 'text-slate-500'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Symptom</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            activeTab === 'summary' ? 'text-brand-600' : 'text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Summary</span>
        </button>
      </nav>

      {/* Privacy / Consent Modal matching Mobile Screen 6 */}
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

      {/* Toast Notification */}
      {toastMessage && (
        <div 
          role="status"
          className="fixed bottom-20 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
