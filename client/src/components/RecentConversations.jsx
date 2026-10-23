import React from 'react';
import { Plus, Compass, Clock, FileText, Trash2, ChevronRight, MessageSquare } from 'lucide-react';

export default function RecentConversations({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onNavigateTab,
  onClearData,
  activeTab,
  t
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col h-[650px] transition-all">
      {/* 1. + New Chat Main Action Button */}
      <button
        onClick={onNewSession}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all active:scale-98 mb-4"
      >
        <Plus className="w-4 h-4" />
        <span>New Chat</span>
      </button>

      {/* 2. Navigation Menu Items matching mockup */}
      <nav className="space-y-1.5 mb-5 pb-4 border-b border-slate-100 text-xs font-semibold text-slate-700">
        <button
          onClick={() => onNavigateTab('symptoms')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
            activeTab === 'symptoms'
              ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Compass className="w-4 h-4 text-brand-600" />
          <span>Symptom Explorer</span>
        </button>

        <button
          onClick={() => onNavigateTab('chat')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
            activeTab === 'chat'
              ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4 text-brand-600" />
          <span>Recent Conversations</span>
        </button>

        <button
          onClick={() => onNavigateTab('summary')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
            activeTab === 'summary'
              ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4 text-brand-600" />
          <span>Doctor Summary</span>
        </button>
      </nav>

      {/* 3. Session History List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1 mb-1">
          Saved Sessions
        </span>
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId && activeTab === 'chat';
          return (
            <button
              key={session.id}
              onClick={() => {
                onSelectSession(session.id);
                onNavigateTab('chat');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all border flex items-center justify-between gap-2 text-xs ${
                isActive
                  ? 'bg-brand-50 border-brand-200 text-brand-900 font-semibold shadow-2xs'
                  : 'bg-slate-50/70 hover:bg-slate-100/90 border-slate-100 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate block">
                  {session.title || "I've had a headache since..."}
                </span>
              </div>
              {session.isSample && (
                <span className="px-1.5 py-0.5 bg-blue-100 text-brand-700 font-bold text-[9px] rounded shrink-0">
                  Sample
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Clear My Data Button (Bottom of Sidebar matching Mockup) */}
      <div className="pt-3 border-t border-slate-100 mt-2">
        <button
          onClick={onClearData}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
          <span>Clear My Data</span>
        </button>
      </div>
    </div>
  );
}
