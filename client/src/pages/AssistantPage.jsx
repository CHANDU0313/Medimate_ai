import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, Square, AlertCircle, ExternalLink, ShieldAlert, Sparkles, PhoneCall, PlusCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getSavedSessions, saveSessions, getActiveSessionId, setActiveSessionId, getSpeechVoiceSettings, setSpeechVoiceSettings, SAMPLE_CONVERSATION, TELUGU_SAMPLE_CONVERSATION } from '../utils/storage';

function loadSpeechVoices(synthesis) {
  const voices = synthesis.getVoices();
  if (voices.length || typeof synthesis.addEventListener !== 'function') {
    return Promise.resolve(voices);
  }

  return new Promise((resolve) => {
    let timeoutId;
    const finish = () => {
      window.clearTimeout(timeoutId);
      synthesis.removeEventListener('voiceschanged', finish);
      resolve(synthesis.getVoices());
    };

    synthesis.addEventListener('voiceschanged', finish);
    timeoutId = window.setTimeout(finish, 1200);
  });
}

export default function AssistantPage() {
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';
  const c = t.chat;

  const [sessions, setSessions] = useState(() => getSavedSessions());
  const [activeSessionId, setActiveId] = useState(() => getActiveSessionId());
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveAI, setIsLiveAI] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [teluguVoices, setTeluguVoices] = useState([]);
  const [speechVoiceSettings, setSpeechVoiceSettingsState] = useState(() => getSpeechVoiceSettings());
  
  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const recognitionRef = useRef(null);
  const speechRequestRef = useRef(0);

  const messagesEndRef = useRef(null);

  const storedSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || SAMPLE_CONVERSATION;
  const currentSession = storedSession.isSample && isTelugu
    ? {
      ...storedSession,
      ...TELUGU_SAMPLE_CONVERSATION,
      messages: [
        ...TELUGU_SAMPLE_CONVERSATION.messages,
        ...storedSession.messages.slice(SAMPLE_CONVERSATION.messages.length)
      ]
    }
    : storedSession;

  const suggestedStarters = isTelugu ? [
    'ఉదయం నుండి తలనొప్పిగా ఉంది, సాధారణ కారణాలు ఏమిటి?',
    'జలుబు మరియు అలర్జీల మధ్య తేడాను ఎలా గుర్తించాలి?',
    'గొంతు నొప్పికి ఇంట్లోనే సురక్షితమైన ఉపశమనం ఎలా పొందాలి?',
    'ఉదయం నిద్రలేవగానే కీళ్ళు ఎందుకు బిగుసుకుపోతాయి?'
  ] : [
    "I've had a headache since morning, what could cause this?",
    'How can I tell the difference between a cold and seasonal allergies?',
    'What are simple, safe ways to soothe a sore throat at home?',
    'Why do my joints feel stiff in the morning when I wake up?'
  ];

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => {
        setIsLiveAI(Boolean(d.aiConnected));
      })
      .catch(() => setIsLiveAI(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession.messages, isLoading]);

  useEffect(() => {
    const synthesis = window.speechSynthesis;
    if (!synthesis) return undefined;

    const updateTeluguVoices = () => {
      setTeluguVoices(
        synthesis.getVoices().filter(voice => voice.lang.toLowerCase().startsWith('te'))
      );
    };

    updateTeluguVoices();
    synthesis.addEventListener('voiceschanged', updateTeluguVoices);
    return () => synthesis.removeEventListener('voiceschanged', updateTeluguVoices);
  }, []);

  useEffect(() => {
    speechRequestRef.current += 1;
    window.speechSynthesis?.cancel();
    setSpeakingMessageId(null);
    setSpeechError(null);
  }, [language]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        speechRequestRef.current += 1;
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const handleNewSession = () => {
    const newId = `session_${Date.now()}`;
    const newSession = {
      id: newId,
      isSample: false,
      title: isTelugu ? 'కొత్త ఆరోగ్య సంభాషణ' : 'New Health Chat',
      createdAt: new Date().toISOString(),
      messages: []
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveSessions(updated);
    setActiveId(newId);
    setActiveSessionId(newId);
  };

  const updateSpeechVoiceSettings = (changes) => {
    const updatedSettings = { ...speechVoiceSettings, ...changes };
    setSpeechVoiceSettingsState(updatedSettings);
    setSpeechVoiceSettings(updatedSettings);
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: `m_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...currentSession.messages, userMessage];
    const updatedSession = { ...currentSession, messages: updatedMessages };
    const updatedSessions = sessions.map(s => s.id === currentSession.id ? updatedSession : s);
    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          language
        })
      });

      const data = await response.json();

      const assistantMessage = {
        id: `m_${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || (isTelugu ? 'సమాచారం ప్రాసెస్ చేయలేకపోయాము.' : 'Unable to process your message.'),
        urgency: data.urgency || 'routine',
        isDemo: Boolean(data.isDemo),
        suggestedFollowUps: data.suggestedFollowUps || [],
        sources: [
          {
            title: isTelugu ? 'WHO ప్రాథమిక ఆరోగ్య సంరక్షణ మార్గదర్శకాలు' : 'WHO Primary Health Care Guidelines',
            url: 'https://www.who.int',
            reviewedDate: '2024'
          },
          {
            title: isTelugu ? 'నేషనల్ హెల్త్ పోర్టల్ (భారత ప్రభుత్వం)' : 'National Health Portal (Govt. of India)',
            url: 'https://www.nhp.gov.in',
            reviewedDate: '2024'
          }
        ],
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalSession = { ...currentSession, messages: finalMessages };
      const finalSessions = sessions.map(s => s.id === currentSession.id ? finalSession : s);
      setSessions(finalSessions);
      saveSessions(finalSessions);

    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = {
        id: `m_err_${Date.now()}`,
        role: 'assistant',
        content: isTelugu
          ? 'సర్వర్‌ను చేరుకోవడంలో సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.'
          : 'Unable to reach the server. Please check your connection and retry.',
        urgency: 'routine',
        timestamp: new Date().toISOString()
      };
      const finalSessions = sessions.map(s => s.id === currentSession.id ? { ...currentSession, messages: [...updatedMessages, errorMessage] } : s);
      setSessions(finalSessions);
      saveSessions(finalSessions);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSpeak = async (msgId, text, voiceGender = speechVoiceSettings.gender) => {
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') {
      setSpeechError(c.speechPlaybackError);
      return;
    }

    if (speakingMessageId === msgId) {
      speechRequestRef.current += 1;
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    const requestId = ++speechRequestRef.current;
    window.speechSynthesis.cancel();
    setSpeechError(null);
    setSpeakingMessageId(msgId);

    let voices;
    try {
      voices = await loadSpeechVoices(window.speechSynthesis);
    } catch (error) {
      console.error('Speech voice lookup failed:', error);
      if (requestId === speechRequestRef.current) {
        setSpeakingMessageId(null);
        setSpeechError(c.speechPlaybackError);
      }
      return;
    }

    if (requestId !== speechRequestRef.current) return;

    const locale = isTelugu ? 'te-IN' : 'en-IN';
    const matchingVoice = isTelugu
      ? voices.find(voice => voice.voiceURI === speechVoiceSettings[`${voiceGender}VoiceURI`])
      : voices.find(voice => voice.lang.toLowerCase() === locale.toLowerCase())
        || voices.find(voice => voice.lang.toLowerCase() === locale.slice(0, 2).toLowerCase())
        || voices.find(voice => voice.lang.toLowerCase().startsWith(`${locale.slice(0, 2).toLowerCase()}-`));

    if (isTelugu && !matchingVoice) {
      setSpeakingMessageId(null);
      setSpeechError(teluguVoices.length ? c.speechVoiceSetupRequired : c.speechVoiceUnavailable);
      return;
    }

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = 0.95;
    if (matchingVoice) utterance.voice = matchingVoice;

    utterance.onend = () => {
      if (requestId === speechRequestRef.current) setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      if (requestId === speechRequestRef.current) {
        setSpeakingMessageId(null);
        setSpeechError(c.speechPlaybackError);
      }
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech playback failed:', error);
      setSpeakingMessageId(null);
      setSpeechError(c.speechPlaybackError);
    }
  };

  const handleToggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError(c.micUnsupported);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isTelugu ? 'te-IN' : 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputMessage(transcript);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        setSpeechError(c.micRecognitionError);
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech start failed:', e);
      setIsListening(false);
      setSpeechError(c.micRecognitionError);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title Bar (Matches Screenshot 1) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {c.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {c.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNewSession}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-700" />
            <span>{isTelugu ? '+ కొత్త చాట్' : '+ New Chat'}</span>
          </button>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            {isLiveAI ? c.liveConnected : c.demoNotConnected}
          </span>
        </div>
      </div>

      {/* Main Grid: Chat area on left (8 cols), Sources & Emergency on right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Chat Area */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-card flex flex-col h-[650px] overflow-hidden">
          
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {currentSession.messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xl">
                  💬
                </div>
                <h2 className="font-bold text-slate-900 text-base">
                  {isTelugu ? 'ఆరోగ్య సహాయకుడికి స్వాగతం' : 'Welcome to MediMate Assistant'}
                </h2>
                <p className="text-xs text-slate-500 max-w-sm">
                  {isTelugu
                    ? 'క్రింద ఉన్న ప్రశ్నలలో ఒకదాన్ని ఎంచుకోండి లేదా మీ సొంత ప్రశ్నను టైప్ చేయండి.'
                    : 'Choose a suggested question below or type any general health topic you would like explained simply.'}
                </p>
              </div>
            ) : (
              currentSession.messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-br-xs font-medium'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>

                    {/* Actions under assistant message (Listen, Stop, Demo Badge) */}
                    {!isUser && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pl-1">
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(msg.id, msg.content)}
                          className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500 rounded"
                        >
                          {speakingMessageId === msg.id ? (
                            <>
                              <Square className="w-3 h-3 fill-current" aria-hidden="true" />
                              <span>{c.stop}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{c.listen}</span>
                            </>
                          )}
                        </button>

                        {msg.isDemo && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium">
                            {c.demoResponse}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic p-2">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                <span>{c.thinking}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Starter Chips */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 overflow-x-auto flex gap-2 text-xs">
            {suggestedStarters.map((starter, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(starter)}
                disabled={isLoading}
                className="whitespace-nowrap px-3 py-1.5 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-lg border border-slate-200 hover:border-teal-300 font-medium transition-all shadow-2xs shrink-0"
              >
                {starter}
              </button>
            ))}
          </div>

          {/* Voice status bar (Matching Screenshot 1) */}
          {isListening && (
            <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs font-semibold text-rose-900">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                {c.listening}
              </span>
              <button
                type="button"
                onClick={handleToggleMic}
                className="text-rose-700 underline font-bold"
              >
                {c.cancel}
              </button>
            </div>
          )}

          {/* Input Box Area */}
          <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-slate-50/50 space-y-2">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
              
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white border border-slate-300 text-slate-700 hover:text-teal-700 hover:border-teal-400'
                }`}
                title={isTelugu ? 'మైక్రోఫోన్ ఉపయోగించండి' : 'Use microphone'}
                aria-label={isTelugu ? 'వాయిస్ ఇన్‌పుట్' : 'Voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={c.placeholder}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <span>{c.send}</span>
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>

            {isTelugu && (
              <section className="rounded-xl border border-teal-100 bg-white p-3 space-y-3" aria-labelledby="telugu-voice-title">
                <div>
                  <h2 id="telugu-voice-title" className="text-sm font-bold text-slate-800">
                    {c.speechVoiceSettingsTitle}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {c.speechVoiceSettingsHint}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { gender: 'female', label: c.speechVoiceFemale },
                    { gender: 'male', label: c.speechVoiceMale }
                  ].map(({ gender, label }) => (
                    <div key={gender} className="rounded-lg border border-slate-200 p-2.5 space-y-2">
                      <button
                        type="button"
                        onClick={() => updateSpeechVoiceSettings({ gender })}
                        aria-pressed={speechVoiceSettings.gender === gender}
                        className={`w-full rounded-lg px-3 py-2 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          speechVoiceSettings.gender === gender
                            ? 'bg-teal-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {label}
                      </button>
                      <label className="block text-xs font-semibold text-slate-600">
                        {c.speechVoiceSelect}
                        <select
                          value={speechVoiceSettings[`${gender}VoiceURI`]}
                          onChange={(event) => updateSpeechVoiceSettings({
                            [`${gender}VoiceURI`]: event.target.value
                          })}
                          disabled={teluguVoices.length === 0}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs text-slate-800 disabled:bg-slate-100"
                        >
                          <option value="">{c.speechVoiceSelectPlaceholder}</option>
                          {teluguVoices.map((voice, index) => (
                            <option key={`${voice.voiceURI}-${index}`} value={voice.voiceURI}>
                              {voice.name} ({voice.lang})
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleToggleSpeak(`preview-${gender}`, c.speechVoicePreviewText, gender)}
                        disabled={!speechVoiceSettings[`${gender}VoiceURI`] || speakingMessageId?.startsWith('preview-')}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50 disabled:cursor-not-allowed disabled:text-slate-400"
                      >
                        <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                        {c.speechVoicePreview}
                      </button>
                    </div>
                  ))}
                </div>

                {teluguVoices.length === 0 && (
                  <p role="status" className="text-xs text-amber-800">
                    {c.speechVoiceUnavailable}
                  </p>
                )}
              </section>
            )}

            {/* Mic Privacy Disclaimer (Matching Screenshot 1) */}
            <p className="text-[11px] text-slate-500 leading-tight">
              {c.micDisclaimer}
            </p>
            {speechError && (
              <p role="alert" className="text-xs text-rose-700">
                {speechError}
              </p>
            )}
          </div>

        </div>

        {/* Right Sidebar: Sources & Emergency Notice (Matching Screenshot 1) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Sources Section */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <h2 className="font-bold text-slate-900 text-sm tracking-wide">
              {c.sourcesTitle}
            </h2>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <a
                  href="https://www.who.int"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-teal-800 hover:underline flex items-center justify-between"
                >
                  <span>{isTelugu ? 'WHO ప్రాథమిక ఆరోగ్య సూచనలు' : 'WHO Health Guidelines'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
                </a>
                <p className="text-[11px] text-slate-500">
                  {isTelugu ? 'సమీక్షించబడిన సంవత్సరం: 2024' : 'Reviewed: 2024'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <a
                  href="https://www.nhp.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-teal-800 hover:underline flex items-center justify-between"
                >
                  <span>{isTelugu ? 'నేషనల్ హెల్త్ పోర్టల్ (ఇండియా)' : 'National Health Portal (India)'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
                </a>
                <p className="text-[11px] text-slate-500">
                  {isTelugu ? 'ఆరోగ్య & కుటుంబ సంక్షేమ మంత్రిత్వ శాఖ' : 'Ministry of Health & Family Welfare'}
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Callout Card (Matching Screenshot 1) */}
          <div className="bg-rose-50 border border-rose-200/90 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
              <span>{c.emergencyTitle}</span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              {c.emergencyText}
            </p>
            <a
              href="tel:112"
              className="inline-flex items-center justify-center gap-2 w-full bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{c.emergencyBtn}</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
