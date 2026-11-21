"use client";
import { LineChartBase, type LineChartProps } from "../../_base/LineChart/LineChartBase.js";
import { CHART_CLASSES } from "../../../lib/chartClasses.js";

export type LineChartSwissProps = LineChartProps;

const { root, caption, plot, tooltip, tick, baseline, grid, valueLabel } = CHART_CLASSES.swiss;

/** Series are told apart by tone and dash pattern: solid ink, dashed charcoal, dotted muted. */
const LINES = [
  "stroke-bh-ink stroke-1",
  "stroke-bh-charcoal stroke-1 [stroke-dasharray:6_4]",
  "stroke-bh-muted-text stroke-1 [stroke-dasharray:1_4]",
];
const POINTS = ["fill-bh-ink", "fill-bh-charcoal", "fill-bh-muted-text"];

/** Swiss line chart: 1px lines on rule gridlines, one accent point at most. */
export function LineChartSwiss(props: LineChartSwissProps) {
  return (
    <LineChartBase
      {...props}
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
        point: (i, isHighlighted) => (isHighlighted ? "fill-bh-accent" : POINTS[i % POINTS.length]!),
      }}
      gridlines
    />
  );
}
