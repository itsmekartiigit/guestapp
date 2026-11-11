import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  addDoc,
  collection,
  doc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { GuestWish } from '../types';
import { FiHeart, FiSend, FiCheck, FiUser, FiMessageSquare } from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';

export const WishesScreen: React.FC<{ eventSlug: string }> = ({ eventSlug }) => {
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const wishesQuery = query(
      collection(db, 'publicEvents', eventSlug, 'wishes'),
      orderBy('createdAt', 'desc'),
      limit(50),
    );
    return onSnapshot(
      wishesQuery,
      (snapshot) => {
        setWishes(snapshot.docs.map((wishDoc) => {
          const data = wishDoc.data();
          const date = data.createdAt?.toDate?.();
          return {
            id: wishDoc.id,
            guestName: String(data.guestName || ''),
            message: String(data.message || ''),
            timestamp: date ? date.toLocaleString() : 'Just now',
            likes: Number(data.likes || 0),
          };
        }));
        setErrorMessage('');
      },
      (error) => {
        console.error('Could not load guest wishes from Firebase:', error);
        setErrorMessage('Guest wishes are temporarily unavailable.');
      },
    );
  }, [eventSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'publicEvents', eventSlug, 'wishes'), {
        guestName: guestName.trim(),
        message: message.trim(),
        likes: 0,
        createdAt: serverTimestamp(),
      });
      setGuestName('');
      setMessage('');
      setSuccessToast(true);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#EF1735', '#FDE68A', '#790020'],
      });

      setTimeout(() => setSuccessToast(false), 4000);
    } catch (error) {
      console.error('Could not submit guest wish:', error);
      setErrorMessage('Could not send your wish. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLike = async (id: string) => {
    try {
      await updateDoc(doc(db, 'publicEvents', eventSlug, 'wishes', id), {
        likes: increment(1),
      });
    } catch (error) {
      console.error('Could not like guest wish:', error);
      setErrorMessage('Could not update the like. Please try again.');
    }
  };

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#410015] to-[#790020] text-white px-4 py-4">
        <h2 className="text-base font-bold tracking-tight">Guest Book &amp; Wishes</h2>
        <p className="text-xs text-white/80 mt-0.5">Send your heartfelt blessings to Karthik &amp; Sneha</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Form Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#F0E6E9] shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <IoSparkles className="text-[#EF1735] text-base" />
            <h3 className="text-sm font-bold text-[#171717]">Send Your Blessing</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Your Name / Family
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400 text-xs" />
                <input
                  type="text"
                  required
                  maxLength={50}
                  placeholder="e.g. Suresh &amp; Anita"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#EF1735] text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Your Message / Wishes
              </label>
              <div className="relative">
                <FiMessageSquare className="absolute left-3 top-3 text-gray-400 text-xs" />
                <textarea
                  required
                  maxLength={500}
                  rows={3}
                  placeholder="May your married life be filled with love, laughter, and endless adventures..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#EF1735] text-gray-900 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#EF1735] to-[#790020] text-white font-bold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2"
            >
              <FiSend className="text-xs" />
              <span>{isSubmitting ? 'Sending...' : 'Send Wishes'}</span>
            </button>
          </form>

          {errorMessage && (
            <p role="alert" className="mt-3 rounded-xl bg-red-50 p-2.5 text-xs text-red-700">
              {errorMessage}
            </p>
          )}

          {successToast && (
            <div className="mt-3 p-2.5 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-[#16A34A] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <FiCheck className="text-sm stroke-[3]" />
              <span>Your wish has been published to the couple&apos;s story!</span>
            </div>
          )}
        </div>

        {/* Wishes Feed */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#171717] px-1">
            Recent Blessings ({wishes.length})
          </h3>

          {wishes.map((w) => (
            <div
              key={w.id}
              className="bg-white rounded-2xl p-3.5 border border-[#F0E6E9] shadow-sm text-xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[#790020] text-xs">{w.guestName}</span>
                <span className="text-[10px] text-gray-400">{w.timestamp}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{w.message}</p>
              <div className="flex justify-end mt-2 pt-2 border-t border-gray-50">
                <button
                  onClick={() => toggleLike(w.id)}
                  className="flex items-center gap-1 text-[11px] text-[#EF1735] font-semibold hover:opacity-80 transition"
                >
                  <FiHeart className="text-xs fill-current" />
                  <span>{w.likes}</span>
                </button>
              </div>
            </div>
          ))}
          {wishes.length === 0 && (
            <p className="rounded-2xl border border-dashed border-[#F0E6E9] bg-white p-5 text-center text-xs text-gray-500">
              Be the first to share a blessing.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
