"use client";
import { DateStripBase, type DateStripBaseProps } from "../../_base/DateStrip/DateStripBase.js";

export type DateStripSoftProps = Omit<DateStripBaseProps, "classes">;

const CLASSES = {
  // overflow-x clips at the padding box; p-1.5 leaves room for the 2px ring + 2px offset.
  root: "flex gap-2 overflow-x-auto p-1.5",
  day: [
    "flex min-w-16 cursor-pointer flex-col items-center gap-1 rounded-bh-soft bg-bh-sand px-3 py-4 text-bh-ink",
    "motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out",
    "data-[selected]:bg-bh-charcoal data-[selected]:text-bh-paper",
    // Tonal step on hover (same mix as SOFT_HOVER_CLASSES.sand), only for unselected days.
    "not-data-[selected]:data-[hovered]:bg-[color-mix(in_srgb,var(--color-bh-sand)_90%,var(--color-bh-ink))]",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    "data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink",
  ].join(" "),
  weekday: "font-bh-body text-xs",
  number: "font-bh-display text-3xl font-light leading-none tabular-nums",
};

/** Soft day picker: rounded sand tiles with light hero numerals; the selected day turns charcoal. */
export function DateStripSoft(props: DateStripSoftProps) {
  return <DateStripBase {...props} classes={CLASSES} />;
}
