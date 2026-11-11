import React, { useRef, useState, useEffect } from 'react';
import { FiX, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize } from 'react-icons/fi';

interface VideoPlayerModalProps {
  videoUrl: string | null;
  title: string;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ videoUrl, title, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [videoUrl]);

  if (!videoUrl) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setProgress((videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-player-viewport fixed inset-0 z-50 bg-black/95 flex flex-col p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="video-player-header flex shrink-0 items-center justify-between gap-3 text-white pb-2 sm:pb-3">
        <div className="flex min-w-0 flex-col">
          <span className="text-xs font-semibold text-white/60">ON AIR Wedding Stories</span>
          <h3 className="max-w-[min(65vw,240px)] truncate text-sm font-bold text-white">{title}</h3>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-white transition"
        >
          <FiX className="text-lg" />
        </button>
      </div>

      {/* Video Content */}
      <div className="video-player-stage relative my-2 flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={(e) => {
            e.preventDefault();
            setIsPlaying(false);
          }}
          onClick={togglePlay}
          className="h-full w-full max-h-full max-w-full cursor-pointer bg-black object-contain shadow-2xl"
        />

        {/* Center overlay play button when paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute w-16 h-16 rounded-full bg-[#EF1735]/90 text-white flex items-center justify-center text-2xl shadow-xl hover:scale-110 active:scale-95 transition"
          >
            <FiPlay className="ml-1" />
          </button>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="video-player-controls shrink-0 rounded-2xl border border-white/10 bg-[#170008]/80 p-3 backdrop-blur-md text-white sm:p-3.5">
        {/* Progress scrub bar */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono text-white/70">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={isNaN(progress) ? 0 : progress}
            onChange={handleSeek}
            className="flex-1 accent-[#EF1735] h-1.5 rounded-lg cursor-pointer bg-white/20"
          />
          <span className="text-[11px] font-mono text-white/70">{formatTime(duration)}</span>
        </div>

        {/* Play / Mute / Fullscreen buttons */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-xl hover:text-[#EF1735] transition">
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
            <button onClick={toggleMute} className="text-lg hover:text-[#EF1735] transition">
              {isMuted ? <FiVolumeX /> : <FiVolume2 />}
            </button>
          </div>

          <button
            onClick={() => {
              if (videoRef.current) {
                if (videoRef.current.requestFullscreen) {
                  videoRef.current.requestFullscreen();
                }
              }
            }}
            className="text-lg hover:text-[#EF1735] transition"
          >
            <FiMaximize />
          </button>
        </div>
      </div>
    </div>
  );
};
