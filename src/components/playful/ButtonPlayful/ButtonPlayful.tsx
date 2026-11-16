import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { FILL_CLASSES, type FillColor } from "../../../lib/palette.js";
import { FOCUS_RING, HOVER_LIFT } from "../../../lib/styles.js";

export type ButtonPlayfulVariant = "solid" | "outline" | "color";
export type ButtonPlayfulSize = "sm" | "md" | "lg";

type BaseProps = {
  variant?: ButtonPlayfulVariant;
  /** Fill color for the `color` variant. Text color is chosen for contrast. */
  color?: FillColor;
  size?: ButtonPlayfulSize;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

type AsButton = BaseProps & Omit<ComponentProps<"button">, keyof BaseProps> & { href?: undefined };
type AsLink = BaseProps & Omit<ComponentProps<"a">, keyof BaseProps> & { href: string };

export type ButtonPlayfulProps = AsButton | AsLink;

const VARIANTS: Record<Exclude<ButtonPlayfulVariant, "color">, string> = {
  solid: "bg-bh-ink text-bh-paper",
  outline: "border-2 border-bh-ink bg-transparent text-bh-ink",
};

const SIZES: Record<ButtonPlayfulSize, string> = {
  sm: "h-8 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-bh-display font-bold uppercase tracking-wide";

/** Playful pill button. Renders an `<a>` when `href` is given. */
export function ButtonPlayful(props: ButtonPlayfulProps) {
  const { variant = "solid", color = "yellow", size = "md", disabled = false, className } = props;
  const classes = cn(
    BASE,
    SIZES[size],
    variant === "color" ? cn(FILL_CLASSES[color], "border-2 border-bh-ink") : VARIANTS[variant],
    disabled ? "cursor-not-allowed opacity-50" : HOVER_LIFT,
    FOCUS_RING,
    className,
  );

  if (props.href !== undefined) {
    const { variant: _v, color: _c, size: _s, disabled: _d, className: _cl, href, onClick, ...rest } = props;
    return disabled ? (
      <a {...rest} role="link" aria-disabled="true" tabIndex={-1} className={classes} />
    ) : (
      <a {...rest} href={href} onClick={onClick} className={classes} />
    );
  }

  const { variant: _v, color: _c, size: _s, disabled: _d, className: _cl, href: _h, type = "button", ...rest } = props;
  return <button {...rest} type={type} disabled={disabled} className={classes} />;
}
