# bauhaus-react Showcase Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `site/`, a static Vite + React showcase for `bauhaus-react`: a landing page that sells the library (live re-skinning hero, mosaic band, look bands) and one docs page per component, all switchable between four looks from a header select.

**Architecture:** `site/` is a separate Vite app with its own configs. It imports the library straight from `src/` through the alias `bauhaus-react` → `../src/index.ts`, so the showcase always matches the source. One `LookProvider` (React context, mirrored to `?look=` and `localStorage`) drives every page. Docs pages are generated from a typed registry plus a build-time props extractor; a test guarantees every exported component has a registry entry.

**Tech Stack:** React 19.3, TypeScript 7 (type-check only), Tailwind CSS 4.3 via `@tailwindcss/vite`, Vite 8, Vitest 5 + jsdom + Testing Library + user-event, `react-router` 7, `react-markdown` + `remark-gfm`, `typescript5` (npm alias of `typescript@5.9.3`, used only by the props extractor), pnpm.

**Spec:** `docs/superpowers/specs/2026-11-21-showcase-site-design.md`. Section numbers (§) below refer to it. `docs/bauhaus-principles.md` is the content source for the principles page.

## Global Constraints

- **Corner rule (§4.1):** one corner style per row. Sharp + circles (Playful, Swiss) or `rounded-bh-soft` 20px (Soft). A Soft component never shares a row with a Playful/Swiss one; Soft always sits in its own full-width container.
- **Colour (§4.2):** theme tokens from `src/theme.css` only, no gradients, no blurred shadows. Kandinsky pairing: yellow ↔ triangle, red ↔ square, blue ↔ circle/quarter/half. Yellow is never a text colour. `bh-accent` red only for text ≥ 24px. `bh-muted` decoration only.
- **Copy:** English, neutral professional tone. Hero headline: "One idea. Three looks."
- **Look values:** `"mix" | "playful" | "swiss" | "soft"`, default `"mix"`. URL key `look`. Storage key `bauhaus-react:look`.
- **Chrome:** header, sidebar and footer always use the Swiss look as the neutral frame.
- **Motion:** every animation (wipe, ripple, tile rotate, kinetic decoration) is off under `prefers-reduced-motion: reduce`; the content change still happens.
- **A11y:** WCAG AA text contrast; all controls keyboard-reachable with `FOCUS_RING` (`src/lib/styles.ts`); decorative layers `aria-hidden`.
- **Responsive:** no horizontal scroll at 360px width.
- **Routing:** clean paths under base `/bauhaus-react/`; `404.html` is a copy of `index.html`.
- **Isolation:** do not modify root `vite.config.ts`, `tsconfig.json`, `vitest.setup.ts`, or the root `test` script. The library's public API does not change.
- **Strict TDD:** every task writes the failing test first. Site test command: `pnpm site:test`.
- **Commits:** conventional commits, no AI attribution lines.

## Review Focus

1. A stale or hand-typed `?look=neon` or a garbage storage value → the site falls back to `mix` and does not crash (Task 2 test `ignores invalid look values`).
2. `localStorage` throws (private mode, blocked storage) → the look still works for the session (Task 2 test `survives storage that throws`).
3. Refreshing or opening a deep link such as `/bauhaus-react/docs/components/nope` → the app loads and shows the site's not-found page, not a blank screen (Task 3 test `unknown routes render NotFound`; Task 12 build check for `404.html`).
4. Reduced motion → switching looks still swaps the hero app immediately, with no wipe element mounted (Task 6 test `skips the wipe under reduced motion`).
5. Narrow screens → the mosaic drops to 6 columns under 768px and 4 under 480px, so tiles stay big and nothing overflows (Task 5 test `uses fewer columns on narrow screens`; Task 12 manual 360px check).

---

## File Structure

