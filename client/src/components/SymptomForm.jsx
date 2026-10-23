import React, { useState } from 'react';
import { Stethoscope, Sparkles, AlertCircle, RefreshCw, HelpCircle, Check, Zap } from 'lucide-react';

const SEVERITY_EMOJIS = [
  { level: 1, emoji: '😊', label: 'Very Mild' },
  { level: 2, emoji: '🙂', label: 'Mild' },
  { level: 3, emoji: '😐', label: 'Noticeable' },
  { level: 4, emoji: '😕', label: 'Moderate' },
  { level: 5, emoji: '😟', label: 'Distracting' },
  { level: 6, emoji: '😣', label: 'Distressing' },
  { level: 7, emoji: '😖', label: 'Severe' },
  { level: 8, emoji: '😫', label: 'Intense' },
  { level: 9, emoji: '😭', label: 'Very Severe' },
  { level: 10, emoji: '🚨', label: 'Worst Imaginable' }
];

export default function SymptomForm({ onSubmit, isLoading, t, language = 'en' }) {
  const [formData, setFormData] = useState({
    mainSymptom: '',
    duration: '',
    severity: 4,
    ageRange: 'youngAdult',
    context: '',
    otherDetails: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.mainSymptom.trim()) {
      newErrors.mainSymptom = t?.form?.mainSymptomError || 'Main symptom is required.';
    } else if (formData.mainSymptom.trim().length < 3) {
      newErrors.mainSymptom = 'Please enter at least 3 characters.';
    } else if (formData.mainSymptom.length > 500) {
      newErrors.mainSymptom = 'Main symptom cannot exceed 500 characters.';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = t?.form?.durationError || 'Please state how long this symptom has lasted.';
    } else if (formData.duration.length > 200) {
      newErrors.duration = 'Duration cannot exceed 200 characters.';
    }

    if (formData.context.length > 500) {
      newErrors.context = 'Context details cannot exceed 500 characters.';
    }

    if (formData.otherDetails.length > 500) {
      newErrors.otherDetails = 'Other details cannot exceed 500 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleQuickFill = (preset) => {
    setFormData(preset);
    setErrors({});
  };

  const handleReset = () => {
    setFormData({
      mainSymptom: '',
      duration: '',
      severity: 4,
      ageRange: 'youngAdult',
      context: '',
      otherDetails: ''
    });
    setErrors({});
  };

  const currentSeverityItem = SEVERITY_EMOJIS.find(s => s.level === Number(formData.severity)) || SEVERITY_EMOJIS[3];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-6 transition-all">
      {/* Form Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="p-2.5 bg-brand-50 text-brand-600 rounded-2xl">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {t?.form?.title || 'Symptom Information Form'}
          </h2>
          <p className="text-xs text-slate-500">
            {t?.form?.subtitle || 'Get a structured educational explanation & visit summary.'}
          </p>
        </div>
      </div>

      {/* Fast Hackathon Presets */}
      <div className="mb-5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Demo Presets:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickFill({
              mainSymptom: 'Dull forehead headache and neck stiffness',
              duration: 'Since this morning (about 5 hours)',
              severity: 4,
              ageRange: 'youngAdult',
              context: 'Worked 7 hours on laptop without breaks, drank only 1 cup of coffee',
              otherDetails: 'Light bothers my eyes slightly, feels better when closing eyes'
            })}
            className="text-[11px] px-2.5 py-1 bg-white hover:bg-brand-50 hover:text-brand-700 text-slate-700 font-medium rounded-lg border border-slate-200 shadow-2xs transition-all"
          >
            💻 Laptop Headache
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill({
              mainSymptom: 'Scratchy sore throat with runny nose and mild sneeze',
              duration: 'Started 2 days ago',
              severity: 3,
              ageRange: 'middleAdult',
              context: 'Colleague had a seasonal head cold earlier this week',
              otherDetails: 'Drinking warm tea feels soothing, no high fever'
            })}
            className="text-[11px] px-2.5 py-1 bg-white hover:bg-brand-50 hover:text-brand-700 text-slate-700 font-medium rounded-lg border border-slate-200 shadow-2xs transition-all"
          >
            🍵 Sore Throat / Cold
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill({
              mainSymptom: "Severe crushing chest pain and can't breathe",
              duration: 'Started suddenly 10 minutes ago',
              severity: 10,
              ageRange: 'middleAdult',
              context: 'High blood pressure history',
              otherDetails: 'Pain radiating down left arm'
            })}
            className="text-[11px] px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg border border-red-200 shadow-2xs transition-all"
          >
            🚨 Emergency Test Trigger
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* 1. Main Symptom */}
        <div>
          <label htmlFor="mainSymptom" className="block font-semibold text-slate-800 mb-1">
            {t?.form?.mainSymptomLabel || 'Main Symptom(s)'} <span className="text-red-500">*</span>
          </label>
          <input
            id="mainSymptom"
            type="text"
            value={formData.mainSymptom}
            onChange={(e) => handleChange('mainSymptom', e.target.value)}
            placeholder={t?.form?.mainSymptomPlaceholder || 'e.g., Dull throbbing headache on forehead, mild sore throat'}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.mainSymptom ? 'border-red-400 bg-red-50/40 focus:ring-red-400' : 'border-slate-200 bg-slate-50/50 focus:border-brand-500 focus:bg-white'
            } text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all`}
          />
          {errors.mainSymptom && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.mainSymptom}
            </p>
          )}
        </div>

        {/* 2. Duration */}
        <div>
          <label htmlFor="duration" className="block font-semibold text-slate-800 mb-1">
            {t?.form?.durationLabel || 'How long have you felt this?'} <span className="text-red-500">*</span>
          </label>
          <input
            id="duration"
            type="text"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder={t?.form?.durationPlaceholder || 'e.g., Since this morning, 3 days, 2 weeks'}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.duration ? 'border-red-400 bg-red-50/40 focus:ring-red-400' : 'border-slate-200 bg-slate-50/50 focus:border-brand-500 focus:bg-white'
            } text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all`}
          />
          {errors.duration && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.duration}
            </p>
          )}
        </div>

        {/* 3. Severity Level (Slider + Visual Face Scale) */}
        <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="severity" className="font-semibold text-slate-800">
              {t?.form?.severityLabel || 'Severity Level'}
            </label>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xl" role="img" aria-label="Severity face">
                {currentSeverityItem.emoji}
              </span>
              <span className="font-bold text-brand-700 text-sm">
                {formData.severity} / 10
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline">
                ({currentSeverityItem.label})
              </span>
            </div>
          </div>

          <input
            id="severity"
            type="range"
            min="1"
            max="10"
            step="1"
            value={formData.severity}
            onChange={(e) => handleChange('severity', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none"
          />

          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5 px-1 font-medium">
            <span>1 (Mild)</span>
            <span>5 (Moderate)</span>
            <span>10 (Severe)</span>
          </div>
        </div>

        {/* 4. Age Range */}
        <div>
          <label htmlFor="ageRange" className="block font-semibold text-slate-800 mb-1">
            {t?.form?.ageRangeLabel || 'Age Range'}
          </label>
          <select
            id="ageRange"
            value={formData.ageRange}
            onChange={(e) => handleChange('ageRange', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
          >
            <option value="infant">{t?.form?.ageRangeOptions?.infant || 'Infant / Toddler (0 - 2 years)'}</option>
            <option value="child">{t?.form?.ageRangeOptions?.child || 'Child (3 - 12 years)'}</option>
            <option value="teen">{t?.form?.ageRangeOptions?.teen || 'Adolescent (13 - 17 years)'}</option>
            <option value="youngAdult">{t?.form?.ageRangeOptions?.youngAdult || 'Young Adult (18 - 35 years)'}</option>
            <option value="middleAdult">{t?.form?.ageRangeOptions?.middleAdult || 'Adult (36 - 64 years)'}</option>
            <option value="senior">{t?.form?.ageRangeOptions?.senior || 'Older Adult (65+ years)'}</option>
          </select>
        </div>

        {/* 5. Relevant Context */}
        <div>
          <label htmlFor="context" className="block font-semibold text-slate-800 mb-1">
            {t?.form?.contextLabel || 'Relevant Context (Optional)'}
          </label>
          <input
            id="context"
            type="text"
            value={formData.context}
            onChange={(e) => handleChange('context', e.target.value)}
            placeholder={t?.form?.contextPlaceholder || 'e.g., Stared at screens, worked late, history of migraine, high blood pressure...'}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* 6. Other Details */}
        <div>
          <label htmlFor="otherDetails" className="block font-semibold text-slate-800 mb-1">
            {t?.form?.otherDetailsLabel || 'Other Details (Optional)'}
          </label>
          <textarea
            id="otherDetails"
            rows="2"
            value={formData.otherDetails}
            onChange={(e) => handleChange('otherDetails', e.target.value)}
            placeholder={t?.form?.otherDetailsPlaceholder || 'e.g., Any remedies already tried, changes after meals or resting...'}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold rounded-2xl shadow-md shadow-brand-600/20 transition-all active:scale-98"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t?.form?.submittingBtn || 'Analyzing symptoms...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t?.form?.submitBtn || 'Analyze Symptoms & Prepare Summary'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-3 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-colors"
            title={t?.form?.resetBtn || 'Reset form'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
