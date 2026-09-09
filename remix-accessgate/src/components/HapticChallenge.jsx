import React, { useState, useEffect, useRef } from 'react';
import {
  Vibrate,
  Activity,
  Play,
  RotateCw,
  Mic,
  Sparkles,
  Volume2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import {
  generateHapticPattern,
  playRhythmPattern,
  analyzeTapTiming,
} from '../utils/verification';
import TapCapture from './TapCapture';
import EvaluationAnticipation from './EvaluationAnticipation';
import WaveformVisualizer from './WaveformVisualizer';

export default function HapticChallenge({
  mode = 'haptic',
  onVerificationComplete,
  onSwitchToBehavioral,
  onSwitchToVoice,
  onBackToDeviceCheck,
  audioFeedback,
  voiceAnnounce,
}) {
  const [pattern, setPattern] = useState(null);
  const [challengeState, setChallengeState] = useState('idle'); // 'idle' | 'playing' | 'recording' | 'evaluating'
  const [playCount, setPlayCount] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const [pendingEvaluation, setPendingEvaluation] = useState(null);
  const stopPatternRef = useRef(null);

  // Generate new random rhythm challenge on mount
  const initChallenge = () => {
    const newPattern = generateHapticPattern(4); // 4 taps = 3 rhythmic intervals
    setPattern(newPattern);
    setChallengeState('idle');
    setPlayCount(0);
    setPendingEvaluation(null);
    const msg = 'New haptic challenge generated. Press Start Challenge to feel or hear the rhythm.';
    setAnnouncement(msg);
    voiceAnnounce(msg);
  };

  useEffect(() => {
    initChallenge();
    return () => {
      if (stopPatternRef.current) stopPatternRef.current();
    };
  }, []);

  // Play the vibration rhythm pattern
  const handlePlayPattern = () => {
    if (!pattern) return;

    setChallengeState('playing');
    const msg = 'Playing rhythm pattern now. Feel the vibration pulses and listen.';
    setAnnouncement(msg);
    voiceAnnounce(msg);

    stopPatternRef.current = playRhythmPattern(pattern, {
      useAudio: audioFeedback,
      useVibrate: true,
      onComplete: () => {
        setChallengeState('recording');
        setPlayCount((prev) => prev + 1);
        const readyMsg = 'Pattern complete. Now reproduce the rhythm by tapping the large card.';
        setAnnouncement(readyMsg);
        voiceAnnounce(readyMsg);
      },
    });
  };

  // Process recorded taps
  const handleTapsCompleted = (tapTimestamps) => {
    if (!pattern) return;

    setAnnouncement('Analyzing tap timing and rhythmic consistency...');
    voiceAnnounce('Analyzing tap timing and motor variance...');

    const evaluation = analyzeTapTiming(tapTimestamps, pattern.expectedIntervals);
    setPendingEvaluation({
      ...evaluation,
      challengeType: mode === 'behavioral' ? 'behavioral' : 'haptic',
      patternId: pattern.id,
      playCount: playCount,
      tapTimestamps,
    });
    setChallengeState('evaluating');
  };

  const handleAnticipationComplete = () => {
    if (pendingEvaluation) {
      onVerificationComplete(pendingEvaluation);
    }
  };

  if (!pattern) return null;

  // Render anticipation screen when evaluating
  if (challengeState === 'evaluating') {
    return (
      <EvaluationAnticipation
        channel="haptic"
        durationMs={1300}
        onComplete={handleAnticipationComplete}
      />
    );
  }

  const isBehavioral = mode === 'behavioral';

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-4 sm:py-6"
      role="region"
      aria-labelledby="haptic-challenge-title"
    >
      <div className="bg-white border-2 border-[#E8DDC7] rounded-3xl shadow-sm p-5 sm:p-8 card-rhythm-texture">
        {/* Navigation back to Device Check */}
        {onBackToDeviceCheck && (
          <div className="mb-4">
            <button
              type="button"
              onClick={onBackToDeviceCheck}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#3E1220] transition-colors px-2.5 py-1.5 rounded-xl hover:bg-[#FAF6EE] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C9962F] border border-transparent hover:border-[#E8DDC7]"
              aria-label="Go back to Device Check"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C9962F]" aria-hidden="true" />
              <span>Back to Device Check</span>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="border-b border-[#E8DDC7] pb-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3E1220]/5 text-[#3E1220] text-xs font-bold uppercase tracking-wider border border-[#3E1220]/10">
              <Vibrate className="w-3.5 h-3.5 text-[#C9962F]" aria-hidden="true" />
              Layer 1: Haptic Rhythm Verification
            </span>
            <span className="text-xs text-stone-500 font-semibold font-mono">
              Timing Cadence • 4 Taps
            </span>
          </div>

          <h2
            id="haptic-challenge-title"
            className="text-2xl sm:text-3xl font-black text-[#3E1220] tracking-tight"
          >
            Haptic Rhythm Verification
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Hold your mobile device or place your hand on the screen. Press Start Challenge to feel the vibration pattern. When it finishes, tap the screen back in the exact same rhythm.
          </p>
        </div>

        {/* Live Accessibility Status Announcer */}
        <div
          role="status"
          aria-live="assertive"
          aria-atomic="true"
          className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E8DDC7] text-[#3E1220] text-xs sm:text-sm font-semibold mb-6 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#C9962F] shrink-0" aria-hidden="true" />
            <span>{announcement}</span>
          </div>
          {challengeState === 'playing' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C9962F] text-[#3E1220] text-xs font-bold animate-pulse">
              Playing pulses...
            </span>
          )}
        </div>

        {/* Challenge Control / Trigger Area */}
        <div className="flex flex-col items-center justify-center py-4">
          {challengeState === 'idle' ? (
            <div className="text-center space-y-5 max-w-md">
              <div className="w-16 h-16 rounded-2xl art-icon-badge flex items-center justify-center mx-auto shadow-md">
                <Play className="w-8 h-8 fill-current ml-1 text-[#C9962F]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3E1220]">Ready for Pattern</h3>
                <p className="text-xs text-stone-600 mt-1">
                  Ensure device vibration is enabled and volume is at a comfortable level.
                </p>
              </div>
              <button
                type="button"
                id="start-challenge-button"
                onClick={handlePlayPattern}
                className="w-full py-4 px-6 rounded-2xl bg-[#C9962F] hover:bg-[#b58525] text-[#3E1220] font-black text-base shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-4 focus-visible:ring-[#3E1220]"
                aria-label="Start Challenge - Play Vibration Rhythm Pattern"
              >
                <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                Start Challenge
              </button>
            </div>
          ) : challengeState === 'playing' ? (
            <div className="text-center py-8 space-y-4 w-full max-w-sm">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#C9962F]/30 animate-radar" />
                <div className="w-20 h-20 rounded-2xl art-icon-badge flex items-center justify-center relative shadow-lg">
                  <Vibrate className="w-10 h-10 animate-bounce text-[#C9962F]" />
                </div>
              </div>

              <div className="w-full">
                <WaveformVisualizer state="playing" label="Playback Rhythm Waveform" />
              </div>

              <p className="text-base font-extrabold text-[#3E1220]">
                Feel and listen to the rhythm...
              </p>
              <p className="text-xs text-stone-500">
                Do not tap yet. Tap card will unlock as soon as pulses finish.
              </p>
            </div>
          ) : (
            <div className="w-full">
              {/* Tap Capture Area */}
              <TapCapture
                targetTapCount={pattern.tapCount}
                onCompleteTaps={handleTapsCompleted}
                isRecording={challengeState === 'recording'}
                audioFeedback={audioFeedback}
                voiceAnnounce={voiceAnnounce}
              />

              {/* Rhythmic Playback Actions */}
              <div className="mt-8 pt-5 border-t border-[#E8DDC7] flex flex-wrap items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={handlePlayPattern}
                  className="px-4 py-2.5 rounded-xl border border-[#3E1220] text-[#3E1220] font-bold hover:bg-[#3E1220]/5 flex items-center gap-1.5 transition-colors cursor-pointer"
                  aria-label="Replay rhythm pattern vibration"
                >
                  <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                  Replay Rhythm ({playCount} played)
                </button>

                <button
                  type="button"
                  onClick={initChallenge}
                  className="px-3 py-2 text-stone-600 hover:text-[#3E1220] font-semibold cursor-pointer"
                >
                  Generate New Pattern
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Channel Switch */}
        <div className="mt-8 pt-5 border-t border-[#E8DDC7] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF6EE]/50 p-4 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-[#C9962F] shrink-0" aria-hidden="true" />
            <p className="text-xs text-stone-600 font-medium">
              Explore alternative verification channels:
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onSwitchToBehavioral && (
              <button
                type="button"
                onClick={onSwitchToBehavioral}
                className="text-xs font-bold text-[#3E1220] underline hover:text-[#C9962F] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962F] rounded-md px-2 py-1 cursor-pointer"
              >
                Layer 2: Behavioral
              </button>
            )}
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={onSwitchToVoice}
              className="text-xs font-bold text-[#3E1220] underline hover:text-[#C9962F] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962F] rounded-md px-2 py-1 cursor-pointer"
            >
              Layer 3: Voice Fallback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
