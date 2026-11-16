import { ChipBase, type ChipBaseProps } from "../../_base/Chip/ChipBase.js";

export type ChipSoftProps = Omit<ChipBaseProps, "classes">;

const CLASSES = {
  root: "inline-flex items-center gap-2 rounded-full bg-bh-ink px-3 py-1 font-bh-body text-xs font-normal text-bh-paper",
  icon: "inline-flex size-3.5 items-center justify-center",
};

/** Soft ink metadata pill (Mobile "Double Room", "1 Day"). */
export function ChipSoft(props: ChipSoftProps) {
  return <ChipBase {...props} classes={CLASSES} />;
}
