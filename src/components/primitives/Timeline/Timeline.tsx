import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";

export type TimelineItem = { year: string; content: ReactNode };
export type TimelineProps = ComponentProps<"ol"> & { items: TimelineItem[] };

/** Ordered list of year markers in large type, each with its content. */
export function Timeline({ items, className, ...props }: TimelineProps) {
  return (
    <ol className={cn("flex flex-col", className)} {...props}>
      {items.map((item) => (
        <li key={item.year} className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-bh-rule py-4">
          <time dateTime={item.year} className="font-bh-display text-5xl leading-none tabular-nums">
            {item.year}
          </time>
          <div className="font-bh-body">{item.content}</div>
        </li>
      ))}
    </ol>
  );
}
