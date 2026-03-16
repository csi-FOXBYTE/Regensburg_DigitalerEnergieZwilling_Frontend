import { ChevronRight, Building2, ArrowLeft } from "lucide-react";
import { STEP } from "../types";

interface ProgressBarProps {
  currentStep: STEP;
  onBack?: () => void;
  onLogoClick?: () => void;
  onStepClick?: (
    step: STEP,
  ) => void;
}

export function ProgressBar({
  currentStep,
  onBack,
  onLogoClick,
  onStepClick,
}: ProgressBarProps) {
  const steps = [
    { key: STEP.building, label: "Gebäude auswählen" },
    { key: STEP["building-review"], label: "Gebäudedaten" },
    { key: STEP.simulation, label: "Sanierungsmaßnahme" },
    { key: STEP.results, label: "Ergebnisse" },
    { key: STEP.decision, label: "Entscheidung" },
  ] as const;

  const currentIndex = steps.findIndex(
    (s) => s.key === currentStep,
  );

  const handleStepClick = (
    step: (typeof steps)[number],
    index: number,
  ) => {
    // Only allow clicking on completed steps or current step
    if (index <= currentIndex && onStepClick) {
      onStepClick(step.key );
    }
  };

  // On welcome screen, show progress bar but in initial state
  const displayIndex = currentStep === STEP.welcome ? -1 : currentIndex;

  return (
    <div className="bg-white border-b border-gray-200">
      {/* =============== MOBILE (bis md) =============== */}
      {currentStep !== STEP.welcome && (
        <div className="md:hidden">
          <nav
            className="relative px-[16px] pt-[44px] pb-[12px] py-[44px] pr-[16px] pl-[16px]"
            aria-label="Sanierungsprozess"
          >
            {/* Top row: Back Icon (links) + Step info */}
            <div className="flex items-center gap-3">
              {/* Back Button für Mobile - immer anzeigen */}
              <button
                onClick={() => {
                  if (currentIndex === 0) {
                    // Bei Schritt 1: Seite neu laden (wie Desktop)
                    window.location.reload();
                  } else if (currentIndex > 0 && onBack) {
                    // Bei Schritt 2-4: einen Schritt zurück
                    onBack();
                  }
                }}
                className="
              relative z-10
              flex items-center justify-center
              w-11 h-11
              bg-[#D9291C] rounded-lg
              hover:bg-[#B8241A]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9291C] focus-visible:ring-offset-2
              flex-shrink-0
              cursor-pointer
            "
                aria-label={currentIndex === 0 ? "Zurück zum Startbildschirm" : "Zurück zum vorherigen Schritt"}
                title={currentIndex === 0 ? "Startbildschirm" : "Zurück"}
              >
                <ArrowLeft
                  className="w-6 h-6 text-white pointer-events-none"
                  aria-hidden="true"
                />
              </button>

              {/* Step Info */}
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-600">
                  Schritt{" "}
                  <span className="font-medium">
                    {currentIndex + 1}
                  </span>{" "}
                  von{" "}
                  <span className="font-medium">
                    {steps.length}
                  </span>
                </p>
                <h2 className="text-sm font-medium text-gray-900 truncate">
                  {steps[currentIndex]?.label}
                </h2>
              </div>
            </div>

            {/* Progressbar */}
            <div className="mt-3">
              <div
                className="h-2 w-full rounded-full bg-gray-200"
                role="progressbar"
                aria-label={`Fortschritt: Schritt ${currentIndex + 1} von ${steps.length}`}
                aria-valuemin={1}
                aria-valuemax={steps.length}
                aria-valuenow={currentIndex + 1}
              >
                <div
                  className="h-2 rounded-full bg-[#D9291C] transition-all"
                  style={{
                    width: `${((currentIndex + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>

              <span className="sr-only">
                Aktueller Schritt: {steps[currentIndex]?.label}
              </span>
            </div>
          </nav>
        </div>
      )}

      {/* =============== DESKTOP (ab md) =============== */}
      <div className="hidden md:block">
        <nav
          className="relative flex items-center justify-center py-5 px-4 overflow-visible"
          aria-label="Sanierungsprozess"
        >
          {/* Logo Button - Desktop links außen */}
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="absolute left-4 z-20 flex items-center justify-center w-12 h-12 bg-[#D9291C] rounded-lg hover:bg-[#B8241A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9291C] focus-visible:ring-offset-2 transition-all flex-shrink-0"
            title="Startbildschirm"
            aria-label="Zurück zum Startbildschirm"
          >
            <Building2
              className="w-6 h-6 text-white"
              aria-hidden="true"
            />
          </button>

          {/* Numbered List - Desktop */}
          <div className="flex items-center justify-center gap-1.5">
            {steps.map((step, index) => {
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;
              const isClickable = index <= currentIndex;
              
              return (
                <div key={step.key} className="flex items-center gap-6 pr-4">
                  {/* Step Button */}
                  <button
                    onClick={() => isClickable ? handleStepClick(step, index) : undefined}
                    disabled={!isClickable}
                    className={`
                      flex items-center gap-3 h-10
                      ${isClickable ? "cursor-pointer" : "cursor-default"}
                    `}
                    aria-label={`${step.label}, Schritt ${step.key} von ${steps.length}`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {/* Number Circle */}
                    <div
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-full
                        ${isActive 
                          ? "bg-[#d9291c] shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#d9291c]" 
                          : "bg-[#e5e7eb]"
                        }
                      `}
                    >
                      <span
                        className={`
                          text-base leading-6
                          ${isActive ? "text-white" : "text-[#6a7282]"}
                        `}
                      >
                        {step.key}
                      </span>
                    </div>

                    {/* Label Text */}
                    <div className="whitespace-nowrap">
                      <span
                        className={`
                          text-base leading-6
                          ${isActive ? "text-[#101828]" : index <= 2 ? "text-[#101828]" : "text-[#6a7282]"}
                        `}
                      >
                        {step.label}
                      </span>
                    </div>
                  </button>

                  {/* Chevron */}
                  {index < steps.length - 1 && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                      <path 
                        d="M7.5 15L12.5 10L7.5 5" 
                        stroke="#99A1AF" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="1.66667" 
                      />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}