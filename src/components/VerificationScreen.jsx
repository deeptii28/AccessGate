import React from 'react';
import {
  Vibrate,
  Activity,
  Mic,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export default function VerificationScreen({
  onStartVerification,
  onStartHaptic,
  onStartBehavioral,
  onStartVoice,
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10" role="main">
      {/* Hero Welcome Card */}
      <section
        id="welcome-hero-card"
        className="bg-white border-2 border-[#E8DDC7] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden"
        aria-labelledby="welcome-heading"
      >
        {/* Subtle decorative background accent */}
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#FAF6EE] pointer-events-none -z-0 border border-[#E8DDC7]"
          aria-hidden="true"
        />

        <div className="relative z-10">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3E1220]/5 text-[#3E1220] text-xs font-extrabold uppercase tracking-wider mb-4 border border-[#3E1220]/15">
            Smart India Hackathon 2026 • Problem Statement MS-05
          </div>

          <h1
            id="welcome-heading"
            className="text-3xl sm:text-5xl font-black text-[#3E1220] tracking-tight leading-tight"
          >
            AccessGate
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-[#C9962F] mt-1 tracking-tight">
            Accessible verification for everyone
          </p>

          <p className="text-sm sm:text-base text-stone-700 mt-4 max-w-2xl leading-relaxed">
            A 3-layer CAPTCHA alternative engineered for visually impaired and deaf-blind citizens.
            AccessGate eliminates distorted visual tests and noisy audio puzzles by utilizing intuitive
            haptic rhythm reproduction, behavioral touch patterns, and natural spoken voice fallback.
          </p>

          {/* Primary Action */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              type="button"
              id="start-verification-cta"
              onClick={onStartVerification}
              className="px-8 py-4 rounded-2xl bg-[#C9962F] hover:bg-[#b58525] text-[#3E1220] font-black text-base shadow-md transition-transform active:scale-98 flex items-center justify-center gap-3 cursor-pointer group focus-visible:ring-4 focus-visible:ring-[#3E1220]"
              aria-label="Start Verification Process"
            >
              <span>Start Verification</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Three Core Feature Cards */}
      <section className="mt-8 sm:mt-10" aria-labelledby="features-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="features-heading"
            className="text-xs font-extrabold uppercase tracking-widest text-[#3E1220]"
          >
            Core Verification Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Haptic Rhythm */}
          <button
            type="button"
            id="feature-card-haptic"
            onClick={onStartHaptic}
            className="bg-white border-2 border-[#E8DDC7] rounded-2xl p-5 sm:p-6 shadow-2xs hover:border-[#C9962F] hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between text-left cursor-pointer group focus-visible:ring-4 focus-visible:ring-[#C9962F]"
            aria-label="Start Haptic Rhythm Verification directly"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#3E1220] text-[#C9962F] flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Vibrate className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="text-[11px] font-bold text-[#C9962F] uppercase tracking-wider block">
                Layer 1
              </span>
              <h3 className="text-lg font-bold text-[#3E1220] mt-1 group-hover:text-[#C9962F] transition-colors">
                Haptic Rhythm Verification
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Your device plays a randomized vibration pattern via the browser Vibration API.
                You feel the rhythm and tap it back on the large touch target without needing to see.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E8DDC7] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#27500A] flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Works 100% Sight-Free
              </span>
              <span className="text-xs font-bold text-[#3E1220] flex items-center gap-1 group-hover:text-[#C9962F] transition-colors">
                Start <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </button>

          {/* Card 2: Behavioral Interaction */}
          <button
            type="button"
            id="feature-card-behavioral"
            onClick={onStartBehavioral}
            className="bg-white border-2 border-[#E8DDC7] rounded-2xl p-5 sm:p-6 shadow-2xs hover:border-[#C9962F] hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between text-left cursor-pointer group focus-visible:ring-4 focus-visible:ring-[#C9962F]"
            aria-label="Start Behavioral Interaction Pattern Verification directly"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#3E1220] text-[#C9962F] flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="text-[11px] font-bold text-[#C9962F] uppercase tracking-wider block">
                Layer 2
              </span>
              <h3 className="text-lg font-bold text-[#3E1220] mt-1 group-hover:text-[#C9962F] transition-colors">
                Behavioral Interaction Pattern
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Measures natural timing variance between taps, contact dwell dynamics,
                and interaction rhythm. Automated bot scripts typically produce uniform timing patterns, which this layer is designed to detect and flag.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E8DDC7] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#27500A] flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Timing Variance
              </span>
              <span className="text-xs font-bold text-[#3E1220] flex items-center gap-1 group-hover:text-[#C9962F] transition-colors">
                Start <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </button>

          {/* Card 3: Voice Fallback */}
          <button
            type="button"
            id="feature-card-voice"
            onClick={onStartVoice}
            className="bg-white border-2 border-[#E8DDC7] rounded-2xl p-5 sm:p-6 shadow-2xs hover:border-[#C9962F] hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between text-left cursor-pointer group focus-visible:ring-4 focus-visible:ring-[#C9962F]"
            aria-label="Start Acoustic Voice Fallback Verification directly"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#3E1220] text-[#C9962F] flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Mic className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="text-[11px] font-bold text-[#C9962F] uppercase tracking-wider block">
                Layer 3
              </span>
              <h3 className="text-lg font-bold text-[#3E1220] mt-1 group-hover:text-[#C9962F] transition-colors">
                Acoustic Voice Fallback
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                When vibration motors are unavailable (desktop, older hardware, or motor fatigue),
                natural spoken challenges provide a seamless, non-visual verification alternative.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E8DDC7] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#27500A] flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Universal Device Continuity
              </span>
              <span className="text-xs font-bold text-[#3E1220] flex items-center gap-1 group-hover:text-[#C9962F] transition-colors">
                Start <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* SIH Team Credential Footer Note */}
      <footer className="mt-12 text-center text-xs text-stone-600 border-t border-[#E8DDC7] pt-6 space-y-1">
        <p className="font-semibold text-[#3E1220]">
          Developed by <strong>Team Beyond Sight</strong> • Smart India Hackathon 2026
        </p>
        <p className="text-[11px] text-stone-500">
          Designed with reference to WCAG 2.1 accessibility guidelines.
        </p>
      </footer>
    </div>
  );
}
