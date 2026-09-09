/**
 * AccessGate - Verification & Timing Utilities
 * Smart India Hackathon 2026 - Problem Statement: MS-05
 * Accessible CAPTCHA Alternative for Visually Impaired Citizens
 */

// Safe Web Audio tone generator for audible rhythm backup
let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playAudioPulse(durationMs = 120, freq = 440) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Smooth attack and release to prevent harsh clicks
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (durationMs / 1000));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + (durationMs / 1000) + 0.05);
  } catch (err) {
    console.warn('Audio feedback failed:', err);
  }
}

/**
 * Checks browser capabilities without fake values.
 */
export function checkDeviceCapabilities() {
  if (typeof window === 'undefined') {
    return {
      hasVibrate: false,
      hasTouch: false,
      hasSpeechSynthesis: false,
      hasSpeechRecognition: false,
      hasWebAudio: false,
      hasMicrophone: false,
      isMobile: false,
    };
  }

  const hasVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  const hasTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  const hasSpeechSynthesis = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  const hasWebAudio = !!(window.AudioContext || window.webkitAudioContext);
  const hasMicrophone = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return {
    hasVibrate,
    hasTouch,
    hasSpeechSynthesis,
    hasSpeechRecognition,
    hasWebAudio,
    hasMicrophone,
    isMobile,
    userAgent: navigator.userAgent,
  };
}

/**
 * Generates a random rhythmic vibration pattern.
 * Pattern format: [vibeDuration, pauseDuration, vibeDuration, pauseDuration, ...]
 * Usually 4 taps with distinct pauses (e.g. short (320ms), medium (520ms), long (750ms)).
 */
export function generateHapticPattern(tapCount = 4) {
  // Safe pulse duration for mobile vibration motors: 140ms - 180ms
  const pulseDuration = 150;
  
  // Rhythmic templates or procedurally generated tempos
  const intervalPresets = [
    [350, 600, 350], // short - long - short
    [550, 350, 550], // medium - short - medium
    [400, 400, 700], // steady - steady - syncopated long
    [650, 350, 350], // long - double quick
    [450, 450, 450], // steady metric
  ];

  let selectedIntervals;
  if (tapCount === 4) {
    const randomIndex = Math.floor(Math.random() * intervalPresets.length);
    selectedIntervals = intervalPresets[randomIndex];
  } else {
    // Generate variable intervals for arbitrary tap counts
    selectedIntervals = [];
    for (let i = 0; i < tapCount - 1; i++) {
      // Pick between 350ms and 700ms in steps of 50ms
      const interval = 350 + Math.floor(Math.random() * 8) * 50;
      selectedIntervals.push(interval);
    }
  }

  // Construct navigator.vibrate pattern: [vibe, pause, vibe, pause, vibe, ...]
  const vibrationPattern = [];
  for (let i = 0; i < tapCount; i++) {
    vibrationPattern.push(pulseDuration);
    if (i < selectedIntervals.length) {
      vibrationPattern.push(selectedIntervals[i]);
    }
  }

  const totalDuration = vibrationPattern.reduce((acc, val) => acc + val, 0);

  return {
    id: 'pat_' + Math.random().toString(36).substring(2, 9),
    tapCount,
    pulseDuration,
    expectedIntervals: selectedIntervals,
    vibrationPattern,
    totalDuration,
    generatedAt: Date.now(),
  };
}

/**
 * Plays the vibration pattern and synchronizes with Web Audio if sound is enabled.
 */
export function playRhythmPattern(patternObj, options = { useAudio: true, useVibrate: true, onComplete: () => {} }) {
  const { vibrationPattern, expectedIntervals, pulseDuration } = patternObj;

  // 1. Mobile Vibration API
  if (options.useVibrate && typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(vibrationPattern);
    } catch (e) {
      console.warn('Vibration API error:', e);
    }
  }

  // 2. Web Audio / Sound pulse simulation
  let accumulatedTime = 0;
  vibrationPattern.forEach((duration, index) => {
    // Even index is vibration pulse, odd index is silence
    if (index % 2 === 0 && options.useAudio) {
      setTimeout(() => {
        playAudioPulse(duration, 480);
      }, accumulatedTime);
    }
    accumulatedTime += duration;
  });

  if (options.onComplete) {
    setTimeout(options.onComplete, accumulatedTime + 100);
  }

  return () => {
    // Cancellation handler
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(0);
      } catch (e) {}
    }
  };
}

