import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { FOCUS_RING, HOVER_LIFT } from "../../../lib/styles.js";
import { IconButtonBase, type IconButtonBaseProps } from "../../_base/IconButton/IconButtonBase.js";

export type IconButtonPlayfulSize = "sm" | "md" | "lg";

type Own = {
  /** Required: icon-only buttons have no visible text. */
  "aria-label": string;
  variant?: "solid" | "outline";
  /** `lg` is the floating action button size. */
  size?: IconButtonPlayfulSize;
  children: ReactNode;
};

export type IconButtonPlayfulProps =
  | (Own & Omit<ComponentProps<"button">, keyof Own> & { href?: undefined })
  | (Own & Omit<ComponentProps<"a">, keyof Own> & { href: string; disabled?: boolean });

const VARIANTS = {
  solid: "bg-bh-ink text-bh-paper",
  outline: "border-2 border-bh-ink bg-transparent text-bh-ink",
} as const;

const SIZES: Record<IconButtonPlayfulSize, string> = {
  sm: "size-8 text-sm",
  md: "size-11 text-base",
  lg: "size-14 text-xl",
};

/** Circular icon button (carousel arrows, menu toggles, FAB). Renders `<a>` when `href` is given. */
export function IconButtonPlayful(props: IconButtonPlayfulProps) {
  const { variant = "solid", size = "md", ...rest } = props;
  const root = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full",
    VARIANTS[variant],
    SIZES[size],
    rest.disabled ? "cursor-not-allowed opacity-50" : HOVER_LIFT,
    FOCUS_RING,
  );
  return <IconButtonBase {...(rest as IconButtonBaseProps)} classes={{ root }} />;
}
