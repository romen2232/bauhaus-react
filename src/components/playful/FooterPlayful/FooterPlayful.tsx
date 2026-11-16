import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { Grid } from "../../primitives/Grid/Grid";

export type FooterPlayfulProps = ComponentProps<"footer"> & {
  columns: ReactNode[];
  bottom?: ReactNode;
};

// One column on mobile; up to six from md. Literal classes for the consumer's Tailwind scan.
const MD_COLS = ["md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-4", "md:grid-cols-5", "md:grid-cols-6"];

/** Ruled grid footer (Mijonju). */
export function FooterPlayful({ columns, bottom, className, ...props }: FooterPlayfulProps) {
  const count = Math.min(Math.max(columns.length, 1), 6);
  return (
    <footer className={cn("bg-bh-paper text-bh-ink", className)} {...props}>
      <Grid ruled cols={1} className={MD_COLS[count - 1]}>
        {columns.map((col, i) => (
          <div key={i} className="p-6 font-bh-body text-sm">
            {col}
          </div>
        ))}
      </Grid>
      {bottom && (
        <div className="border-x border-b border-bh-rule px-6 py-3 font-bh-body text-[11px] uppercase tracking-[0.1em]">
          {bottom}
        </div>
      )}
    </footer>
  );
}
