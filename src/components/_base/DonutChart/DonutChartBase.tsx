"use client";
import { useState } from "react";
import { arcPath, formatNumber, groupSlices, pieAngles, polarPoint } from "../../../lib/chart.js";
import type { ChartLookClasses } from "../../../lib/chartClasses.js";
import type { ChartDatum } from "../../../lib/chartTypes.js";
import { ChartFrame, type ChartTooltipState, type CommonChartProps } from "../ChartFrame/ChartFrame.js";

export type DonutChartProps = CommonChartProps & {
  data: ChartDatum[];
  /** Label of the slice to highlight (the first match among the slices drawn). */
  highlight?: string;
  /** Replaces the centre numeral, which defaults to the total. */
  centerLabel?: string;
  /** A small line under the centre numeral. */
  centerCaption?: string;
};

export type DonutChartClasses = Pick<
  ChartLookClasses,
  "root" | "caption" | "plot" | "tooltip" | "valueLabel" | "centre" | "centreCaption" | "legend"
> & {
  /** `highlightIndex` is the highlighted slice (-1 for none), for skins whose colours depend on it. */
  mark: (index: number, isHighlighted: boolean, highlightIndex: number) => string;
  /** Class of the empty ring drawn when the total is 0. */
  track: string;
  /** Class of a legend swatch; defaults to `mark`. */
  swatch?: (index: number, isHighlighted: boolean, highlightIndex: number) => string;
};

export type DonutChartBaseProps = DonutChartProps & {
  classes: DonutChartClasses;
  /** Slices beyond this limit are grouped into "Other". */
  maxSlices: number;
};

const INNER_RATIO = 0.62;
const MARGIN = 4;

const round = (n: number) => +n.toFixed(2);

/**
 * Internal: donut chart. Negative and non-finite values count as 0 and slices beyond `maxSlices`
 * are grouped into "Other"; the data table lists exactly the slices drawn. Slices are not
 * focusable; hovering one shows a tooltip, and the legend is decorative (`aria-hidden`).
 */
export function DonutChartBase({
  title,
  hideTitle,
  height = 240,
  showValues,
  formatValue = formatNumber,
  className,
  ref,
  data,
  highlight,
  centerLabel,
  centerCaption,
  classes,
  maxSlices,
}: DonutChartBaseProps) {
  const [hover, setHover] = useState<(NonNullable<ChartTooltipState> & { index: number }) | null>(null);

  const invalid = new Set<ChartDatum>();
  const cleaned = data.map((d) => {
    const item = { label: d.label, value: Number.isFinite(d.value) && d.value > 0 ? d.value : 0 };
    if (!Number.isFinite(d.value)) invalid.add(item);
    return item;
  });
  const slices = groupSlices(cleaned, maxSlices);
  const display = (s: ChartDatum) => (invalid.has(s) ? "—" : formatValue(s.value));
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const angles = pieAngles(slices.map((s) => s.value));
  const highlightIndex = highlight === undefined ? -1 : slices.findIndex((s) => s.label === highlight);
  const swatchClass = classes.swatch ?? classes.mark;

  const table = {
    headers: ["Label", "Value"],
    rows: slices.map((s) => [s.label, display(s)]),
    footer: ["Total", formatValue(total)],
  };

  const legend = (
    <ul aria-hidden="true" className={classes.legend}>
      {slices.map((s, i) => (
        <li key={i} data-chart-legend="" className="flex items-center gap-1.5">
          <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden="true" className="shrink-0">
            <rect x={1} y={1} width={8} height={8} className={swatchClass(i, i === highlightIndex, highlightIndex)} />
          </svg>
          <span>{s.label}</span>
          {showValues && <span className={classes.valueLabel}>{display(s)}</span>}
        </li>
      ))}
    </ul>
  );

  return (
    <ChartFrame
      title={title}
      hideTitle={hideTitle}
      height={height}
      table={table}
      classes={classes}
      className={className}
      ref={ref}
      tooltip={hover}
      after={legend}
    >
      {(width) => {
        const cx = width / 2;
        const cy = height / 2;
        const outer = Math.max(0, Math.min(width, height) / 2 - MARGIN);
        const inner = outer * INNER_RATIO;

        return (
          <>
            {total === 0 && (
              <path
                data-chart-track=""
                className={classes.track}
                d={arcPath(round(cx), round(cy), outer, inner, 0, 360)}
              />
            )}
            {slices.map((s, i) => {
              const { start, end } = angles[i]!;
              if (end - start <= 0) return null;
              const mid = polarPoint(cx, cy, outer, (start + end) / 2);
              return (
                <path
                  key={`s${i}`}
                  data-chart-mark=""
                  className={classes.mark(i, i === highlightIndex, highlightIndex)}
                  d={arcPath(round(cx), round(cy), outer, inner, start, end)}
                  onPointerEnter={() =>
                    setHover({ index: i, x: round(mid.x), y: round(mid.y - 6), text: `${s.label}: ${display(s)}` })
                  }
                  onPointerLeave={() => setHover((h) => (h?.index === i ? null : h))}
                />
              );
            })}
            <text
              data-chart-centre=""
              className={classes.centre}
              x={round(cx)}
              y={round(centerCaption ? cy - 6 : cy)}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {centerLabel ?? formatValue(total)}
            </text>
            {centerCaption && (
              <text
                className={classes.centreCaption}
                x={round(cx)}
                y={round(cy + 18)}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {centerCaption}
              </text>
            )}
          </>
        );
      }}
    </ChartFrame>
  );
}
