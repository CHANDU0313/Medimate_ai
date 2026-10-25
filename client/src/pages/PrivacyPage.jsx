import React, { useState } from 'react';
import { Lock, ShieldCheck, EyeOff, Trash2, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { clearAllSessionData } from '../utils/storage';

export default function PrivacyPage() {
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';
  const p = t.privacyPage;

  const [clearStatus, setClearStatus] = useState(null);

  const handleClear = () => {
    clearAllSessionData();
    setClearStatus(
      isTelugu
        ? 'మీ బ్రౌజర్‌లోని అన్ని తాత్కాలిక డేటా విజయవంతంగా తొలగించబడింది.'
        : 'All session data has been purged from your browser.'
    );
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
          <Lock className="w-4 h-4" aria-hidden="true" />
          <span>{p.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {p.heading}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {p.subheading}
        </p>
      </div>

      {/* 3 Privacy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <EyeOff className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">
            {p.pillar1Title}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {p.pillar1Desc}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">
            {p.pillar2Title}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {p.pillar2Desc}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">
            {p.pillar3Title}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {p.pillar3Desc}
          </p>
        </div>

      </div>

      {/* DPDP Act 2023 & Compliance Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          {p.dpdpHeading}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {p.dpdpDesc}
        </p>

        <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200/80 text-teal-900 text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            {p.mapPrivacyNotice}
          </p>
        </div>
      </div>

      {/* Clear Data Button */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            {p.purgeTitle}
          </h3>
          <p className="text-xs text-slate-500">
            {p.purgeDesc}
          </p>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition-colors shadow-xs"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          <span>{p.purgeBtn}</span>
        </button>
      </div>

      {clearStatus && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{clearStatus}</span>
        </div>
      )}

    </div>
  );
}
