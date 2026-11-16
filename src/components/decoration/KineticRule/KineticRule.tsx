import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";
import { BG_CLASSES, type FillColor } from "../../../lib/palette.js";

export type KineticRuleProps = Omit<ComponentProps<"div">, "color"> & { color?: FillColor };

/**
 * A rule that grows and shrinks while a dot slides along it (BHause.mp4 kinetic geometry).
 * Static under reduced motion.
 */
export function KineticRule({ color = "ink", className, ...props }: KineticRuleProps) {
  return (
    <div aria-hidden="true" className={cn("relative h-3 w-full", className)} {...props}>
      <div className={cn("absolute inset-x-0 top-1/2 h-0.5 origin-left -translate-y-1/2 motion-safe:animate-bh-grow", BG_CLASSES[color])} />
      <div
        className={cn(
          "absolute top-0 left-0 size-3 -translate-x-1/2 rounded-full motion-safe:animate-bh-slide",
          BG_CLASSES[color],
        )}
      />
    </div>
  );
}
