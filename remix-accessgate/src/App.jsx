import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import ProgressIndicator from './components/ProgressIndicator';
import VerificationScreen from './components/VerificationScreen';
import DeviceCheck from './components/DeviceCheck';
import HapticChallenge from './components/HapticChallenge';
import BehavioralChallenge from './components/BehavioralChallenge';
import VoiceFallback from './components/VoiceFallback';
import ResultBadge from './components/ResultBadge';
import AccessibilityPanel from './components/AccessibilityPanel';
import HowItWorks from './components/HowItWorks';
import DeviceFrame from './components/DeviceFrame';
import { announceToScreenReader } from './utils/verification';
import './styles/App.css';

export default function App() {
  // Navigation Flow: 'welcome' -> 'device-check' -> 'challenge' / 'voice-fallback' -> 'result'
  const [currentStep, setCurrentStep] = useState('welcome');
  const [verificationResult, setVerificationResult] = useState(null);
  const [activeMode, setActiveMode] = useState('haptic'); // 'haptic' | 'behavioral' | 'voice'
  const [deviceCheckCompleted, setDeviceCheckCompleted] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);

  // Modal / Drawer visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isPhoneMode, setIsPhoneMode] = useState(false);


  // Auto-dismiss transient notice messages
  useEffect(() => {
    if (noticeMessage) {
      const timer = setTimeout(() => {
        setNoticeMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [noticeMessage]);

  // Accessibility State
  const [settings, setSettings] = useState({
    fontSize: 'normal', // 'normal' | 'large' | 'xl'
    highContrast: false,
    voiceGuidance: true, // Screen reader narration via Web Speech
    audioFeedback: true, // Dual audio pulses for desktop/mobile
    reducedMotion: false,
  });

  // Global screen reader announcer
  const voiceAnnounce = useCallback(
    (text) => {
      if (settings.voiceGuidance) {
        announceToScreenReader(text);
      }
    },
    [settings.voiceGuidance]
  );

  // Synchronize accessibility styles with document.body
  useEffect(() => {
    const body = document.body;

    // High Contrast
    if (settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Font Sizing
    body.classList.remove('font-size-large', 'font-size-xl');
    if (settings.fontSize === 'large') {
      body.classList.add('font-size-large');
    } else if (settings.fontSize === 'xl') {
      body.classList.add('font-size-xl');
    }

    // Reduced Motion
    if (settings.reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }
  }, [settings]);

  // Flow handlers
  const handleStartVerification = () => {
    setActiveMode('haptic');
    setDeviceCheckCompleted(false);
    setVerificationResult(null);
    setNoticeMessage(null);
    setCurrentStep('device-check');
    voiceAnnounce('Starting verification. Step 1: Checking device and browser accessibility capabilities.');
  };

  const handleStartHaptic = () => {
    setActiveMode('haptic');
    setDeviceCheckCompleted(false);
    setVerificationResult(null);
    setNoticeMessage(null);
    setCurrentStep('device-check');
    voiceAnnounce('Selected Haptic Rhythm Verification. Starting with Step 1: Device Check.');
  };

  const handleStartBehavioral = () => {
    setActiveMode('behavioral');
    setDeviceCheckCompleted(false);
    setVerificationResult(null);
    setNoticeMessage(null);
    setCurrentStep('device-check');
    voiceAnnounce('Selected Behavioral Interaction Pattern. Starting with Step 1: Device Check.');
  };

  const handleStartVoice = () => {
    setActiveMode('voice');
    setDeviceCheckCompleted(false);
    setVerificationResult(null);
    setNoticeMessage(null);
    setCurrentStep('device-check');
    voiceAnnounce('Selected Acoustic Voice Fallback Verification. Starting with Step 1: Device Check.');
  };

  const handleProceedHaptic = () => {
    setActiveMode('haptic');
    setDeviceCheckCompleted(true);
    setNoticeMessage(null);
    setCurrentStep('challenge');
    voiceAnnounce('Device Check complete. Proceeding to Haptic Challenge.');
  };

  const handleProceedBehavioral = () => {
    setActiveMode('behavioral');
    setDeviceCheckCompleted(true);
    setNoticeMessage(null);
    setCurrentStep('challenge');
    voiceAnnounce('Device Check complete. Proceeding to Behavioral Interaction Pattern Challenge.');
  };

  const handleProceedVoice = () => {
    setActiveMode('voice');
    setDeviceCheckCompleted(true);
    setNoticeMessage(null);
    setCurrentStep('voice-fallback');
    voiceAnnounce('Device Check complete. Proceeding to Voice Fallback verification.');
  };

  const handleVerificationComplete = (result) => {
    setVerificationResult(result);
    setNoticeMessage(null);
    setCurrentStep('result');
    if (result.success) {
      voiceAnnounce(
        `Verification Successful. Human presence confirmed with Prototype Confidence Score of ${result.score} percent.`
      );
    } else {
      voiceAnnounce(
        `Verification Unsuccessful. Prototype Confidence Score was ${result.score} percent. You can retry or switch verification channels.`
      );
    }
  };

  const handleResetToWelcome = () => {
    setCurrentStep('welcome');
    setDeviceCheckCompleted(false);
    setVerificationResult(null);
    setNoticeMessage(null);
    voiceAnnounce('Returned to AccessGate welcome screen.');
  };

  const handleRetryHaptic = () => {
    setActiveMode('haptic');
    setCurrentStep('challenge');
    setNoticeMessage(null);
    voiceAnnounce('Retrying rhythm challenge.');
  };

  const handleRetryBehavioral = () => {
    setActiveMode('behavioral');
    setCurrentStep('challenge');
    setNoticeMessage(null);
    voiceAnnounce('Retrying Behavioral Interaction Pattern challenge.');
  };

  const handleRetryVoice = () => {
    setActiveMode('voice');
    setCurrentStep('voice-fallback');
    setNoticeMessage(null);
    voiceAnnounce('Switching to Voice Fallback challenge.');
  };

  const handleBlockedStep = (reason) => {
    const msg = reason || 'Please complete the current task before proceeding to the next step.';
    setNoticeMessage(msg);
    voiceAnnounce(msg);
  };

  const handleNavigateStep = (stepId) => {
    // Going back to device check is always allowed from challenge or result
    if (stepId === 'device-check') {
      setCurrentStep('device-check');
      setNoticeMessage(null);
      voiceAnnounce('Navigated back to Device Check.');
      return;
    }

    // Advancing to challenge requires device-check to be completed first
    if (stepId === 'challenge' || stepId === 'voice-fallback') {
      if (!deviceCheckCompleted && currentStep === 'device-check') {
        handleBlockedStep('Please complete Device Check first before proceeding to the challenge.');
        return;
      }
      setNoticeMessage(null);
      if (activeMode === 'voice') {
        setCurrentStep('voice-fallback');
        voiceAnnounce('Navigated to Voice Fallback challenge.');
      } else {
        setCurrentStep('challenge');
        voiceAnnounce(
          `Navigated to ${activeMode === 'behavioral' ? 'Behavioral Interaction Pattern' : 'Haptic Rhythm'} challenge.`
        );
      }
      return;
    }

    // Advancing to result requires the challenge to be completed first
    if (stepId === 'result') {
      if (!verificationResult) {
        handleBlockedStep('Please complete the verification challenge first before viewing results.');
        return;
      }
      setNoticeMessage(null);
      setCurrentStep('result');
      voiceAnnounce('Navigated to Verification Result.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#241E1E]">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#3E1220] focus:text-[#C9962F] focus:rounded-lg focus:font-bold"
      >
        Skip to main content
      </a>

      {/* Global Live Region for assistive tech */}
      <div
        id="global-announcer"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Header */}
      <Header
        currentStep={currentStep}
        onReset={handleResetToWelcome}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        isPhoneMode={isPhoneMode}
        onTogglePhoneMode={() => setIsPhoneMode((prev) => !prev)}
        voiceEnabled={settings.voiceGuidance}
        onToggleVoice={() =>
          setSettings((prev) => ({
            ...prev,
            voiceGuidance: !prev.voiceGuidance,
          }))
        }
      />

      {/* Device Frame Viewport Mockup Container */}
      <DeviceFrame
        isPhoneMode={isPhoneMode}
        onTogglePhoneMode={() => setIsPhoneMode((prev) => !prev)}
      >
        {/* Stepper / Progress Bar (when inside verification flow) */}
        {currentStep !== 'welcome' && (
          <ProgressIndicator
            currentStep={currentStep}
            mode={activeMode}
            deviceCheckCompleted={deviceCheckCompleted}
            verificationCompleted={!!verificationResult}
            onNavigateStep={handleNavigateStep}
            onBlockedStep={handleBlockedStep}
            noticeMessage={noticeMessage}
          />
        )}

        {/* Main Content Area with Smooth Motion Transitions */}
        <main id="main-content" className="flex-1 pb-12 focus:outline-hidden" tabIndex={-1}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStep}-${activeMode}`}
              initial={{ opacity: 0, y: settings.reducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: settings.reducedMotion ? 0 : -8 }}
              transition={{ duration: settings.reducedMotion ? 0 : 0.2, ease: 'easeOut' }}
            >
              {currentStep === 'welcome' && (
                <VerificationScreen
                  onStartVerification={handleStartVerification}
                  onStartHaptic={handleStartHaptic}
                  onStartBehavioral={handleStartBehavioral}
                  onStartVoice={handleStartVoice}
                />
              )}

              {currentStep === 'device-check' && (
                <DeviceCheck
                  mode={activeMode}
                  onProceedHaptic={handleProceedHaptic}
                  onProceedBehavioral={handleProceedBehavioral}
                  onProceedVoice={handleProceedVoice}
                  voiceAnnounce={voiceAnnounce}
                />
              )}

              {currentStep === 'challenge' && activeMode === 'haptic' && (
                <HapticChallenge
                  mode={activeMode}
                  onVerificationComplete={handleVerificationComplete}
                  onSwitchToBehavioral={handleProceedBehavioral}
                  onSwitchToVoice={handleProceedVoice}
                  onBackToDeviceCheck={() => handleNavigateStep('device-check')}
                  audioFeedback={settings.audioFeedback}
                  voiceAnnounce={voiceAnnounce}
                />
              )}

              {currentStep === 'challenge' && activeMode === 'behavioral' && (
                <BehavioralChallenge
                  onVerificationComplete={handleVerificationComplete}
                  onSwitchToHaptic={handleProceedHaptic}
                  onSwitchToVoice={handleProceedVoice}
                  audioFeedback={settings.audioFeedback}
                  voiceAnnounce={voiceAnnounce}
                />
              )}

              {currentStep === 'voice-fallback' && (
                <VoiceFallback
                  onVerificationComplete={handleVerificationComplete}
                  onSwitchToHaptic={handleProceedHaptic}
                  onBackToDeviceCheck={() => handleNavigateStep('device-check')}
                  voiceAnnounce={voiceAnnounce}
                />
              )}

              {currentStep === 'result' && (
                <ResultBadge
                  result={verificationResult}
                  onRetryHaptic={handleRetryHaptic}
                  onRetryBehavioral={handleRetryBehavioral}
                  onRetryVoice={handleRetryVoice}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </DeviceFrame>

      {/* Accessibility Preferences Modal */}
      <AccessibilityPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* How It Works Modal */}
      <HowItWorks
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}
