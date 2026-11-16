import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { BigNumber } from "../BigNumber/BigNumber.js";

export type StatColumnItem = {
  label: ReactNode;
  value: ReactNode;
  title?: ReactNode;
  list?: ReactNode[];
};

export type StatColumnsProps = ComponentProps<"div"> & { items: StatColumnItem[] };

// Static classes: the consumer's Tailwind must see each one whole.
const COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

/** Ruled row of stat columns: label → big value → title → sub-list. */
export function StatColumns({ items, className, ...props }: StatColumnsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 divide-y divide-bh-rule border-y border-bh-rule md:divide-x md:divide-y-0",
        COLS[Math.min(Math.max(items.length, 1), 4)],
        className,
      )}
      {...props}
    >
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-4 p-6">
          <BigNumber label={item.label} value={item.value} />
          {item.title !== undefined && <p className="font-bh-body text-base">{item.title}</p>}
          {item.list !== undefined && (
            <ul className="font-bh-body text-sm text-bh-muted-text">
              {item.list.map((entry, j) => (
                <li key={j}>{entry}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
