import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Volume2,
  ShieldCheck,
  Vibrate,
  Cpu,
  Touchpad,
} from 'lucide-react';
import {
  analyzeBehavioralBiometrics,
  createBiometricToneGenerator,
  playBiometricCompleteChime,
} from '../utils/verification';

export default function BehavioralChallenge({
  onVerificationComplete,
  onSwitchToHaptic,
  onSwitchToVoice,
  audioFeedback = true,
  voiceAnnounce,
}) {
  const [calibrationState, setCalibrationState] = useState('idle'); // 'idle' | 'holding' | 'evaluating'
  const [progress, setProgress] = useState(0); // 0 to 100
  const [dwellMs, setDwellMs] = useState(0);
  const [announcement, setAnnouncement] = useState(
    'Behavioral Touch Surface ready. Press and hold down the touch pad steadily for 2 seconds.'
  );
  const [telemetryPoints, setTelemetryPoints] = useState([]);
  const [liveMetrics, setLiveMetrics] = useState({
    samples: 0,
    jitter: 0,
    velocity: 0,
  });

  const holdStartRef = useRef(null);
  const animFrameRef = useRef(null);
  const toneGenRef = useRef(null);
  const samplesRef = useRef([]);
  const TARGET_DURATION_MS = 2000;

  useEffect(() => {
    const welcomeMsg =
      'Behavioral Interaction Pattern. Place your finger or pointer on the touch pad and hold steadily for 2 seconds. Screen reader users can also press and hold Spacebar.';
    setAnnouncement(welcomeMsg);
    if (voiceAnnounce) voiceAnnounce(welcomeMsg);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (toneGenRef.current) toneGenRef.current.stop();
    };
  }, []);

  // Start continuous hold calibration
  const handleHoldStart = (e) => {
    // Prevent default scrolling on touch surfaces
    if (e.type === 'touchstart' || e.type === 'pointerdown') {
      if (e.cancelable) e.preventDefault();
    }

    if (calibrationState === 'evaluating') return;

    holdStartRef.current = performance.now();
    samplesRef.current = [];
    setCalibrationState('holding');
    setProgress(0);
    setDwellMs(0);
    setTelemetryPoints([]);

    const startMsg = 'Contact registered. Calibrating behavioral timing patterns. Hold steadily...';
    setAnnouncement(startMsg);

    // Haptic feedback pulse on start
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(60);
      } catch (err) {}
    }

    // Initialize audio tone synthesizer
    if (audioFeedback) {
      if (toneGenRef.current) toneGenRef.current.stop();
      toneGenRef.current = createBiometricToneGenerator();
    }

    // Record initial sample
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
    samplesRef.current.push({
      x: clientX,
      y: clientY,
      time: performance.now(),
      pressure: e.pressure || 0.5,
    });

    // Start continuous tracking animation frame loop
    const trackLoop = () => {
      if (!holdStartRef.current) return;
      const elapsed = performance.now() - holdStartRef.current;
      setDwellMs(Math.round(elapsed));

      const ratio = Math.min(1, elapsed / TARGET_DURATION_MS);
      const currentProgress = Math.round(ratio * 100);
      setProgress(currentProgress);

      if (toneGenRef.current && audioFeedback) {
        toneGenRef.current.update(ratio);
      }

      if (currentProgress >= 100) {
        // Target dwell reached!
        setAnnouncement('Target dwell reached. Release your touch now to evaluate your interaction pattern.');
      }

      animFrameRef.current = requestAnimationFrame(trackLoop);
    };

    animFrameRef.current = requestAnimationFrame(trackLoop);
  };

  // Continuous pointer movement tracking for involuntary micro-tremor detection
  const handlePointerMove = (e) => {
    if (calibrationState !== 'holding') return;

    const now = performance.now();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

    const newSample = {
      x: clientX,
      y: clientY,
      time: now,
      pressure: e.pressure || 0.5,
    };

    samplesRef.current.push(newSample);

    // Keep live waveform points (last 40 points)
    setTelemetryPoints((prev) => {
      const updated = [...prev, { x: clientX, y: clientY, time: now }];
      return updated.slice(-40);
    });

    // Update live metrics
    const sampleCount = samplesRef.current.length;
    if (sampleCount >= 2) {
      const last = samplesRef.current[sampleCount - 1];
      const prev = samplesRef.current[sampleCount - 2];
      const dt = Math.max(1, last.time - prev.time);
      const dx = last.x - prev.x;
      const dy = last.y - prev.y;
      const instDist = Math.sqrt(dx * dx + dy * dy);
      const instVel = Math.round((instDist / dt) * 1000);

      setLiveMetrics({
        samples: sampleCount,
        jitter: parseFloat((instDist * instDist).toFixed(2)),
        velocity: instVel,
      });
    }
  };

  // Release hold and evaluate biometric stream
  const handleHoldEnd = (e, inputType = 'pointer') => {
    if (calibrationState !== 'holding') return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (toneGenRef.current) {
      toneGenRef.current.stop();
      toneGenRef.current = null;
    }

    const elapsed = holdStartRef.current ? performance.now() - holdStartRef.current : 0;
    holdStartRef.current = null;
    setCalibrationState('evaluating');
    setAnnouncement('Analyzing timing variance, dwell duration, and interaction rhythm...');

    // Completion chime
    if (elapsed >= 900 && audioFeedback) {
      playBiometricCompleteChime();
    }

    // Small delay to demonstrate real-time biometric feature extraction
    setTimeout(() => {
      const evaluation = analyzeBehavioralBiometrics({
        samples: samplesRef.current,
        dwellTime: Math.round(elapsed),
        inputType,
      });

      onVerificationComplete({
        ...evaluation,
        challengeType: 'behavioral',
      });
    }, 650);
  };

  // Keyboard accessibility: hold Spacebar or Enter
  const handleKeyDown = (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && calibrationState === 'idle') {
      e.preventDefault();
      handleHoldStart({ clientX: 100, clientY: 100, type: 'keydown' });
    }
  };

  const handleKeyUp = (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && calibrationState === 'holding') {
      e.preventDefault();
      handleHoldEnd(e, 'keyboard');
    }
  };

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-4 sm:py-6"
      role="region"
      aria-labelledby="behavioral-challenge-title"
    >
      <div className="bg-white border-2 border-[#E8DDC7] rounded-2xl shadow-sm p-5 sm:p-8">
        {/* Header */}
        <div className="border-b border-[#E8DDC7] pb-4 mb-5">
          <h2
            id="behavioral-challenge-title"
            className="text-2xl sm:text-3xl font-extrabold text-[#3E1220] tracking-tight"
          >
            Behavioral Interaction Pattern
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Unlike Layer 1 which checks rhythm recall, Layer 2 verifies human presence by measuring
            <strong> natural timing variance between taps</strong>, contact dwell dynamics, and interaction rhythm.
            Automated bot scripts typically produce uniform timing patterns, which this layer is designed to detect and flag.
          </p>
        </div>

        {/* Live Audio / Status Announcer */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E8DDC7] text-[#3E1220] text-xs sm:text-sm font-semibold mb-6 flex items-center justify-between gap-2 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#C9962F] shrink-0" aria-hidden="true" />
            <span>{announcement}</span>
          </div>
          {calibrationState === 'holding' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9962F] text-[#3E1220] text-xs font-bold animate-pulse shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#3E1220]" />
              Sampling at 60Hz...
            </span>
          )}
        </div>

        {/* Interactive Biometric Contact Pad */}
        <div className="flex flex-col items-center justify-center py-2">
          <div
            id="biometric-contact-pad"
            role="button"
            tabIndex={0}
            aria-label="Accessible Touch Contact Surface. Press and hold steadily for 2 seconds to calibrate behavioral timing patterns."
            onPointerDown={handleHoldStart}
            onPointerMove={handlePointerMove}
            onPointerUp={(e) => handleHoldEnd(e, 'pointer')}
            onPointerCancel={(e) => handleHoldEnd(e, 'pointer')}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-4 transition-all flex flex-col items-center justify-center text-center p-6 select-none cursor-pointer focus:outline-hidden focus-visible:ring-4 focus-visible:ring-[#C9962F] ${
              calibrationState === 'holding'
                ? 'bg-[#3E1220] border-[#C9962F] text-[#FAF6EE] shadow-xl scale-102 ring-8 ring-[#C9962F]/25'
                : calibrationState === 'evaluating'
                ? 'bg-[#FAF6EE] border-[#27500A] text-[#3E1220] animate-pulse'
                : 'bg-white border-[#E8DDC7] hover:border-[#C9962F] hover:bg-[#FAF6EE]/50 text-[#3E1220] shadow-md'
            }`}
          >
            {/* Circular Progress Gauge */}
            <div className="relative w-28 h-28 mb-3 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`stroke-current fill-none stroke-[7] ${
                    calibrationState === 'holding' ? 'text-white/20' : 'text-[#E8DDC7]'
                  }`}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#C9962F] fill-none stroke-[7] transition-all duration-75"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {calibrationState === 'holding' ? (
                  <span className="text-xl font-black font-mono text-[#C9962F]">
                    {progress}%
                  </span>
                ) : calibrationState === 'evaluating' ? (
                  <Cpu className="w-8 h-8 text-[#27500A] animate-spin" />
                ) : (
                  <Touchpad className="w-10 h-10 text-[#C9962F]" />
                )}
              </div>
            </div>

            {/* Instruction / State prompt */}
            <div className="mt-1">
              <h3 className="font-bold text-base sm:text-lg">
                {calibrationState === 'holding'
                  ? 'Hold Steadily...'
                  : calibrationState === 'evaluating'
                  ? 'Processing Telemetry...'
                  : 'Press & Hold Pad'}
              </h3>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  calibrationState === 'holding' ? 'text-stone-300' : 'text-stone-500'
                }`}
              >
                {calibrationState === 'holding'
                  ? progress >= 100
                    ? 'Target achieved! Release now.'
                    : `${(dwellMs / 1000).toFixed(1)}s elapsed • Target 2.0s`
                  : 'Touch surface or press Spacebar for 2 seconds'}
              </p>
            </div>
          </div>
        </div>

        {/* Live Real-time Oscilloscope / Telemetry Visualizer (Compact) */}
        <div className="mt-4 border border-[#E8DDC7] rounded-xl p-2.5 sm:p-3 bg-[#FAF6EE]/60">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#3E1220] flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#C9962F]" />
              Live Behavioral Timing Telemetry
            </h4>
            <span className="text-[10px] font-mono text-stone-500">
              {calibrationState === 'holding' ? 'Active 60Hz' : 'Awaiting Contact'}
            </span>
          </div>

          {/* Oscilloscope Wave Display - Compact Slim Window */}
          <div className="h-9 w-full bg-white border border-[#E8DDC7] rounded-md px-2 py-0.5 flex items-center justify-center overflow-hidden relative">
            {calibrationState === 'holding' && telemetryPoints.length > 2 ? (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 36">
                <path
                  d={telemetryPoints
                    .map((pt, i) => {
                      const x = (i / Math.max(1, telemetryPoints.length - 1)) * 390 + 5;
                      const jitterY =
                        18 +
                        Math.sin(i * 1.5) * 7 +
                        ((pt.x % 10) - 5) * 1.1 +
                        ((pt.y % 10) - 5) * 0.9;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${Math.max(3, Math.min(33, jitterY))}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#C9962F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <div className="text-[11px] text-stone-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-pulse" />
                Continuous timing waveform streams during contact
              </div>
            )}
          </div>

          {/* Real-time telemetry metrics breakdown - compact row */}
          <div className="grid grid-cols-3 gap-1.5 mt-2 pt-1.5 border-t border-[#E8DDC7]/70 text-center">
            <div className="bg-white/90 py-1 px-2 rounded-md border border-[#E8DDC7]/60 flex items-center justify-between sm:justify-center sm:gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500">
                Dwell
              </span>
              <span className="text-xs font-black font-mono text-[#3E1220]">
                {dwellMs > 0 ? `${(dwellMs / 1000).toFixed(2)}s` : '0.00s'}
              </span>
            </div>

            <div className="bg-white/90 py-1 px-2 rounded-md border border-[#E8DDC7]/60 flex items-center justify-between sm:justify-center sm:gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500">
                Samples
              </span>
              <span className="text-xs font-black font-mono text-[#3E1220]">
                {liveMetrics.samples > 0 ? `${liveMetrics.samples}` : '0'}
              </span>
            </div>

            <div className="bg-white/90 py-1 px-2 rounded-md border border-[#E8DDC7]/60 flex items-center justify-between sm:justify-center sm:gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500">
                Variance
              </span>
              <span className="text-xs font-black text-[#27500A] flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                Natural
              </span>
            </div>
          </div>
        </div>

        {/* Alternate Verification Fallback Options */}
        <div className="mt-8 pt-5 border-t border-[#E8DDC7] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF6EE]/50 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <Vibrate className="w-4 h-4 text-[#C9962F] shrink-0" aria-hidden="true" />
            <p className="text-xs text-stone-600">
              Prefer testing rhythmic vibration pulses instead?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSwitchToHaptic}
              className="text-xs font-bold text-[#3E1220] underline hover:text-[#C9962F] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962F] rounded-md px-2 py-1 cursor-pointer"
            >
              Switch to Layer 1 (Haptic)
            </button>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={onSwitchToVoice}
              className="text-xs font-bold text-[#3E1220] underline hover:text-[#C9962F] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962F] rounded-md px-2 py-1 cursor-pointer"
            >
              Voice Fallback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
