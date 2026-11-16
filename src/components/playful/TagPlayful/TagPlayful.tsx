import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";
import { FILL_CLASSES, type FillColor } from "../../../lib/palette.js";
import { TagBase } from "../../_base/Tag/TagBase.js";

export type TagPlayfulProps = ComponentProps<"span"> & { color?: FillColor };

/** Solid color label. */
export function TagPlayful({ color = "yellow", ...props }: TagPlayfulProps) {
  const root = cn(
    "inline-block rounded-none px-2 py-1 font-bh-body text-[11px] font-semibold uppercase tracking-[0.1em]",
    FILL_CLASSES[color],
  );
  return <TagBase {...props} classes={{ root }} />;
}
