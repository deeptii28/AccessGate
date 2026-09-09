import React from 'react';
import {
  Sliders,
  HelpCircle,
  RotateCcw,
  Volume2,
  Monitor,
} from 'lucide-react';
import {
  IconBrandShield,
  IconDeviceDiagnostic,
} from './CustomIcons';

export default function Header({
  currentStep,
  onReset,
  onOpenSettings,
  onOpenHowItWorks,
  isPhoneMode,
  onTogglePhoneMode,
  voiceEnabled,
  onToggleVoice,
}) {
  return (
    <header
      id="accessgate-header"
      className="bg-[#3E1220] text-white shadow-md border-b border-[#C9962F]/30 sticky top-0 z-40"
      role="banner"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 sm:gap-3 text-left focus-visible:ring-2 focus-visible:ring-[#C9962F] rounded-xl p-1 transition-opacity hover:opacity-90 cursor-pointer"
            aria-label="AccessGate Home - Accessible CAPTCHA Alternative"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#54192B] to-[#3E1220] border-2 border-[#C9962F] text-[#C9962F] flex items-center justify-center font-bold shadow-md">
              <IconBrandShield className="w-6 h-6 text-[#C9962F]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white">
                  AccessGate
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-[#C9962F]/20 text-[#E8DDC7] border border-[#C9962F]/40 px-2 py-0.5 rounded-full">
                  SIH 2026 • MS-05
                </span>
              </div>
              <p className="text-[11px] text-[#E8DDC7]/85 font-medium hidden xs:block">
                Accessible verification for everyone
              </p>
            </div>
          </button>
        </div>

        {/* Global Controls & Accessibility Shortcuts */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Phone Viewport Demo Mode Toggle */}
          <button
            type="button"
            onClick={onTogglePhoneMode}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border cursor-pointer ${
              isPhoneMode
                ? 'bg-[#C9962F] text-[#3E1220] border-[#C9962F] font-bold'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
            }`}
            aria-pressed={isPhoneMode}
            aria-label={isPhoneMode ? 'Switch to Fullscreen Desktop View' : 'Switch to Mobile Phone Viewport Demo'}
            title="Toggle realistic smartphone demo mockup"
          >
            {isPhoneMode ? (
              <>
                <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden md:inline">Full Width</span>
              </>
            ) : (
              <>
                <IconDeviceDiagnostic className="w-3.5 h-3.5 text-[#C9962F]" aria-hidden="true" />
                <span className="hidden md:inline">Phone View</span>
              </>
            )}
          </button>

          {/* Quick Voice Narration Toggle */}
          <button
            type="button"
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border cursor-pointer ${
              voiceEnabled
                ? 'bg-[#C9962F] text-[#3E1220] border-[#C9962F]'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
            }`}
            aria-pressed={voiceEnabled}
            aria-label={voiceEnabled ? 'Voice guide narration enabled. Press to mute' : 'Voice guide narration disabled. Press to enable'}
            title="Audio speech narrator for instructions"
          >
            <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden lg:inline">{voiceEnabled ? 'Voice: On' : 'Voice: Off'}</span>
          </button>

          {/* How It Works Modal Trigger */}
          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors cursor-pointer"
            aria-label="Learn how the 3-layer verification works"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#C9962F]" aria-hidden="true" />
            <span className="hidden md:inline">How It Works</span>
          </button>

          {/* Accessibility Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-[#C9962F] hover:bg-[#b58525] text-[#3E1220] transition-colors shadow-sm cursor-pointer"
            aria-label="Open Accessibility Settings panel"
          >
            <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden xs:inline">Settings</span>
          </button>

          {/* Return Home / Reset if active */}
          {currentStep !== 'welcome' && (
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Reset challenge and return to welcome screen"
              title="Return to Welcome"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