```
site/
  index.html                     # mounts #root, favicon link
  vite.config.ts                 # base, alias, tailwind, 404 copy plugin
  vitest.config.ts               # jsdom, setup, include site/src/**/*.test.tsx
  vitest.setup.ts                # jest-dom + matchMedia mock helper
  tsconfig.json
  public/favicon.svg             # the tile mark
  scripts/extract-props.ts       # TS5 compiler API → src/generated/props.json
  src/
    main.tsx                     # router + LookProvider
    styles.css                   # tailwind, theme, @source, fonts
    routes.tsx                   # route table
    look/LookContext.tsx         # LookProvider, useLook, resolveInitialLook
    look/useReducedMotion.ts
    shell/SiteHeader.tsx         # TileMark + nav + LookSelect
    shell/TileMark.tsx
    shell/LookSelect.tsx
    shell/SiteLayout.tsx         # header + <Outlet/> + footer
    pages/NotFound.tsx
    landing/LandingPage.tsx
    landing/hero/Hero.tsx
    landing/hero/heroKit.ts      # look → component set
    landing/hero/ShapeWipe.tsx
    landing/mosaic/mosaic.ts     # modules, tileAt, palettes
    landing/mosaic/MosaicBand.tsx
    landing/bands/LookBands.tsx  # + PlayfulBand/SwissBand/SoftBand.tsx
    landing/PrinciplesStrip.tsx
    landing/InstallSteps.tsx
    docs/registry/types.ts
    docs/registry/index.ts       # merges the group files below
    docs/registry/{actions,forms,overlays,navigation,data,media,layout,decoration}.tsx
    docs/DocsLayout.tsx          # sidebar + outlet + toc
    docs/ComponentPage.tsx
    docs/LookRow.tsx
    docs/Playground.tsx
    docs/PropsTable.tsx
    docs/pages/{Install,Theme,MixingLooks,Principles,Colour}.tsx
    generated/props.json         # git-ignored, produced by extract-props
```

---

### Task 1: Site scaffold

**Files:**
- Create: `site/index.html`, `site/vite.config.ts`, `site/vitest.config.ts`, `site/vitest.setup.ts`, `site/tsconfig.json`, `site/src/main.tsx`, `site/src/styles.css`, `site/src/App.test.tsx`
- Modify: `package.json` (scripts + devDeps), `.gitignore` (add `site/dist/`, `site/src/generated/`)

**Interfaces:**
- Produces: alias `bauhaus-react` → `src/index.ts` in Vite and Vitest; `site/vitest.setup.ts` exports `mockMatchMedia(matches: Record<string, boolean>): void`.

- [ ] **Step 1: Add dependencies**
Run: `pnpm add -D react-router@^7 react-markdown@^10 remark-gfm@^4 typescript5@npm:typescript@5.9.3`
Expected: install succeeds; `package.json` lists the four devDeps.

- [ ] **Step 2: Write the failing test** `site/src/App.test.tsx`
```tsx
import { render, screen } from "@testing-library/react";
import { ButtonPlayful } from "bauhaus-react";
test("resolves the library alias to src", () => {
  render(<ButtonPlayful>Go</ButtonPlayful>);
  expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
});
```

- [ ] **Step 3: Run it to verify it fails**
Run: `pnpm site:test` — Expected: FAIL (script or alias missing).

- [ ] **Step 4: Create the configs**
- `site/vite.config.ts`: `root: site/`, `base: "/bauhaus-react/"`, plugins `react()`, `tailwindcss()`, and a `closeBundle` plugin copying `dist/index.html` → `dist/404.html`; `resolve.alias["bauhaus-react"] = resolve(__dirname, "../src/index.ts")`; `build.outDir: "dist"`.
- `site/vitest.config.ts`: same alias, `environment: "jsdom"`, `globals: true`, `setupFiles: ["./vitest.setup.ts"]`, `include: ["src/**/*.test.{ts,tsx}"]`.
- `site/vitest.setup.ts`: imports `@testing-library/jest-dom/vitest`, defines `mockMatchMedia` (stubs `window.matchMedia` returning `matches[query] ?? false`) and calls `mockMatchMedia({})` in `beforeEach`.
- `site/tsconfig.json`: copy root compiler options; `paths: { "bauhaus-react": ["../src/index.ts"] }`; include `src`, `scripts`, the two configs.
- `site/src/styles.css`: `@import "tailwindcss"; @import "../../src/theme.css"; @source "../../src"; @source "./";` plus the font imports listed in README "Fonts".
- `site/index.html` + `site/src/main.tsx`: render `<App/>` placeholder into `#root`, import `styles.css`.
- Root scripts: `"site:dev": "vite --config site/vite.config.ts"`, `"site:build": "pnpm site:props && vite build --config site/vite.config.ts"`, `"site:preview": "vite preview --config site/vite.config.ts"`, `"site:test": "pnpm site:props && vitest run --config site/vitest.config.ts"`, `"site:typecheck": "tsc -p site/tsconfig.json"`. Define `"site:props": "node --experimental-strip-types site/scripts/extract-props.ts"` and create that file as a stub writing `{}` to `site/src/generated/props.json` (Task 8 fills it in).

