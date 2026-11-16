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
