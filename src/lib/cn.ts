import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "bh-paper", "bh-paper-white", "bh-ink", "bh-charcoal", "bh-rule", "bh-muted", "bh-muted-text",
        "bh-red", "bh-yellow", "bh-blue", "bh-navy", "bh-sky", "bh-pink", "bh-orange", "bh-teal", "bh-khaki",
      ],
      font: ["bh-display", "bh-body", "bh-mono"],
      shadow: ["bh-hard", "bh-hard-lg"],
      animate: ["bh-spin"],
    },
  },
});

/** Join class names and resolve Tailwind conflicts (later classes win), including bh-* tokens. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
