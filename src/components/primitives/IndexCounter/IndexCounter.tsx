import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";

export type IndexCounterProps = ComponentProps<"span"> & {
  /** 1-based position. */
  current: number;
  total?: number;
  /** Minimum digits shown (zero-padded). */
  pad?: number;
};

const padded = (n: number, pad: number) => String(n).padStart(pad, "0");

/** Zero-padded index like `01` or `01 / 05`, announced as "1 of 5". */
export function IndexCounter({ current, total, pad = 2, className, ...props }: IndexCounterProps) {
  const visible = total === undefined ? padded(current, pad) : `${padded(current, pad)} / ${padded(total, pad)}`;
  const spoken = total === undefined ? String(current) : `${current} of ${total}`;
  return (
    <span className={cn("font-bh-mono text-xs tracking-widest tabular-nums", className)} {...props}>
      <span aria-hidden="true">{visible}</span>
      <span className="sr-only">{spoken}</span>
    </span>
  );
}
