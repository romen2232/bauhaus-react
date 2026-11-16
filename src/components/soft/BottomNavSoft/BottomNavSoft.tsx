import { cn } from "../../../lib/cn.js";
import type { SoftTone } from "../../../lib/palette.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { BottomNavBase, type BottomNavBaseProps } from "../../_base/BottomNav/BottomNavBase.js";

/** Neutral is excluded: a charcoal dot would vanish on the charcoal bar. */
export type BottomNavSoftTone = Exclude<SoftTone, "neutral">;

export type BottomNavSoftProps = Omit<BottomNavBaseProps, "classes"> & {
  /** Colour of the dot under the current destination. */
  tone?: BottomNavSoftTone;
};

const DOT_CLASSES: Record<BottomNavSoftTone, string> = {
  red: "aria-[current=page]:after:bg-bh-red",
  yellow: "aria-[current=page]:after:bg-bh-yellow",
  blue: "aria-[current=page]:after:bg-bh-blue",
};

const LINK = cn(
  "relative flex min-w-11 flex-col items-center gap-1 rounded-full px-3 pt-2 pb-3 text-bh-muted aria-[current=page]:text-bh-paper",
  "after:absolute after:inset-x-0 after:bottom-1 after:mx-auto after:hidden after:size-1.5 after:rounded-full after:content-[''] aria-[current=page]:after:block",
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

/** Soft bottom bar: rounded charcoal, the current destination in paper with a tone dot (Mobile). */
export function BottomNavSoft({ tone = "yellow", ...props }: BottomNavSoftProps) {
  return <BottomNavBase {...props} classes={{ ...SLOTS, link: cn(LINK, DOT_CLASSES[tone]) }} />;
}
