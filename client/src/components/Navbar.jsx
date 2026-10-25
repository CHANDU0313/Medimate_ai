import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Plus, Menu, X, Shield, Lock, Stethoscope, MessageSquare, Hospital, FileText, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const isTelugu = language === 'te';
  const nav = t.nav;

  const navLinks = [
    {
      to: '/symptom-checker',
      label: nav.checkSymptoms,
      icon: Stethoscope
    },
    {
      to: '/assistant',
      label: nav.askAI,
      icon: MessageSquare
    },
    {
      to: '/hospitals',
      label: nav.findCare,
      icon: Hospital
    },
    {
      to: '/reports',
      label: nav.reports,
      icon: FileText
    }
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-[37px] sm:top-[41px] z-40 bg-white border-b border-slate-200/80 shadow-2xs backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg group"
            aria-label="MediMate AI Home"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-800 transition-colors">
              <Plus className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-900 transition-colors">
                MediMate AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 text-sm font-semibold rounded-md transition-all ${
                      isActive
                        ? 'text-teal-700 font-bold'
                        : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-600 rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right Controls: Language Switcher & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Pill (EN / తెలుగు) */}
            <div
              className="inline-flex items-center rounded-xl bg-slate-900 p-0.5 text-xs font-semibold shadow-2xs"
              role="group"
              aria-label={isTelugu ? 'భాష ఎంపిక' : 'Language selector'}
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-teal-400 ${
                  language === 'en'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-pressed={language === 'en'}
                aria-label="Switch language to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('te')}
                className={`px-3 py-1.5 rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-teal-400 ${
                  language === 'te'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-pressed={language === 'te'}
                aria-label="Switch language to Telugu"
              >
                తెలుగు
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150"
        >
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-teal-700' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-1">
            <Link
              to="/safety"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Shield className="w-4 h-4 text-slate-500" />
              <span>{nav.safety}</span>
            </Link>
            <Link
              to="/privacy"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span>{nav.privacy}</span>
            </Link>
            <div className="pt-2">
              <a
                href="tel:112"
                className="w-full flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{nav.emergencyCall}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
