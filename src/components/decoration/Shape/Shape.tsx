import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn";
import { BG_CLASSES, type FillColor } from "../../../lib/palette";

export type ShapeKind = "circle" | "quarter" | "half" | "triangle" | "square" | "bar";
export type ShapeRotation = 0 | 90 | 180 | 270;

export type ShapeProps = Omit<ComponentProps<"div">, "color"> & {
  kind: ShapeKind;
  color?: FillColor;
  rotate?: ShapeRotation;
  /** Slow continuous rotation; disabled for users who prefer reduced motion. */
  spin?: boolean;
};

// Every kind fills its square box, so rotation always pivots on the box center.
const KINDS: Record<ShapeKind, string> = {
  circle: "rounded-full",
  quarter: "rounded-tl-full",
  half: "[clip-path:circle(50%_at_50%_100%)]",
  triangle: "[clip-path:polygon(50%_0,100%_100%,0_100%)]",
  square: "rounded-none",
  bar: "[clip-path:inset(37.5%_0_round_9999px)]",
};

const ROTATIONS: Record<ShapeRotation, string> = {
  0: "rotate-0",
  90: "rotate-90",
  180: "rotate-180",
  270: "-rotate-90",
};

/** Bauhaus primitive shape. Size it with className (e.g. `size-24`); it fills its box. */
export function Shape({ kind, color = "red", rotate = 0, spin = false, className, ...props }: ShapeProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "block size-full",
        KINDS[kind],
        BG_CLASSES[color],
        ROTATIONS[rotate],
        spin && "motion-safe:animate-bh-spin",
        className,
      )}
      {...props}
    />
  );
}
