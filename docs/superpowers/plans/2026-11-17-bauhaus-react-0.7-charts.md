# bauhaus-react 0.7 Charts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `0.7.0`, which adds hand-drawn SVG charts (`BarChart`, `LineChart`, `DonutChart`, `Sparkline`) in the Playful, Soft and Swiss looks (12 skins), on top of an internal, unit-tested `src/lib/chart.ts`.

**Architecture:** Three layers.
- `src/lib/chart.ts` is pure math (scale, nice ticks, bands, paths, arcs), with no React.
- `src/components/_base/ChartFrame/` is one shared shell: `<figure>` + title + `aria-hidden` SVG + visually hidden data table + hover tooltip + measured width. Every chart base renders inside it, so the accessibility contract lives in one place.
- Four bases (`BarChartBase`, `LineChartBase`, `DonutChartBase`, `SparklineBase`) own geometry and hover state. Skins own static class maps and their colour prop, and pass them to the base. Colours come only from `fill-bh-*` / `stroke-bh-*` class maps in `src/lib/` (spec §6.8), never HEX.

**Tech Stack:** React 19.3, TypeScript 7, Tailwind CSS 4.3 (`@theme static`), Vite 8 lib mode, Vitest 5 + jsdom + Testing Library + user-event, Storybook 10. **No new dependency** (no d3).

**Spec:** `docs/superpowers/specs/2026-11-17-bauhaus-react-forms-overlays-data-design.md` (§3, §6.1, §6.5, §6.6, §6.7, §6.8, §6.9, §8). Earlier look rules: `docs/superpowers/specs/2026-11-16-bauhaus-react-full-catalogue-design.md` (§6.1, §6.5, §6.7). Structural model: `docs/superpowers/plans/2026-11-16-bauhaus-react-0.4.md`.

**Baseline assumption:** `0.5.0` (forms, Modal, Toast) and `0.6.0` (Table) have shipped. This plan only appends to files they also touch (`src/index.ts`, `src/smoke.test.ts`, `README.md`, the three `*Overview.stories.tsx`, `consumer-smoke/*`). Where a literal such as `"0.6.0"` is quoted, read it as "whatever the current version is".

## Global Constraints

**Dependencies and drawing** (spec §3, §6.5)
- No new runtime dependency. Charts are hand-drawn SVG; no d3.
- SVG colours only through Tailwind `fill-bh-*` / `stroke-bh-*` classes (or `currentColor`). **Never a HEX value in a component.** HEX stays in `palette.ts` for tests.
- Static class literals only; never interpolate a class (`pnpm smoke` fails on `bh-${`).
- `_base` and `lib/chart.ts` are never exported from `src/index.ts`. Only the 12 skins and the types `ChartDatum`, `ChartSeries` are (spec §6.9).

**Accessibility contract** (spec §6.5, WCAG 2.2 AA)
- Every chart is a `<figure>` with a required `title`: a visible `<figcaption>`, or visually hidden (`sr-only`) when `hideTitle`. The figure's accessible name is the title.
- A visually hidden `<table>` (class `sr-only`, **not** `hidden`/`display:none`/`aria-hidden`) holds the same values the chart draws.
- The SVG is `aria-hidden="true"` and contains **nothing focusable** (no `tabindex`, `a`, `button`).
- Values: hover tooltip (Bar, Line, Donut), the data table, or `showValues`. `Sparkline` has no tooltip or axes.
- Non-text contrast (1.4.11): a mark that carries meaning reaches 3:1 against its neighbour, or is outlined in `ink`, or is labelled directly.
- Every transition is `motion-safe:`. No animated data transitions (spec §2 non-goals).

**Looks** (spec §6.1, §6.5)
- Playful: marks from `colors?: FillColor[]` (default `["red", "blue", "yellow"]`), 2px `ink` outlines, axes are a 2px `ink` baseline only (no gridlines).
- Soft: `charcoal` marks, one highlighted mark in a `tone`, no gridlines.
- Swiss: `ink` marks, one highlighted mark in `bh-accent` (at most once per chart, fill or rule only, never text), 1px `rule` gridlines. Swiss uses only 1px strokes, no radius, no shadow.
- `DonutChart`: at most 6 slices (Swiss at most 3), the rest grouped as "Other". `LineChart`: up to 3 series.

**Conventions** (unchanged from 0.2 to 0.4)
- Folders: `src/components/_base/<Name>/{<Name>Base.tsx, <Name>Base.test.tsx}`; `src/components/<look>/<Name><Look>/{<Name><Look>.tsx, .test.tsx, .stories.tsx, index.ts}`. `index.ts` re-exports with `.js` suffixes; tests import without a suffix.
- Story titles: `Playful/<Name>Playful`, `Soft/<Name>Soft`, `Swiss/<Name>Swiss`; Swiss and Soft stories set the look's background parameter as the existing stories do.
- `"use client"` on any file using state or effects (all four bases and their skins).
- `ref` is a regular prop; `className` merges last into the figure root via `cn`.
- Each task adds its exports to `src/index.ts` in the look's existing section (`// Playful look`, `// Soft look`, `// Swiss look`).

**Process**
- Strict TDD: failing test first, run it (FAIL), implement, run it (PASS), commit.
- Tests assert behaviour. Class assertions only where this plan states them.
- **Every existing test passes unchanged**, except the one sanctioned edit of `VERSION` in `src/smoke.test.ts` (Task 12), and extending the shared `lookRules` case lists (Tasks 6, 8, 10, 11), as 0.4 did.
- Commits: conventional commits, **no AI attribution, no Co-Authored-By lines.** The plan file itself is not committed by this plan.

