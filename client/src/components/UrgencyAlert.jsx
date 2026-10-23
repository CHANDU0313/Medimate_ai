import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, PhoneCall, ShieldAlert, HeartHandshake } from 'lucide-react';

export default function UrgencyAlert({ urgency, emergencyPayload, onClose, language = 'en' }) {
  if (!urgency) return null;

  const isEmergency = urgency === 'emergency';
  const isUrgent = urgency === 'urgent';
  const isRoutine = urgency === 'routine';

  // 1. EMERGENCY LEVEL ALERT (Prominent Red Full-Width)
  if (isEmergency) {
    const isSuicide = emergencyPayload?.category === 'suicide_crisis';
    const title = emergencyPayload?.title || '🚨 CRITICAL MEDICAL EMERGENCY — SEEK IMMEDIATE CARE';
    const message = emergencyPayload?.message || 'The symptoms described may indicate a life-threatening situation. Seek immediate emergency evaluation.';
    const actionSteps = emergencyPayload?.actionSteps || [
      'Call emergency services immediately: Ambulance 108 or General Emergency 112',
      'Go to the nearest Hospital Emergency Room right away.',
      'DO NOT DRIVE YOURSELF — have an ambulance or trusted person drive you.',
      'Sit or lie down in a safe, resting position.'
    ];

    return (
      <div 
        role="alert" 
        aria-live="assertive"
        className="w-full bg-red-600 text-white rounded-2xl shadow-xl p-5 mb-6 border-4 border-red-700 animate-pulse duration-1000"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-700 rounded-xl shrink-0">
            {isSuicide ? (
              <HeartHandshake className="w-8 h-8 text-white" />
            ) : (
              <AlertOctagon className="w-8 h-8 text-white" />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
                {title}
              </h2>
              <span className="px-3 py-1 bg-white text-red-700 text-xs font-black uppercase tracking-wider rounded-full shadow-sm">
                Immediate Action Required
              </span>
            </div>

            <p className="text-red-100 text-sm sm:text-base font-medium leading-relaxed">
              {message}
            </p>

            {/* Immediate Quick Dial Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-1">
              {isSuicide ? (
                <>
                  <a
                    href="tel:14416"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-red-700 hover:bg-red-50 rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call Tele-MANAS: 14416 (24/7 Free)
                  </a>
                  <a
                    href="tel:18005990019"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-800 text-white hover:bg-red-900 rounded-xl font-bold text-sm border border-red-500 shadow-md transition-transform active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call KIRAN: 1800-599-0019
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="tel:108"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-red-700 hover:bg-red-50 rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call Ambulance: 108
                  </a>
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-800 text-white hover:bg-red-900 rounded-xl font-bold text-sm border border-red-500 shadow-md transition-transform active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    National Emergency: 112
                  </a>
                </>
              )}
            </div>

            {/* Numbered Action Protocol */}
            <div className="bg-red-700/80 rounded-xl p-3.5 space-y-2 mt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-200">
                Mandatory Emergency Action Protocol:
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-red-50 font-normal">
                {actionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-red-200 shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-red-200 italic pt-1">
              MediMate AI rule-based emergency safety system automatically detected danger signs. Do not delay professional emergency care.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. URGENT LEVEL ALERT (Amber / Orange: See a Doctor Soon)
  if (isUrgent) {
    return (
      <div 
        role="alert" 
        className="w-full bg-amber-50 text-amber-900 rounded-2xl shadow-sm p-4 mb-5 border border-amber-300 flex items-start gap-3.5"
      >
        <div className="p-2 bg-amber-100 rounded-xl shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-base font-bold text-amber-900 flex items-center gap-1.5">
              Urgency Level: See a Doctor Soon
            </h3>
            <span className="px-2.5 py-0.5 bg-amber-200 text-amber-900 text-xs font-semibold rounded-full">
              Within 24–48 Hours
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            Your reported symptoms warrant prompt evaluation by a doctor or qualified clinic. While not immediately life-threatening, do not ignore persistent or worsening discomfort.
          </p>
        </div>
      </div>
    );
  }

  // 3. ROUTINE LEVEL GUIDANCE (Emerald / Green: Self-Care & Monitor)
  if (isRoutine) {
    return (
      <div 
        role="status" 
        className="w-full bg-emerald-50 text-emerald-900 rounded-2xl shadow-sm p-3.5 mb-5 border border-emerald-200 flex items-start gap-3"
      >
        <div className="p-1.5 bg-emerald-100 rounded-lg shrink-0 mt-0.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex-1 text-xs sm:text-sm space-y-0.5">
          <span className="font-semibold text-emerald-900">Urgency Level: Self-Care & Monitor</span>
          <p className="text-emerald-800 leading-relaxed text-xs">
            These symptoms are commonly managed with rest, hydration, and monitoring. If symptoms persist beyond 2–3 days or worsen, consult a doctor.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
