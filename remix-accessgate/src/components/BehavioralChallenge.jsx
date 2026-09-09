import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  ShieldCheck,
  Vibrate,
  Cpu,
} from 'lucide-react';
import {
  IconBehavioralJitter,
  IconTactileTap,
  IconMicroTremor,
} from './CustomIcons';
import {
  analyzeBehavioralBiometrics,
  createBiometricToneGenerator,
  playBiometricCompleteChime,
} from '../utils/verification';
import EvaluationAnticipation from './EvaluationAnticipation';
import WaveformVisualizer from './WaveformVisualizer';

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
  const [pendingEvaluation, setPendingEvaluation] = useState(null);
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
    setAnnouncement('Analyzing timing variance, dwell duration, and interaction rhythm...');

    // Completion chime
    if (elapsed >= 900 && audioFeedback) {
      playBiometricCompleteChime();
    }

    const evaluation = analyzeBehavioralBiometrics({
      samples: samplesRef.current,
      dwellTime: Math.round(elapsed),
      inputType,
    });

    setPendingEvaluation({
      ...evaluation,
      challengeType: 'behavioral',
    });
    setCalibrationState('evaluating');
  };

  const handleAnticipationComplete = () => {
    if (pendingEvaluation) {
      onVerificationComplete(pendingEvaluation);
    }
  };

  if (calibrationState === 'evaluating') {
    return (
      <EvaluationAnticipation
        channel="behavioral"
        durationMs={1300}
        onComplete={handleAnticipationComplete}
      />
    );
  }

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
      <div className="bg-white border-2 border-[#E8DDC7] rounded-3xl shadow-sm p-5 sm:p-8 card-rhythm-texture">
        {/* Header */}
        <div className="border-b border-[#E8DDC7] pb-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3E1220]/5 text-[#3E1220] text-xs font-bold uppercase tracking-wider border border-[#3E1220]/10">
              <IconBehavioralJitter className="w-3.5 h-3.5 text-[#C9962F]" aria-hidden="true" />
              Layer 2: Behavioral Interaction Pattern
            </span>
            <span className="text-xs text-stone-500 font-semibold font-mono">
              Timing Variance • 2s Dwell
            </span>
          </div>

          <h2
            id="behavioral-challenge-title"
            className="text-2xl sm:text-3xl font-black text-[#3E1220] tracking-tight"
          >
            Behavioral Interaction Pattern
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Place your finger or mouse pointer on the pad below and hold it down steadily for 2 seconds.
            This measures your natural timing variance, contact dwell dynamics, and interaction rhythm.
          </p>
        </div>

        {/* Live Status Announcer */}
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
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#C9962F] text-[#3E1220] text-xs font-bold animate-pulse shrink-0">
              Sampling at 60Hz...
            </span>
          )}
        </div>

        {/* Live Waveform in holding state */}
        {calibrationState === 'holding' && (
          <div className="mb-4">
            <WaveformVisualizer state="recording" label="Touch Pressure & Dwell Waveform" />
          </div>
        )}

        {/* Interactive Contact Pad */}
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
            className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-4 transition-all flex flex-col items-center justify-center text-center p-6 select-none cursor-pointer focus:outline-hidden focus-visible:ring-4 focus-visible:ring-[#C9962F] overflow-hidden ${
              calibrationState === 'holding'
                ? 'bg-[#3E1220] border-[#C9962F] text-[#FAF6EE] shadow-xl scale-102 ring-8 ring-[#C9962F]/25'
                : 'bg-white border-[#E8DDC7] hover:border-[#C9962F] hover:bg-[#FAF6EE]/50 text-[#3E1220] shadow-md'
            }`}
          >
            {/* Pulsing Radar Ring in Idle state */}
            {calibrationState === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <div className="w-36 h-36 rounded-full border border-[#C9962F]/40 animate-radar" />
                <div className="w-48 h-48 rounded-full border border-[#C9962F]/20 animate-radar-delayed" />
              </div>
            )}

            {/* Circular Progress Gauge */}
            <div className="relative w-28 h-28 mb-3 flex items-center justify-center z-10">
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
                ) : (
                  <div className="w-12 h-12 rounded-2xl art-icon-badge flex items-center justify-center">
                    <IconTactileTap className="w-7 h-7 text-[#C9962F]" />
                  </div>
                )}
              </div>
            </div>

            {/* Instruction / State prompt */}
            <div className="mt-1 z-10">
              <h3 className="font-bold text-base sm:text-lg">
                {calibrationState === 'holding' ? 'Hold Steadily...' : 'Press & Hold Pad'}
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

        {/* Live Telemetry Indicators */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#E8DDC7] text-center">
          <div className="p-3 bg-[#FAF6EE] rounded-2xl border border-[#E8DDC7]">
            <span className="text-[10px] uppercase font-bold text-stone-500 block tracking-wider">
              Elapsed Contact
            </span>
            <span className="text-base font-black font-mono text-[#3E1220]">
              {(dwellMs / 1000).toFixed(1)}s
            </span>
            <span className="text-[10px] text-stone-500 block">Target: 2.0s</span>
          </div>

          <div className="p-3 bg-[#FAF6EE] rounded-2xl border border-[#E8DDC7]">
            <span className="text-[10px] uppercase font-bold text-stone-500 block tracking-wider">
              Samples Streamed
            </span>
            <span className="text-base font-black font-mono text-[#3E1220]">
              {liveMetrics.samples}
            </span>
            <span className="text-[10px] text-stone-500 block">60Hz window</span>
          </div>

          <div className="p-3 bg-[#FAF6EE] rounded-2xl border border-[#E8DDC7]">
            <span className="text-[10px] uppercase font-bold text-stone-500 block tracking-wider">
              Jitter Index
            </span>
            <span className="text-base font-black font-mono text-[#27500A]">
              {liveMetrics.jitter}
            </span>
            <span className="text-[10px] text-stone-500 block">Involuntary tremor</span>
          </div>
        </div>

        {/* Channel Switching Footer */}
        <div className="mt-6 pt-4 border-t border-[#E8DDC7] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-stone-500 font-medium">Alternative channels:</span>
          <div className="flex items-center gap-2">
            {onSwitchToHaptic && (
              <button
                type="button"
                onClick={onSwitchToHaptic}
                className="font-bold text-[#3E1220] underline hover:text-[#C9962F] transition-colors cursor-pointer"
              >
                Layer 1: Haptic Rhythm
              </button>
            )}
            <span className="text-stone-300">•</span>
            {onSwitchToVoice && (
              <button
                type="button"
                onClick={onSwitchToVoice}
                className="font-bold text-[#3E1220] underline hover:text-[#C9962F] transition-colors cursor-pointer"
              >
                Layer 3: Voice Fallback
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
