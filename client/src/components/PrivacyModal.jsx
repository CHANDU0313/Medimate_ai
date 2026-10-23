import React from 'react';
import { ShieldCheck, Lock, Trash2, Heart, AlertCircle, X } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose, onAccept, onClearData, t }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-brand-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-lg font-bold">
                {t?.privacyModal?.title || 'Your Privacy & Health Consent'}
              </h2>
              <p className="text-xs text-brand-100">
                Transparent, Private & Secure Health Education
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-brand-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-slate-600">
          <p className="font-medium text-slate-800">
            {t?.privacyModal?.desc1 || 'Welcome to MediMate AI. Before exploring, please understand our privacy principles:'}
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Lock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 text-xs font-semibold uppercase tracking-wide">
                  Zero Server Storage
                </strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  {t?.privacyModal?.point1 || 'We do NOT store your personal health data on any server database. Your inputs are not permanently logged.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Trash2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 text-xs font-semibold uppercase tracking-wide">
                  Browser Session Only
                </strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  {t?.privacyModal?.point2 || 'Your conversation lives in your browser temporary sessionStorage only. You can click "Clear my data" anytime to erase it completely.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <Heart className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-900 text-xs font-semibold uppercase tracking-wide">
                  Educational Purpose Only
                </strong>
                <p className="text-xs text-amber-800 mt-0.5">
                  {t?.privacyModal?.point3 || 'MediMate AI is an educational assistant, not a doctor. It does not provide clinical diagnoses, treatments, or prescriptions.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-2xl border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-red-900 text-xs font-semibold uppercase tracking-wide">
                  Emergency Medical Notice
                </strong>
                <p className="text-xs text-red-800 mt-0.5">
                  {t?.privacyModal?.point4 || 'For emergencies (severe chest pain, stroke, trouble breathing, or crisis), call 112 / 108 immediately or go to the nearest hospital.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => {
              if (onClearData) onClearData();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Current Data
          </button>

          <button
            onClick={() => {
              if (onAccept) onAccept();
              onClose();
            }}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            {t?.privacyModal?.acceptBtn || 'I Understand & Agree'}
          </button>
        </div>
      </div>
    </div>
  );
}
