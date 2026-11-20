import { HEX, SOFT_HEX, SWISS_HEX, TEXT_ON, type FillColor } from "./palette";
import { MODAL_CLASSES, TOAST_CLASSES } from "./overlays";

const channels = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
const luminance = (hex: string) => {
  const [r, g, b] = channels(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};
/** Colour of `fg` at `alpha` painted over `bg`. */
const over = (fg: string, alpha: number, bg: string) => {
  const f = channels(fg);
  const b = channels(bg);
  return `#${f.map((v, i) => Math.round(v * alpha + b[i]! * (1 - alpha)).toString(16).padStart(2, "0")).join("")}`;
};

const looks = ["playful", "soft", "swiss"] as const;

it.each([
  ["modal ink on paper (Playful, Soft)", HEX.ink, HEX.paper],
  ["modal ink on paper-white (Swiss)", SWISS_HEX.ink, SWISS_HEX.white],
  ["soft toast paper on charcoal", HEX.paper, SOFT_HEX.neutral],
  ["swiss toast ink on paper-white", SWISS_HEX.ink, SWISS_HEX.white],
])("%s meets 4.5:1", (_n, text, bg) => expect(contrast(text, bg)).toBeGreaterThanOrEqual(4.5));

it.each(Object.keys(HEX) as FillColor[])("playful toast text on %s meets 4.5:1", (c) => {
  expect(contrast(HEX[TEXT_ON[c]], HEX[c])).toBeGreaterThanOrEqual(4.5);
});

it("1.4.11: borders and rings that carry meaning reach 3:1", () => {
  expect(contrast(HEX.ink, HEX.paper)).toBeGreaterThanOrEqual(3); // playful panel border, soft toast root ring
  expect(contrast(HEX.paper, SOFT_HEX.neutral)).toBeGreaterThanOrEqual(3); // soft toast inner ring
  expect(contrast(HEX.ink, SOFT_HEX.neutral)).toBeLessThan(3); // why the inner ring must not be ink
  expect(contrast(SWISS_HEX.ink, SWISS_HEX.white)).toBeGreaterThanOrEqual(3); // swiss 2px top rule
});

it("1.4.11: the Playful panel stands out from its scrim painted over a paper page", () => {
  expect(contrast(HEX.paper, over(HEX.ink, 0.6, HEX.paper))).toBeGreaterThanOrEqual(3);
});

// The Soft panel has no border, so its edge is the paper fill against the scrimmed page behind it.
// The 3:1 result depends on that page ground. Measured (paper panel vs charcoal/60 over the page):
//   paper ~3.01 (passes, thin margin), paper-white ~2.79 (below 3:1), sand ~3.51 (passes).
// Soft is only guaranteed on a `paper` or darker/warmer ground; on pure white the dimming still
// reads, but the edge contrast is under 3:1 and we do not claim otherwise.
describe("1.4.11: Soft panel edge vs scrim, by page ground", () => {
  const softEdge = (page: string) => contrast(HEX.paper, over(SOFT_HEX.neutral, 0.6, page));

  it("meets 3:1 on a paper page (the supported ground)", () => {
    expect(softEdge(HEX.paper)).toBeGreaterThanOrEqual(3);
    expect(softEdge(HEX.paper)).toBeCloseTo(3.008, 2);
  });

  it("meets 3:1 on a sand page", () => {
    expect(softEdge(SOFT_HEX.sand)).toBeGreaterThanOrEqual(3);
    expect(softEdge(SOFT_HEX.sand)).toBeCloseTo(3.51, 2);
  });

  it("is about 2.79:1 on a paper-white page, so 3:1 is not claimed there", () => {
    // Recorded, not a requirement: documents the unsupported ground. Update this if the scrim opacity changes.
    expect(softEdge(SWISS_HEX.white)).toBeCloseTo(2.79, 2);
  });
});

// Swiss: the panel fill vs its 40% scrim over a white page is about 2.6:1. SC 1.4.11 does not strictly
// require a modal panel edge to reach 3:1; the scrim dimming plus the 2px ink top rule are the cues.
// The ink rule itself (a graphical object that carries meaning) does reach 3:1 and is asserted below.
// The fill number is recorded for reference only, not asserted, so a future fix is never blocked by it.
it("1.4.11: the Swiss panel is marked by a 2px ink top rule that reaches 3:1 against the scrimmed page", () => {
  const scrimmed = over(SWISS_HEX.ink, 0.4, SWISS_HEX.white);
  expect(contrast(SWISS_HEX.ink, scrimmed)).toBeGreaterThanOrEqual(3);
  expect(MODAL_CLASSES.swiss.panel).toContain("border-t-2");
  expect(MODAL_CLASSES.swiss.panel).toContain("border-bh-ink");
});

it("1.4.11: every toast surface stands out from the page it floats on", () => {
  expect(contrast(SOFT_HEX.neutral, HEX.paper)).toBeGreaterThanOrEqual(3); // soft pill on paper
  expect(contrast(SWISS_HEX.ink, SWISS_HEX.white)).toBeGreaterThanOrEqual(3); // swiss rule on white
  // playful fills carry a 2px ink border, which separates them from paper whatever the fill
  expect(contrast(HEX.ink, HEX.paper)).toBeGreaterThanOrEqual(3);
});

it("scrim classes match the spec per look", () => {
  expect(MODAL_CLASSES.playful.scrim).toBe("bg-bh-ink/60");
  expect(MODAL_CLASSES.soft.scrim).toBe("bg-bh-charcoal/60");
  expect(MODAL_CLASSES.swiss.scrim).toBe("bg-bh-ink/40");
});

it("every motion class is gated behind motion-safe", () => {
  for (const look of looks)
    for (const m of [MODAL_CLASSES[look].motion, TOAST_CLASSES[look].motion]) {
      expect(m.length).toBeGreaterThan(0);
      expect(m.split(" ").every((c) => c.startsWith("motion-safe:"))).toBe(true);
    }
});

it("swiss maps use no fill colour other than paper-white, ink and rule", () => {
  expect(JSON.stringify(TOAST_CLASSES.swiss) + JSON.stringify(MODAL_CLASSES.swiss)).not.toMatch(
    /bh-(paper|sand|red|yellow|blue|navy|sky|pink|orange|charcoal)\b(?!-)/,
  );
});

it("yellow is never a text colour and swiss uses no accent in overlays", () => {
  const all = JSON.stringify([MODAL_CLASSES, TOAST_CLASSES]);
  expect(all).not.toMatch(/text-bh-yellow/);
  expect(JSON.stringify([MODAL_CLASSES.swiss, TOAST_CLASSES.swiss])).not.toMatch(/bh-accent/);
});

it("toast inner rings follow the surface: current (Playful), paper (Soft), ink (Swiss)", () => {
  expect(TOAST_CLASSES.playful.action).toContain("data-[focus-visible]:outline-current");
  expect(TOAST_CLASSES.playful.close).toContain("data-[focus-visible]:outline-current");
  expect(TOAST_CLASSES.soft.action).toContain("data-[focus-visible]:outline-bh-paper");
  expect(TOAST_CLASSES.soft.close).toContain("data-[focus-visible]:outline-bh-paper");
  expect(TOAST_CLASSES.swiss.action).toContain("data-[focus-visible]:outline-bh-ink");
  expect(TOAST_CLASSES.swiss.action).toContain("underline");
});

it("the scrolling modal body carries an inset ink focus ring in every look", () => {
  for (const look of looks) {
    const tokens = MODAL_CLASSES[look].body.split(" ");
    expect(tokens).toEqual(
      expect.arrayContaining([
        "outline-hidden",
        "focus-visible:outline-solid",
        "focus-visible:outline-2",
        "focus-visible:-outline-offset-2",
        "focus-visible:outline-bh-ink",
      ]),
    );
  }
});
