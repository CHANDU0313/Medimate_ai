import React from 'react';
import { AlertTriangle, Clock, Sparkles } from 'lucide-react';

export default function SymptomResultCard({ result, t }) {
  // Default values matching Screen 4 of mockup if none generated yet
  const defaultExplanations = [
    { title: 'Tension headache', description: 'Often caused by stress, lack of sleep, or screen fatigue.' },
    { title: 'Dehydration', description: 'Insufficient fluid intake during the day.' },
    { title: 'Eye strain', description: 'Prolonged focus on digital screens or uncorrected vision.' },
    { title: 'Sinus-related headache', description: 'Pressure or congestion in facial sinus cavities.' }
  ];

  const defaultSelfCare = [
    'Rest in a quiet, dark place',
    'Stay hydrated',
    'Try gentle neck stretches',
    'Use a cold or warm compress'
  ];

  const defaultWarningSigns = [
    'Headache gets worse over time',
    'Fever, stiff neck, confusion',
    'Vision changes, weakness'
  ];

  const defaultWhenToSee = [
    'If headaches persist, worsen, or come with other symptoms.'
  ];

  const explanations = result?.possibleExplanations || defaultExplanations;
  const selfCare = result?.selfCareInfo || defaultSelfCare;
  const warningSigns = result?.warningSigns || defaultWarningSigns;
  const whenToSee = result?.whenToSeeDoctor || defaultWhenToSee;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4 transition-all">
      {/* Top Banner matching Screen 4 */}
      <div className="bg-red-600 text-white p-3.5 rounded-xl shadow-xs space-y-1">
        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
          <span>⚠️</span>
          <span>Seek Medical Attention Soon</span>
        </div>
        <p className="text-[11px] text-red-100 font-medium">
          If symptoms worsen or you feel very unwell, please see a doctor soon.
        </p>
      </div>

      {/* 1. Possible explanations (not a diagnosis) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Possible explanations (not a diagnosis)
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-700">
          {explanations.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-brand-600 font-bold">•</span>
              <div>
                <strong className="text-slate-900 font-semibold">
                  {typeof item === 'string' ? item : item.title}
                </strong>
                {typeof item === 'object' && item.description && (
                  <span className="text-slate-500 block text-[11px]">{item.description}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Self-care information */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Self-care information
        </h3>
        <ul className="space-y-1 text-xs text-slate-700">
          {selfCare.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Warning signs to watch for */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Warning signs to watch for
        </h3>
        <ul className="space-y-1 text-xs text-slate-700">
          {warningSigns.map((sign, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>{sign}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. When to see a doctor */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand-600" />
          <span>When to see a doctor</span>
        </h3>
        <ul className="space-y-1 text-xs text-slate-600">
          {whenToSee.map((timing, idx) => (
            <li key={idx} className="leading-relaxed">
              {timing}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
