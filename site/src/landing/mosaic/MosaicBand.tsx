import { useState, useSyncExternalStore, type ReactNode } from "react";
import { useLook, type SingleLook } from "../../look/LookContext";
import { useReducedMotion } from "../../look/useReducedMotion";
import { tileAt, tileColors, type MosaicShape } from "./mosaic";

const NARROW = "(max-width: 767px)";
const NARROWEST = "(max-width: 479px)";

function subscribe(notify: () => void): () => void {
  const lists = [window.matchMedia(NARROW), window.matchMedia(NARROWEST)];
  lists.forEach((l) => l.addEventListener("change", notify));
  return () => lists.forEach((l) => l.removeEventListener("change", notify));
}

function columns(): 12 | 6 | 4 {
  if (window.matchMedia(NARROWEST).matches) return 4;
  if (window.matchMedia(NARROW).matches) return 6;
  return 12;
}

const GEOMETRY: Record<Exclude<MosaicShape, "none">, (fill: string) => ReactNode> = {
  quarter: (fill) => <path d="M0 100 V0 A100 100 0 0 1 100 100z" fill={fill} />,
  circle: (fill) => <circle cx="50" cy="50" r="50" fill={fill} />,
  half: (fill) => <path d="M0 100 A50 50 0 0 1 100 100z" fill={fill} />,
  tri: (fill) => <polygon points="0,100 100,100 0,0" fill={fill} />,
  bar: (fill) => <rect x="0" y="0" width="100" height="34" fill={fill} />,
};

type TileViewProps = { x: number; y: number; look: SingleLook; reduced: boolean };

function TileView({ x, y, look, reduced }: TileViewProps) {
  const tile = tileAt(x, y);
  const [rotation, setRotation] = useState<number>(tile.rotate);
  const { ground, shape } = tileColors(tile, look);
  return (
    <svg
      data-testid="mosaic-tile"
      data-ground={ground}
      data-rotate={rotation}
      viewBox="0 0 100 100"
      className={reduced ? "block w-full" : "block w-full [animation:mosaic-in_500ms_cubic-bezier(.2,.7,.2,1)_both]"}
      style={{ backgroundColor: ground, ...(reduced ? {} : { animationDelay: `${(x + y) * 40}ms` }) }}
      onMouseEnter={() => setRotation((r) => r + 90)}
    >
      <g
        className={reduced ? undefined : "transition-transform duration-500 ease-[cubic-bezier(.6,0,.2,1)]"}
        style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "50px 50px", transformBox: "view-box" }}
      >
        {tile.shape !== "none" && shape !== null ? GEOMETRY[tile.shape](shape) : null}
      </g>
    </svg>
  );
}

/** Full-bleed band of shape tiles. Decorative; the palette follows the selected look. */
export function MosaicBand({ rows = 4 }: { rows?: number }) {
  const { look } = useLook();
  const reduced = useReducedMotion();
  const cols = useSyncExternalStore(subscribe, columns, () => 12);
  const paletteLook: SingleLook = look === "mix" ? "playful" : look;
  const cells = Array.from({ length: cols * rows }, (_, i) => ({ x: i % cols, y: Math.floor(i / cols) }));
  return (
    <div
      aria-hidden="true"
      className="grid w-full overflow-hidden border-y-2 border-bh-ink"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cells.map(({ x, y }) => (
        <TileView key={`${x}-${y}`} x={x} y={y} look={paletteLook} reduced={reduced} />
      ))}
    </div>
  );
}
