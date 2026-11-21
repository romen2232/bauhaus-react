"use client";
import { DonutChartBase, type DonutChartProps } from "../../_base/DonutChart/DonutChartBase.js";
import { CHART_CLASSES } from "../../../lib/chartClasses.js";
import { SOFT_DONUT_TINTS, SOFT_TONE_SVG_FILL, type SoftTone } from "../../../lib/palette.js";

export type DonutChartSoftProps = DonutChartProps & {
  /** Tone of the highlighted slice. */
  tone?: SoftTone;
};

const { root, caption, plot, tooltip, valueLabel, centre, centreCaption, legend } = CHART_CLASSES.soft;

/**
 * Soft donut chart: slices cycle three charcoal tints (the triad is reserved for meaning), separated
 * by paper gaps, with one highlighted slice in a tone.
 */
export function DonutChartSoft({ tone = "blue", ...props }: DonutChartSoftProps) {
  const mark = (index: number, isHighlighted: boolean) =>
    `${isHighlighted ? SOFT_TONE_SVG_FILL[tone] : SOFT_DONUT_TINTS[index % SOFT_DONUT_TINTS.length]!} stroke-bh-paper stroke-2`;
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
        track: "fill-bh-charcoal/10",
      }}
      maxSlices={6}
    />
  );
}