- [ ] **Step 5: Run tests and type-check**
Run: `pnpm site:test && pnpm site:typecheck && pnpm test`
Expected: site test PASS; type-check clean; the library suite is unchanged and passes.

- [ ] **Step 6: Commit** — `git commit -m "feat(site): scaffold showcase app"`

---

### Task 2: Look state

**Files:**
- Create: `site/src/look/LookContext.tsx`, `site/src/look/useReducedMotion.ts`, `site/src/look/LookContext.test.tsx`

**Interfaces:**
- Produces:
  - `type Look = "mix" | "playful" | "swiss" | "soft"`; `const LOOKS: readonly Look[]`; `type SingleLook = Exclude<Look, "mix">`
  - `resolveInitialLook(search: string, storage: Pick<Storage, "getItem"> | null): Look`
  - `<LookProvider>` (reads `useSearchParams` from react-router), `useLook(): { look: Look; setLook(next: Look): void }`
  - `useReducedMotion(): boolean`

- [ ] **Step 1: Write the failing tests**
- `url beats storage`: `resolveInitialLook("?look=swiss", storageWith("soft"))` → `"swiss"`.
- `storage beats default`: `resolveInitialLook("", storageWith("soft"))` → `"soft"`.
- `defaults to mix`: `resolveInitialLook("", null)` → `"mix"`.
- `ignores invalid look values`: `resolveInitialLook("?look=neon", storageWith("garbage"))` → `"mix"`.
- `survives storage that throws`: a storage whose `getItem` throws → `"mix"`; and rendering `LookProvider` and calling `setLook("soft")` with a `setItem` that throws still updates `useLook().look` to `"soft"`.
- `setLook writes url and storage`: inside a `MemoryRouter`, `setLook("playful")` → location search contains `look=playful` and storage `bauhaus-react:look` = `"playful"`; `setLook("mix")` removes the `look` param.
- `useReducedMotion follows the media query`: with `mockMatchMedia({"(prefers-reduced-motion: reduce)": true})` → `true`.

- [ ] **Step 2: Run to verify they fail** — `pnpm site:test` → FAIL (module not found).
- [ ] **Step 3: Implement** the interfaces above. All storage access in try/catch. `setLook` uses `setSearchParams(..., { replace: true })`, keeping other params.
- [ ] **Step 4: Run to verify they pass** — `pnpm site:test` → PASS.
- [ ] **Step 5: Commit** — `feat(site): add look state with url and storage sync`

---

### Task 3: Router, shell, icon and look select

**Files:**
- Create: `site/src/routes.tsx`, `site/src/shell/{SiteLayout,SiteHeader,TileMark,LookSelect}.tsx`, `site/src/pages/NotFound.tsx`, `site/public/favicon.svg`, `site/src/shell/shell.test.tsx`
- Modify: `site/src/main.tsx`, `site/index.html` (favicon link)

**Interfaces:**
- Consumes: `LookProvider`, `useLook`, `LOOKS` (Task 2).
- Produces: `routes: RouteObject[]` with paths `/`, `/docs/getting-started/:page`, `/docs/principles`, `/docs/colour`, `/docs/components/:slug`, `*`. Pages not built yet render a placeholder `<h1>` with the page name. `<TileMark size?: number; onDark?: boolean />`.

- [ ] **Step 1: Write the failing tests**
- `TileMark obeys the pairing`: rendered SVG has a `rect` filled `#ea4535`, a `path` filled `#1f5fd8`, a `polygon` filled `#f5b62a`, a `circle` filled `#111` (and `#f4efe6` with `onDark`); geometry exactly as spec §4.3.
- `look select changes the look`: render routes in a `MemoryRouter` at `/`; choose "Swiss" in the select labelled "Look" with user-event → the URL search has `look=swiss` and the select shows "Swiss".
- `look select is keyboard operable`: Tab reaches the select; Enter/ArrowDown/Enter picks a new option.
- `header nav links`: links "Docs" → `/docs/getting-started/install`, "Colour" → `/docs/colour`, "GitHub" → `https://github.com/romen2232/bauhaus-react`.
- `unknown routes render NotFound`: at `/docs/components/nope` and `/zzz` → heading "Page not found" and a link home.

- [ ] **Step 2: Run to verify they fail.**
- [ ] **Step 3: Implement.** `LookSelect` dogfoods `SelectSwiss` with options Mix, Playful, Swiss, Soft. `SiteHeader` uses Swiss styling (hairline bottom rule, ink on paper-white), `TileMark` + `Wordmark`-style text "bauhaus-react" in `font-bh-display`. `main.tsx`: `createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })`, `LookProvider` inside the root layout route (it needs router context). `favicon.svg` = spec §4.3 SVG. The component page's unknown `:slug` also renders `NotFound`.
- [ ] **Step 4: Run to verify they pass.**
- [ ] **Step 5: Commit** — `feat(site): add router, header, tile mark and look select`

