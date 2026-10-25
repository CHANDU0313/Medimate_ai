import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import EmergencyBanner from './EmergencyBanner';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      <EmergencyBanner />
      <Navbar />

      {/* Main Routed Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none" id="main-content" tabIndex={-1}>
        <Outlet context={{ showToast }} />
      </main>

      <Footer onClearDataFeedback={showToast} />

      {/* Global Accessible Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
