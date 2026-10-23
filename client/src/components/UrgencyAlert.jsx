import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';

export default function UrgencyAlert({ urgency, emergencyPayload, onClose, language = 'en' }) {
  if (!urgency || urgency !== 'emergency') return null;

  return (
    <div 
      role="alert"
      className="w-full bg-red-600 text-white rounded-2xl shadow-xl p-5 mb-5 border-4 border-red-700 animate-pulse duration-1000 space-y-4"
    >
      {/* Top Banner Header matching Mobile Screen 4 */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-700 rounded-xl shrink-0">
          <AlertTriangle className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 space-y-1">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
            Emergency — Call 112 (India) Or 108 (Ambulance)
          </h2>
          <p className="text-xs sm:text-sm text-red-100 font-medium leading-relaxed">
            Do not drive yourself. Get to the nearest emergency room immediately.
          </p>
        </div>
      </div>

      {/* Quick Action Phone Buttons */}
      <div className="flex gap-2 flex-wrap pt-1">
        <a
          href="tel:108"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-red-700 font-bold text-xs rounded-xl shadow-md hover:bg-red-50"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          Call Ambulance: 108
        </a>
        <a
          href="tel:112"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-800 text-white font-bold text-xs rounded-xl border border-red-400 shadow-md hover:bg-red-900"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          National Emergency: 112
        </a>
        <a
          href="tel:14416"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-900 text-white font-bold text-xs rounded-xl border border-red-500 shadow-md hover:bg-black/40"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          Mental Health: 14416
        </a>
      </div>

      {/* Seek emergency care for list matching Mobile Screen 4 */}
      <div className="bg-red-700/90 rounded-xl p-3.5 space-y-2 text-xs">
        <h3 className="font-bold uppercase tracking-wider text-red-100">
          Seek emergency care for:
        </h3>
        <ul className="space-y-1 text-red-50">
          <li>• Chest pain or pressure</li>
          <li>• Trouble breathing</li>
          <li>• Severe bleeding</li>
          <li>• Loss of consciousness</li>
          <li>• Stroke signs (face droop, arm weakness, slurred speech)</li>
        </ul>
      </div>
    </div>
  );
}
