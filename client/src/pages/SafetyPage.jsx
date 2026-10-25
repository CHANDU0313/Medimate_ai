import React from 'react';
import { ShieldAlert, PhoneCall, AlertTriangle, CheckCircle, HeartPulse, Stethoscope } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SafetyPage() {
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';
  const s = t.safetyPage;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
          <ShieldAlert className="w-4 h-4" aria-hidden="true" />
          <span>{s.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {s.heading}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {s.subheading}
        </p>
      </div>

      {/* Emergency Hotlines Grid for India */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-rose-950 flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-rose-700" aria-hidden="true" />
          <span>{s.hotlinesHeading}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">{isTelugu ? 'జాతీయ అత్యవసరం' : 'National Emergency'}</span>
            <div className="text-2xl font-black text-rose-700">112</div>
            <p className="text-[11px] text-slate-600">{s.national112}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">{isTelugu ? 'వైద్య అంబులెన్స్' : 'Medical Ambulance'}</span>
            <div className="text-2xl font-black text-rose-700">108</div>
            <p className="text-[11px] text-slate-600">{s.ambulance108}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">{isTelugu ? 'మానసిక ఆరోగ్య హెల్ప్‌లైన్' : 'Tele-MANAS'}</span>
            <div className="text-2xl font-black text-rose-700">14416</div>
            <p className="text-[11px] text-slate-600">{s.telemanas14416}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">{isTelugu ? 'విష సమాచార కేంద్రం' : 'Poison Information'}</span>
            <div className="text-lg font-black text-rose-700">1800-116-117</div>
            <p className="text-[11px] text-slate-600">{s.poisonLine}</p>
          </div>
        </div>
      </div>

      {/* Red-Flag Symptoms & Triage Rules */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {s.redFlagsHeading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <HeartPulse className="w-5 h-5" aria-hidden="true" />
              <span>{isTelugu ? 'గుండెపోటు లక్షణాలు (Cardiac)' : 'Heart Attack & Chest Distress'}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isTelugu
                ? 'ఛాతీలో తీవ్ర ఒత్తిడి లేదా నొప్పి, ఎడమ చేతికి లేదా దవడకు పాకే నొప్పి, చల్లని చెమటలు మరియు వికారం.'
                : 'Crushing chest pressure, tightness radiating to arm or jaw, unexplained sweating, and severe shortness of breath.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
              <span>{isTelugu ? 'పక్షవాతం లక్షణాలు (FAST)' : 'Stroke FAST Signs'}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isTelugu
                ? 'ముఖం ఒకవైపు వంకర తిరగడం (Face), చేతులు బలహీనపడటం (Arms), మాట తడబడటం (Speech), సమయం ఆదా చేయడం (Time).'
                : 'Face drooping on one side, Arm weakness, Speech difficulty or slurring, and Time to dial 112 immediately.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <Stethoscope className="w-5 h-5" aria-hidden="true" />
              <span>{isTelugu ? 'తీవ్రమైన శ్వాస ఇబ్బంది' : 'Respiratory Distress'}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isTelugu
                ? 'గాలి పీల్చలేకపోవడం, పెదవులు నీలంగా మారడం, లేదా మాట్లాడటానికి శ్వాస సరిపోకపోవడం.'
                : 'Inability to speak full sentences, blue lips or fingertips, gasping for air, or sudden airway swelling.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <CheckCircle className="w-5 h-5" aria-hidden="true" />
              <span>{isTelugu ? 'తీవ్ర రక్తస్రావం & మూర్ఛ' : 'Heavy Bleeding & Loss of Consciousness'}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isTelugu
                ? 'ఒత్తిడి పెట్టినా ఆగని రక్తస్రావం, స్పృహ కోల్పోవడం, లేదా ఫిట్స్/మూర్ఛ రావడం.'
                : 'Uncontrolled hemorrhage that does not stop with direct pressure, fainting, seizure, or sudden altered mental state.'}
            </p>
          </div>
        </div>
      </div>

      {/* Safety Engine Architecture */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-3">
        <h3 className="font-bold text-slate-900 text-base">
          {s.engineHeading}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {s.engineDesc}
        </p>
      </div>

    </div>
  );
}
