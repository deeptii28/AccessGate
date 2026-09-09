import React, { useEffect } from 'react';
import { X, Type, Eye, Sparkles, Volume2, Vibrate } from 'lucide-react';
import { playAudioPulse } from '../utils/verification';

export default function AccessibilityPanel({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const testVibration = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([150, 80, 150]);
    }
    if (settings.audioFeedback) {
      playAudioPulse(120, 520);
      setTimeout(() => playAudioPulse(120, 520), 230);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-panel-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div
        id="accessibility-panel-container"
        className="bg-white border-2 border-[#C9962F] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative focus:outline-hidden"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DDC7]">
          <div>
            <h2
              id="accessibility-panel-title"
              className="text-xl font-bold text-[#3E1220] flex items-center gap-2"
            >
              <Eye className="w-5 h-5 text-[#C9962F]" aria-hidden="true" />
              Accessibility Preferences
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Customize tactile, auditory, and visual feedback for your comfort.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-600 hover:text-[#3E1220] hover:bg-stone-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962F]"
            aria-label="Close accessibility settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-6">
          <fieldset className="space-y-2">
            <legend className="text-sm font-bold text-[#3E1220] flex items-center gap-2">
              <Type className="w-4 h-4 text-[#C9962F]" aria-hidden="true" />
              Display Font Size
            </legend>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'normal', label: 'Standard' },
                { id: 'large', label: 'Large (112%)' },
                { id: 'xl', label: 'X-Large (125%)' },
              ].map((item) => {
                const isSelected = settings.fontSize === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, fontSize: item.id })}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? 'bg-[#C9962F] text-[#3E1220] border-[#C9962F] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-[#E8DDC7] hover:bg-stone-100'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8DDC7] bg-[#FAF6EE]/50">
            <div className="pr-3">
              <span className="text-sm font-bold text-[#3E1220] block">High Contrast Mode</span>
              <span className="text-xs text-stone-600 block mt-0.5">
                Enhanced dark canvas with pure gold borders for maximum legibility.
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.highContrast}
              onClick={() => onUpdateSettings({ ...settings, highContrast: !settings.highContrast })}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.highContrast ? 'bg-[#3E1220]' : 'bg-stone-300'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.highContrast ? 'translate-x-6 bg-[#C9962F]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8DDC7] bg-[#FAF6EE]/50">
            <div className="pr-3">
              <span className="text-sm font-bold text-[#3E1220] flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#C9962F]" aria-hidden="true" />
                Spoken Screen Prompts
              </span>
              <span className="text-xs text-stone-600 block mt-0.5">
                Automatically announces challenge state and instructions using Speech Synthesis.
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.voiceGuidance}
              onClick={() => onUpdateSettings({ ...settings, voiceGuidance: !settings.voiceGuidance })}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.voiceGuidance ? 'bg-[#3E1220]' : 'bg-stone-300'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.voiceGuidance ? 'translate-x-6 bg-[#C9962F]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8DDC7] bg-[#FAF6EE]/50">
            <div className="pr-3">
              <span className="text-sm font-bold text-[#3E1220] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C9962F]" aria-hidden="true" />
                Audio-Assisted Rhythm Pulses
              </span>
              <span className="text-xs text-stone-600 block mt-0.5">
                Plays synced gentle audio clicks alongside vibration pulses (ideal on desktop).
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.audioFeedback}
              onClick={() => onUpdateSettings({ ...settings, audioFeedback: !settings.audioFeedback })}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.audioFeedback ? 'bg-[#3E1220]' : 'bg-stone-300'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.audioFeedback ? 'translate-x-6 bg-[#C9962F]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8DDC7] bg-[#FAF6EE]/50">
            <div className="pr-3">
              <span className="text-sm font-bold text-[#3E1220] block">Reduced Motion</span>
              <span className="text-xs text-stone-600 block mt-0.5">
                Eliminate transitions, spring animations, and visual pulses.
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.reducedMotion}
              onClick={() => onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion })}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.reducedMotion ? 'bg-[#3E1220]' : 'bg-stone-300'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.reducedMotion ? 'translate-x-6 bg-[#C9962F]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={testVibration}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-[#C9962F] text-[#3E1220] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#C9962F]/15 transition-colors"
            >
              <Vibrate className="w-4 h-4 text-[#C9962F]" aria-hidden="true" />
              Test Haptic / Audio Pulse Now
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8DDC7] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#C9962F] text-[#3E1220] font-extrabold text-sm hover:bg-[#b58525] transition-colors shadow-sm"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
