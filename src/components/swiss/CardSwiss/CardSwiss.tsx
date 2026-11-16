import { cn } from "../../../lib/cn.js";
import { FOCUS_RING, SWISS_DISPLAY, SWISS_MOTION } from "../../../lib/styles.js";
import { CardBase, type CardBaseProps } from "../../_base/Card/CardBase.js";

export type CardSwissProps = Omit<CardBaseProps, "classes">;

const SLOTS = {
  header: cn("border-b border-bh-rule p-4 text-lg", SWISS_DISPLAY),
  body: "p-4 font-bh-grotesk text-sm",
  footer:
    "border-t border-bh-rule p-4 text-xs uppercase tracking-[0.1em] text-bh-muted-text font-bh-grotesk",
};

/** Swiss hairline content panel; with `href`, only its border colour changes on hover. */
export function CardSwiss(props: CardSwissProps) {
  const root = cn(
    "flex flex-col border border-bh-rule bg-transparent text-bh-ink",
    props.href !== undefined && cn("hover:border-bh-ink", SWISS_MOTION, FOCUS_RING),
  );
  return <CardBase {...props} classes={{ root, ...SLOTS }} />;
}
