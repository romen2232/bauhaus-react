import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { FILL_CLASSES, type FillColor } from "../../../lib/palette.js";

export type StepperStep = { label: ReactNode; color?: FillColor };
export type StepperProps = ComponentProps<"ol"> & {
  steps: StepperStep[];
  /** 0-based index of the current step. */
  current: number;
};

/** Vertical numbered dots joined by a dashed line; colours can encode meaning (Mobile). */
export function Stepper({ steps, current, className, ...props }: StepperProps) {
  return (
    <ol className={cn("flex flex-col", className)} {...props}>
      {steps.map((step, i) => (
        <li
          key={i}
          aria-current={i === current ? "step" : undefined}
          className="relative flex items-center gap-4 pb-8 last:pb-0"
        >
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute top-8 bottom-0 left-4 border-l-2 border-dashed border-bh-ink"
            />
          )}
          <span
            className={cn(
              "relative flex size-8 shrink-0 items-center justify-center rounded-full font-bh-display text-sm font-bold",
              FILL_CLASSES[step.color ?? "ink"],
              i === current && "outline-2 outline-offset-2 outline-bh-ink",
            )}
          >
            {i + 1}
          </span>
          <span className="font-bh-body">{step.label}</span>
        </li>
      ))}
    </ol>
  );
}
