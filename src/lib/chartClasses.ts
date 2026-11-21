import { SWISS_DISPLAY, SWISS_LABEL } from "./styles.js";

export type ChartLookClasses = {
  root: string;
  caption: string;
  plot: string;
  tooltip: string;
  tick: string;
  baseline: string;
  grid: string;
  valueLabel: string;
  centre: string;
  centreCaption: string;
  legend: string;
};

/** Static class maps per look. Literal strings only: the consumer's Tailwind must see them whole. */
export const CHART_CLASSES: { playful: ChartLookClasses; soft: ChartLookClasses; swiss: ChartLookClasses } = {
  playful: {
    root: "relative m-0 flex flex-col gap-2 text-bh-ink",
    caption: "font-bh-display text-sm font-black uppercase tracking-wide",
    plot: "relative w-full",
    tooltip:
      "pointer-events-none absolute z-10 whitespace-nowrap border-2 border-bh-ink bg-bh-paper-white px-2 py-1 font-bh-body text-xs font-semibold shadow-bh-hard",
    tick: "fill-bh-ink font-bh-body text-[11px] font-semibold",
    baseline: "stroke-bh-ink stroke-2",
    grid: "",
    valueLabel: "fill-bh-ink font-bh-display text-xs font-black",
    centre: "fill-bh-ink font-bh-display text-3xl font-black",
    centreCaption: "fill-bh-ink font-bh-body text-xs font-semibold",
    legend: "flex flex-wrap gap-x-4 gap-y-1 font-bh-body text-xs font-semibold",
  },
  soft: {
    root: "relative m-0 flex flex-col gap-2 text-bh-charcoal",
    caption: "font-bh-display text-base",
    plot: "relative w-full",
    tooltip:
      "pointer-events-none absolute z-10 whitespace-nowrap rounded-full bg-bh-charcoal px-3 py-1 font-bh-body text-xs text-bh-paper",
    tick: "fill-bh-charcoal font-bh-body text-[11px]",
    baseline: "stroke-bh-charcoal stroke-1",
    grid: "",
    valueLabel: "fill-bh-charcoal font-bh-body text-xs",
    centre: "fill-bh-charcoal font-bh-display text-3xl",
    centreCaption: "fill-bh-charcoal font-bh-body text-xs",
    legend: "flex flex-wrap gap-x-4 gap-y-1 font-bh-body text-xs",
  },
  swiss: {
    root: "relative m-0 flex flex-col gap-2 text-bh-ink",
    caption: SWISS_LABEL,
    plot: "relative w-full",
    tooltip:
      "pointer-events-none absolute z-10 whitespace-nowrap border border-bh-ink bg-bh-paper-white px-2 py-1 font-bh-grotesk text-xs font-normal",
    tick: "fill-bh-muted-text font-bh-grotesk text-[11px] font-normal",
    baseline: "stroke-bh-ink stroke-1",
    grid: "stroke-bh-rule stroke-1",
    valueLabel: "fill-bh-ink font-bh-grotesk text-xs font-normal",
    centre: `fill-bh-ink ${SWISS_DISPLAY} text-3xl`,
    centreCaption: "fill-bh-muted-text font-bh-grotesk text-[11px] font-normal uppercase tracking-[0.1em]",
    legend: "flex flex-wrap gap-x-4 gap-y-1 font-bh-grotesk text-xs font-normal",
  },
};
