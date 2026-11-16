import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { FooterBase } from "../../_base/Footer/FooterBase.js";

export type FooterSoftProps = ComponentProps<"footer"> & {
  columns: ReactNode[];
  bottom?: ReactNode;
};

// One column on mobile; up to six from md. Literal classes for the consumer's Tailwind scan.
const MD_COLS = ["md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-4", "md:grid-cols-5", "md:grid-cols-6"];

const SLOTS = {
  // Nested links default to an ink focus ring, invisible on charcoal: switch them to paper.
  root: "rounded-t-bh-soft bg-bh-charcoal text-bh-paper [&_:focus-visible]:outline-bh-paper",
  column: "font-bh-body text-sm",
  bottom: "px-6 pb-6 font-bh-body text-xs text-bh-muted",
};

/** Soft footer: a rounded charcoal panel; columns separated by space, not rules. */
export function FooterSoft(props: FooterSoftProps) {
  const count = Math.min(Math.max(props.columns.length, 1), 6);
  const grid = cn("grid grid-cols-1 gap-6 p-6", MD_COLS[count - 1]);
  return <FooterBase {...props} classes={{ ...SLOTS, grid }} />;
}
