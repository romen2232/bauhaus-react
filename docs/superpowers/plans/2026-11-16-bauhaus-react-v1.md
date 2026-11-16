# bauhaus-react v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `bauhaus-react@0.1.0`: 14 Playful-geometric React components + a shared Tailwind v4 `theme.css`, built for consumers who run Tailwind v4.

**Architecture:** One package. Vite library mode (`preserveModules`) emits ESM with literal Tailwind class strings, `tsc` emits `.d.ts`, and `theme.css` is copied to `dist/`. The consumer's Tailwind scans `dist` via `@source`. Components are server-safe function components; variants are static class maps merged through `cn()` (clsx + extended tailwind-merge).

**Tech Stack:** React 19.3, TypeScript 7.0, Tailwind CSS 4.3, Vite 8, Vitest 5 + Testing Library React 16 + jsdom, Storybook 10 (`@storybook/react-vite`), clsx, tailwind-merge. Package manager: npm (Node 24 via nvm: run `source ~/.nvm/nvm.sh` first in every shell).

**Spec:** `docs/superpowers/specs/2026-11-16-bauhaus-react-v1-design.md` (visual source: `docs/style-analysis.md`)

## Global Constraints

- Peer deps: `react` ^19, `react-dom` ^19, `tailwindcss` ^4. Nothing else at runtime except `clsx` and `tailwind-merge`.
- Package name `bauhaus-react`, version `0.1.0`, MIT, `"type": "module"`, `"sideEffects": ["**/*.css"]`.
- Exports: `"."` → `dist/index.js` + `dist/index.d.ts`; `"./theme.css"` → `dist/theme.css`. No other subpaths.
- Every token is prefixed `bh-` (`--color-bh-red`, `--font-bh-display`, `--shadow-bh-hard`, `--animate-bh-spin`).
- **Class strings are static literals.** Never write `` `bg-bh-${x}` ``. Variant/colour → full class string via object maps.
- Playful radius: `rounded-full` (all buttons, icon buttons, `Shape` bar) or `rounded-none` (cards, tags, bars, grid cells). Nothing in between.
- No gradients, no blurred shadows, no backdrop blur. Elevation = `shadow-bh-hard` only.
- Yellow is never a text colour. Text on a fill always comes from the fill map (§ Task 2), never from the consumer.
- Animation only behind `motion-safe:`.
- Decoration is `aria-hidden="true"`. Interactive elements show focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bh-ink`.
- Look-specific components end with `Playful`; look-agnostic ones have no suffix.
- `ref` is a regular prop (React 19). Every component spreads remaining native props on its root and merges `className` last via `cn()`.
- No `"use client"` in v1: no component uses state or effects (`useId` is server-safe).
- Strict TDD: each test is written and seen failing before its implementation.
- Commits: conventional commits, **no AI attribution / Co-Authored-By lines** (author's rule).

## Review Focus

1. **The consumer's Tailwind can't see a class** (an interpolated or concatenated class string) → the styles silently go missing in the consumer app. Pinned by the consumer smoke build in Task 10.
2. **`DisplayHeading echo`** → screen readers must read the heading once, not twice. Pinned in Task 4.
3. **`ButtonPlayful` with `href` + `disabled`** → must render an anchor with no `href`, `aria-disabled="true"` and `tabIndex={-1}`, not a clickable link. Pinned in Task 5.
4. **`IconButtonPlayful` without a label** → a compile error (`aria-label` required in the type) and a runtime-accessible name test. Pinned in Task 5.
5. **Reduced-motion users** → `spin` must only apply via `motion-safe:`; no animation class without that prefix. Pinned in Task 8.

---

## File Structure

```txt
package.json, tsconfig.json, tsconfig.build.json, vite.config.ts, vitest.setup.ts
.storybook/{main.ts, preview.ts, preview.css}
src/
  index.ts                          # public barrel
  theme.css                         # @theme tokens + keyframes
  lib/cn.ts, lib/cn.test.ts
  lib/palette.ts, lib/palette.test.ts       # fill map + contrast test
  components/
    primitives/{Container,Grid,DisplayHeading,HighlightText,ArrowLink}/
    playful/{ButtonPlayful,IconButtonPlayful,TagPlayful,ProjectCardPlayful,TopBarPlayful,FooterPlayful}/
    decoration/{Shape,ShapeMosaic,Stamp}/
      each: X.tsx, X.test.tsx, X.stories.tsx, index.ts
