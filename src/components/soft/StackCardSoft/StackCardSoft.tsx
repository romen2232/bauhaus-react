import { cn } from "../../../lib/cn.js";
import { SOFT_TONE_CLASSES, type SoftTone } from "../../../lib/palette.js";
import { StackCardBase, type StackCardBaseProps } from "../../_base/StackCard/StackCardBase.js";

export type StackCardSoftProps = Omit<StackCardBaseProps, "classes"> & { tone?: SoftTone };

const SLOTS = {
  root: "flex items-stretch overflow-hidden rounded-bh-soft bg-bh-sand text-bh-ink",
  body: "flex-1 self-center p-4 font-bh-body",
  action: "shrink-0 self-center pr-4",
};

/** Soft list card with a tone spine along its left edge (Mobile stacked cards). */
export function StackCardSoft({ tone = "red", ...props }: StackCardSoftProps) {
  const spine = cn("w-2 shrink-0", SOFT_TONE_CLASSES[tone]);
  return <StackCardBase {...props} classes={{ ...SLOTS, spine }} />;
}
