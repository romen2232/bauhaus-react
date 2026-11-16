# bauhaus-react v1 — Design

Status: draft, awaiting approval
Date: 2026-11-16
Related: `docs/style-analysis.md` (visual research; source of tokens and component patterns)

---

## 1. Intent

A **public npm React component library** that lets its author build Bauhaus-style web interfaces by **mixing the looks found in the reference analysis** (Swiss editorial, Playful geometric, Warm soft) inside the same app.

- **Primary user:** the author, in their own Tailwind v4 projects. Public on npm, but optimised for that use.
- **Base look:** **Playful geometric** (sub-style B in `style-analysis.md`: `Modulo`, `Mijonju`, `Courageously`).
- **Roadmap driver:** three projects, in this order:
  1. Portfolio (not started; will be designed *with* this library) → **v1 scope**
  2. Scheduling app → later release (Soft look, form/date components)
  3. Financial app → later release (Swiss look, data/number components)

## 2. Goals, non-goals, anti-goals

**Goals (v1)**
- Ship the components needed to build a playful-geometric portfolio (list in §6).
- Shared design tokens in one CSS file, overridable by the consumer.
- An architecture where Swiss and Soft components can be added later **without touching Playful ones**.
- Storybook catalogue of every component and state.
- Accessible by default (WCAG 2.2 AA).

**Non-goals (v1)**
- Swiss and Soft look components (naming and tokens are reserved; implementation waits).
- Complex interactive widgets (date picker, menu, dialog, combobox) → later, on React Aria Components.
- Dark mode.
- A separate docs website (Storybook is the docs for now).
- Supporting consumers without Tailwind v4.

**Anti-goals (would make it a failure even if it works)**
- A single component that switches looks via a prop or global config. **Explicitly rejected by the author.**
- Shipping precompiled CSS that consumers can't override with Tailwind.
- Gradients, blurred shadows, glassmorphism, mid radii mixed with sharp corners (see `style-analysis.md` §7).
- Yellow used as a text colour (fails contrast).

## 3. Constraints

- **Stack (latest at 2026-11-16, verified on the npm registry):** React 19.3, TypeScript 7.0, Tailwind CSS 4.3, Vite 8, Storybook 10, Vitest 5, Testing Library React 16.
- **Peer dependencies:** `react`, `react-dom` (^19), `tailwindcss` (^4). Consumers always run Tailwind v4.
- **Package name:** `bauhaus-react` (unclaimed on npm as of 2026-11-16; re-check before first publish).
- **Strict TDD** is the working mode for implementation (test first, per component).
- The project folder is **not a git repository yet**. It has to be initialised before implementation.

## 4. Approaches considered

| Option | Summary | Trade-off | Decision |
|---|---|---|---|
| **A. Single package, Vite library mode + Storybook** | One `package.json`; Vite builds ESM; Storybook as catalogue; Vitest for tests | Simplest; no showcase site beyond Storybook | ✅ **Chosen by author** |
| B. pnpm monorepo (`packages/` + `apps/docs`) | Library + docs/demo site | Better public credibility, but double tooling from day one; the portfolio already plays the "real app" role | Rejected for now; A can be wrapped into B later |
| C. Single package, tsdown/tsup + Ladle | Lighter, faster | Smaller ecosystem; loses Storybook controls/a11y addon | Rejected |

## 5. Decided by the author

1. **Public npm package**, used primarily in the author's own Tailwind v4 projects.
2. **Playful geometric is the base**; the library must eventually cover every look in the style analysis.
3. **One component per look**, with the look in the name: `ButtonPlayful`, `ButtonSwiss`, `ButtonSoft`. Mixing happens by choosing which component to import.
4. **No global "app look" config** and no `look` prop.
5. **Build approach A** (above).
6. v1 is driven by the **portfolio**.

## 6. Design

### 6.1 Distribution model (how consumers use it)

The package ships **ESM JavaScript containing Tailwind class names + one `theme.css`**. The consumer's own Tailwind build generates the CSS.

```css
/* consumer app: app.css */
@import "tailwindcss";
@import "bauhaus-react/theme.css";
@source "../node_modules/bauhaus-react/dist";
```

```tsx
import { ButtonPlayful, ProjectCardPlayful } from "bauhaus-react";
```

`package.json` `exports`:
- `"."` → `dist/index.js` + `dist/index.d.ts`
- `"./theme.css"` → `dist/theme.css`
- `"sideEffects": ["**/*.css"]`, `"type": "module"`.

### 6.2 Tokens (`theme.css`)