---

### Task 4: Mosaic model

**Files:**
- Create: `site/src/landing/mosaic/mosaic.ts`, `site/src/landing/mosaic/mosaic.test.ts`

**Interfaces:**
- Produces:
  - `type MosaicShape = "quarter" | "circle" | "half" | "tri" | "bar" | "none"`
  - `type Hue = "paper" | "white" | "ink" | "red" | "yellow" | "blue"`
  - `type Tile = { ground: Hue; shape: MosaicShape; color: Hue | null; rotate: 0 | 90 | 180 | 270 }`
  - `const MODULES: readonly [Tile, Tile, Tile, Tile][]` (exactly the four modules in spec §7.3, in order TL, TR, BL, BR)
  - `tileAt(x: number, y: number): Tile` (formula `MODULES[((x>>1) + (y>>1)*3) % 4][(y%2)*2 + (x%2)]`)
  - `const LOOK_PALETTES: Record<SingleLook, Record<Hue, string>>` (hex). Playful: paper `#f4efe6`, white `#ffffff`, ink `#111111`, red `#ea4535`, yellow `#f5b62a`, blue `#1f5fd8`. Swiss: paper/white → `#ffffff`, ink/blue/yellow → `#111111`, red → `#ea4535`. Soft: paper/white → `#f4efe6`, ink/blue → `#464646`, yellow → `#f5cf8a`, red → `#ea4535`. Mix uses Playful.

- [ ] **Step 1: Write the failing tests**
- `modules match the spec`: `MODULES[0][0]` deep-equals `{ ground: "paper", shape: "quarter", color: "blue", rotate: 90 }`, `MODULES[3][3]` deep-equals `{ ground: "paper", shape: "bar", color: "ink", rotate: 0 }` (spot-check one tile per module).
- `tileAt places modules`: `tileAt(0,0)` = `MODULES[0][0]`; `tileAt(3,1)` = `MODULES[1][3]`; `tileAt(0,2)` = `MODULES[3][0]`.
- `colour is bound to shape`: over every tile in `MODULES`, circle-family shapes have `color === "blue"`, `tri` has `"yellow"`, `none` has `null`; every ground is in `{paper, white, ink, red}`.
- `binding survives every palette`: for each look, all circle-family tiles resolve to one hex and all triangles to one hex.
- `swiss uses red as the only hue`: every value of `LOOK_PALETTES.swiss` is in `{#ffffff, #111111, #ea4535}`.

- [ ] **Step 2: Run to verify they fail.**
- [ ] **Step 3: Implement** `mosaic.ts` with the data and functions above.
- [ ] **Step 4: Run to verify they pass.**
- [ ] **Step 5: Commit** — `feat(site): add mosaic module model and palettes`

---

### Task 5: Mosaic band

**Files:**
- Create: `site/src/landing/mosaic/MosaicBand.tsx`, `site/src/landing/mosaic/MosaicBand.test.tsx`

**Interfaces:**
- Consumes: `tileAt`, `LOOK_PALETTES` (Task 4), `useLook`, `useReducedMotion` (Task 2).
- Produces: `<MosaicBand rows?: number />` (default 4 rows).

**Design note:** tiles are site-owned inline SVGs (viewBox 0 0 100 100) with the exact geometry in spec §7.3, not `Shape`/`ShapeMosaic`: the library's `Shape` triangle is isosceles, its bar is a rounded pill, and `FillColor` has no white ground. This is composition in the site, as §7.3 allows; the library is untouched.

- [ ] **Step 1: Write the failing tests**
- `is decorative`: the band root has `aria-hidden="true"`.
- `renders 12 x 4 tiles on desktop`: default matchMedia → 48 tile elements (`data-testid="mosaic-tile"`).
- `uses fewer columns on narrow screens`: `mockMatchMedia({"(max-width: 767px)": true})` → 24 tiles (6 cols); `{"(max-width: 479px)": true, "(max-width: 767px)": true}` → 16 tiles (4 cols).
- `follows the look palette`: with look `swiss`, no tile background or shape fill is `#1f5fd8` or `#f5b62a`.
- `rotates a tile on hover`: hovering a tile with motion allowed increases its `data-rotate` by 90; with reduced motion, `data-rotate` still changes but the tile has no `transition` class.
- `ripples in on load only with motion`: tiles carry a staggered `animation-delay` style (`(x+y)*40ms`) unless reduced motion.

