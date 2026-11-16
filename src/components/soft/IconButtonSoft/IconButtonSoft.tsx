import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { SOFT_HOVER_CLASSES } from "../../../lib/palette.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { IconButtonBase, type IconButtonBaseProps } from "../../_base/IconButton/IconButtonBase.js";

export type IconButtonSoftSize = "sm" | "md" | "lg";

type Own = {
  /** Required: icon-only buttons have no visible text. */
  "aria-label": string;
  /** `outline` is a sand fill: the Soft look has no borders. */
  variant?: "solid" | "outline";
  /** `lg` is the floating action button size. */
  size?: IconButtonSoftSize;
  children: ReactNode;
};

export type IconButtonSoftProps =
  | (Own & Omit<ComponentProps<"button">, keyof Own> & { href?: undefined })
  | (Own & Omit<ComponentProps<"a">, keyof Own> & { href: string; disabled?: boolean });

const VARIANTS = {
  solid: cn("bg-bh-charcoal text-bh-paper", SOFT_HOVER_CLASSES.neutral),
  outline: cn("bg-bh-sand text-bh-ink", SOFT_HOVER_CLASSES.sand),
} as const;

const SIZES: Record<IconButtonSoftSize, string> = {
  sm: "size-8 text-sm",
  md: "size-11 text-base",
  lg: "size-14 text-xl",
};

/** Soft circular icon button (carousel arrows, menu toggles, FAB). Renders `<a>` when `href` is given. */
export function IconButtonSoft(props: IconButtonSoftProps) {
  const { variant = "solid", size = "md", ...rest } = props;
  const root = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out",
    VARIANTS[variant],
    SIZES[size],
    rest.disabled && "cursor-not-allowed opacity-50",
    FOCUS_RING,
  );
  return <IconButtonBase {...(rest as IconButtonBaseProps)} classes={{ root }} />;
}
