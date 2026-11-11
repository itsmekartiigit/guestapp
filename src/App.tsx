import React, { useState, useEffect } from 'react';
import { initialWeddingEvent } from './data/weddingData';
import { WeddingEvent, MatchedGuestPhoto, AIPhotoMatchResponse } from './types';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signInWithCustomToken, signOut } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from './firebase';
import { ONAirHeader } from './components/ONAirHeader';
import { BottomNav, TabType } from './components/BottomNav';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineBanner } from './components/OfflineBanner';
import { PhotoViewerModal } from './components/PhotoViewerModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { SplashScreen } from './components/SplashScreen';

import { HomeScreen } from './screens/HomeScreen';
import { PhotosScreen } from './screens/PhotosScreen';
import { FindMyPhotosScreen } from './screens/FindMyPhotosScreen';
import { HighlightsScreen } from './screens/HighlightsScreen';
import { MoreScreen } from './screens/MoreScreen';
import { LiveStreamScreen } from './screens/LiveStreamScreen';
import { EventScheduleScreen } from './screens/EventScheduleScreen';
import { VenueScreen } from './screens/VenueScreen';
import { WishesScreen } from './screens/WishesScreen';
import { FamilyDetailsScreen } from './screens/FamilyDetailsScreen';
import { PrivacyPolicyScreen } from './screens/PrivacyPolicyScreen';
import { GuestEntryScreen } from './screens/GuestEntryScreen';

type AppView = TabType | 'schedule' | 'venue' | 'family' | 'wishes' | 'live-stream' | 'privacy';

export default function App() {
  const [wedding, setWedding] = useState<WeddingEvent>(initialWeddingEvent);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [guestEventSlug, setGuestEventSlug] = useState('');
  const [isGuestEntered, setIsGuestEntered] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [guestName, setGuestName] = useState<string>(() => {
    try {
      return localStorage.getItem('onair_guest_name') || '';
    } catch {
      return '';
    }
  });
  const [matchedPhotos, setMatchedPhotos] = useState<MatchedGuestPhoto[]>([]);
  const [firebaseError, setFirebaseError] = useState('');
  const [guestSelfieUrl, setGuestSelfieUrl] = useState<string | null>(null);

  // Modals
  const [activePhotoModal, setActivePhotoModal] = useState<{ url: string; caption?: string } | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<{ url: string; title: string } | null>(null);
  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      void (async () => {
        if (!user) {
          if (active) {
            setGuestEventSlug('');
            setIsGuestEntered(false);
            setMatchedPhotos([]);
            setGuestSelfieUrl(null);
            setIsAuthReady(true);
          }
          return;
        }

        try {
          const token = await user.getIdTokenResult();
          const eventSlug = token.claims.guestEventSlug;
          if (token.claims.guest === true && typeof eventSlug === 'string') {
            if (active) {
              setGuestEventSlug(eventSlug);
              setIsGuestEntered(true);
              setIsAuthReady(true);
            }
            return;
          }
          await signOut(auth);
        } catch (error) {
          console.error('Could not restore the guest session:', error);
          if (active) setFirebaseError('Guest access could not be restored. Enter the event PIN again.');
          await signOut(auth).catch((signOutError: unknown) => {
            console.error('Could not clear the expired guest session:', signOutError);
          });
        }
        if (active) setIsAuthReady(true);
      })();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!guestEventSlug) return undefined;
    setWedding(initialWeddingEvent);
    setMatchedPhotos([]);
    setGuestSelfieUrl(null);
    const unsubscribeEvent = onSnapshot(
      doc(db, 'publicEvents', guestEventSlug),
      (snapshot) => {
        if (snapshot.exists()) {
          setWedding((current) => ({ ...current, ...snapshot.data() } as WeddingEvent));
          setFirebaseError('');
        } else {
          setFirebaseError('This wedding event is not available.');
        }
      },
      (error) => {
        console.error('Could not load wedding details from Firebase:', error);
        if (error.code === 'permission-denied') {
          setFirebaseError('Guest access expired. Please sign in with the current event PIN.');
          setGuestEventSlug('');
          setIsGuestEntered(false);
          setMatchedPhotos([]);
          setGuestSelfieUrl(null);
          void signOut(auth).catch((signOutError: unknown) => {
            console.error('Could not clear the expired guest session:', signOutError);
          });
        } else {
          setFirebaseError('Wedding updates are temporarily unavailable. Showing the saved event details.');
        }
      },
    );
    return () => {
      unsubscribeEvent();
    };
  }, [guestEventSlug]);

  
