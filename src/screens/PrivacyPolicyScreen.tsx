import React from 'react';
import { FiShield, FiLock, FiCheckCircle } from 'react-icons/fi';

export const PrivacyPolicyScreen: React.FC = () => {
  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#410015] to-[#790020] text-white px-4 py-4">
        <h2 className="text-base font-bold tracking-tight">Privacy Policy &amp; Security</h2>
        <p className="text-xs text-white/80 mt-0.5">How ON AIR handles your selfie and wedding photos</p>
      </div>

      <div className="p-4 space-y-4 text-xs text-gray-700 leading-relaxed">
        <div className="bg-white rounded-3xl p-5 border border-[#F0E6E9] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-[#EF1735] flex items-center justify-center text-2xl mb-3">
            <FiShield />
          </div>
          <h3 className="text-sm font-bold text-[#171717] mb-2">
            1. Facial Recognition &amp; Biometric Privacy
          </h3>
          <p className="text-[#77727A]">
            When you upload or take a selfie to find your wedding photos, your image is analyzed exclusively to extract facial descriptors for matching against this specific wedding album. We do not sell, rent, or share your biometric data with any external third parties or advertisers.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#F0E6E9] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-[#EF1735] flex items-center justify-center text-2xl mb-3">
            <FiLock />
          </div>
          <h3 className="text-sm font-bold text-[#171717] mb-2">
            2. End-to-End Encryption &amp; Security
          </h3>
          <p className="text-[#77727A]">
            All image uploads and transmissions are protected using TLS 1.3 encryption. Facial embeddings generated during matching are stored ephemerally in server memory and discarded following the matching session.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#F0E6E9] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-[#EF1735] flex items-center justify-center text-2xl mb-3">
            <FiCheckCircle />
          </div>
          <h3 className="text-sm font-bold text-[#171717] mb-2">
            3. Guest Photo Isolation
          </h3>
          <p className="text-[#77727A]">
            Your personal photos matched through AI are accessible solely to you via your current session. Other guests cannot view your private matched albums without their own biometric verification.
          </p>
        </div>
      </div>
    </div>
  );
};
