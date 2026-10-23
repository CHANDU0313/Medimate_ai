import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, RefreshCw, HelpCircle, ShieldAlert } from 'lucide-react';
import { formatTime } from '../utils/formatters';

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
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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

  const starters = t?.chat?.starters || [
    "I've had a headache since this morning after working on screens.",
    "How can I tell the difference between a cold and seasonal allergies?",
    "What are simple, safe ways to soothe a sore throat at home?",
    "Why do my knees feel stiff in the morning when I wake up?"
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card flex flex-col h-[650px] sm:h-[720px] overflow-hidden transition-all">
      {/* Chat Window Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {t?.chat?.title || 'AI Health Chat'}
              </h2>
              {isSample && (
                <span className="px-2 py-0.5 bg-blue-100 text-brand-700 text-[10px] font-semibold rounded-full border border-blue-200">
                  {t?.chat?.sampleBadge || 'Sample conversation'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {t?.chat?.subtitle || 'Plain language health education. Not a clinical diagnosis.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">Active Assistant</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Bot className="w-12 h-12 text-brand-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">
              {t?.chat?.emptyTitle || 'Welcome to MediMate AI'}
            </h3>
            <p className="text-xs max-w-sm mt-1 text-slate-500">
              {t?.chat?.emptyDesc || 'Choose a starter question below or ask about any everyday health topic.'}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isEmergencyMsg = msg.urgency === 'emergency' || msg.emergency;

            return (
              <div
                key={msg.id || index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}
              >
                {!isUser && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-2xs ${
                    isEmergencyMsg ? 'bg-red-600 text-white' : 'bg-brand-50 text-brand-600'
                  }`}>
                    {isEmergencyMsg ? <ShieldAlert className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4" />}
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-brand-600 text-white rounded-br-xs'
                      : isEmergencyMsg
                      ? 'bg-red-50 text-red-950 border-2 border-red-300 rounded-bl-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-line font-normal">
                    {msg.content}
                  </div>

                  {/* Suggested Follow-ups if provided */}
                  {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/70 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                        Related Topics:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.suggestedFollowUps.map((suggested, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleStarterClick(suggested)}
                            className="text-[11px] px-2.5 py-1 bg-white hover:bg-brand-50 text-brand-700 font-medium rounded-lg border border-slate-200 transition-colors text-left"
                          >
                            ↳ {suggested}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className={`text-[10px] mt-1.5 text-right ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                    {formatTime(msg.timestamp || new Date().toISOString())}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Typing Loading Indicator Skeleton */}
        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 text-slate-600 rounded-2xl rounded-bl-xs px-4 py-3 text-xs flex items-center gap-2">
              <span className="font-medium">{t?.chat?.thinking || 'MediMate is thinking'}</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* Error and Retry State */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shrink-0 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                {t?.chat?.retry || 'Retry'}
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Chips */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-brand-500" />
          <span>{t?.chat?.suggestedStartersTitle || 'Suggested starter questions:'}</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {starters.map((starter, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleStarterClick(starter)}
              className="text-xs px-3 py-1.5 bg-white hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 text-slate-700 font-medium rounded-xl border border-slate-200 shadow-2xs whitespace-nowrap transition-all active:scale-95 disabled:opacity-50"
            >
              {starter}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t?.chat?.placeholder || 'Type your health question in plain language...'}
          disabled={isLoading}
          maxLength={1500}
          className="flex-1 px-4 py-2.5 sm:py-3 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 sm:p-3 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl shadow-sm transition-all active:scale-95 flex items-center justify-center shrink-0"
          aria-label={t?.chat?.send || 'Send message'}
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </form>
    </div>
  );
}
