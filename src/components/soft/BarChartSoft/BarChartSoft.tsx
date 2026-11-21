"use client";
import { BarChartBase, type BarChartProps } from "../../_base/BarChart/BarChartBase.js";
import { CHART_CLASSES } from "../../../lib/chartClasses.js";
import { SOFT_TONE_SVG_FILL, type SoftTone } from "../../../lib/palette.js";

export type BarChartSoftProps = BarChartProps & {
  /** Tone of the highlighted bar. The highlighted bar always prints its value. */
  tone?: SoftTone;
};

const { root, caption, plot, tooltip, tick, baseline, grid, valueLabel } = CHART_CLASSES.soft;

/** Soft bar chart: rounded charcoal bars, one highlighted bar in a tone, no gridlines. */
export function BarChartSoft({ tone = "blue", ...props }: BarChartSoftProps) {
  const mark = (_index: number, isHighlighted: boolean) =>
    isHighlighted ? SOFT_TONE_SVG_FILL[tone] : "fill-bh-charcoal";
  return (
    <BarChartBase
      {...props}
      classes={{ root, caption, plot, tooltip, tick, baseline, grid, valueLabel, mark }}
      gridlines={false}
      barRadius={6}
    />
  );
}
