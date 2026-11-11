import {
  WeddingEvent,
  PhotoAlbum,
  VideoAlbum,
  ScheduleEvent,
  FamilyMember,
  GuestWish,
  MatchedGuestPhoto,
} from '../types';

export const initialWeddingEvent: WeddingEvent = {
  id: 'karthik-sneha-2026',
  title: 'Karthik & Sneha Wedding',
  brideName: 'Sneha',
  groomName: 'Karthik',
  eventDate: '07 Nov 2026',
  eventDay: 'Saturday',
  locationCity: 'Haveri',
  locationState: 'Karnataka',
  venueName: 'Sri Shivabasaveshwara Kalyana Mantapa',
  venueAddress: 'PB Road, Near District Stadium, Haveri, Karnataka 581110',
  venueMapUrl: 'https://maps.google.com/?q=Haveri+Karnataka+India',
  venueImageUrl: '/src/assets/images/wedding_venue_palace_1794118489757.jpg',
  heroImageUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
  studioName: 'Kartik Studio',
  studioLogoUrl: '/icon.svg',
  isLive: true,
  liveViewersCount: 842,
  liveStreamUrl: '/assets/videos/wedding_stream.mp4',
  trailerTitle: 'Wedding Trailer',
  trailerDescription: 'Watch our special wedding story',
  trailerDuration: '02:48',
  trailerThumbnailUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
  trailerVideoUrl: '/assets/videos/wedding_trailer.mp4',
};

// Generates 124 matched photos for the guest in the Photos tab
export const guestMatchedPhotosSample: MatchedGuestPhoto[] = Array.from({ length: 124 }, (_, i) => {
  const index = (i % 9) + 1;
  const categories = ['Reception', 'Baraat', 'Candid', 'Ceremony', 'Haldi', 'Sangeet'];
  const times = ['07:42 PM', '08:15 PM', '08:30 PM', '09:05 PM', '09:40 PM', '10:12 PM'];
  return {
    id: `guest-photo-${i + 1}`,
    url: `/src/assets/images/guest_selfie_match_1794118489426.jpg`,
    confidence: Number((0.94 + ((i * 3) % 6) * 0.01).toFixed(2)),
    tag: categories[i % categories.length],
    time: times[i % times.length],
  };
});

export const initialPhotoAlbums: PhotoAlbum[] = [
  {
    id: 'ceremony',
    title: 'Wedding Ceremony',
    photoCount: 432,
    coverImageUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
    description: 'Traditional rituals, Muhurtham, and sacred pheras',
    photos: Array.from({ length: 12 }, (_, i) => ({
      id: `ceremony-${i + 1}`,
      url: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
      thumbnailUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
      caption: `Wedding Ceremony ritual moment #${i + 1}`,
      category: 'Ceremony',
    })),
  },
  {
    id: 'reception',
    title: 'Reception',
    photoCount: 218,
    coverImageUrl: '/src/assets/images/reception_stage_album_1794118489914.jpg',
    description: 'Grand evening gala with friends, family, and celebration banquet',
    photos: Array.from({ length: 10 }, (_, i) => ({
      id: `reception-${i + 1}`,
      url: '/src/assets/images/reception_stage_album_1794118489914.jpg',
      thumbnailUrl: '/src/assets/images/reception_stage_album_1794118489914.jpg',
      caption: `Reception Stage & Guest Greetings #${i + 1}`,
      category: 'Reception',
    })),
  },
  {
    id: 'haldi',
    title: 'Haldi',
    photoCount: 156,
    coverImageUrl: '/src/assets/images/haldi_ceremony_album_1794118489903.jpg',
    description: 'Yellow vibes, playful turmeric blessings, and family fun',
    photos: Array.from({ length: 8 }, (_, i) => ({
      id: `haldi-${i + 1}`,
      url: '/src/assets/images/haldi_ceremony_album_1794118489903.jpg',
      thumbnailUrl: '/src/assets/images/haldi_ceremony_album_1794118489903.jpg',
      caption: `Haldi Joyful Splash #${i + 1}`,
      category: 'Haldi',
    })),
  },
  {
    id: 'mehendi',
    title: 'Mehendi',
    photoCount: 190,
    coverImageUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
    description: 'Intricate henna art, music, dance and radiant bride glow',
    photos: Array.from({ length: 8 }, (_, i) => ({
      id: `mehendi-${i + 1}`,
      url: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
      thumbnailUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
      caption: `Henna artistry detail #${i + 1}`,
      category: 'Mehendi',
    })),
  },
  {
    id: 'candid',
    title: 'Candid Moments',
    photoCount: 284,
    coverImageUrl: '/src/assets/images/guest_selfie_match_1794118489426.jpg',
    description: 'Unfiltered laughter, heartfelt hugs, and stolen smiles',
    photos: Array.from({ length: 12 }, (_, i) => ({
      id: `candid-${i + 1}`,
      url: '/src/assets/images/guest_selfie_match_1794118489426.jpg',
      thumbnailUrl: '/src/assets/images/guest_selfie_match_1794118489426.jpg',
      caption: `Candid laughter #${i + 1}`,
      category: 'Candid',
    })),
  },
];

