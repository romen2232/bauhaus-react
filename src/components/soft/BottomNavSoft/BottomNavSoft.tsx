import { cn } from "../../../lib/cn.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { BottomNavBase, type BottomNavBaseProps } from "../../_base/BottomNav/BottomNavBase.js";

export type BottomNavSoftProps = Omit<BottomNavBaseProps, "classes">;

const LINK = cn(
  "relative flex min-w-11 flex-col items-center gap-1 rounded-full px-3 pt-2 pb-3 text-bh-muted aria-[current=page]:text-bh-paper",
  // The dot is always yellow: the only tone that keeps 3:1 against the charcoal bar (red 2.4, blue 1.7).
  "after:absolute after:inset-x-0 after:bottom-1 after:mx-auto after:hidden after:size-1.5 after:rounded-full after:content-[''] aria-[current=page]:after:block aria-[current=page]:after:bg-bh-yellow",
  "motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out hover:text-bh-paper",
  FOCUS_RING,
  "focus-visible:outline-bh-paper",
);

const SLOTS = {
  root: "rounded-full bg-bh-charcoal",
  list: "flex items-center justify-around px-2 py-1",
  item: "",
  icon: "text-xl leading-none",
  label: "font-bh-body text-[11px]",
};

const CLASSES = { ...SLOTS, link: LINK };

/** Soft bottom bar: rounded charcoal, the current destination in paper with a yellow dot (Mobile). */
export function BottomNavSoft(props: BottomNavSoftProps) {
  return <BottomNavBase {...props} classes={CLASSES} />;
}
