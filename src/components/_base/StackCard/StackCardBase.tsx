import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";

export type StackCardBaseClasses = { root: string; spine: string; body: string; action: string };

export type StackCardBaseProps = ComponentProps<"div"> & {
  /** Trailing action, e.g. a `+` icon button. */
  action?: ReactNode;
  classes: StackCardBaseClasses;
};

/** Internal: list-item card with a coloured spine edge (decorative) and an optional trailing action. */
export function StackCardBase({ action, classes, className, children, ...props }: StackCardBaseProps) {
  return (
    <div className={cn(classes.root, className)} {...props}>
      <span aria-hidden="true" className={classes.spine} />
      <div className={classes.body}>{children}</div>
      {action !== undefined && <div className={classes.action}>{action}</div>}
    </div>
  );
}
