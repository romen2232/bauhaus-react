import { cn } from "../../../lib/cn.js";
import { FOCUS_RING, SWISS_LABEL, SWISS_MOTION } from "../../../lib/styles.js";
import { BottomNavBase, type BottomNavBaseProps } from "../../_base/BottomNav/BottomNavBase.js";

export type BottomNavSwissProps = Omit<BottomNavBaseProps, "classes">;

const LINK = cn(
  "-mt-px flex min-w-11 flex-col items-center gap-1 border-t border-transparent px-3 pt-2 pb-3 text-bh-muted-text hover:text-bh-ink aria-[current=page]:border-bh-ink aria-[current=page]:text-bh-ink",
  SWISS_MOTION,
  FOCUS_RING,
);

const CLASSES = {
  root: "border-t border-bh-rule bg-bh-paper-white",
  list: "flex items-center justify-around px-2",
  item: "",
  link: LINK,
  icon: "text-xl leading-none",
  label: SWISS_LABEL,
};

/** Swiss bottom navigation with an ink top rule for the current destination. */
export function BottomNavSwiss(props: BottomNavSwissProps) {
  return <BottomNavBase {...props} classes={CLASSES} />;
}