Tailwind v4 CSS-first config with `@theme`, so tokens become utilities (`bg-bh-red`, `font-bh-display`, `shadow-bh-hard`).

- **Namespace:** every token is prefixed `bh-` so it can't collide with the consumer's theme.
- **Values:** start from `style-analysis.md` §5. Playful uses the core triad plus the extended palette (navy, sky, pink, orange).
- **Groups:**
  - **Colour:** paper, paper-white, ink, charcoal, rule, muted, red, yellow, blue, navy, sky, pink, orange, teal, khaki.
  - **Font families:** display-geometric, display-grotesk, body, mono.
  - **Type scale:** 12 → 144.
  - **Radius:** `none` and `full` only for Playful. `soft` (20px) is reserved for the Soft look.
  - **Shadows:** `bh-hard` (`4px 4px 0 0 var(--color-bh-ink)`) plus coloured variants.
  - **Motion:** durations `fast` / `base` and `kinetic`; ease `out`.
- **Overriding:** consumers redefine any `--*-bh-*` variable after the import.
- **Shared by all looks:** there is ONE token file. Look-specific components pick different tokens; looks do not redefine the same variable.

### 6.3 Fonts

- **The package does NOT bundle font files.** `theme.css` declares the families with fallbacks:
  - display: `"Outfit", "Jost", ui-sans-serif, system-ui`
  - body: `"Inter", ui-sans-serif, system-ui`
- The README documents loading them (`@fontsource/outfit`, `@fontsource-variable/inter`, or Google Fonts).
- Storybook loads them as dev dependencies.
- Exact families are the builder's call within "free, geometric display + neutral grotesk body".

### 6.4 Naming and file structure

- **Look-specific components** end with the look: `ButtonPlayful`.
- **Look-agnostic primitives** (layout, type, decoration) have **no suffix**: `Container`, `Shape`.
  - *Proposed by Claude, not yet confirmed by the author.*

```txt
src/
  index.ts                 # public barrel
  theme.css
  lib/cn.ts                # clsx + tailwind-merge (configured for bh- tokens)
  components/
    playful/ButtonPlayful/{ButtonPlayful.tsx, .test.tsx, .stories.tsx, index.ts}
    swiss/                 # reserved, empty in v1
    soft/                  # reserved, empty in v1
    primitives/Container/…
    decoration/Shape/…
```

### 6.5 Component conventions

