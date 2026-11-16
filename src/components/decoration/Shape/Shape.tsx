import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { BG_CLASSES, HEX, type FillColor } from "../../../lib/palette.js";
import { Pattern, type PatternKind } from "../Pattern/Pattern.js";

export type ShapeFill = "solid" | "outline" | "pattern";

export type ShapeKind = "circle" | "quarter" | "half" | "triangle" | "square" | "bar";
export type ShapeRotation = 0 | 90 | 180 | 270;

export type ShapeProps = Omit<ComponentProps<"div">, "color"> & {
  kind: ShapeKind;
  color?: FillColor;
  rotate?: ShapeRotation;
  /** Slow continuous rotation; disabled for users who prefer reduced motion. */
  spin?: boolean;
  /** `solid` (default) fills with colour; `outline` draws a 2px stroke; `pattern` fills with a Pattern. */
  fill?: ShapeFill;
  /** Pattern used when `fill="pattern"`. */
  pattern?: PatternKind;
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

// Outline geometry in a 100×100 box, matching the masks above.
const OUTLINES: Record<ShapeKind, ReactNode> = {
  circle: <circle cx="50" cy="50" r="50" />,
  quarter: <path d="M100 100 H0 A100 100 0 0 1 100 0 Z" />,
  half: <path d="M0 100 A50 50 0 0 1 100 100 Z" />,
  triangle: <path d="M50 0 L100 100 L0 100 Z" />,
  square: <rect width="100" height="100" />,
  bar: <rect y="37.5" width="100" height="25" rx="12.5" />,
};

/** Bauhaus primitive shape. Size it with className (e.g. `size-24`); it fills its box. */
export function Shape({
  kind,
  color = "red",
  rotate = 0,
  spin = false,
  fill = "solid",
  pattern = "hatch-vertical",
  className,
  ...props
}: ShapeProps) {
  const motion = cn(ROTATIONS[rotate], spin && "motion-safe:animate-bh-spin");

  if (fill === "outline") {
    return (
      <div aria-hidden="true" className={cn("block size-full", motion, className)} {...props}>
        <svg viewBox="0 0 100 100" overflow="visible" className="block size-full">
          <g fill="none" stroke={HEX[color]} strokeWidth={2} vectorEffect="non-scaling-stroke">
            {OUTLINES[kind]}
          </g>
        </svg>
      </div>
    );
  }

  if (fill === "pattern") {
    return (
      <div aria-hidden="true" className={cn("block size-full overflow-hidden", KINDS[kind], motion, className)} {...props}>
        <Pattern kind={pattern} color={color} />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn("block size-full", KINDS[kind], BG_CLASSES[color], motion, className)}
      {...props}
    />
  );
}
