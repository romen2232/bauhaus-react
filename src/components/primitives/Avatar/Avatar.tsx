import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";

export type AvatarRings = 0 | 1 | 2 | 3;
export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = Omit<ComponentProps<"img">, "alt"> & {
  /** Required: describe the person, or pass "" if the image is purely decorative. */
  alt: string;
  /** Concentric outline circles drawn behind the portrait (BauhausConcept). */
  rings?: AvatarRings;
  size?: AvatarSize;
};

const SIZES: Record<AvatarSize, string> = {
  sm: "size-10",
  md: "size-16",
  lg: "size-32",
};

// Ring n sits further out than ring n-1. Static classes only.
const RING_INSETS = ["-inset-2", "-inset-4", "-inset-6"] as const;

/** Circular portrait crop with optional orbit rings. `className` styles the wrapper. */
export function Avatar({ alt, rings = 0, size = "md", className, ...props }: AvatarProps) {
  return (
    <span className={cn("relative inline-block shrink-0", SIZES[size], className)}>
      {RING_INSETS.slice(0, rings).map((inset) => (
        <span key={inset} aria-hidden="true" className={cn("absolute rounded-full border border-bh-ink", inset)} />
      ))}
      <img alt={alt} className="relative size-full rounded-full object-cover" {...props} />
    </span>
  );
}