**Test commands**
- One file: `pnpm exec vitest run <path>`
- Full gate: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`

## Spec deviations and gaps (found against the real code)

1. **§6.7 says "arrow-key focus moves between marks"; §6.5 and call 14 say marks are not focusable.** They contradict each other. §6.5 wins (an `aria-hidden` subtree must hold no focusable element). The plan tests the opposite: no focusable element inside the SVG (Task 4, repeated per base).
2. **§6.5 does not name Soft's highlight prop.** The plan calls it `tone?: SoftTone`, like every other Soft skin, default `"blue"`. Yellow on `paper` is 1.58:1 (fails 1.4.11), so the highlighted mark **always prints its value label** (direct labelling), whatever the tone.
3. **§6.5 limits donut slices but not what happens beyond the limit.** The plan groups: keep the top `max - 1` by value (original order kept), sum the rest into "Other" (`groupSlices`, Task 2). The data table lists what is drawn.
4. **§6.1 lets Playful marks be any `FillColor`, but yellow, sky, pink and orange are below 3:1 on `paper`** (1.58, 2.29, 2.17, 2.86). Bars and slices are safe through the 2px `ink` outline. Lines are not, so Playful lines are drawn twice: an `ink` casing under the coloured stroke.
5. **Swiss donut colours `ink`/`charcoal` are only 2.00:1 against each other.** Adjacent slices are separated by a 2px `paper-white` gap and every slice is in the legend, so the pair does not carry the meaning alone.
6. **Soft donuts cannot rely on the triad** (catalogue §6.1: the triad encodes meaning only). Slices cycle three `charcoal` tints (`/100`, `/80`, `/65`, measured 8.24, 4.86, about 3.4 against `paper`) separated by `paper` gaps, plus the highlight tone.
7. **§6.9 says `lib/chart.ts` is never exported but `ChartDatum`/`ChartSeries` are.** The plan puts the two types in a type-only `src/lib/chartTypes.ts`, so nothing from `chart.ts` is exported, even by type.
8. **Tailwind v4 does generate `fill-bh-*` and `stroke-bh-*`** from the `@theme` colour tokens (verified with the CLI against `src/theme.css`), but only for literals it can see. So the class maps in `palette.ts` and `chartClasses.ts` are required, and Task 3 adds smoke needles. The `sr-only` utility already exists in the code (`CarouselBase`, `BottomNavBase`); charts reuse it.
9. **`LineChart` "accepts up to 3 series":** the plan types it as `data` XOR `series` and slices to 3.

## Plan's calls (author to confirm while reading)

1. **Line value axis does not force zero** (nice ticks of the data range); **bars always include zero** and support negative values.
2. **Width is measured, not scaled:** the SVG is `width = measured px`, `viewBox = 0 0 width height`, so text and strokes never distort. jsdom has no layout, so the fallback width is `320`.
3. **Hit areas, not focusable marks:** each category (Bar, Line) or slice (Donut) has an invisible `[data-chart-hit]` rect handling pointer enter/leave. Tooltips are `aria-hidden` HTML in the figure.
4. **Test hooks are data attributes** (`data-chart-mark`, `data-chart-hit`, `data-chart-label`, `data-chart-grid`, `data-chart-baseline`, `data-chart-line`), because the SVG is `aria-hidden` and has no roles to query.
5. **`LineChart` highlight marks the point with that label on the first series only** (so Swiss uses `bh-accent` once). Swiss series are told apart without colour: `ink` solid, `charcoal` dashed, `muted-text` dotted.
6. **Donut:** a static, `aria-hidden` legend (swatch + label, plus value with `showValues`), a centre numeral that defaults to the total (`centerLabel` overrides it, `centerCaption` adds a small line), and a `Total` footer row in the data table.
7. **`Sparkline` highlight defaults to the last point.** Playful sparkline: `ink` line, end dot from `color?: FillColor` (default `red`). `height` default is 32.
8. **Non-finite values** (`NaN`, `Infinity`) are drawn as `0`, shown as `—` in the table and tooltip, and never reach an SVG attribute.
9. **Default heights:** Bar 240, Line 240, Donut 240 (diameter, centred), Sparkline 32.
10. **Class maps live in `src/lib/chartClasses.ts`** (one object per look), SVG fill/stroke maps in `palette.ts`. Neither is exported from `index.ts`.

## Review Focus

1. **Empty and degenerate data:** `data=[]`, all zeros, a single point, equal values must render (no throw, **no `NaN` anywhere in the markup**) with an empty or zero table. Tests in Tasks 1, 2, 5, 7, 9, 11.
2. **Non-finite and negative values:** `NaN` is `0` visually and `—` in the table; negative bars hang below the baseline; donut negatives count as `0`. Tasks 2, 5, 9.
3. **Float noise in ticks and labels:** `niceTicks(0, 1)` is exactly `[0, 0.2, 0.4, 0.6, 0.8, 1]`, never `0.6000000000000001`. Task 1.
4. **Crowded axes:** many categories or long labels must thin the labels (`labelStride`) while the table keeps every row. Tasks 2, 5.
5. **Other-colour leaks and the accent rule:** no Swiss chart emits a Playful or Soft colour, and no Swiss chart has more than one `bh-accent` element (including the donut and a multi-series line). Task 6 onward (`chartLookRules`).
6. **Accessibility regressions:** a focusable element or a missing figure name or table slipped into the SVG. Pinned once in Task 4 and again in every base.

## PR slices (chained, each at or below about 400 changed lines)

The author picks the chain strategy (`stacked-to-main` or `feature-branch-chain`) when execution starts; follow `chained-pr`. Every PR keeps its tests and stories with its code and leaves `main`'s gate green.

| PR | Tasks | Deliverable | Est. lines |
|---|---|---|---|
| 1 | 1, 2 | `lib/chart.ts` + `chartTypes.ts`, fully unit-tested | about 380 |
| 2 | 3, 4 | SVG class maps, `chartClasses.ts`, smoke needles, `ChartFrame` | about 360 |
| 3 | 5 | `BarChartBase` | about 260 |
| 4 | 6 | Bar skins x3 + exports | about 300 |
| 5 | 7 | `LineChartBase` | about 300 |
| 6 | 8 | Line skins x3 + exports | about 300 |
| 7 | 9 | `DonutChartBase` | about 280 |
| 8 | 10 | Donut skins x3 + exports | about 300 |
| 9 | 11 | `SparklineBase` + skins x3 + exports | about 330 |
| 10 | 12 | Release 0.7.0 (version, README, overview stories) | about 250 |

PR 3 to 9 each depend on the previous chart PRs only through PR 2. If a PR measures over 400 changed lines, split it at the base/skin boundary it already has. Each PR states start, end, dependencies, follow-ups and out-of-scope items, with a dependency diagram marking itself.

## File map

```txt
src/lib/chartTypes.ts                              C  ChartDatum, ChartSeries (types only) (Task 1)
src/lib/chart.ts, chart.test.ts                    C  math (Tasks 1-2)
src/lib/palette.ts, palette.test.ts                M  SVG_FILL/STROKE maps, 1.4.11 tests (Task 3)
src/lib/chartClasses.ts, chartClasses.test.ts      C  CHART_CLASSES per look (Task 3)
consumer-smoke/check.mjs, check-storybook.mjs      M  fill/stroke/sr-only needles (Task 3)
src/components/_base/ChartFrame/…                  C  ChartFrame, useMeasuredWidth (Task 4)
src/components/_base/{BarChart,LineChart,DonutChart,Sparkline}/…   C  4 bases (Tasks 5,7,9,11)
src/components/{playful,soft,swiss}/<Chart><Look>/…                C  12 skins (Tasks 6,8,10,11)
src/components/swiss/chartLookRules.test.tsx       C  (Task 6, extended 8,10,11)
src/components/{soft,swiss}/lookRules.test.tsx     M  chart cases appended
src/components/{playful,soft,swiss}/*Overview.stories.tsx   M  Charts section (Task 12)
src/index.ts, src/smoke.test.ts, package.json, README.md, consumer-smoke/types/consumer.ts   M
```

No existing `_base`, skin or primitive file changes.

---

### Task 1: Chart types, `linearScale`, `niceTicks`, `formatNumber`

**Files:**
- Create: `src/lib/chartTypes.ts`, `src/lib/chart.ts`, `src/lib/chart.test.ts`

**Interfaces:**
- Produces:
  - `chartTypes.ts`: `export type ChartDatum = { label: string; value: number }`; `export type ChartSeries = { id: string; label: string; data: ChartDatum[] }`.
  - `chart.ts`:
    - `linearScale(domain: [number, number], range: [number, number]): (v: number) => number`. Not clamped. Equal domain ends return `range[0]`.
    - `niceTicks(min: number, max: number, target?: number): number[]` (`target` default 5). Ascending; first tick `<= min`, last tick `>= max`.
    - `formatNumber(n: number): string`.

- [ ] **Step 1: Write the failing tests** (`chart.test.ts`)

```ts
describe("linearScale", () => {
  it("maps the domain onto the range", () => { expect(linearScale([0, 10], [0, 100])(5)).toBe(50); });
  it("supports an inverted range (SVG y axis)", () => { expect(linearScale([0, 8], [200, 0])(2)).toBe(150); });
  it("does not clamp", () => { expect(linearScale([0, 10], [0, 100])(20)).toBe(200); });
  it("returns range[0] for a zero-width domain", () => { expect(linearScale([3, 3], [0, 100])(3)).toBe(0); });
});

describe("niceTicks", () => {
  it.each([
    [0, 7, [0, 2, 4, 6, 8]],
    [0, 1234, [0, 500, 1000, 1500]],
    [0, 100, [0, 20, 40, 60, 80, 100]],
    [0, 1, [0, 0.2, 0.4, 0.6, 0.8, 1]],          // no float noise: exact decimals
    [0, 0.3, [0, 0.1, 0.2, 0.3]],
    [-3, 5, [-4, -2, 0, 2, 4, 6]],               // crosses zero
    [-10, -2, [-10, -8, -6, -4, -2]],            // all negative
    [0, 0, [0, 1]],                              // all-zero data
    [5, 5, [0, 1, 2, 3, 4, 5]],                  // equal non-zero: extend to include zero
    [7, 0, [0, 2, 4, 6, 8]],                     // swapped bounds
  ])("niceTicks(%s, %s)", (min, max, expected) => { expect(niceTicks(min, max)).toEqual(expected); });
  it("returns [0, 1] for non-finite input", () => { expect(niceTicks(NaN, 3)).toEqual([0, 1]); });
  it("brackets the data", () => {
    const t = niceTicks(13, 987); expect(t[0]).toBeLessThanOrEqual(13); expect(t.at(-1)).toBeGreaterThanOrEqual(987);
  });
});

describe("formatNumber", () => {
  it.each([[1234.5678, "1234.57"], [0.1 + 0.2, "0.3"], [-0.001, "0"], [42, "42"], [NaN, "—"], [Infinity, "—"]])(
    "formatNumber(%s) is %s", (n, s) => { expect(formatNumber(n)).toBe(s); });
});
```

- [ ] **Step 2: Run, confirm FAIL**

Run: `pnpm exec vitest run src/lib/chart.test.ts`
Expected: FAIL, `./chart` not found.

- [ ] **Step 3: Implement** the three functions and the types file.

`niceTicks` algorithm (the tests do not fix the step selection):
1. Non-finite input, or `min === max === 0`: return `[0, 1]`. Swap if `min > max`. If `min === max`, widen to include zero: `(0, max)` for positive, `(min, 0)` for negative.
2. `raw = (max - min) / target`; `mag = 10 ** floor(log10(raw))`; `norm = raw / mag`; `step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag`.
3. `start = floor(min / step + 1e-9) * step`, `end = ceil(max / step - 1e-9) * step` (the epsilon absorbs `0.3 / 0.1`).
4. Emit `start`..`end` by `step`, each rounded with `Number(x.toFixed(decimals))` where `decimals = max(0, -floor(log10(step)))`.

`formatNumber`: non-finite gives `"—"`; otherwise `Number(n.toFixed(2)).toString()`.

- [ ] **Step 4: Run, confirm PASS** (same command).
- [ ] **Step 5: Commit**

```bash
git add src/lib/chartTypes.ts src/lib/chart.ts src/lib/chart.test.ts
git commit -m "feat(charts): add linear scale, nice ticks and number formatting"
```

---

### Task 2: Bands, label stride, line path, arcs, pie angles, slice grouping

**Files:**
- Modify: `src/lib/chart.ts`, `src/lib/chart.test.ts`

**Interfaces:**
- Consumes: `ChartDatum` (Task 1).
- Produces (all in `chart.ts`):
  - `bandLayout(count: number, extent: number, padding?: number): { x: number; width: number }[]` (`padding` default `0.2`, the fraction of each step left empty, split on both sides).
  - `estimateTextWidth(text: string, fontSize: number): number` = `text.length * fontSize * 0.6`.
  - `labelStride(step: number, labelWidth: number): number` (draw every n-th category label).
  - `linePath(points: { x: number; y: number }[]): string`.
  - `polarPoint(cx: number, cy: number, r: number, deg: number): { x: number; y: number }` (0deg at 12 o'clock, clockwise).
  - `arcPath(cx: number, cy: number, rOuter: number, rInner: number, startDeg: number, endDeg: number): string`.
  - `pieAngles(values: number[]): { start: number; end: number }[]`.
  - `groupSlices(data: ChartDatum[], max: number, otherLabel?: string): ChartDatum[]` (`otherLabel` default `"Other"`).

- [ ] **Step 1: Write the failing tests** (append to `chart.test.ts`)

```ts
describe("bandLayout", () => {
  it("lays out centred bands", () => {
    expect(bandLayout(4, 400, 0.25)).toEqual([
      { x: 12.5, width: 75 }, { x: 112.5, width: 75 }, { x: 212.5, width: 75 }, { x: 312.5, width: 75 },
    ]);
  });
  it("fills the extent with no padding", () => { expect(bandLayout(1, 100, 0)).toEqual([{ x: 0, width: 100 }]); });
  it("returns no bands for zero count", () => { expect(bandLayout(0, 400)).toEqual([]); });
});

describe("labelStride / estimateTextWidth", () => {
  it.each([[100, 60, 1], [30, 60, 2], [25, 60, 3], [0, 60, 1]])("labelStride(%s, %s) is %s", (s, w, n) => {
    expect(labelStride(s, w)).toBe(n);
  });
  it("estimates 0.6em per character", () => { expect(estimateTextWidth("1500", 10)).toBeCloseTo(24); });
});

describe("linePath", () => {
  it("joins points and rounds to 2 decimals", () => {
    expect(linePath([{ x: 0, y: 10 }, { x: 50, y: 0.456 }])).toBe("M0,10L50,0.46");
  });
  it("handles one point and none", () => {
    expect(linePath([{ x: 5, y: 5 }])).toBe("M5,5");
    expect(linePath([])).toBe("");
  });
});

describe("polarPoint", () => {
  it.each([[0, 50, 0], [90, 100, 50], [180, 50, 100], [270, 0, 50]])("at %sdeg", (deg, x, y) => {
    const p = polarPoint(50, 50, 50, deg); expect(p.x).toBeCloseTo(x); expect(p.y).toBeCloseTo(y);
  });
});

describe("arcPath", () => {
  it("draws a quarter ring segment", () => {
    expect(arcPath(50, 50, 50, 30, 0, 90)).toBe("M50,0A50,50,0,0,1,100,50L80,50A30,30,0,0,0,50,20Z");
  });
  it("sets the large-arc flag past 180deg", () => {
    expect(arcPath(50, 50, 50, 30, 0, 270)).toBe("M50,0A50,50,0,1,1,0,50L20,50A30,30,0,1,0,50,20Z");
  });
  it("splits a full circle in two halves so it does not collapse", () => {
    const d = arcPath(50, 50, 50, 30, 0, 360);
    expect(d).toBe(arcPath(50, 50, 50, 30, 0, 180) + arcPath(50, 50, 50, 30, 180, 360));
    expect(d).not.toMatch(/NaN/);
  });
  it("returns an empty path for a zero sweep", () => { expect(arcPath(50, 50, 50, 30, 90, 90)).toBe(""); });
});

describe("pieAngles", () => {
  it("splits 360deg proportionally", () => {
    expect(pieAngles([1, 1, 2])).toEqual([{ start: 0, end: 90 }, { start: 90, end: 180 }, { start: 180, end: 360 }]);
  });
  it("always sums to exactly 360deg", () => {
    const a = pieAngles([1, 1, 1]); expect(a.at(-1)?.end).toBe(360);
    expect(a.reduce((s, x) => s + (x.end - x.start), 0)).toBeCloseTo(360);
  });
  it("gives zero-width slices when everything is zero", () => {
    expect(pieAngles([0, 0])).toEqual([{ start: 0, end: 0 }, { start: 0, end: 0 }]);
  });
  it("treats negative and non-finite values as zero", () => {
    expect(pieAngles([-5, 5, NaN])).toEqual([{ start: 0, end: 0 }, { start: 0, end: 360 }, { start: 360, end: 360 }]);
  });
});

describe("groupSlices", () => {
  const d = (label: string, value: number) => ({ label, value });
  it("keeps the top max-1 in original order and groups the rest", () => {
    expect(groupSlices([d("A", 5), d("B", 1), d("C", 4), d("D", 2), d("E", 3)], 3))
      .toEqual([d("A", 5), d("C", 4), d("Other", 6)]);
  });
  it("breaks ties by earlier position", () => {
    expect(groupSlices([d("A", 2), d("B", 2), d("C", 2)], 2)).toEqual([d("A", 2), d("Other", 4)]);
  });
  it("leaves short data untouched and does not mutate", () => {
    const input = [d("A", 1), d("B", 2)]; expect(groupSlices(input, 3)).toEqual(input);
  });
  it("accepts a custom label", () => { expect(groupSlices([d("A", 3), d("B", 2), d("C", 1)], 2, "Rest").at(-1)?.label).toBe("Rest"); });
});
```

- [ ] **Step 2: Run, confirm FAIL**

Run: `pnpm exec vitest run src/lib/chart.test.ts`
Expected: FAIL, the new functions are undefined.

- [ ] **Step 3: Implement** the eight functions in `chart.ts`.
  - `bandLayout`: `step = extent / count`, `width = step * (1 - padding)`, `x_i = i * step + (step - width) / 2`.
  - `labelStride`: `step <= 0 ? 1 : max(1, ceil(labelWidth / step))`.
  - Numbers in `linePath` and `arcPath` go through a private `fmt(n) = +n.toFixed(2)` so `-0` and float noise never print.
  - `arcPath`: outer arc start to end (`sweep 1`), line to the inner end point, inner arc back (`sweep 0`), `Z`. Large-arc flag is `1` when the sweep is over 180. A sweep of 360 or more concatenates the 0-180 and 180-360 paths; a sweep of 0 returns `""`. Coordinate and flag separator is `,` exactly as in the tests.
  - `pieAngles`: clamp each value with `Number.isFinite(v) && v > 0 ? v : 0`; running sum times `360 / total`; force the last non-empty end (and any trailing zero-width slice) to exactly `360`. Total 0 gives all `{0, 0}`.
  - `groupSlices`: `max` is clamped to at least 2; rank by value descending with the earlier index winning ties; keep the top `max - 1`, preserve original order, append `{ label: otherLabel, value: sum of the rest }`.

- [ ] **Step 4: Run, confirm PASS**, then `pnpm typecheck`.
- [ ] **Step 5: Commit**: `feat(charts): add band layout, paths, arcs and slice grouping`

**PR boundary 1 (Tasks 1-2).**

---

### Task 3: SVG class maps, `chartClasses.ts`, smoke needles, 1.4.11 palette tests

**Files:**
- Modify: `src/lib/palette.ts`, `src/lib/palette.test.ts`, `consumer-smoke/check.mjs`, `consumer-smoke/check-storybook.mjs`
- Create: `src/lib/chartClasses.ts`, `src/lib/chartClasses.test.ts`

**Interfaces:**
- Produces:
  - `palette.ts` (not exported from `index.ts`): `SVG_FILL_CLASSES: Record<FillColor, string>` (`"fill-bh-red"`, ... one per colour) and `SVG_STROKE_CLASSES: Record<FillColor, string>` (`"stroke-bh-red"`, ...); `SOFT_TONE_SVG_FILL: Record<SoftTone, string>` (`neutral` maps to `"fill-bh-charcoal"`); `SOFT_DONUT_TINTS: readonly ["fill-bh-charcoal", "fill-bh-charcoal/80", "fill-bh-charcoal/65"]`.
  - `chartClasses.ts`: `type ChartLookClasses = { root: string; caption: string; plot: string; tooltip: string; tick: string; baseline: string; grid: string; valueLabel: string; centre: string; centreCaption: string; legend: string }` and `CHART_CLASSES: { playful: ChartLookClasses; soft: ChartLookClasses; swiss: ChartLookClasses }`.
  - Pinned values: `playful.tick` has `fill-bh-ink`, `playful.baseline` is `stroke-bh-ink stroke-2`, `playful.grid` is `""`; `soft.tick` has `fill-bh-charcoal`, `soft.baseline` has `stroke-bh-charcoal`, `soft.grid` is `""`; `swiss.tick` has `fill-bh-muted-text`, `swiss.baseline` has `stroke-bh-ink`, `swiss.grid` is `stroke-bh-rule` + a 1px width. Typography: Playful `font-bh-display`/`font-bh-body` black or semibold, uppercase caption; Soft `font-bh-display`/`font-bh-body` regular; Swiss `SWISS_LABEL`/`SWISS_DISPLAY` from `styles.ts`, `font-normal` only. Tooltip: Playful 2px `ink` border + `shadow-bh-hard` on `paper-white`; Soft `charcoal` pill with `paper` text; Swiss `paper-white` with 1px `ink` border, no shadow. Everything else (sizes, spacing) is the builder's.

- [ ] **Step 1: Write the failing tests**

```ts
// palette.test.ts (contrast and the theme.css reader already exist there)
it.each(Object.keys(HEX) as FillColor[])("SVG classes for %s match the theme token", (c) => {
  expect(SVG_FILL_CLASSES[c]).toBe(`fill-bh-${c}`);
  expect(SVG_STROKE_CLASSES[c]).toBe(`stroke-bh-${c}`);
  expect(themeCss).toContain(`--color-bh-${c}:`);
});
it("Soft neutral SVG fill is charcoal", () => { expect(SOFT_TONE_SVG_FILL.neutral).toBe("fill-bh-charcoal"); });

// 1.4.11: meaningful marks reach 3:1, or are outlined/labelled (see the plan's deviations 4-6)
const PAPER = HEX.paper;
it.each([
  ["ink outline on paper", HEX.ink, PAPER], ["charcoal mark on paper", SOFT_HEX.neutral, PAPER],
  ["blue highlight on paper", SOFT_HEX.blue, PAPER], ["red highlight on paper", SOFT_HEX.red, PAPER],
  ["ink mark on white", SWISS_HEX.ink, SWISS_HEX.white], ["accent mark on white", SWISS_HEX.accent, SWISS_HEX.white],
  ["charcoal mark on white", SWISS_HEX.charcoal, SWISS_HEX.white], ["muted-text dotted line on white", SWISS_HEX.mutedText, SWISS_HEX.white],
])("%s meets 3:1", (_n, a, b) => { expect(contrast(a, b)).toBeGreaterThanOrEqual(3); });
it.each([["yellow", HEX.yellow], ["sky", HEX.sky], ["pink", HEX.pink], ["orange", HEX.orange]])(
  "documents that Playful %s needs its ink outline (below 3:1 on paper)", (_n, hex) => {
    expect(contrast(hex, PAPER)).toBeLessThan(3);
  });
it("documents that Soft yellow needs a direct label", () => { expect(contrast(SOFT_HEX.yellow, PAPER)).toBeLessThan(3); });
it("Soft donut tints stay at 3:1 or more on paper", () => {
  // blend(hex, bg, alpha): per-channel hex * alpha + bg * (1 - alpha); write this tiny helper in the test file
  for (const alpha of [1, 0.8, 0.65]) expect(contrast(blend(SOFT_HEX.neutral, PAPER, alpha), PAPER)).toBeGreaterThanOrEqual(3);
});
```

```ts
// chartClasses.test.ts
it("keeps the look rules in the shared maps", () => {
  expect(CHART_CLASSES.playful.baseline).toContain("stroke-bh-ink");
  expect(CHART_CLASSES.playful.grid).toBe("");
  expect(CHART_CLASSES.soft.grid).toBe("");
  expect(CHART_CLASSES.swiss.grid).toContain("stroke-bh-rule");
  expect(CHART_CLASSES.swiss.tick).toContain("fill-bh-muted-text");
});
it("uses no HEX and no interpolated class", () => {
  expect(JSON.stringify(CHART_CLASSES)).not.toMatch(/#[0-9a-f]{3,6}|\$\{/i);
});
it("Swiss strings stay inside the Swiss look", () => {
  const swiss = Object.values(CHART_CLASSES.swiss).join(" ");
  expect(swiss).not.toMatch(/rounded|shadow|font-bh-(display|body)|font-(medium|semibold|bold|extrabold|black)|border-(2|4|8)/);
});
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/lib` (maps undefined).
- [ ] **Step 3: Implement** the maps and `CHART_CLASSES`. Smoke needles: `consumer-smoke/check.mjs` appends `".fill-bh-red"`, `".fill-bh-accent"`, `".stroke-bh-ink"`, `".stroke-bh-rule"`, `".sr-only"`, `".fill-bh-charcoal\\/80"`; `check-storybook.mjs` appends `[".fill-bh-ink", true]`. As in 0.4 Task 1, `pnpm smoke:storybook` fails for the `.fill-bh-ink` needle until Task 6 draws a Swiss bar; say so in the commit body.
- [ ] **Step 4: Run, confirm PASS**: `pnpm exec vitest run src/lib && pnpm typecheck`. (`pnpm smoke` is expected to pass already because the maps are in `dist/`.)
- [ ] **Step 5: Commit**: `feat(tokens): add chart SVG class maps and contrast checks`

---

### Task 4: `ChartFrame` and `useMeasuredWidth`

**Files:**
- Create: `src/components/_base/ChartFrame/{ChartFrame.tsx, ChartFrame.test.tsx, useMeasuredWidth.ts}`

**Interfaces:**
- Consumes: `cn`; `ChartLookClasses` (Task 3).
- Produces:
  - `useMeasuredWidth(ref: RefObject<HTMLElement | null>, fallback?: number): number` (`fallback` default `320`). Reads `getBoundingClientRect().width` on layout and observes with `ResizeObserver` when it exists. A measured `0` keeps the previous value; disconnects on unmount.
  - `type ChartTable = { headers: string[]; rows: string[][]; footer?: string[] }` (first cell of each row is its row header).
  - `type ChartTooltipState = { x: number; y: number; text: string } | null` (x and y in px inside the plot box).
  - `type ChartFrameProps = { title: string; hideTitle?: boolean; height: number; table: ChartTable; tooltip?: ChartTooltipState; classes: Pick<ChartLookClasses, "root" | "caption" | "plot" | "tooltip">; className?: string; ref?: Ref<HTMLElement>; children: (width: number) => ReactNode }`.
  - Renders `<figure>` > `<figcaption id>` (`sr-only` when `hideTitle`), a `div` (`plot`, measured) holding `<svg aria-hidden="true" width height viewBox>` with `children(width)`, the `aria-hidden` tooltip when set, and the `sr-only` `<table>` with `<caption>` = title. Figure `aria-labelledby` points at the figcaption (`useId`).
  - `type CommonChartProps = { title: string; hideTitle?: boolean; height?: number; showValues?: boolean; formatValue?: (n: number) => string; className?: string; ref?: Ref<HTMLElement> }` (the public props every chart shares; each base narrows `height`'s default).

- [ ] **Step 1: Write the failing tests** (`ChartFrame.test.tsx`; helper `renderFrame(props?)` with `children={() => <g data-testid="inner" />}`)

```tsx
it("names the figure after the title and shows the caption", () => {
  renderFrame({ title: "Visits per month" });
  expect(screen.getByRole("figure", { name: "Visits per month" })).toBeInTheDocument();
  expect(screen.getByText("Visits per month", { selector: "figcaption" })).not.toHaveClass("sr-only");
});
it("hideTitle keeps the name but hides the caption visually", () => {
  renderFrame({ title: "Visits", hideTitle: true });
  expect(screen.getByRole("figure", { name: "Visits" })).toBeInTheDocument();
  expect(screen.getByText("Visits", { selector: "figcaption" })).toHaveClass("sr-only");
});
it("exposes a visually hidden data table to assistive tech", () => {
  renderFrame({ table: { headers: ["Label", "Value"], rows: [["Jan", "12"], ["Feb", "40"]], footer: ["Total", "52"] } });
  const table = screen.getByRole("table", { name: "Visits" });
  expect(table).toHaveClass("sr-only");
  expect(table).not.toHaveAttribute("aria-hidden");
  expect(within(table).getAllByRole("row").map((r) => within(r).getAllByRole(/cell|columnheader|rowheader/).map((c) => c.textContent)))
    .toEqual([["Label", "Value"], ["Jan", "12"], ["Feb", "40"], ["Total", "52"]]);
  expect(within(table).getByRole("rowheader", { name: "Jan" })).toBeInTheDocument();
});
it("hides the svg from assistive tech and keeps it free of focusable elements", () => {
  const { container } = renderFrame();
  const svg = container.querySelector("svg")!;
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg.querySelectorAll("a, button, [tabindex]")).toHaveLength(0);
});
it("uses the 320px fallback when nothing can be measured (jsdom)", () => {
  const { container } = renderFrame({ height: 200 });
  expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 320 200");
  expect(container.querySelector("svg")).toHaveAttribute("width", "320");
});
it("re-renders at the measured width instead of scaling", () => {
  // stub global ResizeObserver; trigger its callback with contentRect.width = 600 inside act()
  expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 600 200");
});
it("ignores a measured width of 0 and disconnects on unmount", () => { /* observer.disconnect called once; viewBox stays 0 0 320 200 */ });
it("renders the tooltip only when given, as aria-hidden", () => {
  const { rerender } = renderFrame({ tooltip: null });
  expect(screen.queryByText("Feb: 40")).toBeNull();
  rerender(/* same frame */ withTooltip({ x: 40, y: 20, text: "Feb: 40" }));
  expect(screen.getByText("Feb: 40")).toHaveAttribute("aria-hidden", "true");
});
it("forwards className (merged last) and ref to the figure", () => { /* className "x"; ref instanceof HTMLElement with tagName FIGURE */ });
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/_base/ChartFrame`.
- [ ] **Step 3: Implement** the hook and the frame (`"use client"`). The table is built with real `<th scope="col">` / `<th scope="row">`. Position the tooltip with inline `left`/`top` px (geometry, not colour).
- [ ] **Step 4: Run, confirm PASS** (same command), then `pnpm typecheck`.
- [ ] **Step 5: Commit**: `feat(charts): add the shared accessible chart frame`

**PR boundary 2 (Tasks 3-4).**

---

### Task 5: `BarChartBase`

**Files:**
- Create: `src/components/_base/BarChart/{BarChartBase.tsx, BarChartBase.test.tsx}`

**Interfaces:**
- Consumes: `ChartFrame`, `CommonChartProps`, `ChartLookClasses`; `chart.ts` (`niceTicks`, `linearScale`, `bandLayout`, `labelStride`, `estimateTextWidth`, `formatNumber`); `ChartDatum`.
- Produces:
  - `type BarChartProps = CommonChartProps & { data: ChartDatum[]; highlight?: string }` (`height` default 240).
  - `type BarChartClasses = Pick<ChartLookClasses, "root" | "caption" | "plot" | "tooltip" | "tick" | "baseline" | "grid" | "valueLabel"> & { mark: (index: number, isHighlighted: boolean) => string }`.
  - `type BarChartBaseProps = BarChartProps & { classes: BarChartClasses; gridlines: boolean; barRadius: number }`.
  - DOM hooks: bars `rect[data-chart-mark]`, hit areas `rect[data-chart-hit]`, gridlines `[data-chart-grid]`, baseline `[data-chart-baseline]`, value labels `text[data-chart-label]`.
  - Behaviour: value axis from `niceTicks(min(0, ...values), max(0, ...values))`; left margin from `estimateTextWidth` of the widest tick; category labels drawn every `labelStride(step, estimateTextWidth(longestLabel, 12))`; non-finite values drawn as 0; table is `Label`/`Value`; tooltip text is `` `${label}: ${formatValue(value)}` `` (default `formatNumber`).

- [ ] **Step 1: Write the failing tests** (data `[{Jan,12},{Feb,40}]` unless stated; queries on SVG text use `container.querySelectorAll("svg text")`, because the table repeats the same words)

```tsx
it("table matches the data", () => { /* headers ["Label","Value"], rows [["Jan","12"],["Feb","40"]] */ });
it("draws one bar per datum, with heights proportional to the values", () => {
  /* data 10/20/40: three [data-chart-mark]; height(20) ~ 2 * height(10) and height(40) ~ 4 * height(10) (toBeCloseTo) */
});
it("draws the value axis with nice ticks and the category labels", () => {
  /* data 0..40 gives svg text containing "0","10","20","30","40" and "Jan","Feb" */
});
it("hangs negative bars below the baseline", () => {
  /* data [-5, 10]: baseline y = Y; bar(-5).y ~ Y and bar(-5).height > 0; bar(10).y + bar(10).height ~ Y */
});
it("survives all-zero, empty and non-finite data without NaN", () => {
  /* [0,0]: heights "0", ticks "0","1"; []: figure + table with header row only; [{Jan, NaN}]: cell "—", height 0; innerHTML never contains "NaN" */
});
it("prints value labels only on request, and always on the highlighted bar", () => {
  /* default: no [data-chart-label]; highlight="Feb": exactly one, text "40"; showValues: two ("12","40") */
});
it("asks the skin for each mark class, flagging only the highlighted one", () => {
  /* classes.mark = vi.fn((i, h) => (h ? "hi" : "lo")): highlight="Feb" -> bar 1 has class "hi", bar 0 "lo"; unknown highlight -> no "hi"; duplicate labels -> only the first */
});
it("shows a tooltip on pointer hover and removes it on leave", async () => {
  /* none initially; user.hover(hit[1]) -> getByText("Feb: 40") is aria-hidden; user.unhover -> gone; formatValue={(v)=>"$"+v} -> "Feb: $40" */
});
it("thins crowded category labels but keeps every table row", () => {
  /* 12 long labels ("September") at the 320px fallback: svg category labels < 12 while the table has 12 rows */
});
it("draws gridlines only when asked, and always the baseline", () => {
  /* gridlines true: [data-chart-grid] count === tick count; false: 0; [data-chart-baseline] === 1 */
});
it("applies barRadius as rx", () => { /* barRadius 6 -> every bar rx "6" */ });
it("keeps the accessibility contract", () => { /* figure named by title; svg aria-hidden; no a/button/[tabindex] inside the svg */ });
it("forwards className and ref", () => { /* ... */ });
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/_base/BarChart`.
- [ ] **Step 3: Implement `BarChartBase(props: BarChartBaseProps)`** with `"use client"`. Hover state is the hovered index; `ChartFrame.tooltip` is positioned above the bar top, centred on the band.
- [ ] **Step 4: Run, confirm PASS**, then `pnpm typecheck`.
- [ ] **Step 5: Commit**: `feat(charts): add BarChartBase with axes, tooltip and data table`

**PR boundary 3 (Task 5).**

---

### Task 6: `BarChartPlayful`, `BarChartSoft`, `BarChartSwiss`

**Files:**
- Create: `src/components/{playful/BarChartPlayful,soft/BarChartSoft,swiss/BarChartSwiss}/*`, `src/components/swiss/chartLookRules.test.tsx`
- Modify: `src/components/{soft,swiss}/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `BarChartBase`, `BarChartProps`; `CHART_CLASSES`; `SVG_FILL_CLASSES`, `SVG_STROKE_CLASSES`, `SOFT_TONE_SVG_FILL`; `FillColor`, `SoftTone`.
- Produces (all `"use client"`):
  - `BarChartPlayfulProps = Omit<BarChartProps, "highlight"> & { colors?: FillColor[] }`. Bar `i` has `SVG_FILL_CLASSES[colors[i % colors.length]]` + `stroke-bh-ink stroke-2`. Default `colors` is `["red", "blue", "yellow"]`; an empty array falls back to the default. `gridlines={false}`, `barRadius={0}`.
  - `BarChartSoftProps = BarChartProps & { tone?: SoftTone }` (default `"blue"`). Bars `fill-bh-charcoal`; the highlighted bar `SOFT_TONE_SVG_FILL[tone]`. `gridlines={false}`, `barRadius={6}`.
  - `BarChartSwissProps = BarChartProps`. Bars `fill-bh-ink`; the highlighted bar `fill-bh-accent`. `gridlines`, `barRadius={0}`.
  - `chartLookRules.test.tsx`: renders Swiss chart elements and, over every element's `getAttribute("class")` tokens (stripping variant prefixes), asserts none matches `FORBIDDEN_SWISS_CHART = /^((fill|stroke)-bh-(red|yellow|blue|navy|sky|pink|orange|sand|paper|teal|khaki)|text-bh-yellow|rounded.*|shadow.*|-?translate-.*|font-bh-(display|body)|font-(medium|semibold|bold|extrabold|black)|border-(2|4|8)|stroke-(2|3|4)|stroke-\[[2-9]px\])$/`, and that **at most one element in the chart carries a `bh-accent` token**.
  - The Soft and Swiss `lookRules.test.tsx` case lists gain one `[name, element]` per chart skin. If the Soft forbidden-token regex does not already reject Playful-only colours in `fill-`/`stroke-` form, add that.

- [ ] **Step 1: Write the failing tests**

```tsx
// BarChartPlayful.test.tsx  (data of four items so the colour cycle wraps)
it("is a figure named by its title with a data table", () => {
  /* getByRole("figure", { name: "Visits" }); getByRole("table", { name: "Visits" }) */
});
it("cycles the colours, each bar outlined in ink", () => {
  /* marks[0..3] classes: fill-bh-red, fill-bh-blue, fill-bh-yellow, fill-bh-red; every mark has stroke-bh-ink and stroke-2 */
});
it("takes a custom colour cycle", () => { /* colors={["navy","pink"]} -> fill-bh-navy, fill-bh-pink, fill-bh-navy, ... */ });
it("has the baseline but no gridlines", () => { /* [data-chart-baseline] 1, [data-chart-grid] 0 */ });
it("forwards className and ref", () => { /* ... */ });
// BarChartSoft.test.tsx
it("draws charcoal bars and one highlighted bar in the default blue tone, labelled", () => {
  /* highlight="Feb": bar 1 has fill-bh-blue, bar 0 fill-bh-charcoal; exactly one [data-chart-label] reading "40" */
});
it("uses the tone prop", () => { /* tone="red" -> fill-bh-red on the highlighted bar */ });
it("has no gridlines", () => { /* 0 */ });
// BarChartSwiss.test.tsx
it("draws ink bars and one accent bar", () => { /* all fill-bh-ink; with highlight, one fill-bh-accent and no text-bh-accent anywhere */ });
it("draws 1px rule gridlines and an ink baseline", () => { /* grid count == ticks, class stroke-bh-rule; baseline stroke-bh-ink */ });
// chartLookRules: cases for BarChartPlayful excluded (Playful has no lookRules file); Soft and Swiss cases appended to their lookRules.
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/playful/BarChartPlayful src/components/soft/BarChartSoft src/components/swiss/BarChartSwiss`.
- [ ] **Step 3: Implement** the three skins with stories (`BarChartPlayful`: `Default`, `CustomColors`, `HiddenTitle`; `BarChartSoft`: `Default`, `Highlight`, `ShowValues`; `BarChartSwiss`: `Default`, `Highlight`, `Negative`), `index.ts` files and exports (`BarChartPlayful`, `BarChartSoft`, `BarChartSwiss` and their props types) in the right `src/index.ts` sections. Also export `type ChartDatum` and `type ChartSeries` from `src/index.ts` (`export type { ... } from "./lib/chartTypes.js"`) in a `// Chart types` block after `// Swiss look`.
- [ ] **Step 4: Run, confirm PASS**, then `pnpm exec vitest run src/components/soft src/components/swiss` (lookRules) and `pnpm smoke:storybook` (the Task 3 `.fill-bh-ink` needle is now found; the Storybook a11y addon, `test: "error"`, reports no violations on the new stories).
- [ ] **Step 5: Commit**: `feat(charts): add BarChart skins for all three looks`

