import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { FILL_CLASSES, BG_CLASSES, HEX, TEXT_ON, type FillColor } from "./palette";

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

const colors = Object.keys(HEX) as FillColor[];

it("covers the nine Playful fill colors", () => {
  expect(colors.sort()).toEqual(
    ["blue", "ink", "navy", "orange", "paper", "pink", "red", "sky", "yellow"],
  );
});

it.each(colors)("fill %s and its text color meet WCAG AA 4.5:1", (c) => {
  expect(contrast(HEX[c], HEX[TEXT_ON[c]])).toBeGreaterThanOrEqual(4.5);
});

it("HEX values match theme.css tokens", () => {
  const css = readFileSync(resolve(import.meta.dirname, "../theme.css"), "utf8").toLowerCase();
  for (const c of colors) {
    expect(css).toContain(`--color-bh-${c}: ${HEX[c].toLowerCase()}`);
  }
});

it("FILL_CLASSES are literal bg + text pairs", () => {
  expect(FILL_CLASSES.blue).toBe("bg-bh-blue text-bh-paper");
  expect(FILL_CLASSES.yellow).toBe("bg-bh-yellow text-bh-ink");
});

it("BG_CLASSES are literal bg classes", () => {
  expect(BG_CLASSES.navy).toBe("bg-bh-navy");
});

it("yellow is never used as a text color", () => {
  expect(Object.values(TEXT_ON)).not.toContain("yellow");
});
