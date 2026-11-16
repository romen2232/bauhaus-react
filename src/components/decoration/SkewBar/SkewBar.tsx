import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";
import { BG_CLASSES, FILL_CLASSES, type FillColor } from "../../../lib/palette.js";

export type SkewBarProps = Omit<ComponentProps<"div">, "color"> & {
  color?: FillColor;
  /** Colour of the flat offset duplicate behind the bar (the "Bauhaus shadow"). None when omitted. */
  shadowColor?: FillColor;
  /** Optional text on the bar (decorative). */
  label?: string;
};

const BAR = "-skew-x-12 px-6 py-2";

/** Parallelogram bar with an optional flat offset duplicate behind it (Courageously). */
export function SkewBar({ color = "orange", shadowColor, label, className, ...props }: SkewBarProps) {
  return (
    <div aria-hidden="true" className={cn("relative inline-grid", className)} {...props}>
      {shadowColor && (
        <div className={cn("col-start-1 row-start-1 translate-x-2 translate-y-2", BAR, BG_CLASSES[shadowColor])} />
      )}
      <div
        className={cn(
          "relative col-start-1 row-start-1 font-bh-display text-lg font-extrabold lowercase",
          BAR,
          FILL_CLASSES[color],
        )}
      >
        <span className="inline-block skew-x-12">{label ?? " "}</span>
      </div>
    </div>
  );
}