**PR boundary 4 (Task 6).**

---

### Task 7: `LineChartBase`

**Files:**
- Create: `src/components/_base/LineChart/{LineChartBase.tsx, LineChartBase.test.tsx}`

**Interfaces:**
- Consumes: as Task 5, plus `linePath`.
- Produces:
  - `type LineChartProps = CommonChartProps & ({ data: ChartDatum[]; series?: never } | { series: ChartSeries[]; data?: never }) & { highlight?: string }`. `data` is one series with id `"data"` and label `"Value"`. At most the first 3 series are used.
  - `type LineChartClasses = Pick<ChartLookClasses, "root" | "caption" | "plot" | "tooltip" | "tick" | "baseline" | "grid" | "valueLabel"> & { line: (seriesIndex: number) => string; casing: string; point: (seriesIndex: number, isHighlighted: boolean) => string }` (`casing` is a stroke class drawn under every line when not empty).
  - `type LineChartBaseProps = LineChartProps & { classes: LineChartClasses; gridlines: boolean }`.
  - DOM hooks: `path[data-chart-line]` (one per series, plus a casing path when `casing` is set), `[data-chart-mark]` points, `[data-chart-hit]` column hit areas, `[data-chart-grid]`, `[data-chart-baseline]`, `[data-chart-label]`.
  - Behaviour: categories are the labels of the first series, then labels only present in later series, in order of first appearance; a series point is looked up by label. Domain is `niceTicks(min, max)` over all finite values (**no forced zero**). A series with one point draws a dot and no line. Table headers are `["Label", ...series labels]`; a missing value is `"—"`. Tooltip: one series `` `${label}: ${v}` ``, several `` `${label}: ${s1} ${v1}, ${s2} ${v2}` `` (default `formatNumber`).

