
import React, { useState } from 'react';
import { MdOutlineKey } from 'react-icons/md';
import { FiArrowRight, FiShield } from 'react-icons/fi';
import confetti from 'canvas-confetti';

interface GuestEntryScreenProps {
  onEnterEvent: (pin: string) => Promise<void>;
}

export const GuestEntryScreen: React.FC<GuestEntryScreenProps> = ({
  onEnterEvent,
}) => {
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanPin = pin.replace(/\D/g, '').slice(0, 6);

    if (!/^\d{6}$/.test(cleanPin)) {
      setErrorMessage('Enter the 6-digit PIN provided by the studio.');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Parent handler must use Firebase httpsCallable().
      await onEnterEvent(cleanPin);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#EF1735', '#FDE68A', '#790020'],
      });
    } catch (error: unknown) {
      console.error('Guest authentication failed:', error);

      const firebaseError = error as {
        code?: string;
        message?: string;
      };

      const code = firebaseError?.code || '';

      const errorMessages: Record<string, string> = {
        'functions/unauthenticated': 'Invalid PIN. Please check and try again.',
        'functions/not-found': 'This wedding event is no longer available.',
        'functions/resource-exhausted': 'Too many attempts. Please try again later.',
        'functions/permission-denied': 'Access denied for this event.',
        'functions/unavailable': 'Service temporarily unavailable. Please try again.',
        'functions/internal': 'Server error. Please try again later.',
        'functions/deadline-exceeded': 'Request timed out. Please try again.',
        'functions/invalid-argument': 'Invalid PIN. Please enter a valid 6-digit PIN.',
      };

      setErrorMessage(
        errorMessages[code] ||
        firebaseError?.message ||
        'Could not validate this event PIN. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FFFDFE] flex flex-col justify-between p-4 pb-8 animate-in fade-in duration-300 select-none">

      <div className="guest-flower-layer" aria-hidden="true">
        <div className="guest-flower guest-flower-one">
          <span /><span /><span /><span /><span /><i />
        </div>
        <div className="guest-flower guest-flower-two">
          <span /><span /><span /><span /><span /><i />
        </div>
        <div className="guest-flower guest-flower-three">
          <span /><span /><span /><span /><span /><i />
        </div>
        <div className="guest-flower guest-flower-four">
          <span /><span /><span /><span /><span /><i />
        </div>
      </div>

      <div className="relative z-10">
        <div className="pt-6 pb-4 flex flex-col items-center text-center">

          <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 mb-3.5 bg-black">
            <img
              src="/app-icon.png"
              alt="ON AIR App Icon"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-xl font-black tracking-tight text-[#171717] font-sans flex items-center gap-1.5">
            <span>ON AIR</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF1735]" />
            <span className="text-[#790020] font-bold text-lg">
              Wedding Stories
            </span>
          </h1>

          <p className="text-xs text-[#77727A] max-w-xs mt-1">
            Enter the event PIN provided by the studio to access its wedding stories.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-5 border border-[#F0E6E9] shadow-sm space-y-4"
        >
          <div>
            <label
              htmlFor="guest-event-pin"
              className="text-xs font-bold text-gray-700 block mb-1"
            >
              Event PIN
            </label>

            <div className="relative">
              <MdOutlineKey className="absolute left-3 top-3 text-gray-400 text-sm" />

              <input
                id="guest-event-pin"
                type="text"
                required
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                autoComplete="one-time-code"
                value={pin}
                disabled={isSubmitting}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 6);

                  setPin(value);
                  setErrorMessage('');
                }}
                placeholder="Enter 6-digit PIN"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-mono font-bold tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#EF1735] text-gray-900 disabled:opacity-60"
              />
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="text-xs text-red-600 font-medium bg-red-50 border border-red-100 rounded-xl p-3"
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || pin.length !== 6}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#EF1735] via-[#D60A28] to-[#790020] text-white text-xs font-bold shadow-lg hover:shadow-xl active:scale-95 transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>
              {isSubmitting ? 'Verifying PIN…' : 'Enter Wedding Stories'}
            </span>

            <FiArrowRight className="text-sm" />
          </button>
        </form>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-1.5 text-[11px] text-[#77727A] pt-4">
        <FiShield className="text-xs text-[#EF1735]" />
        <span>Secure guest authentication by ON AIR Studio</span>
      </div>

    </div>
  );
};
