"use client";
import { cn } from "../../../lib/cn.js";
import { FOCUS_RING, SWISS_DISPLAY, SWISS_LABEL, SWISS_MOTION, SWISS_RAC_FOCUS } from "../../../lib/styles.js";
import { MenuOverlayBase, type MenuOverlayBaseProps } from "../../_base/MenuOverlay/MenuOverlayBase.js";

export type MenuOverlaySwissProps = Omit<MenuOverlayBaseProps, "classes">;

const CONTROL = cn(
  "inline-flex h-11 items-center border border-bh-ink bg-transparent px-6 text-sm uppercase tracking-[0.1em] text-bh-ink hover:bg-bh-ink hover:text-bh-paper-white font-bh-grotesk font-normal",
  SWISS_MOTION,
  SWISS_RAC_FOCUS,
);

const CLASSES = {
  trigger: CONTROL,
  overlay: "fixed inset-0 z-50 bg-bh-paper-white",
  panel: "h-full overflow-y-auto p-6 text-bh-ink",
  close: cn(CONTROL, "ml-auto"),
  list: "mt-8 border-t border-bh-rule",
  item: "border-b border-bh-rule",
  link: cn(
    "block px-2 py-4 text-5xl leading-none text-bh-muted-text hover:text-bh-ink aria-[current=page]:text-bh-ink aria-[current=page]:underline aria-[current=page]:decoration-1 aria-[current=page]:underline-offset-8",
    SWISS_DISPLAY,
    SWISS_MOTION,
    FOCUS_RING,
  ),
  secondary: cn("mt-8 text-bh-muted-text", SWISS_LABEL),
};

/** Swiss fullscreen paper-white menu with large muted links and hairline divisions. */
export function MenuOverlaySwiss(props: MenuOverlaySwissProps) {
  return <MenuOverlayBase {...props} classes={CLASSES} />;
}
