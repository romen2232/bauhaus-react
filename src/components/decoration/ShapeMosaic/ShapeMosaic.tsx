import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";
import { BG_CLASSES, type FillColor } from "../../../lib/palette.js";
import { Shape, type ShapeKind, type ShapeRotation } from "../Shape/Shape.js";

export type MosaicTile = {
  kind: ShapeKind;
  color: FillColor;
  rotate?: ShapeRotation;
  /** Cell background behind the shape. Defaults to paper. */
  background?: FillColor;
};

export type ShapeMosaicCols = 2 | 3 | 4 | 5 | 6;

export type ShapeMosaicProps = ComponentProps<"div"> & {
  cols: ShapeMosaicCols;
  tiles: MosaicTile[];
};

const COLS: Record<ShapeMosaicCols, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

/** Edge-to-edge grid of shape tiles. Decorative. */
export function ShapeMosaic({ cols, tiles, className, ...props }: ShapeMosaicProps) {
  return (
    <div aria-hidden="true" className={cn("grid gap-0", COLS[cols], className)} {...props}>
      {tiles.map((tile, i) => (
        <div key={i} className={cn("aspect-square overflow-hidden", BG_CLASSES[tile.background ?? "paper"])}>
          <Shape kind={tile.kind} color={tile.color} rotate={tile.rotate} />
        </div>
      ))}
    </div>
  );
}
