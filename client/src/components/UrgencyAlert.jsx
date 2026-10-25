import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, ArrowRight } from 'lucide-react';

export default function UrgencyAlert({ payload, emergencyPayload, language = 'en', onClose }) {
  const activePayload = payload || emergencyPayload;
  const isTelugu = language === 'te';

  return (
    <div 
      role="alert"
      className="w-full bg-rose-700 text-white rounded-3xl shadow-xl p-5 sm:p-6 border-2 border-rose-800 space-y-4 animate-in fade-in duration-200"
    >
      {/* Top Banner Header */}
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-rose-800 rounded-2xl shrink-0">
          <ShieldAlert className="w-8 h-8 text-white" aria-hidden="true" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
              {activePayload?.title || (isTelugu ? 'అత్యవసరం — వెంటనే 112 లేదా 108 కి కాల్ చేయండి' : 'Emergency — Call 112 (India) or 108 (Ambulance)')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
            {activePayload?.message || (isTelugu ? 'మీరే స్వయంగా వాహనం నడపవద్దు. వెంటనే సమీపంలోని అత్యవసర విభాగానికి (Emergency Room) వెళ్ళండి.' : 'Do not drive yourself. Proceed to the nearest emergency medical facility immediately.')}
          </p>
        </div>
      </div>

      {/* Quick Action Phone Buttons */}
      <div className="flex gap-2.5 flex-wrap pt-1">
        <a
          href="tel:112"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-rose-800 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-rose-50 transition-colors"
        >
          <PhoneCall className="w-4 h-4" aria-hidden="true" />
          <span>{isTelugu ? 'జాతీయ అత్యవసరం: 112' : 'National Emergency: 112'}</span>
        </a>
        <a
          href="tel:108"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-900 text-white font-bold text-xs sm:text-sm rounded-xl border border-rose-400 shadow-md hover:bg-rose-950 transition-colors"
        >
          <PhoneCall className="w-4 h-4" aria-hidden="true" />
          <span>{isTelugu ? 'ఉచిత అంబులెన్స్: 108' : 'Free Ambulance: 108'}</span>
        </a>
        <a
          href="tel:14416"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-950 text-white font-bold text-xs sm:text-sm rounded-xl border border-rose-500 shadow-md hover:bg-black transition-colors"
        >
          <PhoneCall className="w-4 h-4" aria-hidden="true" />
          <span>{isTelugu ? 'టెలీ-మానస్ (మానసిక సంక్షోభం): 14416' : 'Mental Health Crisis: 14416'}</span>
        </a>
      </div>

      {/* Action Steps */}
      {activePayload?.actionSteps && activePayload.actionSteps.length > 0 && (
        <div className="bg-rose-800/80 rounded-2xl p-4 space-y-2 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-rose-100">
            {isTelugu ? 'తక్షణ చర్యలు:' : 'Immediate action steps:'}
          </h3>
          <ul className="space-y-1.5 text-rose-50">
            {activePayload.actionSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
