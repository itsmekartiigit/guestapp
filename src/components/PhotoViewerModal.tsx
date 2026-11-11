import React from 'react';
import { FiX, FiDownload, FiShare2 } from 'react-icons/fi';

interface PhotoViewerModalProps {
  photoUrl: string | null;
  caption?: string;
  onClose: () => void;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({ photoUrl, caption, onClose }) => {
  if (!photoUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `wedding-photo-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wedding Photo',
          text: 'Check out this photo from Karthik & Sneha wedding!',
          url: photoUrl,
        });
      } catch {
        // Ignored
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top toolbar */}
      <div className="flex items-center justify-between text-white pt-2 pb-4">
        <span className="text-xs font-semibold text-white/70">
          {caption || 'Wedding Story Photo'}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
          >
            <FiShare2 className="text-base" />
          </button>
          <button
            onClick={handleDownload}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
          >
            <FiDownload className="text-base" />
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
          >
            <FiX className="text-lg" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center overflow-hidden py-2">
        <img
          src={photoUrl}
          alt={caption || 'Wedding photo'}
          className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl select-none"
        />
      </div>

      {/* Bottom info */}
      <div className="text-center pb-4 text-xs text-white/60">
        Tap outside or press close to exit viewer
      </div>
    </div>
  );
};
