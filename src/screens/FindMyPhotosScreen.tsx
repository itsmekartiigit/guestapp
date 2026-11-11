
import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { httpsCallable } from 'firebase/functions';
import { FiCamera, FiUpload, FiRefreshCw, FiCheck, FiArrowRight } from 'react-icons/fi';
import { MdOutlineDocumentScanner } from 'react-icons/md';
import { BsCpu } from 'react-icons/bs';
import { AIPhotoMatchResponse } from '../types';
import { functions } from '../firebase';

interface FindMyPhotosScreenProps {
  eventId: string;
  onSuccessMatch: (result: AIPhotoMatchResponse) => void;
}

export const FindMyPhotosScreen: React.FC<FindMyPhotosScreenProps> = ({
  eventId,
  onSuccessMatch,
}) => {
  const [mode, setMode] = useState<
    'idle' | 'camera' | 'preview' | 'processing' | 'success'
  >('idle');

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(
    'Connecting to secure matching service...'
  );
  const [matchResult, setMatchResult] =
    useState<AIPhotoMatchResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const resetPreview = () => {
    setCapturedImage(null);
    setConsentGiven(false);
    setErrorMessage('');
    setMatchResult(null);
    setProgress(0);
    setMode('idle');
  };

  const startCamera = async () => {
    try {
      setErrorMessage('');
      setMode('camera');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      stopCamera();
      setMode('idle');
      setErrorMessage('Camera unavailable. Please upload a selfie instead.');
      fileInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 480;
    canvas.height = videoRef.current.videoHeight || 480;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      setCapturedImage(dataUrl);
      setConsentGiven(false);
      setErrorMessage('');
      setMode('preview');
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Allow selecting the same file again later.
    e.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Please choose an image smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCapturedImage(event.target.result);
        setConsentGiven(false);
        setErrorMessage('');
        setMode('preview');
      }
    };

    reader.onerror = () => {
      setErrorMessage('Unable to read this image. Please try another one.');
    };

    reader.readAsDataURL(file);
  };

  const handleStartMatching = async () => {
    if (!capturedImage || !consentGiven || !eventId) return;

    setMode('processing');
    setProgress(10);
    setErrorMessage('');
    setStatusMessage('Securely submitting your selfie...');

    try {
      // This callable must be implemented and deployed in Cloud Functions.
      const searchGuestPhotos = httpsCallable<
        {
          selfieBase64: string;
          consentAccepted: boolean;
        },
        AIPhotoMatchResponse
      >(functions, 'searchGuestPhotos');

      setProgress(30);
      setStatusMessage('Searching photos from your event...');

      const response = await searchGuestPhotos({
        selfieBase64: capturedImage,
        consentAccepted: consentGiven,
      });

      const data = response.data;

      if (
        !data ||
        data.success !== true ||
        !Array.isArray(data.photos)
      ) {
        throw new Error('The matching service returned an invalid response.');
      }

      const verifiedResult: AIPhotoMatchResponse = {
        ...data,
        matchCount: data.photos.length,
        selfieUrl: capturedImage,
      };

      setProgress(100);
      setStatusMessage('Matching completed.');

      setMatchResult(verifiedResult);
      setMode('success');

      if (verifiedResult.photos.length > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EF1735', '#FDE68A', '#790020', '#16A34A'],
        });
      }
    } catch (error: any) {
      console.error('AI photo matching failed:', error);

      const message =
        error?.code === 'functions/not-found'
          ? 'The AI matching service has not been deployed yet.'
          : error?.code === 'functions/unauthenticated'
          ? 'Your event session has expired. Please enter the event again.'
          : error?.code === 'functions/permission-denied'
          ? 'You are not authorized to search this event.'
          : error?.message || 'Unable to find your photos. Please try again.';

      setErrorMessage(message);
      setProgress(0);
      setMode('preview');
    }
  };

  const handleFinishAndNavigate = () => {
    if (matchResult) {
      onSuccessMatch(matchResult);
    }
  };

  return (
    <div className="pb-24 px-4 pt-4 animate-in fade-in duration-300">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        capture="user"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Screen Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#EF1735] to-[#790020] text-white shadow-lg shadow-[#EF1735]/25 mb-3">
          <MdOutlineDocumentScanner className="text-3xl" />
        </div>

        <h2 className="text-xl font-black text-[#171717] tracking-tight">
          Find Your Photos
        </h2>

        <p className="text-xs text-[#77727A] max-w-xs mx-auto mt-1">
          Upload your selfie to discover your personal wedding moments using AI face recognition.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* IDLE */}
      {mode === 'idle' && (
        <div className="bg-white rounded-3xl p-6 border border-[#F0E6E9] shadow-sm text-center">
          <div className="w-44 h-52 mx-auto rounded-2xl bg-[#FFF0F3] border-2 border-dashed border-[#EF1735]/40 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="w-24 h-24 rounded-full border-2 border-[#EF1735] border-dashed flex items-center justify-center text-[#EF1735] mb-2 bg-white/60">
              <FiCamera className="text-3xl" />
            </div>

            <span className="text-[11px] font-bold text-[#790020]">
              Position Face In Center
            </span>

            <span className="text-[9.5px] text-[#77727A] mt-0.5">
              Clear lighting &amp; no sunglasses
            </span>
          </div>

          <div className="space-y-3 mt-6">
            <button
              onClick={startCamera}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#EF1735] to-[#790020] text-white font-bold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2"
            >
              <FiCamera className="text-base" />
              <span>Take Live Selfie</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 px-4 rounded-2xl bg-white border border-[#F0E6E9] text-[#171717] font-bold text-xs shadow-sm hover:bg-gray-50 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <FiUpload className="text-base text-[#EF1735]" />
              <span>Upload From Gallery</span>
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#77727A]">
            <BsCpu className="text-sm text-[#EF1735]" />
            <span>Secure event-specific photo matching</span>
          </div>
        </div>
      )}

      {/* CAMERA */}
      {mode === 'camera' && (
        <div className="bg-black rounded-3xl overflow-hidden shadow-xl border border-gray-800 text-center relative p-3">
          <div className="relative aspect-square max-w-[320px] mx-auto rounded-2xl overflow-hidden bg-neutral-900">
            <video
              ref={videoRef}
              playsInline
              muted
              onError={(e) => e.preventDefault()}
              className="w-full h-full object-cover transform -scale-x-100"
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[68%] h-[82%] border-2 border-white/60 rounded-[50%] border-dashed shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-5 mb-2">
            <button
              onClick={() => {
                stopCamera();
                setMode('idle');
              }}
              className="px-4 py-2 rounded-xl bg-white/20 text-white text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full border-4 border-white bg-[#EF1735] flex items-center justify-center text-white shadow-xl active:scale-90 transition"
              aria-label="Capture photo"
            >
              <div className="w-6 h-6 rounded-full bg-white" />
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW AND CONSENT */}
      {mode === 'preview' && capturedImage && (
        <div className="bg-white rounded-3xl p-5 border border-[#F0E6E9] shadow-sm text-center">
          <div className="relative w-52 h-52 mx-auto rounded-3xl overflow-hidden shadow-lg border-2 border-white bg-gray-100 mb-4">
            <img
              src={capturedImage}
              alt="Preview selfie"
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="text-sm font-bold text-[#171717]">
            Looks good?
          </h3>

          <p className="text-xs text-[#77727A] mt-0.5 mb-5">
            Confirm your selfie to search for your wedding photos.
          </p>

          {/* Required single consent checkbox */}
          <label className="flex items-start gap-2.5 text-left rounded-xl border border-[#F0E6E9] bg-[#FFF9FA] p-3 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#EF1735] cursor-pointer"
            />

            <span className="text-xs leading-relaxed text-[#444]">
              I have read and agree to the processing of my selfie and facial data for finding my event photos.
            </span>
          </label>

          <div className="space-y-2.5">
            <button
              onClick={handleStartMatching}
              disabled={!consentGiven}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#EF1735] to-[#790020] text-white font-bold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <BsCpu className="text-base" />
              <span>Confirm &amp; Search Photos</span>
            </button>

            <button
              onClick={resetPreview}
              className="w-full py-3 px-4 rounded-2xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 active:scale-95 transition"
            >
              Retake / Upload Another
            </button>
          </div>
        </div>
      )}

      {/* PROCESSING */}
      {mode === 'processing' && (
        <div className="bg-white rounded-3xl p-6 border border-[#F0E6E9] shadow-md text-center">
          <div className="relative w-48 h-48 mx-auto rounded-3xl overflow-hidden shadow-inner border border-gray-200 mb-4 bg-black">
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Processing selfie"
                className="w-full h-full object-cover opacity-75"
              />
            )}

            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#EF1735] to-transparent shadow-[0_0_15px_#EF1735] animate-radar-scan" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-32 border border-[#EF1735]/60 rounded-2xl relative">
                <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#EF1735]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#EF1735]" />
                <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#EF1735]" />
                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#EF1735]" />
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-[#171717]">
            {statusMessage}
          </h3>

          <div className="w-full bg-gray-100 rounded-full h-2.5 my-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#EF1735] to-[#790020] h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-[#77727A]">
            <FiRefreshCw className="animate-spin text-[#EF1735]" />
            <span>Waiting for matching service...</span>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {mode === 'success' && matchResult && (
        <div className="bg-white rounded-3xl p-6 border border-[#BBF7D0] shadow-xl text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm">
            <FiCheck className="stroke-[3]" />
          </div>

          <h3 className="text-lg font-black text-[#171717]">
            {matchResult.matchCount > 0 ? 'Match Found!' : 'Search Complete'}
          </h3>

          <p className="text-xs text-gray-600 mt-1">
            {matchResult.matchCount > 0
              ? `We discovered ${matchResult.matchCount} matching photos from this wedding.`
              : 'No matching photos were found. You can try another selfie.'}
          </p>

          {matchResult.matchCount > 0 && (
            <div className="my-5 relative w-28 h-28 mx-auto rounded-2xl overflow-hidden border-4 border-[#16A34A] shadow-lg">
              <img
                src={capturedImage || ''}
                alt="Your selfie"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {matchResult.matchCount > 0 ? (
            <button
              onClick={handleFinishAndNavigate}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#EF1735] to-[#790020] text-white font-bold text-xs shadow-lg hover:shadow-xl active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>View My Photos</span>
              <FiArrowRight className="text-base" />
            </button>
          ) : (
            <button
              onClick={resetPreview}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#EF1735] to-[#790020] text-white font-bold text-xs"
            >
              Try Another Selfie
            </button>
          )}
        </div>
      )}
    </div>
  );
};
