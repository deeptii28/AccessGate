import React, { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, Activity, Radio, Sparkles } from 'lucide-react';

/**
 * EvaluationAnticipation - Animated progress ring and calibration sequence
 * Builds a brief, professional moment of anticipation before revealing the verification confidence score.
 */
export default function EvaluationAnticipation({
  onComplete,
  channel = 'haptic', // 'haptic' | 'behavioral' | 'voice'
  durationMs = 1200,
}) {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases = channel === 'behavioral'
    ? [
        'Extracting touch dwell micro-variations...',
        'Checking mechanical timing uniformity...',
        'Cross-referencing biological jitter envelope...',
        'Computing Prototype Confidence Score...',
      ]
    : channel === 'voice'
    ? [
        'Processing acoustic phoneme stream...',
        'Verifying harmonic vocal cadence...',
        'Matching spoken token parameters...',
        'Computing Prototype Confidence Score...',
      ]
    : [
        'Analyzing rhythmic interval deltas (ms)...',
        'Calculating tempo variance and motor jitter...',
        'Filtering automated synthetic scripts...',
        'Computing Prototype Confidence Score...',
      ];

  useEffect(() => {
    const startTime = performance.now();

    const timer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      // Advance phase text
      const nextPhase = Math.min(
        phases.length - 1,
        Math.floor((pct / 100) * phases.length)
      );
      setPhaseIndex(nextPhase);

      if (elapsed >= durationMs) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 150);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [durationMs, onComplete, phases.length]);

  // Circular progress math (radius = 54, circumference = ~339.3)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="max-w-md mx-auto px-4 py-8 text-center"
      role="status"
      aria-live="polite"
      aria-label={`Calibrating verification signals: ${progress}% complete. ${phases[phaseIndex]}`}
    >
      <div className="bg-white border-2 border-[#E8DDC7] rounded-3xl p-8 shadow-sm flex flex-col items-center">
        {/* Animated Progress Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          {/* Pulsing subtle backdrop glow */}
          <div className="absolute inset-0 rounded-full bg-[#FAF6EE] border border-[#E8DDC7] animate-pulse" />

          {/* SVG Radial Ring */}
          <svg className="w-36 h-36 -rotate-90 relative z-10" viewBox="0 0 130 130">
            {/* Background Track */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke="#FAF6EE"
              strokeWidth="8"
              fill="transparent"
              className="text-[#E8DDC7]"
            />
            {/* Animated Progress Stroke */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke="#C9962F"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-75"
            />
          </svg>

          {/* Center Icon & Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="w-10 h-10 rounded-full bg-[#3E1220] text-[#C9962F] flex items-center justify-center mb-0.5 shadow-inner">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-sm font-black font-mono text-[#3E1220]">
              {progress}%
            </span>
          </div>
        </div>

        {/* Header */}
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9962F] block mb-1">
          Verification Pipeline
        </span>
        <h3 className="text-xl font-extrabold text-[#3E1220] tracking-tight">
          Evaluating Interaction Signals
        </h3>

        {/* Dynamic Phase message */}
        <div className="mt-4 p-3 rounded-xl bg-[#FAF6EE] border border-[#E8DDC7] w-full min-h-[52px] flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9962F] animate-ping shrink-0" aria-hidden="true" />
          <p className="text-xs font-mono text-stone-700 font-medium transition-all">
            {phases[phaseIndex]}
          </p>
        </div>

        {/* Subtext */}
        <p className="text-[11px] text-stone-500 mt-4 leading-relaxed">
          Screening natural timing variance to confirm authentic human presence.
        </p>
      </div>
    </div>
  );
}
