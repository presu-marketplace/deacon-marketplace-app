import * as React from "react";

type Step = {
  label: string;
  icon?: React.ElementType;
  /** Top sub-line (e.g., date) */
  subLabel?: string;
  /** Bottom sub-line (e.g., time) */
  subBottom?: string;
};

type StepperProps = {
  currentStep: number;                  // 1-based
  steps: Array<string | Step>;
  onStepClick?: (index: number) => void;
  className?: string;
  fixedSlots?: 3 | 4 | 5 | 6;           // default: steps.length
};

export default function Stepper({
  currentStep,
  steps,
  onStepClick,
  className = "",
  fixedSlots,
}: StepperProps) {
  const cols = fixedSlots ?? steps.length;
  const parsed: (Step & { __placeholder?: boolean })[] =
    steps.map((s) => (typeof s === "string" ? { label: s } : s));

  // pad to fixed slots so spacing never shifts
  const padded =
    parsed.length >= cols
      ? parsed.slice(0, cols)
      : [
        ...parsed,
        ...Array.from({ length: cols - parsed.length }).map(() => ({
          label: "—",
          __placeholder: true as const,
        })),
      ];

  const active = Math.min(Math.max(currentStep, 1), padded.length);
  const gridCols = cols * 2 - 1; // node, connector, node, ...

  return (
    <nav aria-label="Progress" className={`w-full select-none ${className}`}>
      {/* ROW 1: nodes + gray connectors */}
      <div
        className="grid items-center"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0,1fr))` }}
      >
        {padded.map((s, i) => {
          const index = i + 1;
          const isDone = index < active;
          const isCurrent = index === active;
          const isFuture = index > active;
          const Icon = !("__placeholder" in s && s.__placeholder) ? (s as Step).icon : undefined;

          return (
            <React.Fragment key={`node-${i}`}>
              {/* Node */}
              <div className="flex items-center justify-center py-1" style={{ gridColumn: i * 2 + 1 }}>
                <button
                  type="button"
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${index}. ${s.label}`}
                  onClick={() => onStepClick?.(index)}
                  disabled={!onStepClick || s.__placeholder}
                  className={[
                    "inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 transition",
                    isDone &&
                    "bg-neutral-200 ring-neutral-300 text-neutral-600 dark:bg-neutral-700 dark:ring-neutral-600 dark:text-neutral-200",
                    isCurrent &&
                    "bg-blue-600 ring-blue-600 text-white shadow-lg shadow-blue-600/40",
                    isFuture &&
                    "bg-white ring-neutral-300 text-neutral-400 dark:bg-transparent dark:ring-neutral-600 dark:text-neutral-600",
                    !s.__placeholder && onStepClick ? "hover:scale-[1.03]" : "cursor-default",
                  ].join(" ")}
                >
                  {s.__placeholder ? (
                    <span className="text-xs text-neutral-300">•</span>
                  ) : isDone ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : Icon ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index}</span>
                  )}
                </button>
              </div>

              {/* Gray connector to next node */}
              {i < cols - 1 && (
                <div aria-hidden className="px-2" style={{ gridColumn: i * 2 + 2 }}>
                  <div className="h-0.5 w-full rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ROW 2: labels (title + date + time) under each node */}
      <div
        className="mt-2 grid"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0,1fr))` }}
      >
        {padded.map((s, i) => {
          const index = i + 1;
          const isDone = index < active;
          const isCurrent = index === active;
          const isFuture = index > active;
          const subLabel = "subLabel" in s ? s.subLabel : undefined;

          return (
            <div
              key={`label-${i}`}
              className="px-2 text-center h-[44px]"   // room for 2 lines
              style={{ gridColumn: i * 2 + 1 }}
            >
              <span
                className={[
                  "block truncate whitespace-nowrap text-[11px] sm:text-xs leading-tight",
                  isDone && "text-neutral-400 dark:text-neutral-400",
                  isCurrent && "text-blue-600 dark:text-blue-400 font-medium",
                  isFuture && "text-neutral-400/80 dark:text-neutral-600",
                ].join(" ")}
                title={s.label}
              >
                {s.label}
              </span>

              {subLabel && (
                <span
                  className="block truncate whitespace-nowrap text-[10px] text-slate-500 dark:text-slate-400"
                  title={subLabel}
                >
                  {subLabel}
                </span>
              )}
              {"subBottom" in s && s.subBottom && (
                <span
                  className="block truncate whitespace-nowrap text-[10px] text-slate-400 dark:text-slate-500"
                  title={s.subBottom}
                >
                  {s.subBottom}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
