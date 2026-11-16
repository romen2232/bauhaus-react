import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn";

export type TopBarPlayfulProps = ComponentProps<"header"> & {
  brand: ReactNode;
  /** Small uppercase info cells, shown from the md breakpoint up. */
  meta?: ReactNode[];
  /** Right-aligned cell (menu button, CTA). */
  action?: ReactNode;
};

/** Site header made of ruled cells (Mijonju / Manifesto). */
export function TopBarPlayful({ brand, meta = [], action, className, ...props }: TopBarPlayfulProps) {
  return (
    <header
      className={cn("flex items-stretch divide-x divide-bh-ink border-b border-bh-ink bg-bh-paper text-bh-ink", className)}
      {...props}
    >
      <div className="flex items-center px-4 py-3 font-bh-display font-bold">{brand}</div>
      {meta.map((item, i) => (
        <div key={i} className="hidden px-4 py-3 font-bh-body text-[11px] uppercase tracking-[0.1em] md:block">
          {item}
        </div>
      ))}
      {action && <div className="ml-auto flex items-center px-4 py-2">{action}</div>}
    </header>
  );
}
