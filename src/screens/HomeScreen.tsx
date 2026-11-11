import React, { useState, useEffect } from 'react';
import { WeddingEvent } from '../types';
import { TabType } from '../components/BottomNav';
import { FiCalendar, FiMapPin, FiPlay } from 'react-icons/fi';
import { IoImagesOutline, IoGridOutline, IoHeartOutline } from 'react-icons/io5';
import { MdLiveTv, MdOutlineEventNote } from 'react-icons/md';
import { BiCameraMovie } from 'react-icons/bi';
import { RiGroupLine } from 'react-icons/ri';

interface HomeScreenProps {
  wedding: WeddingEvent;
  onNavigate: (tab: TabType | string) => void;
  onPlayTrailer: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  wedding,
  onNavigate,
  onPlayTrailer,
}) => {
  const bannerImages =
    wedding.banners && wedding.banners.length > 0
      ? wedding.banners.map((banner) => banner.url)
      : [
          wedding.heroImageUrl ||
            '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
          '/src/assets/images/image.png',
          '/src/assets/images/couple_portrait_reception_1794119557634.jpg',
          '/src/assets/images/haldi_ceremony_album_1794118489903.jpg',
        ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    setCurrentBannerIndex(0);
  }, [bannerImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [bannerImages.length]);
  const shortcutCards = [
    {
      id: 'live',
      label: 'Live Stream',
      badge: wedding.isLive ? 'LIVE' : undefined,
      icon: <MdLiveTv className="text-[28px] text-[#EF1735]" />,
      bg: 'bg-[#FFF0F3]',
      action: () => onNavigate('live-stream'),
    },
    {
      id: 'photos',
      label: 'Photos',
      icon: <IoImagesOutline className="text-[26px] text-[#8B5CF6]" />,
      bg: 'bg-[#F5F3FF]',
      action: () => onNavigate('photos'),
    },
    {
      id: 'highlights',
      label: 'Highlights',
      icon: <BiCameraMovie className="text-[26px] text-[#6366F1]" />,
      bg: 'bg-[#EEF2FF]',
      action: () => onNavigate('highlights'),
    },
    {
      id: 'schedule',
      label: 'Event Schedule',
      icon: <MdOutlineEventNote className="text-[26px] text-[#F97316]" />,
      bg: 'bg-[#FFF7ED]',
      action: () => onNavigate('schedule'),
    },
    {
      id: 'venue',
      label: 'Venue',
      icon: <FiMapPin className="text-[26px] text-[#EF1735]" />,
      bg: 'bg-[#FFF0F3]',
      action: () => onNavigate('venue'),
    },
    {
      id: 'family',
      label: 'Family',
      icon: <RiGroupLine className="text-[26px] text-[#EC4899]" />,
      bg: 'bg-[#FDF2F8]',
      action: () => onNavigate('family'),
    },
    {
      id: 'wishes',
      label: 'Wishes',
      icon: <IoHeartOutline className="text-[26px] text-[#EF1735]" />,
      bg: 'bg-[#FFF0F3]',
      action: () => onNavigate('wishes'),
    },
    {
      id: 'more',
      label: 'More',
      icon: <IoGridOutline className="text-[26px] text-[#EF1735]" />,
      bg: 'bg-[#FFF0F3]',
      action: () => onNavigate('more'),
    },
  ];

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* 1. Full-width Wedding Hero Banner */}
      <div className="relative isolate h-[360px] w-full overflow-hidden bg-[#410015] text-white sm:h-[420px]">
        {bannerImages.map((imgUrl, idx) => (
          <img
            key={idx}
            src={imgUrl}
            alt={`Karthik & Sneha Moment ${idx + 1}`}
            onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length)}
            className={`absolute inset-0 h-full w-full cursor-pointer object-cover object-center transition-opacity duration-700 ease-in-out ${
              idx === currentBannerIndex ? 'z-0 opacity-100' : 'pointer-events-none opacity-0'
            }`}
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#26000d]/95 via-[#26000d]/35 to-black/10" />

        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-9 pt-20">
          <span className="text-xs font-medium tracking-wide text-white/90">
            The Wedding Of
          </span>
          <h1 className="font-script text-[42px] leading-[1.05] tracking-wide text-white drop-shadow sm:text-5xl">
            {wedding.groomName} &amp; {wedding.brideName}
          </h1>
          <div className="my-1 text-xs text-[#FDE68A]">♡</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-white/95">
            <FiCalendar className="shrink-0 text-sm text-[#FDE68A]" />
            <span className="font-medium">{wedding.eventDate}, {wedding.eventDay}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/95">
            <FiMapPin className="shrink-0 text-sm text-[#FDE68A]" />
            <span className="truncate font-medium">{wedding.locationCity}, {wedding.locationState}</span>
          </div>
        </div>

        <div className="absolute bottom-2.5 left-0 right-0 z-20 flex items-center justify-center gap-1.5">
          {bannerImages.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentBannerIndex(dotIdx)}
              aria-label={`Go to couple photo ${dotIdx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                dotIdx === currentBannerIndex
                  ? 'w-4 h-1.5 bg-[#EF1735]'
                  : 'w-1.5 h-1.5 bg-[#FDE68A]/60 hover:bg-[#FDE68A]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. Overlapping White Sheet Container */}
      <div className="-mt-4 bg-[#FFFDFE] rounded-t-[28px] px-4 pt-5 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] relative z-10 border-t border-white/80">
        {/* 8 Main Shortcut Cards (2 rows of 4) */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mb-6">
          {shortcutCards.map((card) => (
            <button
              key={card.id}
              onClick={card.action}
              className={`${card.bg} rounded-2xl p-2.5 flex flex-col items-center justify-center min-h-[82px] border border-[#F0E6E9] shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-95 transition-all text-center group`}
            >
              <div className="relative mb-1 flex items-center justify-center">
                {card.icon}
                {card.badge && (
                  <span className="absolute -bottom-1.5 bg-[#EF1735] text-white text-[7.5px] font-black px-1.5 py-[0.5px] rounded-full uppercase tracking-tight shadow">
                    ▶ {card.badge}
                  </span>
                )}
              </div>
              <span className="text-[10.5px] font-bold text-[#171717] leading-tight line-clamp-1 mt-0.5">
                {card.label}
              </span>
            </button>
          ))}
        </div>

        {/* Wedding Trailer */}
        {wedding.trailerVideoUrl && <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#410015] to-[#790020] p-3.5 text-white shadow-lg">
          {/* Subtle corner floral ornament */}
          <div className="absolute right-0 top-0 w-24 h-24 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <path d="M100,0 Q60,40 100,80" />
              <path d="M80,0 Q50,30 80,60" />
            </svg>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            {/* Thumbnail with Play Icon */}
            <div
              onClick={onPlayTrailer}
              className="relative w-[130px] h-[88px] rounded-xl overflow-hidden shrink-0 shadow-md border border-white/20 group cursor-pointer"
            >
              <img
                src={wedding.trailerThumbnailUrl}
                alt="Trailer thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-white/90 text-[#EF1735] flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <FiPlay className="text-base ml-0.5 fill-current" />
                </div>
              </div>
            </div>

            {/* Trailer Details & CTA */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                {wedding.trailerTitle || 'Wedding Trailer'}
              </h3>
              <p className="text-[11px] text-white/80 line-clamp-2 mt-0.5 mb-2.5 leading-snug">
                {wedding.trailerDescription || 'Watch the couple’s wedding trailer.'}
              </p>

              <button
                onClick={onPlayTrailer}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#171717] hover:bg-gray-100 active:scale-95 text-xs font-bold shadow-md transition"
              >
                <FiPlay className="text-[11px] text-[#EF1735] fill-current" />
                <span>Watch Now</span>
              </button>
            </div>
          </div>
        </div>}

      </div>
    </div>
  );
};