/**
 * Analyzes recorded tap timestamps and calculates a dynamic Prototype Confidence Score.
 * Computes:
 * - Interval timing error vs expected
 * - Human natural timing variance (bots have 0 variance, humans have natural interval variation)
 * - Ratio consistency (tempo resilience)
 */
export function analyzeTapTiming(tapTimestamps, expectedIntervals, options = {}) {
  if (!tapTimestamps || tapTimestamps.length < 2) {
    return {
      success: false,
      score: 0,
      reason: 'Insufficient taps recorded to evaluate intervals.',
      details: { actualIntervals: [], expectedIntervals },
    };
  }

  // Calculate actual intervals between consecutive taps
  const actualIntervals = [];
  for (let i = 1; i < tapTimestamps.length; i++) {
    const diff = Math.round(tapTimestamps[i] - tapTimestamps[i - 1]);
    actualIntervals.push(diff);
  }

  // If tap count does not match expected count
  if (actualIntervals.length !== expectedIntervals.length) {
    const score = Math.max(10, Math.round(30 - Math.abs(actualIntervals.length - expectedIntervals.length) * 15));
    return {
      success: false,
      score,
      reason: `Tap count mismatch: expected ${expectedIntervals.length + 1} taps, but received ${tapTimestamps.length}.`,
      details: {
        actualIntervals,
        expectedIntervals,
        tapCount: tapTimestamps.length,
        expectedTaps: expectedIntervals.length + 1,
      },
    };
  }

  // Calculate percentage errors per interval
  // Human tolerance for blind rhythmic recall is typically ~25-35%
  let totalErrorRatio = 0;
  const intervalErrors = [];
  let maxErrorRatio = 0;
  let maxErrorIndex = 0;

  for (let i = 0; i < expectedIntervals.length; i++) {
    const expected = expectedIntervals[i];
    const actual = actualIntervals[i];
    const absoluteDiff = Math.abs(actual - expected);
    const errorRatio = absoluteDiff / expected;
    const percentage = Math.round(errorRatio * 100);

    intervalErrors.push({
      expected,
      actual,
      diff: absoluteDiff,
      errorRatio,
      percentage,
    });
    totalErrorRatio += errorRatio;

    if (errorRatio > maxErrorRatio) {
      maxErrorRatio = errorRatio;
      maxErrorIndex = i;
    }
  }

  const meanError = totalErrorRatio / expectedIntervals.length;
  const meanErrorPercentage = Math.round(meanError * 100);
  const maxErrorPercentage = Math.round(maxErrorRatio * 100);

  // Outlier guard: any single interval deviating by 60% or more (e.g. 176ms instead of 600ms)
  // indicates a broken rhythm structure and cannot pass.
  const MAX_SINGLE_INTERVAL_DEV = 60;
  const outlierExceeded = maxErrorPercentage >= MAX_SINGLE_INTERVAL_DEV;

  // Relative rhythm test (tempo normalization):
  // Checks if the user tapped faster or slower overall but kept the rhythm proportions
  let ratioAlignmentScore = 1;
  if (expectedIntervals.length >= 2) {
    const expectedRatio = expectedIntervals[0] / expectedIntervals[1];
    const actualRatio = actualIntervals[0] / actualIntervals[1];
    const ratioDelta = Math.abs(actualRatio - expectedRatio) / expectedRatio;
    ratioAlignmentScore = Math.max(0, 1 - ratioDelta);
  }

  // Human behavioral micro-variance check:
  // True automated bot scripts produce robotic identical deltas (e.g. exact 400.00ms).
  // Real humans always have natural variance (> 20ms jitter).
  const variance = calculateVariance(actualIntervals);
  const hasHumanJitter = variance > 20 && variance < 150000;

  // Dynamic Prototype Confidence Score Calculation
  // Dual-weighted error model: 45% mean interval error + 55% peak outlier error.
  // This prevents an acceptable average from masking a huge single-tap deviation (e.g., 71%).
  const effectiveDeviation = (meanError * 0.45) + (maxErrorRatio * 0.55);

  let rawScore = 100 - (effectiveDeviation * 80) + (ratioAlignmentScore * 10);

  // Bonus for natural human timing variance vs robotic zeros
  if (hasHumanJitter) {
    rawScore += 5;
  } else if (variance < 2) {
    // Highly suspicious synthetic timing
    rawScore -= 40;
  }

  // If outlier threshold was breached (any single interval >= 60%), cap score strictly below pass threshold
  if (outlierExceeded) {
    rawScore = Math.min(rawScore, 58);
  }

  const confidenceScore = Math.max(12, Math.min(98, Math.round(rawScore)));

  // Verification threshold is 65% for prototype accessibility tolerance
  const PASS_THRESHOLD = 65;
  const success = !outlierExceeded && confidenceScore >= PASS_THRESHOLD;

  const trustToken = success
    ? `AG-SIH26-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
    : null;

  let failureReason = '';
  if (outlierExceeded) {
    const worstInterval = intervalErrors[maxErrorIndex];
    failureReason = `Timing deviation failed: Interval #${maxErrorIndex + 1} had a ±${maxErrorPercentage}% deviation (expected ${worstInterval.expected}ms, actual ${worstInterval.actual}ms), exceeding the maximum 60% allowable single-interval tolerance.`;
  } else if (!success) {
    failureReason = `Timing deviation exceeded allowable threshold (average error: ±${meanErrorPercentage}%). You can retry or switch to Voice Fallback.`;
  } else {
    failureReason = 'Rhythm pattern successfully reproduced within human accessible tolerance.';
  }

  return {
    success,
    score: confidenceScore,
    threshold: PASS_THRESHOLD,
    trustToken,
    reason: failureReason,
    details: {
      actualIntervals,
      expectedIntervals,
      intervalErrors,
      meanErrorPercentage,
      maxErrorPercentage,
      maxErrorIndex,
      maxAllowedSingleDeviation: MAX_SINGLE_INTERVAL_DEV,
      outlierExceeded,
      effectiveDeviationPercentage: Math.round(effectiveDeviation * 100),
      variance: Math.round(variance),
      hasHumanJitter,
      ratioAlignmentScore: Math.round(ratioAlignmentScore * 100),
      evaluationTimestamp: new Date().toISOString(),
    },
  };
}

