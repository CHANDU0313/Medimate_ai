import React from 'react';
import { MessageSquare, Plus, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { formatTime } from '../utils/formatters';

export default function RecentConversations({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  t
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-4 sm:p-5 flex flex-col h-full transition-all">
      {/* Header with New Checkup button */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600" />
          <h2 className="text-sm font-bold text-slate-900">
            {t?.history?.title || 'Recent Sessions'}
          </h2>
        </div>

        <button
          onClick={onNewSession}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold rounded-xl border border-brand-200 transition-colors active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t?.nav?.newCheckup || '+ New'}</span>
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {sessions.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            {t?.history?.empty || 'No recent conversations.'}
          </p>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const messageCount = session.messages?.length || 0;

            return (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center justify-between gap-2 group ${
                  isActive
                    ? 'bg-brand-50/80 border-brand-200 text-brand-950 shadow-2xs'
                    : 'bg-slate-50/50 hover:bg-slate-100/80 border-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    isActive ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600 group-hover:bg-brand-100 group-hover:text-brand-600'
                  }`}>
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold truncate block">
                        {session.title || 'Health Checkup'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>{messageCount} {messageCount === 1 ? 'message' : 'messages'}</span>
                      {session.isSample && (
                        <span className="px-1.5 py-0.2 bg-blue-100 text-brand-700 font-semibold rounded text-[9px]">
                          {t?.history?.sampleTag || 'Sample'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-brand-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                }`} />
              </button>
            );
          })
        )}
      </div>

      {/* Helpful Quick Tip Card */}
      <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
        <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
          💡 Patient Tip:
        </span>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Note down the time your symptoms started and what makes them feel better. This helps your doctor immensely!
        </p>
      </div>
    </div>
  );
}
