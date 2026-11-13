import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';
import { WeddingEvent } from '../types';
import { FiHeart, FiSend, FiUsers } from 'react-icons/fi';
import { MdLiveTv } from 'react-icons/md';

type StreamStatus = 'online' | 'offline' | 'scheduled' | 'completed';
type GuestMessage = { id: string; user: string; text: string; time: string };
interface GuestPlaybackResponse {
  success?: boolean;
  playbackUrl?: string;
  expiresAt?: number;
}

interface LiveStreamScreenProps {
  wedding: WeddingEvent;
  eventSlug: string;
  guestName: string;
}

const getScheduledDate = (wedding: WeddingEvent) => {
  if (wedding.liveStreamScheduledAt) {
    const explicitDate = new Date(wedding.liveStreamScheduledAt);
    if (!Number.isNaN(explicitDate.getTime())) return explicitDate;
  }

  // Event dates are stored as values such as "07 Nov 2026". The ceremony
  // defaults to 6 PM when no stream-specific start time has been published.
  const eventDate = new Date(`${wedding.eventDate} 6:00 PM`);
  return Number.isNaN(eventDate.getTime()) ? null : eventDate;
};

const formatCountdown = (milliseconds: number) => {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return days > 0
    ? `${days}d ${hours}h ${minutes}m ${remainder}s`
    : `${hours}h ${minutes}m ${remainder}s`;
};

