import { ChipBase, type ChipBaseProps } from "../../_base/Chip/ChipBase.js";

export type ChipSwissProps = Omit<ChipBaseProps, "classes">;

const CLASSES = {
  root: "inline-flex items-center gap-2 border border-bh-ink px-3 py-1 font-bh-grotesk text-xs font-normal text-bh-ink",
  icon: "inline-flex size-3.5 items-center justify-center",
};

/** Swiss sharp, non-interactive metadata chip. */
export function ChipSwiss(props: ChipSwissProps) {
  return <ChipBase {...props} classes={CLASSES} />;
}