consumer-smoke/{input.css, check.mjs}       # Task 10, not published
README.md
```

---

### Task 1: Toolchain scaffold (build, types, tests, Storybook)

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.build.json`, `vite.config.ts`, `vitest.setup.ts`, `.storybook/main.ts`, `.storybook/preview.ts`, `.storybook/preview.css`, `src/index.ts`, `src/smoke.test.ts`

**Interfaces:**
- Produces: scripts `test` (`vitest run`), `typecheck` (`tsc --noEmit`), `build` (`vite build && tsc -p tsconfig.build.json`), `storybook`, `build-storybook`.

- [ ] **Step 1:** Run `npm init -y`. Install the dev deps at latest: `react react-dom @types/react @types/react-dom typescript tailwindcss @tailwindcss/vite vite @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event storybook @storybook/react-vite @storybook/addon-a11y @fontsource/outfit @fontsource-variable/inter`. Install the deps `clsx tailwind-merge`. Set the fields from Global Constraints and `peerDependencies`, `files: ["dist"]`.
- [ ] **Step 2:** Configure the build:
  - `tsconfig.json`: strict, `jsx: react-jsx`, `moduleResolution: bundler`, `verbatimModuleSyntax`.
  - `tsconfig.build.json`: `emitDeclarationOnly`, `outDir: dist`, excludes `**/*.test.tsx` and `**/*.stories.tsx`.
  - `vite.config.ts`: library mode with entry `src/index.ts` and format `es`, and React / react-dom / `react/jsx-runtime` marked external. Set `rollupOptions.output.preserveModules: true` and `preserveModulesRoot: "src"`. Copy `src/theme.css` to `dist/theme.css` (with a small plugin or `vite-plugin-static-copy`).
  - Add a `test` block with jsdom and `setupFiles: vitest.setup.ts`, which imports `@testing-library/jest-dom/vitest`.
- [ ] **Step 3: Write the failing smoke test** in `src/smoke.test.ts`: `import * as lib from "./index"; expect(lib.VERSION).toBe("0.1.0")`.
- [ ] **Step 4:** Run `npm test`. Expected: FAIL (`VERSION` is undefined).
- [ ] **Step 5:** Add `export const VERSION = "0.1.0";` to `src/index.ts`. Run `npm test` → PASS.
- [ ] **Step 6: Check the TS 7 risk.** Run `npm run build`.
  - Expected: `dist/index.js`, `dist/index.d.ts` and `dist/theme.css` exist (create an empty `src/theme.css` first).
  - If `tsc` from TS 7 can't emit declarations, record the error in the commit message and pin `typescript@^5` as a fallback. Don't swap in `vite-plugin-dts` without checking that it supports TS 7.
- [ ] **Step 7:** Set up Storybook:
  - `.storybook/main.ts` uses the framework `@storybook/react-vite`, the addon `@storybook/addon-a11y`, and stories `../src/**/*.stories.tsx`.
  - `preview.css` contains `@import "tailwindcss"; @import "../src/theme.css"; @source "../src";` plus the two `@fontsource` imports.
  - `preview.ts` imports `preview.css` and sets the background to paper.
  - Check: `npm run build-storybook` exits 0.
- [ ] **Step 8: Commit** with `chore: scaffold library toolchain (vite, vitest, storybook)`.

### Task 2: Tokens, palette and `cn()`

**Files:**
- Create: `src/theme.css`, `src/lib/cn.ts`, `src/lib/cn.test.ts`, `src/lib/palette.ts`, `src/lib/palette.test.ts`