export const LiveStreamScreen: React.FC<LiveStreamScreenProps> = ({ wedding, eventSlug, guestName }) => {
  const scheduledDate = useMemo(() => getScheduledDate(wedding), [wedding.eventDate, wedding.liveStreamScheduledAt]);
  const [now, setNow] = useState(Date.now());
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageError, setMessageError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [playbackUrl, setPlaybackUrl] = useState('');
  const [playbackLoading, setPlaybackLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState('');
  const [videoReady, setVideoReady] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [manualPlayRequired, setManualPlayRequired] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, 'publicEvents', eventSlug, 'wishes'),
      orderBy('createdAt', 'desc'),
      limit(30),
    );
    return onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map((messageDoc) => {
        const data = messageDoc.data();
        const createdAt = data.createdAt?.toDate?.();
        return {
          id: messageDoc.id,
          user: String(data.guestName || 'Wedding guest'),
          text: String(data.message || ''),
          time: createdAt ? createdAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Just now',
        };
      }));
      setMessageError('');
    }, (error) => {
      console.error('Could not load live guest messages:', error);
      setMessageError('Guest messages are temporarily unavailable.');
    });
  }, [eventSlug]);

  const status: StreamStatus = useMemo(() => {
    const publishedStatus = wedding.liveStreamStatus;
    if (publishedStatus === 'online' || publishedStatus === 'live' || wedding.isLive) return 'online';
    if (publishedStatus === 'completed') return 'completed';
    if (publishedStatus === 'scheduled' || publishedStatus === 'upcoming') return 'scheduled';
    if (publishedStatus === 'offline') return 'offline';
    if (scheduledDate && scheduledDate.getTime() > now) return 'scheduled';
    if (scheduledDate && scheduledDate.getTime() <= now) return 'completed';
    return 'offline';
  }, [wedding.liveStreamStatus, wedding.isLive, scheduledDate, now]);

  const refreshPlayback = useCallback(async (quiet = false) => {
    if (status !== 'online') {
      setPlaybackUrl('');
      setPlaybackError('');
      return;
    }
    if (!quiet) setPlaybackLoading(true);
    try {
      const getGuestPlayback = httpsCallable<{ eventSlug: string }, GuestPlaybackResponse>(functions, 'getMuxPlaybackToken');
      const result = await getGuestPlayback({ eventSlug });
      if (result.data.success && result.data.playbackUrl) {
        setPlaybackUrl(result.data.playbackUrl);
        setPlaybackError('');
      } else {
        setPlaybackUrl('');
        setPlaybackError('The live video is not ready yet. Please try again in a moment.');
      }
    } catch (error) {
      console.error('Could not load the guest livestream:', error);
      const code = (error as { code?: string }).code || '';
      setPlaybackUrl('');
      setPlaybackError(code.includes('unauthenticated') || code.includes('permission-denied')
        ? 'Your guest session is no longer valid. Please re-enter the event PIN.'
        : code.includes('not-found')
          ? 'Live streaming has not been configured for this event.'
          : code.includes('failed-precondition')
            ? 'Mux reports the broadcast as live, but playback is not ready yet. Please retry shortly.'
            : 'Could not connect to the live video. Check your connection and try again.');
    } finally {
      if (!quiet) setPlaybackLoading(false);
    }
  }, [eventSlug, status]);

  useEffect(() => {
    setPlaybackUrl('');
    setPlaybackError('');
    setVideoReady(false);
    setVideoPlaying(false);
    if (status !== 'online') return;
    void refreshPlayback();
    // Guest URLs are short-lived; renew them while the event remains live.
    const timer = window.setInterval(() => void refreshPlayback(true), 3 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [eventSlug, status, refreshPlayback]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playbackUrl || status !== 'online') return;

    let hls: Hls | null = null;
    let cancelled = false;
    let mediaRecoveryAttempts = 0;

    setVideoReady(false);
    setVideoPlaying(false);
    setManualPlayRequired(false);
    setPlaybackError('');

    const startPlayback = async () => {
      if (cancelled) return;
      try {
        video.muted = true;
        video.playsInline = true;
        await video.play();
        if (!cancelled) {
          setVideoPlaying(true);
          setManualPlayRequired(false);
          setPlaybackError('');
        }
      } catch (error) {
        if (cancelled) return;
        console.info('Guest video autoplay requires a user gesture:', error);
        setManualPlayRequired(true);
        setPlaybackError('Tap the play button to start the live broadcast.');
      }
    };

    const handleNativeError = () => {
      if (cancelled) return;
      const mediaError = video.error;
      const source = video.currentSrc;
      console.error('Guest native HLS video error:', {
        code: mediaError?.code,
        message: mediaError?.message,
        currentSrc: source ? source.split('?')[0] : '',
        networkState: video.networkState,
        readyState: video.readyState,
      });
      setVideoPlaying(false);
      setPlaybackError(mediaError?.code === MediaError.MEDIA_ERR_DECODE
        ? 'The browser received the live stream but could not decode the video. Check the encoder video/audio codecs.'
        : mediaError?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
          ? 'This browser cannot decode the live stream format.'
          : 'The live video could not be loaded. Please retry.');
    };

    video.addEventListener('error', handleNativeError);

    if (Hls.isSupported()) {
      console.info('Using HLS.js for Mux playback');
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferLength: 30,
        manifestLoadingMaxRetry: 4,
        levelLoadingMaxRetry: 4,
        fragLoadingMaxRetry: 4,
      });

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        if (!cancelled) hls?.loadSource(playbackUrl);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (cancelled) return;
        console.info('Mux HLS manifest parsed successfully');
        setVideoReady(true);
        setPlaybackError('');
        void startPlayback();
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (cancelled) return;
        const httpStatus = data.response?.code;
        const requestUrl = data.url;
        console.error('Mux HLS error:', {
          type: data.type,
          details: data.details,
          fatal: data.fatal,
          status: httpStatus,
          reason: data.reason,
          url: requestUrl ? requestUrl.split('?')[0] : undefined,
        });

        if (httpStatus === 401 || httpStatus === 403) {
          setPlaybackError('Mux rejected the signed playback URL. Please refresh the live video.');
          setManualPlayRequired(false);
          return;
        }

        if (httpStatus === 404) {
          setPlaybackError('Mux has not published this live video segment yet. Please retry shortly.');
          return;
        }

        if (!data.fatal || cancelled) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls?.startLoad();
          return;
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR && mediaRecoveryAttempts < 2) {
          mediaRecoveryAttempts += 1;
          hls?.recoverMediaError();
          return;
        }
        setVideoPlaying(false);
        setPlaybackError(`Live playback failed (${data.details}). Tap retry to reconnect.`);
      });

      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.info('Using native HLS playback');
      const handleNativeMetadata = () => {
        if (cancelled) return;
        setVideoReady(true);
        void startPlayback();
      };
      video.addEventListener('loadedmetadata', handleNativeMetadata, { once: true });
      video.src = playbackUrl;
      video.load();
    } else {
      setPlaybackError('This browser cannot play HLS video. Please use an up-to-date Chrome, Edge or Safari browser.');
    }

    return () => {
      cancelled = true;
      video.removeEventListener('error', handleNativeError);
      if (hls) hls.destroy();
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [playbackUrl, status]);

  const handleRetryVideo = () => {
    setPlaybackError('');
    setManualPlayRequired(false);
    setVideoReady(false);
    void refreshPlayback();
  };

  const handleManualPlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setManualPlayRequired(false);
      setPlaybackError('');
    } catch (error) {
      console.error('Guest manual playback failed:', error);
      setPlaybackError('Playback is not ready yet. Please retry in a moment.');
    }
  };

  const statusStyles: Record<StreamStatus, string> = {
    online: 'bg-rose-600 text-white',
    offline: 'bg-slate-700 text-white',
    scheduled: 'bg-amber-100 text-amber-900',
    completed: 'bg-emerald-100 text-emerald-800',
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMessage.trim() || !guestName.trim() || isSending) return;
    setIsSending(true);
    setMessageError('');
    try {
      await addDoc(collection(db, 'publicEvents', eventSlug, 'wishes'), {
        guestName: guestName.trim(),
        message: newMessage.trim(),
        likes: 0,
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Could not send live guest message:', error);
      setMessageError('Could not send your message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      <section className="bg-gradient-to-r from-[#410015] to-[#790020] px-5 py-5 text-white">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <MdLiveTv className="text-lg text-rose-300" /> Wedding broadcast
        </div>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold">{wedding.title}</h1>
            <p className="mt-1 text-xs text-white/70">Join family and friends for the celebration</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${statusStyles[status]}`}>
            {status === 'online' ? 'Online' : status}
          </span>
        </div>
      </section>

      <section className="relative aspect-video w-full overflow-hidden bg-[#16080d]">
        {status === 'online' ? (
          <>
            {playbackUrl ? (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  controls
                  preload="auto"
                  className="h-full w-full bg-black object-contain"
                  onLoadedMetadata={() => setVideoReady(true)}
                  onCanPlay={() => setVideoReady(true)}
                  onPlaying={() => { setVideoReady(true); setVideoPlaying(true); setManualPlayRequired(false); setPlaybackError(''); }}
                  onPlay={() => setVideoPlaying(true)}
                  onPause={() => setVideoPlaying(false)}
                  aria-label={`Live wedding broadcast for ${wedding.title}`}
                />
                {!videoReady && !playbackError && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/35 text-white" role="status" aria-live="polite">
                    <span className="h-9 w-9 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                    <span className="rounded-full bg-black/70 px-4 py-2 text-xs font-bold">Preparing live video…</span>
                  </div>
                )}
                {manualPlayRequired && (
                  <button type="button" onClick={() => void handleManualPlay()} className="absolute inset-0 flex items-center justify-center bg-black/30 text-white" aria-label="Play live broadcast">
                    <span className="rounded-full bg-rose-600 px-5 py-3 text-sm font-bold shadow-lg">▶ Play live broadcast</span>
                  </button>
                )}
                {playbackError && (
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-xl bg-black/85 p-3 text-xs text-amber-200" role="status" aria-live="polite">
                    <span className="min-w-0">{playbackError}</span>
                    <button type="button" onClick={handleRetryVideo} className="shrink-0 rounded-lg bg-rose-600 px-3 py-2 font-bold text-white">Retry</button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/10"><MdLiveTv className="text-3xl text-rose-300" /></div>
                <p className="text-sm font-bold">{playbackLoading ? 'Connecting to the broadcast…' : 'The broadcast is live'}</p>
                <p className="mt-1 max-w-sm text-xs text-white/60">{playbackError || 'Preparing the live video player. Please wait a moment.'}</p>
                {!playbackLoading && <button type="button" onClick={() => void refreshPlayback()} className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700">Retry video</button>}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <MdLiveTv className="text-3xl text-rose-300" />
            </div>
            {status === 'scheduled' ? (
              <>
                <p className="text-sm font-bold">The stream starts in</p>
                <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-rose-200">
                  {scheduledDate ? formatCountdown(scheduledDate.getTime() - now) : 'Coming soon'}
                </p>
                {scheduledDate && <p className="mt-2 text-xs text-white/60">{scheduledDate.toLocaleString()}</p>}
              </>
            ) : status === 'completed' ? (
              <>
                <p className="text-sm font-bold">This live stream has ended</p>
                <p className="mt-1 text-xs text-white/60">Thanks for celebrating with the couple.</p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold">The stream is currently offline</p>
                <p className="mt-1 text-xs text-white/60">Please check back when the broadcast begins.</p>
              </>
            )}
          </div>
        )}
        {status === 'online' && wedding.liveViewersCount > 0 && (
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white">
            <FiUsers /> {wedding.liveViewersCount.toLocaleString()} watching
          </span>
        )}
      </section>

      <section className="space-y-4 p-4">
        <div className="flex items-center justify-between rounded-2xl border border-[#F0E6E9] bg-white p-4 shadow-sm">
          <div>
            <p className="text-sm font-bold text-[#171717]">{status === 'online' ? 'Live now' : status === 'completed' ? 'Broadcast complete' : status === 'scheduled' ? 'Coming up' : 'Broadcast offline'}</p>
            <p className="mt-1 text-xs text-[#77727A]">{status === 'online' ? `Streaming by ${wedding.studioName}` : scheduledDate?.toLocaleDateString() || 'Updates will appear here'}</p>
          </div>
          <span className={`h-2.5 w-2.5 rounded-full ${status === 'online' ? 'animate-pulse bg-rose-500' : status === 'scheduled' ? 'bg-amber-400' : status === 'completed' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
        </div>

        <div className="rounded-3xl border border-[#F0E6E9] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Messages from guests</h2>
              <p className="mt-0.5 text-[11px] text-[#77727A]">Share a note or blessing with the couple</p>
            </div>
            <FiHeart className="text-lg text-[#EF1735]" />
          </div>

          <form onSubmit={handleSendMessage} className="mb-4 flex gap-2">
            <input
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              maxLength={500}
              placeholder="Write a message..."
              aria-label="Write a message to the couple"
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-[#EF1735]"
            />
            <button type="submit" disabled={isSending || !guestName.trim() || !newMessage.trim()} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EF1735] text-white shadow disabled:opacity-50">
              <FiSend />
            </button>
          </form>

          {messageError && <p role="status" className="mb-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">{messageError}</p>}
          <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
            {messages.map((message) => (
              <article key={message.id} className="rounded-xl border border-[#F0E6E9] bg-[#FFFDFE] p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#790020]">{message.user}</span>
                  <time className="shrink-0 text-[10px] text-gray-400">{message.time}</time>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-gray-700">{message.text}</p>
              </article>
            ))}
            {messages.length === 0 && !messageError && (
              <p className="rounded-xl border border-dashed border-[#F0E6E9] p-5 text-center text-xs text-gray-500">Be the first to send the couple a message.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
