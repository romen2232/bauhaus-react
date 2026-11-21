"use client";
import { useId, useRef, type ReactNode, type Ref } from "react";
import { cn } from "../../../lib/cn.js";
import type { ChartLookClasses } from "../../../lib/chartClasses.js";
import { useMeasuredWidth } from "./useMeasuredWidth.js";

/** The first cell of each row is its row header. */
export type ChartTable = { headers: string[]; rows: string[][]; footer?: string[] };

/** x and y are px inside the plot box. */
export type ChartTooltipState = { x: number; y: number; text: string } | null;

/** Public props every chart shares; each base narrows the `height` default. */
export type CommonChartProps = {
  /** Required: names the figure. Shown as a caption unless `hideTitle`. */
  title: string;
  hideTitle?: boolean;
  height?: number;
  showValues?: boolean;
  formatValue?: (n: number) => string;
  className?: string;
  /** The `<figure>` element. */
  ref?: Ref<HTMLElement>;
};

export type ChartFrameProps = {
  title: string;
  hideTitle?: boolean;
  height: number;
  table: ChartTable;
  tooltip?: ChartTooltipState;
  classes: Pick<ChartLookClasses, "root" | "caption" | "plot" | "tooltip">;
  className?: string;
  ref?: Ref<HTMLElement>;
  /** Optional decorative content shown under the plot (a legend). Must be `aria-hidden`. */
  after?: ReactNode;
  /** Draws the SVG content for the measured width. */
  children: (width: number) => ReactNode;
};

/**
 * Internal: the shared accessible chart shell. A named `<figure>`, an `aria-hidden` SVG (nothing
 * focusable inside), an optional hover tooltip and a visually hidden data table with the same values.
 */
export function ChartFrame({ title, hideTitle, height, table, tooltip, classes, className, ref, after, children }: ChartFrameProps) {
  const captionId = useId();
  const plotRef = useRef<HTMLDivElement>(null);
  const width = useMeasuredWidth(plotRef);

  return (
    <figure ref={ref} aria-labelledby={captionId} className={cn(classes.root, className)}>
      <figcaption id={captionId} className={cn(classes.caption, hideTitle && "sr-only")}>
        {title}
      </figcaption>
      <div ref={plotRef} className={classes.plot}>
        <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
          {children(width)}
        </svg>
        {tooltip && (
          <div
            aria-hidden="true"
            className={classes.tooltip}
            style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
      {after}
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) =>
                c === 0 ? (
                  <th key={c} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={c}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
        {table.footer && (
          <tfoot>
            <tr>
              {table.footer.map((cell, c) =>
                c === 0 ? (
                  <th key={c} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={c}>{cell}</td>
                ),
              )}
            </tr>
          </tfoot>
        )}
      </table>
    </figure>
  );
}
