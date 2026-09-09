import React, { useState, useRef, useEffect } from 'react';
import { Hand, RotateCcw, CheckCircle, Volume2, Sparkles } from 'lucide-react';
import { playAudioPulse } from '../utils/verification';

export default function TapCapture({
  targetTapCount,
  onCompleteTaps,
  isRecording,
  audioFeedback,
  voiceAnnounce,
}) {
  const [tapTimestamps, setTapTimestamps] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const [lastTapInterval, setLastTapInterval] = useState(null);
  const tapButtonRef = useRef(null);

  // Auto-submit when target tap count is reached
  useEffect(() => {
    if (tapTimestamps.length > 0 && tapTimestamps.length === targetTapCount) {
      voiceAnnounce(`All ${targetTapCount} taps captured. Analyzing rhythm and timing...`);
      // Small debounce before triggering analysis
      const timer = setTimeout(() => {
        onCompleteTaps(tapTimestamps);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [tapTimestamps, targetTapCount, onCompleteTaps, voiceAnnounce]);

  const handleTap = (e) => {
    // Prevent default scrolling on touch devices
    if (e && e.cancelable && e.type.startsWith('touch')) {
      e.preventDefault();
    }

    if (!isRecording) return;
    if (tapTimestamps.length >= targetTapCount) return;

    const now = performance.now();
    const prevTime = tapTimestamps[tapTimestamps.length - 1];
    if (prevTime) {
      setLastTapInterval(Math.round(now - prevTime));
    }

    const updated = [...tapTimestamps, now];
    setTapTimestamps(updated);

    // Audio click feedback
    if (audioFeedback) {
      playAudioPulse(80, 600);
    }

    // Gentle tactile feedback on actual device if available
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(30);
      } catch (err) {}
    }

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 120);

    // Announce count
    voiceAnnounce(`Tap ${updated.length} of ${targetTapCount}`);
  };

  const handleReset = (e) => {
    if (e) e.stopPropagation();
    setTapTimestamps([]);
    setLastTapInterval(null);
    voiceAnnounce('Taps reset. Ready for your rhythm input.');
    if (tapButtonRef.current) {
      tapButtonRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    // Space or Enter triggers tap
    if (e.code === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      handleTap(e);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Live Tap Counter Badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3E1220]/5 border border-[#E8DDC7] text-[#3E1220] text-sm font-extrabold mb-4"
        aria-live="polite"
      >
        <Hand className="w-4 h-4 text-[#C9962F]" aria-hidden="true" />
        <span>
          Taps Recorded: <span className="text-[#C9962F] font-mono text-base">{tapTimestamps.length}</span> / {targetTapCount}
        </span>
      </div>

      {/* Primary Accessible Touch Target */}
      <button
        ref={tapButtonRef}
        type="button"
        id="rhythm-tap-button"
        disabled={!isRecording || tapTimestamps.length >= targetTapCount}
        onPointerDown={handleTap}
        onKeyDown={handleKeyDown}
        className={`tap-touch-target w-full max-w-md h-52 sm:h-64 rounded-3xl border-4 transition-all duration-100 flex flex-col items-center justify-center p-6 text-center select-none shadow-md ${
          !isRecording
            ? 'bg-stone-100 border-stone-300 text-stone-400 cursor-not-allowed opacity-75'
            : isPressed
            ? 'bg-[#C9962F] border-[#3E1220] text-[#3E1220] scale-[0.98] shadow-inner'
            : 'bg-white border-[#C9962F] text-[#3E1220] hover:bg-[#FAF6EE] cursor-pointer shadow-lg active:scale-98'
        }`}
        aria-label={`Accessible Rhythm Tap Surface. Taps recorded: ${tapTimestamps.length} of ${targetTapCount}. Tap here or press Spacebar to reproduce the pattern.`}
      >
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4 transition-transform ${
            isPressed
              ? 'bg-[#3E1220] text-[#C9962F] scale-110'
              : 'bg-[#FAF6EE] text-[#C9962F] border-2 border-[#E8DDC7]'
          }`}
          aria-hidden="true"
        >
          <Hand className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#3E1220]">
          {tapTimestamps.length >= targetTapCount
            ? 'Pattern Captured!'
            : isRecording
            ? 'TAP THE RHYTHM HERE'
            : 'Waiting for pattern playback...'}
        </span>

        <span className="text-xs text-stone-600 mt-2 font-semibold">
          Touch anywhere on this card, or press <kbd className="px-2 py-0.5 bg-stone-100 border border-stone-300 rounded-md font-mono text-[11px]">Space</kbd> / <kbd className="px-2 py-0.5 bg-stone-100 border border-stone-300 rounded-md font-mono text-[11px]">Enter</kbd>
        </span>
      </button>

      {/* Real-time Tap Pip Dots */}
      <div
        className="flex items-center gap-3 mt-5"
        role="group"
        aria-label={`Visual tap status: ${tapTimestamps.length} of ${targetTapCount} tapped`}
      >
        {Array.from({ length: targetTapCount }).map((_, idx) => {
          const isFilled = idx < tapTimestamps.length;
          return (
            <div
              key={idx}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all border-2 ${
                isFilled
                  ? 'bg-[#C9962F] border-[#3E1220] scale-110 shadow-xs'
                  : 'bg-white border-[#E8DDC7]'
              }`}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Manual Controls */}
      <div className="flex items-center gap-3 mt-6">
        <button
          type="button"
          onClick={handleReset}
          disabled={tapTimestamps.length === 0}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
            tapTimestamps.length > 0
              ? 'border-[#3E1220] text-[#3E1220] hover:bg-[#3E1220]/5'
              : 'border-stone-200 text-stone-400 cursor-not-allowed'
          }`}
          aria-label="Reset recorded taps"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Clear & Re-tap
        </button>

        {tapTimestamps.length > 1 && tapTimestamps.length < targetTapCount && (
          <button
            type="button"
            onClick={() => onCompleteTaps(tapTimestamps)}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#C9962F] text-[#3E1220] hover:bg-[#b58525] transition-colors"
          >
            Submit Partial Taps ({tapTimestamps.length})
          </button>
        )}
      </div>
    </div>
  );
}
