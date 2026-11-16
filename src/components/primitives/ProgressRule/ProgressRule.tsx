import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";
import { BG_CLASSES, type FillColor } from "../../../lib/palette.js";

export type ProgressRuleProps = Omit<ComponentProps<"div">, "color"> & {
  /** Progress from 0 to 1. Out-of-range values are clamped; NaN counts as 0. */
  value: number;
  /** Accessible name. Without it the rule is decorative and hidden from assistive tech. */
  label?: string;
  color?: FillColor;
};

const clamp = (v: number) => (Number.isNaN(v) ? 0 : Math.min(Math.max(v, 0), 1));

/** Thin track with a filled segment (aboutUs). */
export function ProgressRule({ value, label, color = "blue", className, ...props }: ProgressRuleProps) {
  const v = clamp(value);
  const a11y =
    label === undefined
      ? { "aria-hidden": true as const }
      : {
          role: "progressbar",
          "aria-label": label,
          "aria-valuemin": 0,
          "aria-valuemax": 100,
          "aria-valuenow": Math.round(v * 100),
        };
  return (
    <div className={cn("relative h-0.5 w-full bg-bh-rule", className)} {...a11y} {...props}>
      <div className={cn("absolute inset-y-0 left-0", BG_CLASSES[color])} style={{ width: `${v * 100}%` }} />
    </div>
  );
}
