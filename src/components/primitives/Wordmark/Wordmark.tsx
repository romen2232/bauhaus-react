import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";

export type WordmarkProps = ComponentProps<"h1"> & { as?: "h1" | "p" };

// Longhands only: the `animation` shorthand would reset `animation-timeline`.
// Without scroll-timeline support, or under reduced motion, none of these apply and the
// wordmark stays giant and scrolls away with the page.
const SCROLL_SHRINK = [
  "motion-safe:supports-[animation-timeline:scroll()]:[animation-name:bh-wordmark]",
  "motion-safe:supports-[animation-timeline:scroll()]:[animation-timing-function:linear]",
  "motion-safe:supports-[animation-timeline:scroll()]:[animation-fill-mode:both]",
  "motion-safe:supports-[animation-timeline:scroll()]:[animation-timeline:scroll()]",
  "motion-safe:supports-[animation-timeline:scroll()]:[animation-range:0_40vh]",
].join(" ");

/** Giant word that shrinks to header size on scroll (OffMenu). Pure CSS, no client code. */
export function Wordmark({ as: Tag = "h1", className, ...props }: WordmarkProps) {
  return (
    <Tag
      className={cn(
        "sticky top-0 origin-top-left font-bh-grotesk text-[18vw] leading-[0.85] font-normal tracking-[-0.03em] uppercase",
        SCROLL_SHRINK,
        className,
      )}
      {...props}
    />
  );
}
