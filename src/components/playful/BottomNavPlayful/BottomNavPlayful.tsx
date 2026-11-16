import { cn } from "../../../lib/cn.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { BottomNavBase, type BottomNavBaseProps } from "../../_base/BottomNav/BottomNavBase.js";

export type BottomNavPlayfulProps = Omit<BottomNavBaseProps, "classes">;

const CLASSES = {
  root: "bg-bh-ink text-bh-paper",
  list: "flex items-center justify-around px-2 py-2",
  item: "",
  link: cn(
    "flex min-w-11 flex-col items-center gap-1 rounded-full px-3 py-2",
    "aria-[current=page]:bg-bh-yellow aria-[current=page]:text-bh-ink",
    FOCUS_RING,
    "focus-visible:outline-bh-paper",
  ),
  icon: "text-xl leading-none",
  label: "font-bh-body text-[11px] uppercase tracking-[0.1em]",
};

/** Ink bottom bar; the current destination gets a yellow pill (Mobile). */
export function BottomNavPlayful(props: BottomNavPlayfulProps) {
  return <BottomNavBase {...props} classes={CLASSES} />;
}
