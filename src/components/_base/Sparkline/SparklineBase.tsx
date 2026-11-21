"use client";
import { formatNumber, linearScale, linePath } from "../../../lib/chart.js";
import type { ChartLookClasses } from "../../../lib/chartClasses.js";
import type { ChartDatum } from "../../../lib/chartTypes.js";
import { ChartFrame, type CommonChartProps } from "../ChartFrame/ChartFrame.js";

export type SparklineProps = Pick<
  CommonChartProps,
  "title" | "hideTitle" | "height" | "formatValue" | "className" | "ref"
> & {
  data: ChartDatum[];
  /** Label of the point that carries the dot. Defaults to the last point. */
  highlight?: string;
};

export type SparklineClasses = Pick<ChartLookClasses, "root" | "caption" | "plot"> & {
  line: string;
  /** Stroke class of a casing path drawn under the line; empty for none. */
  casing: string;
  dot: (isHighlighted: boolean) => string;
};

export type SparklineBaseProps = SparklineProps & { classes: SparklineClasses };

/** Keeps the line and the dot inside the SVG (dot radius plus its outline). */
const PAD = 4;
const DOT_RADIUS = 3;

const round = (n: number) => +n.toFixed(2);

/**
 * Internal: a compact trend line. No axes, tooltip or hit areas; the data table carries the values.
 * The dot marks the highlighted point, or the last one.
 */
export function SparklineBase({
  title,
  hideTitle,
  height = 32,
  formatValue = formatNumber,
  className,
  ref,
  data,
  highlight,
  classes,
}: SparklineBaseProps) {
  const display = (v: number) => (Number.isFinite(v) ? formatValue(v) : "—");
  const table = { headers: ["Label", "Value"], rows: data.map((d) => [d.label, display(d.value)]) };

  const found = highlight === undefined ? -1 : data.findIndex((d) => d.label === highlight);
  const dotIndex = found >= 0 ? found : data.length - 1;

  return (
    <ChartFrame
      title={title}
      hideTitle={hideTitle}
      height={height}
      table={table}
      classes={{ root: classes.root, caption: classes.caption, plot: classes.plot, tooltip: "" }}
      className={className}
      ref={ref}
    >
      {(width) => {
        const finite = data.flatMap((d, i) => (Number.isFinite(d.value) ? [{ i, v: d.value }] : []));
        const values = finite.map((p) => p.v);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const plotW = Math.max(0, width - PAD * 2);
        // Flat data sits on the vertical middle.
        const y = min === max ? () => height / 2 : linearScale([min, max], [height - PAD, PAD]);
        const x = (i: number) => (data.length > 1 ? PAD + (plotW * i) / (data.length - 1) : width / 2);
        const pts = finite.map((p) => ({ i: p.i, x: round(x(p.i)), y: round(y(p.v)) }));
        const d = linePath(pts);
        const dot = pts.find((p) => p.i === dotIndex);

        return (
          <>
            {pts.length > 1 && classes.casing && (
              <path
                data-chart-line=""
                className={classes.casing}
                d={d}
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
            {pts.length > 1 && (
              <path
                data-chart-line=""
                className={classes.line}
                d={d}
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
            {dot && (
              <circle data-chart-mark="" className={classes.dot(true)} cx={dot.x} cy={dot.y} r={DOT_RADIUS} />
            )}
          </>
        );
      }}
    </ChartFrame>
  );
}
