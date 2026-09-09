import React from 'react';
import { ShieldCheck, Sliders, HelpCircle, RotateCcw, Volume2, Sparkles } from 'lucide-react';

export default function Header({
  currentStep,
  onReset,
  onOpenSettings,
  onOpenHowItWorks,
  voiceEnabled,
  onToggleVoice,
}) {
  return (
    <header
      id="accessgate-header"
      className="bg-[#3E1220] text-white shadow-md border-b border-[#C9962F]/30 sticky top-0 z-40"
      role="banner"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-3 text-left focus-visible:ring-2 focus-visible:ring-[#C9962F] rounded-lg p-1 transition-opacity hover:opacity-90"
            aria-label="AccessGate Home - Accessible CAPTCHA Alternative"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#C9962F] text-[#3E1220] flex items-center justify-center font-bold shadow-inner">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  AccessGate
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider bg-[#C9962F]/20 text-[#E8DDC7] border border-[#C9962F]/40 px-2 py-0.5 rounded-full">
                  SIH 2026 • MS-05
                </span>
              </div>
              <p className="text-xs text-[#E8DDC7]/90 font-medium hidden xs:block">
                Accessible verification for everyone
              </p>
            </div>
          </button>
        </div>

        {/* Global Controls & Accessibility Shortcuts */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Voice Narration Toggle */}
          <button
            type="button"
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              voiceEnabled
                ? 'bg-[#C9962F] text-[#3E1220] border-[#C9962F]'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
            }`}
            aria-pressed={voiceEnabled}
            aria-label={voiceEnabled ? 'Voice guide narration enabled. Press to mute' : 'Voice guide narration disabled. Press to enable'}
            title="Audio speech narrator for instructions"
          >
            <Volume2 className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">{voiceEnabled ? 'Voice: On' : 'Voice: Off'}</span>
          </button>

          {/* How It Works Modal Trigger */}
          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors"
            aria-label="Learn how the 3-layer verification works"
          >
            <HelpCircle className="w-4 h-4 text-[#C9962F]" aria-hidden="true" />
            <span className="hidden md:inline">How It Works</span>
          </button>

          {/* Accessibility Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#C9962F] hover:bg-[#b58525] text-[#3E1220] transition-colors shadow-sm font-bold"
            aria-label="Open Accessibility Settings panel"
          >
            <Sliders className="w-4 h-4" aria-hidden="true" />
            <span>Accessibility</span>
          </button>

          {/* Return Home / Reset if active */}
          {currentStep !== 'welcome' && (
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
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
