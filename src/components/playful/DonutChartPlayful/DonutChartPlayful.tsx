"use client";
import { DonutChartBase, type DonutChartProps } from "../../_base/DonutChart/DonutChartBase.js";
import { CHART_CLASSES } from "../../../lib/chartClasses.js";
import { SVG_FILL_CLASSES, type FillColor } from "../../../lib/palette.js";

export type DonutChartPlayfulProps = Omit<DonutChartProps, "highlight"> & {
  /** Slice colours, cycled by position. Defaults to red, blue, yellow. */
  colors?: FillColor[];
};

const DEFAULT_COLORS: FillColor[] = ["red", "blue", "yellow"];

const { root, caption, plot, tooltip, valueLabel, centre, centreCaption, legend } = CHART_CLASSES.playful;

/** Playful donut chart: up to six slices in palette colours, each outlined in 2px ink. */
export function DonutChartPlayful({ colors, ...props }: DonutChartPlayfulProps) {
  const cycle = colors && colors.length > 0 ? colors : DEFAULT_COLORS;
  const mark = (index: number) => `${SVG_FILL_CLASSES[cycle[index % cycle.length]!]} stroke-bh-ink stroke-2`;
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
        track: "fill-bh-paper stroke-bh-ink stroke-2",
      }}
      maxSlices={6}
    />
  );
}
