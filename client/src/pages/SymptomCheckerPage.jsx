import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import SymptomForm from '../components/SymptomForm';
import SymptomResultCard from '../components/SymptomResultCard';
import DoctorSummaryCard from '../components/DoctorSummaryCard';
import UrgencyAlert from '../components/UrgencyAlert';

export default function SymptomCheckerPage() {
  const { language, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [symptomResult, setSymptomResult] = useState(null);
  const [doctorSummary, setDoctorSummary] = useState(null);
  const [currentUrgency, setCurrentUrgency] = useState(null);
  const [emergencyPayload, setEmergencyPayload] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, language })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze symptoms.');
      }

      if (data.emergency) {
        setCurrentUrgency('emergency');
        setEmergencyPayload(data.emergencyPayload);
      } else {
        setCurrentUrgency(data.explanation?.urgency || 'routine');
        setEmergencyPayload(null);
      }

      setSymptomResult(data.explanation);
      setDoctorSummary(data.doctorSummary);
    } catch (err) {
      console.error('Symptom check error:', err);
      setError(err.message || 'An error occurred while evaluating symptoms.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSymptomResult(null);
    setDoctorSummary(null);
    setCurrentUrgency(null);
    setEmergencyPayload(null);
    setError(null);
  };

  const isTelugu = language === 'te';

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t.form.title}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          {t.form.subtitle}
        </p>
      </div>

      {/* Emergency Banner if triggered */}
      {currentUrgency === 'emergency' && emergencyPayload && (
        <UrgencyAlert payload={emergencyPayload} language={language} />
      )}

      {/* Main Grid: Form on left, Results on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-card">
          <SymptomForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            t={t}
            language={language}
          />
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm" role="alert">
              <span className="font-bold">{isTelugu ? 'లోపం: ' : 'Error: '}</span>
              {error}
            </div>
          )}

          {symptomResult ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  {t.results.title}
                </h2>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline focus:outline-none focus:ring-1 focus:ring-teal-500 rounded"
                >
                  {isTelugu ? 'మళ్లీ పరిశీలించండి' : 'Start over'}
                </button>
              </div>

              <SymptomResultCard result={symptomResult} t={t} language={language} />

              {doctorSummary && (
                <DoctorSummaryCard summary={doctorSummary} t={t} language={language} />
              )}
            </div>
          ) : (
            <div className="bg-slate-50/80 rounded-3xl p-8 border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 mx-auto flex items-center justify-center font-bold text-xl" aria-hidden="true">
                🩺
              </div>
              <h3 className="font-bold text-slate-800 text-base">
                {isTelugu ? 'మీ ఫలితాలు ఇక్కడ కనిపిస్తాయి' : 'Your structured results will appear here'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                {t.results.emptyState}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
