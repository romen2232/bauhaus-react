import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "bh-paper", "bh-paper-white", "bh-ink", "bh-charcoal", "bh-rule", "bh-muted", "bh-muted-text",
        "bh-red", "bh-yellow", "bh-blue", "bh-navy", "bh-sky", "bh-pink", "bh-orange", "bh-teal", "bh-khaki",
        "bh-sand", "bh-accent",
      ],
      font: ["bh-display", "bh-body", "bh-mono", "bh-grotesk"],
      radius: ["bh-soft"],
      shadow: ["bh-hard", "bh-hard-lg"],
      animate: ["bh-spin", "bh-slide", "bh-grow", "bh-wordmark"],
    },
  },
});

/** Join class names and resolve Tailwind conflicts (later classes win), including bh-* tokens. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