- [ ] **Step 1: Write the failing tests**

```tsx
it("draws a path through every point of a series", () => { /* 4 points: d starts with "M" and contains exactly 3 "L" */ });
it("caps the chart at three series", () => { /* 4 series passed: 3 [data-chart-line] (no casing), table has 4 columns (Label + 3) */ });
it("builds one table row per category with a column per series", () => {
  /* series Visits[Jan 10,Feb 20], Sales[Jan 5]: headers ["Label","Visits","Sales"], rows [["Jan","10","5"],["Feb","20","—"]] */
});
it("treats data as a single series labelled Value", () => { /* headers ["Label","Value"] */ });
it("does not force zero on the value axis", () => { /* values 100..120: first svg tick text "100", last "120" */ });
it("handles a single point, flat data, empty data and NaN without NaN in the markup", () => {
  /* one point: a dot, no "L"; [5,5,5]: a path; []: header-only table; NaN value: "—" in table; innerHTML never "NaN" */
});
it("draws a casing path under each line only when the skin gives one", () => { /* casing "stroke-bh-ink" -> 2 paths per series, casing first; "" -> 1 */ });
it("flags the highlighted point on the first series only", () => {
  /* classes.point spy: highlight="Feb" with 2 series -> point(0, true) called once, point(1, true) never; label printed "20" */
});
it("shows one tooltip per hovered category with every series value", async () => {
  /* hover hit[1] -> "Feb: Visits 20, Sales 8"; single series -> "Feb: 20"; unhover removes it */
});
it("thins crowded category labels but keeps every table row", () => { /* as Task 5 */ });
it("keeps the accessibility contract", () => { /* figure name, aria-hidden svg, nothing focusable */ });
it("forwards className and ref", () => { /* ... */ });
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/_base/LineChart`.
- [ ] **Step 3: Implement `LineChartBase(props: LineChartBaseProps)`** (`"use client"`; hovered category index state).
- [ ] **Step 4: Run, confirm PASS**, then `pnpm typecheck`.
- [ ] **Step 5: Commit**: `feat(charts): add LineChartBase with multi-series data table`