- [ ] **Step 2: Run to verify they fail.**
- [ ] **Step 3: Implement.** Columns from `matchMedia` (12 / 6 / 4), full-bleed CSS grid, square tiles. Rotation via `transform: rotate()` on the inner `<g>` with `motion-safe:transition-transform`. Tiles are pointer-hover only (decorative, no tab stops).
- [ ] **Step 4: Run to verify they pass.**
- [ ] **Step 5: Commit** — `feat(site): add interactive mosaic band`

---

### Task 6: Hero with live re-skinning mini-app

**Files:**
- Create: `site/src/landing/hero/{Hero,ShapeWipe}.tsx`, `site/src/landing/hero/heroKit.ts`, `site/src/landing/hero/Hero.test.tsx`

**Interfaces:**
- Consumes: `useLook`, `useReducedMotion`, `SingleLook`.
- Produces: `heroLook(look: Look): SingleLook` (`mix` → `"playful"`, else identity); `HERO_KIT: Record<SingleLook, { Card; Sparkline; AudioPlayer; ToastRegion; Button }>` mapping to the library's per-look components (e.g. `CardSoft`, `SparklineSoft`, `AudioPlayerSoft`, `ToastRegionSoft`, `ButtonSoft`); `<Hero />`; `<ShapeWipe kind: "circle" | "square" | "triangle"; onDone(): void />`.

- [ ] **Step 1: Write the failing tests**
- `heroLook maps mix to playful`.
- `renders the headline`: heading level 1 with text "One idea. Three looks.".
- `mini-app follows the look`: with look `soft`, the app container has `data-look="soft"` and contains a `ButtonSoft`-rendered button (assert on the `data-look` and a Soft-only token class such as `rounded-bh-soft` inside the app); switching to `swiss` updates `data-look`.
- `skips the wipe under reduced motion`: reduced motion on, switch look → no element `data-testid="shape-wipe"` mounted and `data-look` updates synchronously.
- `wipes with motion`: motion allowed, switch look → `shape-wipe` mounts; after firing `animationend` it unmounts and `data-look` is the new look.
- `try it cycles looks`: clicking "Try it" advances the look playful → swiss → soft → mix.
- `shows the install command`: text `pnpm add bauhaus-react` is present with a copy button.

- [ ] **Step 2: Run to verify they fail.**
- [ ] **Step 3: Implement.** Layout: two columns on ≥ 768px (giant `DisplayHeading` left, mini-app right on a blue `bh-blue` field with a yellow circle accent), stacked below. Mini-app content: a stat card "Visits this week · 2,376" with a sparkline, an audio player, a toast fired once on mount and again on each look change (use a local `createToastQueue()` instance per mount), and one primary button. `ShapeWipe`: an absolutely positioned shape scaling over the app via CSS keyframes (~600ms); swap the rendered look at the midpoint, unmount on `animationend`. Wipe shape cycles circle → square → triangle per switch, coloured by the pairing.
- [ ] **Step 4: Run to verify they pass.**
- [ ] **Step 5: Commit** — `feat(site): add hero with live re-skinning mini-app`

---

### Task 7: Look bands and the rest of the landing

**Files:**
- Create: `site/src/landing/bands/{LookBands,PlayfulBand,SwissBand,SoftBand}.tsx`, `site/src/landing/{PrinciplesStrip,InstallSteps,LandingPage}.tsx`, `site/src/landing/LandingPage.test.tsx`
- Modify: `site/src/routes.tsx` (`/` → `LandingPage`)

**Interfaces:**
- Consumes: `Hero`, `MosaicBand`, `useLook`.
- Produces: `<LookBands />`; `PRINCIPLES: { id: "p1".."p11"; title: string }[]` exported from `PrinciplesStrip.tsx` (titles = the `### P<n>.` headings of `docs/bauhaus-principles.md`, without the `P<n>.` prefix).

- [ ] **Step 1: Write the failing tests**
- `landing order`: in DOM order — hero heading, mosaic band, bands region, principles region (heading "Principles"), install region (heading "Install in 3 steps"), link "Read the docs".
- `mix shows three bands`: three regions labelled "Playful", "Swiss", "Soft".
- `single look shows one band`: look `swiss` → only the "Swiss" region, with `data-size="large"`.
- `soft band is isolated`: the Soft region's root has `rounded-bh-soft` and is a direct child of the bands container (never inside a row with the others).
- `principles strip links`: 11 links, the first `href` ends `/docs/principles#p1`.
- `install steps`: three `<pre>` blocks containing `pnpm add bauhaus-react`, `@import "bauhaus-react/theme.css";`, and an `import { ButtonPlayful } from "bauhaus-react"` usage.

