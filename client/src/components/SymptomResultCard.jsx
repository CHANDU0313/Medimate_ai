import React from 'react';
import { HelpCircle, HeartHandshake, AlertTriangle, Clock, MessageSquare, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SymptomResultCard({ result, t }) {
  if (!result) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-8 text-center text-slate-400">
        <Sparkles className="w-10 h-10 mx-auto text-brand-300 mb-3 animate-pulse" />
        <h3 className="text-base font-semibold text-slate-700 mb-1">
          {t?.results?.title || 'Educational Symptom Explanation'}
        </h3>
        <p className="text-xs max-w-sm mx-auto leading-relaxed">
          {t?.results?.emptyState || 'Fill out the symptom form to view structured insights and self-care tips here.'}
        </p>
      </div>
    );
  }

  const {
    possibleExplanations = [],
    selfCareInfo = [],
    warningSigns = [],
    whenToSeeDoctor = [],
    questionsForClinician = []
  } = result;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-6 transition-all">
      {/* Educational Notice Banner */}
      <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div className="text-xs text-brand-900 leading-relaxed">
          <strong className="font-semibold block text-brand-950">
            {t?.results?.title || 'Educational Symptom Explanation'}
          </strong>
          {t?.results?.disclaimerNotice || 'Framed as common, possible explanations — NOT a medical diagnosis.'}
        </div>
      </div>

      {/* 1. Possible Explanations */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-600" />
          {t?.results?.explanationsHeader || 'Possible, Common Explanations'}
        </h3>
        <div className="grid gap-2.5">
          {possibleExplanations.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition-colors">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                {typeof item === 'string' ? item : item.title}
              </h4>
              {typeof item === 'object' && item.description && (
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Self-Care Information */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          {t?.results?.selfCareHeader || 'Safe Self-Care Information'}
        </h3>
        <ul className="space-y-2">
          {selfCareInfo.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100/60 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Warning Signs to Watch For */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          {t?.results?.warningSignsHeader || 'Warning Signs to Watch For'}
        </h3>
        <ul className="space-y-2">
          {warningSigns.map((sign, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100/60 text-xs text-amber-900">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
              <span className="leading-relaxed">{sign}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. When to See a Doctor */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          {t?.results?.whenToSeeDoctorHeader || 'When to See a Doctor'}
        </h3>
        <ul className="space-y-2">
          {whenToSeeDoctor.map((timing, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/40 border border-indigo-100/50 text-xs text-indigo-950">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
              <span className="leading-relaxed">{timing}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Questions to Ask Your Clinician */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-600" />
          {t?.results?.questionsHeader || 'Questions to Ask Your Clinician'}
        </h3>
        <div className="p-3 bg-brand-50/50 rounded-2xl border border-brand-100 space-y-2">
          {questionsForClinician.map((question, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-brand-950">
              <span className="font-bold text-brand-600">{idx + 1}.</span>
              <span className="leading-relaxed font-medium">{question}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
