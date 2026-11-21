import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FILL_CLASSES, BG_CLASSES, HEX, TEXT_ON, type FillColor,
  SOFT_TONE_CLASSES, SOFT_TONE_TEXT_ON, SOFT_HEX, CURRENT_COLOR_CLASSES, SOFT_HOVER_CLASSES,
  SWISS_HEX,
} from "./palette";
import { PLAYFUL_CHECKED, SOFT_CHECKED } from "./fields";

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

const mixSrgb = (a: string, b: string, p: number) => {
  const ch = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [ch(a), ch(b)];
  return "#" + x.map((v, i) => Math.round(v * p + y[i]! * (1 - p)).toString(16).padStart(2, "0")).join("");
};
// [fill, mixed toward, text]
const softHover = {
  red: [SOFT_HEX.red, HEX.paper, HEX.ink],
  yellow: [SOFT_HEX.yellow, HEX.ink, HEX.ink],
  blue: [SOFT_HEX.blue, HEX.ink, HEX.paper],
  neutral: [SOFT_HEX.neutral, HEX.ink, HEX.paper],
  sand: [SOFT_HEX.sand, HEX.ink, HEX.ink],
  paper: [HEX.paper, HEX.ink, HEX.ink],
} as const;
it.each(Object.entries(softHover))("soft hover %s keeps text at 4.5:1", (_k, [fill, toward, text]) => {
  expect(contrast(mixSrgb(fill, toward, 0.9), text)).toBeGreaterThanOrEqual(4.5);
});
it("soft hover classes mix 10% toward the stated colour", () => {
  expect(SOFT_HOVER_CLASSES.red).toBe("hover:bg-[color-mix(in_srgb,var(--color-bh-red)_90%,var(--color-bh-paper))]");
  expect(SOFT_HOVER_CLASSES.neutral).toBe("hover:bg-[color-mix(in_srgb,var(--color-bh-charcoal)_90%,var(--color-bh-ink))]");
  expect(Object.keys(SOFT_HOVER_CLASSES).sort()).toEqual(["blue", "neutral", "paper", "red", "sand", "yellow"]);
});

it("SWISS_HEX matches theme.css", () => {
  const css = readFileSync(resolve(import.meta.dirname, "../theme.css"), "utf8").toLowerCase();
  expect(css).toContain(`--color-bh-paper-white: ${SWISS_HEX.white.toLowerCase()}`);
  expect(css).toContain(`--color-bh-muted-text: ${SWISS_HEX.mutedText.toLowerCase()}`);
  expect(css).toContain(`--color-bh-rule: ${SWISS_HEX.rule.toLowerCase()}`);
  expect(css).toContain("--color-bh-accent: var(--color-bh-red)");
});
it.each([
  ["ink on white", SWISS_HEX.ink, SWISS_HEX.white],
  ["muted-text on white", SWISS_HEX.mutedText, SWISS_HEX.white],
  ["white on ink (hover flip)", SWISS_HEX.white, SWISS_HEX.ink],
  ["white on charcoal (solid hover)", SWISS_HEX.white, SWISS_HEX.charcoal],
  ["ink on the default accent", SWISS_HEX.ink, SWISS_HEX.accent],
])("swiss pair %s meets 4.5:1", (_n, text, fill) => {
  expect(contrast(text, fill)).toBeGreaterThanOrEqual(4.5);
});
it("documents the limits: accent on white is large-text only, rule is decorative", () => {
  expect(contrast(SWISS_HEX.accent, SWISS_HEX.white)).toBeLessThan(4.5);
  expect(contrast(SWISS_HEX.accent, SWISS_HEX.white)).toBeGreaterThanOrEqual(3);
  expect(contrast(SWISS_HEX.mutedText, SWISS_HEX.ink)).toBeLessThan(4.5); // never put muted-text on ink
  expect(contrast(SWISS_HEX.rule, SWISS_HEX.white)).toBeLessThan(3);
});

