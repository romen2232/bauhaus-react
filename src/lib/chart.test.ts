import { describe, expect, it } from "vitest";
import {
  arcPath,
  bandLayout,
  estimateTextWidth,
  formatNumber,
  groupSlices,
  labelStride,
  linearScale,
  linePath,
  niceTicks,
  pieAngles,
  polarPoint,
} from "./chart";

describe("linearScale", () => {
  it("maps the domain onto the range", () => {
    expect(linearScale([0, 10], [0, 100])(5)).toBe(50);
  });
  it("supports an inverted range (SVG y axis)", () => {
    expect(linearScale([0, 8], [200, 0])(2)).toBe(150);
  });
  it("does not clamp", () => {
    expect(linearScale([0, 10], [0, 100])(20)).toBe(200);
  });
  it("returns range[0] for a zero-width domain", () => {
    expect(linearScale([3, 3], [0, 100])(3)).toBe(0);
  });
});

describe("niceTicks", () => {
  it.each([
    [0, 7, [0, 2, 4, 6, 8]],
    [0, 1234, [0, 500, 1000, 1500]],
    [0, 100, [0, 20, 40, 60, 80, 100]],
    [0, 1, [0, 0.2, 0.4, 0.6, 0.8, 1]], // no float noise: exact decimals
    [0, 0.3, [0, 0.1, 0.2, 0.3]],
    [-3, 5, [-4, -2, 0, 2, 4, 6]], // crosses zero
    [-10, -2, [-10, -8, -6, -4, -2]], // all negative
    [0, 0, [0, 1]], // all-zero data
    [5, 5, [0, 1, 2, 3, 4, 5]], // equal non-zero: extend to include zero
    [7, 0, [0, 2, 4, 6, 8]], // swapped bounds
  ])("niceTicks(%s, %s)", (min, max, expected) => {
    expect(niceTicks(min, max)).toEqual(expected);
  });
  it("returns [0, 1] for non-finite input", () => {
    expect(niceTicks(NaN, 3)).toEqual([0, 1]);
  });
  it("brackets the data", () => {
    const t = niceTicks(13, 987);
    expect(t[0]).toBeLessThanOrEqual(13);
    expect(t.at(-1)).toBeGreaterThanOrEqual(987);
  });
});

describe("formatNumber", () => {
  it.each([
    [1234.5678, "1234.57"],
    [0.1 + 0.2, "0.3"],
    [-0.001, "0"],
    [42, "42"],
    [NaN, "—"],
    [Infinity, "—"],
  ])("formatNumber(%s) is %s", (n, s) => {
    expect(formatNumber(n)).toBe(s);
  });
});

describe("bandLayout", () => {
  it("lays out centred bands", () => {
    expect(bandLayout(4, 400, 0.25)).toEqual([
      { x: 12.5, width: 75 },
      { x: 112.5, width: 75 },
      { x: 212.5, width: 75 },
      { x: 312.5, width: 75 },
    ]);
  });
  it("fills the extent with no padding", () => {
    expect(bandLayout(1, 100, 0)).toEqual([{ x: 0, width: 100 }]);
  });
  it("returns no bands for zero count", () => {
    expect(bandLayout(0, 400)).toEqual([]);
  });
});

describe("labelStride / estimateTextWidth", () => {
  it.each([
    [100, 60, 1],
    [30, 60, 2],
    [25, 60, 3],
    [0, 60, 1],
  ])("labelStride(%s, %s) is %s", (s, w, n) => {
    expect(labelStride(s, w)).toBe(n);
  });
  it("estimates 0.6em per character", () => {
    expect(estimateTextWidth("1500", 10)).toBeCloseTo(24);
  });
});

describe("linePath", () => {
  it("joins points and rounds to 2 decimals", () => {
    expect(
      linePath([
        { x: 0, y: 10 },
        { x: 50, y: 0.456 },
      ]),
    ).toBe("M0,10L50,0.46");
  });
  it("handles one point and none", () => {
    expect(linePath([{ x: 5, y: 5 }])).toBe("M5,5");
    expect(linePath([])).toBe("");
  });
});

describe("polarPoint", () => {
  it.each([
    [0, 50, 0],
    [90, 100, 50],
    [180, 50, 100],
    [270, 0, 50],
  ])("at %sdeg", (deg, x, y) => {
    const p = polarPoint(50, 50, 50, deg);
    expect(p.x).toBeCloseTo(x);
    expect(p.y).toBeCloseTo(y);
  });
});

describe("arcPath", () => {
  it("draws a quarter ring segment", () => {
    expect(arcPath(50, 50, 50, 30, 0, 90)).toBe(
      "M50,0A50,50,0,0,1,100,50L80,50A30,30,0,0,0,50,20Z",
    );
  });
  it("sets the large-arc flag past 180deg", () => {
    expect(arcPath(50, 50, 50, 30, 0, 270)).toBe(
      "M50,0A50,50,0,1,1,0,50L20,50A30,30,0,1,0,50,20Z",
    );
  });
  it("splits a full circle in two halves so it does not collapse", () => {
    const d = arcPath(50, 50, 50, 30, 0, 360);
    expect(d).toBe(
      arcPath(50, 50, 50, 30, 0, 180) + arcPath(50, 50, 50, 30, 180, 360),
    );
    expect(d).not.toMatch(/NaN/);
  });
  it("returns an empty path for a zero sweep", () => {
    expect(arcPath(50, 50, 50, 30, 90, 90)).toBe("");
  });
});

describe("pieAngles", () => {
  it("splits 360deg proportionally", () => {
    expect(pieAngles([1, 1, 2])).toEqual([
      { start: 0, end: 90 },
      { start: 90, end: 180 },
      { start: 180, end: 360 },
    ]);
  });
  it("always sums to exactly 360deg", () => {
    const a = pieAngles([1, 1, 1]);
    expect(a.at(-1)?.end).toBe(360);
    expect(a.reduce((s, x) => s + (x.end - x.start), 0)).toBeCloseTo(360);
  });
  it("gives zero-width slices when everything is zero", () => {
    expect(pieAngles([0, 0])).toEqual([
      { start: 0, end: 0 },
      { start: 0, end: 0 },
    ]);
  });
  it("treats negative and non-finite values as zero", () => {
    expect(pieAngles([-5, 5, NaN])).toEqual([
      { start: 0, end: 0 },
      { start: 0, end: 360 },
      { start: 360, end: 360 },
    ]);
  });
});

describe("groupSlices", () => {
  const d = (label: string, value: number) => ({ label, value });
  it("keeps the top max-1 in original order and groups the rest", () => {
    expect(
      groupSlices([d("A", 5), d("B", 1), d("C", 4), d("D", 2), d("E", 3)], 3),
    ).toEqual([d("A", 5), d("C", 4), d("Other", 6)]);
  });
  it("breaks ties by earlier position", () => {
    expect(groupSlices([d("A", 2), d("B", 2), d("C", 2)], 2)).toEqual([
      d("A", 2),
      d("Other", 4),
    ]);
  });
  it("leaves short data untouched and does not mutate", () => {
    const input = [d("A", 1), d("B", 2)];
    expect(groupSlices(input, 3)).toEqual(input);
  });
  it("accepts a custom label", () => {
    expect(
      groupSlices([d("A", 3), d("B", 2), d("C", 1)], 2, "Rest").at(-1)?.label,
    ).toBe("Rest");
  });
});
