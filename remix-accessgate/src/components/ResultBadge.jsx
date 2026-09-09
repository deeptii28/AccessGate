import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Mic,
  Award,
  Clock,
  Info,
  Activity,
  ShieldCheck,
  Touchpad,
  AlertTriangle,
} from 'lucide-react';
import IntervalVisualizer from './IntervalVisualizer';
import {
  IconHumanConfidence,
  IconRhythmClock,
  IconBehavioralJitter,
  IconAcousticVoice,
} from './CustomIcons';

export default function ResultBadge({
  result,
  onRetryHaptic,
  onRetryBehavioral,
  onRetryVoice,
}) {
  if (!result) return null;

  const { success, score, threshold, reason, challengeType, details } = result;


  return (
    <div
      className="max-w-3xl mx-auto px-4 py-4 sm:py-6"
      role="region"
      aria-labelledby="result-badge-title"
    >
      <div className="bg-white border-2 border-[#E8DDC7] rounded-2xl shadow-sm p-5 sm:p-8">
        {/* Outcome Banner */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
            success
              ? 'bg-[#EFF6EC] border-[#27500A]/30 text-[#27500A]'
              : 'bg-red-50/70 border-red-200 text-red-900'
          }`}
          role="alert"
        >
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 shadow-sm ${
              success ? 'bg-[#27500A] text-white' : 'bg-red-700 text-white'
            }`}
            aria-hidden="true"
          >
            {success ? (
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            ) : (
              <XCircle className="w-10 h-10 sm:w-12 sm:h-12" />
            )}
          </div>

          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/70 border border-current/20 mb-2">
            {success ? 'Verification Successful' : 'Verification Required'}
          </span>

          <h2
            id="result-badge-title"
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2"
          >
            {success ? 'Human Presence Confirmed' : 'Verification Unsuccessful'}
          </h2>

          <p className="text-sm max-w-lg leading-relaxed font-medium">
            {reason}
          </p>

          {/* Prototype Confidence Score Badge */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="bg-white px-5 py-3 rounded-xl border border-current/20 shadow-2xs flex items-center gap-3">
              <IconHumanConfidence className="w-8 h-8 text-[#C9962F]" aria-hidden="true" />
              <div className="text-left">
                <span className="text-[11px] font-bold text-stone-500 block uppercase tracking-wider">
                  Prototype Confidence Score
                </span>
                <span className="text-2xl font-black font-mono text-[#3E1220]">
                  {score}%{' '}
                  <span className="text-xs font-semibold text-stone-500">
                    (Threshold: {threshold}%)
                  </span>
                </span>
              </div>
            </div>

            {/* Verification Channel */}
            <div className="bg-white px-4 py-3 rounded-xl border border-current/20 shadow-2xs text-left">
              <span className="text-[11px] font-bold text-stone-500 block uppercase tracking-wider">
                Verification Channel
              </span>
              <span className="text-sm font-bold text-[#3E1220] capitalize">
                {challengeType === 'voice'
                  ? 'Layer 3: Voice Fallback'
                  : challengeType === 'behavioral'
                  ? 'Layer 2: Behavioral Interaction'
                  : 'Layer 1: Haptic Rhythm'}
              </span>
            </div>
          </div>

          {/* Prototype disclaimer note */}
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-stone-600 max-w-md text-center">
            <Info className="w-3.5 h-3.5 text-[#C9962F] shrink-0" aria-hidden="true" />
            <span>
              This Prototype Confidence Score is an experimental metric for the SIH 2026
              demonstration and is not claimed as certified biometric security.
            </span>
          </div>
        </div>

        {/* Rhythm & Timing Breakdown (Only for Layer 1: Haptic Rhythm) with Enhanced Data Visualizer */}
        {challengeType === 'haptic' && details && details.intervalErrors && (
          <IntervalVisualizer
            intervalErrors={details.intervalErrors}
            details={details}
          />
        )}

        {/* Behavioral Interaction Pattern Telemetry (Only for Layer 2) */}
        {challengeType === 'behavioral' && details && (
          <div className="mt-6 border border-[#E8DDC7] rounded-xl p-5 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3E1220] mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#C9962F]" />
              Layer 2: Behavioral Interaction Pattern Telemetry Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#FAF6EE]/70 border border-[#E8DDC7]/60">
                <span className="text-[11px] font-bold text-stone-500 uppercase block tracking-wider">
                  Contact Dwell Time
                </span>
                <span className="text-lg font-black font-mono text-[#3E1220] mt-0.5 block">
                  {details.dwellTime ? `${(details.dwellTime / 1000).toFixed(2)}s` : 'N/A'}
                </span>
                <span className="text-[11px] text-stone-600">Target: ~2.00 seconds</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF6EE]/70 border border-[#E8DDC7]/60">
                <span className="text-[11px] font-bold text-stone-500 uppercase block tracking-wider">
                  Timing Variance
                </span>
                <span className="text-lg font-black font-mono text-[#3E1220] mt-0.5 block">
                  {details.tremorVariance ? `${details.tremorVariance} px²` : 'Natural'}
                </span>
                <span className="text-[11px] text-[#27500A] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Natural Variance
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF6EE]/70 border border-[#E8DDC7]/60">
                <span className="text-[11px] font-bold text-stone-500 uppercase block tracking-wider">
                  Interaction Telemetry
                </span>
                <span className="text-lg font-black font-mono text-[#3E1220] mt-0.5 block">
                  {details.sampleCount || 0} samples
                </span>
                <span className="text-[11px] text-stone-600 capitalize">
                  Mode: {details.inputType || 'Pointer'} Hold
                </span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-[#EFF6EC] border border-[#27500A]/20 flex items-center gap-2 text-xs text-[#27500A] font-semibold">
              <Touchpad className="w-4 h-4 shrink-0" />
              <span>
                Verified Natural Human Interaction. Automated bot scripts typically produce uniform timing patterns, which this layer is designed to detect and flag.
              </span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-8 pt-6 border-t border-[#E8DDC7] flex flex-wrap items-center justify-end gap-3">
          {!success && (
            <button
              type="button"
              onClick={onRetryVoice}
              className="px-4 py-2.5 rounded-xl border border-[#C9962F] text-[#3E1220] text-xs font-bold hover:bg-[#C9962F]/15 flex items-center gap-1.5 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-[#C9962F]" />
              Try Voice Fallback
            </button>
          )}

          <button
            type="button"
            onClick={
              challengeType === 'behavioral'
                ? (onRetryBehavioral || onRetryHaptic)
                : onRetryHaptic
            }
            className="px-6 py-2.5 rounded-xl bg-[#C9962F] hover:bg-[#b58525] text-[#3E1220] font-extrabold text-sm shadow-sm transition-transform active:scale-98 cursor-pointer"
          >
            {success
              ? 'Test Another Verification'
              : challengeType === 'behavioral'
              ? 'Retry Behavioral Challenge'
              : 'Retry Rhythm Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
}
