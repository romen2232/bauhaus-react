import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";

export type TopBarBaseClasses = { root: string; brand: string; meta: string; action: string };

export type TopBarBaseProps = ComponentProps<"header"> & {
  brand: ReactNode;
  meta?: ReactNode[];
  action?: ReactNode;
  classes: TopBarBaseClasses;
};

/** Internal: site header as a row of cells — brand, meta cells, trailing action. */
export function TopBarBase({ brand, meta = [], action, classes, className, ...props }: TopBarBaseProps) {
  return (
    <header className={cn(classes.root, className)} {...props}>
      <div className={classes.brand}>{brand}</div>
      {meta.map((item, i) => (
        <div key={i} className={classes.meta}>
          {item}
        </div>
      ))}
      {action && <div className={classes.action}>{action}</div>}
    </header>
  );
}
