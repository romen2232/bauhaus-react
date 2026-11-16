# bauhaus-react 0.4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `0.4.0`, which adds all 16 Swiss skins (the financial-app look) on top of the bases from `0.2`.

**Architecture:** Every Swiss component is a thin skin in `src/components/swiss/<Name>Swiss/`.
- It owns static class maps and passes everything else to the existing internal base in `src/components/_base/<Name>/`.
- Swiss has no colour prop (spec §6.5), so most skins alias `Omit<<Name>BaseProps, "classes">`.
- **No base changes.** Every Swiss need fits an existing slot (checked against spec §6.1 and §6.2 and the base sources before this plan was written). `theme.css` and `cn.ts` already carry every Swiss token (`paper-white`, `rule`, `muted-text`, `accent`, `font-bh-grotesk`), so no token changes mid-matrix.

**Tech Stack:** React 19.3, TypeScript 7, Tailwind CSS 4.3 (`@theme static`), Vite 8 lib mode, Vitest 5 + jsdom + Testing Library + user-event, Storybook 10, `react-aria-components`, `@internationalized/date`, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-16-bauhaus-react-full-catalogue-design.md`. Release `0.4` is defined in its §8. The Swiss column of §6.1 and the "How the looks differ" column of §6.2 are the design source for every skin. The 0.2 plan defines the bases; the 0.3 plan (`docs/superpowers/plans/2026-11-16-bauhaus-react-0.3.md`) is the structural model.

## Global Constraints

**Swiss look rules** (spec §6.1)
- **Ground:** `paper-white` (`bg-bh-paper-white`). Text is `ink`; secondary text and inactive states are `muted-text` (`text-bh-muted-text`, 5.37:1 on white).
- **Colour:** `ink` on `paper-white` plus **one** accent (`bg-bh-accent`) used **at most once per component**, only as a fill or a rule, **never as text** (default accent is 3.89:1 on white; spec §6.5). Emphasis is grey (`muted-text`) → `ink`. No triad, no Playful extended colours, no `sand`, no `paper`.
- **Radius:** none, everywhere. `rounded-full` only on `size="sm"` `ButtonSwiss` and on circular icon buttons (`IconButtonSwiss`, the `AudioPlayerSwiss` play button, the carousel arrows).
- **Borders:** 1px only. Structural hairlines use `border-bh-rule` / `divide-bh-rule`; controls that must be perceivable use `border-bh-ink`. **No `border-2`, `border-4`, `border-8`.**
- **Depth:** none. No `shadow-*`, no translate, no lift.
- **Type:** `font-bh-grotesk` (Inter Tight), `font-normal` (big is not heavy). Display text carries `tracking-[-0.03em]`; uppercase labels carry `tracking-[0.1em]`. Never `font-bh-display`, `font-bh-body`, or `font-medium`/`semibold`/`bold`/`extrabold`/`black`.
- **Hover/active:** colour change only: `muted-text` → `ink`, or an underline appears, or a filled control steps ink → `charcoal`. No movement. Text on a dark fill flips to `paper-white` (never `muted-text` on `ink`, 3.51:1).
- **Motion:** `motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out`. No kinetic decoration inside Swiss components.

**Shared by every look**
- Every interactive element gets `FOCUS_RING` from `src/lib/styles.ts`. React Aria elements that hide the outline must also carry `data-[focus-visible]:outline-solid` (the Tailwind 4.3 bug guarded by `src/components/playful/focusRing.test.tsx`).
- Disabled: `cursor-not-allowed opacity-50`, and **no `hover:` classes** on a disabled control.
- **Static class literals only.** Never interpolate a class name. `pnpm smoke` fails on `bh-${`.
- Yellow is never a text colour.

**Component conventions** (unchanged from 0.2/0.3)
- Folder: `src/components/swiss/<Name>Swiss/{<Name>Swiss.tsx, <Name>Swiss.test.tsx, <Name>Swiss.stories.tsx, index.ts}`. `index.ts` re-exports with `.js` suffixes; tests import without a suffix.
- Story titles: `Swiss/<Name>Swiss`. Stories set `parameters.backgrounds.default: "white"` (the option already exists in `.storybook/preview.ts`).
- A skin restates its props only where the matching Playful skin does (Button, IconButton, Tag, ProjectCard, TopBar, Footer), minus the colour prop; otherwise it aliases `Omit<<Name>BaseProps, "classes">`.
- `ref` is a regular prop; `className` merges last into `root` via the base.
- A skin starts with `"use client"` only if its base does (AudioPlayer, Carousel, DateStrip, MenuOverlay, Tabs).
- Each task adds its exports to `src/index.ts` under a new `// Swiss look` section placed after `// Soft look`.
- `_base` is never exported.

**Process**
- Strict TDD: failing test first.
- Skin tests (spec §6.7): role and accessible name, `className` forwarding, `ref` forwarding. Swiss has no skin-only prop. Class assertions are allowed only where this plan states them.
- **Every existing test (v1, 0.2 bases, Playful skins, Soft skins) passes unchanged.** No base is edited, so none should need touching. If a test would need an edit, stop and ask the author.
- Commits: conventional commits, **no AI attribution, no Co-Authored-By lines.**

**Test commands**
- One file: `pnpm exec vitest run <path>`
- Full gate: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`

## Plan's calls (author to confirm while reading)

1. **Hover on filled Swiss controls steps ink → `charcoal`** (white on charcoal 9.44:1); outline controls fill with `ink` and flip text to `paper-white` (18.88:1). Both are colour-only changes. No new token.
2. **`IconButtonSwiss` default variant is `outline`** (1px `ink` border, no fill, as §6.2 says); `solid` is an `ink` fill. Other looks default to `solid`, so the shared API keeps the same variant names but this look picks the spec'd one as default. `CarouselSwiss` uses `outline`.
3. **`ButtonSwiss` `color` is `bg-bh-accent text-bh-ink`.** Red is 4.86:1 against `ink` but 3.89:1 against white, so text on the accent is ink. Accent is used only by `ButtonSwiss` `color` (fill) and `StackCardSwiss` (2px spine). A consumer who overrides `--color-bh-accent` must keep ink text readable on it; the README says so.
4. **Structural hairlines use `rule` (#e5e5e5, 1.26:1 on white), which is decorative; controls that must be perceivable use `ink` borders** (Button outline, IconButton, Tag, Chip, menu trigger and close, audio play button).
5. **Selection never relies on colour alone.** Selected tab and selected day get a 1px `ink` underline; the current `BottomNav` link gets a 1px `ink` top rule that overlaps the bar's hairline; the current menu link is underlined. Each also turns `muted-text` → `ink`.
6. **`ProjectCardSwiss`:** no fill, a `rule` hairline box, a giant `muted-text` initial that turns `ink` on hover (via `group-hover`), underlined title on hover. `tag` is `{ label: string }` only, rendered as `TagSwiss`. Media is not greyscaled (Soft-only).
7. **`TopBarSwiss` "wordmark slot" is the existing `brand` slot**, styled as an uppercase grotesk wordmark. No new slot or prop.
8. **`CarouselSwiss` re-styles the base pager from the `pager` slot** with child variants (`[&>span]:font-bh-grotesk [&>div]:h-px`): grotesk `01 / 05` and a 1px progress rule. Child-variant selectors out-rank the primitives' own `font-bh-mono` and `h-0.5`. No base change.
9. **`AudioPlayerSwiss` keeps the base's default `elapsed / total` readout** (only Soft shows the big numeral, §6.2). Track is a 1px `ink` line, thumb a 12px `ink` square. Offsets, not `-translate-*`, centre them, because the look rules forbid translate.
10. **`Grid ruled` is unchanged** and paints `paper` cells. Swiss consumers pass `className="[&>*]:bg-bh-paper-white"`; `cn` makes the later class win. `FooterSwiss` builds its own hairline grid with `paper-white` cells instead of reusing `GRID_RULED`. A test pins the `Grid` override (Task 10).
11. **Shared Swiss class strings live in `src/lib/styles.ts`** (`SWISS_MOTION`, `SWISS_LABEL`, `SWISS_DISPLAY`, `SWISS_RAC_FOCUS`), not exported from `index.ts`. Playful and Soft files are not touched.
12. **No new fonts or tokens.** Inter Tight 400 is already imported in `.storybook/preview.css`; Swiss only uses weight 400.

## Review Focus

1. **Hover and filled states keep text readable.** Every Swiss fill/text pair (ink, charcoal, accent with ink text) stays ≥ 4.5:1; `muted-text` is only ever used on white. Pinned by the `SWISS_HEX` contrast tests (Task 1).
2. **The accent never becomes text, and appears once per component.** A consumer-overridden accent must still carry ink text. Pinned by `src/components/swiss/lookRules.test.tsx` (counts `bh-accent` tokens per element, rejects `text-bh-accent`) and the `ButtonSwiss` `color` test (Task 2).
3. **Look rules don't leak.** No Swiss skin emits a radius outside the allowed pills, a border wider than 1px, a shadow, a translate, a Playful/Soft colour (`paper`, `sand`, triad), `text-bh-yellow`, `font-bh-display` or a bold weight. Pinned by `lookRules.test.tsx` (created in Task 2, extended by each later task).
4. **Focus stays visible and unclipped.** React Aria Swiss widgets (Tabs, DateStrip, MenuOverlay trigger and close) keep their outline, and the scrolling day strip leaves room for its ring. Pinned by `src/components/swiss/focusRing.test.tsx` (Tasks 6 and 7).
5. **State is never colour-only.** Selected tab, selected day, current nav link and current menu link each carry a non-colour cue. Pinned by class assertions in Tasks 5, 6 and 7.

---

## File map

```txt
src/lib/palette.ts, palette.test.ts                 M  SWISS_HEX + contrast tests (Task 1)
src/lib/styles.ts, styles.test.ts                   M/C SWISS_* class strings (Task 1)
consumer-smoke/check.mjs, check-storybook.mjs       M  Swiss needles (Task 1)
src/components/swiss/<Name>Swiss/…                  C  16 skins
src/components/swiss/lookRules.test.tsx             C  (Task 2, extended by Tasks 3–9)
src/components/swiss/focusRing.test.tsx             C  (Task 6, extended by Task 7)
src/components/swiss/SwissOverview.stories.tsx      C  (Task 10)
src/components/primitives/Grid/Grid.test.tsx        M  append one test (Task 10)
src/index.ts, src/smoke.test.ts, package.json, README.md   M  (each task / Task 10)
```

No file under `src/components/_base/`, `playful/` or `soft/` changes.

Task order: palette and shared strings → actions → labels → cards → bars → overlay → React Aria widgets → carousel (needs `IconButtonSwiss`) → audio → release.

---

### Task 1: `SWISS_HEX`, shared Swiss class strings, smoke needles

**Files:**
- Modify: `src/lib/palette.ts`, `src/lib/palette.test.ts`, `src/lib/styles.ts`, `consumer-smoke/check.mjs`, `consumer-smoke/check-storybook.mjs`, `src/index.ts`
- Create: `src/lib/styles.test.ts`

**Interfaces:**
- Produces:
  - `SWISS_HEX` in `palette.ts`, exported from `src/index.ts` next to `SOFT_HEX`: `{ white: "#FFFFFF", ink: HEX.ink, mutedText: "#6E6A64", rule: "#E5E5E5", accent: HEX.red, charcoal: SOFT_HEX.neutral }` (`as const`). Mirrors `theme.css`.
  - In `styles.ts` (not exported from `index.ts`):
    - `SWISS_MOTION = "motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out"`
    - `SWISS_LABEL = "font-bh-grotesk text-[11px] font-normal uppercase tracking-[0.1em]"`
    - `SWISS_DISPLAY = "font-bh-grotesk font-normal tracking-[-0.03em]"`
    - `SWISS_RAC_FOCUS = "outline-hidden data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink"` (for React Aria buttons, tabs, days, panels)

- [ ] **Step 1: Write the failing tests** (append to `palette.test.ts`; `contrast`, `HEX`, `SOFT_HEX` already exist there; import `SWISS_HEX`)

```ts
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
```

```ts
// styles.test.ts
it("Swiss strings carry the spec'd type and focus rules", () => {
  expect(SWISS_LABEL).toContain("tracking-[0.1em]");
  expect(SWISS_DISPLAY).toContain("tracking-[-0.03em]");
  expect(SWISS_RAC_FOCUS).toContain("data-[focus-visible]:outline-solid");
  expect(SWISS_MOTION).toContain("motion-safe:");
});
```

- [ ] **Step 2: Run them and confirm they fail**

Run: `pnpm exec vitest run src/lib`
Expected: FAIL, `SWISS_HEX` and the `SWISS_*` strings are undefined.

- [ ] **Step 3: Implement**
  - Add `SWISS_HEX` with the exact values above, and export it from `src/index.ts`.
  - Add the four `SWISS_*` strings to `styles.ts` with the exact values above.
  - `consumer-smoke/check.mjs`: append `".bg-bh-paper-white"`, `".text-bh-muted-text"`, `".font-bh-grotesk"`, `".bg-bh-accent"` to `expected`. `consumer-smoke/check-storybook.mjs`: append `[".bg-bh-paper-white", true]` to `checks`. No component uses them until Task 2, so `pnpm smoke` and `pnpm smoke:storybook` fail until then; that is expected. Say so in the commit body.

- [ ] **Step 4: Run and confirm they pass**

Run: `pnpm exec vitest run src/lib`
Expected: PASS.

- [ ] **Step 5: Commit**: `feat(tokens): add Swiss palette checks and shared class strings`

---

### Task 2: `ButtonSwiss` and `IconButtonSwiss`

**Files:**
- Create: `src/components/swiss/{ButtonSwiss,IconButtonSwiss}/*`, `src/components/swiss/lookRules.test.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `ButtonBase`, `ButtonBaseProps`; `IconButtonBase`, `IconButtonBaseProps`; `FOCUS_RING`, `SWISS_MOTION`, `SWISS_LABEL`.
- Produces:
  - `type ButtonSwissVariant = "solid" | "outline" | "color"`, `type ButtonSwissSize = "sm" | "md" | "lg"`.
  - `ButtonSwissProps`: the same union shape as `ButtonPlayfulProps` (as-button | as-link) with `variant?` (default `"solid"`), `size?` (default `"md"`), and **no** `color`.
  - `type IconButtonSwissSize = "sm" | "md" | "lg"`. `IconButtonSwissProps`: same shape as `IconButtonPlayfulProps`, `variant?: "solid" | "outline"` (default `"outline"`, call 2).
  - Variant classes (rest state / hover state kept in two maps; hover is dropped when `disabled`):

    | Variant | Rest | Hover |
    |---|---|---|
    | `solid` | `bg-bh-ink text-bh-paper-white` | `hover:bg-bh-charcoal` |
    | `outline` | `border border-bh-ink bg-transparent text-bh-ink` | `hover:bg-bh-ink hover:text-bh-paper-white` |
    | `color` (Button only) | `bg-bh-accent text-bh-ink` | `hover:bg-bh-ink hover:text-bh-paper-white` |

  - `ButtonSwiss` base: `inline-flex items-center justify-center gap-2` + `SWISS_LABEL`, then the size classes after it so their `text-*` wins through `cn` (`sm` `h-8 px-4 text-xs rounded-full`, `md` `h-11 px-6 text-sm`, `lg` `h-14 px-8 text-base`; only `sm` is `rounded-full`) + `SWISS_MOTION` + `FOCUS_RING`. `IconButtonSwiss`: `inline-flex shrink-0 items-center justify-center rounded-full` + sizes as in Playful (`size-8 text-sm`, `size-11 text-base`, `size-14 text-xl`) + the variant classes.
  - `lookRules.test.tsx` (exports nothing): holds `const cases: [string, ReactElement, { pill?: boolean }?][]` and one `it.each(cases)` that renders each element and collects every element's class tokens, stripping variant prefixes with `token.split(":").pop()`. It asserts the offending list is empty, where a token offends if it matches
    `/^(border(-[xytrbl])?-(2|4|8)|divide-[xy]-(2|4|8)|shadow(-.*)?|-?translate-.*|text-bh-yellow|text-bh-accent|rounded-bh-soft|font-bh-(display|body)|font-(medium|semibold|bold|extrabold|black)|(bg|text|border|divide)-bh-(red|yellow|blue|navy|sky|pink|orange|sand|paper|teal|khaki))$/`,
    or starts with `rounded` while not being `rounded-none` and not being `rounded-full` on a case flagged `{ pill: true }`. A second assertion per case: no single element carries more than one `bh-accent` token.

- [ ] **Step 1: Write the failing tests**

```tsx
// ButtonSwiss.test.tsx
it("renders a button with its name", () => { render(<ButtonSwiss>Transfer</ButtonSwiss>); expect(screen.getByRole("button", { name: "Transfer" })).toBeInTheDocument(); });
it("color variant is the accent fill with ink text, never accent text", () => {
  render(<ButtonSwiss variant="color">Pay</ButtonSwiss>);
  expect(screen.getByRole("button")).toHaveClass("bg-bh-accent", "text-bh-ink");
  expect(screen.getByRole("button").className).not.toMatch(/text-bh-accent/);
});
it("outline variant has a 1px ink border and no fill", () => {
  render(<ButtonSwiss variant="outline">Later</ButtonSwiss>);
  expect(screen.getByRole("button")).toHaveClass("border", "border-bh-ink", "bg-transparent");
});
it("is square except at size sm", () => {
  render(<><ButtonSwiss size="sm">S</ButtonSwiss><ButtonSwiss size="md">M</ButtonSwiss></>);
  expect(screen.getByRole("button", { name: "S" })).toHaveClass("rounded-full");
  expect(screen.getByRole("button", { name: "M" }).className).not.toMatch(/rounded/);
});
it("a disabled button keeps no hover classes", () => {
  render(<ButtonSwiss disabled>Closed</ButtonSwiss>);
  expect(screen.getByRole("button")).toBeDisabled();
  expect(screen.getByRole("button").className).not.toMatch(/hover:/);
  expect(screen.getByRole("button")).toHaveClass("cursor-not-allowed", "opacity-50");
});
it("renders a link with href and forwards className and ref", () => { /* href → role link; className merged; createRef → HTMLAnchorElement */ });
// IconButtonSwiss.test.tsx: name from aria-label; default variant has "border-bh-ink" + "bg-transparent" + "rounded-full";
//   variant="solid" has "bg-bh-ink"; size lg renders; href → link; className; ref.
// lookRules.test.tsx: cases ButtonSwiss × 3 variants (+ size sm with { pill: true }), IconButtonSwiss × 2 variants ({ pill: true }).
```

- [ ] **Step 2: Run, confirm FAIL** (`pnpm exec vitest run src/components/swiss`): modules not found.
- [ ] **Step 3: Implement** both skins, stories (`Swiss/ButtonSwiss`: `Solid`, `Outline`, `Accent`, `AsLink`, `Disabled`, `Sizes`; `Swiss/IconButtonSwiss`: `Outline`, `Solid`, `Fab`), `index.ts` files and exports.
- [ ] **Step 4: Run, confirm PASS**, then `pnpm smoke` and `pnpm smoke:storybook`: the Task 1 needles are now `found`/`ok`.
- [ ] **Step 5: Commit**: `feat(swiss): add ButtonSwiss and IconButtonSwiss`

---

### Task 3: `TextLinkSwiss`, `TagSwiss`, `ChipSwiss`

**Files:**
- Create: `src/components/swiss/{TextLinkSwiss,TagSwiss,ChipSwiss}/*`
- Modify: `src/components/swiss/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `TextLinkBase`, `TextLinkBaseProps`, `TextLinkArrow`; `TagBase`; `ChipBase`, `ChipBaseProps`; `FOCUS_RING`, `SWISS_*`.
- Produces:
  - `TextLinkSwissProps = Omit<TextLinkBaseProps, "classes">`. No underline at rest, `hover:underline decoration-1 underline-offset-4`, `font-bh-grotesk font-normal text-bh-ink`, `FOCUS_RING`. The arrow is optional (no default).
  - `TagSwissProps = ComponentProps<"span">`. `inline-block border border-bh-ink px-2 py-1 text-bh-ink` + `SWISS_LABEL`. Sharp, 1px outline, no fill.
  - `ChipSwissProps = Omit<ChipBaseProps, "classes">`. `inline-flex items-center gap-2 border border-bh-ink px-3 py-1 font-bh-grotesk text-xs font-normal text-bh-ink`. Sharp, 1px border, no fill; not uppercase (that is what separates it from the Tag).

- [ ] **Step 1: Failing tests**
  - `TextLinkSwiss`: `getByRole("link", { name: "See times" })`; with no `arrow` there is no `aria-hidden` glyph; `arrow="up-right"` shows `↗` and stays out of the accessible name; root has `hover:underline` and not `underline` at rest (`className` not matching `(^| )underline`); `className`, `ref`.
  - `TagSwiss`: renders its text; has `border border-bh-ink uppercase tracking-[0.1em]` and no `bg-bh-` token; `className`, `ref`.
  - `ChipSwiss`: pill-less (`className` not matching `rounded`) with `border border-bh-ink`; the icon wrapper is `aria-hidden`; `className`, `ref`.
  - `lookRules`: one case per component.
- [ ] **Steps 2–4:** Fail, implement with stories (`Swiss/TextLinkSwiss`, `Swiss/TagSwiss`, `Swiss/ChipSwiss`) and exports, pass.
- [ ] **Step 5: Commit**: `feat(swiss): add TextLinkSwiss, TagSwiss and ChipSwiss`

---

### Task 4: `CardSwiss`, `StackCardSwiss`, `ProjectCardSwiss`

**Files:**
- Create: `src/components/swiss/{CardSwiss,StackCardSwiss,ProjectCardSwiss}/*`
- Modify: `src/components/swiss/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `CardBase`, `CardBaseProps`; `StackCardBase`, `StackCardBaseProps`; `ProjectCardBase`; `TagSwiss` (Task 3); `FOCUS_RING`, `SWISS_*`.
- Produces:
  - `CardSwissProps = Omit<CardBaseProps, "classes">`. Root: `flex flex-col border border-bh-rule bg-transparent text-bh-ink`. `header`: `border-b border-bh-rule p-4 text-lg` + `SWISS_DISPLAY`. `body`: `p-4 font-bh-grotesk text-sm`. `footer`: `border-t border-bh-rule p-4 text-xs uppercase tracking-[0.1em] text-bh-muted-text font-bh-grotesk`. With `href`, the root adds `hover:border-bh-ink` + `SWISS_MOTION` + `FOCUS_RING` (a colour change only).
  - `StackCardSwissProps = Omit<StackCardBaseProps, "classes">`. Root: `relative flex items-center gap-4 border border-bh-rule py-4 pr-4 pl-6 text-bh-ink`. Spine: `absolute inset-y-0 left-0 w-0.5 bg-bh-accent` (2px accent line; the only accent in the component). Body: `flex-1 font-bh-grotesk`. Action: `shrink-0`.
  - `ProjectCardSwissProps`: restates `ProjectCardPlayfulProps` without `color`, with `tag?: { label: string }`.
    - Root: `group flex min-h-96 flex-col gap-3 border border-bh-rule bg-transparent p-6 text-bh-ink` + `SWISS_MOTION` + `hover:border-bh-ink` + `FOCUS_RING`.
    - `initial`: `text-9xl leading-none text-bh-muted-text group-hover:text-bh-ink` + `SWISS_DISPLAY` + `SWISS_MOTION`.
    - `title`: `text-xl group-hover:underline decoration-1 underline-offset-4` + `SWISS_DISPLAY`.
    - `description`: `font-bh-grotesk text-sm text-bh-muted-text`. `media`: `flex flex-1 items-center justify-center`. `arrow`: `mt-auto text-2xl`.
    - `tag` renders `<TagSwiss className="self-start">`.

- [ ] **Step 1: Failing tests**
  - `CardSwiss`: `<article>` without `href`; with `href` it is one link containing header and body text and carries `hover:border-bh-ink`; root has `border-bh-rule`; `className`, `ref`.
  - `StackCardSwiss`: the `aria-hidden` spine has `bg-bh-accent w-0.5`; the action renders; `className`, `ref`.
  - `ProjectCardSwiss`: `getByRole("link", { name: "Account A" })` (name from the title via `aria-labelledby`); the initial is `aria-hidden` with `text-bh-muted-text` and `group-hover:text-bh-ink`; root has `group` and no `bg-bh-` token; `tag={{ label: "New" }}` renders text `New`; `className`, `ref`.
  - `lookRules`: one case per component, `CardSwiss` with and without `href`.
- [ ] **Steps 2–4:** Fail, implement with stories and exports, pass.
- [ ] **Step 5: Commit**: `feat(swiss): add CardSwiss, StackCardSwiss and ProjectCardSwiss`

---

### Task 5: `TopBarSwiss`, `FooterSwiss`, `BottomNavSwiss`

**Files:**
- Create: `src/components/swiss/{TopBarSwiss,FooterSwiss,BottomNavSwiss}/*`
- Modify: `src/components/swiss/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `TopBarBase`, `FooterBase`, `BottomNavBase`, `BottomNavBaseProps`, `BottomNavItem`; `FOCUS_RING`, `SWISS_*`; `cn`.
- Produces:
  - `TopBarSwissProps`: same as `TopBarPlayfulProps`. Root: `flex items-stretch divide-x divide-bh-rule border-b border-bh-rule bg-bh-paper-white text-bh-ink`. `brand` (the wordmark slot, call 7): `flex items-center px-4 py-3 text-xl uppercase` + `SWISS_DISPLAY`. `meta`: `hidden px-4 py-3 text-bh-muted-text md:block` + `SWISS_LABEL`. `action`: `ml-auto flex items-center px-4 py-2`.
  - `FooterSwissProps`: same as `FooterPlayfulProps`. Static `MD_COLS` array (as in `FooterPlayful`). Slots: `root: "bg-bh-paper-white text-bh-ink"`; `grid`: `cn("grid grid-cols-1 gap-px border border-bh-rule bg-bh-rule [&>*]:bg-bh-paper-white", MD_COLS[count - 1])` with `count = Math.min(Math.max(columns.length, 1), 6)`; `column: "p-6 font-bh-grotesk text-sm"`; `bottom`: `border-x border-b border-bh-rule px-6 py-3 text-bh-muted-text` + `SWISS_LABEL`. Does not use `GRID_RULED` (call 10).
  - `BottomNavSwissProps = Omit<BottomNavBaseProps, "classes">`. Root: `border-t border-bh-rule bg-bh-paper-white`. `list`: `flex items-center justify-around px-2`. `link`: `-mt-px flex min-w-11 flex-col items-center gap-1 border-t border-transparent px-3 pt-2 pb-3 text-bh-muted-text hover:text-bh-ink aria-[current=page]:border-bh-ink aria-[current=page]:text-bh-ink` + `SWISS_MOTION` + `FOCUS_RING`. `icon`: `text-xl leading-none`. `label`: `SWISS_LABEL`.

- [ ] **Step 1: Failing tests**
  - `TopBarSwiss`: `getByRole("banner")`; brand, meta and action render; root has `divide-x divide-bh-rule` and `bg-bh-paper-white`; `className`, `ref`.
  - `FooterSwiss`: `getByRole("contentinfo")`; one column element per `columns` entry; `bottom` renders; the grid has `bg-bh-rule` and `[&>*]:bg-bh-paper-white`; **7 columns clamp to `md:grid-cols-6`, 0 columns render without throwing and give `md:grid-cols-1`** (grid = `footer.firstElementChild`); `className`, `ref`.
  - `BottomNavSwiss`: `getByRole("navigation", { name: "Main" })`; only the current link has `aria-current="page"`; **every link has `aria-[current=page]:border-bh-ink` (the non-colour cue, call 5)**; the current link text and the others are `text-bh-muted-text` at rest; `className`, `ref`.
  - `lookRules`: one case per component.
- [ ] **Steps 2–4:** Fail, implement with stories and exports, pass.
- [ ] **Step 5: Commit**: `feat(swiss): add TopBarSwiss, FooterSwiss and BottomNavSwiss`

---

### Task 6: `MenuOverlaySwiss`

**Files:**
- Create: `src/components/swiss/MenuOverlaySwiss/*`, `src/components/swiss/focusRing.test.tsx`
- Modify: `src/components/swiss/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `MenuOverlayBase`, `MenuOverlayBaseProps`, `MenuLink`; `FOCUS_RING`, `SWISS_*`, `cn`.
- Produces:
  - `"use client"`. `MenuOverlaySwissProps = Omit<MenuOverlayBaseProps, "classes">`.
  - Classes:
    - `trigger` and `close`: `inline-flex h-11 items-center border border-bh-ink bg-transparent px-6 text-sm uppercase tracking-[0.1em] text-bh-ink hover:bg-bh-ink hover:text-bh-paper-white` + `font-bh-grotesk font-normal` + `SWISS_MOTION` + `SWISS_RAC_FOCUS`. `close` adds `ml-auto`.
    - `overlay`: `fixed inset-0 z-50 bg-bh-paper-white`, no backdrop blur. `panel`: `h-full overflow-y-auto p-6 text-bh-ink`.
    - `list`: `mt-8 border-t border-bh-rule`. `item`: `border-b border-bh-rule`. Links are divided by rules.
    - `link`: `block px-2 py-4 text-5xl leading-none text-bh-muted-text hover:text-bh-ink aria-[current=page]:text-bh-ink aria-[current=page]:underline aria-[current=page]:decoration-1 aria-[current=page]:underline-offset-8` + `SWISS_DISPLAY` + `SWISS_MOTION` + `FOCUS_RING`. Inactive `muted-text`, hovered/current `ink` (OffMenu).
    - `secondary`: `mt-8 text-bh-muted-text` + `SWISS_LABEL`.
  - `focusRing.test.tsx` (Swiss): copy the `killsFocusRing(el)` helper from `src/components/soft/focusRing.test.tsx` (do not import from a test file). Assert it is `false` for the `MenuOverlaySwiss` trigger and, after opening, the close button.

- [ ] **Step 1: Failing tests**
  - Opens a dialog named by `title` from the trigger; the current link has `aria-current="page"` and class `aria-[current=page]:underline` (non-colour cue); `className` lands on the trigger.
  - Escape closes and focus returns to the trigger.
  - The overlay has `bg-bh-paper-white`; no element inside the dialog has a class containing `backdrop-blur` or `rounded`; the list has `border-t border-bh-rule`.
  - `focusRing.test.tsx` as above; `lookRules`: one case (render opened with `defaultOpen`).
- [ ] **Steps 2–4:** Fail, implement with a story (`Swiss/MenuOverlaySwiss`) and exports, pass.
- [ ] **Step 5: Commit**: `feat(swiss): add MenuOverlaySwiss on React Aria dialog`

---

### Task 7: `TabsSwiss` and `DateStripSwiss`

**Files:**
- Create: `src/components/swiss/{TabsSwiss,DateStripSwiss}/*`
- Modify: `src/components/swiss/focusRing.test.tsx`, `src/components/swiss/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `TabsBase`, `TabsBaseProps`, `TabItem`; `DateStripBase`, `DateStripBaseProps`; `CalendarDate` from `@internationalized/date`; `SWISS_*`.
- Produces:
  - Both `"use client"`, both aliases of `Omit<<Name>BaseProps, "classes">`.
  - `TabsSwiss` (underlined tabs): `root: "flex flex-col gap-4"`; `list: "flex gap-6 border-b border-bh-rule"`; `tab`: `-mb-px cursor-pointer border-b border-transparent pb-2 text-sm uppercase tracking-[0.1em] text-bh-muted-text data-[hovered]:text-bh-ink data-[selected]:border-bh-ink data-[selected]:text-bh-ink data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50` + `font-bh-grotesk font-normal` + `SWISS_MOTION` + `SWISS_RAC_FOCUS`; `panel`: `font-bh-grotesk text-sm` + `SWISS_RAC_FOCUS`.
  - `DateStripSwiss`:
    - `root`: `flex gap-2 overflow-x-auto p-1.5` (the padding leaves room for the 2px ring + 2px offset inside the scroll box, as in `DateStripSoft`).
    - `day`: `flex min-w-14 cursor-pointer flex-col items-center gap-1 border-b border-transparent px-3 pt-3 pb-2 text-bh-muted-text data-[hovered]:text-bh-ink data-[selected]:border-bh-ink data-[selected]:text-bh-ink data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50` + `SWISS_MOTION` + `data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink`.
    - `weekday`: `SWISS_LABEL`. `number`: `text-3xl leading-none tabular-nums` + `SWISS_DISPLAY`.

- [ ] **Step 1: Failing tests**
  - `TabsSwiss`: `getByRole("tablist", { name })`; ArrowRight moves selection to the next tab and shows its panel; `onSelectionChange` is called with the new id; the tab list has `border-b border-bh-rule`; each tab has `data-[selected]:border-bh-ink` (non-colour cue); `className` lands on the root.
  - `DateStripSwiss`: `getByRole("radiogroup", { name })`; clicking a day calls `onChange` with that `CalendarDate`; the selected radio is checked; days before `minValue` are disabled; each day has `data-[selected]:border-bh-ink`; **the root has `overflow-x-auto` and `p-1.5`**; `className` on the root.
  - Extend `focusRing.test.tsx`: `killsFocusRing` is `false` for each `TabsSwiss` tab and its panel, and for each `DateStripSwiss` day element (`radio.closest("label")`).
  - `lookRules`: one case each.
- [ ] **Steps 2–4:** Fail, implement with stories (`Swiss/TabsSwiss`, `Swiss/DateStripSwiss` including a month-boundary story starting `2026-12-29`) and exports, pass.
- [ ] **Step 5: Commit**: `feat(swiss): add TabsSwiss and DateStripSwiss`

---

### Task 8: `CarouselSwiss`

**Files:**
- Create: `src/components/swiss/CarouselSwiss/*`
- Modify: `src/components/swiss/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `CarouselBase`, `CarouselBaseProps`, `CarouselButtonProps`; `IconButtonSwiss` (Task 2).
- Produces:
  - `"use client"`. `CarouselSwissProps = Omit<CarouselBaseProps, "classes" | "renderButton">`.
  - `renderButton` renders `IconButtonSwiss` `variant="outline"` `size="md"` with `←` / `→`, passing `label` as `aria-label`, `disabled` and `onClick`.
  - Slots: `root: "flex flex-col gap-4"`; `viewport: "overflow-hidden"`; `track: ""`; `slide: ""`; `controls: "flex items-center gap-4"`; `pager: "flex flex-1 items-center gap-4 [&>span]:font-bh-grotesk [&>div]:h-px"` (call 8: grotesk `01 / 05` and a 1px ink progress rule). The base's slide transition (`duration-200`, `motion-safe`) is kept.

- [ ] **Step 1: Failing tests**
  - `getByRole("region", { name })` with `aria-roledescription="carousel"`; "Next slide" advances and the live region reads `Slide 2 of 3`; with one slide both buttons are disabled; the pager text reads `01 / 03` before advancing; the pager slot carries `[&>div]:h-px` (`container.querySelector(".\\[\\&\\>div\\]\\:h-px")` is non-null); `className` on the root.
  - `lookRules`: one case, flagged `{ pill: true }` (the arrows are circular).
- [ ] **Steps 2–4:** Fail, implement with a story and exports, pass.
- [ ] **Step 5: Commit**: `feat(swiss): add CarouselSwiss`

---

### Task 9: `AudioPlayerSwiss`

**Files:**
- Create: `src/components/swiss/AudioPlayerSwiss/*`
- Modify: `src/components/swiss/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `AudioPlayerBase`, `AudioPlayerBaseProps`; `FOCUS_RING`, `SWISS_MOTION`. **The base is not modified** (`renderTime` already exists from 0.3 and is left unused).
- Produces:
  - `"use client"`. `AudioPlayerSwissProps = Omit<AudioPlayerBaseProps, "classes">`.
  - Slots:
    - `root: "flex items-center gap-4 text-bh-ink"`.
    - `play`: `inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-bh-ink text-sm text-bh-ink hover:bg-bh-ink hover:text-bh-paper-white` + `SWISS_MOTION` + `FOCUS_RING`.
    - `scrubber: "flex-1"`.
    - `track`: `relative h-6 w-full before:absolute before:inset-x-0 before:top-3 before:h-px before:bg-bh-ink` (24px track, 1px line at its middle, no translate).
    - `thumb`: `top-1.5 size-3 bg-bh-ink data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink` (a 12px square centred on the line).
    - `time: "font-bh-grotesk text-sm tabular-nums"`.

- [ ] **Step 1: Failing tests**

```tsx
// AudioPlayerSwiss.test.tsx
it("reads 0:00 / --:-- before metadata loads, never NaN", () => {
  render(<AudioPlayerSwiss src="/a.mp3" title="Intro" />);
  expect(screen.getByText("0:00 / --:--")).toBeInTheDocument();
  expect(document.body.textContent).not.toMatch(/NaN/);
});
it("has a square thumb and a hairline track", () => {
  const { container } = render(<AudioPlayerSwiss src="/a.mp3" title="Intro" />);
  expect(container.querySelector(".before\\:h-px")).not.toBeNull();
  expect(container.querySelector(".size-3")?.className).not.toMatch(/rounded/);
});
// plus: play button named "Play Intro"; slider named "Seek"; className on the root; ref → HTMLAudioElement.
```

- [ ] **Step 2:** Run `pnpm exec vitest run src/components/swiss/AudioPlayerSwiss`. Expected: FAIL.
- [ ] **Step 3:** Implement the skin with a story and exports. `lookRules`: one case, flagged `{ pill: true }`.
- [ ] **Step 4:** Run the same command, then `pnpm exec vitest run src/components/_base/AudioPlayer src/components/playful/AudioPlayerPlayful src/components/soft/AudioPlayerSoft`. Expected: all PASS, with no other test edited.
- [ ] **Step 5: Commit**: `feat(swiss): add AudioPlayerSwiss`

---

### Task 10: Release 0.4.0

**Files:**
- Modify: `package.json` (`version: "0.4.0"`), `src/index.ts` (`VERSION = "0.4.0"`), `src/smoke.test.ts`, `src/components/primitives/Grid/Grid.test.tsx` (append only), `README.md`
- Create: `src/components/swiss/SwissOverview.stories.tsx`

**Interfaces:**
- Consumes: every export from Tasks 1–9.

- [ ] **Step 1: Failing tests.**
  - In `src/smoke.test.ts`, change the existing `expect(lib.VERSION).toBe("0.3.0")` to `"0.4.0"` (the release bump is the one sanctioned edit of an existing test) and add:

```ts
it.each([
  "Button", "IconButton", "TextLink", "Tag", "Chip", "ProjectCard", "Card", "StackCard",
  "TopBar", "Footer", "BottomNav", "Tabs", "MenuOverlay", "Carousel", "DateStrip", "AudioPlayer",
])("exports %sSwiss", (name) => {
  expect(typeof (lib as Record<string, unknown>)[`${name}Swiss`]).toBe("function");
});
it("exports the Swiss palette", () => {
  expect(lib.SWISS_HEX.white).toBe("#FFFFFF");
});
```

  - Append to `Grid.test.tsx` (documents call 10):

```tsx
it("a Swiss ground override wins over the ruled paper cells", () => {
  const { container } = render(<Grid ruled className="[&>*]:bg-bh-paper-white" />);
  expect(container.firstElementChild).toHaveClass("[&>*]:bg-bh-paper-white");
  expect(container.firstElementChild).not.toHaveClass("[&>*]:bg-bh-paper");
});
```

- [ ] **Step 2:** Run `pnpm exec vitest run src/smoke.test.ts src/components/primitives/Grid`. Expected: FAIL on the version and the missing exports.
- [ ] **Step 3: Implement the release changes**
  - Bump `package.json` and `VERSION`.
  - **README:**
    - Set the Swiss status to `✅ v0.4`; change the Fonts sentence "the upcoming Swiss look" to "the Swiss look".
    - Add a "### Swiss look" section after "Soft tones": ground `paper-white`; `ink` with `muted-text` → `ink` emphasis; one `bh-accent` per component, used as a fill or rule only; the default accent has ink text (4.86:1) but not white text (3.89:1), so if you override `--color-bh-accent` keep ink text readable on it; hairlines are 1px, hover is colour-only.
    - Document that `<Grid ruled>` paints `paper` cells: on a Swiss ground pass `className="[&>*]:bg-bh-paper-white"`.
    - Add the 16 `*Swiss` rows to the Components table (one line each, mirroring the Soft rows).
  - `SwissOverview.stories.tsx`: `title: "Swiss/Overview"`, story `AllComponents`, every Swiss component on `bg-bh-paper-white`, grouped like `SoftOverview` (Actions, Labels, Cards, Widgets), sections separated by `border-t border-bh-rule` hairlines, the cards inside `<Grid ruled className="[&>*]:bg-bh-paper-white">`. `TopBarSwiss` at the top with `MenuOverlaySwiss` as its action. `parameters.backgrounds.default: "white"`.
- [ ] **Step 4: Full gate.** Run: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`. Expected: all pass; the Storybook a11y addon (`test: "error"`) reports no violations on any `Swiss/*` story.
- [ ] **Step 5: Commit**: `chore(release): 0.4.0`