- [ ] **Step 2: Run to verify they fail.**
- [ ] **Step 3: Implement.** Each band is a believable screen made only of library components: Playful = studio portfolio (`TopBarPlayful`, `ProjectCardPlayful` grid, `TagPlayful`, `ButtonPlayful`, a `Composition`), Swiss = editorial article (`DisplayHeading`, `SectionLabel`, `QuoteBlock`, `RuledList`, `TabsSwiss`, `TableSwiss`), Soft = product dashboard (`CardSoft`, `BarChartSoft`, `DonutChartSoft`, `SwitchSoft`, `DateStripSoft`, `BottomNavSoft`). Copy is the builder's.
- [ ] **Step 4: Run to verify they pass.**
- [ ] **Step 5: Commit** — `feat(site): add look bands, principles strip and install steps`

---

### Task 8: Props extractor

**Files:**
- Modify: `site/scripts/extract-props.ts` (replace the stub)
- Create: `site/scripts/extract-props.test.ts`

**Interfaces:**
- Produces: `extractProps(entry: string, names: string[]): Record<string, PropDoc[]>` and the generated `site/src/generated/props.json` keyed by export name.
  `type PropDoc = { name: string; type: string; required: boolean; defaultValue: string | null; description: string; inherited: false } | { inherited: true; from: "dom" | "react-aria"; count: number }`

**Why TS5:** the repo's TypeScript 7 ships no JS compiler API (`node_modules/typescript/lib` contains only the launcher), so the extractor imports `typescript5`.

- [ ] **Step 1: Write the failing tests** (run against real source)
- `extracts own props`: `extractProps("src/index.ts", ["ButtonPlayful"]).ButtonPlayful` contains `{ name: "href", required: false }` and a `color` prop whose `type` lists `"red"`.
- `collapses inherited props`: the same result has exactly one `inherited: true` entry with `from: "dom"` and `count > 0`, and no own entry named `onClick` or `aria-label`.
- `reads defaults from destructuring`: `extractProps(..., ["Shape"]).Shape` has `rotate` with `defaultValue: "0"` and `color` with `defaultValue: '"red"'`.
- `marks react-aria props`: `extractProps(..., ["TabsSwiss"])` has an `inherited` entry with `from: "react-aria"`.

- [ ] **Step 2: Run to verify they fail.**
- [ ] **Step 3: Implement** with the `typescript5` compiler API: build a `Program` from `site/tsconfig.json`; for each named export get the first call signature's first parameter type; a property is *own* if any declaration lives under `src/`, *inherited* `react-aria` if under `node_modules/react-aria*` or `@react-aria`/`@react-types`, otherwise `dom`. Description from JSDoc; default from the component's parameter destructuring initializer. The CLI collects every PascalCase function export of `src/index.ts` and writes `props.json` (sorted, pretty).
- [ ] **Step 4: Run to verify they pass**, then run `pnpm site:props` and check `site/src/generated/props.json` has an entry for `ButtonSoft`.
- [ ] **Step 5: Commit** — `feat(site): generate props docs from library types`

---

### Task 9: Docs registry and component page

**Files:**
- Create: `site/src/docs/registry/{types,index}.ts`, `site/src/docs/{DocsLayout,ComponentPage,LookRow,Playground,PropsTable}.tsx`, `site/src/docs/registry/registry.test.ts`, `site/src/docs/ComponentPage.test.tsx`
- Create (empty arrays for now): `site/src/docs/registry/{actions,forms,overlays,navigation,data,media,layout,decoration}.tsx`
- Modify: `site/src/routes.tsx`

**Interfaces:**
- Consumes: `useLook`, `props.json` (Task 8), `PRINCIPLES` ids (Task 7).
- Produces:
```ts
type Group = "Actions" | "Forms" | "Overlays" | "Navigation" | "Data & charts" | "Media & cards" | "Layout & type" | "Decoration";
type Control = { prop: string; kind: "text" | "boolean" | "select"; options?: string[]; initial: string | boolean };
type DocEntry = {
  slug: string; title: string; group: Group; purpose: string;
  principles: Array<`p${number}`>;
  looks?: Partial<Record<SingleLook, { exportName: string; demo: (p: Record<string, unknown>) => ReactNode; snippet: string }>>;
  agnostic?: { exportNames: string[]; demo: (p: Record<string, unknown>) => ReactNode; snippet: string };
  controls: Control[]; dos: string[]; donts: string[]; a11y: string[];
};
const REGISTRY: DocEntry[]; function findEntry(slug: string): DocEntry | undefined;
```
Exactly one of `looks` / `agnostic` is set.

