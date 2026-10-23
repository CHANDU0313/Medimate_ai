import React, { useState } from 'react';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';

export default function SymptomForm({ onSubmit, isLoading, t, language = 'en' }) {
  const [formData, setFormData] = useState({
    mainSymptom: 'Headache',
    duration: 'Since this morning',
    severity: 6,
    ageRange: '18-30',
    context: 'No other symptoms, just a headache.',
    otherDetails: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.mainSymptom.trim()) {
      newErrors.mainSymptom = 'Please enter your main symptom.';
    } else if (formData.mainSymptom.length > 300) {
      newErrors.mainSymptom = 'Maximum 300 characters allowed.';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Please describe the duration.';
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

  const handleQuickPreset = (symptom, duration, severity, context) => {
    setFormData({
      mainSymptom: symptom,
      duration,
      severity,
      ageRange: '18-30',
      context,
      otherDetails: ''
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 transition-all">
      {/* Form Header matching Screen 3 */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Symptom Information
        </h2>
        <span className="text-[11px] text-slate-400 font-medium">
          * Required fields
        </span>
      </div>

      {/* Quick Demo Presets */}
      <div className="mb-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 flex-wrap text-xs">
        <span className="font-bold text-slate-500 uppercase text-[10px]">Presets:</span>
        <button
          type="button"
          onClick={() => handleQuickPreset('Headache', 'Since this morning', 6, 'No other symptoms, just a headache.')}
          className="px-2 py-0.5 bg-white text-brand-700 font-medium rounded border border-slate-200 hover:bg-brand-50"
        >
          Mockup Sample (Headache)
        </button>
        <button
          type="button"
          onClick={() => handleQuickPreset('Mild sore throat and sneezing', '2 days', 3, 'Seasonal change')}
          className="px-2 py-0.5 bg-white text-slate-700 font-medium rounded border border-slate-200 hover:bg-slate-50"
        >
          Cold / Allergy
        </button>
        <button
          type="button"
          onClick={() => handleQuickPreset("Severe crushing chest pain and can't breathe", '10 minutes', 10, 'History of high blood pressure')}
          className="px-2 py-0.5 bg-red-50 text-red-700 font-bold rounded border border-red-200 hover:bg-red-100"
        >
          Emergency Test
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* Main symptom(s) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="mainSymptom" className="font-semibold text-slate-800">
              Main symptom(s) *
            </label>
            <span className="text-[10px] text-slate-400">(max 300 chars)</span>
          </div>
          <input
            id="mainSymptom"
            type="text"
            value={formData.mainSymptom}
            onChange={(e) => handleChange('mainSymptom', e.target.value)}
            placeholder="e.g. Headache"
            maxLength={300}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.mainSymptom ? 'border-red-400 bg-red-50/40' : 'border-slate-200 bg-slate-50/50 focus:bg-white'
            } text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
          />
          {errors.mainSymptom && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.mainSymptom}
            </p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block font-semibold text-slate-800 mb-1">
            Duration *
          </label>
          <input
            id="duration"
            type="text"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder="e.g. Since this morning"
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.duration ? 'border-red-400 bg-red-50/40' : 'border-slate-200 bg-slate-50/50 focus:bg-white'
            } text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
          />
          {errors.duration && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.duration}
            </p>
          )}
        </div>

        {/* Severity Slider */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="severity" className="font-semibold text-slate-800">
              Severity (1-10) *
            </label>
            <span className="font-bold text-brand-600 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 text-xs">
              {formData.severity}
            </span>
          </div>
          <input
            id="severity"
            type="range"
            min="1"
            max="10"
            value={formData.severity}
            onChange={(e) => handleChange('severity', Number(e.target.value))}
            className="w-full accent-brand-600 cursor-pointer"
          />
        </div>

        {/* Age range */}
        <div>
          <label htmlFor="ageRange" className="block font-semibold text-slate-800 mb-1">
            Age range *
          </label>
          <select
            id="ageRange"
            value={formData.ageRange}
            onChange={(e) => handleChange('ageRange', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
          >
            <option value="0-2">0-2 (Infant / Toddler)</option>
            <option value="3-12">3-12 (Child)</option>
            <option value="13-17">13-17 (Adolescent)</option>
            <option value="18-30">18-30 (Young Adult)</option>
            <option value="31-50">31-50 (Adult)</option>
            <option value="51-65">51-65 (Middle Adult)</option>
            <option value="65+">65+ (Senior)</option>
          </select>
        </div>

        {/* Relevant context */}
        <div>
          <label htmlFor="context" className="block font-semibold text-slate-800 mb-1">
            Relevant context (optional)
          </label>
          <input
            id="context"
            type="text"
            value={formData.context}
            onChange={(e) => handleChange('context', e.target.value)}
            placeholder="e.g. No other symptoms, just a headache."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Other details */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="otherDetails" className="font-semibold text-slate-800">
              Other details (optional)
            </label>
            <span className="text-[10px] text-slate-400">
              {formData.otherDetails.length}/300
            </span>
          </div>
          <textarea
            id="otherDetails"
            rows="2"
            value={formData.otherDetails}
            onChange={(e) => handleChange('otherDetails', e.target.value)}
            placeholder="Any additional information..."
            maxLength={300}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
          />
        </div>

        {/* Big Blue Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Submit</span>
          )}
        </button>
      </form>
    </div>
  );
}
