# bauhaus-react Showcase Site — Design

Date: 2026-11-21 · Branch: `feat/showcase` · Status: draft for approval

## 1. Intent

A public website for `bauhaus-react` that does two jobs, in this order:

1. **Sell it.** At first glance a visitor should think "wow, I want this on my site". The landing page shows the library *in action*, not documentation.
2. **Teach it.** Behind the landing, one documentation page per component shows every look and explains how to use it.

It is a showcase and usage guide. It is **not** a portfolio, not a product site, and not a replacement for Storybook (Storybook stays as the dev/test workbench).

The site itself must embody the Bauhaus principles researched in `docs/bauhaus-principles.md` (in particular its "Principles for the showcase site" section).

## 2. Goals, non-goals, anti-goals

**Goals**
- A landing page that impresses within 5 seconds and demonstrates the library's core idea: one system, three looks, mixable.
- A header select to switch the whole site between four modes: **Mix** (default), **Playful**, **Swiss**, **Soft**.
- Every exported component appears in the docs with a live demo per look, a code snippet, props, do/don't and accessibility notes.
- Getting-started docs: install, theme & fonts, mixing looks.

**Non-goals**
- No CMS, blog, search backend, analytics, i18n or versioned docs.
- No changes to the library's public API as part of this work (see §9 for the one open library question).
- No server rendering.

**Anti-goals (failure even if it "works")**
- Looks like a spec sheet or a Storybook clone on first load.
- Mixes corner styles within one row (see §4.1).
- Uses colour as decoration rather than material: rainbow palettes, gradients, soft shadows.
- Docs that drift from the code (hand-copied props tables that go stale).

## 3. Approaches considered

| | Approach | Trade-off | Verdict |
|---|---|---|---|
| A | **Vite + React SPA in `site/`** inside this repo, importing components from `src/` via alias | Always in sync with source; same toolchain as the library; static output. Cost: routing + props generation to maintain. | **Chosen** |
| B | Astro / Next.js with MDX | Nice prose authoring, but a second framework, and the live re-skin / mosaic interactions need client React anyway. | Rejected |
| C | Extend Storybook | Cheapest, but cannot deliver the landing "wow" and Storybook chrome frames everything. User wants something distinct from Storybook. | Rejected |

## 4. Design rules (decided by the user)

### 4.1 Corner rule
One corner style per view. **Sharp corners + circles** (Playful, Swiss) **or** the **20px soft radius** (Soft, `--radius-bh-soft`). Never side by side in one row.
Consequence: wherever looks are compared, Soft gets its own full-width row/band with its own rounded container. Playful and Swiss may share a row.

### 4.2 Colour rules
- **Primary + neutral balance:** primaries are focused and intentional against generous neutral grounds (paper `#f4efe6`, white, ink `#111`, charcoal). Applies to the page as a whole; an accent band (the mosaic) may be dense.
- **Form–colour pairing (Kandinsky):** yellow ↔ triangle, red ↔ square, blue ↔ circle family (circle, quarter, half). Treated as a deliberate convention (the principles doc notes it is pedagogical, not proven).
- **Contrast over clutter (Itten):** get energy from light–dark, warm–cool and complementary contrast, not from extra hues. Only theme tokens from `src/theme.css` are used.
- **Relative perception (Albers):** colours are judged side by side, never in isolation. The site has a **Colour** page with a live demo: the same swatch on several grounds.
- Existing token constraints still apply: yellow is fill-only, never text; `bh-accent` red only for text ≥ 24px; `bh-muted` decoration only.

### 4.3 Icon
A **2×2 tile** mark, built from the library's shapes and obeying the pairing:
top-left **red square**, top-right **blue quarter circle**, bottom-left **yellow triangle**, bottom-right **ink circle** (paper circle on dark grounds). Used as favicon (must read at 16px), header lockup with the wordmark `bauhaus-react` in the display font, and on dark. Reference SVG (viewBox 0 0 100 100):
```svg
<rect width="50" height="50" fill="#ea4535"/>
<path d="M50 50 V0 A50 50 0 0 1 100 50z" fill="#1f5fd8"/>
<polygon points="0,100 25,50 50,100" fill="#f5b62a"/>
<circle cx="75" cy="75" r="18" fill="#111"/>
```
The builder may refine proportions but must keep the four shapes, their colours and the 2×2 structure.

### 4.4 Language and copy
All site copy, code and comments in English, neutral professional tone.

## 5. Information architecture

