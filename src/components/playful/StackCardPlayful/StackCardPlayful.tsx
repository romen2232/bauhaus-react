import { cn } from "../../../lib/cn.js";
import { BG_CLASSES, type FillColor } from "../../../lib/palette.js";
import { StackCardBase, type StackCardBaseProps } from "../../_base/StackCard/StackCardBase.js";

export type StackCardPlayfulProps = Omit<StackCardBaseProps, "classes" | "color"> & { color?: FillColor };

const SLOTS = {
  root: "relative flex items-center gap-4 rounded-none border-2 border-bh-ink bg-bh-paper py-4 pr-4 pl-6 text-bh-ink",
  body: "flex-1 font-bh-body",
  action: "shrink-0",
};

/** List card with a coloured spine along its left edge (Mobile stacked cards). */
export function StackCardPlayful({ color = "red", ...props }: StackCardPlayfulProps) {
  const spine = cn("absolute inset-y-0 left-0 w-2", BG_CLASSES[color]);
  return <StackCardBase {...props} classes={{ ...SLOTS, spine }} />;
}
