"use client";
import { LineChartBase, type LineChartProps } from "../../_base/LineChart/LineChartBase.js";
import { CHART_CLASSES } from "../../../lib/chartClasses.js";
import { SOFT_TONE_SVG_FILL, type SoftTone } from "../../../lib/palette.js";

export type LineChartSoftProps = LineChartProps & {
  /** Tone of the highlighted point. The highlighted point always prints its value. */
  tone?: SoftTone;
};

const { root, caption, plot, tooltip, tick, baseline, grid, valueLabel } = CHART_CLASSES.soft;

/** Series are told apart by dash pattern, not colour: the triad is reserved for meaning. */
const LINES = [
  "stroke-bh-charcoal stroke-2",
  "stroke-bh-charcoal stroke-2 [stroke-dasharray:6_4]",
  "stroke-bh-charcoal stroke-2 [stroke-dasharray:1_4]",
];

/** Soft line chart: charcoal lines, one highlighted point in a tone, no gridlines. */
export function LineChartSoft({ tone = "blue", ...props }: LineChartSoftProps) {
  return (
    <LineChartBase
      {...(props as LineChartProps)}
      classes={{
        root,
        caption,
        plot,
        tooltip,
        tick,
        baseline,
        grid,
        valueLabel,
        line: (i) => LINES[i % LINES.length]!,
        casing: "",
        point: (_i, isHighlighted) => (isHighlighted ? SOFT_TONE_SVG_FILL[tone] : "fill-bh-charcoal"),
      }}
      gridlines={false}
    />
  );
}
