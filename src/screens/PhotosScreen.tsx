
import React from 'react';
import { WeddingEvent, MatchedGuestPhoto } from '../types';
import {
  FiCalendar,
  FiMapPin,
  FiCamera,
} from 'react-icons/fi';
import { BsCpu } from 'react-icons/bs';
import { HiSparkles } from 'react-icons/hi2';

interface PhotosScreenProps {
  wedding: WeddingEvent;
  matchedPhotos: MatchedGuestPhoto[];
  galleryPhotos: MatchedGuestPhoto[];
  guestSelfieUrl: string | null;
  onNavigateToFindPhotos: () => void;
  onViewPhoto: (url: string, caption?: string) => void;
}

export const PhotosScreen: React.FC<PhotosScreenProps> = ({
  wedding,
  matchedPhotos,
  guestSelfieUrl,
  onNavigateToFindPhotos,
  onViewPhoto,
}) => {
  // SECURITY: Never display the complete event gallery here.
  // Only show photos returned by the authenticated AI matching service.
  const photosToShow = matchedPhotos;
  const hasPhotos = photosToShow.length > 0;

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* Mini Wedding Card */}
      <div className="bg-gradient-to-r from-[#410015] to-[#790020] text-white px-4 pt-1 pb-4">
        <div className="bg-black/25 border border-white/15 rounded-2xl p-2.5 flex items-center gap-3 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/20">
            <img
              src={wedding.heroImageUrl}
              alt="Wedding couple"
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

      {/* Matched Photos */}
      <div className="px-4 pt-4">
        {hasPhotos ? (
          <>
            <div className="relative mb-5 flex items-center gap-3.5 overflow-hidden rounded-2xl border border-[#BBF7D0] bg-gradient-to-r from-[#F0FDF4] to-[#ECFDF5] p-3.5 shadow-sm">
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-7xl text-emerald-600/15">
                <BsCpu />
              </div>

              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-emerald-100 shadow-md">
                {guestSelfieUrl && (
                  <img
                    src={guestSelfieUrl}
                    alt="Your selfie"
                    className="h-full w-full object-cover"
                  />
                )}

                <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#16A34A] text-[10px] text-white shadow">
                  <span className="font-bold">✓</span>
                </div>
              </div>

              <div className="relative z-10 min-w-0 flex-1 pr-6">
                <div className="flex items-center gap-1 text-sm font-black text-[#15803D]">
                  <HiSparkles className="shrink-0 text-base text-amber-500" />
                  <span>Your Photos Are Ready!</span>
                </div>

                <p className="mt-1 text-xs leading-snug text-gray-700">
                  We found{' '}
                  <strong className="font-black text-[#EF1735]">
                    {photosToShow.length}
                  </strong>{' '}
                  matching photos of you in this wedding using AI.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#EF1735] rounded-full" />

                <h3 className="text-sm font-bold text-[#171717]">
                  Your Wedding Photos{' '}
                  <span className="text-[#77727A] font-semibold">
                    ({photosToShow.length})
                  </span>
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {photosToShow.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() =>
                    onViewPhoto(
                      photo.url,
                      `Your Photo #${index + 1} (${photo.tag})`
                    )
                  }
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-[#F0E6E9] cursor-pointer active:scale-95 transition"
                >
                  <img
                    src={photo.url}
                    alt={`Matched wedding photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                    <span className="text-[9px] font-bold text-white bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                      {photo.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#FFF0F3] text-[#EF1735] flex items-center justify-center text-3xl mb-4 shadow-sm border border-[#F0E6E9]">
              <FiCamera />
            </div>

            <h3 className="text-base font-bold text-[#171717]">
              {guestSelfieUrl
                ? 'No Matching Photos Found'
                : 'Find Your Wedding Photos'}
            </h3>

            <p className="text-xs text-[#77727A] max-w-xs mt-2 mb-6 leading-relaxed">
              {guestSelfieUrl
                ? "We couldn't find any photos matching your selfie. Try another clear selfie with your face visible, or check again after the studio uploads more photos."
                : 'Upload a selfie to find your wedding photos using AI face recognition.'}
            </p>

            <button
              onClick={onNavigateToFindPhotos}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#EF1735] to-[#790020] text-white text-xs font-bold shadow-lg hover:shadow-xl active:scale-95 transition flex items-center gap-2"
            >
              <FiCamera className="text-sm" />
              <span>
                {guestSelfieUrl ? 'Try Another Selfie' : 'Find My Photos'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
