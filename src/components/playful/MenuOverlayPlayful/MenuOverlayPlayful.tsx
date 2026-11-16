"use client";
import { cn } from "../../../lib/cn.js";
import { FOCUS_RING, HOVER_LIFT, PRESS } from "../../../lib/styles.js";
import { MenuOverlayBase, type MenuOverlayBaseProps } from "../../_base/MenuOverlay/MenuOverlayBase.js";

export type MenuOverlayPlayfulProps = Omit<MenuOverlayBaseProps, "classes">;

// React Aria sets data-focus-visible instead of :focus-visible on its Buttons.
// outline-hidden zeroes --tw-outline-style in Tailwind 4, so the style is restored explicitly on focus.
const RAC_FOCUS =
  "outline-hidden data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink";

const CLASSES = {
  trigger: cn(
    "inline-flex h-11 items-center rounded-full bg-bh-ink px-6 font-bh-display text-sm font-bold uppercase tracking-wide text-bh-paper",
    HOVER_LIFT,
    PRESS,
    RAC_FOCUS,
  ),
  overlay: "fixed inset-0 z-50 bg-bh-paper",
  panel: "h-full overflow-y-auto p-6 text-bh-ink",
  close: cn(
    "ml-auto flex h-11 items-center rounded-full border-2 border-bh-ink px-6 font-bh-display text-sm font-bold uppercase",
    RAC_FOCUS,
  ),
  list: "mt-8 border-t-2 border-bh-ink",
  item: "border-b-2 border-bh-ink",
  link: cn(
    "block px-2 py-4 font-bh-display text-5xl font-extrabold uppercase leading-none hover:bg-bh-yellow aria-[current=page]:bg-bh-ink aria-[current=page]:text-bh-paper",
    FOCUS_RING,
  ),
  secondary: "mt-8 font-bh-body text-xs uppercase tracking-[0.1em]",
};

/** Fullscreen paper menu with huge ruled links (OffMenu, Playful look). */
export function MenuOverlayPlayful(props: MenuOverlayPlayfulProps) {
  return <MenuOverlayBase {...props} classes={CLASSES} />;
}
