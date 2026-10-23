import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';

export default function DemoBadge({ isDemo, isLive }) {
  if (isLive && !isDemo) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>Gemini AI Connected</span>
      </div>
    );
  }

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-xs font-medium text-amber-800 shadow-sm"
      title="API Key is not configured. High-quality pre-written demo responses are active."
    >
      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
      <span className="font-semibold">Demo Mode</span>
      <span className="hidden sm:inline text-amber-700">— AI not connected. Showing sample responses.</span>
    </div>
  );
}