**PR boundary 5 (Task 7).**

---

### Task 8: `LineChartPlayful`, `LineChartSoft`, `LineChartSwiss`

**Files:**
- Create: `src/components/{playful/LineChartPlayful,soft/LineChartSoft,swiss/LineChartSwiss}/*`
- Modify: `src/components/swiss/chartLookRules.test.tsx`, `src/components/{soft,swiss}/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `LineChartBase`, `LineChartProps`; `CHART_CLASSES`; SVG class maps.
- Produces (all `"use client"`):
  - `LineChartPlayfulProps = DistributiveOmit<LineChartProps, "highlight"> & { colors?: FillColor[] }` (`DistributiveOmit` so the `data`/`series` union survives; define it privately). Series `i` strokes `SVG_STROKE_CLASSES[colors[i % n]]` over an `ink` casing; points are filled with the series colour and outlined in `ink`. Default colours `["red", "blue", "yellow"]`.
  - `LineChartSoftProps = LineChartProps & { tone?: SoftTone }` (default `"blue"`): Soft keeps the triad for meaning, so all series are `stroke-bh-charcoal` and are told apart without colour: series 0 solid, series 1 dashed (`[stroke-dasharray:6_4]`), series 2 dotted (`[stroke-dasharray:1_4]`); the highlighted point is in the tone, always labelled.
  - `LineChartSwissProps = LineChartProps`: series 0 `stroke-bh-ink`, 1 `stroke-bh-charcoal` dashed, 2 `stroke-bh-muted-text` dotted, 1px; highlighted point `fill-bh-accent`, labelled. `gridlines`.

- [ ] **Step 1: Write the failing tests**

```tsx
// Playful
it("colours each series and casts it in ink", () => { /* 3 series: line strokes stroke-bh-red, stroke-bh-blue, stroke-bh-yellow; each preceded by a stroke-bh-ink casing path */ });
it("takes a custom colour cycle and has no gridlines", () => { /* ... */ });
// Soft
it("tells series apart without colour and highlights one point in the tone", () => {
  /* line classes: no dash, a dashed class, a dotted class; highlight="Feb" -> first-series point has fill-bh-blue; label printed; tone="red" -> fill-bh-red */
});
// Swiss
it("uses ink, charcoal and muted-text lines and a single accent point", () => {
  /* line classes by series; with highlight exactly one element has a bh-accent token, on series 0 only */
});
// all three: figure name + table, className and ref forwarding, one-series `data` shorthand works.
// lookRules/chartLookRules: Swiss and Soft cases for single series, 3 series and a highlight.
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/playful/LineChartPlayful src/components/soft/LineChartSoft src/components/swiss/LineChartSwiss`.
- [ ] **Step 3: Implement** the skins, stories (`Default`, `ThreeSeries`, `Highlight` per look), `index.ts` files and exports.
- [ ] **Step 4: Run, confirm PASS**, then the Soft and Swiss lookRules files and `pnpm typecheck`.
- [ ] **Step 5: Commit**: `feat(charts): add LineChart skins for all three looks`

**PR boundary 6 (Task 8).**

---

### Task 9: `DonutChartBase`

**Files:**
- Create: `src/components/_base/DonutChart/{DonutChartBase.tsx, DonutChartBase.test.tsx}`

**Interfaces:**
- Consumes: as Task 5, plus `arcPath`, `pieAngles`, `groupSlices`, `polarPoint`.
- Produces:
  - `type DonutChartProps = CommonChartProps & { data: ChartDatum[]; highlight?: string; centerLabel?: string; centerCaption?: string }`.
  - `type DonutChartClasses = Pick<ChartLookClasses, "root" | "caption" | "plot" | "tooltip" | "valueLabel" | "centre" | "centreCaption" | "legend"> & { mark: (index: number, isHighlighted: boolean) => string; track: string }` (`track` is the empty-ring class used when the total is 0).
  - `type DonutChartBaseProps = DonutChartProps & { classes: DonutChartClasses; maxSlices: number }`.
  - DOM hooks: slices `path[data-chart-mark]` (also the hit area), `[data-chart-track]`, legend `li[data-chart-legend]`, centre `text[data-chart-centre]`.
  - Behaviour: negative and non-finite values count as 0 (table shows `—` for non-finite); data goes through `groupSlices(data, maxSlices)` and **the table lists exactly the slices drawn**, plus a footer `["Total", formatValue(total)]`. Ring radius is `min(width, height) / 2 - 4`, inner radius 62% of it. Centre shows `centerLabel ?? formatValue(total)` and `centerCaption` when set. Legend is `aria-hidden`; each entry shows the label, and the value only with `showValues`. Tooltip: `` `${label}: ${formatValue(value)}` `` on slice hover.

- [ ] **Step 1: Write the failing tests** (data Rent 40, Food 30, Fun 30)

```tsx
it("draws one slice per datum and lists the same values in the table", () => { /* 3 marks; rows [["Rent","40"],["Food","30"],["Fun","30"]]; footer ["Total","100"] */ });
it("groups past the limit into Other, in the table too", () => {
  /* 8 items, maxSlices 6: 6 marks; the last table row is "Other" with the summed value; maxSlices 3 -> 3 marks */
});
it("shows the total in the centre unless overridden", () => { /* "100"; centerLabel="€100" -> "€100"; centerCaption="Spent" renders */ });
it("draws an empty track and no slices when everything is zero", () => { /* 0 marks, 1 [data-chart-track], centre "0", no NaN */ });
it("draws a single full slice without collapsing", () => { /* [{A, 5}]: 1 mark whose d has 4 "A" commands, no NaN */ });
it("treats negative and non-finite values as zero", () => { /* [{A,-5},{B,5},{C,NaN}]: table "—" for C; B spans the ring; no NaN */ });
it("handles empty data", () => { /* no throw, header-only table, track drawn, centre "0" */ });
it("asks the skin for each slice class and flags the highlighted slice", () => { /* spy as in Task 5; highlight matching a grouped-away label flags nothing */ });
it("shows a tooltip on slice hover", async () => { /* hover marks[0] -> "Rent: 40" aria-hidden; unhover removes it */ });
it("renders an aria-hidden legend, with values only on request", () => { /* 3 legend items with labels; "40" absent from the legend by default, present with showValues */ });
it("keeps the accessibility contract", () => { /* figure name, aria-hidden svg, nothing focusable */ });
it("forwards className and ref", () => { /* ... */ });
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/_base/DonutChart`.
- [ ] **Step 3: Implement `DonutChartBase(props: DonutChartBaseProps)`** (`"use client"`).
- [ ] **Step 4: Run, confirm PASS**, then `pnpm typecheck`.
- [ ] **Step 5: Commit**: `feat(charts): add DonutChartBase with slice grouping and legend`

**PR boundary 7 (Task 9).**

---

### Task 10: `DonutChartPlayful`, `DonutChartSoft`, `DonutChartSwiss`

**Files:**
- Create: `src/components/{playful/DonutChartPlayful,soft/DonutChartSoft,swiss/DonutChartSwiss}/*`
- Modify: `src/components/swiss/chartLookRules.test.tsx`, `src/components/{soft,swiss}/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `DonutChartBase`, `DonutChartProps`; class maps; `SOFT_DONUT_TINTS`.
- Produces (all `"use client"`):
  - `DonutChartPlayfulProps = Omit<DonutChartProps, "highlight"> & { colors?: FillColor[] }`. `maxSlices={6}`. Slice `i` is `SVG_FILL_CLASSES[colors[i % n]]` + `stroke-bh-ink stroke-2`. Centre numeral in the display face, black weight.
  - `DonutChartSoftProps = DonutChartProps & { tone?: SoftTone }` (default `"blue"`). `maxSlices={6}`. Slice `i` is `SOFT_DONUT_TINTS[i % 3]` with a `stroke-bh-paper` gap; the highlighted slice `SOFT_TONE_SVG_FILL[tone]`.
  - `DonutChartSwissProps = DonutChartProps`. `maxSlices={3}`. Palette order `[ink, charcoal, accent]`; without highlight the slices use that order. With a highlight, the highlighted slice is `fill-bh-accent` and the others take `ink`, `charcoal` in order. Slices get a 2px `stroke-bh-paper-white` gap. Accent appears once.

- [ ] **Step 1: Write the failing tests**

```tsx
// Playful
it("cycles colours with ink outlines and allows six slices", () => { /* 6 data -> 6 marks r,b,y,r,b,y fills; every mark stroke-bh-ink stroke-2; 7 data -> 6 marks + "Other" row */ });
// Soft
it("uses charcoal tints, separated by paper gaps, and one toned slice", () => {
  /* marks fill-bh-charcoal, fill-bh-charcoal/80, fill-bh-charcoal/65, then repeats; highlight -> that slice fill-bh-blue; tone prop works */
});
// Swiss
it("limits to three slices and uses ink, charcoal and the accent only", () => {
  /* 5 data -> 3 marks, last row "Other"; no highlight: fill-bh-ink, fill-bh-charcoal, fill-bh-accent; highlight="B": B is fill-bh-accent, the rest ink then charcoal */
});
it("never has more than one accent element", () => { /* count of elements carrying bh-accent <= 1 in every case */ });
// all: figure name + table with Total footer, centre numeral shows the total, className and ref forwarding.
// lookRules/chartLookRules: Swiss and Soft cases for plain, highlighted and grouped donuts.
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/playful/DonutChartPlayful src/components/soft/DonutChartSoft src/components/swiss/DonutChartSwiss`.
- [ ] **Step 3: Implement** the skins, stories (`Default`, `Grouped`, `CenterLabel` per look), `index.ts` files and exports.
- [ ] **Step 4: Run, confirm PASS**, then the Soft and Swiss lookRules files and `pnpm typecheck`.
- [ ] **Step 5: Commit**: `feat(charts): add DonutChart skins for all three looks`

**PR boundary 8 (Task 10).**

---

### Task 11: `SparklineBase` and the three Sparkline skins

**Files:**
- Create: `src/components/_base/Sparkline/{SparklineBase.tsx, SparklineBase.test.tsx}`, `src/components/{playful/SparklinePlayful,soft/SparklineSoft,swiss/SparklineSwiss}/*`
- Modify: `src/components/swiss/chartLookRules.test.tsx`, `src/components/{soft,swiss}/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `ChartFrame`, `CommonChartProps`, `linePath`, `linearScale`; `CHART_CLASSES`; class maps.
- Produces:
  - `type SparklineProps = Pick<CommonChartProps, "title" | "hideTitle" | "height" | "formatValue" | "className" | "ref"> & { data: ChartDatum[]; highlight?: string }` (`height` default 32; no `showValues`, no tooltip, no axes).
  - `type SparklineClasses = Pick<ChartLookClasses, "root" | "caption" | "plot"> & { line: string; casing: string; dot: (isHighlighted: boolean) => string }`.
  - `SparklineBase(props: SparklineProps & { classes: SparklineClasses })` renders `path[data-chart-line]` (+ a casing path when `casing` is not empty) and one `[data-chart-mark]` dot at the highlighted point (default: the last). The domain is the data min/max padded by 2px; flat data sits on the vertical middle. Table headers `["Label", "Value"]`.
  - `SparklinePlayfulProps = Omit<SparklineProps, "highlight"> & { color?: FillColor }` (default `"red"`): `ink` line, dot `SVG_FILL_CLASSES[color]` + `stroke-bh-ink stroke-2`. `SparklineSoftProps = SparklineProps & { tone?: SoftTone }` (default `"blue"`): `charcoal` line, dot in the tone. `SparklineSwissProps = SparklineProps`: 1px `ink` line, dot `fill-bh-accent`.

- [ ] **Step 1: Write the failing tests**

```tsx
// SparklineBase.test.tsx
it("draws a line and an end dot, with the same values in a table", () => { /* 1 path, 1 mark, rows match */ });
it("puts the dot on the highlighted label and ignores unknown labels", () => { /* highlight="Feb" -> mark cx matches point 1; unknown -> falls back to the last point */ });
it("survives one point, flat data, empty data and NaN", () => {
  /* one point: dot and no "L"; [5,5,5]: every y in d is equal; []: no dot, header-only table; NaN: table "—"; innerHTML never contains "NaN" */
});
it("has no tooltip, axes or hit areas", () => { /* no [data-chart-hit], no svg text, hover shows nothing */ });
it("is 32px high by default and keeps the accessibility contract", () => { /* viewBox "0 0 320 32"; figure name; aria-hidden svg; nothing focusable */ });
// Skins: Playful default dot fill-bh-red + stroke-bh-ink, color="blue" -> fill-bh-blue; Soft dot fill-bh-blue, tone="red";
// Swiss dot fill-bh-accent and line stroke-bh-ink; each: figure name, className and ref forwarding. lookRules cases for Soft and Swiss.
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/_base/Sparkline src/components/playful/SparklinePlayful src/components/soft/SparklineSoft src/components/swiss/SparklineSwiss`.
- [ ] **Step 3: Implement** the base and skins (`"use client"`), stories (`Default`, `InText` showing it inline in a stat row) and exports.
- [ ] **Step 4: Run, confirm PASS**, then the Soft and Swiss lookRules files and `pnpm typecheck`.
- [ ] **Step 5: Commit**: `feat(charts): add Sparkline with all three looks`

**PR boundary 9 (Task 11).**

---

### Task 12: Release 0.7.0

**Files:**
- Modify: `package.json` (`version: "0.7.0"`), `src/index.ts` (`VERSION = "0.7.0"`), `src/smoke.test.ts`, `README.md`, `consumer-smoke/types/consumer.ts`, `src/components/{playful/PlayfulOverview,soft/SoftOverview,swiss/SwissOverview}.stories.tsx`

**Interfaces:**
- Consumes: every export from Tasks 1-11.

- [ ] **Step 1: Failing tests** (`src/smoke.test.ts`; change the existing `VERSION` assertion to `"0.7.0"`, the one sanctioned edit of an existing test, then add)

```ts
it.each(["BarChart", "LineChart", "DonutChart", "Sparkline"])("exports the three %s skins", (name) => {
  for (const look of ["Playful", "Soft", "Swiss"]) expect(typeof (lib as Record<string, unknown>)[`${name}${look}`]).toBe("function");
});
it("keeps the chart math internal", () => {
  for (const internal of ["niceTicks", "linearScale", "bandLayout", "arcPath", "linePath", "pieAngles", "groupSlices", "ChartFrame"])
    expect(lib).not.toHaveProperty(internal);
});
```

  Also append to `consumer-smoke/types/consumer.ts`: `import type { ChartDatum, ChartSeries }`, `const datum: ChartDatum = { label: "Jan", value: 1 }`, `const series: ChartSeries = { id: "a", label: "A", data: [datum] }`, `// @ts-expect-error value must be a number` on a bad datum, and export them (so `pnpm smoke` proves both types resolve under `nodenext`).

