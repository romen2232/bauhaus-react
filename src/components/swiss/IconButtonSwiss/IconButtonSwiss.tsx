import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { FOCUS_RING, SWISS_MOTION } from "../../../lib/styles.js";
import { IconButtonBase, type IconButtonBaseProps } from "../../_base/IconButton/IconButtonBase.js";

export type IconButtonSwissSize = "sm" | "md" | "lg";

type Own = {
  /** Required: icon-only buttons have no visible text. */
  "aria-label": string;
  variant?: "solid" | "outline";
  /** `lg` is the floating action button size. */
  size?: IconButtonSwissSize;
  children: ReactNode;
};

export type IconButtonSwissProps =
  | (Own & Omit<ComponentProps<"button">, keyof Own> & { href?: undefined })
  | (Own & Omit<ComponentProps<"a">, keyof Own> & { href: string; disabled?: boolean });

const VARIANTS = {
  solid: "bg-bh-ink text-bh-paper-white",
  outline: "border border-bh-ink bg-transparent text-bh-ink",
} as const;

const HOVER = {
  solid: "hover:bg-bh-charcoal",
  outline: "hover:bg-bh-ink hover:text-bh-paper-white",
} as const;

const SIZES: Record<IconButtonSwissSize, string> = {
  sm: "size-8 text-sm",
  md: "size-11 text-base",
  lg: "size-14 text-xl",
};

/** Swiss circular icon button, outlined by default. Renders `<a>` when `href` is given. */
export function IconButtonSwiss(props: IconButtonSwissProps) {
  const { variant = "outline", size = "md", ...rest } = props;
  const root = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-bh-grotesk font-normal",
    VARIANTS[variant],
    SIZES[size],
    rest.disabled ? "cursor-not-allowed opacity-50" : HOVER[variant],
    SWISS_MOTION,
    FOCUS_RING,
  );
  return <IconButtonBase {...(rest as IconButtonBaseProps)} classes={{ root }} />;
}
