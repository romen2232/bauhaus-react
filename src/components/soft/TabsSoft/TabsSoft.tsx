"use client";
import { TabsBase, type TabsBaseProps } from "../../_base/Tabs/TabsBase.js";

export type TabsSoftProps = Omit<TabsBaseProps, "classes">;

const CLASSES = {
  root: "flex flex-col gap-4",
  list: "inline-flex self-start rounded-full bg-bh-sand p-1",
  tab: [
    "cursor-pointer rounded-full px-5 py-2 font-bh-display text-sm font-normal text-bh-ink outline-hidden",
    "motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out",
    "data-[selected]:bg-bh-charcoal data-[selected]:text-bh-paper",
    // Tonal step on hover (same mix as SOFT_HOVER_CLASSES.sand), only for unselected tabs.
    "not-data-[selected]:data-[hovered]:bg-[color-mix(in_srgb,var(--color-bh-sand)_90%,var(--color-bh-ink))]",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    // outline-hidden zeroes --tw-outline-style in Tailwind 4, so restore it explicitly on focus.
    "data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink",
  ].join(" "),
  panel:
    "font-bh-body outline-hidden data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-bh-ink",
};

/** Soft tabs as a tonal segmented control; the selected tab is a charcoal pill. */
export function TabsSoft(props: TabsSoftProps) {
  return <TabsBase {...props} classes={CLASSES} />;
}