- [ ] **Step 2:** Run `pnpm exec vitest run src/smoke.test.ts`. Expected: FAIL on the version (the chart exports already pass).
- [ ] **Step 3: Implement the release changes**
  - Bump `package.json` and `VERSION`.
  - **README:** add 12 rows to the Components table (one line each, mirroring the existing rows). Add a "### Charts" section: hand-drawn SVG, no extra dependency; every chart is a `<figure>` with a required `title` (`hideTitle` hides it visually), a visually hidden data table and an `aria-hidden` SVG; values come from the hover tooltip, the table or `showValues`; `highlight` takes a label; Playful `colors`, Soft `tone`; donut at most 6 slices (Swiss 3), the rest "Other"; `LineChart` up to 3 series; the chart fills its container's width, so give the parent a width; consumers must let Tailwind scan the package (the existing `@source` line) so `fill-bh-*` and `stroke-bh-*` exist.
  - **Overview stories:** each look's overview gains a "Charts" `Section` with one `BarChart` (with a highlight), one `LineChart` (2 series), one `DonutChart` (centre label) and a `Sparkline` inside a `StatColumns`/`BigNumber` row, using that look's background parameter. If `0.5`/`0.6` already added a dashboard composition (spec §6.7), put the charts there instead of a separate section.
- [ ] **Step 4: Full gate.** Run: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`. Expected: all pass; the Storybook a11y addon (`test: "error"`) reports no violations on any chart story or overview.
- [ ] **Step 5: Commit**: `chore(release): 0.7.0` (matching `3ba4d81`: `package.json`, `src/index.ts`, `src/smoke.test.ts`, `README.md`, plus the story and consumer-types files above).

**PR boundary 10 (Task 12).**

---

## Self-review

- **Spec coverage:** §6.5 (SVG, `chart.ts`, data, highlight, a11y, values, sizing, axes, donut) by Tasks 1-11; §6.1 chart-mark and non-text contrast row by Tasks 3, 6, 8, 10, 11; §6.6 structure by the base/skin split; §6.7 chart tests by Tasks 1-2 (math), 4-11 (hidden table, figure name, no focusables replacing the contradictory arrow-key test), skin tests per skin, palette tests in Task 3, stories and overview in Tasks 6-12; §6.8 by `palette.ts`/`chartClasses.ts` and no HEX in components; §6.9 by exports and the type-only `chartTypes.ts`; §8 (`0.7`: `lib/chart.ts`, 4 bases, 12 skins) by 12 tasks and the release.
- **Step scan:** every code step names its signature and file; bodies appear only for `niceTicks`, `arcPath`, `pieAngles` and `groupSlices`, whose tests do not fix the behaviour alone.
- **Type consistency:** `CommonChartProps`, `ChartLookClasses`, `ChartTable`, `ChartTooltipState` (Tasks 3-4) are the only shared shapes; each base's `*Classes` picks from `ChartLookClasses`; the `mark(index, isHighlighted)` signature is identical in Bar and Donut; `Sparkline` uses `dot(isHighlighted)` and Line uses `point(seriesIndex, isHighlighted)`, as declared in their tasks. `data-chart-*` hooks are defined in Tasks 5, 7, 9, 11 and used only by their own tests.
- **Review Focus coverage:** empty/degenerate data (Tasks 1, 2, 5, 7, 9, 11), non-finite and negative (2, 5, 9), float noise (1), crowded axes (2, 5, 7), Swiss accent and colour leaks (`chartLookRules`, 6, 8, 10), accessibility regressions (4 and each base).
- **Proportion:** about 480 lines for a 12-task plan against a 250-line spec section; code blocks are tests and signatures, not component bodies.