| Route | Page |
|---|---|
| `/` | Landing |
| `/docs/getting-started/install` | Install |
| `/docs/getting-started/theme` | Theme & fonts |
| `/docs/getting-started/mixing-looks` | Mixing looks (explains the corner rule and recommended pairings) |
| `/docs/principles` | Bauhaus principles (rendered from / linking to `docs/bauhaus-principles.md`) |
| `/docs/colour` | Colour (tokens + live Albers demo) |
| `/docs/components/:slug` | One page per component |

Sidebar groups for components: Actions, Forms, Overlays, Navigation, Data & charts, Media, Layout & type, Decoration. Exact assignment of each component to a group is left to the builder.

## 6. The mode system

- State: `look: "mix" | "playful" | "swiss" | "soft"`, default `"mix"`.
- Held in a React context; mirrored to the URL query `?look=` (shareable links) and to `localStorage` (remembered between visits). Precedence: URL > localStorage > default. `localStorage` access wrapped in try/catch.
- Control: a select in the site header on every page, labelled "Look".
- Behaviour per page:
  - **Landing:** see §7.
  - **Component docs:** Mix shows one stacked row per look; a single look filters to that row and enlarges the demo. Look-agnostic components (primitives, decoration) always show one row.
  - **Getting-started / principles / colour pages:** the page chrome follows the selected look where sensible; content unchanged.
- The site chrome itself (header, sidebar, footer) in Mix mode uses the Swiss look (sharp, ink, hairlines) as the neutral frame.

## 7. Landing page

Top to bottom:

1. **Header:** icon + wordmark, nav (Docs · Colour · GitHub), Look select.
2. **Hero (option B, "live app in a poster"):** left: giant display type, e.g. "One idea. Three looks.", one line of copy, a primary CTA ("Try it" scrolls/points at the Look select or cycles looks) and the install command. Right: a **live mini-app** built only from library components: stat card with `Sparkline`/`LineChart`, `AudioPlayer`, a `Toast`, plus one or two controls. Changing the Look re-skins the mini-app live with a **shape "wipe" transition** (a primitive shape sweeps across and reveals the new look). In Mix mode the mini-app uses Playful (sharp corners, so it respects §4.1).
3. **Mosaic band (v3):** full-bleed, built with the library's `ShapeMosaic`/`Shape` (extend via composition in the site if needed, not by changing the library). Rules:
   - Shapes run **edge to edge** and touch across tiles to form larger figures (no small centred shapes, no empty-looking tiles).
   - Composed from a small set of **2×2 modules** that repeat in varied order, so it reads as designed, not random.
   - Colour bound to shape (§4.2). Grounds are **red** (a red square) or neutral (paper, white, ink).
   - Desktop ≈ 12 columns × 4 rows; fewer columns on smaller screens.
   - Interaction: hover/focus rotates a tile by 90°; on load tiles ripple in from top-left.
   - The palette follows the Look: Playful = triad as specified; Swiss = ink/paper plus red only; Soft = sand/charcoal family. In Soft mode the band keeps sharp tiles but sits in its own section so §4.1 holds.
   - Source of truth: the module table below (the brainstorm prototype is git-ignored and not required). Each tile = `[ground, shape, shapeColour, rotation°]`; tiles listed top-left, top-right, bottom-left, bottom-right. Shapes fill the full tile: `quarter` = quarter disc with its corner at bottom-left (radius = tile side), `circle` = full disc (diameter = tile side), `half` = half disc on the bottom edge, `tri` = right triangle filling the bottom-left half, `bar` = band across the top third, `none` = plain ground.
     ```
     M1: [paper, quarter, blue, 90]  [red, none, -, 0]      [ink, half, blue, 0]      [paper, tri, yellow, 0]
     M2: [red, circle, blue, 0]      [paper, quarter, blue, 180] [paper, tri, yellow, 90] [ink, quarter, blue, 270]
     M3: [ink, tri, yellow, 270]     [white, half, blue, 180] [paper, quarter, blue, 0] [red, none, -, 0]
     M4: [paper, half, blue, 90]     [ink, circle, blue, 0]   [red, tri, yellow, 180]   [paper, bar, ink, 0]
     ```
     Placement: tile at column `x`, row `y` uses module `M[((x>>1) + (y>>1)*3) % 4]`, quadrant `(y%2)*2 + (x%2)`. Colours are the Playful palette; other looks remap through a per-look palette table (builder's call) that keeps the shape→hue binding where the look has that hue. *(Builder's call, recorded: "red ground with a blue circle" is allowed because the red ground reads as a red square.)*
4. **Look bands (Mix mode):** three full-width bands, each a believable screen built only from library components: **Playful** (e.g. studio portfolio), **Swiss** (e.g. editorial article), **Soft** (e.g. product dashboard, in its own 20px-radius context). In a single-look mode, the three bands collapse into one larger showcase of that look. Together the bands should exercise most of the catalogue.
5. **Principles strip:** 11 compact cards (P1–P11), each linking to the principles page.
6. **Install in 3 steps:** install, import theme + `@source`, use a component. Copyable code.
7. **Into the docs:** a CTA to the component docs.

