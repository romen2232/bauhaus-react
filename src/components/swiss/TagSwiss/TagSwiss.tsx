import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";
import { SWISS_LABEL } from "../../../lib/styles.js";
import { TagBase } from "../../_base/Tag/TagBase.js";

export type TagSwissProps = ComponentProps<"span">;

/** Swiss outlined uppercase micro label. */
export function TagSwiss(props: TagSwissProps) {
  return (
    <TagBase
      {...props}
      classes={{ root: cn("inline-block border border-bh-ink px-2 py-1 text-bh-ink", SWISS_LABEL) }}
    />
  );
}
