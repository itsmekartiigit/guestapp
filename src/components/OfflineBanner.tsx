import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { RiWifiOffLine } from 'react-icons/ri';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="fixed top-12 left-4 right-4 max-w-[400px] mx-auto z-50 flex items-center gap-2 bg-[#790020] text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg">
      <RiWifiOffLine className="text-base text-amber-300 shrink-0" />
      <span>Offline Mode — Viewing cached wedding stories & details.</span>
    </div>
  );
};
