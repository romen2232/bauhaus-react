import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { SWISS_LABEL } from "../../../lib/styles.js";
import { FooterBase } from "../../_base/Footer/FooterBase.js";

export type FooterSwissProps = ComponentProps<"footer"> & {
  columns: ReactNode[];
  bottom?: ReactNode;
};

// One column on mobile; up to six from md. Literal classes for the consumer's Tailwind scan.
const MD_COLS = [
  "md:grid-cols-1",
  "md:grid-cols-2",
  "md:grid-cols-3",
  "md:grid-cols-4",
  "md:grid-cols-5",
  "md:grid-cols-6",
];

const SLOTS = {
  root: "bg-bh-paper-white text-bh-ink",
  column: "p-6 font-bh-grotesk text-sm",
  bottom: cn("border-x border-b border-bh-rule px-6 py-3 text-bh-muted-text", SWISS_LABEL),
};

/** Swiss footer built from paper-white cells separated by a hairline grid. */
export function FooterSwiss(props: FooterSwissProps) {
  const count = Math.min(Math.max(props.columns.length, 1), 6);
  const grid = cn(
    "grid grid-cols-1 gap-px border border-bh-rule bg-bh-rule [&>*]:bg-bh-paper-white",
    MD_COLS[count - 1],
  );
  return <FooterBase {...props} classes={{ ...SLOTS, grid }} />;
}
