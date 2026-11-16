import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";

export type TagBaseProps = ComponentProps<"span"> & { classes: { root: string } };

/** Internal: a non-interactive uppercase micro label. */
export function TagBase({ classes, className, ...props }: TagBaseProps) {
  return <span className={cn(classes.root, className)} {...props} />;
}
