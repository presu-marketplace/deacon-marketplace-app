import * as React from "react";

type StepperProps = {
  currentStep: number;
  steps: string[];
  onStepClick?: (index: number) => void;
  className?: string;
};

export default function Stepper({
  currentStep,
  steps,
  onStepClick,
  className = "",
}: StepperProps) {
  const active = Math.min(Math.max(currentStep, 1), steps.length);

  return (
    <nav
      aria-label="Progress"
      className={`w-full max-w-4xl mx-auto select-none ${className}`}
    >
      <ol className="flex items-center justify-between gap-2 sm:gap-4">
        {steps.map((label, i) => {
          const index = i + 1;
          const isDone = index < active;
          const isCurrent = index === active;
          const isFuture = index > active;

          return (
            <li key={label} className="flex items-center flex-1 min-w-0">
              <button
                type="button"
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${index}. ${label}`}
                onClick={() => onStepClick?.(index)}
                disabled={!onStepClick}
                className={[
                  "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all",
                  "ring-2 ring-offset-0",
                  isDone && "bg-green-500 ring-green-500 text-white",
                  isCurrent &&
                    "bg-blue-900 ring-blue-900 text-white shadow-lg shadow-blue-900/40",
                  isFuture &&
                    "bg-transparent ring-slate-400/50 text-slate-400 dark:ring-slate-600 dark:text-slate-500",
                  onStepClick ? "hover:scale-105" : "cursor-default",
                ].join(" ")}
              >
                {isDone ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{index}</span>
                )}
              </button>

              <div className="ml-2 sm:ml-3 min-w-0">
                <span
                  className={[
                    "block text-[11px] sm:text-xs truncate",
                    isDone && "text-green-600 dark:text-green-400",
                    isCurrent && "text-slate-100 dark:text-white font-medium",
                    isFuture &&
                      "text-slate-400 dark:text-slate-500 font-normal",
                  ].join(" ")}
                >
                  {label}
                </span>
              </div>

              {index !== steps.length && (
                <div
                  aria-hidden
                  className={[
                    "mx-2 sm:mx-4 h-px flex-1",
                    isDone
                      ? "bg-gradient-to-r from-green-500 to-green-500/60"
                      : isCurrent
                      ? "bg-gradient-to-r from-blue-900/90 to-slate-500/40"
                      : "bg-slate-400/40 dark:bg-slate-600/40",
                  ].join(" ")}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
