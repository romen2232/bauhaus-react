import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";

export type NumberStepperProps = ComponentProps<"div"> & {
  value: number;
  /** How many upcoming numbers are ghosted after the current one. */
  ahead?: 1 | 2;
  /** Minimum digits shown (zero-padded). */
  pad?: number;
};

/** Current number large, with the next numbers ghosted behind it (decorative). */
export function NumberStepper({ value, ahead = 2, pad = 1, className, ...props }: NumberStepperProps) {
  const fmt = (n: number) => String(n).padStart(pad, "0");
  const next = Array.from({ length: ahead }, (_, i) => value + i + 1);
  return (
    <div className={cn("flex items-baseline gap-4 font-bh-display leading-none tabular-nums", className)} {...props}>
      <span className="text-7xl">{fmt(value)}</span>
      <span aria-hidden="true" className="flex gap-4 text-5xl text-bh-muted">
        {next.map((n) => (
          <span key={n}>{fmt(n)}</span>
        ))}
      </span>
    </div>
  );
}
