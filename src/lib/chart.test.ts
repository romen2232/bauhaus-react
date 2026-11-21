import { describe, expect, it } from "vitest";
import { formatNumber, linearScale, niceTicks } from "./chart";

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
