import React from 'react';
import { HeartPulse, Globe, Trash2, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar({ 
  currentLanguage, 
  onLanguageChange, 
  onClearData, 
  onOpenPrivacy, 
  isLive, 
  isDemo, 
  t 
}) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Left: Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-brand-600">
                  MediMate AI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Your health questions, explained simply.
              </p>
            </div>
          </div>

          {/* Center Tagline (from Mockup) */}
          <div className="hidden lg:block text-center">
            <p className="text-sm font-semibold text-brand-700">
              Reimagine Everyday Life —
            </p>
            <p className="text-sm font-bold text-slate-800">
              Make the Complex Simple.
            </p>
          </div>

          {/* Right: Language Pills & Status Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Mode Badge */}
            <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-full shadow-2xs">
              {isLive ? '🟢 Gemini AI' : '🟡 Demo mode'}
            </span>

            {/* Language Switcher Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
              <Globe className="w-3.5 h-3.5 text-slate-500 mx-1.5 hidden sm:inline" />
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currentLanguage === 'en'
                    ? 'bg-brand-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('te')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currentLanguage === 'te'
                    ? 'bg-brand-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                తెలుగు
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currentLanguage === 'hi'
                    ? 'bg-brand-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
