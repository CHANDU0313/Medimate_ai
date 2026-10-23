import React from 'react';
import { HeartPulse, Globe, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import DemoBadge from './DemoBadge';

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  {t?.app?.name || 'MediMate AI'}
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-700 rounded-md">
                  Hackathon Edition
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 font-medium">
                {t?.app?.tagline || 'Your health questions, explained simply.'}
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo / Live Status Badge */}
            <DemoBadge isDemo={isDemo} isLive={isLive} />

            {/* Language Switcher */}
            <div className="relative inline-flex items-center">
              <Globe className="w-4 h-4 text-slate-500 absolute left-2.5 pointer-events-none" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                aria-label="Select Language"
                className="pl-8 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 focus:bg-white text-xs sm:text-sm font-medium text-slate-700 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition-all"
              >
                <option value="en">English (Simple)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* Clear Data Button */}
            <button
              onClick={onClearData}
              title={t?.app?.clearData || 'Clear session data'}
              aria-label={t?.app?.clearData || 'Clear session data'}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t?.app?.clearData || 'Clear my data'}</span>
            </button>

            {/* Privacy Modal Button */}
            <button
              onClick={onOpenPrivacy}
              title={t?.app?.privacyNotice || 'Privacy & Consent'}
              aria-label={t?.app?.privacyNotice || 'Privacy & Consent'}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl border border-slate-200 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span className="hidden lg:inline">{t?.app?.privacyNotice || 'Privacy'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Tagline Sub-bar */}
        <div className="sm:hidden pb-2 text-[11px] text-slate-500 font-medium truncate">
          {t?.app?.tagline || 'Your health questions, explained simply.'}
        </div>
      </div>
    </header>
  );
}
