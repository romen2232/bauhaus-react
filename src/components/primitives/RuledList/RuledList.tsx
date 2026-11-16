import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";

export type RuledListOffset = 0 | 1 | 2 | 3;
export type RuledListItem = { content: ReactNode; offset?: RuledListOffset };
export type RuledListProps = ComponentProps<"ul"> & { items: RuledListItem[] };

// Offsets step in eighths of the row, for asymmetric "staff" layouts (BauhausConcept).
const OFFSETS: Record<RuledListOffset, string> = {
  0: "pl-0",
  1: "pl-[12.5%]",
  2: "pl-[25%]",
  3: "pl-[37.5%]",
};

/** Items laid on 1px horizontal rules, optionally offset across the row. */
export function RuledList({ items, className, ...props }: RuledListProps) {
  return (
    <ul className={cn("border-t border-bh-rule", className)} {...props}>
      {items.map((item, i) => (
        <li key={i} className={cn("border-b border-bh-rule py-2 font-bh-body uppercase", OFFSETS[item.offset ?? 0])}>
          {item.content}
        </li>
      ))}
    </ul>
  );
}
