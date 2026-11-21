import { useEffect, useRef } from "react";

export type WipeKind = "circle" | "square" | "triangle";

export const WIPE_MS = 700;

// Colour follows the Kandinsky pairing: circle blue, square red, triangle yellow.
const KINDS: Record<WipeKind, string> = {
  circle: "rounded-full bg-bh-blue",
  square: "bg-bh-red",
  triangle: "bg-bh-yellow [clip-path:polygon(50%_0,100%_100%,0_100%)]",
};

/** A primitive shape that sweeps over its parent while the look underneath changes. Decorative. */
export function ShapeWipe({ kind, onDone }: { kind: WipeKind; onDone: () => void }) {
  const shape = useRef<HTMLDivElement>(null);
  const done = useRef(onDone);
  done.current = onDone;

  // A native listener: React's onAnimationEnd is not wired up in jsdom (no AnimationEvent).
  useEffect(() => {
    const el = shape.current;
    if (!el) return;
    const handle = () => done.current();
    el.addEventListener("animationend", handle);
    return () => el.removeEventListener("animationend", handle);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 grid place-items-center overflow-hidden">
      <div
        ref={shape}
        data-testid="shape-wipe"
        className={`size-40 ${KINDS[kind]}`}
        style={{ animation: `shape-wipe ${WIPE_MS}ms cubic-bezier(.6,0,.2,1) both` }}
      />
    </div>
  );
}
