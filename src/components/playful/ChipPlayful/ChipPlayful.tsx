import { ChipBase, type ChipBaseProps } from "../../_base/Chip/ChipBase.js";

export type ChipPlayfulProps = Omit<ChipBaseProps, "classes">;

const CLASSES = {
  root: "inline-flex items-center gap-2 rounded-full bg-bh-ink px-3 py-1 font-bh-body text-[11px] font-semibold uppercase tracking-[0.1em] text-bh-paper",
  icon: "inline-flex size-3.5 items-center justify-center",
};

/** Ink metadata pill (Mobile "Double Room", "1 Day"). */
export function ChipPlayful(props: ChipPlayfulProps) {
  return <ChipBase {...props} classes={CLASSES} />;
}