it.each([
  ["Playful input text: ink on paper-white", HEX.ink, "#FFFFFF", 4.5],
  ["Playful placeholder: muted-text on paper-white", SWISS_HEX.mutedText, "#FFFFFF", 4.5],
  ["Playful '(required)': muted-text on paper", SWISS_HEX.mutedText, HEX.paper, 4.5],
  ["Soft input text: ink on sand", HEX.ink, SOFT_HEX.sand, 4.5],
  ["Soft placeholder: charcoal on sand", SOFT_HEX.neutral, SOFT_HEX.sand, 4.5],
  ["Soft label: charcoal on paper", SOFT_HEX.neutral, HEX.paper, 4.5],
  ["Soft '(required)': muted-text on paper", SWISS_HEX.mutedText, HEX.paper, 4.5],
  ["Swiss label/placeholder: muted-text on white", SWISS_HEX.mutedText, SWISS_HEX.white, 4.5],
  ["Swiss ink rule on white (1.4.11)", SWISS_HEX.ink, SWISS_HEX.white, 3],
  ["Swiss accent invalid rule on white (1.4.11)", SWISS_HEX.accent, SWISS_HEX.white, 3],
  ["Playful red bar on paper-white (1.4.11)", HEX.red, "#FFFFFF", 3],
  ["Soft red dot on paper (1.4.11)", HEX.red, HEX.paper, 3],
  ["Playful focused option: ink on yellow", HEX.ink, HEX.yellow, 4.5],
  ["Playful trigger chevron and option check: ink on paper-white (1.4.11)", HEX.ink, "#FFFFFF", 3],
  ["Playful focused-option check: ink on yellow (1.4.11)", HEX.ink, HEX.yellow, 3],
  ["Playful popover edge: ink border on paper (1.4.11)", HEX.ink, HEX.paper, 3],
  ["Soft select trigger outline: charcoal on paper (1.4.11)", SOFT_HEX.neutral, HEX.paper, 3],
  ["Soft select chevron and option check: ink on sand (1.4.11)", HEX.ink, SOFT_HEX.sand, 3],
  ["Soft select focused option: paper on charcoal", HEX.paper, SOFT_HEX.neutral, 4.5],
  ["Soft select focused option fill: charcoal on sand (1.4.11)", SOFT_HEX.neutral, SOFT_HEX.sand, 3],
  ["Soft select empty state: charcoal on sand", SOFT_HEX.neutral, SOFT_HEX.sand, 4.5],
  ["Swiss select chevron and option check: ink on white (1.4.11)", SWISS_HEX.ink, SWISS_HEX.white, 3],
  ["Swiss select option text: muted-text on white", SWISS_HEX.mutedText, SWISS_HEX.white, 4.5],
  ["Swiss select selected option: ink on white", SWISS_HEX.ink, SWISS_HEX.white, 4.5],
  ["Soft Switch thumb: charcoal on sand (1.4.11)", SOFT_HEX.neutral, SOFT_HEX.sand, 3],
])("form pair %s meets %f:1", (_n, a, b, min) => {
  expect(contrast(a, b)).toBeGreaterThanOrEqual(min);
});

it("documents the Soft limits: muted-text never on sand, sand has no 3:1 edge on paper", () => {
  expect(contrast(SWISS_HEX.mutedText, SOFT_HEX.sand)).toBeLessThan(4.5);
  expect(contrast(SOFT_HEX.sand, HEX.paper)).toBeLessThan(3);
  expect(contrast(HEX.red, SOFT_HEX.sand)).toBeLessThan(3); // markers sit on paper, never on sand
});

it.each(softTones)("Soft switch thumb stays visible on the checked %s track (WCAG 1.4.11)", (t) => {
  // Thumb: paper fill with a 1px charcoal outline. Either the outline or the fill must carry 3:1 vs the track.
  const boundary = Math.max(contrast(SOFT_HEX.neutral, SOFT_HEX[t]), contrast(HEX.paper, SOFT_HEX[t]));
  expect(boundary).toBeGreaterThanOrEqual(3);
  // The outline always separates the thumb fill from the outline itself.
  expect(contrast(SOFT_HEX.neutral, HEX.paper)).toBeGreaterThanOrEqual(3);
});

// Radio: the checked circle is filled with the colour and the dot is `bg-current`, so the dot is the
// checked text colour. Read it from the class maps so a change there cannot slip past this test.
const checkedText = (classes: string) => /data-\[checked\]:text-bh-(ink|paper)\b/.exec(classes)![1] as "ink" | "paper";

it.each(colors)("Playful radio dot is visible on the checked %s fill (WCAG 1.4.11)", (c) => {
  expect(contrast(HEX[checkedText(PLAYFUL_CHECKED[c])], HEX[c])).toBeGreaterThanOrEqual(3);
});

it.each(softTones)("Soft radio dot is visible on the checked %s fill (WCAG 1.4.11)", (t) => {
  expect(contrast(HEX[checkedText(SOFT_CHECKED[t])], SOFT_HEX[t])).toBeGreaterThanOrEqual(3);
});

it("Soft unchecked radio: the 1px charcoal outline is the boundary against paper (WCAG 1.4.11)", () => {
  expect(contrast(SOFT_HEX.neutral, HEX.paper)).toBeGreaterThanOrEqual(3);
});

it("Swiss radio: white dot on the ink fill and the ink ring on white (WCAG 1.4.11)", () => {
  expect(contrast(SWISS_HEX.white, SWISS_HEX.ink)).toBeGreaterThanOrEqual(3);
  expect(contrast(SWISS_HEX.ink, SWISS_HEX.white)).toBeGreaterThanOrEqual(3);
});

// Table (Playful): header text on the yellow row, text on the hovered paper row, text on the white body.
it("Playful table: ink on the yellow header and on the paper hover row meet AA", () => {
  expect(contrast(HEX.ink, HEX.yellow)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(HEX.ink, HEX.paper)).toBeGreaterThanOrEqual(4.5);
});

it("Playful table: ink on the paper-white body meets AA", () => {
  expect(contrast(HEX.ink, "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
});

// Table (Soft): rows sit on sand; the lightened alternate row is paper at 50% over sand, which lies
// between two backgrounds that both carry ink at AA.
it("Soft table: ink and charcoal header text on the sand panel, and ink on paper, meet AA", () => {
  expect(contrast(HEX.ink, SOFT_HEX.sand)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(SOFT_HEX.neutral, SOFT_HEX.sand)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(HEX.ink, HEX.paper)).toBeGreaterThanOrEqual(4.5);
});
