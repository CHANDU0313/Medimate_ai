import React from 'react';
import { PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function EmergencyBanner() {
  const { t } = useLanguage();
  const eb = t.emergencyBanner;

  return (
    <aside
      aria-label={eb.ariaLabel}
      className="bg-rose-100/90 border-b border-rose-200 text-rose-950 px-3 sm:px-4 py-2 sticky top-0 z-50 transition-all backdrop-blur-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">
            {eb.full}
          </span>
          <span className="sm:hidden font-semibold">
            {eb.compact}
          </span>
        </div>

        <a
          href="tel:112"
          className="inline-flex items-center gap-1.5 bg-[#991b1b] hover:bg-[#7f1d1d] active:bg-[#6b1515] text-white px-3.5 py-1 sm:py-1.5 rounded-full font-bold text-xs sm:text-sm transition-colors shadow-xs shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
          aria-label={eb.callBtn}
        >
          <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{eb.callBtn}</span>
        </a>
      </div>
    </aside>
  );
}
