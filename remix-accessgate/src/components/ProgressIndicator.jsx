import React from 'react';
import { Check, Smartphone, Vibrate, Mic, Activity, Lock } from 'lucide-react';

export default function ProgressIndicator({
  currentStep,
  mode = 'haptic',
  deviceCheckCompleted = false,
  verificationCompleted = false,
  onNavigateStep,
  onBlockedStep,
  noticeMessage,
}) {
  const getChallengeLabel = () => {
    if (mode === 'voice') return 'Voice Challenge';
    if (mode === 'behavioral') return 'Behavioral Pattern';
    return 'Haptic Challenge';
  };

  const getChallengeIcon = () => {
    if (mode === 'voice') return Mic;
    if (mode === 'behavioral') return Activity;
    return Vibrate;
  };

  const isChallengeCurrent = currentStep === 'challenge' || currentStep === 'voice-fallback';

  const steps = [
    {
      id: 'device-check',
      label: 'Device Check',
      icon: Smartphone,
      isCurrent: currentStep === 'device-check',
      isCompleted: deviceCheckCompleted,
      isUnlocked: true, // You can always go back to Device Check!
      lockedReason: '',
    },
    {
      id: mode === 'voice' ? 'voice-fallback' : 'challenge',
      label: getChallengeLabel(),
      icon: getChallengeIcon(),
      isCurrent: isChallengeCurrent,
      isCompleted: verificationCompleted,
      isUnlocked: deviceCheckCompleted || isChallengeCurrent || verificationCompleted,
      lockedReason: 'Complete Device Check first',
    },
    {
      id: 'result',
      label: 'Verification Result',
      icon: Check,
      isCurrent: currentStep === 'result',
      isCompleted: verificationCompleted && currentStep === 'result',
      isUnlocked: verificationCompleted,
      lockedReason: 'Complete the challenge first',
    },
  ];

  const handleStepClick = (step) => {
    if (!step.isUnlocked) {
      if (onBlockedStep) {
        onBlockedStep(step.lockedReason);
      } else if (onNavigateStep) {
        onNavigateStep(step.id);
      }
      return;
    }

    if (onNavigateStep) {
      onNavigateStep(step.id);
    }
  };

  return (
    <nav
      aria-label="Verification Progress Steps"
      className="max-w-3xl mx-auto px-4 py-3 sm:py-5"
    >
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, idx) => {
          const Icon = step.icon;

          return (
            <li
              key={step.id}
              className="flex-1 flex flex-col items-center relative"
              aria-current={step.isCurrent ? 'step' : undefined}
            >
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={`pointer-events-none absolute top-4 sm:top-5 left-1/2 w-full h-1 -z-0 transition-colors ${
                    (idx === 0 && deviceCheckCompleted) || (idx === 1 && verificationCompleted)
                      ? 'bg-[#C9962F]'
                      : 'bg-[#E8DDC7]'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step Navigation Button */}
              <button
                type="button"
                onClick={() => handleStepClick(step)}
                disabled={false}
                aria-disabled={!step.isUnlocked}
                className={`group flex flex-col items-center rounded-2xl p-1.5 transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C9962F] ${
                  step.isUnlocked
                    ? 'cursor-pointer hover:scale-105 active:scale-95'
                    : 'cursor-not-allowed opacity-60'
                }`}
                title={
                  !step.isUnlocked
                    ? `Locked: ${step.lockedReason}`
                    : step.isCurrent
                    ? `${step.label} (Current Step)`
                    : `Click to go to ${step.label}`
                }
                aria-label={`Step ${idx + 1}: ${step.label}${
                  step.isCurrent ? ' (Current Step)' : ''
                }${!step.isUnlocked ? ` (Locked: ${step.lockedReason})` : ''}`}
              >
                {/* Step circle */}
                <div
                  className={`relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all shadow-xs ${
                    step.isCompleted
                      ? 'bg-[#27500A] text-white border-[#27500A] group-hover:ring-2 group-hover:ring-[#27500A]/40'
                      : step.isCurrent
                      ? 'bg-[#C9962F] text-[#3E1220] border-[#3E1220] ring-4 ring-[#C9962F]/30 scale-105'
                      : step.isUnlocked
                      ? 'bg-white text-stone-700 border-[#C9962F] group-hover:bg-[#FAF6EE] group-hover:border-[#3E1220]'
                      : 'bg-stone-100 text-stone-400 border-[#E8DDC7]'
                  }`}
                  aria-hidden="true"
                >
                  {step.isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                  ) : !step.isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Step label */}
                <div className="flex items-center gap-1 mt-2">
                  <span
                    className={`text-[11px] sm:text-xs font-semibold text-center tracking-tight transition-colors ${
                      step.isCurrent
                        ? 'text-[#3E1220] font-bold underline underline-offset-4 decoration-[#C9962F] decoration-2'
                        : step.isCompleted
                        ? 'text-[#27500A] group-hover:text-[#1c3a07]'
                        : step.isUnlocked
                        ? 'text-stone-700 group-hover:text-[#3E1220]'
                        : 'text-stone-400'
                    }`}
                  >
                    <span className="sr-only">Step {idx + 1}: </span>
                    {step.label}
                  </span>
                  {!step.isUnlocked && (
                    <Lock className="w-2.5 h-2.5 text-stone-400 shrink-0 inline" aria-hidden="true" />
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Notice notification when user clicks locked step */}
      {noticeMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mt-3 py-1.5 px-3 rounded-xl bg-[#FEF7E6] border border-[#C9962F] text-[#3E1220] text-xs font-semibold text-center max-w-md mx-auto shadow-xs flex items-center justify-center gap-2 animate-fadeIn"
        >
          <Lock className="w-3.5 h-3.5 text-[#C9962F] shrink-0" aria-hidden="true" />
          <span>{noticeMessage}</span>
        </div>
      )}
    </nav>
  );
}
