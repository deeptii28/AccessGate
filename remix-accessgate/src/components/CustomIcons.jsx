import React from 'react';

/**
 * AccessGate Custom Line-Art Iconography Set
 * Designed specifically for the Smart India Hackathon 2026 theme:
 * Terracotta (#3E1220) and Warm Gold (#C9962F) palette with
 * rhythmic cadence, tactile vibration arcs, acoustic speech waves,
 * and high-precision biometric telemetry metaphors.
 */

// 1. Core Brand Emblem: Shield with integrated rhythm cadence bars
export function IconBrandShield({ className = 'w-6 h-6', ariaHidden = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      {/* Outer shield outline */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      {/* Central rhythm cadence bars */}
      <path d="M8 11v3" stroke="#C9962F" strokeWidth="2.2" />
      <path d="M12 8v8" stroke="#C9962F" strokeWidth="2.2" />
      <path d="M16 10v4" stroke="#C9962F" strokeWidth="2.2" />
    </svg>
  );
}

// 2. Layer 1: Haptic Rhythm Vibration (Mobile phone with concentric tactile arcs)
export function IconHapticRhythm({ className = 'w-6 h-6', ariaHidden = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      {/* Device body */}
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M11 18h2" stroke="#C9962F" />
      {/* Left tactile vibration waves */}
      <path d="M3 8c-1.2 2.5-1.2 5.5 0 8" stroke="#C9962F" strokeWidth="2" />
      <path d="M0.8 10c-.6 1.3-.6 2.7 0 4" stroke="#C9962F" strokeWidth="1.7" strokeDasharray="1 1" />
      {/* Right tactile vibration waves */}
      <path d="M21 8c1.2 2.5 1.2 5.5 0 8" stroke="#C9962F" strokeWidth="2" />
      <path d="M23.2 10c.6 1.3.6 2.7 0 4" stroke="#C9962F" strokeWidth="1.7" strokeDasharray="1 1" />
      {/* Center rhythmic pulse dot */}
      <circle cx="12" cy="10" r="1.5" fill="#C9962F" stroke="none" />
    </svg>
  );
}

// 3. Layer 2: Behavioral Touch Tremor & Dwell (Touchpad with natural motor jitter wave)
export function IconBehavioralJitter({ className = 'w-6 h-6', ariaHidden = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      {/* Touch surface frame */}
      <rect x="3" y="3" width="18" height="18" rx="4" />
      {/* Touch contact point */}
      <circle cx="12" cy="12" r="3.5" stroke="#C9962F" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.2" fill="#C9962F" stroke="none" />
      {/* Organic micro-jitter tremor line */}
      <path
        d="M6 16c2-2 3-1 5-4s2-1 4 2 2-1 3-2"
        stroke="#C9962F"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 4. Layer 3: Acoustic Voice Fallback (Microphone with harmonic sound waves)
export function IconAcousticVoice({ className = 'w-6 h-6', ariaHidden = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      {/* Mic capsule */}
      <rect x="9" y="2" width="6" height="11" rx="3" stroke="#C9962F" strokeWidth="2" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="8" y1="21" x2="16" y2="21" />
      {/* Harmonic sound rings */}
      <path d="M2 9a9.5 9.5 0 0 1 0 4" stroke="#C9962F" strokeWidth="1.5" />
      <path d="M22 9a9.5 9.5 0 0 0 0 4" stroke="#C9962F" strokeWidth="1.5" />
    </svg>
  );
}

// 5. Layer 0: Hardware Diagnostic & Precision Sensor Check
export function IconDeviceDiagnostic({ className = 'w-6 h-6', ariaHidden = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      {/* Chip package */}
      <rect x="4" y="4" width="16" height="16" rx="3" />
      {/* Sensor core */}
      <rect x="8" y="8" width="8" height="8" rx="1.5" stroke="#C9962F" strokeWidth="1.75" />
      {/* Checkmark inside core */}
      <path d="M10 12l1.5 1.5L14 10" stroke="#C9962F" strokeWidth="1.75" />
      {/* Pin connectors */}
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
    </svg>
  );
}

// 6. High-Precision Rhythm Stopwatch / Interval Clock
export function IconRhythmClock({ className = 'w-6 h-6', ariaHidden = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 1.5" stroke="#C9962F" strokeWidth="2" />
      <path d="M12 5V2" />
      <path d="M10 2h4" />
      {/* Precision beat tick marks */}
      <circle cx="12" cy="7" r="0.75" fill="#C9962F" stroke="none" />
      <circle cx="18" cy="13" r="0.75" fill="#C9962F" stroke="none" />
      <circle cx="12" cy="19" r="0.75" fill="#C9962F" stroke="none" />
      <circle cx="6" cy="13" r="0.75" fill="#C9962F" stroke="none" />
    </svg>
  );
}

// 7. Architectural Comparison Matrix
export function IconComparisonMatrix({ className = 'w-6 h-6', ariaHidden = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      {/* Split comparison panels */}
      <rect x="3" y="3" width="8" height="18" rx="2" />
      <rect x="13" y="3" width="8" height="18" rx="2" stroke="#C9962F" />
      {/* Traditional visual side: broken cross mark */}
      <line x1="5.5" y1="8" x2="8.5" y2="11" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8.5" y1="8" x2="5.5" y2="11" stroke="currentColor" strokeWidth="1.5" />
      {/* AccessGate side: checkmark & rhythm pulse */}
      <path d="M15 9.5l1.5 1.5 3-3" stroke="#C9962F" strokeWidth="2" />
      <path d="M15 15h4" stroke="#C9962F" strokeWidth="1.5" strokeDasharray="1 1.5" />
    </svg>
  );
}

// 8. Tactile Hand Tap Surface
export function IconTactileTap({ className = 'w-6 h-6', ariaHidden = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      {/* Fingerprint / Tap core */}
      <circle cx="12" cy="10" r="3" stroke="#C9962F" strokeWidth="2" />
      <path d="M12 2a8 8 0 0 0-8 8c0 3.5 2 6.5 5 7.7v3.3h6v-3.3c3-1.2 5-4.2 5-7.7a8 8 0 0 0-8-8z" />
      {/* Concentric tactile ripple arcs */}
      <path d="M7 6c1.3-1.3 3.1-2 5-2s3.7.7 5 2" stroke="#C9962F" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}

// 9. Verified Human Presence Crest (Award / Confidence badge)
export function IconHumanConfidence({ className = 'w-6 h-6', ariaHidden = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      <circle cx="12" cy="8" r="6" stroke="#C9962F" strokeWidth="2" />
      <path d="M9 8l2 2 4-4" stroke="#C9962F" strokeWidth="2" />
      <path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.11" />
    </svg>
  );
}

// 10. Voice Waveform Audio Speaker
export function IconAudioPulse({ className = 'w-6 h-6', ariaHidden = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#C9962F" strokeWidth="2" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="#C9962F" strokeWidth="1.5" />
    </svg>
  );
}

// 11. Screen Reader Accessibility Narrator
export function IconAccessibilityEar({ className = 'w-6 h-6', ariaHidden = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10" stroke="#C9962F" strokeWidth="2" />
      <path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 0 4 0" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
  );
}

// 12. Micro-Tremor Biometric Jitter
export function IconMicroTremor({ className = 'w-6 h-6', ariaHidden = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path d="M2 12h3l2-5 3 10 3-8 2 6 2-3h5" stroke="#C9962F" strokeWidth="2" />
      <circle cx="12" cy="12" r="1" fill="#C9962F" stroke="none" />
    </svg>
  );
}
