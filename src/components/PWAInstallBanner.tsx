import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { MdDownload, MdClose } from 'react-icons/md';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('onair_pwa_dismissed') === 'true';
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('onair_pwa_dismissed', 'true');
  };

  if (isInstalled || dismissed) return null;

  return (
    <>
      <div className="fixed top-12 left-3 right-3 max-w-[400px] mx-auto z-50 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="bg-white/95 backdrop-blur-md border border-[#F0E6E9] shadow-[0_10px_30px_rgba(65,0,21,0.2)] rounded-2xl p-3.5 flex items-start gap-3">
          {/* App Icon */}
          <img
            src="/app-icon.png"
            alt="ON AIR App Icon"
            className="w-11 h-11 rounded-xl object-cover shadow-md shrink-0 border border-black/10"
          />

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-gray-900 leading-tight">
              Install ON AIR Wedding App
            </h4>
            <p className="text-[11px] text-[#77727A] mt-0.5 leading-snug">
              Add this wedding app to your home screen for quick access.
            </p>

            <div className="flex items-center gap-2 mt-2.5">
              <button
                onClick={() => {
                  if (isIOS) {
                    setShowIOSModal(true);
                  } else {
                    install();
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#EF1735] hover:bg-[#d60a28] active:scale-95 text-white text-[11px] font-bold shadow-sm transition flex items-center gap-1.5"
              >
                <MdDownload className="text-sm" />
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 rounded-xl text-gray-500 hover:text-gray-800 text-[11px] font-semibold transition"
              >
                Maybe Later
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 p-1 -mr-1 -mt-1"
          >
            <MdClose className="text-base" />
          </button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900">Install ON AIR on iPhone / iPad</h3>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              1. Tap the <strong>Share</strong> button in your Safari browser bar.<br />
              2. Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.<br />
              3. Tap <strong>Add</strong> at top right to use ON AIR like a native app.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full rounded-xl bg-[#EF1735] py-2.5 text-xs font-bold text-white shadow"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
