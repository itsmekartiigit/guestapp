import React from 'react';
import { initialScheduleEvents } from '../data/weddingData';
import { FiClock, FiMapPin, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { MdLiveTv } from 'react-icons/md';

export const EventScheduleScreen: React.FC = () => {
  const events = initialScheduleEvents;

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#410015] to-[#790020] text-white px-4 py-4">
        <h2 className="text-base font-bold tracking-tight">Wedding Event Schedule</h2>
        <p className="text-xs text-white/80 mt-0.5">Timeline of all celebration ceremonies &amp; rituals</p>
      </div>

      <div className="p-4">
        {/* Timeline */}
        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#F0E6E9]">
          {events.map((evt) => {
            const isLive = evt.status === 'live';
            const isCompleted = evt.status === 'completed';

            return (
              <div key={evt.id} className="relative group">
                {/* Timeline node */}
                <div
                  className={`absolute -left-[23px] top-3.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow ${
                    isLive
                      ? 'bg-[#EF1735] text-white ring-4 ring-[#EF1735]/20 animate-pulse'
                      : isCompleted
                      ? 'bg-[#16A34A] text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isLive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  ) : isCompleted ? (
                    <FiCheckCircle className="text-[10px]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  )}
                </div>

                {/* Event Card */}
                <div
                  className={`rounded-2xl p-4 border transition-all ${
                    isLive
                      ? 'bg-gradient-to-br from-[#FFF5F7] via-white to-[#FFF0F3] border-[#EF1735]/40 shadow-md ring-1 ring-[#EF1735]/30'
                      : 'bg-white border-[#F0E6E9] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm font-bold text-[#171717]">{evt.name}</h3>
                    {isLive && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase text-white bg-[#EF1735] px-2 py-0.5 rounded-full shadow-xs">
                        <MdLiveTv className="text-xs" /> NOW LIVE
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    )}
                    {evt.status === 'upcoming' && (
                      <span className="text-[10px] font-bold text-[#790020] bg-[#FFF0F3] px-2 py-0.5 rounded-full">
                        Upcoming
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#77727A] mb-3 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <FiClock className="text-[#EF1735]" />
                      <span className="font-semibold">{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar className="text-[#790020]" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-[#EF1735]" />
                      <span>{evt.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
