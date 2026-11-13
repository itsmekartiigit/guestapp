export interface EventBanner {
  id: string;
  url: string;
  storagePath?: string;
  filename?: string;
  uploadedAt?: string;
}

export interface WeddingEvent {
  id: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  eventDay: string;
  locationCity: string;
  locationState: string;
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
  venueImageUrl: string;
  heroImageUrl: string;
  banners?: EventBanner[];
  studioName: string;
  studioLogoUrl?: string;
  isLive: boolean;
  liveStreamStatus?: 'online' | 'offline' | 'scheduled' | 'completed' | 'live' | 'upcoming';
  liveStreamScheduledAt?: string;
  liveViewersCount: number;
  liveStreamUrl: string;
  trailerTitle: string;
  trailerDescription: string;
  trailerDuration: string;
  trailerThumbnailUrl: string;
  trailerVideoUrl: string;
  photoAlbums?: PhotoAlbum[];
  videoAlbums?: VideoAlbum[];
  schedules?: Array<{ id: string; name: string; date: string; startTime: string; endTime: string; isCurrent: boolean }>;
}

export interface PhotoAlbum {
  id: string;
  title: string;
  photoCount: number;
  coverImageUrl: string;
  description: string;
  photos: AlbumPhoto[];
}

export interface AlbumPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  category: string;
  timestamp?: string;
}

export interface VideoAlbum {
  id: string;
  title: string;
  videoCount: number;
  duration: string;
  thumbnailUrl: string;
  description: string;
  videos: VideoItem[];
}

export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface ScheduleEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'live' | 'completed';
  description?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  side: 'groom' | 'bride';
  imageUrl: string;
  blessing?: string;
}

export interface GuestWish {
  id: string;
  guestName: string;
  message: string;
  photoUrl?: string;
  timestamp: string;
  likes: number;
}

export interface MatchedGuestPhoto {
  id: string;
  url: string;
  confidence: number;
  tag: string;
  time: string;
}

export interface AIPhotoMatchResponse {
  success: boolean;
  selfieUrl: string;
  matchCount: number;
  photos: MatchedGuestPhoto[];
  aiAnalysisSummary?: string;
}
