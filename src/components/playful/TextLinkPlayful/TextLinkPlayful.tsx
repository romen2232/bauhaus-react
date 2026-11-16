import { FOCUS_RING } from "../../../lib/styles.js";
import { cn } from "../../../lib/cn.js";
import { TextLinkBase, type TextLinkBaseProps } from "../../_base/TextLink/TextLinkBase.js";

export type TextLinkPlayfulProps = Omit<TextLinkBaseProps, "classes">;

const CLASSES = {
  root: cn(
    "inline-flex items-baseline gap-2 font-bh-display font-bold text-bh-ink underline decoration-2 underline-offset-4",
    FOCUS_RING,
  ),
  arrow: "no-underline",
};

/** Text link with a thick offset underline (Modulo "See the courses"). */
export function TextLinkPlayful(props: TextLinkPlayfulProps) {
  return <TextLinkBase {...props} classes={CLASSES} />;
}
