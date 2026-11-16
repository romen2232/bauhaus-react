"use client";
import { cn } from "../../../lib/cn.js";
import { SOFT_HOVER_CLASSES } from "../../../lib/palette.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { MenuOverlayBase, type MenuOverlayBaseProps } from "../../_base/MenuOverlay/MenuOverlayBase.js";

export type MenuOverlaySoftProps = Omit<MenuOverlayBaseProps, "classes">;

// React Aria sets data-focus-visible instead of :focus-visible on its Buttons.
// outline-hidden zeroes --tw-outline-style in Tailwind 4, so the style is restored explicitly on focus.
const RAC_FOCUS =
  "outline-hidden data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink";

const PILL = "inline-flex h-11 items-center rounded-full px-6 font-bh-display text-sm font-normal motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out";

const CLASSES = {
  trigger: cn(PILL, "bg-bh-charcoal text-bh-paper", SOFT_HOVER_CLASSES.neutral, RAC_FOCUS),
  overlay: "fixed inset-0 z-50 bg-bh-paper p-4",
  panel: "h-full overflow-y-auto rounded-bh-soft bg-bh-sand p-6 text-bh-ink",
  close: cn(PILL, "ml-auto bg-bh-paper text-bh-ink", SOFT_HOVER_CLASSES.paper, RAC_FOCUS),
  list: "mt-8 flex flex-col gap-2",
  item: "",
  link: cn(
    "block rounded-bh-soft px-4 py-3 font-bh-display text-5xl font-light leading-none motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out",
    SOFT_HOVER_CLASSES.sand,
    "aria-[current=page]:bg-bh-charcoal aria-[current=page]:text-bh-paper",
    FOCUS_RING,
  ),
  secondary: "mt-8 px-4 font-bh-body text-sm",
};

/** Fullscreen paper menu with a rounded sand sheet; links separated by space, not rules (OffMenu, Soft look). */
export function MenuOverlaySoft(props: MenuOverlaySoftProps) {
  return <MenuOverlayBase {...props} classes={CLASSES} />;
}
