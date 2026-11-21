"use client";
import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * Internal: the element's content width in px. Measures on layout and follows resizes with a
 * ResizeObserver when one exists. A measured 0 (no layout, hidden) keeps the previous value.
 */
export function useMeasuredWidth(ref: RefObject<HTMLElement | null>, fallback = 320): number {
  const [width, setWidth] = useState(fallback);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (w: number) => {
      if (Number.isFinite(w) && w > 0) setWidth(Math.round(w));
    };
    apply(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) apply(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}
