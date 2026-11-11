import React, { useState } from 'react';
import { WeddingEvent, PhotoAlbum, VideoAlbum } from '../types';
import { FiCalendar, FiMapPin, FiPlay, FiChevronRight } from 'react-icons/fi';
import { IoImagesOutline, IoVideocamOutline } from 'react-icons/io5';
import { BiCameraMovie } from 'react-icons/bi';

interface HighlightsScreenProps {
  wedding: WeddingEvent;
  onPlayVideo: (url: string, title: string) => void;
  onViewPhoto: (url: string, caption?: string) => void;
}

export const HighlightsScreen: React.FC<HighlightsScreenProps> = ({
  wedding,
  onPlayVideo,
  onViewPhoto,
}) => {
  const [viewMode, setViewMode] = useState<'main' | 'photo-albums' | 'video-albums' | 'album-detail' | 'video-album-detail'>('main');
  const [selectedPhotoAlbum, setSelectedPhotoAlbum] = useState<PhotoAlbum | null>(null);
  const [selectedVideoAlbum, setSelectedVideoAlbum] = useState<VideoAlbum | null>(null);

  const photoAlbums = wedding.photoAlbums ?? [];
  const videoAlbums = wedding.videoAlbums ?? [];
  const firstPhoto = photoAlbums[0]?.coverImageUrl || wedding.heroImageUrl;
  const secondPhoto = photoAlbums[0]?.photos[1]?.url || firstPhoto;
  const firstVideo = videoAlbums[0];
  const breadcrumb = (label: string, back: () => void) => (
    <div className="flex items-center gap-1 text-xs text-[#77727A]">
      <button onClick={() => setViewMode('main')} className="font-semibold text-[#EF1735]">Highlights</button>
      <FiChevronRight />
      {label !== 'Photo Albums' && label !== 'Video Albums' && <><button onClick={back} className="font-semibold text-[#EF1735]">{label.startsWith('Photo:') ? 'Photo Albums' : 'Video Albums'}</button><FiChevronRight /></>}
      <span className="truncate">{label.startsWith('Photo:') || label.startsWith('Video:') ? label.slice(7) : label}</span>
    </div>
  );

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* 1. Mini Wedding Card */}
      <div className="bg-gradient-to-r from-[#410015] to-[#790020] text-white px-4 pt-1 pb-4">
        <div className="bg-black/25 border border-white/15 rounded-2xl p-2.5 flex items-center gap-3 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/20">
            <img
              src={wedding.heroImageUrl}
              alt="Karthik & Sneha"
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

      {/* Main View: published albums and trailer */}
      {viewMode === 'main' && (
        <div className="px-4 pt-4 space-y-4">
          {/* Card 2: Photo Album */}
          <div className="rounded-3xl bg-gradient-to-br from-[#FFF5F7] via-white to-[#FFF0F3] p-4 shadow-sm border border-[#F0E6E9]">
            <div className="flex items-center gap-3.5">
              {/* Stacked Tilted Polaroid Photos */}
              <div
                onClick={() => setViewMode('photo-albums')}
                className="relative w-[130px] h-[95px] flex items-center justify-center shrink-0 cursor-pointer group"
              >
                <div className="absolute w-[72px] h-[72px] rounded-xl overflow-hidden shadow -rotate-12 transform -translate-x-4 bg-white p-1 border border-gray-200">
                  <img src={firstPhoto} alt="Album 1" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="absolute w-[72px] h-[72px] rounded-xl overflow-hidden shadow 12 transform translate-x-4 bg-white p-1 border border-gray-200">
                  <img src={secondPhoto} alt="Album 2" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="relative w-[78px] h-[78px] rounded-xl overflow-hidden shadow-lg bg-white p-1 border border-gray-200 z-10 group-hover:scale-105 transition">
                  <img src={firstPhoto} alt="Album 3" className="w-full h-full object-cover rounded-lg" />
                </div>
              </div>

              {/* Text & Action */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[#EF1735] mb-1">
                  <IoImagesOutline className="text-base" />
                  <h3 className="text-sm font-bold text-[#171717] tracking-tight leading-none">
                    Photo Album
                  </h3>
                </div>
                <p className="text-[11px] text-[#77727A] line-clamp-2 leading-snug mb-2.5">
                  {photoAlbums.length ? `${photoAlbums.length} published album${photoAlbums.length === 1 ? '' : 's'}` : 'No photo albums published yet'}
                </p>
                <button
                  onClick={() => setViewMode('photo-albums')}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#F0E6E9] text-[#EF1735] hover:bg-[#FFF0F3] active:scale-95 text-xs font-bold shadow-sm transition"
                >
                  <span>View Album</span>
                  <FiChevronRight className="text-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Video Album */}
          <div className="rounded-3xl bg-gradient-to-br from-[#FFF5F7] via-white to-[#FFF0F3] p-4 shadow-sm border border-[#F0E6E9]">
            <div className="flex items-center gap-3.5">
              {/* Thumbnail with 28:16 Duration */}
              <div
                onClick={() => setViewMode('video-albums')}
                className="relative w-[130px] h-[95px] rounded-2xl overflow-hidden shrink-0 shadow border border-gray-200 cursor-pointer group"
              >
                <img
                  src={firstVideo?.thumbnailUrl || wedding.heroImageUrl}
                  alt="Video album"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/90 text-[#EF1735] flex items-center justify-center shadow-md">
                    <FiPlay className="ml-0.5 text-sm fill-current" />
                  </div>
                </div>
                <span className="absolute bottom-1.5 right-1.5 bg-black/75 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                  {firstVideo?.duration || ''}
                </span>
              </div>

              {/* Text & Action */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[#EF1735] mb-1">
                  <IoVideocamOutline className="text-base" />
                  <h3 className="text-sm font-bold text-[#171717] tracking-tight leading-none">
                    Video Album
                  </h3>
                </div>
                <p className="text-[11px] text-[#77727A] line-clamp-2 leading-snug mb-2.5">
                  {videoAlbums.length ? `${videoAlbums.length} published album${videoAlbums.length === 1 ? '' : 's'}` : 'No video albums published yet'}
                </p>
                <button
                  onClick={() => setViewMode('video-albums')}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#F0E6E9] text-[#EF1735] hover:bg-[#FFF0F3] active:scale-95 text-xs font-bold shadow-sm transition"
                >
                  <FiPlay className="text-[10px] text-[#EF1735] fill-current" />
                  <span>Watch Videos</span>
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#F0E6E9] bg-gradient-to-br from-[#FFF5F7] via-white to-[#FFF0F3] p-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onPlayVideo(wedding.trailerVideoUrl, wedding.trailerTitle || 'Wedding Trailer')}
                  disabled={!wedding.trailerVideoUrl}
                  className="group relative h-[95px] w-[130px] shrink-0 overflow-hidden rounded-2xl border border-gray-200 shadow disabled:cursor-default"
                  aria-label={wedding.trailerVideoUrl ? `Play ${wedding.trailerTitle || 'wedding trailer'}` : 'No trailer published yet'}
                >
                  <img
                    src={wedding.trailerThumbnailUrl || wedding.heroImageUrl}
                    alt="Wedding trailer"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#EF1735] shadow-md">
                      <FiPlay className="ml-0.5 text-base fill-current" />
                    </span>
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-1.5 text-[#EF1735]">
                    <BiCameraMovie className="text-base" />
                    <h3 className="truncate text-sm font-bold leading-none text-[#171717]">
                      Trailer
                    </h3>
                  </div>
                  <p className="mb-2.5 line-clamp-2 text-[11px] leading-snug text-[#77727A]">
                    {wedding.trailerVideoUrl
                      ? `${wedding.trailerTitle || 'Wedding Trailer'}${wedding.trailerDescription ? ` · ${wedding.trailerDescription}` : ''}`
                      : 'No trailer published yet'}
                  </p>
                  <button
                    type="button"
                    onClick={() => onPlayVideo(wedding.trailerVideoUrl, wedding.trailerTitle || 'Wedding Trailer')}
                    disabled={!wedding.trailerVideoUrl}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#F0E6E9] bg-white px-4 py-1.5 text-xs font-bold text-[#EF1735] shadow-sm transition hover:bg-[#FFF0F3] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiPlay className="fill-current text-[10px]" />
                    <span>Watch Trailer</span>
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}

      {/* Drill-down 1: Photo Albums List (Image 4 middle) */}
      {viewMode === 'photo-albums' && (
        <div className="px-4 pt-3 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-1">{breadcrumb('Photo Albums', () => setViewMode('photo-albums'))}</div>

          {photoAlbums.length === 0 && <p className="rounded-xl bg-white p-5 text-center text-xs text-gray-500">No photo albums have been published yet.</p>}
          {photoAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => {
                setSelectedPhotoAlbum(album);
                setViewMode('album-detail');
              }}
              className="bg-white rounded-2xl p-2.5 flex items-center justify-between border border-[#F0E6E9] shadow-sm hover:shadow-md cursor-pointer active:scale-95 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <img src={album.coverImageUrl} alt={album.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171717]">{album.title}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-[#77727A] mt-0.5">
                    <IoImagesOutline className="text-xs text-[#EF1735]" />
                    <span>{album.photoCount} Photos</span>
                  </div>
                </div>
              </div>
              <FiChevronRight className="text-lg text-gray-400 mr-2" />
            </div>
          ))}
        </div>
      )}

      {/* Drill-down 2: Album Detail Photo Gallery */}
      {viewMode === 'album-detail' && selectedPhotoAlbum && (
        <div className="px-4 pt-3 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-1">{breadcrumb(`Photo: ${selectedPhotoAlbum.title}`, () => setViewMode('photo-albums'))}</div>
          <p className="text-[11px] text-[#77727A]">{selectedPhotoAlbum.photoCount} Photos in this album</p>

          <div className="grid grid-cols-3 gap-2">
            {selectedPhotoAlbum.photos.map((photo, i) => (
              <div
                key={photo.id}
                onClick={() => onViewPhoto(photo.url, `${selectedPhotoAlbum.title} Photo #${i + 1}`)}
                className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-[#F0E6E9] cursor-pointer hover:opacity-90 active:scale-95 transition"
              >
                <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drill-down 3: Video Albums List (Image 4 right) */}
      {viewMode === 'video-albums' && (
        <div className="px-4 pt-3 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-1">{breadcrumb('Video Albums', () => setViewMode('video-albums'))}</div>

          {videoAlbums.length === 0 && <p className="rounded-xl bg-white p-5 text-center text-xs text-gray-500">No video albums have been published yet.</p>}
          {videoAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => {
                setSelectedVideoAlbum(album);
                setViewMode('video-album-detail');
              }}
              className="bg-white rounded-2xl p-2.5 flex items-center justify-between border border-[#F0E6E9] shadow-sm hover:shadow-md cursor-pointer active:scale-95 transition"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <img src={album.thumbnailUrl} alt={album.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <FiPlay className="text-white text-xs fill-current" />
                  </div>
                  <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[8px] font-mono px-1 rounded">
                    {album.duration}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171717]">{album.title}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-[#77727A] mt-0.5">
                    <IoVideocamOutline className="text-xs text-[#EF1735]" />
                    <span>{album.videoCount} {album.videoCount === 1 ? 'Video' : 'Videos'}</span>
                  </div>
                </div>
              </div>
              <FiChevronRight className="text-lg text-gray-400 mr-2" />
            </div>
          ))}
        </div>
      )}

      {viewMode === 'video-album-detail' && selectedVideoAlbum && (
        <div className="px-4 pt-3 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-1">{breadcrumb(`Video: ${selectedVideoAlbum.title}`, () => setViewMode('video-albums'))}</div>
          <p className="text-[11px] text-[#77727A]">{selectedVideoAlbum.videoCount} videos in this album</p>
          {selectedVideoAlbum.videos.map((video) => (
            <button key={video.id} onClick={() => onPlayVideo(video.videoUrl, video.title)} className="flex w-full items-center gap-3 rounded-2xl border border-[#F0E6E9] bg-white p-2.5 text-left shadow-sm">
              <img src={video.thumbnailUrl || selectedVideoAlbum.thumbnailUrl} alt="" className="h-14 w-16 rounded-xl object-cover" />
              <span className="min-w-0 flex-1 truncate text-xs font-bold text-[#171717]">{video.title}</span>
              <FiPlay className="text-[#EF1735]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
