import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";

export type SectionLabelProps = ComponentProps<"span"> & {
  /** Short marker shown in parentheses, e.g. "P" → "(P)". */
  marker: string;
};

/** Uppercase micro label with a parenthesised section marker. */
export function SectionLabel({ marker, className, children, ...props }: SectionLabelProps) {
  return (
    <span
      className={cn("inline-flex items-baseline gap-2 font-bh-body text-xs uppercase tracking-[0.1em]", className)}
      {...props}
    >
      <span>({marker})</span>
      {children !== undefined && <span>{children}</span>}
    </span>
  );
}
