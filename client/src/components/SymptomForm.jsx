import React, { useState } from 'react';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';

export default function SymptomForm({ onSubmit, isLoading, t, language = 'en' }) {
  const isTelugu = language === 'te';
  const f = t?.form || {};

  const [formData, setFormData] = useState({
    mainSymptom: isTelugu ? 'తలనొప్పి' : 'Headache',
    duration: isTelugu ? 'ఈ రోజు ఉదయం నుండి' : 'Since this morning',
    severity: 6,
    ageRange: '18-30',
    context: isTelugu ? 'స్క్రీన్ పని ఎక్కువ, ఇతర సమస్యలు లేవు.' : 'Worked on laptop for 4 hours.',
    otherDetails: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.mainSymptom.trim() || formData.mainSymptom.trim().length < 2) {
      newErrors.mainSymptom = isTelugu
        ? 'దయచేసి మీ ప్రధాన లక్షణాన్ని నమోదు చేయండి (కనీసం 2 అక్షరాలు).'
        : 'Please enter your main symptom (at least 2 characters).';
    } else if (formData.mainSymptom.length > 500) {
      newErrors.mainSymptom = isTelugu
        ? 'గరిష్టంగా 500 అక్షరాలు మాత్రమే అనుమతించబడతాయి.'
        : 'Maximum 500 characters allowed.';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = isTelugu
        ? 'ఈ లక్షణం ఎంత కాలం నుండి ఉందో నమోదు చేయండి.'
        : 'Please describe the duration.';
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

  const getSeverityEmoji = (sev) => {
    if (sev <= 3) return { emoji: '🙂', text: isTelugu ? 'స్వల్పం (Mild)' : 'Mild' };
    if (sev <= 6) return { emoji: '😐', text: isTelugu ? 'మోస్తరు (Moderate)' : 'Moderate' };
    if (sev <= 8) return { emoji: '😣', text: isTelugu ? 'తీవ్రం (Severe)' : 'Severe' };
    return { emoji: '😫', text: isTelugu ? 'చాలా తీవ్రం (Very Severe)' : 'Very Severe' };
  };

  const severityInfo = getSeverityEmoji(formData.severity);

  return (
    <div className="space-y-5">
      {/* Form Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {f.title || 'Symptom Information'}
          </h2>
          <p className="text-xs text-slate-500">
            {isTelugu ? '* తప్పనిసరిగా పూరించవలసిన వివరాలు' : '* Required fields'}
          </p>
        </div>
      </div>

      {/* Quick Demo Presets */}
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>{isTelugu ? 'పరీక్షించడానికి నమూనాలు:' : 'Quick Presets:'}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() =>
              handleQuickPreset(
                isTelugu ? 'తలనొప్పి' : 'Headache',
                isTelugu ? 'ఉదయం నుండి' : 'Since this morning',
                5,
                isTelugu ? 'స్క్రీన్ సమయం ఎక్కువ' : 'Working on computer for 4 hours'
              )
            }
            className="px-2.5 py-1 bg-white text-teal-800 font-semibold rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 shadow-2xs transition-colors"
          >
            {isTelugu ? 'ల్యాప్‌టాప్ తలనొప్పి' : 'Headache (Laptop)'}
          </button>
          <button
            type="button"
            onClick={() =>
              handleQuickPreset(
                isTelugu ? 'గొంతు నొప్పి మరియు జలుబు' : 'Mild sore throat and sneezing',
                isTelugu ? '2 రోజులు' : '2 days',
                3,
                isTelugu ? 'వాతావరణ మార్పు' : 'Seasonal weather shift'
              )
            }
            className="px-2.5 py-1 bg-white text-slate-700 font-semibold rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            {isTelugu ? 'జలుబు / గొంతు నొప్పి' : 'Cold / Allergy'}
          </button>
          <button
            type="button"
            onClick={() =>
              handleQuickPreset(
                isTelugu ? 'తీవ్రమైన ఛాతీ నొప్పి మరియు ఊపిరి ఆడట్లేదు' : "Severe crushing chest pain and can't breathe",
                isTelugu ? '10 నిమిషాలు' : '10 minutes',
                10,
                isTelugu ? 'రక్తపోటు ఉంది' : 'History of hypertension'
              )
            }
            className="px-2.5 py-1 bg-rose-50 text-rose-800 font-bold rounded-lg border border-rose-200 hover:bg-rose-100 shadow-2xs transition-colors"
          >
            {isTelugu ? 'అత్యవసర పరీక్ష (Emergency 112)' : 'Emergency Test (112)'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* Main symptom */}
        <div>
          <label htmlFor="mainSymptom" className="block font-bold text-slate-800 mb-1">
            {f.mainSymptomLabel || 'Main Symptom(s)'} *
          </label>
          <input
            id="mainSymptom"
            type="text"
            value={formData.mainSymptom}
            onChange={(e) => handleChange('mainSymptom', e.target.value)}
            placeholder={f.mainSymptomPlaceholder || 'e.g., Headache'}
            maxLength={500}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.mainSymptom ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300 bg-slate-50 focus:bg-white'
            } text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500`}
          />
          {errors.mainSymptom && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.mainSymptom}</span>
            </p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block font-bold text-slate-800 mb-1">
            {f.durationLabel || 'Duration'} *
          </label>
          <input
            id="duration"
            type="text"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder={f.durationPlaceholder || 'e.g., Since this morning'}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.duration ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300 bg-slate-50 focus:bg-white'
            } text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500`}
          />
          {errors.duration && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.duration}</span>
            </p>
          )}
        </div>

        {/* Severity Slider with Emoji indicator */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="severity" className="font-bold text-slate-800">
              {f.severityLabel || 'Severity Level (1-10)'} *
            </label>
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-teal-800 shadow-2xs">
              <span>{severityInfo.emoji}</span>
              <span>{formData.severity}/10</span>
              <span className="text-[10px] text-slate-500 font-normal">({severityInfo.text})</span>
            </div>
          </div>
          <input
            id="severity"
            type="range"
            min="1"
            max="10"
            value={formData.severity}
            onChange={(e) => handleChange('severity', Number(e.target.value))}
            className="w-full accent-teal-700 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 px-1 mt-0.5">
            <span>1 (Mild)</span>
            <span>5 (Moderate)</span>
            <span>10 (Severe)</span>
          </div>
        </div>

        {/* Age Range */}
        <div>
          <label htmlFor="ageRange" className="block font-bold text-slate-800 mb-1">
            {f.ageRangeLabel || 'Age Range'}
          </label>
          <select
            id="ageRange"
            value={formData.ageRange}
            onChange={(e) => handleChange('ageRange', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="0-2">{isTelugu ? 'శిశువు (0 - 2 సం.)' : '0-2 (Infant / Toddler)'}</option>
            <option value="3-12">{isTelugu ? 'పిల్లలు (3 - 12 సం.)' : '3-12 (Child)'}</option>
            <option value="13-17">{isTelugu ? 'కౌమార దశ (13 - 17 సం.)' : '13-17 (Adolescent)'}</option>
            <option value="18-30">{isTelugu ? 'యువకులు (18 - 30 సం.)' : '18-30 (Young Adult)'}</option>
            <option value="31-50">{isTelugu ? 'వయస్కులు (31 - 50 సం.)' : '31-50 (Adult)'}</option>
            <option value="51-65">{isTelugu ? 'మధ్య వయస్కులు (51 - 65 సం.)' : '51-65 (Middle Adult)'}</option>
            <option value="65+">{isTelugu ? 'వృద్ధులు (65+ సం.)' : '65+ (Senior)'}</option>
          </select>
        </div>

        {/* Relevant context */}
        <div>
          <label htmlFor="context" className="block font-bold text-slate-800 mb-1">
            {f.contextLabel || 'Relevant context (optional)'}
          </label>
          <input
            id="context"
            type="text"
            value={formData.context}
            onChange={(e) => handleChange('context', e.target.value)}
            placeholder={f.contextPlaceholder || 'e.g., Worked late, stared at screens...'}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{f.submittingBtn || 'Analyzing...'}</span>
            </>
          ) : (
            <span>{f.submitBtn || 'Analyze Symptoms & Prepare Summary'}</span>
          )}
        </button>
      </form>
    </div>
  );
}
