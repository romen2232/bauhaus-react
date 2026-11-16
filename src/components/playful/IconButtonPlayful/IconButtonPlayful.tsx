import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { FOCUS_RING, HOVER_LIFT } from "../../../lib/styles";

export type IconButtonPlayfulSize = "sm" | "md" | "lg";

export type IconButtonPlayfulProps = Omit<ComponentProps<"button">, "aria-label" | "children"> & {
  /** Required: icon-only buttons have no visible text. */
  "aria-label": string;
  variant?: "solid" | "outline";
  size?: IconButtonPlayfulSize;
  children: ReactNode;
};

const VARIANTS = {
  solid: "bg-bh-ink text-bh-paper",
  outline: "border-2 border-bh-ink bg-transparent text-bh-ink",
} as const;

const SIZES: Record<IconButtonPlayfulSize, string> = {
  sm: "size-8 text-sm",
  md: "size-11 text-base",
  lg: "size-14 text-xl",
};

/** Circular icon button (carousel arrows, menu toggles). */
export function IconButtonPlayful({
  variant = "solid",
  size = "md",
  type = "button",
  className,
  ...props
}: IconButtonPlayfulProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        VARIANTS[variant],
        SIZES[size],
        props.disabled ? "cursor-not-allowed opacity-50" : HOVER_LIFT,
        FOCUS_RING,
        className,
      )}
      {...props}
    />
  );
}
