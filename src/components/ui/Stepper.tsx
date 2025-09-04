import * as React from "react";

type Step = {
  /** Display label for the step */
  label: string;
  /** Optional icon component to render instead of the step number */
  icon?: React.ElementType;
  /** Optional secondary line displayed under the label */
  subLabel?: string;
};

type StepperProps = {
  /** 1-based index of the active step */
  currentStep: number;
  /** Step definitions in order */
  steps: Array<string | Step>;
  /** Optional click handler to allow navigation */
  onStepClick?: (index: number) => void;
  className?: string;
};

export default function Stepper({
  currentStep,
  steps,
  onStepClick,
  className = "",
}: StepperProps) {
  // clamp for safety
  const active = Math.min(Math.max(currentStep, 1), steps.length);

  return (
    <nav
      aria-label="Progress"
      className={`w-full max-w-4xl mx-auto select-none ${className}`}
    >
      <ol className="flex items-start justify-between gap-2 sm:gap-4">
        {steps.map((s, i) => {
          const { label, icon: Icon, subLabel } =
            typeof s === "string" ? { label: s } : s;
          const index = i + 1;
          const isDone = index < active;
          const isCurrent = index === active;
          const isFuture = index > active;

          return (
            <li key={label} className="flex items-center flex-1 min-w-0">
              {/* Node */}
              <button
                type="button"
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${index}. ${label}`}
                onClick={() => onStepClick?.(index)}
                disabled={!onStepClick}
                className={[
                  "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all",
                  "ring-2 ring-offset-0",
                  isDone &&
                    "bg-neutral-200 ring-neutral-300 text-neutral-500 dark:bg-neutral-700 dark:ring-neutral-600 dark:text-neutral-300",
                  isCurrent &&
                    "h-10 w-10 bg-blue-600 ring-blue-600 text-white shadow-lg shadow-blue-600/40",
                  isFuture &&
                    "bg-transparent ring-neutral-300 text-neutral-400 dark:ring-neutral-600 dark:text-neutral-600",
                  onStepClick ? "hover:scale-105" : "cursor-default",
                ].join(" ")}
              >
                {isDone ? (
                  /* Check icon */
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
                ) : Icon ? (
                  <Icon className={isCurrent ? "h-6 w-6" : "h-5 w-5"} />
                ) : (
                  <span className="text-sm font-semibold">{index}</span>
                )}
              </button>

              {/* Label */}
              <div className="ml-2 sm:ml-3 w-24 sm:w-32">
                <span
                  className={[
                    "block text-[11px] sm:text-xs leading-tight",
                    isDone && "text-neutral-400 dark:text-neutral-400",
                    isCurrent && "text-blue-600 dark:text-blue-400 font-medium",
                    isFuture &&
                      "text-neutral-400/80 dark:text-neutral-600 font-normal",
                  ].join(" ")}
                >
                  {label}
                </span>
                {subLabel && (
                  <span className="block text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500">
                    {subLabel}
                  </span>
                )}
              </div>

              {/* Connector */}
              {index !== steps.length && (
                <div aria-hidden className="relative mx-2 sm:mx-4 flex-1">
                  <div
                    className={[
                      "h-px w-full",
                      isDone
                        ? "bg-neutral-300 dark:bg-neutral-600"
                        : isCurrent
                        ? "bg-gradient-to-r from-blue-600 to-neutral-300 dark:from-blue-500 dark:to-neutral-600"
                        : "bg-neutral-300 dark:bg-neutral-700",
                    ].join(" ")}
                  />
                  <svg
                    viewBox="0 0 4 4"
                    className={[
                      "absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2",
                      isDone
                        ? "text-neutral-300 dark:text-neutral-600"
                        : isCurrent
                        ? "text-blue-600 dark:text-blue-500"
                        : "text-neutral-300 dark:text-neutral-700",
                    ].join(" ")}
                    fill="currentColor"
                  >
                    <path d="M0 0 L4 2 L0 4 z" />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