**Interfaces:**
- Produces:
  - `cn(...inputs: ClassValue[]): string`
  - `type FillColor = "red" | "yellow" | "blue" | "navy" | "sky" | "pink" | "orange" | "ink" | "paper"`
  - `FILL_CLASSES: Record<FillColor, string>` (bg + text pair)
  - `BG_CLASSES: Record<FillColor, string>` (bg only)
  - `TEXT_ON: Record<FillColor, "ink" | "paper">`
  - `HEX: Record<FillColor, string>`

**Token values** (`@theme` in `theme.css`; adjusted from `style-analysis.md` §5 to pass contrast):

| Token | Value | Token | Value |
|---|---|---|---|
| `--color-bh-paper` | `#F4EFE6` | `--color-bh-navy` | `#1A2340` |
| `--color-bh-paper-white` | `#FFFFFF` | `--color-bh-sky` | `#00A8FC` |
| `--color-bh-ink` | `#111111` | `--color-bh-pink` | `#FF77A8` |
| `--color-bh-charcoal` | `#464646` | `--color-bh-orange` | `#F06030` |
| `--color-bh-rule` | `#E5E5E5` | `--color-bh-teal` | `#0C3C54` |
| `--color-bh-muted` | `#B5B5B5` (decoration only) | `--color-bh-khaki` | `#B4A890` |
| `--color-bh-muted-text` | `#6E6A64` | `--color-bh-red` | `#EA4535` |
| `--color-bh-yellow` | `#F5B62A` | `--color-bh-blue` | `#1F5FD8` |

- **Fonts:**
  - `--font-bh-display: "Outfit", "Jost", ui-sans-serif, system-ui, sans-serif`
  - `--font-bh-body: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif`
  - `--font-bh-mono: ui-monospace, monospace`
- **Shadows:** `--shadow-bh-hard: 4px 4px 0 0 var(--color-bh-ink)`, and `--shadow-bh-hard-lg: 8px 8px 0 0 var(--color-bh-ink)`.
- **Spin:** `--animate-bh-spin: bh-spin 8s linear infinite`, with `@keyframes bh-spin { to { transform: rotate(360deg) } }` declared inside `@theme`.
- **Durations:** `--default-transition-duration` stays at the Tailwind default. Components use `duration-150`.

**`TEXT_ON` (contrast-verified):** red→ink, yellow→ink, blue→paper, navy→paper, sky→ink, pink→ink, orange→ink, ink→paper, paper→ink.

- [ ] **Step 1: Write the failing `palette.test.ts`.**
  - `it("every fill/text pair meets WCAG AA 4.5:1")` computes the WCAG contrast of `HEX[c]` against `HEX[TEXT_ON[c]]` for every `FillColor` and expects ≥ 4.5. The relative-luminance helper lives in the test file.
  - `it("HEX matches theme.css")` reads `src/theme.css` with `fs`, and for each colour expects the file to contain `--color-bh-${c}: ${HEX[c]}`, case-insensitive.
  - `it("FILL_CLASSES are literal bg+text pairs")` expects `FILL_CLASSES.blue` to be `"bg-bh-blue text-bh-paper"`.
- [ ] **Step 2: Write the failing `cn.test.ts`.** Each later class must win:
  - `cn("bg-bh-red", "bg-bh-blue")` → `"bg-bh-blue"`
  - `cn("text-bh-ink", "text-bh-paper")` → `"text-bh-paper"`
  - `cn("font-bh-display", "font-bh-body")` → `"font-bh-body"`
  - `cn("shadow-bh-hard", "shadow-none")` → `"shadow-none"`
  - `cn("animate-bh-spin", "animate-none")` → `"animate-none"`
  - `cn("text-bh-ink", "text-xl")` → `"text-bh-ink text-xl"` (colour and size must NOT conflict)
- [ ] **Step 3:** Run `npm test`. Expected: both files FAIL (the modules are missing).
- [ ] **Step 4:** Write `theme.css`, `palette.ts`, and `cn.ts`, which uses `extendTailwindMerge` registering the `bh-*` theme colours, fonts, shadows and animations.
- [ ] **Step 5:** Run `npm test` → PASS.
- [ ] **Step 6: Commit** with `feat: add bh design tokens, fill palette and cn helper`.

### Task 3: `Container` and `Grid`

**Files:** `src/components/primitives/{Container,Grid}/*`

