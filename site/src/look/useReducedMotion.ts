import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(notify: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", notify);
  return () => mql.removeEventListener("change", notify);
}

/** True when the visitor asked the OS for reduced motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
