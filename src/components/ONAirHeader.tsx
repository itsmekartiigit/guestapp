import React, { useState } from 'react';
import { FiChevronLeft, FiShare2, FiCheck } from 'react-icons/fi';
import { IoCameraOutline } from 'react-icons/io5';
import { RiSignalTowerLine } from 'react-icons/ri';

interface ONAirHeaderProps {
  studioName: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const ONAirHeader: React.FC<ONAirHeaderProps> = ({
  studioName,
  showBack = false,
  onBack,
}) => {
  const [currentLang, setCurrentLang] = useState('EN');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'KN', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'HI', label: 'हिंदी (Hindi)' },
    { code: 'TE', label: 'తెలుగు (Telugu)' },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ON AIR – Wedding Stories | Karthik & Sneha',
          text: 'Join Karthik & Sneha wedding stream and find your photos with AI!',
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <header className="relative flex items-center justify-between px-4 pt-3.5 pb-2 text-white z-20">
      {/* Left side: Back button (if secondary) + ON AIR brand */}
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={onBack}
            className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 active:scale-95 transition"
            aria-label="Go back"
          >
            <FiChevronLeft className="text-2xl" />
          </button>
        )}

        {/* ON AIR Brand Lockup */}
        <div className="flex flex-col">
          <div className="flex items-center gap-0.5">
            <span className="text-[17px] font-black tracking-tight leading-none text-white font-sans">
              ON <span className="tracking-tighter">AIR</span>
            </span>
            {/* Red signal waves icon */}
            <div className="relative text-[#EF1735] flex items-center -ml-0.5 -mt-1.5">
              <RiSignalTowerLine className="text-sm font-bold animate-pulse" />
            </div>
          </div>
          <span className="text-[8px] font-medium tracking-wide text-white/80 leading-tight">
            Wedding Stories
          </span>
        </div>

        {/* Vertical divider */}
        <div className="h-4 w-[1px] bg-white/20 mx-1.5" />

        {/* Studio Name */}
        <div className="flex items-center gap-1.5 text-white/90">
          <IoCameraOutline className="text-base text-white/90" />
          <span className="text-[13px] font-semibold tracking-tight text-white/95 truncate max-w-[110px]">
            {studioName}
          </span>
        </div>
      </div>

      {/* Right side: Studio Config, Share & Language selector */}
      <div className="flex items-center gap-2">
        {/* Share Button (shown on secondary screens or always available) */}
        <button
          onClick={handleShare}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition relative"
          title="Share wedding link"
        >
          <FiShare2 className="text-[15px]" />
          {copiedShare && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
              Copied!
            </span>
          )}
        </button>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/25 bg-black/20 text-white text-[11px] font-bold tracking-wide hover:bg-white/10 transition"
          >
            <span>{currentLang}</span>
            <span className="text-[9px] opacity-75">▼</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-36 bg-[#2a000e] border border-white/20 rounded-xl shadow-2xl py-1 z-50 text-xs">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setCurrentLang(l.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-white/10 transition ${
                    currentLang === l.code ? 'text-[#EF1735] font-bold' : 'text-white/90'
                  }`}
                >
                  <span>{l.label}</span>
                  {currentLang === l.code && <FiCheck className="text-sm" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
