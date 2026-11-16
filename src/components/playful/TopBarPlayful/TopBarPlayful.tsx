import type { ComponentProps, ReactNode } from "react";
import { TopBarBase } from "../../_base/TopBar/TopBarBase.js";

export type TopBarPlayfulProps = ComponentProps<"header"> & {
  brand: ReactNode;
  /** Small uppercase info cells, shown from the md breakpoint up. */
  meta?: ReactNode[];
  /** Right-aligned cell (menu button, CTA). */
  action?: ReactNode;
};

const CLASSES = {
  root: "flex items-stretch divide-x divide-bh-ink border-b border-bh-ink bg-bh-paper text-bh-ink",
  brand: "flex items-center px-4 py-3 font-bh-display font-bold",
  meta: "hidden px-4 py-3 font-bh-body text-[11px] uppercase tracking-[0.1em] md:block",
  action: "ml-auto flex items-center px-4 py-2",
};

/** Site header made of ruled cells. */
export function TopBarPlayful(props: TopBarPlayfulProps) {
  return <TopBarBase {...props} classes={CLASSES} />;
}
