"use client";
import { LineChartBase, type LineChartProps } from "../../_base/LineChart/LineChartBase.js";
import { CHART_CLASSES } from "../../../lib/chartClasses.js";
import { SVG_FILL_CLASSES, SVG_STROKE_CLASSES, type FillColor } from "../../../lib/palette.js";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type LineChartPlayfulProps = DistributiveOmit<LineChartProps, "highlight"> & {
  /** Series colours, cycled by position. Defaults to red, blue, yellow. */
  colors?: FillColor[];
};

const DEFAULT_COLORS: FillColor[] = ["red", "blue", "yellow"];

const { root, caption, plot, tooltip, tick, baseline, grid, valueLabel } = CHART_CLASSES.playful;

/**
 * Playful line chart: each series in a palette colour over a 2px ink casing, so light colours
 * (yellow, sky, pink, orange) still reach 3:1 against the paper. Points are outlined in ink.
 */
export function LineChartPlayful({ colors, ...props }: LineChartPlayfulProps) {
  const cycle = colors && colors.length > 0 ? colors : DEFAULT_COLORS;
  const colour = (i: number) => cycle[i % cycle.length]!;
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
        line: (i) => `${SVG_STROKE_CLASSES[colour(i)]} stroke-[3px]`,
        casing: "stroke-bh-ink stroke-[7px]",
        point: (i) => `${SVG_FILL_CLASSES[colour(i)]} stroke-bh-ink stroke-2`,
      }}
      gridlines={false}
    />
  );
}
