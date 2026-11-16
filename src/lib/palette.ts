export type FillColor = "red" | "yellow" | "blue" | "navy" | "sky" | "pink" | "orange" | "ink" | "paper";

/** Hex values mirrored from theme.css; used for contrast tests and SVG fills. */
export const HEX: Record<FillColor, string> = {
  red: "#EA4535",
  yellow: "#F5B62A",
  blue: "#1F5FD8",
  navy: "#1A2340",
  sky: "#00A8FC",
  pink: "#FF77A8",
  orange: "#F06030",
  ink: "#111111",
  paper: "#F4EFE6",
};

/** Text color that passes WCAG AA on each fill. */
export const TEXT_ON: Record<FillColor, "ink" | "paper"> = {
  red: "ink",
  yellow: "ink",
  blue: "paper",
  navy: "paper",
  sky: "ink",
  pink: "ink",
  orange: "ink",
  ink: "paper",
  paper: "ink",
};

// Literal class strings: the consumer's Tailwind must be able to read them whole.
export const BG_CLASSES: Record<FillColor, string> = {
  red: "bg-bh-red",
  yellow: "bg-bh-yellow",
  blue: "bg-bh-blue",
  navy: "bg-bh-navy",
  sky: "bg-bh-sky",
  pink: "bg-bh-pink",
  orange: "bg-bh-orange",
  ink: "bg-bh-ink",
  paper: "bg-bh-paper",
};

export const FILL_CLASSES: Record<FillColor, string> = {
  red: "bg-bh-red text-bh-ink",
  yellow: "bg-bh-yellow text-bh-ink",
  blue: "bg-bh-blue text-bh-paper",
  navy: "bg-bh-navy text-bh-paper",
  sky: "bg-bh-sky text-bh-ink",
  pink: "bg-bh-pink text-bh-ink",
  orange: "bg-bh-orange text-bh-ink",
  ink: "bg-bh-ink text-bh-paper",
  paper: "bg-bh-paper text-bh-ink",
};

/** Soft look: the triad encodes meaning only (status, category, step). */
export type SoftTone = "red" | "yellow" | "blue" | "neutral";

/** Hex values mirrored from theme.css for the Soft look; used for contrast tests. */
export const SOFT_HEX: Record<SoftTone | "sand", string> = {
  red: HEX.red,
  yellow: HEX.yellow,
  blue: HEX.blue,
  neutral: "#464646",
  sand: "#F5CF8A",
};

/** Text color that passes WCAG AA on each Soft tone. */
export const SOFT_TONE_TEXT_ON: Record<SoftTone, "ink" | "paper"> = {
  red: "ink",
  yellow: "ink",
  blue: "paper",
  neutral: "paper",
};

export const SOFT_TONE_CLASSES: Record<SoftTone, string> = {
  red: "bg-bh-red text-bh-ink",
  yellow: "bg-bh-yellow text-bh-ink",
  blue: "bg-bh-blue text-bh-paper",
  neutral: "bg-bh-charcoal text-bh-paper",
};

/** Hex values mirrored from theme.css for the Swiss look; used for contrast tests. */
export const SWISS_HEX = {
  white: "#FFFFFF",
  ink: HEX.ink,
  mutedText: "#6E6A64",
  rule: "#E5E5E5",
  accent: HEX.red,
  charcoal: SOFT_HEX.neutral,
} as const;

/** Sets currentColor for decoration (patterns, strokes). Never use for readable text. */
export const CURRENT_COLOR_CLASSES: Record<FillColor, string> = {
  red: "text-bh-red",
  yellow: "text-bh-yellow",
  blue: "text-bh-blue",
  navy: "text-bh-navy",
  sky: "text-bh-sky",
  pink: "text-bh-pink",
  orange: "text-bh-orange",
  ink: "text-bh-ink",
  paper: "text-bh-paper",
};

/**
 * Soft look hover: a 10% tonal step. Every fill steps darker except `red`, which
 * steps lighter, because a darker red drops ink text below WCAG AA (4.12:1).
 */
export const SOFT_HOVER_CLASSES: Record<SoftTone | "sand" | "paper", string> = {
  red: "hover:bg-[color-mix(in_srgb,var(--color-bh-red)_90%,var(--color-bh-paper))]",
  yellow: "hover:bg-[color-mix(in_srgb,var(--color-bh-yellow)_90%,var(--color-bh-ink))]",
  blue: "hover:bg-[color-mix(in_srgb,var(--color-bh-blue)_90%,var(--color-bh-ink))]",
  neutral: "hover:bg-[color-mix(in_srgb,var(--color-bh-charcoal)_90%,var(--color-bh-ink))]",
  sand: "hover:bg-[color-mix(in_srgb,var(--color-bh-sand)_90%,var(--color-bh-ink))]",
  paper: "hover:bg-[color-mix(in_srgb,var(--color-bh-paper)_90%,var(--color-bh-ink))]",
};
