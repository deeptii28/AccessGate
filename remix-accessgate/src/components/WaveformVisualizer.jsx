import React, { useEffect, useState } from 'react';

/**
 * WaveformVisualizer - Real-time animated waveform for audio, haptic pulses, and touch rhythm
 * Provides dynamic visual feedback during rhythm playback, tapping, and voice capture.
 */
export default function WaveformVisualizer({
  state = 'idle', // 'idle' | 'playing' | 'recording' | 'listening' | 'evaluating'
  tapTrigger = 0, // Incremented on each tap to pulse the wave
  barCount = 20,
  accentColor = '#C9962F',
  secondaryColor = '#3E1220',
  label = 'Rhythm Resonance Visualizer',
}) {
  const [pulseIndices, setPulseIndices] = useState([]);

  // Trigger ripple effect when a tap occurs
  useEffect(() => {
    if (tapTrigger > 0) {
      // Pick random bars to surge
      const center = Math.floor(barCount / 2);
      const active = [center - 2, center - 1, center, center + 1, center + 2];
      setPulseIndices(active);
      const timer = setTimeout(() => setPulseIndices([]), 280);
      return () => clearTimeout(timer);
    }
  }, [tapTrigger, barCount]);

  return (
    <div
      className="w-full flex flex-col items-center py-2"
      role="img"
      aria-label={`${label}: ${state} state`}
    >
      <div className="flex items-end justify-center gap-1 sm:gap-1.5 h-12 sm:h-14 w-full max-w-xs px-2">
        {Array.from({ length: barCount }).map((_, i) => {
          // Calculate animated height based on state
          const isPulsed = pulseIndices.includes(i);
          const distFromCenter = Math.abs(i - Math.floor(barCount / 2));
          const baseNormalized = 1 - distFromCenter / (barCount / 2);

          let heightPct = 15;
          let animClass = '';
          let opacity = 0.4;

          if (state === 'playing') {
            // Dancing rhythm pattern
            heightPct = Math.max(25, (Math.sin((i + Date.now() / 150) * 0.8) * 0.5 + 0.5) * 85 * (0.5 + baseNormalized * 0.5));
            animClass = 'transition-all duration-150';
            opacity = 0.9;
          } else if (state === 'recording' || isPulsed) {
            // Responsive to taps
            if (isPulsed) {
              heightPct = Math.min(100, 50 + (1 - distFromCenter / 4) * 50);
              opacity = 1;
            } else {
              heightPct = Math.max(18, 20 + Math.sin(i * 1.2) * 15);
              opacity = 0.65;
            }
            animClass = 'transition-all duration-100';
          } else if (state === 'listening') {
            // Voice speech active wave
            heightPct = Math.max(20, (Math.cos((i * 1.5) + (i % 3)) * 0.4 + 0.6) * 90);
            animClass = 'transition-all duration-120';
            opacity = 0.95;
          } else if (state === 'evaluating') {
            // Scanning wave
            heightPct = Math.max(20, Math.sin(i * 0.5) * 35 + 45);
            animClass = 'animate-pulse duration-300';
            opacity = 0.85;
          } else {
            // Idle ambient breathing
            heightPct = Math.max(12, 14 + Math.sin(i * 0.6) * 12 * baseNormalized);
            animClass = 'transition-all duration-500';
            opacity = 0.35;
          }

          return (
            <div
              key={i}
              className={`w-1 sm:w-1.5 rounded-full ${animClass}`}
              style={{
                height: `${Math.round(heightPct)}%`,
                backgroundColor: isPulsed ? '#3E1220' : (i % 2 === 0 ? accentColor : secondaryColor),
                opacity: isPulsed ? 1 : opacity,
                transform: isPulsed ? 'scaleY(1.15)' : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Micro Status Tag */}
      <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mt-1.5">
        {state === 'playing'
          ? 'Pattern Vibration Active'
          : state === 'recording'
          ? 'Live Rhythm Capture'
          : state === 'listening'
          ? 'Acoustic Audio Stream Active'
          : state === 'evaluating'
          ? 'Evaluating Neural Timing'
          : 'Resonance Idle'}
      </span>
    </div>
  );
}
