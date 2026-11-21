"use client";
import { BarChartBase, type BarChartProps } from "../../_base/BarChart/BarChartBase.js";
import { CHART_CLASSES } from "../../../lib/chartClasses.js";
import { SVG_FILL_CLASSES, type FillColor } from "../../../lib/palette.js";

export type BarChartPlayfulProps = Omit<BarChartProps, "highlight"> & {
  /** Bar colours, cycled by position. Defaults to red, blue, yellow. */
  colors?: FillColor[];
};

const DEFAULT_COLORS: FillColor[] = ["red", "blue", "yellow"];
const { root, caption, plot, tooltip, tick, baseline, grid, valueLabel } = CHART_CLASSES.playful;

/** Playful bar chart: bold fills cycled from the palette, each bar outlined in 2px ink. */
export function BarChartPlayful({ colors, ...props }: BarChartPlayfulProps) {
  const cycle = colors && colors.length > 0 ? colors : DEFAULT_COLORS;
  const mark = (index: number) => `${SVG_FILL_CLASSES[cycle[index % cycle.length]!]} stroke-bh-ink stroke-2`;
  return (
    <BarChartBase
      {...props}
      classes={{ root, caption, plot, tooltip, tick, baseline, grid, valueLabel, mark }}
      gridlines={false}
      barRadius={0}
    />
  );
}