- [ ] **Step 1: Write the failing tests**
- `registry.test.ts › every library component is documented`: from `Object.entries(await import("bauhaus-react"))` take functions whose name is PascalCase; every name ending `Playful|Swiss|Soft` must appear as some `looks[*].exportName`, every other one in some `agnostic.exportNames`. The failure message lists the missing names. It is expected to stay red through Tasks 9–11 (each run shows the list shrinking) and must pass at Task 12 Step 4.
- `registry.test.ts › slugs are unique and kebab-case`.
- `ComponentPage › mix shows one row per look` (using a test-only entry passed via a `entry` prop): three rows labelled Playful, Swiss, Soft, in that order, each with its export name and a `<pre>` snippet.
- `ComponentPage › single look filters`: look `soft` → only the Soft row, with `data-size="large"`.
- `ComponentPage › soft row is its own container`: the Soft row has `rounded-bh-soft`; Playful/Swiss rows have no `rounded-*` class.
- `ComponentPage › missing look note`: entry without `soft`, look `soft` → text "Not available in this look".
- `ComponentPage › agnostic entries have one row` in every look.
- `ComponentPage › playground updates every row`: toggling a boolean control re-renders each row's demo with the new prop value (assert via demo output).
- `ComponentPage › props table`: renders own props from `props.json` and one line "Inherits N DOM props" (or "React Aria props", linking to `https://react-spectrum.adobe.com/react-aria/`).
- `DocsLayout › sidebar groups`: headings for all eight groups in order, plus "Get started" links Install, Theme & fonts, Mixing looks; current page link has `aria-current="page"`.
- `DocsLayout › table of contents`: lists Playful, Swiss, Soft (per visible rows), Playground, Props, Do / Don't, Accessibility.

- [ ] **Step 2: Run to verify they fail.**
- [ ] **Step 3: Implement.** Layout per spec §8 (sidebar / main / TOC; on < 1024px the TOC hides and on < 768px the sidebar becomes a disclosure button "Components"). Principle tags link to `/docs/principles#pN`. Route `/docs/components/:slug` → `findEntry` or `NotFound`.
- [ ] **Step 4: Run** — all tests except `every library component is documented` pass.
- [ ] **Step 5: Commit** — `feat(site): add docs registry and component page`

---

### Task 10: Registry content — Actions, Forms, Overlays

**Files:**
- Modify: `site/src/docs/registry/{actions,forms,overlays}.tsx`
- Create: `site/src/docs/registry/content.test.tsx`

