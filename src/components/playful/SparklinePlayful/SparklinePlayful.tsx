"use client";
import { SparklineBase, type SparklineProps } from "../../_base/Sparkline/SparklineBase.js";
import { CHART_CLASSES } from "../../../lib/chartClasses.js";
import { SVG_FILL_CLASSES, type FillColor } from "../../../lib/palette.js";

export type SparklinePlayfulProps = Omit<SparklineProps, "highlight"> & {
  /** Colour of the end dot. Defaults to red. */
  color?: FillColor;
};

const { root, caption, plot } = CHART_CLASSES.playful;

/** Playful sparkline: an ink line ending in an ink-outlined dot in a palette colour. */
export function SparklinePlayful({ color = "red", ...props }: SparklinePlayfulProps) {
  return (
    <SparklineBase
      {...props}
      classes={{
        root,
        caption,
        plot,
        line: "stroke-bh-ink stroke-2",
        casing: "",
        dot: () => `${SVG_FILL_CLASSES[color]} stroke-bh-ink stroke-2`,
      }}
    />
  );
}