## 8. Component docs page

Layout: left sidebar (groups from §5), main column, right "On this page" table of contents.

Main column, in order:
1. Title (display type) + one-line purpose.
2. Principle tags (e.g. "P2 Made for use") linking to the principles page.
3. **Look rows**, stacked, one per look (Playful, Swiss, Soft). Each row = live demo (left) + code (right, tabs: TSX / Props). The Soft row has its own 20px-radius container. Row header shows the look name and the exported component name (e.g. `ButtonSoft`).
4. **Playground:** a few controls for the most important props; changes update all visible rows live. Which props get controls is decided per component by the builder.
5. **Props table**, **generated from the TypeScript types** (e.g. via `react-docgen-typescript` or equivalent at build time), never hand-written.
6. **Do / Don't** (short, hand-written per component).
7. **Accessibility** notes (keyboard, focus, colour constraints).

Coverage (verified 2026-11-21): every looked component in `src/components/_base` has all three variants (`*Playful`, `*Swiss`, `*Soft`; Toast as `ToastRegion*`). `ChartFrame` and `Field` are internal bases with no variants and get no docs page. So every looked component page has exactly three rows; primitives and decoration have one. If a future component lacks a look, its row is omitted and, in that single-look mode, the page shows a short "not available in this look" note (builder's call).

Props table scope (builder's call): show the component's own props; collapse inherited DOM / react-aria props into one line linking to the relevant React Aria docs. One table per page when the three looks share a props type; otherwise one per look under the row's "Props" tab.

Content source: a typed registry in the site (`slug`, group, components per look, demo component(s), snippet(s), playground config, do/don't, a11y, principle tags). A test asserts every component exported from `src/index.ts` has a registry entry, so new components can't be forgotten.

## 9. Technical decisions

- Location: `site/` at repo root, its own Vite config (the root `vite.config.ts` is library mode and must stay untouched).
- Imports the library from `src/` through an alias (e.g. `bauhaus-react` → `../src/index.ts`), plus `src/theme.css`. Tailwind v4 via `@tailwindcss/vite`, with `@source` covering `src/` and `site/`.
- Fonts: the existing `@fontsource` devDependencies (Outfit, Inter, Inter Tight).
- Routing: client-side with clean paths (React Router or equivalent, builder's choice), base path `/bauhaus-react/` for GitHub Pages. Deep links survive refresh via the standard Pages SPA fallback: the build copies `index.html` to `404.html`. No hash routing. *(Builder's call.)*
- Principles page: imports `docs/bauhaus-principles.md` as raw text at build time and renders it with a markdown renderer; P1–P11 anchors come from its existing `### P<n>.` headings (slugs `p1`…`p11`). The file may get small structural edits but its content stays. *(Builder's call.)*
- Config isolation: `site/vite.config.ts`, `site/tsconfig.json` and a `site/vitest.config.ts` of their own. Root `vite.config.ts`, `tsconfig.json`, `vitest.setup.ts` and the root `pnpm test` stay unchanged; a `site:test` script runs site tests. *(Builder's call.)*
- Root scripts added: `site:dev`, `site:build`, `site:preview`. The site must not be included in the npm package (`files` already limits to `dist`).
- Motion: all animation (wipe, ripple, hover rotate, kinetic decoration) disabled or reduced under `prefers-reduced-motion`.
- Accessibility: keyboard-reachable Look select and tiles; visible focus; the mosaic is `aria-hidden`; WCAG AA contrast for text.
- Responsive down to 360px wide with no horizontal scroll; the hero stacks (type above app) on narrow screens.
- Testing (Strict TDD is active for this repo): Vitest + Testing Library for site logic: look state precedence (URL > storage > default), registry completeness, docs page filtering per look, mosaic colour/shape pairing invariant.

**Open library question (not in scope):** `Shape` defaults every kind to `red` (`src/components/decoration/Shape/Shape.tsx:53`), so the pairing is not built in. The site sets colours explicitly. Whether the library should enforce or default to the pairing is a separate decision.

## 10. Left to the builder
- Exact copy beyond the hero headline direction.
- Which screens fill each look band, and which components the hero mini-app uses beyond those named.
- Sidebar grouping of each component; per-component playground controls; do/don't text.
- Wipe transition specifics (shape, duration, easing) within the reduced-motion constraint.
- Router and props-extraction library choice.
- Deployment workflow (GitHub Actions to Pages) — may be a follow-up.
