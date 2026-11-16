"use client";
import { DateStripBase, type DateStripBaseProps } from "../../_base/DateStrip/DateStripBase.js";

export type DateStripPlayfulProps = Omit<DateStripBaseProps, "classes">;

const CLASSES = {
  root: "flex gap-2 overflow-x-auto",
  day: [
    "flex min-w-14 cursor-pointer flex-col items-center gap-1 rounded-none border-2 border-transparent bg-bh-paper px-3 py-3 text-bh-ink",
    "data-[selected]:border-bh-ink data-[selected]:bg-bh-yellow",
    "data-[hovered]:border-bh-ink",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    "data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink",
  ].join(" "),
  weekday: "font-bh-body text-[11px] uppercase tracking-[0.1em]",
  number: "font-bh-display text-2xl font-extrabold leading-none tabular-nums",
};

/** Day picker strip of sharp tiles; the selected day turns yellow with an ink border. */
export function DateStripPlayful(props: DateStripPlayfulProps) {
  return <DateStripBase {...props} classes={CLASSES} />;
}
