import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

/** Stub window.matchMedia; queries not listed resolve to `false`. */
export function mockMatchMedia(matches: Record<string, boolean>): void {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: matches[query] ?? false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

beforeEach(() => {
  // Node-environment tests (the build test) have no window.
  if (typeof window !== "undefined") mockMatchMedia({});
});
