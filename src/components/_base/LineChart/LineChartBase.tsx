"use client";
import { useState } from "react";
import { estimateTextWidth, formatNumber, labelStride, linearScale, linePath, niceTicks } from "../../../lib/chart.js";
import type { ChartLookClasses } from "../../../lib/chartClasses.js";
import type { ChartDatum, ChartSeries } from "../../../lib/chartTypes.js";
import { ChartFrame, type ChartTooltipState, type CommonChartProps } from "../ChartFrame/ChartFrame.js";

export type LineChartProps = CommonChartProps &
  ({ data: ChartDatum[]; series?: never } | { series: ChartSeries[]; data?: never }) & {
    /** Label of the point to highlight on the first series. Its value is always printed. */
    highlight?: string;
  };

export type LineChartClasses = Pick<
  ChartLookClasses,
  "root" | "caption" | "plot" | "tooltip" | "tick" | "baseline" | "grid" | "valueLabel"
> & {
  line: (seriesIndex: number) => string;
  /** Stroke class of a casing path drawn under every line; empty for none. */
  casing: string;
  point: (seriesIndex: number, isHighlighted: boolean) => string;
};

export type LineChartBaseProps = LineChartProps & {
  classes: LineChartClasses;
  gridlines: boolean;
};

const MAX_SERIES = 3;
const TOP = 16;
const BOTTOM = 24;
const RIGHT = 12;
const TICK_SIZE = 11;
const CATEGORY_SIZE = 12;
const POINT_RADIUS = 4;

const round = (n: number) => +n.toFixed(2);

/**
 * Internal: line chart with up to three series. The value axis does not force zero. Marks are not
 * focusable; hovering a category column shows a tooltip with every series value, and the frame's
 * data table carries the same values.
 */
export function LineChartBase({
  title,
  hideTitle,
  height = 240,
  showValues,
  formatValue = formatNumber,
  className,
  ref,
  data,
  series,
  highlight,
  classes,
  gridlines,
}: LineChartBaseProps) {
  const [hover, setHover] = useState<(NonNullable<ChartTooltipState> & { index: number }) | null>(null);

  const all: ChartSeries[] = (series ?? [{ id: "data", label: "Value", data: data ?? [] }]).slice(0, MAX_SERIES);

  // Categories: labels of the first series, then labels only seen later, in order of first appearance.
  const categories: string[] = [];
  for (const s of all) for (const d of s.data) if (!categories.includes(d.label)) categories.push(d.label);

  // value[s][c] is undefined when the series has no point for the category.
  const lookup = all.map((s) => categories.map((c) => s.data.find((d) => d.label === c)?.value));
  const finite = (v: number | undefined): v is number => v !== undefined && Number.isFinite(v);
  const display = (v: number | undefined) => (v === undefined || !Number.isFinite(v) ? "—" : formatValue(v));

  const finiteValues = lookup.flat().filter(finite);
  const ticks = niceTicks(Math.min(...finiteValues), Math.max(...finiteValues));
  const tickLabels = ticks.map((t) => formatValue(t));
  const highlightIndex = highlight === undefined ? -1 : categories.indexOf(highlight);

  const table = {
    headers: ["Label", ...all.map((s) => s.label)],
    rows: categories.map((c, ci) => [c, ...all.map((_, si) => display(lookup[si]![ci]))]),
  };

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
    >
      {(width) => {
        const widest = Math.max(0, ...tickLabels.map((t) => estimateTextWidth(t, TICK_SIZE)));
        const left = Math.ceil(widest) + 12;
        const plotW = Math.max(0, width - left - RIGHT);
        const plotH = Math.max(0, height - TOP - BOTTOM);
        const y = linearScale([ticks[0]!, ticks[ticks.length - 1]!], [TOP + plotH, TOP]);
        const step = categories.length > 0 ? plotW / categories.length : 0;
        const cx = (i: number) => left + step * i + step / 2;
        const longest = Math.max(0, ...categories.map((c) => c.length));
        const stride = labelStride(step, estimateTextWidth("x".repeat(longest), CATEGORY_SIZE));
        const bottom = TOP + plotH;

        // Points actually drawn: finite values only, so no attribute ever holds NaN.
        const drawn = lookup.map((vals) =>
          vals.flatMap((v, ci) => (finite(v) ? [{ ci, x: round(cx(ci)), y: round(y(v)), v }] : [])),
        );

        return (
          <>
            {ticks.map((t, i) => (
              <g key={`t${i}`}>
                {gridlines && (
                  <line
                    data-chart-grid=""
                    className={classes.grid}
                    x1={left}
                    x2={left + plotW}
                    y1={round(y(t))}
                    y2={round(y(t))}
                  />
                )}
                <text className={classes.tick} x={left - 6} y={round(y(t))} textAnchor="end" dominantBaseline="middle">
                  {tickLabels[i]}
                </text>
              </g>
            ))}
            <line
              data-chart-baseline=""
              className={classes.baseline}
              x1={left}
              x2={left + plotW}
              y1={round(bottom)}
              y2={round(bottom)}
            />
            {drawn.map((pts, si) => {
              if (pts.length < 2) return null;
              const d = linePath(pts);
              return (
                <g key={`l${si}`}>
                  {classes.casing && (
                    <path
                      data-chart-line=""
                      className={classes.casing}
                      d={d}
                      fill="none"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  )}
                  <path
                    data-chart-line=""
                    className={classes.line(si)}
                    d={d}
                    fill="none"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
            {drawn.map((pts, si) =>
              pts.map((p) => (
                <circle
                  key={`p${si}-${p.ci}`}
                  data-chart-mark=""
                  className={classes.point(si, si === 0 && p.ci === highlightIndex)}
                  cx={p.x}
                  cy={p.y}
                  r={POINT_RADIUS}
                />
              )),
            )}
            {categories.map((c, ci) =>
              ci % stride !== 0 ? null : (
                <text
                  key={`c${ci}`}
                  data-chart-category=""
                  className={classes.tick}
                  x={round(cx(ci))}
                  y={height - 6}
                  textAnchor="middle"
                >
                  {c}
                </text>
              ),
            )}
            {drawn.map((pts, si) =>
              pts.map((p) => {
                if (!showValues && !(si === 0 && p.ci === highlightIndex)) return null;
                return (
                  <text
                    key={`v${si}-${p.ci}`}
                    data-chart-label=""
                    className={classes.valueLabel}
                    x={p.x}
                    y={round(p.y - 10)}
                    textAnchor="middle"
                  >
                    {display(p.v)}
                  </text>
                );
              }),
            )}
            {categories.map((c, ci) => (
              <rect
                key={`h${ci}`}
                data-chart-hit=""
                x={round(left + ci * step)}
                y={TOP}
                width={round(step)}
                height={round(plotH)}
                fill="none"
                pointerEvents="all"
                onPointerEnter={() => {
                  const ys = drawn.flatMap((pts) => pts.filter((p) => p.ci === ci).map((p) => p.y));
                  const text =
                    all.length === 1
                      ? `${c}: ${display(lookup[0]![ci])}`
                      : `${c}: ${all.map((s, si) => `${s.label} ${display(lookup[si]![ci])}`).join(", ")}`;
                  setHover({
                    index: ci,
                    x: round(cx(ci)),
                    y: round((ys.length > 0 ? Math.min(...ys) : bottom) - 10),
                    text,
                  });
                }}
                onPointerLeave={() => setHover((h) => (h?.index === ci ? null : h))}
              />
            ))}
          </>
        );
      }}
    </ChartFrame>
  );
}
