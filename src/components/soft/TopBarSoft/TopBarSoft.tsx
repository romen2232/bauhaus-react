import type { ComponentProps, ReactNode } from "react";
import { TopBarBase } from "../../_base/TopBar/TopBarBase.js";

export type TopBarSoftProps = ComponentProps<"header"> & {
  brand: ReactNode;
  /** Small info cells, shown from the md breakpoint up. */
  meta?: ReactNode[];
  /** Right-aligned cell (menu button, CTA). */
  action?: ReactNode;
};

const CLASSES = {
  root: "flex items-center gap-6 rounded-b-bh-soft bg-bh-sand px-6 py-3 text-bh-ink",
  brand: "font-bh-display text-lg font-normal",
  meta: "hidden font-bh-body text-xs md:block",
  action: "ml-auto flex items-center",
};

/** Soft site header: a tonal sand bar with a rounded bottom and no rules. */
export function TopBarSoft(props: TopBarSoftProps) {
  return <TopBarBase {...props} classes={CLASSES} />;
}