Grouping (pinned so tasks don't overlap):
- **Actions:** Button, IconButton, TextLink, Chip, Tag
- **Forms:** TextField, TextArea, Select, Checkbox, RadioGroup, Switch, DateStrip, NumberStepper (agnostic)
- **Overlays:** Modal, Toast (`ToastRegion*`), MenuOverlay
- **Navigation:** TopBar, BottomNav, Footer, Tabs, Carousel, Stepper (agnostic), ArrowLink (agnostic)
- **Data & charts:** Table, BarChart, LineChart, DonutChart, Sparkline, BigNumber, StatColumns, ProgressRule, IndexCounter, Timeline (last five agnostic)
- **Media & cards:** AudioPlayer, Card, StackCard, ProjectCard, Avatar, MediaBlock, QuoteBlock (last three agnostic)
- **Layout & type:** Container, Grid, DisplayHeading, HighlightText, SectionLabel, RuledList, Wordmark
- **Decoration:** Composition, KineticRule, Pattern, Ribbon, Shape, ShapeMosaic, SkewBar, Stamp

- [ ] **Step 1: Write the failing test** `content.test.tsx › every entry renders in every look`: for each `REGISTRY` entry and each look, render `ComponentPage` and assert no `console.error` was called and each visible row's demo container is non-empty. Add `expect(REGISTRY.filter(e => ["Actions","Forms","Overlays"].includes(e.group))).toHaveLength(16)`.
- [ ] **Step 2: Run to verify it fails.**
- [ ] **Step 3: Write the 16 entries.** Demos use realistic content, not lorem ipsum. Overlays demos open from a trigger button (Modal, MenuOverlay) or fire a toast from a button (Toast). 2–4 playground controls per entry; 1–3 dos/donts; a11y notes mention keyboard behaviour and any colour constraint.
- [ ] **Step 4: Run to verify it passes**; run `registry.test.ts` and confirm these 16 are gone from the missing list.
- [ ] **Step 5: Commit** — `docs(site): document actions, forms and overlays`

### Task 11: Registry content — Navigation, Data & charts

Same shape as Task 10 for `navigation.tsx` and `data.tsx` (17 entries). Count assertion: those two groups have 17 entries. Chart demos use the same small dataset across looks so the rows compare. Commit: `docs(site): document navigation, data and charts`.

### Task 12: Registry content — Media, Layout & type, Decoration

Same shape as Task 10 for `media.tsx`, `layout.tsx`, `decoration.tsx` (22 entries). Decoration demos respect reduced motion (`KineticRule`, spinning `Shape`).

- [ ] **Step 4 (extra):** `pnpm site:test` — **all** tests pass, including `every library component is documented`.

Commit: `docs(site): document media, layout and decoration`.

---

### Task 13: Getting started, Principles and Colour pages

**Files:**
- Create: `site/src/docs/pages/{Install,Theme,MixingLooks,Principles,Colour}.tsx`, `site/src/docs/pages/pages.test.tsx`
- Modify: `site/src/routes.tsx`

**Interfaces:**
- Consumes: `PRINCIPLES` (Task 7). The Colour page reads token hexes from `HEX` / `SOFT_HEX` / `SWISS_HEX` exported by `bauhaus-react` (not from the mosaic palettes).

- [ ] **Step 1: Write the failing tests**
- `principles renders the research doc`: the page (importing `../../../../docs/bauhaus-principles.md?raw`) shows heading "Unity of the arts, crafts and building" with `id="p1"` and "Experiment and kinetic form" with `id="p11"`, and renders the principle × look table as a `<table>`.
- `install page`: shows the `pnpm add` command and the `@source` line from README.
- `theme page`: shows the font install command and the five `@fontsource` imports from README.
- `mixing looks page`: contains a section "The corner rule" and an example that places a Soft component in its own container.
- `colour page Albers demo`: renders the same red swatch (`#EA4535`, case-insensitive) on four grounds — paper, white, ink, blue — and a swatch picker that changes all four together; lists every token with its hex.
- `getting-started unknown page`: `/docs/getting-started/zzz` → NotFound.

- [ ] **Step 2: Run to verify they fail.**
- [ ] **Step 3: Implement.** Principles uses `react-markdown` + `remark-gfm` with a custom `h3` that turns `P<n>. Title` into `id="p<n>"` and drops the prefix from the visible text. Getting-started copy adapts README sections (do not duplicate the README into a new file; write site copy directly).
- [ ] **Step 4: Run to verify they pass.**
- [ ] **Step 5: Commit** — `docs(site): add getting started, principles and colour pages`

---

### Task 14: Build, static hosting and final checks

**Files:**
- Create: `site/src/build.test.ts`
- Modify: `README.md` (one "Showcase" line linking `https://romen2232.github.io/bauhaus-react/` and the `site:dev` script)

- [ ] **Step 1: Write the failing test** `build.test.ts` (runs `pnpm site:build` once in `beforeAll`, timeout 120s): `site/dist/404.html` exists and is byte-identical to `site/dist/index.html`; `index.html` references assets under `/bauhaus-react/`; `favicon.svg` is in `site/dist`.
- [ ] **Step 2: Run to verify it fails** (if it already passes because Task 1 added the plugin, record that and move on).
- [ ] **Step 3: Fix** whatever the build test exposes.
- [ ] **Step 4: Full verification**
Run: `pnpm site:typecheck && pnpm site:test && pnpm test && pnpm typecheck && pnpm build && pnpm smoke`
Expected: all green; `pnpm build` output in root `dist/` contains no `site/` files.
- [ ] **Step 5: Manual browser check** with `pnpm site:preview`: at 360px width no horizontal scroll on `/`, `/docs/components/button`, `/docs/colour`; switching looks in the header re-skins hero, mosaic and bands; with OS reduced motion on, no wipe or ripple; refresh on `/bauhaus-react/docs/components/table` loads the page. Record results in the commit body.
- [ ] **Step 6: Commit** — `chore(site): verify static build and add showcase link`

Deployment workflow (GitHub Actions → Pages) is out of scope per spec §10.
