import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RotateCw,
} from 'lucide-react';
import {
  IconDeviceDiagnostic,
  IconHapticRhythm,
  IconTactileTap,
  IconAudioPulse,
  IconAcousticVoice,
  IconRhythmClock,
} from './CustomIcons';
import { checkDeviceCapabilities } from '../utils/verification';

export default function DeviceCheck({
  mode = 'haptic',
  onProceedHaptic,
  onProceedBehavioral,
  onProceedVoice,
  voiceAnnounce,
}) {
  const [capabilities, setCapabilities] = useState(null);
  const [checking, setChecking] = useState(true);

  const runCheck = () => {
    setChecking(true);
    const caps = checkDeviceCapabilities();
    setTimeout(() => {
      setCapabilities(caps);
      setChecking(false);

      if (caps.hasVibrate) {
        voiceAnnounce('Device check complete. Haptic vibration and high-precision timing are supported on your device.');
      } else {
        voiceAnnounce(
          'Device check complete. Vibration API is not supported on this browser. Voice fallback or audio-assisted simulation is recommended.'
        );
      }
    }, 450);
  };

  useEffect(() => {
    runCheck();
  }, []);

  if (checking || !capabilities) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center" aria-live="polite">
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          {/* Animated radar rings */}
          <div className="absolute inset-0 rounded-full border-2 border-[#C9962F]/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-[#3E1220]/20 animate-radar" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FAF6EE] to-white border-2 border-[#C9962F] flex items-center justify-center shadow-md relative z-10">
            <IconDeviceDiagnostic className="w-8 h-8 text-[#C9962F] animate-pulse" />
          </div>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9962F] block mb-1">
          Hardware Screening
        </span>
        <h2 className="text-xl font-black text-[#3E1220] tracking-tight">Analyzing Browser & Sensors...</h2>
        <p className="text-xs text-stone-600 mt-2 leading-relaxed">
          Inspecting Vibration API, Touch events, Speech synthesis, and hardware sensors.
        </p>
      </div>
    );
  }

  const items = [
    {
      id: 'vibrate',
      title: 'Vibration API (Haptic Rhythm)',
      supported: capabilities.hasVibrate,
      icon: IconHapticRhythm,
      description: capabilities.hasVibrate
        ? 'Native motor control supported (navigator.vibrate).'
        : 'Not supported on this browser/OS (common on desktop and iOS Safari).',
      critical: true,
    },
    {
      id: 'touch',
      title: 'Touch & Pointer Events',
      supported: capabilities.hasTouch,
      icon: IconTactileTap,
      description: capabilities.hasTouch
        ? 'Touch surface ready for rhythmic tapping.'
        : 'Pointer/mouse events will capture taps with high-resolution timing.',
      critical: false,
    },
    {
      id: 'speech-synth',
      title: 'Speech Synthesis (Screen Reader)',
      supported: capabilities.hasSpeechSynthesis,
      icon: IconAudioPulse,
      description: capabilities.hasSpeechSynthesis
        ? 'Spoken audio prompts fully functional.'
        : 'Speech synthesis unavailable; visual and haptic prompts only.',
      critical: false,
    },
    {
      id: 'speech-rec',
      title: 'Speech Recognition / Voice Fallback',
      supported: capabilities.hasSpeechRecognition || capabilities.hasMicrophone,
      icon: IconAcousticVoice,
      description: capabilities.hasSpeechRecognition
        ? 'Browser speech recognition engine available.'
        : capabilities.hasMicrophone
        ? 'Microphone input stream accessible.'
        : 'Spoken repetition challenge available.',
      critical: false,
    },
    {
      id: 'timing',
      title: 'High-Resolution Clock',
      supported: typeof performance !== 'undefined' && typeof performance.now === 'function',
      icon: IconRhythmClock,
      description: 'performance.now() ready for tap-timing analysis.',
      critical: false,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6" role="region" aria-labelledby="device-check-title">
      <div className="bg-white border-2 border-[#E8DDC7] rounded-2xl shadow-sm p-5 sm:p-8">
        {/* Header */}
        <div className="border-b border-[#E8DDC7] pb-5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E1220]/5 text-[#3E1220] text-xs font-bold uppercase tracking-wider mb-2">
            <IconDeviceDiagnostic className="w-4 h-4 text-[#C9962F]" aria-hidden="true" />
            Layer 0 Diagnostic
          </div>
          <h2 id="device-check-title" className="text-2xl sm:text-3xl font-extrabold text-[#3E1220] tracking-tight">
            Device & Accessibility Capability Check
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            AccessGate inspects your browser environment to select the most accessible and reliable
            verification channel without assuming device hardware.
          </p>
        </div>

        {/* Status Callout if Vibration is missing */}
        {!capabilities.hasVibrate && (
          <div
            className="mb-6 p-4 rounded-xl bg-[#FEF7E6] border-2 border-[#C9962F] text-[#3E1220] flex items-start gap-3.5"
            role="alert"
          >
            <AlertTriangle className="w-5 h-5 text-[#C9962F] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold text-[#3E1220]">
                Vibration API is Not Available on this Browser
              </h3>
              <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                Standard desktop browsers and iOS Safari restrict the W3C Vibration API for security or hardware reasons.
                You can immediately use <strong>Voice Verification (Layer 3)</strong>, or proceed with{' '}
                <strong>Audio-Assisted Haptic Simulation</strong> to test the rhythm challenge using high-precision acoustic pulses.
              </p>
            </div>
          </div>
        )}

        {/* Capability Checklist */}
        <div className="space-y-3 mb-8" aria-label="Detected Hardware & Browser Features">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-start justify-between p-3.5 sm:p-4 rounded-xl border border-[#E8DDC7] bg-[#FAF6EE]/40 hover:bg-[#FAF6EE] transition-colors"
              >
                <div className="flex items-start gap-3 pr-3">
                  <div className="p-2 rounded-lg bg-white border border-[#E8DDC7] text-[#3E1220] shadow-2xs">
                    <Icon className="w-5 h-5 text-[#C9962F]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3E1220]">{item.title}</h3>
                    <p className="text-xs text-stone-600 mt-0.5">{item.description}</p>
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  {item.supported ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EFF6EC] text-[#27500A] border border-[#27500A]/30">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Supported
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                      Fallback Mode
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#E8DDC7] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={runCheck}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E8DDC7] text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-2 transition-colors"
            aria-label="Re-run browser capability test"
          >
            <RotateCw className="w-4 h-4" aria-hidden="true" />
            Re-check Environment
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {mode === 'behavioral' ? (
              <>
                <button
                  type="button"
                  onClick={onProceedVoice}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-stone-600 hover:text-[#3E1220] text-xs font-bold"
                >
                  Switch to Voice
                </button>
                <button
                  type="button"
                  onClick={onProceedBehavioral || onProceedHaptic}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C9962F] hover:bg-[#b58525] text-[#3E1220] font-extrabold text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm cursor-pointer"
                >
                  Proceed to Behavioral Challenge
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </>
            ) : mode === 'voice' ? (
              <>
                <button
                  type="button"
                  onClick={onProceedHaptic}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-stone-600 hover:text-[#3E1220] text-xs font-bold"
                >
                  Switch to Haptic
                </button>
                <button
                  type="button"
                  onClick={onProceedVoice}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C9962F] hover:bg-[#b58525] text-[#3E1220] font-extrabold text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm cursor-pointer"
                >
                  Proceed to Voice Verification
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </>
            ) : !capabilities.hasVibrate ? (
              <>
                <button
                  type="button"
                  onClick={onProceedHaptic}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-[#3E1220] text-[#3E1220] font-bold text-sm hover:bg-[#3E1220]/5 transition-colors cursor-pointer"
                >
                  Test with Audio-Haptics
                </button>
                <button
                  type="button"
                  onClick={onProceedVoice}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C9962F] hover:bg-[#b58525] text-[#3E1220] font-extrabold text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm cursor-pointer"
                >
                  Use Voice Verification
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onProceedVoice}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-stone-600 hover:text-[#3E1220] text-xs font-bold cursor-pointer"
                >
                  Switch to Voice Fallback
                </button>
                <button
                  type="button"
                  onClick={onProceedHaptic}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C9962F] hover:bg-[#b58525] text-[#3E1220] font-extrabold text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm cursor-pointer"
                >
                  Proceed to Haptic Challenge
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
