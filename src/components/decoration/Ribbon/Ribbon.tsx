import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";
import { FILL_CLASSES, type FillColor } from "../../../lib/palette.js";

export type RibbonAngle = -12 | -6 | 6 | 12;

export type RibbonProps = Omit<ComponentProps<"div">, "color"> & {
  text: string;
  angle?: RibbonAngle;
  color?: FillColor;
};

const ANGLES: Record<RibbonAngle, string> = {
  [-12]: "-rotate-12",
  [-6]: "-rotate-6",
  6: "rotate-6",
  12: "rotate-12",
};

const REPEAT = 8;

/** Diagonal band of repeated text across its container (Courageously, constructivist gesture). */
export function Ribbon({ text, angle = -12, color = "red", className, ...props }: RibbonProps) {
  return (
    <div aria-hidden="true" className={cn("relative overflow-hidden", className)} {...props}>
      <div
        className={cn(
          "absolute top-1/2 left-1/2 w-[200%] -translate-x-1/2 -translate-y-1/2 py-3 font-bh-display text-lg font-extrabold whitespace-nowrap uppercase",
          ANGLES[angle],
          FILL_CLASSES[color],
        )}
      >
        {Array.from({ length: REPEAT }, () => text).join(" — ")}
      </div>
    </div>
  );
}
