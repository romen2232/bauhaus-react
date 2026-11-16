import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";
import { FILL_CLASSES, type FillColor } from "../../../lib/palette.js";

export type TagPlayfulProps = ComponentProps<"span"> & { color?: FillColor };

/** Solid color label ("NEW SCRIPT", "DAILY SKETCH"). */
export function TagPlayful({ color = "yellow", className, ...props }: TagPlayfulProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-none px-2 py-1 font-bh-body text-[11px] font-semibold uppercase tracking-[0.1em]",
        FILL_CLASSES[color],
        className,
      )}
      {...props}
    />
  );
}
