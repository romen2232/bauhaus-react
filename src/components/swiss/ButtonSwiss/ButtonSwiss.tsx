import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { FOCUS_RING, SWISS_LABEL, SWISS_MOTION } from "../../../lib/styles.js";
import { ButtonBase, type ButtonBaseProps } from "../../_base/Button/ButtonBase.js";

export type ButtonSwissVariant = "solid" | "outline" | "color";
export type ButtonSwissSize = "sm" | "md" | "lg";

type BaseProps = {
  variant?: ButtonSwissVariant;
  size?: ButtonSwissSize;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

type AsButton = BaseProps & Omit<ComponentProps<"button">, keyof BaseProps> & { href?: undefined };
type AsLink = BaseProps & Omit<ComponentProps<"a">, keyof BaseProps> & { href: string };

export type ButtonSwissProps = AsButton | AsLink;

const VARIANTS: Record<ButtonSwissVariant, string> = {
  solid: "bg-bh-ink text-bh-paper-white",
  outline: "border border-bh-ink bg-transparent text-bh-ink",
  color: "bg-bh-accent text-bh-ink",
};

const HOVER: Record<ButtonSwissVariant, string> = {
  solid: "hover:bg-bh-charcoal",
  outline: "hover:bg-bh-ink hover:text-bh-paper-white",
  color: "hover:bg-bh-ink hover:text-bh-paper-white",
};

const SIZES: Record<ButtonSwissSize, string> = {
  sm: "h-8 px-4 text-xs rounded-full",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

/** Swiss button with square geometry, except for the small pill. Renders an `<a>` when `href` is given. */
export function ButtonSwiss(props: ButtonSwissProps) {
  const { variant = "solid", size = "md", ...rest } = props;
  const root = cn(
    "inline-flex items-center justify-center gap-2",
    SWISS_LABEL,
    SIZES[size],
    VARIANTS[variant],
    rest.disabled ? "cursor-not-allowed opacity-50" : HOVER[variant],
    SWISS_MOTION,
    FOCUS_RING,
  );
  return <ButtonBase {...(rest as ButtonBaseProps)} classes={{ root }} />;
}
