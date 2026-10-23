import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard, formatDoctorVisitSummary } from '../utils/formatters';

export default function DoctorSummaryCard({ summary, onToast, t, language = 'en' }) {
  const [copied, setCopied] = useState(false);

  // Defaults matching Screen 5 of mockup
  const defaultSummary = {
    symptoms: 'Headache',
    duration: 'Since this morning',
    severity: '6/10',
    patientAgeRange: '18-30',
    context: 'No other symptoms',
    suggestedQuestionsForDoctor: [
      'What could be causing my headache?',
      'Are there any tests I should get?',
      'What can I do to prevent it in the future?'
    ]
  };

  const active = summary || defaultSummary;

  const handleCopy = async () => {
    const formatted = formatDoctorVisitSummary(active, language);
    const success = await copyToClipboard(formatted);
    if (success) {
      setCopied(true);
      if (onToast) onToast('Summary copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4 transition-all">
      {/* Header with Copy to clipboard button matching Screen 5 */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          Doctor-Visit Summary
        </h3>

        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 active:scale-95'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy to clipboard'}</span>
        </button>
      </div>

      {/* Summary of your symptoms table */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Summary of your symptoms
        </h4>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
            <span className="text-slate-500 font-medium">Main symptom(s):</span>
            <span className="font-semibold text-slate-900">{active.symptoms || 'Headache'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
            <span className="text-slate-500 font-medium">Duration:</span>
            <span className="font-semibold text-slate-900">{active.duration || 'Since this morning'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
            <span className="text-slate-500 font-medium">Severity:</span>
            <span className="font-semibold text-slate-900">{active.severity || '6/10'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
            <span className="text-slate-500 font-medium">Age range:</span>
            <span className="font-semibold text-slate-900">{active.patientAgeRange || '18-30'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Context:</span>
            <span className="font-semibold text-slate-900">{active.context || 'No other symptoms'}</span>
          </div>
        </div>
      </div>

      {/* Questions to ask your clinician */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Questions to ask your clinician
        </h4>
        <ul className="space-y-1.5 text-xs text-slate-700">
          {(active.suggestedQuestionsForDoctor || [
            'What could be causing my headache?',
            'Are there any tests I should get?',
            'What can I do to prevent it in the future?'
          ]).map((q, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-brand-600 font-bold">•</span>
              <span className="leading-relaxed">{q}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footnote matching Screen 5 */}
      <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-100 leading-tight">
        This summary is for your reference and not a diagnosis. Always consult a healthcare professional.
      </p>
    </div>
  );
}
