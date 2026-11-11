import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 1800,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if session already showed splash during this page session or show on app start
    const timer = setTimeout(() => {
      setIsFading(true);
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        if (onFinish) onFinish();
      }, 450);
      return () => clearTimeout(fadeTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      onClick={() => {
        setIsFading(true);
        setTimeout(() => {
          setIsVisible(false);
          if (onFinish) onFinish();
        }, 300);
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0d] cursor-pointer transition-opacity duration-500 select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Splash Image */}
      <img
        src="/splash.png"
        alt="ON AIR Live Splash Screen"
        className="w-full h-full object-cover max-w-[430px] mx-auto shadow-2xl"
        loading="eager"
      />

      {/* Pulsing Loading Spinner Overlay at the exact center location */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none max-w-[430px] mx-auto">
        <div className="mt-28 flex flex-col items-center">
          {/* Subtle spinning glow ring matching the splash graphic */}
          <div className="w-9 h-9 rounded-full border-2 border-transparent border-t-[#EF1735] border-r-[#EF1735]/80 animate-spin shadow-[0_0_12px_#EF1735]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/50 mt-4">
            Loading Stories...
          </span>
        </div>
      </div>
    </div>
  );
};
