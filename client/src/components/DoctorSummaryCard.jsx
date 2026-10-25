import React, { useState } from 'react';
import { Copy, Check, Printer } from 'lucide-react';
import { copyToClipboard, formatDoctorVisitSummary } from '../utils/formatters';

export default function DoctorSummaryCard({ summary, onToast, t, language = 'en' }) {
  const [copied, setCopied] = useState(false);
  const isTelugu = language === 'te';
  const sc = t?.summaryCard || {};

  const defaultSummary = {
    symptoms: isTelugu ? 'తలనొప్పి' : 'Headache',
    duration: isTelugu ? 'ఈ రోజు ఉదయం నుండి' : 'Since this morning',
    severity: '6/10',
    ageRange: '18-30',
    context: isTelugu ? 'స్క్రీన్ పని ఎక్కువ' : 'Working on computer',
    recommendedQuestions: [
      isTelugu ? 'నా తలనొప్పికి సాధారణ కారణాలు ఏమిటి?' : 'What could be causing my headache?',
      isTelugu ? 'నేను ఏవైనా పరీక్షలు చేయించుకోవాలా?' : 'Are there any tests I should get?',
      isTelugu ? 'భవిష్యత్తులో ఇది రాకుండా ఉండటానికి ఏం చేయాలి?' : 'What can I do to prevent it in the future?'
    ]
  };

  const active = summary || defaultSummary;

  const handleCopy = async () => {
    const formatted = formatDoctorVisitSummary(active, language);
    const success = await copyToClipboard(formatted);
    if (success) {
      setCopied(true);
      if (onToast) onToast(isTelugu ? 'డాక్టర్ సారాంశం కాపీ చేయబడింది!' : 'Doctor summary copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4 transition-all">
      {/* Header with Print & Copy buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            {sc.title || 'Doctor-Visit Summary'}
          </h3>
          <p className="text-xs text-slate-500">
            {sc.subtitle || 'Take this structured note to your clinician.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            title={isTelugu ? 'సారాంశాన్ని ముద్రించండి' : 'Print summary'}
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isTelugu ? 'ప్రింట్' : 'Print'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
            }`}
            aria-label={copied ? (sc.copiedBtn || 'Copied!') : (sc.copyBtn || 'Copy to Clipboard')}
          >
            {copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>{copied ? (sc.copiedBtn || 'Copied!') : (sc.copyBtn || 'Copy to Clipboard')}</span>
          </button>
        </div>
      </div>

      {/* Summary of your symptoms table */}
      <div className="space-y-2 text-xs">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200/60">
            <div>
              <span className="text-slate-500 block font-medium">{sc.symptoms || 'Main Symptoms'}</span>
              <strong className="text-slate-900 text-sm">{active.symptoms}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">{sc.duration || 'Duration'}</span>
              <strong className="text-slate-900 text-sm">{active.duration}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 block font-medium">{sc.severity || 'Severity'}</span>
              <span className="font-bold text-teal-800">{active.severity}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">{sc.ageRange || 'Age Range'}</span>
              <span className="text-slate-700">{active.ageRange}</span>
            </div>
          </div>

          {active.context && (
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-slate-500 block font-medium">{sc.context || 'Context'}</span>
              <p className="text-slate-700">{active.context}</p>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Questions for Clinician */}
      <div className="space-y-2 text-xs pt-1">
        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
          {sc.questionsToAsk || 'Questions to Ask Your Doctor'}
        </h4>
        <ul className="space-y-1.5 list-disc list-inside text-slate-700">
          {(active.recommendedQuestions || active.suggestedQuestionsForDoctor || []).map((q, idx) => (
            <li key={idx} className="leading-relaxed">
              {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
