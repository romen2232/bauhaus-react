"use client";
import { SparklineBase, type SparklineProps } from "../../_base/Sparkline/SparklineBase.js";
import { CHART_CLASSES } from "../../../lib/chartClasses.js";

export type SparklineSwissProps = SparklineProps;

const { root, caption, plot } = CHART_CLASSES.swiss;

/** Swiss sparkline: a 1px ink line with a single accent dot. */
export function SparklineSwiss(props: SparklineSwissProps) {
  return (
    <SparklineBase
      {...props}
      classes={{
        root,
        caption,
        plot,
        line: "stroke-bh-ink stroke-1",
        casing: "",
        dot: () => "fill-bh-accent",
      }}
    />
  );
}