**Interfaces:**
- `Container(props: ComponentProps<"div"> & { as?: "div" | "section" | "main" | "header" | "footer" })`: `mx-auto w-full max-w-7xl px-4 md:px-8`.
- `Grid(props: ComponentProps<"div"> & { cols?: 1|2|3|4|5|6|12; gap?: "none" | "sm" | "md" | "lg"; ruled?: boolean })`:
  - Defaults: `cols=12`, `gap="md"`.
  - `cols` → a literal map of `grid-cols-{n} ` classes.
  - `ruled` → `gap-px bg-bh-rule border border-bh-rule` on the grid, and `[&>*]:bg-bh-paper` on its children. That gives the 1px inner rules plus the outer border, and it forces `gap="none"`.

- [ ] **Step 1: Write the failing tests.**
  - `Container` renders the `as` element and merges `className` (`cn` winner).
  - `Grid` with `cols={5}` has the class `grid-cols-5`.
  - `ruled` adds `border-bh-rule` and `gap-px`.
  - It passes `aria-label` through.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement and add stories (Grid: plain, ruled 5×4 like `aboutUs`).
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** with `feat: add Container and Grid primitives`.

### Task 4: `DisplayHeading` and `HighlightText`

**Files:** `src/components/primitives/{DisplayHeading,HighlightText}/*`

**Interfaces:**
- `DisplayHeading(props: ComponentProps<"h1"> & { as?: "h1" | "h2" | "h3"; size?: "xl" | "2xl" | "3xl" | "4xl"; echo?: boolean })`:
  - Default `as="h2"`, `size="2xl"`.
  - Sizes: `text-5xl` / `text-7xl` / `text-8xl` / `text-9xl` (`md:` breakpoints allowed).
  - Classes: `font-bh-display font-extrabold uppercase leading-[0.9] tracking-tight`.
  - `echo` renders the text a second time in an absolutely positioned `<span aria-hidden="true">`, offset down by `0.12em` with `text-bh-sky` (Modulo).
- `HighlightText(props: ComponentProps<"p">)`: `font-bh-body text-bh-muted-text`.
  - `HighlightText.Mark(props: ComponentProps<"strong">)`: `text-bh-ink font-[inherit]`. It renders a `<strong>` so the emphasis is semantic.

- [ ] **Step 1: Write the failing tests.**
  - `getByRole("heading", { level: 1, name: "School" })` resolves exactly once when `as="h1"` and `echo` are set. This is Review Focus #2: the accessible name is "School", not "School School".
  - The echo span has `aria-hidden="true"`.
  - `HighlightText` with a `Mark` child renders a `strong` containing the marked text.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement and add stories (the `Manifesto` paragraph; `SCHOOL` with echo).
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** with `feat: add DisplayHeading and HighlightText`.

### Task 5: `ButtonPlayful` and `IconButtonPlayful`

**Files:** `src/components/playful/{ButtonPlayful,IconButtonPlayful}/*`

**Interfaces:**
- `type ButtonPlayfulProps = { variant?: "solid" | "outline" | "color"; color?: FillColor; size?: "sm" | "md" | "lg"; disabled?: boolean; className?: string; children: ReactNode } & ( ({ href?: undefined } & ComponentProps<"button">) | ({ href: string } & ComponentProps<"a">) )`
  - Defaults: `variant="solid"`, `size="md"`, `color="yellow"` (only used by `color`).
  - Base classes: `inline-flex items-center gap-2 rounded-full font-bh-display font-bold uppercase tracking-wide transition-transform duration-150` plus the focus classes from Global Constraints.
  - Variants:
    - `solid` → `bg-bh-ink text-bh-paper`
    - `outline` → `border-2 border-bh-ink text-bh-ink bg-transparent`
    - `color` → `FILL_CLASSES[color]` + `border-2 border-bh-ink`
  - Hover (all variants): `hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-bh-hard`.
  - Sizes: `sm` = `h-8 px-4 text-xs`, `md` = `h-11 px-6 text-sm`, `lg` = `h-14 px-8 text-base`.
  - A `<button>` defaults to `type="button"`.
