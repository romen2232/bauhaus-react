import { cn } from "../../../lib/cn.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { TextLinkBase, type TextLinkBaseProps } from "../../_base/TextLink/TextLinkBase.js";

export type TextLinkSoftProps = Omit<TextLinkBaseProps, "classes">;

const CLASSES = {
  root: cn(
    "inline-flex items-baseline gap-2 font-bh-display font-normal text-bh-ink no-underline hover:text-bh-charcoal motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out",
    FOCUS_RING,
  ),
  arrow: "",
};

/** Soft text link: no underline, always carries an arrow (defaults to `→`). */
export function TextLinkSoft({ arrow = "right", ...props }: TextLinkSoftProps) {
  return <TextLinkBase {...props} arrow={arrow} classes={CLASSES} />;
}
