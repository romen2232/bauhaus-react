import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { SWISS_DISPLAY, SWISS_LABEL } from "../../../lib/styles.js";
import { TopBarBase } from "../../_base/TopBar/TopBarBase.js";

export type TopBarSwissProps = ComponentProps<"header"> & {
  /** Uppercase grotesk wordmark slot. */
  brand: ReactNode;
  /** Small uppercase info cells, shown from the md breakpoint up. */
  meta?: ReactNode[];
  /** Right-aligned cell (menu button, CTA). */
  action?: ReactNode;
};

const CLASSES = {
  root: "flex items-stretch divide-x divide-bh-rule border-b border-bh-rule bg-bh-paper-white text-bh-ink",
  brand: cn("flex items-center px-4 py-3 text-xl uppercase", SWISS_DISPLAY),
  meta: cn("hidden px-4 py-3 text-bh-muted-text md:block", SWISS_LABEL),
  action: "ml-auto flex items-center px-4 py-2",
};

/** Swiss site header made of paper-white cells divided by hairlines. */
export function TopBarSwiss(props: TopBarSwissProps) {
  return <TopBarBase {...props} classes={CLASSES} />;
}
