import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShieldAlert, Lock, Trash2, Heart, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { clearAllSessionData } from '../utils/storage';

export default function Footer({ onClearDataFeedback }) {
  const { language } = useLanguage();
  const isTelugu = language === 'te';

  const handleClear = () => {
    const confirmMessage = isTelugu
      ? 'మీ బ్రౌజర్‌లో నిల్వ చేయబడిన అన్ని చాట్ మరియు రిపోర్ట్ వివరాలను తొలగించాలనుకుంటున్నారా?'
      : 'Are you sure you want to clear your current session data? All temporary messages will be erased from your browser.';
    
    if (window.confirm(confirmMessage)) {
      clearAllSessionData();
      if (onClearDataFeedback) {
        onClearDataFeedback(
          isTelugu
            ? 'సెషన్ డేటా విజయవంతంగా తొలగించబడింది.'
            : 'Session data cleared successfully.'
        );
      }
      window.location.reload();
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-700 flex items-center justify-center text-white">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-slate-900 text-lg">MediMate AI</span>
            </div>
            <p className="text-slate-600 max-w-md text-xs sm:text-sm leading-relaxed">
              {isTelugu
                ? 'ఆరోగ్య సమాచారం సరళమైన తెలుగు మరియు ఇంగ్లీషులో. ఇది విద్యా ప్రయోజనాల కోసం మాత్రమే, వైద్య నిర్ధారణ లేదా చికిత్స కాదు.'
                : 'Your health questions, explained simply in English and Telugu. Designed for educational health navigation in Andhra Pradesh, India.'}
            </p>
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-amber-900 text-xs leading-relaxed">
              <span className="font-semibold">{isTelugu ? 'ముఖ్య గమనిక: ' : 'Medical Notice: '}</span>
              {isTelugu
                ? 'మెడిమేట్ ఎఐ వైద్యునికి ప్రత్యామ్నాయం కాదు. ప్రమాదకర లక్షణాలు కనిపిస్తే వెంటనే 112 కి కాల్ చేయండి లేదా ఆసుపత్రికి వెళ్ళండి.'
                : 'MediMate AI is an educational assistant, not a doctor. It cannot confirm diagnoses or prescribe medications. In an emergency, dial 112 immediately.'}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
              {isTelugu ? 'ముఖ్య విభాగాలు' : 'Navigation'}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/symptom-checker" className="hover:text-teal-700 transition-colors">
                  {isTelugu ? 'లక్షణాలు పరిశీలించండి' : 'Check Symptoms'}
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-teal-700 transition-colors">
                  {isTelugu ? 'ఆరోగ్య సహాయకుడు (చాట్)' : 'AI Health Assistant'}
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="hover:text-teal-700 transition-colors">
                  {isTelugu ? 'ఆంధ్రప్రదేశ్ వైద్యశాలలు' : 'AP Healthcare Search'}
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-teal-700 transition-colors">
                  {isTelugu ? 'ల్యాబ్ రిపోర్టు వివరణ' : 'Explain a Lab Report'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety, Privacy & Data Actions */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
              {isTelugu ? 'భద్రత & గోప్యత' : 'Safety & Privacy'}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/safety" className="hover:text-teal-700 transition-colors flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-teal-700" />
                  <span>{isTelugu ? 'భద్రతా విధానాలు (112)' : 'Safety Protocols (112)'}</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-teal-700 transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-teal-700" />
                  <span>{isTelugu ? 'గోప్యతా నిబంధనలు (DPDP)' : 'Privacy Policy (DPDP Act)'}</span>
                </Link>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isTelugu ? 'నా తాత్కాలిక డేటా తొలగించండి' : 'Clear my session data'}</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Emergency Contact */}
        <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} MediMate AI. Built for health literacy in Andhra Pradesh.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-rose-700">
              {isTelugu ? 'అత్యవసరం: 112 | అంబులెన్స్: 108' : 'India Emergency: 112 | Ambulance: 108'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
