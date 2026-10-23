import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export default function DisclaimerBanner({ text }) {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 py-3 px-4 border-t border-slate-800 text-xs text-center transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <ShieldAlert className="w-4 h-4 text-brand-400 shrink-0" />
        <span className="font-medium text-slate-200">Medical Disclaimer:</span>
        <span>
          {text || "MediMate AI provides general health information only. It is not a doctor and cannot diagnose or treat."}
        </span>
        <span className="text-slate-400 font-normal">
          In an emergency, immediately call <strong className="text-white underline">112</strong> or <strong className="text-white underline">108</strong>.
        </span>
      </div>
    </footer>
  );
}
