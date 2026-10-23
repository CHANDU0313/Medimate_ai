import React, { useState } from 'react';
import { FileText, Copy, Check, Printer, Share2, ClipboardList } from 'lucide-react';
import { copyToClipboard, formatDoctorVisitSummary } from '../utils/formatters';

export default function DoctorSummaryCard({ summary, onToast, t, language = 'en' }) {
  const [copied, setCopied] = useState(false);

  if (!summary) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 text-center text-slate-400">
        <ClipboardList className="w-8 h-8 mx-auto text-slate-300 mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">
          {t?.summaryCard?.title || 'Doctor-Visit Summary'}
        </h3>
        <p className="text-xs max-w-xs mx-auto mt-1 text-slate-500">
          {t?.summaryCard?.emptyDesc || 'Your organized summary will appear here after asking questions or submitting symptoms.'}
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    const formatted = formatDoctorVisitSummary(summary, language);
    const success = await copyToClipboard(formatted);
    if (success) {
      setCopied(true);
      if (onToast) onToast(t?.app?.copiedToast || 'Doctor summary copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } else {
      if (onToast) onToast(t?.app?.copyFailedToast || 'Failed to copy summary. Please select and copy manually.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-6 transition-all print:border-none print:shadow-none">
      {/* Card Header with Copy Button */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t?.summaryCard?.title || 'Doctor-Visit Summary'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t?.summaryCard?.subtitle || 'Take this note to your clinician appointment'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-600 hover:bg-brand-700 text-white active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t?.summaryCard?.copiedBtn || 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t?.summaryCard?.copyBtn || 'Copy Summary'}</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            title="Print summary"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Structured Summary Grid */}
      <div className="space-y-3.5 text-xs sm:text-sm">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t?.summaryCard?.symptoms || 'Symptoms'}
            </span>
            <span className="font-semibold text-slate-900 mt-0.5 block truncate">
              {summary.symptoms || 'None'}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t?.summaryCard?.duration || 'Duration'}
            </span>
            <span className="font-semibold text-slate-900 mt-0.5 block truncate">
              {summary.duration || 'Not specified'}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t?.summaryCard?.severity || 'Severity'}
            </span>
            <span className="font-semibold text-slate-900 mt-0.5 block">
              {summary.severity || '5/10'}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t?.summaryCard?.ageRange || 'Age Group'}
            </span>
            <span className="font-semibold text-slate-900 mt-0.5 block capitalize truncate">
              {summary.patientAgeRange || summary.ageRange || 'Adult'}
            </span>
          </div>
        </div>

        {summary.context && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              {t?.summaryCard?.context || 'Context & Observations'}
            </span>
            <p className="text-slate-800 text-xs leading-relaxed">
              {summary.context}
            </p>
          </div>
        )}

        {/* Doctor Questions Checklist */}
        <div className="bg-brand-50/60 p-3.5 rounded-2xl border border-brand-100/70">
          <span className="text-[11px] font-bold text-brand-900 uppercase tracking-wider block mb-2">
            {t?.summaryCard?.questionsToAsk || 'Suggested Questions to Ask Your Doctor'}
          </span>
          <ul className="space-y-1.5 text-xs text-brand-950 font-medium">
            {(summary.suggestedQuestionsForDoctor || summary.questionsForClinician || [
              'What could be causing these symptoms?',
              'What red flags should I watch for over the next few days?',
              'Are any tests recommended?'
            ]).map((q, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-3.5 h-3.5 rounded border border-brand-400 bg-white inline-block shrink-0 mt-0.5" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