export const initialVideoAlbums: VideoAlbum[] = [
  {
    id: 'video-ceremony',
    title: 'Wedding Ceremony',
    videoCount: 2,
    duration: '12:36',
    thumbnailUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
    description: 'Complete sacred rituals and exchange of wedding vows',
    videos: [
      {
        id: 'v-ceremony-1',
        title: 'Muhurtham & Pheras Highlights',
        duration: '08:14',
        videoUrl: '/assets/videos/wedding_ceremony.mp4',
        thumbnailUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
      },
      {
        id: 'v-ceremony-2',
        title: 'Kanyadaan & Mangalsutra Dharana',
        duration: '04:22',
        videoUrl: '/assets/videos/wedding_ceremony.mp4',
        thumbnailUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
      },
    ],
  },
  {
    id: 'video-reception',
    title: 'Reception',
    videoCount: 1,
    duration: '08:24',
    thumbnailUrl: '/src/assets/images/reception_stage_album_1794118489914.jpg',
    description: 'Evening gala celebration, royal stage entry, cake cutting',
    videos: [
      {
        id: 'v-reception-1',
        title: 'Grand Couple Entry & Stage Fireworks',
        duration: '08:24',
        videoUrl: '/assets/videos/wedding_reception.mp4',
        thumbnailUrl: '/src/assets/images/reception_stage_album_1794118489914.jpg',
      },
    ],
  },
  {
    id: 'video-haldi',
    title: 'Haldi',
    videoCount: 1,
    duration: '04:52',
    thumbnailUrl: '/src/assets/images/haldi_ceremony_album_1794118489903.jpg',
    description: 'Festive yellow turmeric celebrations and dhol beats',
    videos: [
      {
        id: 'v-haldi-1',
        title: 'Haldi Holi Mania & Blessings',
        duration: '04:52',
        videoUrl: '/assets/videos/wedding_stream.mp4',
        thumbnailUrl: '/src/assets/images/haldi_ceremony_album_1794118489903.jpg',
      },
    ],
  },
  {
    id: 'video-mehendi',
    title: 'Mehendi',
    videoCount: 1,
    duration: '06:18',
    thumbnailUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
    description: 'Musical evening, henna patterns, and family dances',
    videos: [
      {
        id: 'v-mehendi-1',
        title: 'Mehendi Songs & Folk Beats',
        duration: '06:18',
        videoUrl: '/assets/videos/wedding_trailer.mp4',
        thumbnailUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
      },
    ],
  },
  {
    id: 'video-film',
    title: 'Full Wedding Film',
    videoCount: 1,
    duration: '28:16',
    thumbnailUrl: '/src/assets/images/wedding_venue_palace_1794118489757.jpg',
    description: 'The cinematic feature film of Karthik & Sneha’s story',
    videos: [
      {
        id: 'v-film-1',
        title: 'ON AIR Presents: The Eternal Promise',
        duration: '28:16',
        videoUrl: '/assets/videos/wedding_film.mp4',
        thumbnailUrl: '/src/assets/images/wedding_venue_palace_1794118489757.jpg',
      },
    ],
  },
];

