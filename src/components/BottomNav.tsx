import React from 'react';
import { HiOutlineHome, HiHome } from 'react-icons/hi2';
import { IoImagesOutline, IoImages, IoGridOutline, IoGrid } from 'react-icons/io5';
import { BiCameraMovie, BiSolidCameraMovie } from 'react-icons/bi';
import { MdOutlineDocumentScanner } from 'react-icons/md';

export type TabType = 'home' | 'photos' | 'find-photos' | 'highlights' | 'more';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-[#F0E6E9] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-40 select-none pb-safe">
      <div className="relative flex items-center justify-around h-16 px-1">
        {/* 1. Home */}
        <button
          onClick={() => onChangeTab('home')}
          className="flex-1 flex flex-col items-center justify-center py-1 transition-all group"
        >
          <div className="relative flex flex-col items-center">
            {activeTab === 'home' ? (
              <HiHome className="text-[22px] text-[#EF1735] transition-transform active:scale-90" />
            ) : (
              <HiOutlineHome className="text-[22px] text-[#77727A] group-hover:text-black transition-colors" />
            )}
            <span
              className={`text-[10px] mt-1 font-semibold transition-colors ${
                activeTab === 'home' ? 'text-[#EF1735]' : 'text-[#77727A]'
              }`}
            >
              Home
            </span>
            {activeTab === 'home' && (
              <span className="w-8 h-[2.5px] bg-[#EF1735] rounded-full absolute -bottom-1" />
            )}
          </div>
        </button>

        {/* 2. Photos */}
        <button
          onClick={() => onChangeTab('photos')}
          className="flex-1 flex flex-col items-center justify-center py-1 transition-all group"
        >
          <div className="relative flex flex-col items-center">
            {activeTab === 'photos' ? (
              <IoImages className="text-[21px] text-[#EF1735] transition-transform active:scale-90" />
            ) : (
              <IoImagesOutline className="text-[21px] text-[#77727A] group-hover:text-black transition-colors" />
            )}
            <span
              className={`text-[10px] mt-1 font-semibold transition-colors ${
                activeTab === 'photos' ? 'text-[#EF1735]' : 'text-[#77727A]'
              }`}
            >
              Photos
            </span>
            {activeTab === 'photos' && (
              <span className="w-8 h-[2.5px] bg-[#EF1735] rounded-full absolute -bottom-1" />
            )}
          </div>
        </button>

        {/* 3. Center Prominent Floating Red Button: Find My Photos */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-6">
          <button
            onClick={() => onChangeTab('find-photos')}
            aria-label="Find My Photos with AI Selfie"
            className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-[#D60A28] via-[#EF1735] to-[#FF4561] text-white flex flex-col items-center justify-center shadow-[0_8px_20px_rgba(239,23,53,0.45)] hover:shadow-[0_10px_24px_rgba(239,23,53,0.6)] active:scale-95 transition-transform border-[3px] border-white ring-1 ring-black/5"
          >
            {/* Proper Selfie Face Scanning Viewfinder Icon */}
            <div className="relative w-6 h-6 flex items-center justify-center text-white mb-0.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-full h-full stroke-white stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
              >
                {/* 4 corner viewfinder brackets */}
                <path d="M4 8V5a1 1 0 0 1 1-1h3" />
                <path d="M16 4h3a1 1 0 0 1 1 1v3" />
                <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
                <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
                {/* Selfie head and shoulders */}
                <circle cx="12" cy="10" r="3.2" strokeWidth="2" />
                <path d="M6.8 17.5a5.2 5.2 0 0 1 10.4 0" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-[7.5px] font-extrabold uppercase leading-[1.05] tracking-tight text-center px-0.5 text-white drop-shadow-xs">
              Find My<br />Photos
            </span>
          </button>
        </div>

        {/* 4. Highlights */}
        <button
          onClick={() => onChangeTab('highlights')}
          className="flex-1 flex flex-col items-center justify-center py-1 transition-all group"
        >
          <div className="relative flex flex-col items-center">
            {activeTab === 'highlights' ? (
              <BiSolidCameraMovie className="text-[22px] text-[#EF1735] transition-transform active:scale-90" />
            ) : (
              <BiCameraMovie className="text-[22px] text-[#77727A] group-hover:text-black transition-colors" />
            )}
            <span
              className={`text-[10px] mt-1 font-semibold transition-colors ${
                activeTab === 'highlights' ? 'text-[#EF1735]' : 'text-[#77727A]'
              }`}
            >
              Highlights
            </span>
            {activeTab === 'highlights' && (
              <span className="w-8 h-[2.5px] bg-[#EF1735] rounded-full absolute -bottom-1" />
            )}
          </div>
        </button>

        {/* 5. More */}
        <button
          onClick={() => onChangeTab('more')}
          className="flex-1 flex flex-col items-center justify-center py-1 transition-all group"
        >
          <div className="relative flex flex-col items-center">
            {activeTab === 'more' ? (
              <IoGrid className="text-[21px] text-[#EF1735] transition-transform active:scale-90" />
            ) : (
              <IoGridOutline className="text-[21px] text-[#77727A] group-hover:text-black transition-colors" />
            )}
            <span
              className={`text-[10px] mt-1 font-semibold transition-colors ${
                activeTab === 'more' ? 'text-[#EF1735]' : 'text-[#77727A]'
              }`}
            >
              More
            </span>
            {activeTab === 'more' && (
              <span className="w-8 h-[2.5px] bg-[#EF1735] rounded-full absolute -bottom-1" />
            )}
          </div>
        </button>
      </div>
    </nav>
  );
};
