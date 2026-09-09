import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Vibrate,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { generateVoiceChallenge, checkDeviceCapabilities } from '../utils/verification';
import WaveformVisualizer from './WaveformVisualizer';
import EvaluationAnticipation from './EvaluationAnticipation';
import { IconAcousticVoice, IconAudioPulse } from './CustomIcons';

export default function VoiceFallback({
  onVerificationComplete,
  onSwitchToHaptic,
  onBackToDeviceCheck,
  voiceAnnounce,
}) {
  const [challenge, setChallenge] = useState(null);
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [capabilities, setCapabilities] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [pendingEvaluation, setPendingEvaluation] = useState(null);
  const recognitionRef = useRef(null);

  // Initialize challenge
  const loadChallenge = () => {
    const newChallenge = generateVoiceChallenge();
    setChallenge(newChallenge);
    setTranscript('');
    setErrorMsg('');
    setIsEvaluating(false);
    setPendingEvaluation(null);
    const promptText = `Voice Challenge: ${newChallenge.prompt}. Press Speak Prompt to listen.`;
    voiceAnnounce(promptText);
  };

  useEffect(() => {
    const caps = checkDeviceCapabilities();
    setCapabilities(caps);
    loadChallenge();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  // Speak challenge prompt using SpeechSynthesis
  const speakPrompt = () => {
    if (!challenge || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setIsSpeakingPrompt(true);

    const utterance = new SpeechSynthesisUtterance(challenge.prompt);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeakingPrompt(false);
    };
    utterance.onerror = () => {
      setIsSpeakingPrompt(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Start speech recognition
  const startListening = () => {
    setErrorMsg('');
    setTranscript('');

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setErrorMsg(
        'Speech Recognition API is not supported in this browser. Please use Chrome, Edge, or return to Haptic Challenge.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        voiceAnnounce('Microphone listening now. Speak clearly.');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access was denied. Please allow microphone permissions or retry.');
        } else if (event.error === 'no-speech') {
          setErrorMsg('No speech was detected. Please click Start Speaking again.');
        } else {
          setErrorMsg(`Voice recognition error: ${event.error}.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not initialize microphone recognition.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  // Evaluate voice transcript against challenge keywords
  const handleVerifyVoice = () => {
    if (!transcript.trim()) {
      setErrorMsg('Please speak the requested phrase before submitting.');
      return;
    }

    const spoken = transcript.toLowerCase();
    const matchedCount = challenge.words.filter((word) => spoken.includes(word)).length;
    const matchPercentage = Math.round((matchedCount / challenge.words.length) * 100);

    // Human behavioral score for voice (matching words + transcript quality)
    const success = matchedCount >= Math.ceil(challenge.words.length * 0.7);
    const score = success ? Math.min(95, 70 + matchPercentage * 0.25) : Math.max(15, matchPercentage * 0.5);

    const trustToken = success
      ? `AG-VOICE-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
      : null;

    setPendingEvaluation({
      success,
      score: Math.round(score),
      threshold: 65,
      trustToken,
      challengeType: 'voice',
      reason: success
        ? 'Spoken challenge verified successfully with expected acoustic keywords.'
        : 'Spoken phrase did not match required verification words. Please try again.',
      details: {
        expectedPrompt: challenge.prompt,
        spokenTranscript: transcript,
        matchedKeywords: matchedCount,
        totalKeywords: challenge.words.length,
        evaluationTimestamp: new Date().toISOString(),
      },
    });
    setIsEvaluating(true);
  };

  const handleAnticipationComplete = () => {
    if (pendingEvaluation) {
      onVerificationComplete(pendingEvaluation);
    }
  };

  if (isEvaluating) {
    return (
      <EvaluationAnticipation
        channel="voice"
        durationMs={1300}
        onComplete={handleAnticipationComplete}
      />
    );
  }

  const hasRecognitionSupport =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-4 sm:py-6"
      role="region"
      aria-labelledby="voice-fallback-title"
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
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3E1220]/5 text-[#3E1220] text-xs font-bold uppercase tracking-wider border border-[#3E1220]/10">
              <IconAcousticVoice className="w-3.5 h-3.5 text-[#C9962F]" aria-hidden="true" />
              Layer 3: Spoken Voice Fallback
            </span>
          </div>

          <h2
            id="voice-fallback-title"
            className="text-2xl sm:text-3xl font-black text-[#3E1220] tracking-tight"
          >
            Voice Verification
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            For users on devices without vibration motors or when haptic reproduction is impractical.
            Listen to the short phrase, then speak it back using your microphone.
          </p>
        </div>

        {/* Challenge Box */}
        {challenge && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#FAF6EE] border-2 border-[#E8DDC7] text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Verification Challenge Prompt
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#3E1220]">
                {challenge.prompt}
              </p>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={speakPrompt}
                  disabled={isSpeakingPrompt}
                  className="px-5 py-2.5 rounded-xl bg-[#3E1220] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#2e0b16] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962F] cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-[#C9962F]" aria-hidden="true" />
                  {isSpeakingPrompt ? 'Speaking Prompt...' : 'Listen to Prompt Out Loud'}
                </button>
              </div>

              {isSpeakingPrompt && (
                <div className="pt-3 max-w-sm mx-auto">
                  <WaveformVisualizer state="playing" label="Acoustic Voice Synthesis" />
                </div>
              )}
            </div>

            {/* Error banner if any */}
            {errorMsg && (
              <div
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Speech Recognition Controls */}
            {!hasRecognitionSupport ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs leading-relaxed">
                <strong>Speech Recognition Notice:</strong> Your current browser does not support the
                Web Speech Recognition API. We do not fake verification results. Please switch to Google
                Chrome/Edge or return to the Haptic Rhythm Challenge.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#E8DDC7] rounded-2xl bg-[#FAF6EE]/30 relative overflow-hidden">
                  {/* Radar Wave ring behind mic button */}
                  {!isListening && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                      <div className="w-32 h-32 rounded-full border border-[#C9962F]/30 animate-radar" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all shadow-md z-10 cursor-pointer ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-200'
                        : 'bg-[#C9962F] text-[#3E1220] hover:bg-[#b58525]'
                    }`}
                    aria-label={isListening ? 'Stop recording microphone' : 'Start speaking response'}
                  >
                    {isListening ? (
                      <MicOff className="w-10 h-10" />
                    ) : (
                      <Mic className="w-10 h-10" />
                    )}
                  </button>

                  <span className="mt-4 text-sm font-extrabold text-[#3E1220] z-10">
                    {isListening ? 'Listening... Speak your phrase now' : 'Click microphone to answer'}
                  </span>

                  {/* Real-time live microphone waveform feedback */}
                  {isListening && (
                    <div className="w-full max-w-sm mt-3 z-10">
                      <WaveformVisualizer state="recording" label="Live Microphone Acoustic Stream" />
                    </div>
                  )}

                  {/* Real-time transcript display */}
                  <div
                    className="w-full max-w-md mt-4 p-3.5 rounded-xl bg-white border border-[#E8DDC7] min-h-[48px] flex items-center justify-center text-center text-sm font-mono text-stone-800 shadow-2xs z-10"
                    aria-live="polite"
                  >
                    {transcript ? (
                      <span className="font-semibold text-[#3E1220]">"{transcript}"</span>
                    ) : (
                      <span className="text-stone-400 italic">Spoken transcript will appear here...</span>
                    )}
                  </div>
                </div>

                {/* Submit Spoken Response */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
                  <button
                    type="button"
                    onClick={loadChallenge}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    New Spoken Challenge
                  </button>

                  <button
                    type="button"
                    onClick={handleVerifyVoice}
                    disabled={!transcript.trim()}
                    className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 ${
                      transcript.trim()
                        ? 'bg-[#C9962F] text-[#3E1220] hover:bg-[#b58525] shadow-sm cursor-pointer'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    Verify Voice Response
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back to Haptic Switch */}
        <div className="mt-8 pt-5 border-t border-[#E8DDC7] flex items-center justify-between text-xs">
          <span className="text-stone-500 font-medium">Prefer touch & vibration?</span>
          <button
            type="button"
            onClick={onSwitchToHaptic}
            className="font-bold text-[#3E1220] underline hover:text-[#C9962F] flex items-center gap-1 cursor-pointer"
          >
            <Vibrate className="w-3.5 h-3.5" />
            Switch back to Haptic Challenge
          </button>
        </div>
      </div>
    </div>
  );
}

