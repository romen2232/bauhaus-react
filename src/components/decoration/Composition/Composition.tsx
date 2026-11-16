import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";

type Track = 1 | 2 | 3 | 4 | 5 | 6;
export type CompositionSize = 2 | 3 | 4 | 5 | 6;

export type CompositionCell = {
  col: Track;
  row: Track;
  colSpan?: Track;
  rowSpan?: Track;
  node: ReactNode;
};

export type CompositionProps = ComponentProps<"div"> & {
  cols: CompositionSize;
  rows: CompositionSize;
  cells: CompositionCell[];
};

// Static class maps: the consumer's Tailwind must see each class whole.
const COLS: Record<CompositionSize, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};
const ROWS: Record<CompositionSize, string> = {
  2: "grid-rows-2",
  3: "grid-rows-3",
  4: "grid-rows-4",
  5: "grid-rows-5",
  6: "grid-rows-6",
};
const COL_START: Record<Track, string> = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
  5: "col-start-5",
  6: "col-start-6",
};
const ROW_START: Record<Track, string> = {
  1: "row-start-1",
  2: "row-start-2",
  3: "row-start-3",
  4: "row-start-4",
  5: "row-start-5",
  6: "row-start-6",
};
const COL_SPAN: Record<Track, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
};
const ROW_SPAN: Record<Track, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
};

/** Decorative grid of shapes and patterns placed by explicit cells (BHause hero composition). */
export function Composition({ cols, rows, cells, className, ...props }: CompositionProps) {
  return (
    <div aria-hidden="true" className={cn("grid", COLS[cols], ROWS[rows], className)} {...props}>
      {cells.map((cell, i) => (
        <div
          key={i}
          className={cn(
            "relative min-h-0 min-w-0",
            COL_START[cell.col],
            ROW_START[cell.row],
            COL_SPAN[cell.colSpan ?? 1],
            ROW_SPAN[cell.rowSpan ?? 1],
          )}
        >
          {cell.node}
        </div>
      ))}
    </div>
  );
}
