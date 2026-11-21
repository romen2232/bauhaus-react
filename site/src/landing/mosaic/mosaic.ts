import type { SingleLook } from "../../look/LookContext";

export type MosaicShape = "quarter" | "circle" | "half" | "tri" | "bar" | "none";
export type Hue = "paper" | "white" | "ink" | "red" | "yellow" | "blue";
export type Rotation = 0 | 90 | 180 | 270;
export type Tile = { ground: Hue; shape: MosaicShape; color: Hue | null; rotate: Rotation };

const t = (ground: Hue, shape: MosaicShape, color: Hue | null, rotate: Rotation): Tile => ({
  ground,
  shape,
  color,
  rotate,
});

/**
 * 2×2 modules, each listed top-left, top-right, bottom-left, bottom-right.
 * Colour is bound to shape (blue = circle family, yellow = triangle); red grounds read as red squares.
 */
export const MODULES: readonly (readonly [Tile, Tile, Tile, Tile])[] = [
  [t("paper", "quarter", "blue", 90), t("red", "none", null, 0), t("ink", "half", "blue", 0), t("paper", "tri", "yellow", 0)],
  [t("red", "circle", "blue", 0), t("paper", "quarter", "blue", 180), t("paper", "tri", "yellow", 90), t("ink", "quarter", "blue", 270)],
  [t("ink", "tri", "yellow", 270), t("white", "half", "blue", 180), t("paper", "quarter", "blue", 0), t("red", "none", null, 0)],
  [t("paper", "half", "blue", 90), t("ink", "circle", "blue", 0), t("red", "tri", "yellow", 180), t("paper", "bar", "ink", 0)],
];

/** The tile at column `x`, row `y`: modules repeat in a varied order across the band. */
export function tileAt(x: number, y: number): Tile {
  const module = MODULES[((x >> 1) + (y >> 1) * 3) % MODULES.length]!;
  return module[(y % 2) * 2 + (x % 2)]!;
}

/** Hex per hue for each look. Mix uses the Playful palette. */
export const LOOK_PALETTES: Record<SingleLook, Record<Hue, string>> = {
  playful: { paper: "#f4efe6", white: "#ffffff", ink: "#111111", red: "#ea4535", yellow: "#f5b62a", blue: "#1f5fd8" },
  swiss: { paper: "#ffffff", white: "#ffffff", ink: "#111111", red: "#ea4535", yellow: "#111111", blue: "#111111" },
  soft: { paper: "#f4efe6", white: "#f4efe6", ink: "#464646", red: "#ea4535", yellow: "#f5cf8a", blue: "#464646" },
};

/**
 * Resolved hex for a tile in one look. Swiss and Soft fold several hues into one hex,
 * so a shape that would vanish on its ground flips to the look's paper hex.
 */
export function tileColors(tile: Tile, look: SingleLook): { ground: string; shape: string | null } {
  const palette = LOOK_PALETTES[look];
  const ground = palette[tile.ground];
  if (tile.color === null) return { ground, shape: null };
  const shape = palette[tile.color];
  return { ground, shape: shape === ground ? palette.paper : shape };
}
