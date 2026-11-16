# bauhaus-react 0.3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `0.3.0`, which adds all 16 Soft skins (the scheduling-app look) on top of the bases from `0.2`.

**Architecture:** Every Soft component is a thin skin in `src/components/soft/<Name>Soft/`.
- It owns static class maps and its own `tone?: SoftTone` prop where the spec gives it one.
- It passes everything else to the existing internal base in `src/components/_base/<Name>/`.
- Only one base changes: `AudioPlayerBase` gains an optional `renderTime` prop. Every other Soft need fits the existing slots (checked against spec §6.1 and §6.2 before this plan was written).

**Tech Stack:** React 19.3, TypeScript 7, Tailwind CSS 4.3 (`@theme static`), Vite 8 lib mode, Vitest 5 + jsdom + Testing Library + user-event, Storybook 10, `react-aria-components`, `@internationalized/date`, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-16-bauhaus-react-full-catalogue-design.md`. Release `0.3` is defined in its §8. The Soft column of §6.1 and the "How the looks differ" column of §6.2 are the design source for every skin. The 0.2 plan (`docs/superpowers/plans/2026-11-16-bauhaus-react-0.2.md`) defines the bases this plan consumes.

## Global Constraints

**Soft look rules** (spec §6.1, verbatim intent)
- **Ground:** `paper`. **Surfaces:** `paper`, `charcoal` (with `paper` text), `sand` (with `ink` text).
- **Colour:** the triad (`red`, `yellow`, `blue`) is used **only to encode meaning** (status, category, step), through `tone: SoftTone`, resolved with `SOFT_TONE_CLASSES` from `src/lib/palette.ts`.
- **Radius:** `rounded-bh-soft` (20px) on panels and cards; `rounded-full` on pills, chips and circular buttons. No sharp corners on panels.
- **Borders:** none. Separation comes from tonal fills. **No `border-*` utilities in any Soft skin.**
- **Depth:** no shadows, no lift, no translate. **Never** use `shadow-bh-hard`, `HOVER_LIFT` or `PRESS`.
- **Type:** `font-bh-display`, `font-light` or `font-normal` weights. Big numerals are heroes. Labels may be uppercase only where the base says so (`Tag`).
- **Hover/active:** tonal step via `SOFT_HOVER_CLASSES` (Task 1). No movement.
- **Motion:** `motion-safe:transition-colors` (or the base's own transforms) with `duration-200 ease-out`.

**Shared by every look**
- Every interactive element gets `FOCUS_RING` from `src/lib/styles.ts`. React Aria elements that hide the outline must also carry `data-[focus-visible]:outline-solid` (the Tailwind 4.3 bug guarded by `src/components/playful/focusRing.test.tsx`).
- Disabled: `cursor-not-allowed opacity-50` (same strings the Playful skins use).
- **Static class literals only.** Never interpolate a class name. `pnpm smoke` fails on `bh-${`.
- Yellow is never a text colour.

**Component conventions** (unchanged from 0.2)
- Folder: `src/components/soft/<Name>Soft/{<Name>Soft.tsx, <Name>Soft.test.tsx, <Name>Soft.stories.tsx, index.ts}`. `index.ts` re-exports with `.js` suffixes; tests import without a suffix.
- Story titles: `Soft/<Name>Soft`. Stories set `parameters.backgrounds.default: "paper"`.
- Skin props are the base props minus `classes`, plus `tone` where listed. A skin restates its props only where the matching Playful skin does (Button, IconButton, Tag, ProjectCard, TopBar, Footer); otherwise it aliases `Omit<<Name>BaseProps, "classes">`.
- `ref` is a regular prop; `className` merges last into `root` via the base.
- A skin starts with `"use client"` only if its base does (AudioPlayer, Carousel, DateStrip, MenuOverlay, Tabs).
- Each task adds its exports to `src/index.ts` under a new `// Soft look` section placed after `// Playful look`.
- `_base` is never exported.

**Process**
- Strict TDD: failing test first.
- Skin tests (spec §6.7): role and accessible name, `className` forwarding, `ref` forwarding, and the skin-only prop (`tone`). Class assertions are allowed only where this plan states them.
- **Every existing test (v1, 0.2 bases, Playful skins) passes unchanged.** If a base change would need a Playful test edited, stop and ask the author.
- Commits: conventional commits, **no AI attribution, no Co-Authored-By lines.**

**Test commands**
- One file: `pnpm exec vitest run <path>`
- Full gate: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`

## Plan's calls (author to confirm while reading)

1. **Soft tonal hover for `red` steps lighter, not darker.** Darkening red by 10% toward ink drops red/ink text contrast from 4.86 to 4.12, which fails AA. Mixing 10% toward paper gives 5.35. Every other tone steps 10% darker (yellow 8.62, blue 5.70, neutral 8.91, sand 10.43, paper 13.42 against their text colours). The hover is a `color-mix(in srgb, …)` arbitrary value, so no token is added mid-matrix (spec §8).
2. **`ButtonSoft` and `IconButtonSoft` `outline` variant is a `sand` fill**, not a border, because Soft has no borders (§6.1). The variant name stays `outline` so every look shares one API.
3. **`TextLinkSoft` `arrow` defaults to `"right"`** so the arrow the spec requires is always shown; consumers can pick another glyph.
4. **`BottomNavSoft`**: a `charcoal` bar with inactive links in `muted` (4.6:1 on charcoal), the current link in `paper`, plus a `tone` dot. `tone` excludes `neutral` (a charcoal dot on a charcoal bar is invisible). The dot is supplementary; the paper-vs-muted colour is what carries the state.
5. **`MenuOverlaySoft`** separates links with spacing and a tonal hover fill instead of rules, because Soft has no borders. The current link is a `charcoal` pill.
6. **Default tones:** `ButtonSoft` `color` variant → `blue`; `TagSoft` → `neutral`; `StackCardSoft` → `red`; `ProjectCardSoft` → `blue`; `BottomNavSoft` → `yellow`.
7. **Outfit 300** is added to the Storybook preview, because Soft uses `font-light`. The README documents loading it.

## Review Focus

1. **Tonal hover keeps text readable.** Hovering any Soft fill keeps its text at ≥ 4.5:1. Pinned by the `SOFT_HOVER_CLASSES` contrast tests (Task 1).
2. **Tailwind actually generates the `color-mix` hover classes.** An arbitrary value Tailwind can't type as a colour silently produces no CSS. Pinned by a `smoke:storybook` needle (Task 1).
3. **AudioPlayerSoft before metadata loads.** The big elapsed numeral reads `0:00` and the total reads `--:--`, never `NaN:NaN`. Pinned in Task 9.
4. **Look rules don't leak.** No Soft skin emits `shadow-bh-hard`, a `border-` width utility, a `translate` hover or `text-bh-yellow`. Pinned by `src/components/soft/lookRules.test.tsx` (created in Task 2, extended by each later task).
5. **Focus stays visible on React Aria Soft widgets** (Tabs, DateStrip, MenuOverlay trigger and close). Pinned by `src/components/soft/focusRing.test.tsx` (Tasks 6 and 7).

---

## File map

```txt
src/lib/palette.ts, palette.test.ts                 M  SOFT_HOVER_CLASSES (Task 1)
.storybook/preview.css, consumer-smoke/check-storybook.mjs   M  Outfit 300, color-mix needle (Task 1)
src/components/_base/AudioPlayer/AudioPlayerBase.tsx (+ .test.tsx)  M  renderTime (Task 9)
src/components/soft/<Name>Soft/…                    C  16 skins
src/components/soft/lookRules.test.tsx              C  (Task 2, extended by Tasks 3–9)
src/components/soft/focusRing.test.tsx              C  (Task 6, extended by Task 7)
src/components/soft/SoftOverview.stories.tsx        C  (Task 10)
src/index.ts, src/smoke.test.ts, package.json, README.md   M  (each task / Task 10)
```

Task order: hover tokens → actions → labels → cards → bars → overlay → React Aria widgets → carousel (needs `IconButtonSoft`) → audio → release.

---

### Task 1: `SOFT_HOVER_CLASSES`, Outfit 300, `color-mix` smoke needle

**Files:**
- Modify: `src/lib/palette.ts`, `src/lib/palette.test.ts`, `.storybook/preview.css`, `consumer-smoke/check-storybook.mjs`, `src/index.ts`

**Interfaces:**
- Produces: `SOFT_HOVER_CLASSES: Record<SoftTone | "sand" | "paper", string>` in `palette.ts`, exported from `src/index.ts` next to the other Soft palette items. Exact values:

| Key | Class |
|---|---|
| `red` | `hover:bg-[color-mix(in_srgb,var(--color-bh-red)_90%,var(--color-bh-paper))]` |
| `yellow` | `hover:bg-[color-mix(in_srgb,var(--color-bh-yellow)_90%,var(--color-bh-ink))]` |
| `blue` | `hover:bg-[color-mix(in_srgb,var(--color-bh-blue)_90%,var(--color-bh-ink))]` |
| `neutral` | `hover:bg-[color-mix(in_srgb,var(--color-bh-charcoal)_90%,var(--color-bh-ink))]` |
| `sand` | `hover:bg-[color-mix(in_srgb,var(--color-bh-sand)_90%,var(--color-bh-ink))]` |
| `paper` | `hover:bg-[color-mix(in_srgb,var(--color-bh-paper)_90%,var(--color-bh-ink))]` |

- React Aria skins (Tabs, DateStrip) need the same colours under `data-[hovered]:`; they write those literals themselves with the same mix values.

- [ ] **Step 1: Write the failing tests** (append to `palette.test.ts`)

```ts
const mixSrgb = (a: string, b: string, p: number) => {
  const ch = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [ch(a), ch(b)];
  return "#" + x.map((v, i) => Math.round(v * p + y[i] * (1 - p)).toString(16).padStart(2, "0")).join("");
};
const hover = {
  red: [SOFT_HEX.red, HEX.paper, HEX.ink], yellow: [SOFT_HEX.yellow, HEX.ink, HEX.ink],
  blue: [SOFT_HEX.blue, HEX.ink, HEX.paper], neutral: [SOFT_HEX.neutral, HEX.ink, HEX.paper],
  sand: [SOFT_HEX.sand, HEX.ink, HEX.ink], paper: [HEX.paper, HEX.ink, HEX.ink],
} as const; // [fill, mixed toward, text]
it.each(Object.entries(hover))("soft hover %s keeps text at 4.5:1", (_k, [fill, toward, text]) => {
  expect(contrast(mixSrgb(fill, toward, 0.9), text)).toBeGreaterThanOrEqual(4.5);
});
it("soft hover classes mix 10% toward the stated colour", () => {
  expect(SOFT_HOVER_CLASSES.red).toBe("hover:bg-[color-mix(in_srgb,var(--color-bh-red)_90%,var(--color-bh-paper))]");
  expect(SOFT_HOVER_CLASSES.neutral).toBe("hover:bg-[color-mix(in_srgb,var(--color-bh-charcoal)_90%,var(--color-bh-ink))]");
  expect(Object.keys(SOFT_HOVER_CLASSES).sort()).toEqual(["blue", "neutral", "paper", "red", "sand", "yellow"]);
});
```

- [ ] **Step 2: Run them and confirm they fail**

Run: `pnpm exec vitest run src/lib/palette.test.ts`
Expected: FAIL, `SOFT_HOVER_CLASSES` is undefined.

- [ ] **Step 3: Implement**
  - Add `SOFT_HOVER_CLASSES` with the exact values above, and export it from `src/index.ts`.
  - In `.storybook/preview.css`, add `@import "@fontsource/outfit/300.css";` next to the existing Outfit imports.
  - In `consumer-smoke/check-storybook.mjs`, append `["color-mix(in srgb", true]` to `checks`. No story uses the class until Task 2, so `pnpm smoke:storybook` fails until then; that is expected. Say so in the commit body.

- [ ] **Step 4: Run and confirm they pass**

Run: `pnpm exec vitest run src/lib`
Expected: PASS.

- [ ] **Step 5: Commit**: `feat(tokens): add soft tonal hover classes`

---

### Task 2: `ButtonSoft` and `IconButtonSoft`

**Files:**
- Create: `src/components/soft/{ButtonSoft,IconButtonSoft}/*`, `src/components/soft/lookRules.test.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `ButtonBase`, `ButtonBaseProps`; `IconButtonBase`; `SOFT_TONE_CLASSES`, `SOFT_HOVER_CLASSES`, `SoftTone`; `FOCUS_RING`.
- Produces:
  - `type ButtonSoftVariant = "solid" | "outline" | "color"`, `type ButtonSoftSize = "sm" | "md" | "lg"`.
  - `ButtonSoftProps`: the same union shape as `ButtonPlayfulProps` (as-button | as-link), with `variant?` (default `"solid"`), `size?` (default `"md"`), `tone?: SoftTone` (default `"blue"`, used only by `color`) in place of `color`.
  - `type IconButtonSoftSize = "sm" | "md" | "lg"` (`lg` is the FAB). `IconButtonSoftProps`: same shape as `IconButtonPlayfulProps` with `variant?: "solid" | "outline"`.
  - Variant classes (both components, `rounded-full`, no border, no shadow):
    - `solid`: `bg-bh-charcoal text-bh-paper` + `SOFT_HOVER_CLASSES.neutral`
    - `outline`: `bg-bh-sand text-bh-ink` + `SOFT_HOVER_CLASSES.sand`
    - `color` (Button only): `SOFT_TONE_CLASSES[tone]` + `SOFT_HOVER_CLASSES[tone]`
  - Type: `font-bh-display font-normal`, sentence case (no `uppercase`).
  - `lookRules.test.tsx`: exports nothing; holds `const cases: [string, ReactElement][]` and one `it.each(cases)` that renders each element, splits every element's `className` into tokens, strips variant prefixes (`token.split(":").pop()`), and asserts no token matches `/^(border(-[xytrbl])?(-\d+)?|shadow-bh-hard.*|-?translate-.*|text-bh-yellow)$/`.

- [ ] **Step 1: Write the failing tests**

```tsx
// ButtonSoft.test.tsx
it("renders a button with its name", () => { render(<ButtonSoft>Book</ButtonSoft>); expect(screen.getByRole("button", { name: "Book" })).toBeInTheDocument(); });
it("color variant uses the tone pair", () => {
  render(<ButtonSoft variant="color" tone="red">Cancel</ButtonSoft>);
  expect(screen.getByRole("button")).toHaveClass("bg-bh-red", "text-bh-ink", "rounded-full");
});
it("outline variant is a sand fill without a border", () => {
  render(<ButtonSoft variant="outline">Later</ButtonSoft>);
  expect(screen.getByRole("button")).toHaveClass("bg-bh-sand");
  expect(screen.getByRole("button").className).not.toMatch(/border/);
});
it("renders a link with href and forwards className and ref", () => { /* href → role link; className merged; createRef → HTMLAnchorElement */ });
// IconButtonSoft.test.tsx: name from aria-label; size lg renders; href → link; className; ref.
// lookRules.test.tsx: cases ButtonSoft × 3 variants, IconButtonSoft × 2 variants.
```

- [ ] **Step 2: Run, confirm FAIL** (`pnpm exec vitest run src/components/soft`): modules not found.
- [ ] **Step 3: Implement** both skins, stories (`Soft/ButtonSoft`: `Solid`, `Outline`, `Tones`, `AsLink`, `Disabled`, `Sizes`; `Soft/IconButtonSoft`: `Solid`, `Outline`, `Fab`), `index.ts` files and exports.
- [ ] **Step 4: Run, confirm PASS**, then `pnpm smoke:storybook`: the `color-mix(in srgb` needle from Task 1 is now `ok`.
- [ ] **Step 5: Commit**: `feat(soft): add ButtonSoft and IconButtonSoft`

---

### Task 3: `TextLinkSoft`, `TagSoft`, `ChipSoft`

**Files:**
- Create: `src/components/soft/{TextLinkSoft,TagSoft,ChipSoft}/*`
- Modify: `src/components/soft/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `TextLinkBase`, `TextLinkBaseProps`, `TextLinkArrow`; `TagBase`; `ChipBase`, `ChipBaseProps`.
- Produces:
  - `TextLinkSoftProps = Omit<TextLinkBaseProps, "classes">`; `arrow` defaults to `"right"`. No underline (`no-underline`), `font-bh-display`, hover is a colour step (`hover:text-bh-charcoal`), no movement.
  - `TagSoftProps = ComponentProps<"span"> & { tone?: SoftTone }` (default `"neutral"`). `rounded-full` pill, `SOFT_TONE_CLASSES[tone]`, uppercase micro label (base behaviour).
  - `ChipSoftProps = Omit<ChipBaseProps, "classes">`. `rounded-full bg-bh-ink text-bh-paper` (spec: ink pill, as in Mobile).

- [ ] **Step 1: Failing tests**
  - `TextLinkSoft`: `render(<TextLinkSoft href="/x">See times</TextLinkSoft>)` → `getByRole("link", { name: "See times" })`, and the container contains an `aria-hidden` element with text `→` (default arrow). `arrow="down"` shows `↓`. `className` and `ref` forwarding.
  - `TagSoft`: default has `bg-bh-charcoal text-bh-paper rounded-full`; `tone="yellow"` has `bg-bh-yellow text-bh-ink`. `className`, `ref`.
  - `ChipSoft`: the pill has `bg-bh-ink rounded-full`; the icon wrapper is `aria-hidden`; `className`, `ref`.
  - `lookRules`: add one case per component (TagSoft once per tone).
- [ ] **Steps 2–4:** Fail, implement with stories (`Soft/TextLinkSoft`, `Soft/TagSoft` with a `Tones` story, `Soft/ChipSoft`) and exports, pass.
- [ ] **Step 5: Commit**: `feat(soft): add TextLinkSoft, TagSoft and ChipSoft`

---

### Task 4: `CardSoft`, `StackCardSoft`, `ProjectCardSoft`

**Files:**
- Create: `src/components/soft/{CardSoft,StackCardSoft,ProjectCardSoft}/*`
- Modify: `src/components/soft/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `CardBase`, `CardBaseProps`; `StackCardBase`, `StackCardBaseProps`; `ProjectCardBase`; `TagSoft` (Task 3).
- Produces:
  - `CardSoftProps = Omit<CardBaseProps, "classes">`. Root: `rounded-bh-soft bg-bh-charcoal text-bh-paper`. With `href`, add `SOFT_HOVER_CLASSES.neutral` and `FOCUS_RING`.
  - `StackCardSoftProps = Omit<StackCardBaseProps, "classes"> & { tone?: SoftTone }` (default `"red"`). Root: `flex overflow-hidden rounded-bh-soft bg-bh-sand text-bh-ink`. Spine: `w-2 self-stretch` + `SOFT_TONE_CLASSES[tone]`.
  - `ProjectCardSoftProps`: restates `ProjectCardPlayfulProps` with `tone?: SoftTone` (default `"blue"`) in place of `color`, and `tag?: { label: string; tone?: SoftTone }` rendered as `TagSoft` (default tone `neutral`).
    - Root: `flex flex-col overflow-hidden rounded-bh-soft bg-bh-sand text-bh-ink` + `SOFT_HOVER_CLASSES.sand` + `FOCUS_RING`.
    - `initial` slot is the **tone header block**: full-width, `SOFT_TONE_CLASSES[tone]`, big `font-light` initial.
    - `media` slot: `grayscale` (B/W media, Mobile room cards).

- [ ] **Step 1: Failing tests**
  - `CardSoft`: `<article>` without `href`; with `href` it is one link containing header and body text; root has `rounded-bh-soft bg-bh-charcoal`; `className`, `ref`.
  - `StackCardSoft`: `tone="blue"` → the `aria-hidden` spine has `bg-bh-blue`; default spine has `bg-bh-red`; the action renders; `className`, `ref`.
  - `ProjectCardSoft`: `getByRole("link", { name: "Room A" })` (name from the title via `aria-labelledby`); the header block containing the initial has `bg-bh-yellow` when `tone="yellow"`; `tag={{ label: "Free" }}` renders text `Free`; `className`, `ref`.
  - `lookRules`: one case per component, `CardSoft` with and without `href`.
- [ ] **Steps 2–4:** Fail, implement with stories and exports, pass.
- [ ] **Step 5: Commit**: `feat(soft): add CardSoft, StackCardSoft and ProjectCardSoft`

---

### Task 5: `TopBarSoft`, `FooterSoft`, `BottomNavSoft`

**Files:**
- Create: `src/components/soft/{TopBarSoft,FooterSoft,BottomNavSoft}/*`
- Modify: `src/components/soft/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `TopBarBase`, `FooterBase`, `BottomNavBase`, `BottomNavBaseProps`, `BottomNavItem`.
- Produces:
  - `TopBarSoftProps`: same as `TopBarPlayfulProps`. Root: `rounded-b-bh-soft bg-bh-sand text-bh-ink`, cells separated by gap, **no rules**.
  - `FooterSoftProps`: same as `FooterPlayfulProps`. Root: `rounded-t-bh-soft bg-bh-charcoal text-bh-paper`. Columns use a static `MD_COLS` array (as in `FooterPlayful`), no `GRID_RULED`.
  - `BottomNavSoftProps = Omit<BottomNavBaseProps, "classes"> & { tone?: Exclude<SoftTone, "neutral"> }` (default `"yellow"`).
    - Root: `rounded-full bg-bh-charcoal`. Link: `text-bh-muted aria-[current=page]:text-bh-paper` + `FOCUS_RING`.
    - Dot: a static map `DOT_CLASSES: Record<Exclude<SoftTone, "neutral">, string>` of `aria-[current=page]:after:bg-bh-<tone>` plus shared `after:` geometry (`after:size-1.5 after:rounded-full after:content-['']`, shown only when current).

- [ ] **Step 1: Failing tests**
  - `TopBarSoft`: `getByRole("banner")`; brand, meta and action render; root has `rounded-b-bh-soft`; `className`, `ref`.
  - `FooterSoft`: `getByRole("contentinfo")`; one column element per `columns` entry; `bottom` renders; `className`, `ref`.
  - `BottomNavSoft`: `getByRole("navigation", { name: "Main" })`; only the current link has `aria-current="page"`; `tone="blue"` → the current link has class `aria-[current=page]:after:bg-bh-blue`; `className`, `ref`.
  - `lookRules`: one case per component.
- [ ] **Steps 2–4:** Fail, implement with stories and exports, pass.
- [ ] **Step 5: Commit**: `feat(soft): add TopBarSoft, FooterSoft and BottomNavSoft`

---

### Task 6: `MenuOverlaySoft`

**Files:**
- Create: `src/components/soft/MenuOverlaySoft/*`, `src/components/soft/focusRing.test.tsx`
- Modify: `src/components/soft/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `MenuOverlayBase`, `MenuOverlayBaseProps`, `MenuLink`.
- Produces:
  - `"use client"`. `MenuOverlaySoftProps = Omit<MenuOverlayBaseProps, "classes">`.
  - Classes:
    - `trigger`: `rounded-full bg-bh-charcoal text-bh-paper` + `SOFT_HOVER_CLASSES.neutral`.
    - `overlay`: solid `bg-bh-paper`, no backdrop blur.
    - `panel`: `rounded-bh-soft bg-bh-sand text-bh-ink`.
    - `link`: large `font-bh-display font-light`, `rounded-bh-soft`, `SOFT_HOVER_CLASSES.sand`, `aria-[current=page]:bg-bh-charcoal aria-[current=page]:text-bh-paper`. Items separated by `gap`, **no rules**.
    - `trigger`, `close` and `link` carry `FOCUS_RING` plus `data-[focus-visible]:outline-solid` (React Aria buttons).
  - `focusRing.test.tsx` (Soft): copy the `killsFocusRing(el)` helper from `src/components/playful/focusRing.test.tsx` (do not import from a test file). Assert it is `false` for the `MenuOverlaySoft` trigger and, after opening, the close button.

- [ ] **Step 1: Failing tests**
  - Opens a dialog named by `title` from the trigger; the current link has `aria-current="page"`; `className` lands on the trigger.
  - Escape closes and focus returns to the trigger.
  - The panel has `rounded-bh-soft`; no element inside the dialog has a class containing `backdrop-blur`.
  - `focusRing.test.tsx` as above; `lookRules`: one case (render opened with `defaultOpen`).
- [ ] **Steps 2–4:** Fail, implement with a story (`Soft/MenuOverlaySoft`) and exports, pass.
- [ ] **Step 5: Commit**: `feat(soft): add MenuOverlaySoft on React Aria dialog`

---

### Task 7: `TabsSoft` and `DateStripSoft`

**Files:**
- Create: `src/components/soft/{TabsSoft,DateStripSoft}/*`
- Modify: `src/components/soft/focusRing.test.tsx`, `src/components/soft/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `TabsBase`, `TabsBaseProps`, `TabItem`; `DateStripBase`, `DateStripBaseProps`; `CalendarDate` from `@internationalized/date`.
- Produces:
  - Both `"use client"`, both aliases of `Omit<<Name>BaseProps, "classes">`.
  - `TabsSoft` (tonal segmented control): `list` is `inline-flex rounded-full bg-bh-sand p-1`; `tab` is `rounded-full` with `data-[selected]:bg-bh-charcoal data-[selected]:text-bh-paper` and a `data-[hovered]:` tonal step written with the sand mix from Task 1; `tab` and `panel` carry `FOCUS_RING` and `data-[focus-visible]:outline-solid`.
  - `DateStripSoft`: `day` is a `rounded-bh-soft` tile, `data-[selected]:bg-bh-charcoal data-[selected]:text-bh-paper`, `data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50`; `number` is big `font-light` (the hero numeral); `weekday` is small.

- [ ] **Step 1: Failing tests**
  - `TabsSoft`: `getByRole("tablist", { name })`; ArrowRight moves selection to the next tab and shows its panel; `onSelectionChange` is called with the new id; `className` lands on the root.
  - `DateStripSoft`: `getByRole("radiogroup", { name })`; clicking a day calls `onChange` with that `CalendarDate`; the selected radio is checked; days before `minValue` are disabled; `className` on the root.
  - Extend `focusRing.test.tsx`: `killsFocusRing` is `false` for each `TabsSoft` tab and its panel, and for each `DateStripSoft` day element.
  - `lookRules`: one case each.
- [ ] **Steps 2–4:** Fail, implement with stories (`Soft/TabsSoft`, `Soft/DateStripSoft` including a month-boundary story starting `2026-12-29`) and exports, pass.
- [ ] **Step 5: Commit**: `feat(soft): add TabsSoft and DateStripSoft`

---

### Task 8: `CarouselSoft`

**Files:**
- Create: `src/components/soft/CarouselSoft/*`
- Modify: `src/components/soft/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `CarouselBase`, `CarouselBaseProps`, `CarouselButtonProps`; `IconButtonSoft` (Task 2).
- Produces:
  - `"use client"`. `CarouselSoftProps = Omit<CarouselBaseProps, "classes" | "renderButton">`.
  - `renderButton` renders `IconButtonSoft` `variant="solid"` `size="md"` with `←` / `→`, passing `label` as `aria-label`, `disabled` and `onClick`.
  - `slide`: `overflow-hidden rounded-bh-soft`. The base's built-in pager (`IndexCounter` + `ProgressRule`) and its `duration-200` slide transition are kept; they already meet the Soft motion rule.

- [ ] **Step 1: Failing tests**
  - `getByRole("region", { name })` with `aria-roledescription="carousel"`; "Next slide" advances and the live region reads `Slide 2 of 3`; with one slide both buttons are disabled; `className` on the root.
  - `lookRules`: one case.
- [ ] **Steps 2–4:** Fail, implement with a story and exports, pass.
- [ ] **Step 5: Commit**: `feat(soft): add CarouselSoft`

---

### Task 9: `renderTime` on `AudioPlayerBase`, and `AudioPlayerSoft`

**Files:**
- Modify: `src/components/_base/AudioPlayer/AudioPlayerBase.tsx`, `src/components/_base/AudioPlayer/AudioPlayerBase.test.tsx` (append only)
- Create: `src/components/soft/AudioPlayerSoft/*`
- Modify: `src/components/soft/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `AudioPlayerBase`, `AudioPlayerBaseProps`, `formatTime` from `src/lib/time.ts`.
- Produces:
  - **Base change:** `AudioPlayerBaseProps` gains `renderTime?: (t: { elapsed: string; total: string }) => ReactNode`. Both strings come from `formatTime`. When set, its output replaces the text inside the `time` span; when unset, the span keeps its current `"elapsed / total"` string, so existing tests and `AudioPlayerPlayful` are unchanged.
  - `"use client"`. `AudioPlayerSoftProps = Omit<AudioPlayerBaseProps, "classes" | "renderTime">`.
  - Classes: `root` is `rounded-bh-soft bg-bh-charcoal text-bh-paper`; `play` is a `rounded-full bg-bh-paper text-bh-ink` circle with `SOFT_HOVER_CLASSES.paper` and `FOCUS_RING`; `track` is `rounded-full bg-bh-muted`; `thumb` is a `rounded-full bg-bh-paper` dot with `data-[focus-visible]:outline-solid` and `FOCUS_RING`.
  - `renderTime` renders the **big elapsed numeral** (`text-6xl font-light tabular-nums`) followed by a small `/ {total}`.

- [ ] **Step 1: Failing tests**

```tsx
// AudioPlayerBase.test.tsx (append)
it("renderTime receives formatted elapsed and total", () => {
  render(<AudioPlayerBase classes={a} src="/a.mp3" title="Intro" renderTime={({ elapsed, total }) => <><b>{elapsed}</b><i>{total}</i></>} />);
  expect(screen.getByText("0:00").tagName).toBe("B");
  expect(screen.getByText("--:--").tagName).toBe("I");
});
// AudioPlayerSoft.test.tsx
it("shows a big elapsed numeral and the total before metadata loads", () => {
  render(<AudioPlayerSoft src="/a.mp3" title="Intro" />);
  expect(screen.getByText("0:00")).toHaveClass("text-6xl");
  expect(screen.getByText(/--:--/)).toBeInTheDocument();
  expect(document.body.textContent).not.toMatch(/NaN/);
});
// plus: play button named "Play Intro"; slider named "Seek"; className on the root; ref → HTMLAudioElement.
```

- [ ] **Step 2:** Run `pnpm exec vitest run src/components/_base/AudioPlayer src/components/soft/AudioPlayerSoft`. Expected: FAIL.
- [ ] **Step 3:** Implement the base prop and the skin, with a story and exports. `lookRules`: one case.
- [ ] **Step 4:** Run the same command, then `pnpm exec vitest run src/components/playful/AudioPlayerPlayful`. Expected: all PASS, with no Playful or base test edited.
- [ ] **Step 5: Commit**: `feat(soft): add AudioPlayerSoft with a renderTime hook on the base`

---

### Task 10: Release 0.3.0

**Files:**
- Modify: `package.json` (`version: "0.3.0"`), `src/index.ts` (`VERSION = "0.3.0"`), `src/smoke.test.ts`, `README.md`
- Create: `src/components/soft/SoftOverview.stories.tsx`

**Interfaces:**
- Consumes: every export from Tasks 1–9.

- [ ] **Step 1: Failing test.** In `src/smoke.test.ts`, change the existing `expect(lib.VERSION).toBe("0.2.0")` to `"0.3.0"` (the release bump is the one sanctioned edit of an existing test) and add:

```ts
it("exports every Soft skin", () => {
  for (const n of ["Button", "IconButton", "TextLink", "Tag", "Chip", "ProjectCard", "Card", "StackCard", "TopBar", "Footer", "BottomNav", "Tabs", "MenuOverlay", "Carousel", "DateStrip", "AudioPlayer"])
    expect(lib).toHaveProperty(`${n}Soft`);
  expect(lib).toHaveProperty("SOFT_HOVER_CLASSES");
  expect(Object.keys(lib).some((k) => k.endsWith("Base"))).toBe(false);
});
```

- [ ] **Step 2:** Run `pnpm exec vitest run src/smoke.test.ts`. Expected: FAIL on the version.
- [ ] **Step 3: Implement the release changes**
  - Bump `package.json` and `VERSION`.
  - **README:** set the Soft status to `✅ v0.3`; document the `tone` prop and `SoftTone` pairs; document loading Outfit 300; state the red-hover exception (plan's call 1).
  - `SoftOverview.stories.tsx`: `title: "Soft/Overview"`, story `AllComponents`, every Soft component on `bg-bh-paper`, grouped like `PlayfulOverview` (Actions, Labels, Cards, Widgets) but with spacing instead of ruled section borders. `TopBarSoft` at the top with `MenuOverlaySoft` as its action.
- [ ] **Step 4: Full gate.** Run: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`. Expected: all pass; the Storybook a11y addon (`test: "error"`) reports no violations on any `Soft/*` story.
- [ ] **Step 5: Commit**: `chore(release): 0.3.0`
