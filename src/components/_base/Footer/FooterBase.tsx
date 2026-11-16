import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";

export type FooterBaseClasses = { root: string; grid: string; column: string; bottom: string };

export type FooterBaseProps = ComponentProps<"footer"> & {
  columns: ReactNode[];
  bottom?: ReactNode;
  /** `grid` carries any column-count class; skins pick it from a static map. */
  classes: FooterBaseClasses;
};

/** Internal: footer as a grid of column cells plus an optional bottom row. */
export function FooterBase({ columns, bottom, classes, className, ...props }: FooterBaseProps) {
  return (
    <footer className={cn(classes.root, className)} {...props}>
      <div className={classes.grid}>
        {columns.map((col, i) => (
          <div key={i} className={classes.column}>
            {col}
          </div>
        ))}
      </div>
      {bottom && <div className={classes.bottom}>{bottom}</div>}
    </footer>
  );
}
