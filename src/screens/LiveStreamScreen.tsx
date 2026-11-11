import React, { useState, useEffect } from 'react';
import { WeddingEvent } from '../types';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiHeart, FiSend, FiUsers } from 'react-icons/fi';
import { MdLiveTv } from 'react-icons/md';

interface LiveStreamScreenProps {
  wedding: WeddingEvent;
  onBack: () => void;
}

export const LiveStreamScreen: React.FC<LiveStreamScreenProps> = ({ wedding }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [viewers, setViewers] = useState(wedding.liveViewersCount || 842);
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);
  const [comments, setComments] = useState<{ id: string; user: string; text: string; time: string }[]>([
    { id: '1', user: 'Rohan Sharma', text: 'Sneha looks breathtaking in red saree! ✨', time: 'Just now' },
    { id: '2', user: 'Sunita Patil', text: 'Blessings to Karthik & Sneha from Belagavi! ❤️', time: '1m ago' },
    { id: '3', user: 'Vikram Joshi', text: 'Great camera angles Kartik Studio! 👏', time: '2m ago' },
  ]);
  const [newComment, setNewComment] = useState('');

  // Periodically fluctuate viewers slightly for realism
  useEffect(() => {
    const timer = setInterval(() => {
      setViewers((prev) => prev + (Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const triggerHeart = () => {
    const id = Date.now();
    const left = Math.floor(Math.random() * 60) + 20; // 20% to 80%
    setHearts((prev) => [...prev, { id, left }]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1800);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments((prev) => [
      {
        id: Date.now().toString(),
        user: 'You',
        text: newComment.trim(),
        time: 'Just now',
      },
      ...prev,
    ]);
    setNewComment('');
    triggerHeart();
  };

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#410015] to-[#790020] text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdLiveTv className="text-xl text-[#EF1735]" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              {wedding.title} – Live Stream
            </h2>
          </div>
          {wedding.isLive ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EF1735] text-white text-[10px] font-black tracking-wider uppercase animate-pulse shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-gray-600 text-white text-[10px] font-semibold">
              OFFLINE
            </span>
          )}
        </div>
      </div>

      {/* Video Player Box */}
      <div className="relative bg-black aspect-video w-full overflow-hidden shadow-lg">
        {wedding.isLive ? (
          <>
            <video
              src={wedding.liveStreamUrl}
              poster={wedding.heroImageUrl}
              autoPlay
              playsInline
              loop
              muted={isMuted}
              onError={(e) => {
                // Prevent unhandled error event
                e.preventDefault();
              }}
              className="w-full h-full object-cover"
            />

            {/* Live Badges Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <div className="flex items-center gap-1.5 bg-[#EF1735] text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                LIVE
              </div>
              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                <FiUsers className="text-xs" />
                <span>{viewers.toLocaleString()} watching</span>
              </div>
            </div>

            {/* Floating Heart Animations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {hearts.map((h) => (
                <div
                  key={h.id}
                  style={{ left: `${h.left}%` }}
                  className="absolute bottom-4 text-[#EF1735] text-2xl animate-in fade-in slide-in-from-bottom duration-1000 transform -translate-x-1/2 opacity-90"
                >
                  ❤️
                </div>
              ))}
            </div>

            {/* Quick Controls overlay on hover/touch */}
            <div className="absolute bottom-2 right-2 flex items-center gap-2 z-10 bg-black/50 p-1.5 rounded-xl backdrop-blur-xs text-white">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-7 h-7 flex items-center justify-center hover:text-[#EF1735] transition"
              >
                {isMuted ? <FiVolumeX /> : <FiVolume2 />}
              </button>
              <button
                onClick={triggerHeart}
                className="w-7 h-7 flex items-center justify-center text-[#EF1735] active:scale-125 transition"
              >
                <FiHeart className="fill-current" />
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-white/80">
            <MdLiveTv className="text-4xl text-gray-500 mb-2" />
            <h3 className="text-sm font-bold text-white">The wedding live stream hasn&apos;t started yet.</h3>
            <p className="text-xs text-gray-400 mt-1">
              Broadcast is scheduled for 06:00 PM during the Wedding Ceremony.
            </p>
          </div>
        )}
      </div>

      {/* Stream Info & Live Guest Chat */}
      <div className="p-4 space-y-4">
        {/* Stream Details Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#F0E6E9] shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#171717]">Wedding Ceremony &amp; Pheras</h3>
            <p className="text-xs text-[#77727A] mt-0.5">Streamed in 1080p 60FPS by {wedding.studioName}</p>
          </div>
          <button
            onClick={triggerHeart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F3] text-[#EF1735] border border-[#FDE8EC] text-xs font-bold active:scale-95 transition"
          >
            <FiHeart className="fill-current text-sm" />
            <span>Send Love</span>
          </button>
        </div>

        {/* Live Reactions & Comments */}
        <div className="bg-white rounded-3xl p-4 border border-[#F0E6E9] shadow-sm">
          <h4 className="text-xs font-bold text-[#171717] mb-3 flex items-center justify-between">
            <span>Live Guest Chat</span>
            <span className="text-[11px] font-normal text-[#77727A]">Real-time blessings</span>
          </h4>

          {/* Comments List */}
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 no-scrollbar mb-3">
            {comments.map((c) => (
              <div key={c.id} className="bg-[#FFFDFE] rounded-xl p-2.5 border border-[#F0E6E9] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#790020]">{c.user}</span>
                  <span className="text-[10px] text-gray-400">{c.time}</span>
                </div>
                <p className="text-gray-800 mt-0.5">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendComment} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Send live blessing to the couple..."
              className="flex-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#EF1735]"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-[#EF1735] text-white flex items-center justify-center shadow active:scale-95 transition"
            >
              <FiSend className="text-sm" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
