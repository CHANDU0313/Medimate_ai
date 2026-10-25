import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, MessageSquare, Hospital, FileText, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';
  const h = t.home;

  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 sm:pt-6">
        
        {/* Left Hero Content */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
            {h.heroHeading1}
            <span className="text-teal-700">{h.heroHeading2}</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            {h.heroSubheading}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/symptom-checker"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 transition-all shadow-md shadow-teal-700/15 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              {h.ctaCheckSymptoms}
            </Link>

            <Link
              to="/assistant"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-slate-800 bg-white border border-slate-300 hover:border-teal-600 hover:text-teal-700 hover:bg-teal-50/30 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {h.ctaAskAI}
            </Link>
          </div>
        </div>

        {/* Right Hero Example Conversation Card (Matches Screenshot 3) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-card relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 tracking-wide">
                {h.exampleTitle}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
                {h.demoDataBadge}
              </span>
            </div>

            {/* Simulated Chat Bubbles */}
            <div className="space-y-4 pt-4 text-sm">
              <div className="flex justify-end">
                <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl rounded-br-xs max-w-[85%] font-medium">
                  {h.exampleUserMsg}
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 px-4 py-3 rounded-2xl rounded-bl-xs max-w-[90%] space-y-2">
                  <p className="leading-relaxed">
                    {h.exampleAssistantMsg}
                  </p>
                  <div className="pt-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                      {h.notADiagnosis}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Click to open in Ask AI */}
            <div className="pt-3 border-t border-slate-100 mt-3 flex justify-end">
              <Link
                to="/assistant"
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 group/link"
              >
                <span>{isTelugu ? 'ఈ సంభాషణను చాట్‌లో తెరవండి' : 'Open in Ask AI'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* 4 Feature Action Cards Grid */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          {isTelugu ? 'ముఖ్య సేవలు' : 'Core Features'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Check Symptoms */}
          <Link
            to="/symptom-checker"
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                {h.cards.symptomsTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {h.cards.symptomsDesc}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform">
              <span>{h.cards.symptomsCta}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Card 2: Ask AI */}
          <Link
            to="/assistant"
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                {h.cards.aiTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {h.cards.aiDesc}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform">
              <span>{h.cards.aiCta}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Card 3: Find Nearby Care */}
          <Link
            to="/hospitals"
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
                <Hospital className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                {h.cards.careTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {h.cards.careDesc}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform">
              <span>{h.cards.careCta}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Card 4: Explain a Report */}
          <Link
            to="/reports"
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                {h.cards.reportsTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {h.cards.reportsDesc}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform">
              <span>{h.cards.reportsCta}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

        </div>
      </section>

      {/* How it works Section (Matches Mockup) */}
      <section className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/70">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-6">
          {h.howItWorks.heading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold">
              {h.howItWorks.step1Tag}
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              {h.howItWorks.step1Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {h.howItWorks.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold">
              {h.howItWorks.step2Tag}
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              {h.howItWorks.step2Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {h.howItWorks.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold">
              {h.howItWorks.step3Tag}
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              {h.howItWorks.step3Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {h.howItWorks.step3Desc}
            </p>
          </div>

        </div>
      </section>

      {/* Trust & Safety Callout Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-teal-700">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-base">
              {h.trust.privacyTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {h.trust.privacyDesc}
          </p>
          <div className="pt-2">
            <Link to="/privacy" className="text-xs font-bold text-teal-700 hover:underline">
              {h.trust.privacyLink}
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-base">
              {h.trust.noteTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {h.trust.noteDesc}
          </p>
          <div className="pt-2">
            <Link to="/safety" className="text-xs font-bold text-teal-700 hover:underline">
              {h.trust.safetyLink}
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
