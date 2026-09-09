import React from 'react';
import { Smartphone, Wifi, Battery, Radio } from 'lucide-react';

/**
 * DeviceFrame - Mobile Phone Mockup Container
 * Frames the application in a realistic smartphone viewport to visually reinforce
 * the mobile-first haptic vibration and tactile touch design during hackathon demos.
 */
export default function DeviceFrame({ isPhoneMode, onTogglePhoneMode, children }) {
  if (!isPhoneMode) {
    return <>{children}</>;
  }

  // Get current time formatted for status bar
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  return (
    <div className="w-full flex flex-col items-center py-4 px-2">
      {/* Phone Mode Banner with quick toggle */}
      <div className="w-full max-w-sm sm:max-w-md flex items-center justify-between px-3 py-1.5 mb-3 bg-[#3E1220]/10 rounded-full border border-[#C9962F]/30 text-xs text-[#3E1220]">
        <span className="flex items-center gap-1.5 font-bold">
          <Smartphone className="w-3.5 h-3.5 text-[#C9962F]" />
          Mobile Viewport Demo Mode
        </span>
        <button
          type="button"
          onClick={onTogglePhoneMode}
          className="font-extrabold text-[#3E1220] hover:text-[#C9962F] transition-colors underline cursor-pointer text-[11px]"
        >
          Exit to Fullscreen
        </button>
      </div>

      {/* Realistic Smartphone Mockup Bezel */}
      <div className="relative w-full max-w-[430px] rounded-[48px] bg-[#1C1917] p-3 shadow-2xl ring-12 ring-stone-900/10 border-4 border-stone-800">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center gap-2 shadow-inner pointer-events-none">
          {/* Camera Lens */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A24] border border-[#2E2E3A] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#0D0D14]" />
          </div>
          {/* Sensor */}
          <div className="w-1.5 h-1.5 rounded-full bg-[#0F172A]" />
        </div>

        {/* Volume Button Notches on Left Bezel */}
        <div className="absolute -left-1.5 top-24 w-1 h-12 bg-stone-700 rounded-l-md" />
        <div className="absolute -left-1.5 top-40 w-1 h-12 bg-stone-700 rounded-l-md" />

        {/* Power Button Notch on Right Bezel */}
        <div className="absolute -right-1.5 top-28 w-1 h-16 bg-stone-700 rounded-r-md" />

        {/* Screen Display Container */}
        <div className="w-full bg-[#FAF6EE] rounded-[40px] overflow-hidden flex flex-col min-h-[640px] max-h-[85vh] overflow-y-auto relative">
          {/* Mobile Status Bar */}
          <div className="w-full px-7 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#3E1220] select-none shrink-0 bg-[#FAF6EE]/90 backdrop-blur-xs sticky top-0 z-30">
            <span>{timeString}</span>
            <div className="flex items-center gap-1.5 text-[#3E1220]">
              <span className="text-[10px] font-extrabold font-mono tracking-tighter">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-current" />
            </div>
          </div>

          {/* Child Content inside phone */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Home Bar Indicator at Bottom */}
          <div className="w-full py-2 bg-[#FAF6EE]/90 backdrop-blur-xs flex items-center justify-center sticky bottom-0 z-30 shrink-0">
            <div className="w-32 h-1 bg-[#3E1220]/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
