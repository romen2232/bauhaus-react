"use client";
import { cn } from "../../../lib/cn.js";
import { SWISS_DISPLAY, SWISS_LABEL, SWISS_MOTION } from "../../../lib/styles.js";
import { DateStripBase, type DateStripBaseProps } from "../../_base/DateStrip/DateStripBase.js";

export type DateStripSwissProps = Omit<DateStripBaseProps, "classes">;

const CLASSES = {
  // The padding leaves room for the 2px focus ring and its 2px offset.
  root: "flex gap-2 overflow-x-auto p-1.5",
  day: cn(
    "flex min-w-14 cursor-pointer flex-col items-center gap-1 border-b border-transparent px-3 pt-3 pb-2 text-bh-muted-text data-[hovered]:text-bh-ink data-[selected]:border-bh-ink data-[selected]:text-bh-ink data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    SWISS_MOTION,
    "data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink",
  ),
  weekday: SWISS_LABEL,
  number: cn("text-3xl leading-none tabular-nums", SWISS_DISPLAY),
};

/** Swiss day picker with quiet labels and an ink underline for the selected day. */
export function DateStripSwiss(props: DateStripSwissProps) {
  return <DateStripBase {...props} classes={CLASSES} />;
}
