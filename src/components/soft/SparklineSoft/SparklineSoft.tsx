"use client";
import { SparklineBase, type SparklineProps } from "../../_base/Sparkline/SparklineBase.js";
import { CHART_CLASSES } from "../../../lib/chartClasses.js";
import { SOFT_TONE_SVG_FILL, type SoftTone } from "../../../lib/palette.js";

export type SparklineSoftProps = SparklineProps & {
  /** Tone of the end dot. Defaults to blue. */
  tone?: SoftTone;
};

const { root, caption, plot } = CHART_CLASSES.soft;

/** Soft sparkline: a charcoal line with one dot in a tone. */
export function SparklineSoft({ tone = "blue", ...props }: SparklineSoftProps) {
  return (
    <SparklineBase
      {...props}
      classes={{
        root,
        caption,
        plot,
        line: "stroke-bh-charcoal stroke-2",
        casing: "",
        dot: () => SOFT_TONE_SVG_FILL[tone],
      }}
    />
  );
}
