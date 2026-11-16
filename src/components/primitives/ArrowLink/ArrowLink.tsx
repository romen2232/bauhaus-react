import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn";
import { FOCUS_RING } from "../../../lib/styles";

export type ArrowLinkDirection = "right" | "up-right";
export type ArrowLinkSize = "sm" | "md" | "lg" | "hero";

export type ArrowLinkProps = ComponentProps<"a"> & {
  href: string;
  direction?: ArrowLinkDirection;
  size?: ArrowLinkSize;
};

const SIZES: Record<ArrowLinkSize, string> = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-3xl",
  hero: "text-6xl md:text-8xl tracking-tight",
};

const ARROWS: Record<ArrowLinkDirection, { glyph: string; motion: string }> = {
  right: { glyph: "→", motion: "group-hover:translate-x-1" },
  "up-right": { glyph: "↗", motion: "group-hover:translate-x-1 group-hover:-translate-y-1" },
};

/** Text link with a directional arrow ("Manifesto ↗"). */
export function ArrowLink({ direction = "right", size = "md", className, children, ...props }: ArrowLinkProps) {
  const arrow = ARROWS[direction];
  return (
    <a
      className={cn(
        "group inline-flex items-baseline gap-[0.25em] font-bh-display font-bold text-bh-ink underline-offset-4 hover:underline",
        SIZES[size],
        FOCUS_RING,
        className,
      )}
      {...props}
    >
      {children}
      <span aria-hidden="true" className={cn("inline-block transition-transform duration-150", arrow.motion)}>
        {arrow.glyph}
      </span>
    </a>
  );
}
