import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";
import { SOFT_TONE_CLASSES, type SoftTone } from "../../../lib/palette.js";
import { TagBase } from "../../_base/Tag/TagBase.js";

export type TagSoftProps = ComponentProps<"span"> & { tone?: SoftTone };

const PILL = "inline-block rounded-full px-3 py-1 font-bh-body text-[11px] font-normal uppercase tracking-[0.1em]";

/** Soft pill label; `tone` encodes status or category. */
export function TagSoft({ tone = "neutral", ...props }: TagSoftProps) {
  return <TagBase {...props} classes={{ root: cn(PILL, SOFT_TONE_CLASSES[tone]) }} />;
}
