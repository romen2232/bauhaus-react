import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { FooterBase } from "../../_base/Footer/FooterBase.js";
import { GRID_RULED } from "../../primitives/Grid/Grid.js";

export type FooterPlayfulProps = ComponentProps<"footer"> & {
  columns: ReactNode[];
  bottom?: ReactNode;
};

// One column on mobile; up to six from md. Literal classes for the consumer's Tailwind scan.
const MD_COLS = ["md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-4", "md:grid-cols-5", "md:grid-cols-6"];

const SLOTS = {
  root: "bg-bh-paper text-bh-ink",
  column: "p-6 font-bh-body text-sm",
  bottom: "border-x border-b border-bh-rule px-6 py-3 font-bh-body text-[11px] uppercase tracking-[0.1em]",
};

/** Ruled grid footer. */
export function FooterPlayful(props: FooterPlayfulProps) {
  const count = Math.min(Math.max(props.columns.length, 1), 6);
  const grid = cn("grid grid-cols-1", GRID_RULED, MD_COLS[count - 1]);
  return <FooterBase {...props} classes={{ ...SLOTS, grid }} />;
}
