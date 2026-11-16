import { cn } from "../../../lib/cn.js";
import { SOFT_HOVER_CLASSES } from "../../../lib/palette.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { CardBase, type CardBaseProps } from "../../_base/Card/CardBase.js";

export type CardSoftProps = Omit<CardBaseProps, "classes">;

const SLOTS = {
  header: "px-6 pt-6 font-bh-display text-xl font-normal",
  body: "px-6 py-4 font-bh-body text-sm",
  footer: "px-6 pb-6 font-bh-body text-xs",
};

/** Soft content panel: rounded charcoal surface with paper text. */
export function CardSoft(props: CardSoftProps) {
  const root = cn(
    // Nested controls default to an ink focus ring, invisible on charcoal: switch them to paper.
    "flex flex-col rounded-bh-soft bg-bh-charcoal text-bh-paper [&_:focus-visible]:outline-bh-paper",
    props.href !== undefined &&
      cn(SOFT_HOVER_CLASSES.neutral, "motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out", FOCUS_RING),
  );
  return <CardBase {...props} classes={{ root, ...SLOTS }} />;
}
