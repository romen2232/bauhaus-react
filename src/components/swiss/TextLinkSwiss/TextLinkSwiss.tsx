import { cn } from "../../../lib/cn.js";
import { FOCUS_RING, SWISS_MOTION } from "../../../lib/styles.js";
import { TextLinkBase, type TextLinkBaseProps } from "../../_base/TextLink/TextLinkBase.js";

export type TextLinkSwissProps = Omit<TextLinkBaseProps, "classes">;

const CLASSES = {
  root: cn(
    "inline-flex items-baseline gap-2 font-bh-grotesk font-normal text-bh-ink hover:underline decoration-1 underline-offset-4",
    SWISS_MOTION,
    FOCUS_RING,
  ),
  arrow: "",
};

/** Swiss text link with an optional decorative arrow and hover-only underline. */
export function TextLinkSwiss(props: TextLinkSwissProps) {
  return <TextLinkBase {...props} classes={CLASSES} />;
}
