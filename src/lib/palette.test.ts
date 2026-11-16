import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FILL_CLASSES, BG_CLASSES, HEX, TEXT_ON, type FillColor,
  SOFT_TONE_CLASSES, SOFT_TONE_TEXT_ON, SOFT_HEX, CURRENT_COLOR_CLASSES,
} from "./palette";

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

const softTones = ["red", "yellow", "blue", "neutral"] as const;

it.each(softTones)("soft tone %s meets WCAG AA 4.5:1", (t) => {
  const textHex = SOFT_TONE_TEXT_ON[t] === "ink" ? HEX.ink : HEX.paper;
  expect(contrast(SOFT_HEX[t], textHex)).toBeGreaterThanOrEqual(4.5);
});

it("sand with ink text meets 4.5:1", () => {
  expect(contrast(SOFT_HEX.sand, HEX.ink)).toBeGreaterThanOrEqual(4.5);
});

it("soft tone classes pair fill and text", () => {
  expect(SOFT_TONE_CLASSES).toEqual({
    red: "bg-bh-red text-bh-ink",
    yellow: "bg-bh-yellow text-bh-ink",
    blue: "bg-bh-blue text-bh-paper",
    neutral: "bg-bh-charcoal text-bh-paper",
  });
});

it("SOFT_HEX matches theme.css", () => {
  const css = readFileSync(resolve(import.meta.dirname, "../theme.css"), "utf8").toLowerCase();
  expect(css).toContain(`--color-bh-sand: ${SOFT_HEX.sand.toLowerCase()}`);
  expect(css).toContain(`--color-bh-charcoal: ${SOFT_HEX.neutral.toLowerCase()}`);
});

it("CURRENT_COLOR_CLASSES are literal text classes for every fill", () => {
  for (const c of colors) expect(CURRENT_COLOR_CLASSES[c]).toBe(`text-bh-${c}`);
});
