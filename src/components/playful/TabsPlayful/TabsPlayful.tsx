"use client";
import { TabsBase, type TabsBaseProps } from "../../_base/Tabs/TabsBase.js";

export type TabsPlayfulProps = Omit<TabsBaseProps, "classes">;

const CLASSES = {
  root: "flex flex-col gap-4",
  list: "flex flex-wrap gap-2",
  tab: [
    "cursor-pointer rounded-full border-2 border-bh-ink px-5 py-2 font-bh-display text-sm font-bold uppercase tracking-wide text-bh-ink outline-none",
    "data-[selected]:bg-bh-ink data-[selected]:text-bh-paper",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    "data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink",
  ].join(" "),
  panel: "font-bh-body outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-bh-ink",
};

/** Tabs whose selected tab becomes a filled ink pill. */
export function TabsPlayful(props: TabsPlayfulProps) {
  return <TabsBase {...props} classes={CLASSES} />;
}
