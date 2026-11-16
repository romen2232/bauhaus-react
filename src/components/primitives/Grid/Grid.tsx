import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn";

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridGap = "none" | "sm" | "md" | "lg";

export type GridProps = ComponentProps<"div"> & {
  cols?: GridCols;
  gap?: GridGap;
  /** Draw 1px rules between cells and around the grid. Forces a 1px gap. */
  ruled?: boolean;
};

const COLS: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const GAPS: Record<GridGap, string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-6",
  lg: "gap-10",
};

const RULED = "gap-px bg-bh-rule border border-bh-rule [&>*]:bg-bh-paper";

/** Modular layout grid; `ruled` makes the grid lines visible, Bauhaus-style. */
export function Grid({ cols = 12, gap = "md", ruled = false, className, ...props }: GridProps) {
  return <div className={cn("grid", COLS[cols], ruled ? RULED : GAPS[gap], className)} {...props} />;
}
