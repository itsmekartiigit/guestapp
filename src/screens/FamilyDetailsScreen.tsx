import React, { useState } from 'react';
import { initialFamilyMembers } from '../data/weddingData';
import { FamilyMember } from '../types';
import { FiUsers, FiHeart } from 'react-icons/fi';

export const FamilyDetailsScreen: React.FC = () => {
  const [selectedSide, setSelectedSide] = useState<'groom' | 'bride'>('groom');
  const members = initialFamilyMembers.filter((m) => m.side === selectedSide);

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#410015] to-[#790020] text-white px-4 py-4">
        <h2 className="text-base font-bold tracking-tight">Family Details</h2>
        <p className="text-xs text-white/80 mt-0.5">Meet the proud families of Karthik &amp; Sneha</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Side Tabs: Groom Side / Bride Side */}
        <div className="flex bg-[#FFF0F3] p-1 rounded-2xl border border-[#F0E6E9]">
          <button
            onClick={() => setSelectedSide('groom')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              selectedSide === 'groom'
                ? 'bg-[#EF1735] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Groom&apos;s Family (Patil)
          </button>
          <button
            onClick={() => setSelectedSide('bride')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              selectedSide === 'bride'
                ? 'bg-[#EF1735] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bride&apos;s Family (Hiremath)
          </button>
        </div>

        {/* Member Cards */}
        <div className="space-y-3">
          {members.map((member: FamilyMember) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl p-4 border border-[#F0E6E9] shadow-sm flex items-start gap-3.5"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-sm bg-gray-100">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EF1735]">
                  {member.relation}
                </span>
                <h3 className="text-sm font-bold text-[#171717] leading-tight">
                  {member.name}
                </h3>
                {member.blessing && (
                  <p className="text-xs text-[#77727A] mt-1.5 italic leading-relaxed">
                    &ldquo;{member.blessing}&rdquo;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