export const initialScheduleEvents: ScheduleEvent[] = [
  {
    id: 's-1',
    name: 'Haldi Ceremony',
    date: '07 Nov 2026',
    time: '09:00 AM',
    location: 'Open Courtyard Lawn',
    status: 'completed',
    description: 'Traditional turmeric ritual and holy bath with family blessings.',
  },
  {
    id: 's-2',
    name: 'Mehendi Celebration',
    date: '07 Nov 2026',
    time: '12:00 PM',
    location: 'Lotus Banquet Pavilion',
    status: 'completed',
    description: 'Artistic Henna designs, dhol beats, snacks and refreshments.',
  },
  {
    id: 's-3',
    name: 'Wedding Ceremony',
    date: '07 Nov 2026',
    time: '06:00 PM',
    location: 'Main Mandapam Hall',
    status: 'live',
    description: 'Sacred Muhurtham, Vedic mantras, Saptapadi and nuptial vows.',
  },
  {
    id: 's-4',
    name: 'Grand Reception',
    date: '07 Nov 2026',
    time: '08:00 PM',
    location: 'Grand Ballroom & Dining Court',
    status: 'upcoming',
    description: 'Meet and congratulate the newly-weds, feast, and musical night.',
  },
];

export const initialFamilyMembers: FamilyMember[] = [
  // Groom Side
  {
    id: 'f-1',
    name: 'Shri Basavaraj Patil',
    relation: 'Father of Groom',
    side: 'groom',
    imageUrl: '/src/assets/images/guest_selfie_match_1794118489426.jpg',
    blessing: 'May almighty bless the couple with lifelong health and happiness.',
  },
  {
    id: 'f-2',
    name: 'Smt. Shailaja Patil',
    relation: 'Mother of Groom',
    side: 'groom',
    imageUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
    blessing: 'Sneha is not just a daughter-in-law, but our own daughter coming home.',
  },
  {
    id: 'f-3',
    name: 'Chetan Patil',
    relation: 'Brother of Groom',
    side: 'groom',
    imageUrl: '/src/assets/images/guest_selfie_match_1794118489426.jpg',
    blessing: 'Best bro forever! Excited to welcome Sneha bhabhi to our crazy family.',
  },
  // Bride Side
  {
    id: 'f-4',
    name: 'Shri Mallikarjun Hiremath',
    relation: 'Father of Bride',
    side: 'bride',
    imageUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
    blessing: 'Seeing Sneha begin this beautiful journey with Karthik is our greatest joy.',
  },
  {
    id: 'f-5',
    name: 'Smt. Geetha Hiremath',
    relation: 'Mother of Bride',
    side: 'bride',
    imageUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
    blessing: 'Two beautiful souls united in love. Wishing you infinite blessings.',
  },
  {
    id: 'f-6',
    name: 'Pooja Hiremath',
    relation: 'Sister of Bride',
    side: 'bride',
    imageUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
    blessing: 'Could not ask for a better jiju! Love you both to the moon and back.',
  },
];

export const initialWishes: GuestWish[] = [
  {
    id: 'w-1',
    guestName: 'Darshan & Family',
    message: 'Wishing you both a lifetime of immense love, prosperity, and joy together! Congratulations Karthik & Sneha! 🎉',
    timestamp: 'Just now',
    likes: 18,
  },
  {
    id: 'w-2',
    guestName: 'Dr. Anand Kulkarni',
    message: 'Heartiest congratulations to both the families. A match truly made in heaven. God bless the lovely couple.',
    timestamp: '15 mins ago',
    likes: 24,
  },
  {
    id: 'w-3',
    guestName: 'Priya & Rakesh',
    message: 'Sneha you look absolutely stunning in red saree! Karthik looks like a prince. So happy for you guys! ❤️',
    timestamp: '1 hour ago',
    likes: 31,
  },
];
