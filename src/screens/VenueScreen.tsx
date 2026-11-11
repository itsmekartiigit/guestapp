import React from 'react';
import { WeddingEvent } from '../types';
import { FiMapPin, FiNavigation, FiPhone, FiClock, FiShare2 } from 'react-icons/fi';

interface VenueScreenProps {
  wedding: WeddingEvent;
}

export const VenueScreen: React.FC<VenueScreenProps> = ({ wedding }) => {
  const handleGetDirections = () => {
    const encodedAddress = encodeURIComponent(
      `${wedding.venueName}, ${wedding.venueAddress}`
    );
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  };

  const handleShareLocation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: wedding.venueName,
          text: `Wedding Venue: ${wedding.venueName}, ${wedding.venueAddress}`,
          url: wedding.venueMapUrl,
        });
      } catch {
        // Ignored
      }
    }
  };

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* Venue Hero Image with Scrim */}
      <div className="relative h-56 w-full overflow-hidden bg-neutral-900">
        <img
          src={wedding.venueImageUrl}
          alt={wedding.venueName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
          <div className="text-white">
            <span className="text-[10px] uppercase font-bold text-[#FDE68A] tracking-wider">
              Wedding Venue
            </span>
            <h2 className="text-lg font-bold leading-tight drop-shadow">
              {wedding.venueName}
            </h2>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Address Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#F0E6E9] shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#EF1735] flex items-center justify-center shrink-0 mt-0.5">
              <FiMapPin className="text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#171717]">Full Address</h3>
              <p className="text-xs text-[#77727A] mt-1 leading-relaxed">
                {wedding.venueAddress}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-2 text-gray-700">
              <FiClock className="text-[#EF1735]" />
              <span>Valet Parking Available</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FiPhone className="text-[#EF1735]" />
              <span>Help Desk Onsite</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button: Get Directions */}
        <button
          onClick={handleGetDirections}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#EF1735] via-[#D60A28] to-[#790020] text-white font-bold text-sm shadow-lg hover:shadow-xl active:scale-95 transition flex items-center justify-center gap-2"
        >
          <FiNavigation className="text-lg" />
          <span>Get Directions in Google Maps</span>
        </button>

        {/* Interactive Google Map Preview Container */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[#F0E6E9] shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <span className="text-xs font-bold text-[#171717]">Interactive Location Map</span>
            <button
              onClick={handleShareLocation}
              className="text-xs text-[#EF1735] font-bold flex items-center gap-1 hover:underline"
            >
              <FiShare2 className="text-xs" /> Share Pin
            </button>
          </div>
          <div className="h-48 w-full bg-slate-100 relative">
            <iframe
              title="Venue Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src="https://maps.google.com/maps?q=Haveri+Karnataka+India&t=&z=14&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
