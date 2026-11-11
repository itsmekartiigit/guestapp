import React, { useState } from 'react';
import { WeddingEvent } from '../types';
import { FiCalendar, FiMapPin, FiChevronRight, FiShield, FiUsers, FiLogOut } from 'react-icons/fi';

interface MoreScreenProps {
  wedding: WeddingEvent;
  onNavigateToPrivacy: () => void;
  onNavigateToFamily: () => void;
  onLogout: () => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({
  wedding,
  onNavigateToPrivacy,
  onNavigateToFamily,
  onLogout,
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="pb-24 animate-in fade-in duration-300 relative min-h-[85vh] flex flex-col justify-between">
      <div>
        {/* 1. Mini Wedding Card */}
        <div className="bg-gradient-to-r from-[#410015] to-[#790020] text-white px-4 pt-1 pb-4">
          <div className="bg-black/25 border border-white/15 rounded-2xl p-2.5 flex items-center gap-3 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/20">
              <img
                src={wedding.heroImageUrl}
                alt="Karthik & Sneha"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {wedding.groomName} &amp; {wedding.brideName} Wedding
              </h2>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-white/80">
                <span className="flex items-center gap-1">
                  <FiCalendar className="text-[12px] text-[#FDE68A]" />
                  {wedding.eventDate}
                </span>
                <span className="flex items-center gap-1 truncate">
                  <FiMapPin className="text-[12px] text-[#FDE68A]" />
                  {wedding.locationCity}, {wedding.locationState}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Section Header with Red Accent Bar */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-1.5 h-4 bg-[#EF1735] rounded-full" />
            <h3 className="text-base font-bold text-[#171717]">More</h3>
          </div>
          <p className="text-[11px] text-[#77727A] pl-3.5">
            Helpful information and event details
          </p>
        </div>

        {/* 3. The Three Large Cards (Image 5) */}
        <div className="px-4 pt-2 space-y-3 relative z-10">
          {/* Card 1: Privacy Policy */}
          <div
            onClick={onNavigateToPrivacy}
            className="bg-white rounded-3xl p-4 flex items-center justify-between border border-[#F0E6E9] shadow-sm hover:shadow-md cursor-pointer active:scale-95 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-[#FFF0F3] border border-[#FDE8EC] flex items-center justify-center text-[#EF1735] shrink-0">
                <FiShield className="text-2xl" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#171717]">Privacy Policy</h4>
                <p className="text-xs text-[#77727A] mt-0.5">
                  Read our privacy policy and how we handle your data.
                </p>
              </div>
            </div>
            <FiChevronRight className="text-xl text-gray-400 shrink-0 ml-2" />
          </div>

          {/* Card 2: Family Details */}
          <div
            onClick={onNavigateToFamily}
            className="bg-white rounded-3xl p-4 flex items-center justify-between border border-[#F0E6E9] shadow-sm hover:shadow-md cursor-pointer active:scale-95 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-[#FFF0F3] border border-[#FDE8EC] flex items-center justify-center text-[#EF1735] shrink-0">
                <FiUsers className="text-2xl" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#171717]">Family Details</h4>
                <p className="text-xs text-[#77727A] mt-0.5">
                  View bride and groom family details and well-wishers.
                </p>
              </div>
            </div>
            <FiChevronRight className="text-xl text-gray-400 shrink-0 ml-2" />
          </div>

          {/* Card 3: Log Out */}
          <div
            onClick={() => setShowLogoutConfirm(true)}
            className="bg-white rounded-3xl p-4 flex items-center justify-between border border-[#F0E6E9] shadow-sm hover:shadow-md cursor-pointer active:scale-95 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-[#FFF0F3] border border-[#FDE8EC] flex items-center justify-center text-[#EF1735] shrink-0">
                <FiLogOut className="text-2xl" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#171717]">Log Out</h4>
                <p className="text-xs text-[#77727A] mt-0.5">
                  Sign out from this application.
                </p>
              </div>
            </div>
            <FiChevronRight className="text-xl text-gray-400 shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* Decorative Traditional Mandala Motif at bottom (exact match to Image 5) */}
      <div className="w-full flex justify-center py-6 pointer-events-none opacity-20">
        <svg viewBox="0 0 200 200" className="w-48 h-48 text-[#EF1735]" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="100" cy="100" r="80" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="60" />
          <circle cx="100" cy="100" r="40" />
          <circle cx="100" cy="100" r="20" />
          {Array.from({ length: 12 }).map((_, i) => (
            <path
              key={i}
              d={`M100,100 L${100 + 80 * Math.cos((i * 30 * Math.PI) / 180)},${100 + 80 * Math.sin((i * 30 * Math.PI) / 180)}`}
              opacity="0.4"
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <circle
              key={`petal-${i}`}
              cx={100 + 50 * Math.cos((i * 45 * Math.PI) / 180)}
              cy={100 + 50 * Math.sin((i * 45 * Math.PI) / 180)}
              r="10"
              strokeWidth="0.8"
            />
          ))}
        </svg>
      </div>

      {/* Log Out Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full text-center shadow-2xl border border-[#F0E6E9] animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F3] text-[#EF1735] flex items-center justify-center text-xl mx-auto mb-3">
              <FiLogOut />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Sign Out of ON AIR?</h3>
            <p className="text-xs text-gray-600 mt-1 mb-5">
              You will need to scan or upload your selfie again to view your matched photos.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#EF1735] text-white text-xs font-bold shadow hover:bg-[#d60a28] transition"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