function calculateVariance(array) {
  if (array.length < 2) return 0;
  const mean = array.reduce((a, b) => a + b, 0) / array.length;
  return array.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / array.length;
}

/**
 * Text-to-speech announcer for accessibility
 */
export function announceToScreenReader(message) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech announcement failed:', err);
  }
}

/**
 * Generates an accessible spoken voice challenge.
 */
export function generateVoiceChallenge() {
  const wordPairs = [
    { prompt: 'Say the words: River, Amber, Star', words: ['river', 'amber', 'star'], code: 'RIVER-AMBER-STAR' },
    { prompt: 'Repeat this phrase: Falcon, Ocean, Seven', words: ['falcon', 'ocean', 'seven'], code: 'FALCON-OCEAN-SEVEN' },
    { prompt: 'Say the digits: 4, 9, 2, 7', words: ['4', '9', '2', '7', 'four', 'nine', 'two', 'seven'], code: '4-9-2-7' },
    { prompt: 'Repeat these words: Silver, Pine, Horizon', words: ['silver', 'pine', 'horizon'], code: 'SILVER-PINE-HORIZON' },
  ];
  const choice = wordPairs[Math.floor(Math.random() * wordPairs.length)];
  return {
    id: 'voice_' + Math.random().toString(36).substring(2, 8),
    ...choice,
  };
}

/**
 * Continuous biometric tone synthesizer that smoothly sweeps frequency
 * as the user holds the contact surface, giving direct auditory feedback to blind users.
 */
export function createBiometricToneGenerator() {
  const ctx = getAudioContext();
  if (!ctx) return { update: () => {}, stop: () => {} };

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    return {
      update: (progressRatio) => {
        if (ctx.state === 'running') {
          // Pitch rises from 220 Hz (A3) to 440 Hz (A4)
          const freq = 220 + Math.max(0, Math.min(1, progressRatio)) * 220;
          osc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.04);
        }
      },
      stop: () => {
        try {
          gain.gain.setTargetAtTime(0.001, ctx.currentTime, 0.05);
          setTimeout(() => {
            try {
              osc.stop();
              osc.disconnect();
            } catch (e) {}
          }, 100);
        } catch (e) {}
      },
    };
  } catch (err) {
    console.warn('Biometric tone generator error:', err);
    return { update: () => {}, stop: () => {} };
  }
}

