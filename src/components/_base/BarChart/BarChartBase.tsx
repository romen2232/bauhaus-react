"use client";
import { useState } from "react";
import { bandLayout, estimateTextWidth, formatNumber, labelStride, linearScale, niceTicks } from "../../../lib/chart.js";
import type { ChartLookClasses } from "../../../lib/chartClasses.js";
import type { ChartDatum } from "../../../lib/chartTypes.js";
import { ChartFrame, type ChartTooltipState, type CommonChartProps } from "../ChartFrame/ChartFrame.js";

export type BarChartProps = CommonChartProps & {
  data: ChartDatum[];
  /** Label of the bar to highlight (the first match). Its value is always printed. */
  highlight?: string;
};

export type BarChartClasses = Pick<
  ChartLookClasses,
  "root" | "caption" | "plot" | "tooltip" | "tick" | "baseline" | "grid" | "valueLabel"
> & { mark: (index: number, isHighlighted: boolean) => string };

export type BarChartBaseProps = BarChartProps & {
  classes: BarChartClasses;
  gridlines: boolean;
  barRadius: number;
};

const TOP = 16;
const BOTTOM = 24;
const RIGHT = 8;
const TICK_SIZE = 11;
const CATEGORY_SIZE = 12;

const round = (n: number) => +n.toFixed(2);

/**
 * Internal: vertical bar chart. The value axis always includes zero and negative bars hang below
 * the baseline. Marks are not focusable; hovering a category's hit area shows a tooltip, and the
 * frame's data table carries the same values.
 */
export function BarChartBase({
  title,
  hideTitle,
  height = 240,
  showValues,
  formatValue = formatNumber,
  className,
  ref,
  data,
  highlight,
  classes,
  gridlines,
  barRadius,
}: BarChartBaseProps) {
  const [hover, setHover] = useState<(NonNullable<ChartTooltipState> & { index: number }) | null>(null);

  const values = data.map((d) => (Number.isFinite(d.value) ? d.value : 0));
  const display = (i: number) => (Number.isFinite(data[i]!.value) ? formatValue(data[i]!.value) : "—");
  const ticks = niceTicks(Math.min(0, ...values), Math.max(0, ...values));
  const tickLabels = ticks.map((t) => formatValue(t));
  const highlightIndex = highlight === undefined ? -1 : data.findIndex((d) => d.label === highlight);

  const table = {
    headers: ["Label", "Value"],
    rows: data.map((d, i) => [d.label, display(i)]),
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
        const [dMin, dMax] = [ticks[0]!, ticks[ticks.length - 1]!];
        const y = linearScale([dMin, dMax], [TOP + plotH, TOP]);
        const zero = y(0);
        const bands = bandLayout(data.length, plotW);
        const step = data.length > 0 ? plotW / data.length : 0;
        const longest = Math.max(0, ...data.map((d) => d.label.length));
        const stride = labelStride(step, estimateTextWidth("x".repeat(longest), CATEGORY_SIZE));

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
            {bands.map((b, i) => {
              const v = values[i]!;
              const top = Math.min(y(v), zero);
              const h = Math.abs(zero - y(v));
              const isHi = i === highlightIndex;
              return (
                <rect
                  key={`m${i}`}
                  data-chart-mark=""
                  className={classes.mark(i, isHi)}
                  x={round(left + b.x)}
                  y={round(top)}
                  width={round(b.width)}
                  height={round(h)}
                  rx={barRadius}
                />
              );
            })}
            <line
              data-chart-baseline=""
              className={classes.baseline}
              x1={left}
              x2={left + plotW}
              y1={round(zero)}
              y2={round(zero)}
            />
            {bands.map((b, i) => {
              if (i % stride !== 0) return null;
              return (
                <text
                  key={`c${i}`}
                  data-chart-category=""
                  className={classes.tick}
                  x={round(left + b.x + b.width / 2)}
                  y={height - 6}
                  textAnchor="middle"
                >
                  {data[i]!.label}
                </text>
              );
            })}
            {bands.map((b, i) => {
              if (!showValues && i !== highlightIndex) return null;
              const v = values[i]!;
              const labelY = v >= 0 ? y(v) - 4 : y(v) + 12;
              return (
                <text
                  key={`v${i}`}
                  data-chart-label=""
                  className={classes.valueLabel}
                  x={round(left + b.x + b.width / 2)}
                  y={round(labelY)}
                  textAnchor="middle"
                >
                  {display(i)}
                </text>
              );
            })}
            {data.map((_, i) => (
              <rect
                key={`h${i}`}
                data-chart-hit=""
                x={round(left + i * step)}
                y={TOP}
                width={round(step)}
                height={round(plotH)}
                fill="none"
                pointerEvents="all"
                onPointerEnter={() =>
                  setHover({
                    index: i,
                    x: round(left + (bands[i]!.x + bands[i]!.width / 2)),
                    y: round(Math.min(y(values[i]!), zero) - 6),
                    text: `${data[i]!.label}: ${display(i)}`,
                  })
                }
                onPointerLeave={() => setHover((h) => (h?.index === i ? null : h))}
              />
            ))}
          </>
        );
      }}
    </ChartFrame>
  );
}