const handleEnterEvent = async (pin: string, name?: string) => {
  const authenticate = httpsCallable<
    { pin: string },
    { eventSlug: string; customToken: string }
  >(functions, 'authenticateGuestEvent');

  try {
    const response = await authenticate({ pin });

    const { eventSlug, customToken } = response.data;

    if (!eventSlug || !customToken) {
      throw new Error('This PIN is not linked to an event.');
    }

    // Authenticate guest using Firebase custom token
    await signInWithCustomToken(auth, customToken);

    setGuestEventSlug(eventSlug);
    setMatchedPhotos([]);
    setGuestSelfieUrl(null);

    try {
      if (name) {
        localStorage.setItem('onair_guest_name', name);
        setGuestName(name);
      }
    } catch {
      // Ignore local storage errors
    }

    setIsGuestEntered(true);
    setCurrentView('home');
    setFirebaseError('');

  } catch (error) {
    console.error('Guest event authentication failed:', error);
    throw error;
  }
};

  // Handle successful AI match
  const handleSuccessMatch = (result: AIPhotoMatchResponse) => {
    if (!result || !Array.isArray(result.photos)) {
      console.error('Invalid AI matching response.');
      setFirebaseError('Unable to display matched photos. Please try again.');
      return;
    }

    setGuestSelfieUrl(result.selfieUrl);
    setMatchedPhotos(result.photos);
    setCurrentView('photos');
    setFirebaseError('');
  };

  // Handle Logout (reset session)
  const handleLogout = () => {
    void signOut(auth).catch((error: unknown) => {
      console.error('Could not sign out guest:', error);
    });
    try {
      localStorage.removeItem('onair_guest_name');
    } catch {
      // Ignore
    }
    setGuestName('');
    setIsGuestEntered(false);
    setGuestEventSlug('');
    setWedding(initialWeddingEvent);
    setGuestSelfieUrl(null);
    setMatchedPhotos([]);
    setFirebaseError('');
    setActivePhotoModal(null);
    setActiveVideoModal(null);
    setCurrentView('home');
  };

  const isMainTab = ['home', 'photos', 'find-photos', 'highlights', 'more'].includes(currentView);

  const handleTabChange = (tab: TabType) => {
    setCurrentView(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0d0608] flex items-center justify-center p-0 sm:p-4 select-none">
      {/* Smartphone Chassis / App Shell */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[880px] sm:max-h-[92vh] sm:rounded-[44px] bg-[#FFFDFE] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-0 sm:border-[8px] sm:border-[#221016] flex flex-col relative overflow-hidden overflow-y-auto no-scrollbar">
        {/* Splash Screen on app launch */}
        <SplashScreen duration={1800} />

        {/* PWA Install & Offline Banner */}
        <PWAInstallBanner />
        <OfflineBanner />

        {/* Screen Content Router or Guest Gate */}
        {!isAuthReady ? (
          <div className="flex min-h-[50vh] items-center justify-center text-sm font-semibold text-gray-500">Checking guest access…</div>
        ) : !isGuestEntered ? (
          <GuestEntryScreen onEnterEvent={handleEnterEvent} />
        ) : (
          <>
            {/* Top Header */}
            <div className="bg-[#410015]">
              <ONAirHeader
                studioName={wedding.studioName}
                showBack={!isMainTab}
                onBack={handleBack}
              />
            </div>

            {/* Main Screen Content */}
            <main className="flex-1 w-full bg-[#FFFDFE]">
              {firebaseError && (
                <p role="status" className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-800">
                  {firebaseError}
                </p>
              )}
              {currentView === 'home' && (
                <HomeScreen
                  wedding={wedding}
                  onNavigate={(view) => setCurrentView(view as AppView)}
                  onPlayTrailer={() =>
                    setActiveVideoModal({
                      url: wedding.trailerVideoUrl,
                      title: wedding.trailerTitle,
                    })
                  }
                />
              )}

              {currentView === 'photos' && (
                <PhotosScreen
                  wedding={wedding}
                  matchedPhotos={matchedPhotos}
                  galleryPhotos={[]}
                  guestSelfieUrl={guestSelfieUrl}
                  onNavigateToFindPhotos={() => setCurrentView('find-photos')}
                  onViewPhoto={(url, caption) => setActivePhotoModal({ url, caption })}
                />
              )}

              {currentView === 'find-photos' && (
                <FindMyPhotosScreen eventId={guestEventSlug} onSuccessMatch={handleSuccessMatch} />
              )}

              {currentView === 'highlights' && (
                <HighlightsScreen
                  wedding={wedding}
                  onPlayVideo={(url, title) => setActiveVideoModal({ url, title })}
                  onViewPhoto={(url, caption) => setActivePhotoModal({ url, caption })}
                />
              )}

              {currentView === 'more' && (
                <MoreScreen
                  wedding={wedding}
                  onNavigateToPrivacy={() => setCurrentView('privacy')}
                  onNavigateToFamily={() => setCurrentView('family')}
                  onLogout={handleLogout}
                />
              )}

              {currentView === 'live-stream' && (
                <LiveStreamScreen wedding={wedding} onBack={handleBack} />
              )}

              {currentView === 'schedule' && <EventScheduleScreen />}

              {currentView === 'venue' && <VenueScreen wedding={wedding} />}

              {currentView === 'wishes' && <WishesScreen eventSlug={guestEventSlug} />}

              {currentView === 'family' && <FamilyDetailsScreen />}

              {currentView === 'privacy' && <PrivacyPolicyScreen />}
            </main>

            {/* Fixed Bottom Android Navigation Bar */}
            <BottomNav
              activeTab={
                ['home', 'photos', 'find-photos', 'highlights', 'more'].includes(currentView)
                  ? (currentView as TabType)
                  : 'home'
              }
              onChangeTab={handleTabChange}
            />
          </>
        )}

        {/* Modals */}
        {activePhotoModal && (
          <PhotoViewerModal
            photoUrl={activePhotoModal.url}
            caption={activePhotoModal.caption}
            onClose={() => setActivePhotoModal(null)}
          />
        )}

        {activeVideoModal && (
          <VideoPlayerModal
            videoUrl={activeVideoModal.url}
            title={activeVideoModal.title}
            onClose={() => setActiveVideoModal(null)}
          />
        )}

      </div>
    </div>
  );
}
