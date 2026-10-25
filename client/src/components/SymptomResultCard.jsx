import React from 'react';
import { AlertTriangle, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SymptomResultCard({ result, t, language = 'en' }) {
  const isTelugu = language === 'te';
  const r = t?.results || {};

  const urgency = result?.urgency || 'routine';

  const defaultExplanations = [
    {
      title: isTelugu ? 'టెన్షన్ తలనొప్పి (Tension headache)' : 'Tension headache',
      description: isTelugu ? 'ఒత్తిడి, తగినంత నిద్ర లేకపోవడం లేదా కంప్యూటర్ స్క్రీన్ సమయం ఎక్కువ కావడం వలన రావచ్చు.' : 'Often linked to physical or mental stress, screen fatigue, or muscle tension.'
    },
    {
      title: isTelugu ? 'డీహైడ్రేషన్ (నీరు తక్కువ తాగడం)' : 'Mild dehydration',
      description: isTelugu ? 'రోజంతా సరిపడా నీరు తాగకపోవడం వలన తలనొప్పి రావచ్చు.' : 'Insufficient fluids intake during warm weather or long working hours.'
    },
    {
      title: isTelugu ? 'కంటి అలసట (Eye strain)' : 'Digital eye strain',
      description: isTelugu ? 'నిరంతర స్క్రీన్ వీక్షణ లేదా కాంతి సరిగా లేకపోవడం.' : 'Prolonged focus on bright monitors or mobile screens.'
    }
  ];

  const defaultSelfCare = [
    isTelugu ? 'నిశ్శబ్దమైన, కాంతి తక్కువగా ఉన్న ప్రదేశంలో విశ్రాంతి తీసుకోండి.' : 'Rest in a quiet, dimly lit room with good ventilation.',
    isTelugu ? 'తగినంత గోరువెచ్చని లేదా సాధారణ నీరు నెమ్మదిగా తాగండి.' : 'Slowly drink a tall glass of room-temperature water.',
    isTelugu ? 'మెడ మరియు భుజాలకు తేలికపాటి స్ట్రెచింగ్ చేయండి.' : 'Perform gentle neck, shoulder, and upper back stretches.'
  ];

  const defaultWarningSigns = [
    isTelugu ? 'తలనొప్పి అకస్మాత్తుగా తీవ్రమైన పిడుగుపాటులా రావడం.' : 'Headache that starts suddenly like a severe thunderclap.',
    isTelugu ? 'జ్వరం, మెడ బిగుతుగా మారడం లేదా గందరగోళం కలగడం.' : 'Fever, stiff neck, confusion, or altered consciousness.',
    isTelugu ? 'కంటి చూపులో మార్పులు, మాట తడబడటం లేదా శరీర బలహీనత.' : 'Vision changes, weakness, numbness, or difficulty speaking.'
  ];

  const defaultWhenToSee = [
    isTelugu ? 'తలనొప్పి 3 రోజులకు మించి కొనసాగినా లేదా నొప్పి మరింత తీవ్రమైనా డాక్టర్‌ను సంప్రదించండి.' : 'If headaches persist for more than 3 days, worsen progressively, or do not respond to rest.'
  ];

  const explanations = result?.possibleExplanations || defaultExplanations;
  const selfCare = result?.selfCareInfo || defaultSelfCare;
  const warningSigns = result?.warningSigns || defaultWarningSigns;
  const whenToSee = result?.whenToSeeDoctor || defaultWhenToSee;

  // Banner styling based on urgency level
  let bannerClass = 'bg-emerald-600 text-white';
  let bannerTitle = isTelugu ? 'స్వీయ సంరక్షణ & పర్యవేక్షణ (Self-Care & Monitor)' : 'Self-Care & Monitor at Home';
  let bannerDesc = isTelugu ? 'లక్షణాలు స్వల్పంగా ఉన్నాయి. ఇంట్లోనే జాగ్రత్తలు తీసుకుంటూ గమనించండి.' : 'Symptoms appear mild and self-limiting. Try safe comfort measures and monitor.';

  if (urgency === 'urgent') {
    bannerClass = 'bg-amber-600 text-white';
    bannerTitle = isTelugu ? 'త్వరలో వైద్యుడిని సంప్రదించండి (See Doctor Soon)' : 'Seek Medical Attention Soon';
    bannerDesc = isTelugu ? 'లక్షణాలు తగ్గకపోయినా లేదా ఎక్కువవుతున్నా త్వరగా డాక్టర్‌ను సంప్రదించండి.' : 'If symptoms worsen, persist, or you feel unwell, see a doctor within 24-48 hours.';
  } else if (urgency === 'emergency') {
    bannerClass = 'bg-rose-700 text-white';
    bannerTitle = isTelugu ? 'అత్యవసరం: తక్షణ వైద్య సంరక్షణ అవసరం (112)' : 'EMERGENCY: Seek Immediate Medical Care (Call 112)';
    bannerDesc = isTelugu ? 'లక్షణాలు ప్రమాదకర సంకేతాలుగా ఉన్నాయి. ఆలస్యం చేయకుండా ఆసుపత్రికి వెళ్ళండి.' : 'Potential high-risk symptoms reported. Do not wait for home recovery.';
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-5 transition-all">
      
      {/* Triage Urgency Banner */}
      <div className={`${bannerClass} p-4 rounded-2xl shadow-xs space-y-1`}>
        <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
          {urgency === 'routine' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <span>{result?.urgencyLabel || bannerTitle}</span>
        </div>
        <p className="text-xs opacity-95 leading-relaxed">
          {bannerDesc}
        </p>
      </div>

      {/* 1. Possible Explanations */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
          <span>{r.explanationsHeader || 'Possible, Common Explanations'}</span>
          <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-semibold border border-teal-100">
            {isTelugu ? 'నిర్ధారణ కాదు' : 'Not a diagnosis'}
          </span>
        </h3>
        <ul className="space-y-2 text-xs text-slate-700">
          {explanations.map((item, idx) => (
            <li key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
              <strong className="text-slate-900 font-bold block">
                {typeof item === 'string' ? item : item.title}
              </strong>
              {item.description && (
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Safe Self-Care Comfort Measures */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          {r.selfCareHeader || 'Safe Self-Care Information'}
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
          {selfCare.map((step, idx) => (
            <li key={idx} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Warning Signs */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>{r.warningSignsHeader || 'Warning Signs to Watch For'}</span>
        </h3>
        <ul className="space-y-1.5 text-xs text-rose-900 bg-rose-50/60 p-3.5 rounded-xl border border-rose-100 list-disc list-inside">
          {warningSigns.map((sign, idx) => (
            <li key={idx} className="leading-relaxed font-medium">
              {sign}
            </li>
          ))}
        </ul>
      </div>

      {/* 4. When to See a Doctor */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          {r.whenToSeeDoctorHeader || 'When to See a Doctor'}
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-700">
          {whenToSee.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <Clock className="w-3.5 h-3.5 text-teal-700 mt-0.5 shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer footnote */}
      <p className="text-[11px] text-slate-500 italic pt-2 border-t border-slate-100 text-center">
        {r.disclaimerNotice || 'Framed as common, possible explanations — NOT a medical diagnosis.'}
      </p>

    </div>
  );
}
