import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Bot, Sparkles, AlertCircle, RefreshCw, ShieldAlert } from 'lucide-react';
import { formatTime } from '../utils/formatters';

const DEFAULT_STARTERS = [
  "What causes a headache?",
  "How to improve sleep?",
  "Is a sore throat serious?",
  "Healthy diet tips"
];

export default function ChatWindow({
  messages,
  onSendMessage,
  isLoading,
  error,
  onRetry,
  isSample,
  t,
  language = 'en'
}) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleStarterClick = (question) => {
    if (isLoading) return;
    onSendMessage(question);
  };

  const starters = (t?.chat?.starters && t.chat.starters.length > 0) ? t.chat.starters : DEFAULT_STARTERS;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[650px] overflow-hidden transition-all">
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          /* EMPTY STATE (Matching Screen 1 of Mockup) */
          <div className="h-full flex flex-col justify-center items-center text-center p-4 sm:p-6 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
              Hello! 👋
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
              How can I help you today?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              Ask health questions, check symptoms, or get health education in simple language.
            </p>

            {/* Example questions */}
            <div className="w-full space-y-2">
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Try these example questions:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {DEFAULT_STARTERS.map((starter, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleStarterClick(starter)}
                    className="text-xs px-3.5 py-2 bg-blue-50/70 hover:bg-blue-100 text-brand-700 font-semibold rounded-xl border border-blue-200/80 transition-all shadow-2xs hover:scale-102"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE CONVERSATION (Matching Screen 2 of Mockup) */
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isEmergencyMsg = msg.urgency === 'emergency' || msg.emergency;

            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-brand-600 text-white rounded-br-xs font-medium'
                      : isEmergencyMsg
                      ? 'bg-red-50 text-red-950 border-2 border-red-300 rounded-bl-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {msg.content}
                  </div>

                  {/* Follow-up question chips */}
                  {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Related Topics:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.suggestedFollowUps.map((suggested, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleStarterClick(suggested)}
                            className="text-[11px] px-2.5 py-1 bg-slate-50 hover:bg-blue-50 text-brand-700 font-medium rounded-lg border border-slate-200 transition-colors"
                          >
                            ↳ {suggested}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Timestamp */}
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {formatTime(msg.timestamp || new Date().toISOString()) || '10:24 AM'}
                </span>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="bg-white border border-slate-200 text-slate-600 rounded-2xl rounded-bl-xs px-4 py-3 text-xs flex items-center gap-2 shadow-2xs">
              <span className="font-medium">MediMate is writing</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-2 py-1 bg-red-600 text-white rounded-lg font-bold text-xs"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Persistent Disclaimer Subtext */}
      <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 text-center">
        MediMate AI provides general health information only. It is not a doctor and cannot diagnose or treat.
      </div>

      {/* Input Bar with Circular Send Button matching Mockup */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your health question..."
          disabled={isLoading}
          maxLength={1500}
          className="flex-1 px-4 py-2.5 sm:py-3 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white shadow-sm flex items-center justify-center shrink-0 transition-transform active:scale-95"
          aria-label="Send message"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </form>
    </div>
  );
}
