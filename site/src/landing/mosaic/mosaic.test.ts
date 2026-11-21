import { LOOK_PALETTES, MODULES, tileAt, tileColors, type MosaicShape } from "./mosaic";

const CIRCLE_FAMILY: MosaicShape[] = ["circle", "quarter", "half"];
const ALL_TILES = MODULES.flat();

describe("mosaic model", () => {
  test("modules match the spec", () => {
    expect(MODULES).toHaveLength(4);
    expect(MODULES[0]![0]).toEqual({ ground: "paper", shape: "quarter", color: "blue", rotate: 90 });
    expect(MODULES[1]![0]).toEqual({ ground: "red", shape: "circle", color: "blue", rotate: 0 });
    expect(MODULES[2]![0]).toEqual({ ground: "ink", shape: "tri", color: "yellow", rotate: 270 });
    expect(MODULES[3]![3]).toEqual({ ground: "paper", shape: "bar", color: "ink", rotate: 0 });
  });

  test("tileAt places modules by the spec formula", () => {
    expect(tileAt(0, 0)).toBe(MODULES[0]![0]);
    expect(tileAt(3, 1)).toBe(MODULES[1]![3]);
    expect(tileAt(0, 2)).toBe(MODULES[3]![0]);
    expect(tileAt(5, 3)).toBe(MODULES[((5 >> 1) + (3 >> 1) * 3) % 4]![(3 % 2) * 2 + (5 % 2)]);
  });

  test("colour is bound to shape", () => {
    for (const tile of ALL_TILES) {
      if (CIRCLE_FAMILY.includes(tile.shape)) expect(tile.color).toBe("blue");
      if (tile.shape === "tri") expect(tile.color).toBe("yellow");
      if (tile.shape === "none") expect(tile.color).toBeNull();
      expect(["paper", "white", "ink", "red"]).toContain(tile.ground);
    }
  });

  test("binding survives every palette", () => {
    for (const palette of Object.values(LOOK_PALETTES)) {
      const hexOf = (shapes: MosaicShape[]) =>
        new Set(ALL_TILES.filter((t) => shapes.includes(t.shape)).map((t) => palette[t.color!]));
      expect(hexOf(CIRCLE_FAMILY).size).toBe(1);
      expect(hexOf(["tri"]).size).toBe(1);
    }
  });

  test("swiss uses red as the only hue", () => {
    for (const hex of Object.values(LOOK_PALETTES.swiss)) {
      expect(["#ffffff", "#111111", "#ea4535"]).toContain(hex);
    }
  });

  test("playful matches the theme triad", () => {
    expect(LOOK_PALETTES.playful.red).toBe("#ea4535");
    expect(LOOK_PALETTES.playful.yellow).toBe("#f5b62a");
    expect(LOOK_PALETTES.playful.blue).toBe("#1f5fd8");
  });

  test("a shape is never invisible on its ground in any look", () => {
    for (const look of Object.keys(LOOK_PALETTES) as (keyof typeof LOOK_PALETTES)[]) {
      for (const tile of ALL_TILES) {
        const { ground, shape } = tileColors(tile, look);
        if (tile.shape !== "none") expect(shape, `${look} ${tile.shape} on ${tile.ground}`).not.toBe(ground);
      }
    }
  });

  test("shapes flip to the paper hue only when they would vanish", () => {
    const flipped = tileColors({ ground: "ink", shape: "circle", color: "blue", rotate: 0 }, "swiss");
    expect(flipped).toEqual({ ground: "#111111", shape: "#ffffff" });
    const kept = tileColors({ ground: "paper", shape: "circle", color: "blue", rotate: 0 }, "swiss");
    expect(kept).toEqual({ ground: "#ffffff", shape: "#111111" });
  });
});
