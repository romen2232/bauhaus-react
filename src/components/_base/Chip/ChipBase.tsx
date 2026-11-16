import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";

export type ChipBaseProps = ComponentProps<"span"> & {
  /** Optional leading icon; decorative. */
  icon?: ReactNode;
  classes: { root: string; icon: string };
};

/** Internal: non-interactive metadata pill. */
export function ChipBase({ icon, classes, className, children, ...props }: ChipBaseProps) {
  return (
    <span className={cn(classes.root, className)} {...props}>
      {icon && (
        <span aria-hidden="true" className={classes.icon}>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
