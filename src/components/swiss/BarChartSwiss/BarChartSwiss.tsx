"use client";
import { BarChartBase, type BarChartProps } from "../../_base/BarChart/BarChartBase.js";
import { CHART_CLASSES } from "../../../lib/chartClasses.js";

export type BarChartSwissProps = BarChartProps;

const { root, caption, plot, tooltip, tick, baseline, grid, valueLabel } = CHART_CLASSES.swiss;
const mark = (_index: number, isHighlighted: boolean) => (isHighlighted ? "fill-bh-accent" : "fill-bh-ink");

/** Swiss bar chart: square ink bars on 1px rule gridlines, one accent bar at most. */
export function BarChartSwiss(props: BarChartSwissProps) {
  return (
    <BarChartBase
      {...props}
      classes={{ root, caption, plot, tooltip, tick, baseline, grid, valueLabel, mark }}
      gridlines
      barRadius={0}
    />
  );
}
