import React from 'react';
import {
  X,
  Vibrate,
  Activity,
  Mic,
  ShieldCheck,
  Award,
  Users,
  EyeOff,
  EarOff,
  Lock,
} from 'lucide-react';

export default function HowItWorks({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div
        className="bg-white border-2 border-[#C9962F] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DDC7]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9962F] block">
              Smart India Hackathon 2026 • MS-05
            </span>
            <h2
              id="how-it-works-title"
              className="text-xl sm:text-2xl font-extrabold text-[#3E1220]"
            >
              How AccessGate Works
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-600 hover:text-[#3E1220] hover:bg-stone-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962F]"
            aria-label="Close How It Works dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-6 space-y-6">
          {/* Intro */}
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Traditional visual CAPTCHAs rely on distorted text, and audio alternatives often use noisy,
            garbled recordings that exclude blind and deaf-blind citizens. <strong>AccessGate</strong> provides an
            accessibility-first, multi-layered verification paradigm that works completely without sight.
          </p>

          {/* Three Layers */}
          <div className="space-y-4">
            {/* Layer 1 */}
            <div className="p-4 rounded-xl border border-[#E8DDC7] bg-[#FAF6EE]/50 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#3E1220] text-[#C9962F] flex items-center justify-center shrink-0">
                <Vibrate className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#C9962F] uppercase tracking-wider">
                  Layer 1
                </span>
                <h3 className="text-sm font-bold text-[#3E1220]">
                  Haptic Rhythm Generation
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  The mobile device plays a randomly generated vibration sequence using the W3C Vibration API.
                  The user feels the pattern and reproduces it by tapping the responsive touch target.
                </p>
              </div>
            </div>

            {/* Layer 2 */}
            <div className="p-4 rounded-xl border border-[#E8DDC7] bg-[#FAF6EE]/50 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#3E1220] text-[#C9962F] flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#C9962F] uppercase tracking-wider">
                  Layer 2
                </span>
                <h3 className="text-sm font-bold text-[#3E1220]">
                  Behavioral Interaction Pattern
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  High-precision timing (<code className="text-[11px] font-mono bg-stone-100 px-1 py-0.5 rounded">performance.now()</code>)
                  measures natural timing variance between taps, contact dwell dynamics, and human rhythm variance.
                  Automated bot scripts typically produce uniform timing patterns, which this layer is designed to detect and flag.
                </p>
              </div>
            </div>

            {/* Layer 3 */}
            <div className="p-4 rounded-xl border border-[#E8DDC7] bg-[#FAF6EE]/50 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#3E1220] text-[#C9962F] flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#C9962F] uppercase tracking-wider">
                  Layer 3
                </span>
                <h3 className="text-sm font-bold text-[#3E1220]">
                  Spoken Voice Fallback
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  When vibration hardware is unavailable (e.g. desktop browsers, iOS Safari) or motor fatigue occurs,
                  a spoken challenge-response seamlessly steps in using native browser speech recognition.
                </p>
              </div>
            </div>
          </div>

          {/* Comparative Table from SIH slide */}
          <div className="border border-[#E8DDC7] rounded-xl overflow-hidden">
            <div className="bg-[#3E1220] px-4 py-2.5 text-white font-bold text-xs uppercase tracking-wider">
              Verification Feasibility & Comparison
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-[#E8DDC7] font-bold text-[#3E1220]">
                    <th className="p-2.5">Feature</th>
                    <th className="p-2.5">Visual CAPTCHA</th>
                    <th className="p-2.5">Google reCAPTCHA v3</th>
                    <th className="p-2.5 bg-[#C9962F]/20 text-[#3E1220]">AccessGate (Ours)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDC7]">
                  <tr>
                    <td className="p-2.5 font-semibold text-stone-700">Works without sight</td>
                    <td className="p-2.5 text-red-700 font-bold">No</td>
                    <td className="p-2.5 text-amber-700 font-bold">Partial</td>
                    <td className="p-2.5 bg-[#C9962F]/10 text-[#27500A] font-extrabold">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-stone-700">Works without hearing</td>
                    <td className="p-2.5 text-red-700 font-bold">No</td>
                    <td className="p-2.5 text-[#27500A] font-bold">Yes</td>
                    <td className="p-2.5 bg-[#C9962F]/10 text-[#27500A] font-extrabold">Yes (Haptic)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-stone-700">No cross-site tracking</td>
                    <td className="p-2.5 text-stone-600">Varies</td>
                    <td className="p-2.5 text-red-700 font-bold">No (Tracks user)</td>
                    <td className="p-2.5 bg-[#C9962F]/10 text-[#27500A] font-extrabold">Yes (Zero Tracking)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E8DDC7] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#C9962F] hover:bg-[#b58525] text-[#3E1220] font-extrabold text-sm transition-colors shadow-sm"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
}