- Function components; `ref` as a regular prop (React 19); spread remaining native props onto the root element; a `className` prop merged last via `cn()`.
- Variants are typed string unions mapped to class strings (plain objects; CVA is optional, builder's call).
- Server-component safe by default. Add `"use client"` only to components that use state or effects.
- Decorative elements get `aria-hidden="true"`. Interactive elements get a visible focus ring (2px ink outline, 2px offset).
- Motion: anything animated checks `motion-safe:`. Under reduced motion, kinetic loops don't run at all.

### 6.6 v1 component list (portfolio)

| Component | Source reference | Key props / behaviour |
|---|---|---|
| `Container` | — | max-width + 16px gutters |
| `Grid` | aboutUs, Mijonju | columns, gap; `ruled` draws 1px rule lines between cells |
| `DisplayHeading` | Modulo, BauhausConcept | `as` (h1–h3), size (xl–4xl); `echo` duplicates text offset (Modulo "GRAPHIC DESIGN") |
| `HighlightText` | Manifesto, OffMenu | grey body; `<HighlightText.Mark>` children in ink |
| `ButtonPlayful` | Modulo, Mijonju | variants: `solid` (pill, ink), `outline` (sharp, 2px ink), `color` (triad fill with ink text); sizes sm/md/lg; renders `<a>` when `href` is given |
| `IconButtonPlayful` | Mijonju, BasicMobile | circular, requires `aria-label` |
| `ArrowLink` | Manifesto, OffMenu, Mijonju | direction `→` / `↗`; size up to hero |
| `TagPlayful` | Mijonju | solid colour badge, uppercase micro label |
| `ProjectCardPlayful` | Mijonju category cards | colour fill, giant initial, title, text, media slot, arrow CTA; whole card is one link |
| `TopBarPlayful` | Mijonju, Manifesto | row of ruled cells: brand slot, meta slots, action slot |
| `FooterPlayful` | Mijonju | ruled grid of slots |
| `Shape` | Modulo, Kandinsky | `kind`: circle, quarter, half, triangle, square, bar (pill); `color`; `rotate` (0/90/180/270); optional `spin` (kinetic) |
| `ShapeMosaic` | Modulo hero | grid of `Shape` tiles from a `tiles` array; deterministic, no randomness at render |
| `Stamp` | Mijonju | circular rotating text (SVG `textPath`); `spin` optional |

**Scope freeze:** v1 is exactly these 14 components. Anything the portfolio needs later (menu overlay, carousel, stat columns, avatar, media-on-colour block, contact form) goes into `0.2+`. *(Claude's call)*

**Colour and radius rules for Playful** *(Claude's call)*:
- **Fill palette:** `red`, `yellow`, `blue`, `navy`, `sky`, `pink`, `orange`, plus `ink` and `paper`. Teal and khaki are reserved for later looks.
- **Text on fills:** each fill has a fixed, contrast-checked text colour (ink or paper) in the same map. Consumers never pick text colour on a fill.
- **Radius:** 0 or full, never in between.
  - Pill (`rounded-full`): every `ButtonPlayful` variant, `IconButtonPlayful`, `Shape` bar.
  - Sharp: cards, tags, top bar, footer, grid cells.
  - `rounded-none` and `rounded-full` are plain Tailwind utilities; no custom radius tokens are needed in v1.

**API details** *(Claude's call)*:
- **`Grid`:**
  - `cols` takes 1–12, mapped to static classes.
  - `ruled` draws inner rules AND the outer border (as in `aboutUs`).
- **`ShapeMosaic`:**
  - Props: `cols: number` and `tiles: Array<{ kind; color; rotate? }>`.
  - Tiles touch (gap 0) and are square (`aspect-square`).
- **`spin`:** the keyframes are declared inside `@theme` in `theme.css`, giving `animate-bh-spin` with duration `--animate-bh-spin` (8s linear infinite). Consumers override the variable. It's wrapped in `motion-safe:`.

### 6.7 Build constraints

- **Static class literals only.** Every variant and colour maps to full class strings in an object (e.g. `{ red: "bg-bh-red text-bh-ink" }`). Interpolating strings like `` `bg-bh-${color}` `` is forbidden, because the consumer's Tailwind scans `dist` and can't see interpolated classes.
- **Module output:** Vite lib mode with `preserveModules: true`, so each component keeps its own file and its `"use client"` directive, and tree-shaking works.
  - There is one public `"."` barrel plus `./theme.css`. No per-component subpath exports in v1.
- **`cn()` merging:** tailwind-merge extended so custom tokens merge correctly in these groups:
  - colour: `bg-`, `text-`, `border-` with `bh-*`
  - `font-family`
  - `shadow`
  - `animate`
  - Each group has a unit test.

### 6.8 Testing and quality

- **Vitest** with jsdom and Testing Library, written test-first per component.
- **Test behaviour, not classes:**
  - roles and names
  - `href` → anchor
  - keyboard focus
  - `aria-hidden` on decoration
  - `className` merge
- **Storybook 10:** one story per variant, a11y addon on.
- **Type checks:** `tsc --noEmit` in CI. Lint is the builder's choice.
- **Types build:** `tsc --emitDeclarationOnly`, not `vite-plugin-dts`.
  - TypeScript 7 is the native (Go) compiler, and plugins that rely on the old JS compiler API may not support it.
  - The builder should verify this early and fall back if needed.

### 6.9 Release

- Versioning starts at `0.1.0`, semver, MIT licence (Claude's call).
- Publishing is manual for v1. Changesets or CI release are the builder's choice later.

## 7. Left to the builder

- Exact font families within §6.3.
- CVA vs plain class maps.
- Lint/format tooling.
- jsdom vs happy-dom.
- Storybook theming.
- Exact token hex values. Start from `style-analysis.md` §5, then check contrast.
- Internal folder details beyond §6.4.

## 8. Calls made by Claude (author to confirm while reading)

1. Look-agnostic primitives have no look suffix (§6.4).
2. Fonts not bundled; Outfit + Inter as defaults (§6.3).
3. Tokens namespaced `bh-` and exposed as Tailwind utilities (§6.2).
4. `ButtonPlayful` renders an anchor when given `href` (§6.6).
5. `Shape` and `Stamp` include an optional CSS-only `spin` in v1 (kinetic decoration from `BHause.mp4`).
6. React Aria Components deferred until the scheduling app needs complex widgets.
7. MIT licence, `0.1.0` start.
8. v1 scope frozen at 14 components; extras go to `0.2+` (§6.6).
9. Playful fill palette and radius rules: all buttons are pills; cards and tags are sharp (§6.6).
10. Static class maps, `preserveModules`, single barrel (§6.7).
