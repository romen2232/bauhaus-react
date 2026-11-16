import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { SOFT_HOVER_CLASSES, SOFT_TONE_CLASSES, type SoftTone } from "../../../lib/palette.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { ButtonBase, type ButtonBaseProps } from "../../_base/Button/ButtonBase.js";

export type ButtonSoftVariant = "solid" | "outline" | "color";
export type ButtonSoftSize = "sm" | "md" | "lg";

type BaseProps = {
  /** `outline` is a sand fill: the Soft look has no borders. */
  variant?: ButtonSoftVariant;
  /** Meaning-carrying tone for the `color` variant. Text color is chosen for contrast. */
  tone?: SoftTone;
  size?: ButtonSoftSize;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

type AsButton = BaseProps & Omit<ComponentProps<"button">, keyof BaseProps> & { href?: undefined };
type AsLink = BaseProps & Omit<ComponentProps<"a">, keyof BaseProps> & { href: string };

export type ButtonSoftProps = AsButton | AsLink;

const VARIANTS: Record<Exclude<ButtonSoftVariant, "color">, string> = {
  solid: cn("bg-bh-charcoal text-bh-paper", SOFT_HOVER_CLASSES.neutral),
  outline: cn("bg-bh-sand text-bh-ink", SOFT_HOVER_CLASSES.sand),
};

const TONES: Record<SoftTone, string> = {
  red: cn(SOFT_TONE_CLASSES.red, SOFT_HOVER_CLASSES.red),
  yellow: cn(SOFT_TONE_CLASSES.yellow, SOFT_HOVER_CLASSES.yellow),
  blue: cn(SOFT_TONE_CLASSES.blue, SOFT_HOVER_CLASSES.blue),
  neutral: cn(SOFT_TONE_CLASSES.neutral, SOFT_HOVER_CLASSES.neutral),
};

const SIZES: Record<ButtonSoftSize, string> = {
  sm: "h-8 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-bh-display font-normal motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out";

/** Soft pill button: tonal fills, no borders, no movement. Renders an `<a>` when `href` is given. */
export function ButtonSoft(props: ButtonSoftProps) {
  const { variant = "solid", tone = "blue", size = "md", ...rest } = props;
  const root = cn(
    BASE,
    SIZES[size],
    variant === "color" ? TONES[tone] : VARIANTS[variant],
    rest.disabled && "cursor-not-allowed opacity-50",
    FOCUS_RING,
  );
  return <ButtonBase {...(rest as ButtonBaseProps)} classes={{ root }} />;
}
