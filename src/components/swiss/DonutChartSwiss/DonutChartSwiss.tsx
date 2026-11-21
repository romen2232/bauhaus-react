"use client";
import { DonutChartBase, type DonutChartProps } from "../../_base/DonutChart/DonutChartBase.js";
import { CHART_CLASSES } from "../../../lib/chartClasses.js";

export type DonutChartSwissProps = DonutChartProps;

const { root, caption, plot, tooltip, valueLabel, centre, centreCaption, legend } = CHART_CLASSES.swiss;

const ACCENT = "fill-bh-accent";
const PALETTE = ["fill-bh-ink", "fill-bh-charcoal", ACCENT];
const OTHERS = ["fill-bh-ink", "fill-bh-charcoal"];

/** Without a highlight the slices follow the palette; with one, it takes the accent. */
const fillOf = (index: number, isHighlighted: boolean, highlightIndex: number) => {
  if (highlightIndex < 0) return PALETTE[index % PALETTE.length]!;
  if (isHighlighted) return ACCENT;
  const rank = index - (highlightIndex < index ? 1 : 0);
  return OTHERS[rank % OTHERS.length]!;
};

const mark = (index: number, isHighlighted: boolean, highlightIndex: number) =>
  `${fillOf(index, isHighlighted, highlightIndex)} stroke-bh-paper-white stroke-1`;

/** The accent appears once per chart: its legend swatch is drawn as an ink-outlined square instead. */
const swatch = (index: number, isHighlighted: boolean, highlightIndex: number) => {
  const fill = fillOf(index, isHighlighted, highlightIndex);
  return fill === ACCENT ? "fill-bh-paper-white stroke-bh-ink stroke-1" : fill;
};

/** Swiss donut chart: at most three slices in ink, charcoal and one accent, split by 1px white gaps. */
export function DonutChartSwiss(props: DonutChartSwissProps) {
  return (
    <DonutChartBase
      {...props}
      classes={{
        root,
        caption,
        plot,
        tooltip,
        valueLabel,
        centre,
        centreCaption,
        legend,
        mark,
        swatch,
        track: "fill-bh-rule",
      }}
      maxSlices={3}
    />
  );
}