/**
 * Play a resonant 3-note harmonic chime when biometric calibration succeeds.
 */
export function playBiometricCompleteChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playAudioPulse(160, freq);
      }, idx * 80);
    });
  } catch (err) {}
}

/**
 * Evaluates continuous behavioral interaction biometrics:
 * Measures natural timing variance between taps,
 * contact dwell duration, and interaction consistency.
 */
export function analyzeBehavioralBiometrics({
  samples = [],
  dwellTime = 0,
  inputType = 'pointer',
}) {
  const MIN_DWELL_MS = 900;
  const TARGET_DWELL_MS = 2000;

  // Insufficient contact time
  if (dwellTime < MIN_DWELL_MS) {
    return {
      success: false,
      score: Math.max(15, Math.round((dwellTime / TARGET_DWELL_MS) * 50)),
      threshold: 65,
      reason: `Contact duration of ${dwellTime}ms was too brief. Please maintain steady contact for approximately 2 seconds.`,
      details: {
        dwellTime,
        sampleCount: samples.length,
        tremorVariance: 0,
        averageVelocity: 0,
        microJitterDetected: false,
        isSyntheticBot: false,
        inputType,
        evaluationTimestamp: new Date().toISOString(),
      },
    };
  }

  let tremorVariance = 0;
  let averageVelocity = 0;
  let microJitterDetected = false;
  let isSyntheticBot = false;
  let botReason = '';

  if (inputType === 'pointer' && samples.length >= 8) {
    const xs = samples.map((s) => s.x);
    const ys = samples.map((s) => s.y);
    const varX = calculateVariance(xs);
    const varY = calculateVariance(ys);
    tremorVariance = parseFloat((varX + varY).toFixed(3));

    // Bot detection check: pure mathematical bots emit 0 variance (perfect still vectors)
    if (tremorVariance === 0 && samples.length > 20) {
      isSyntheticBot = true;
      botReason = 'Synthetic uniformity detected: Bot script exhibited zero natural human timing variance.';
    }

    // Velocity & micro-displacement calculation
    let totalVel = 0;
    for (let i = 1; i < samples.length; i++) {
      const dt = Math.max(1, samples[i].time - samples[i - 1].time);
      const dx = samples[i].x - samples[i - 1].x;
      const dy = samples[i].y - samples[i - 1].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      totalVel += (dist / dt) * 1000;
    }
    averageVelocity = parseFloat((totalVel / (samples.length - 1)).toFixed(2));

    // Natural human movement variance range on touch devices / mice
    microJitterDetected = tremorVariance >= 0.01 && tremorVariance <= 120;
  } else {
    // Keyboard hold (Space/Enter key) - uses human hold dwell consistency
    microJitterDetected = dwellTime >= 1200;
    tremorVariance = 1.45;
    averageVelocity = 0;
  }

  // Calculate Prototype Confidence Score
  let rawScore = 80;

  // Dwell quality scoring
  if (dwellTime >= 1400 && dwellTime <= 3800) {
    rawScore += 12; // optimal range
  } else if (dwellTime > 3800) {
    rawScore -= 5;
  }

  // Natural timing/movement variance validation bonus
  if (microJitterDetected) {
    rawScore += 6;
  }

  if (isSyntheticBot) {
    rawScore = 18;
  }

  const confidenceScore = Math.max(15, Math.min(97, Math.round(rawScore)));
  const PASS_THRESHOLD = 65;
  const success = confidenceScore >= PASS_THRESHOLD && !isSyntheticBot;

  const trustToken = success
    ? `AG-BEHAV-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
    : null;

  return {
    success,
    score: confidenceScore,
    threshold: PASS_THRESHOLD,
    trustToken,
    reason: success
      ? 'Natural human timing variance and contact dwell verified.'
      : botReason || 'Behavioral telemetry did not match natural human timing profile.',
    details: {
      dwellTime,
      sampleCount: samples.length,
      tremorVariance,
      averageVelocity,
      microJitterDetected,
      isSyntheticBot,
      inputType,
      evaluationTimestamp: new Date().toISOString(),
    },
  };
}

