import { useId, type ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";
import { CURRENT_COLOR_CLASSES, type FillColor } from "../../../lib/palette.js";

export type PatternKind = "hatch-vertical" | "hatch-horizontal" | "checker" | "grid-paper" | "halftone" | "grain";

export type PatternProps = Omit<ComponentProps<"div">, "color"> & {
  kind: PatternKind;
  /** Line/dot colour (sets currentColor). */
  color?: FillColor;
};

// Hard colour stops draw lines and dots, never blends. Static classes only.
const KINDS: Record<Exclude<PatternKind, "grain">, string> = {
  "hatch-vertical": "bg-[image:repeating-linear-gradient(90deg,currentColor_0_2px,transparent_2px_12px)]",
  "hatch-horizontal": "bg-[image:repeating-linear-gradient(0deg,currentColor_0_2px,transparent_2px_12px)]",
  checker:
    "bg-[image:conic-gradient(currentColor_25%,transparent_0_50%,currentColor_0_75%,transparent_0)] bg-size-[24px_24px]",
  "grid-paper":
    "bg-[image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-size-[24px_24px]",
  halftone: "bg-[image:radial-gradient(circle,currentColor_1.5px,transparent_1.5px)] bg-size-[10px_10px]",
};

/** Decorative fill pattern (hatching, checker, grid paper, halftone, print grain). Fills its box. */
export function Pattern({ kind, color = "ink", className, ...props }: PatternProps) {
  const filterId = useId();
  return (
    <div
      aria-hidden="true"
      className={cn("block size-full", CURRENT_COLOR_CLASSES[color], kind !== "grain" && KINDS[kind], className)}
      {...props}
    >
      {kind === "grain" && (
        // Static SVG noise tinted with currentColor: deterministic, no randomness at render.
        <svg className="block size-full" xmlns="http://www.w3.org/2000/svg">
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
            <feColorMatrix type="luminanceToAlpha" result="alpha" />
            <feFlood floodColor="currentColor" />
            <feComposite operator="in" in2="alpha" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${filterId})`} />
        </svg>
      )}
    </div>
  );
}
