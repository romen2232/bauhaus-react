"use client";
import { cn } from "../../../lib/cn.js";
import { SWISS_MOTION, SWISS_RAC_FOCUS } from "../../../lib/styles.js";
import { TabsBase, type TabsBaseProps } from "../../_base/Tabs/TabsBase.js";

export type TabsSwissProps = Omit<TabsBaseProps, "classes">;

const CLASSES = {
  root: "flex flex-col gap-4",
  list: "flex gap-6 border-b border-bh-rule",
  tab: cn(
    "-mb-px cursor-pointer border-b border-transparent pb-2 text-sm uppercase tracking-[0.1em] text-bh-muted-text data-[hovered]:text-bh-ink data-[selected]:border-bh-ink data-[selected]:text-bh-ink data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 font-bh-grotesk font-normal",
    SWISS_MOTION,
    SWISS_RAC_FOCUS,
  ),
  panel: cn("font-bh-grotesk text-sm", SWISS_RAC_FOCUS),
};

/** Swiss tabs with an ink underline as the selected state's non-colour cue. */
export function TabsSwiss(props: TabsSwissProps) {
  return <TabsBase {...props} classes={CLASSES} />;
}