- `IconButtonPlayful(props: Omit<ComponentProps<"button">, "aria-label"> & { "aria-label": string; variant?: "solid" | "outline"; size?: "sm" | "md" | "lg"; children: ReactNode })`:
  - Square `rounded-full`, sizes `size-8` / `size-11` / `size-14`.
  - `aria-label` is required in the type.

- [ ] **Step 1: Write the failing tests.**
  - Without `href` it renders `button` with `type="button"`.
  - With `href` it renders `link` with that `href`.
  - **With `href` and `disabled`** (Review Focus #3): the link has no `href` attribute, has `aria-disabled="true"` and `tabindex="-1"`, and clicking does not call `onClick`.
  - A `disabled` button is `toBeDisabled()`.
  - `variant="color" color="blue"` has `bg-bh-blue` and `text-bh-paper`.
  - `className="bg-bh-red"` overrides the solid background.
  - `IconButtonPlayful`: `getByRole("button", { name: "Next" })` works with `aria-label="Next"` (Review Focus #4).
  - Add a type test: `// @ts-expect-error` on `<IconButtonPlayful>→</IconButtonPlayful>`, checked by `npm run typecheck`.
- [ ] **Step 2:** Run `npm test && npm run typecheck` → FAIL.
- [ ] **Step 3:** Implement and add stories for every variant × size, including the colour variant across the full `FillColor` palette.
- [ ] **Step 4:** Run `npm test && npm run typecheck` → PASS.
- [ ] **Step 5: Commit** with `feat: add ButtonPlayful and IconButtonPlayful`.

### Task 6: `ArrowLink` and `TagPlayful`

**Files:** `src/components/primitives/ArrowLink/*`, `src/components/playful/TagPlayful/*`

**Interfaces:**
- `ArrowLink(props: ComponentProps<"a"> & { href: string; direction?: "right" | "up-right"; size?: "sm" | "md" | "lg" | "hero" })`:
  - Arrow glyph: `→` for right, `↗` for up-right, in a `<span aria-hidden="true">`.
  - Classes: `inline-flex items-baseline gap-[0.25em] font-bh-display font-bold text-bh-ink underline-offset-4 hover:underline`.
  - Sizes: `text-sm` / `text-lg` / `text-3xl` / `text-6xl md:text-8xl`.
  - On hover the arrow moves: `group-hover:translate-x-1` for right, and `group-hover:translate-x-1 group-hover:-translate-y-1` for up-right.
- `TagPlayful(props: ComponentProps<"span"> & { color?: FillColor })`:
  - Default `color="yellow"`.
  - Classes: `FILL_CLASSES[color]` + `inline-block rounded-none px-2 py-1 font-bh-body text-[11px] font-semibold uppercase tracking-[0.1em]`.

- [ ] **Step 1: Write the failing tests.**
  - `getByRole("link", { name: "Manifesto" })`: the name excludes the arrow.
  - The arrow span is `aria-hidden`.
  - `TagPlayful color="pink"` has `bg-bh-pink text-bh-ink`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement and add stories.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** with `feat: add ArrowLink and TagPlayful`.

### Task 7: `ProjectCardPlayful`

**Files:** `src/components/playful/ProjectCardPlayful/*`

**Interfaces:**
- Consumes: `FILL_CLASSES`, `TagPlayful`.
- `ProjectCardPlayful(props: Omit<ComponentProps<"a">, "title"> & { href: string; color?: FillColor; initial: string; title: string; description?: ReactNode; tag?: { label: string; color?: FillColor }; media?: ReactNode; headingLevel?: 2 | 3 })`
  - Defaults: `color="orange"`, `headingLevel=3`.
  - **Structure:** the root is a single `<a>`, `flex flex-col rounded-none p-6 min-h-96` + `FILL_CLASSES[color]`, and the whole card is the link.
  - **Content, in order:**
    - an optional `TagPlayful`
    - the initial: `font-bh-display text-8xl font-extrabold leading-none`, `aria-hidden`
    - the heading (`h{headingLevel}`, `font-bh-display text-xl font-bold uppercase`)
    - the description
    - `media`, wrapped in `aria-hidden`
    - a bottom-left `→`, `aria-hidden`
  - Hover: `hover:shadow-bh-hard-lg hover:-translate-x-1 hover:-translate-y-1`. Focus: the Global Constraints classes.
  - The accessible name comes from `aria-labelledby` pointing at the heading's `useId()` id.

- [ ] **Step 1: Write the failing tests.**
  - There is exactly one `link`, named "Tools" when `title="Tools"`; the initial "T" is not in the name.
  - The link contains a level-3 heading "Tools".
  - `color="blue"` → `text-bh-paper`.
  - `media` is inside an `aria-hidden` element.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement and add a story recreating the `Mijonju` T/A/P/E/R row inside a `Grid cols={5} gap="none"`.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** with `feat: add ProjectCardPlayful`.

### Task 8: `Shape`, `ShapeMosaic` and `Stamp` (decoration)

**Files:** `src/components/decoration/{Shape,ShapeMosaic,Stamp}/*`

**Interfaces:**
- `type ShapeKind = "circle" | "quarter" | "half" | "triangle" | "square" | "bar"`
- `Shape(props: ComponentProps<"div"> & { kind: ShapeKind; color?: FillColor; rotate?: 0 | 90 | 180 | 270; spin?: boolean })`:
  - Default `color="red"`, `rotate=0`. Always `aria-hidden="true"`.
  - It fills its box; the consumer sizes it with `className` (`size-24`, etc.).
  - Kind → literal class map:
    - circle: `rounded-full`
    - quarter: `rounded-tl-full`
    - half: `rounded-t-full h-1/2` inside the box (a builder's choice that works visually is fine)
    - triangle: `[clip-path:polygon(50%_0,100%_100%,0_100%)]`
    - square: `rounded-none`
    - bar: `rounded-full h-1/4`
  - The background comes from `BG_CLASSES`. `rotate` maps to `rotate-0` / `rotate-90` / `rotate-180` / `-rotate-90`.
  - `spin` adds `motion-safe:animate-bh-spin`, and **only** that class (Review Focus #5).
- `type MosaicTile = { kind: ShapeKind; color: FillColor; rotate?: 0 | 90 | 180 | 270; background?: FillColor }`
- `ShapeMosaic(props: ComponentProps<"div"> & { cols: 2|3|4|5|6; tiles: MosaicTile[] })`:
  - A grid with no gap (literal `grid-cols-*` map). Each tile is an `aspect-square` cell with `BG_CLASSES[background ?? "paper"]` holding a `Shape`.
  - The root is `aria-hidden`.
- `Stamp(props: ComponentProps<"div"> & { text: string; spin?: boolean; color?: FillColor })`:
  - An SVG circle `textPath` (`useId` for the path id) with uppercase text, letter-spacing `0.2em`, `font-bh-display`.
  - The root is `role="img"` with `aria-label={text}`, and the SVG inside is `aria-hidden`.
  - `spin` adds `motion-safe:animate-bh-spin` to the SVG.

- [ ] **Step 1: Write the failing tests.**
  - `Shape kind="quarter" rotate={90} color="sky"` has `rounded-tl-full`, `rotate-90`, `bg-bh-sky` and `aria-hidden="true"`.
  - **The `Shape spin` and `Stamp spin` class lists contain `motion-safe:animate-bh-spin`, and NO class that starts with `animate-`.**
  - `ShapeMosaic` with 8 tiles renders 8 cells.
  - `Stamp text="Open source mindset"` → `getByRole("img", { name: "Open source mindset" })`.
  - Two `Stamp`s on one page have different path ids.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement and add stories: every kind × rotation, the `Modulo` hero mosaic (4×3, navy/sky/orange/pink/paper) and a spinning stamp.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** with `feat: add Shape, ShapeMosaic and Stamp decorations`.

### Task 9: `TopBarPlayful` and `FooterPlayful`

**Files:** `src/components/playful/{TopBarPlayful,FooterPlayful}/*`

**Interfaces:**
- `TopBarPlayful(props: ComponentProps<"header"> & { brand: ReactNode; meta?: ReactNode[]; action?: ReactNode })`:
  - The root is a `<header>` with `flex border-b border-bh-ink bg-bh-paper`.
  - Children are cells separated by `divide-x divide-bh-ink`: the brand cell (`px-4 py-3`), each meta cell (`hidden md:block px-4 py-3 text-[11px] uppercase tracking-[0.1em]`), and the action cell pushed right (`ml-auto`).
  - Mobile shows brand + action only.
- `FooterPlayful(props: ComponentProps<"footer"> & { columns: ReactNode[]; bottom?: ReactNode })`:
  - The root is a `<footer>` with a `Grid ruled` containing one cell per column (`cols` = `columns.length` clamped to the allowed set, mapped via a literal map).
  - An optional `bottom` row has `text-[11px] uppercase tracking-[0.1em]`.

- [ ] **Step 1: Write the failing tests.**
  - `TopBarPlayful` renders `banner` with the brand text and each meta node.
  - The action is the last cell.
  - `FooterPlayful` renders `contentinfo` with 3 columns when given 3 nodes.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement and add stories (the `Mijonju` top bar with `IconButtonPlayful` as the action).
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** with `feat: add TopBarPlayful and FooterPlayful`.

### Task 10: Public barrel, consumer smoke build, README, release prep

**Files:**
- Modify: `src/index.ts`, `src/smoke.test.ts`, `package.json`
- Create: `consumer-smoke/input.css`, `consumer-smoke/check.mjs`, `README.md`, `LICENSE`

**Interfaces:**
- Consumes: every component and type from Tasks 2–9.
- Produces: the public API. It exports all 14 components, the `FillColor`, `ShapeKind` and `MosaicTile` types, `cn` and `VERSION`.

- [ ] **Step 1: Extend the failing smoke test.** For each name `["Container","Grid","DisplayHeading","HighlightText","ArrowLink","ButtonPlayful","IconButtonPlayful","TagPlayful","ProjectCardPlayful","TopBarPlayful","FooterPlayful","Shape","ShapeMosaic","Stamp","cn"]`, expect `typeof lib[name]` to be `"function"`.
- [ ] **Step 2:** Run → FAIL. Then export everything from `src/index.ts`, and run → PASS.
- [ ] **Step 3: Consumer smoke** (Review Focus #1). This pins that the consumer's Tailwind can see every class.
  - `consumer-smoke/input.css` contains `@import "tailwindcss"; @import "../dist/theme.css"; @source "../dist";`.
  - `check.mjs` runs `npm run build`, then `npx @tailwindcss/cli -i consumer-smoke/input.css -o consumer-smoke/out.css`.
  - It asserts that `out.css` contains each of: `.bg-bh-pink`, `.bg-bh-navy`, `.text-bh-paper`, `.grid-cols-5`, `.rounded-tl-full`, `.shadow-bh-hard`, `.motion-safe\:animate-bh-spin`, `@keyframes bh-spin`.
  - It also asserts that no `dist/**/*.js` file contains the substring `` bh-${ ``.
  - Add the script `"smoke": "node consumer-smoke/check.mjs"` and the `consumer-smoke/` exclusion to `.gitignore` for `out.css`.
  - Run `npm run smoke`. Expected: it exits 0 and prints every class as found.
- [ ] **Step 4:** Write the `README.md`:
  - install
  - the 3-line CSS setup from spec §6.1
  - font loading (`@fontsource/outfit`, `@fontsource-variable/inter`)
  - how to override a token
  - the component list
  - the naming rule (`*Playful` now; `*Swiss` and `*Soft` planned)
  
  Add an MIT `LICENSE`.
- [ ] **Step 5: Full verification.** Run `npm test && npm run typecheck && npm run build && npm run smoke && npm run build-storybook && npm pack --dry-run`.
  - Expected: all exit 0.
  - The pack list contains only `dist/**`, `package.json`, `README.md` and `LICENSE`.
- [ ] **Step 6: Commit** with `feat: expose public API and add consumer smoke check`.

Publishing (`npm publish`) is **not** part of this plan. The author runs it manually after reviewing.
