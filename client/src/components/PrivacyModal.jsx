import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose, onAccept, onClearData, t }) {
  const [agreed, setAgreed] = useState(true);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 p-6 text-center space-y-5">
        
        {/* Blue Shield Icon matching Mobile Screen 6 */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center border border-blue-100">
          <ShieldCheck className="w-9 h-9" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            Your Privacy Matters
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed px-2">
            MediMate AI does not store any personal health data on our servers. Conversations are saved in your browser session only.
          </p>
        </div>

        {/* Checkbox: I agree to continue */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <input
            id="privacy-agree"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 accent-brand-600 cursor-pointer"
          />
          <label htmlFor="privacy-agree" className="text-xs font-semibold text-slate-700 cursor-pointer">
            I agree to continue
          </label>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            if (agreed) {
              onAccept();
              onClose();
            }
          }}
          disabled={!agreed}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
        >
          Continue
        </button>

        {/* Learn more link */}
        <button
          onClick={onClose}
          className="text-xs text-brand-600 hover:underline font-medium block mx-auto"
        >
          Learn more about privacy
        </button>
      </div>
    </div>
  );
}
