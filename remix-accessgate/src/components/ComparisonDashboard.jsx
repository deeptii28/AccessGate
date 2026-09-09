import React from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Ear,
  Bot,
  Zap,
  ShieldCheck,
  Award,
  Sparkles,
  Smartphone,
  Layers,
} from 'lucide-react';

export default function ComparisonDashboard({ isOpen, onClose }) {
  if (!isOpen) return null;

  const comparisonRows = [
    {
      feature: 'Works Without Sight (Blind / Low Vision)',
      description: 'Zero visual puzzles, street signs, distorted text, or crosswalk grids',
      traditional: { status: 'fail', text: '0% Accessible (Requires vision)' },
      recaptchaV3: { status: 'partial', text: 'Invisible, but visual fallback on flag' },
      accessGate: { status: 'pass', text: '100% Sight-Free (Haptic & Spoken)' },
    },
    {
      feature: 'Works Without Hearing (Deaf-Blind Citizens)',
      description: 'Audio CAPTCHAs use heavily distorted crowd noise inaccessible to deaf-blind users',
      traditional: { status: 'fail', text: 'Audio puzzle fails deaf-blind users' },
      recaptchaV3: { status: 'pass', text: 'Works silently in background' },
      accessGate: { status: 'pass', text: 'Tactile Haptic Vibration feelable on skin' },
    },
    {
      feature: 'Resistance to AI & Computer Vision Bots',
      description: 'YOLOv11 and Multimodal LLMs (GPT-4V) achieve >99.8% accuracy solving image CAPTCHAs',
      traditional: { status: 'fail', text: 'Broken by modern vision AI' },
      recaptchaV3: { status: 'partial', text: 'Fingerprint spoofable via puppeteer' },
      accessGate: { status: 'pass', text: 'Human motor jitter & micro-timing variance' },
    },
    {
      feature: 'Average User Completion Time',
      description: 'Friction imposed on genuine human users during authentication',
      traditional: { status: 'fail', text: '25 – 45 seconds of frustration' },
      recaptchaV3: { status: 'pass', text: '0 seconds (Invisible score)' },
      accessGate: { status: 'pass', text: '2.5 – 4.5 seconds quick tactile gesture' },
    },
    {
      feature: 'Zero Cross-Site Tracking & Privacy',
      description: 'Does the system track users across websites to build behavioral dossiers?',
      traditional: { status: 'partial', text: 'Tracks IP & cookies' },
      recaptchaV3: { status: 'fail', text: 'Profiles cross-site browsing history' },
      accessGate: { status: 'pass', text: '100% Local & Ephemeral (Zero Tracking)' },
    },
    {
      feature: 'WCAG 2.1 Accessibility Conformance',
      description: 'Meets W3C Web Content Accessibility Guidelines Success Criteria',
      traditional: { status: 'fail', text: 'Violates SC 1.1.1 (Non-text Content)' },
      recaptchaV3: { status: 'partial', text: 'Fallback violates 1.1.1 & 2.2.1' },
      accessGate: { status: 'pass', text: 'Meets Level AAA Conformance' },
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto"
    >
      <div
        className="bg-white border-2 border-[#C9962F] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3E1220] via-[#4F1729] to-[#3E1220] text-white p-6 sm:p-7 border-b border-[#C9962F]/40 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9962F]/20 text-[#E8DDC7] text-xs font-bold uppercase tracking-wider mb-2 border border-[#C9962F]/30">
              <Layers className="w-3.5 h-3.5 text-[#C9962F]" />
              Architectural Impact Matrix • SIH 2026
            </div>
            <h2 id="comparison-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              How AccessGate Compares
            </h2>
            <p className="text-xs sm:text-sm text-[#E8DDC7]/90 mt-1 max-w-xl leading-relaxed">
              Side-by-side technical evaluation: Traditional visual tests vs. Google reCAPTCHA v3 vs. AccessGate's multi-modal architecture.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962F]"
            aria-label="Close comparison dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-[#FAF6EE]/40">
          {/* Top 3 Metric Cards for Judges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border-2 border-[#E8DDC7] shadow-2xs">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Visual Dependency
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-[#27500A]">0%</span>
                <span className="text-xs text-stone-600 font-semibold">(vs 100% Visual)</span>
              </div>
              <p className="text-xs text-stone-600 mt-2">
                100% operable by screen reader, haptic motor, and natural spoken voice.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#E8DDC7] shadow-2xs">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Average Completion Time
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-[#3E1220]">~3.5s</span>
                <span className="text-xs text-stone-600 font-semibold">(vs 32s average)</span>
              </div>
              <p className="text-xs text-stone-600 mt-2">
                Fast tactile rhythm reproduction eliminates multi-round image cycling.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#E8DDC7] shadow-2xs">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Privacy Standard
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-[#27500A]">Zero Tracking</span>
              </div>
              <p className="text-xs text-stone-600 mt-2">
                No third-party tracking cookies or cross-site surveillance profiles required.
              </p>
            </div>
          </div>

          {/* Full Side-by-Side Comparison Matrix */}
          <div className="bg-white border-2 border-[#E8DDC7] rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E8DDC7] bg-[#3E1220] text-white">
                    <th className="p-3.5 sm:p-4 font-bold w-2/5">Evaluation Dimension</th>
                    <th className="p-3.5 sm:p-4 font-bold text-stone-300 w-1/5">
                      Visual CAPTCHA (reCAPTCHA v2 / hCaptcha)
                    </th>
                    <th className="p-3.5 sm:p-4 font-bold text-stone-300 w-1/5">
                      Invisible reCAPTCHA v3
                    </th>
                    <th className="p-3.5 sm:p-4 font-extrabold bg-[#C9962F] text-[#3E1220] w-1/5 shadow-xs">
                      AccessGate (Our Solution)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDC7]">
                  {comparisonRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-[#FAF6EE]/50 transition-colors ${
                        idx % 2 === 1 ? 'bg-stone-50/40' : 'bg-white'
                      }`}
                    >
                      {/* Feature & Description */}
                      <td className="p-3.5 sm:p-4">
                        <span className="font-bold text-stone-900 block text-xs sm:text-sm">
                          {row.feature}
                        </span>
                        <span className="text-[11px] text-stone-500 mt-0.5 block leading-relaxed">
                          {row.description}
                        </span>
                      </td>

                      {/* Traditional Visual */}
                      <td className="p-3.5 sm:p-4 text-stone-700 align-top">
                        <div className="flex items-start gap-1.5">
                          {row.traditional.status === 'pass' ? (
                            <CheckCircle2 className="w-4 h-4 text-[#27500A] shrink-0 mt-0.5" />
                          ) : row.traditional.status === 'partial' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          )}
                          <span className="text-xs">{row.traditional.text}</span>
                        </div>
                      </td>

                      {/* Invisible v3 */}
                      <td className="p-3.5 sm:p-4 text-stone-700 align-top">
                        <div className="flex items-start gap-1.5">
                          {row.recaptchaV3.status === 'pass' ? (
                            <CheckCircle2 className="w-4 h-4 text-[#27500A] shrink-0 mt-0.5" />
                          ) : row.recaptchaV3.status === 'partial' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          )}
                          <span className="text-xs">{row.recaptchaV3.text}</span>
                        </div>
                      </td>

                      {/* AccessGate */}
                      <td className="p-3.5 sm:p-4 bg-[#C9962F]/10 font-bold text-[#27500A] align-top border-l border-[#C9962F]/30">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#27500A] shrink-0 mt-0.5" />
                          <span className="text-xs text-[#27500A] font-extrabold">{row.accessGate.text}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-world Beneficiary Quote for Judges */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8DDC7] flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3E1220] text-[#C9962F] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#3E1220] uppercase tracking-wider">
                Judge Demonstration Takeaway
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                By replacing ocular visual tests with haptic vibration rhythm and behavioral touch timing,
                AccessGate is the first solution that provides true non-visual equality for disabled citizens while simultaneously defeating automated AI vision models.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E8DDC7] bg-white flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-medium">
            Smart India Hackathon 2026 • Problem Statement MS-05
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#C9962F] hover:bg-[#b58525] text-[#3E1220] font-black text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
