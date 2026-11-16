# bauhaus-react full catalogue — Design

Status: draft, awaiting approval
Date: 2026-11-16
Related:
- `docs/style-analysis.md` (visual research; source of every component here)
- `docs/superpowers/specs/2026-11-16-bauhaus-react-v1-design.md` (v1 design; still in force unless this doc says otherwise)

---

## 1. Intent

v1 shipped 14 components for the portfolio, all in the Playful look. This design covers **everything else the style analysis identified**, so the library eventually holds the whole research and not just the v1 slice.

- **Why:** the author's three projects each need a different look:
  - portfolio → Playful
  - scheduling app → Soft
  - financial app → Swiss
- v1 reserved the Soft and Swiss names and tokens. This design fills them in.
- **Source of truth for scope:** `style-analysis.md` §3 (per-reference takeaways) and §6 (inventory). Nothing beyond it.

## 2. Goals, non-goals, anti-goals

**Goals**
- Every look-specific component exists in **all three looks** (full matrix, §6.2).
- Every look-agnostic primitive and decoration from the analysis exists once, with no suffix (§6.3, §6.4).
- Written **look rules** (§6.1) that are precise enough to design a combination no reference shows (e.g. a Swiss DateStrip).
- Interactive widgets are accessible to WCAG 2.2 AA, built on React Aria Components where native HTML is not enough.
- **The public API of the 14 v1 components does not change.** Their existing tests keep passing unchanged.

**Non-goals**
- Anything not in the analysis: data tables, charts, form inputs (text field, select, checkbox), toasts. These need new research first.
- Dark mode.
- A docs website (Storybook stays the docs).
- Consumers without Tailwind v4.

**Anti-goals** (all v1 anti-goals still apply, plus:)
- A `look` prop, a global look config, or a wrapper class that re-skins components (e.g. `.bh-swiss`).
- Looks redefining the same CSS variable.
- Copying reference deviations that break the style: a serif quote headline, a blurred backdrop (`style-analysis.md` §3 `BHause.mp4` and `OffMenu.mp4`).
- Behaviour duplicated across the three skins of one component.

## 3. Constraints

- Everything in v1 §3, §6.5 and §6.7 still applies:
  - stack and peer dependencies
  - static class literals only
  - `preserveModules`
  - single `"."` barrel plus `./theme.css`
  - `bh-` token namespace
  - Strict TDD
- **New runtime dependencies:** `react-aria-components` and `@internationalized/date`.
  - Use the latest versions at implementation time, verified on the npm registry.
  - Both are regular `dependencies`, not peer dependencies.
- Any component that imports React Aria, or uses state or effects, starts with `"use client"`.

## 4. Approaches considered

### 4.1 Scope of this document

| Option | Trade-off | Decision |
|---|---|---|
| Roadmap spec that maps every gap to a release, with a full design for the next release only | Smaller, faster to approve; later releases need their own design pass | Rejected |
| **Full design for everything left in the analysis** | One large doc; plans are still cut per release (§8) | ✅ **Chosen by author** |

### 4.2 How far each look goes

| Option | Trade-off | Decision |
|---|---|---|
| A core set (Button, Card, TopBar, …) in all looks; the rest only where a reference shows it | About 15 new look components; every combination is grounded in a reference | Rejected |
| **Full matrix: every look-specific component in all three looks** | About 3× the count. About a third of the combinations have no reference, so they are derived from the look rules (§6.1) | ✅ **Chosen by author** |
| Strictly where seen | Smallest. But Swiss would have no solid button, because no Swiss reference shows one | Rejected |

### 4.3 Interactive widget foundation

| Option | Trade-off | Decision |
|---|---|---|
| **React Aria Components** | Keyboard handling, focus management, ARIA and i18n dates come solved; adds a dependency and makes those files client-only | ✅ **Chosen by author** |
| Hand-rolled | No dependency; every focus trap, roving tabindex and date calculation becomes a source of accessibility bugs | Rejected |
| Radix Primitives | Similar, but no date primitives, so a second library would be needed for the scheduling app | Rejected |

### 4.4 How the matrix is built

| Option | Trade-off | Decision |
|---|---|---|
| **Internal base + thin look skins** | Behaviour and its tests live once. Skins are class maps. Needs a one-time refactor of the six v1 Playful components | ✅ **Chosen by author** |
| Fully standalone per look (the v1 pattern) | No refactor, but each behaviour is duplicated in three files. A fix like v1's disabled-link role would land in three files | Rejected |
| Per-look CSS variable scopes | Least code, but it is the global look switch the author rejected, and it breaks "looks do not redefine variables" | Rejected |

## 5. Decided by the author

1. Full design for everything left in the analysis, in one document.
2. React Aria Components for interactive widgets.
3. **Full matrix**: every look-specific component in Playful, Soft and Swiss.
4. Build pattern: internal base + thin look skins.
5. The look rules, the reference deviations to drop, and the release order (§6.1, §8) were played back to the author and accepted.

Still in force from v1: one component per look, with the look in the name; no `look` prop; no global look config.

## 6. Design

### 6.1 Look rules

Every look component follows its column. A combination with no reference is designed from this table alone.

| Rule | Playful | Soft | Swiss |
|---|---|---|---|
| **Ground** | `paper` | `paper` | `paper-white` |
| **Colour use** | Triad + extended fills (v1 `FillColor`) as material; big solid fields | Triad (`red`, `yellow`, `blue`) **only to encode meaning** (status, category, step) via a `tone` prop; surfaces are `paper`, `charcoal`, `sand` | `ink` on `paper-white`, plus **one** accent (`bh-accent`) used at most once per component; emphasis is grey (`muted-text`) → `ink` |
| **Radius** | `0` or `full` | `rounded-bh-soft` (20px) on panels and cards; `full` on pills, chips and circular buttons | `0` everywhere; `full` only on small (`sm`) buttons and circular icon buttons (OffMenu) |
| **Borders** | 2px `ink` | none; separation comes from tonal fills | 1px `rule` hairlines; cells are divided by rules |
| **Depth** | Hard offset shadow (`shadow-bh-hard`); hover lift + press-in (v1 `HOVER_LIFT`, `PRESS`) | No shadows; layering by overlap and tonal steps | None |
| **Type** | `font-bh-display`, bold/black, uppercase labels | `font-bh-display`, light/regular weights; big numerals as heroes | `font-bh-grotesk`, regular weight (big ≠ heavy), tight tracking (`-0.03em`) on display, uppercase labels `0.1em` |
| **Hover/active** | Lift + hard shadow, press-in | Tonal step (fill one shade darker), no movement | Colour change only: grey → `ink`, or underline appears |
| **Motion** | 150ms ease-out; kinetic decoration allowed | 150–250ms ease-out slides (carousel, stack) | 150–250ms ease-out wipes and reveals; no kinetic decoration inside Swiss components |

**Shared by every look:**
- Focus ring: v1 `FOCUS_RING`, 2px `ink` outline with 2px offset.
- Disabled: 50% opacity with `cursor-not-allowed`. Links use `aria-disabled`, as in v1.
- Every motion is `motion-safe:`. Kinetic loops never run under reduced motion.
- Yellow is never a text colour.

**Reference deviations dropped:**
- `QuoteBlock` uses sans type.
- `MenuOverlay` uses a solid `paper`/`paper-white` overlay, not a blurred backdrop.

### 6.2 Look-specific components (the matrix)

Each row ships as `<Name>Playful`, `<Name>Soft` and `<Name>Swiss`. A ✅ marks the six that already exist; they are refactored onto bases (§6.5) with no API change.

| Component | Source | Base behaviour (shared by all three) | How the looks differ (beyond §6.1) | React Aria |
|---|---|---|---|---|
| `Button` ✅P | Modulo, Mobile, OffMenu | `<button>`, or `<a>` with `href`; disabled link uses `aria-disabled` + `role="link"` + `tabIndex=-1`; variants `solid`/`outline`/`color`; sizes `sm`/`md`/`lg` | Soft `color` takes `tone`; Swiss `color` uses `bh-accent` only | No (native) |
| `IconButton` ✅P | Mijonju, Mobile, BasicMobile | Circular; required `aria-label`; `href` → anchor; sizes `sm`/`md`/`lg`, where `lg` is the **FAB** (Mobile big black circle) | Swiss: 1px border, no fill | No |
| `TextLink` | Modulo, OffMenu | Inline `<a>`; optional trailing arrow (`→`/`↗`/`↓`) | Playful: 2px underline, offset 4px. Soft: no underline, arrow required. Swiss: no underline until hover, then 1px | No |
| `Tag` ✅P | Mijonju, Mobile | `<span>`, uppercase micro label | Playful: sharp fill. Soft: pill with `tone`. Swiss: 1px outline, `ink` text | No |
| `Chip` | Mobile | Metadata pill; optional leading icon slot; not interactive | Playful: `ink` pill. Soft: `ink` pill (as in Mobile). Swiss: sharp, 1px border | No |
| `ProjectCard` ✅P | Mijonju | Whole card is one link; initial, title, text, media slot, arrow | Soft: `rounded-bh-soft`, `tone` header block + B/W media (Mobile room cards). Swiss: ruled cell, giant grotesk initial, no fill | No |
| `Card` | BasicMobile | `<article>` content panel; `header`, body, `footer` slots; optional `href` makes it one link | Playful: sharp, 2px border, hard shadow. Soft: `charcoal` panel, paper text, `rounded-bh-soft`. Swiss: hairline box | No |
| `StackCard` | Mobile | List item card with a coloured spine edge and an optional trailing action (`+`) | Spine: Playful fill colour, Soft `tone`, Swiss `bh-accent` 2px line | No |
| `TopBar` ✅P | aboutUs, Manifesto, Mijonju | `<header>` row of ruled cells: brand, meta, action slots | Soft: no rules, tonal bar, `rounded-bh-soft` bottom. Swiss: 1px rules, wordmark slot | No |
| `Footer` ✅P | Mijonju | `<footer>` grid of slots | Same derivation as `TopBar` | No |
| `BottomNav` | Mobile | `<nav>` of icon links; `aria-current="page"` on the active one; each item requires a label (visible or `aria-label`) | Playful: `ink` bar, active = yellow circle. Soft: rounded bar, active = `tone` dot. Swiss: hairline top rule, active = `ink`, rest `muted-text` | No |
| `Tabs` | Mobile | Tab list + panels; arrow-key navigation; controlled and uncontrolled | Playful: active tab is a filled pill. Soft: tonal segmented control. Swiss: active tab underlined with 1px `ink` | `Tabs`, `TabList`, `Tab`, `TabPanel` |
| `MenuOverlay` | OffMenu | Fullscreen modal menu opened by a trigger; focus trapped; `Esc` closes; stacked large links divided by rules; optional secondary (social) list | Playful: `paper`, links get fill on hover. Soft: `paper`, `rounded-bh-soft` sheet. Swiss: `paper-white`, inactive links `muted-text`, hovered/current `ink` (OffMenu) | `DialogTrigger`, `Modal`, `Dialog` |
| `Carousel` | aboutUs, Mijonju, Mobile | Horizontal slides; previous/next buttons; pager (`IndexCounter` + `ProgressRule`); follows the WAI-ARIA APG carousel pattern (`aria-roledescription="carousel"`, slide labels "n of m", a polite live region announcing the current slide); no autoplay | Prev/next use the look's `IconButton`. Swiss pager: `01 / 05` + rule | Hand-built with native buttons (builder first checks whether the current RAC release ships a carousel; if it does, use it) |
| `DateStrip` | Mobile | Horizontal single-select strip of days (weekday + big day number); arrow-key navigation; `value`/`onChange` in `CalendarDate`; `locale`-aware weekday names | Selected day: Playful fill + 2px border; Soft `rounded-bh-soft` `charcoal` tile; Swiss `ink` underline | `RadioGroup` + `Radio`, `@internationalized/date` |
| `AudioPlayer` | BasicMobile | Wraps a native `<audio>`; play/pause button; scrubber; elapsed/total time | Scrubber track and thumb follow the look; Soft shows the big elapsed numeral | `Slider` for the scrubber |

**Count:** 16 components × 3 looks = 48 look components, of which 6 exist. **42 are new.**

### 6.3 Look-agnostic primitives (no suffix)

Existing and unchanged: `Container`, `Grid`, `DisplayHeading` (including `echo`), `HighlightText`, `ArrowLink`.

New:

| Component | Source | Behaviour / key props |
|---|---|---|
| `IndexCounter` | aboutUs | Zero-padded index, `01`; `current`, optional `total` → `01 / 05` |
| `SectionLabel` | OffMenu | Marker like `(P)`; uppercase micro label |
| `ProgressRule` | aboutUs | Thin track with a filled segment; `value` 0–1; `role="progressbar"` with `aria-valuenow` when labelled, decorative (`aria-hidden`) otherwise; `color` from `FillColor` |
| `BigNumber` | BasicMobile, OffMenu | Huge numeral with optional `label` above and `caption` below |
| `NumberStepper` | BasicMobile | Current number large, next 1–2 numbers ghosted (`muted`, `aria-hidden`) |
| `StatColumns` | OffMenu | Ruled row of `BigNumber` columns (label → value → title → sub-list) |
| `RuledList` | BauhausConcept | Words or items laid on horizontal 1px rules; optional per-item column offset (asymmetric staff) |
| `Timeline` | BauhausConcept | Ordered list of year markers in large type with content |
| `Stepper` | Mobile | Vertical ordered list of numbered coloured dots joined by a dashed line; `aria-current="step"` on the current one; each step's colour from `FillColor` |
| `Avatar` | BauhausConcept, BasicMobile | Circular image crop; required `alt`; `rings` (0–3) draws concentric outline circles behind (`aria-hidden`) |
| `MediaBlock` | aboutUs, Mobile | Image rendered grayscale over a solid colour block; `color` from `FillColor`; `alt` required |
| `QuoteBlock` | BHause | `<blockquote>` with a large faded quote mark (`aria-hidden`) and optional `<cite>`; sans only |
| `Wordmark` | OffMenu | Giant word that scales down to header size on scroll; CSS scroll-driven animation (`animation-timeline: scroll()`); no JavaScript. Where unsupported or under reduced motion, it stays at its giant size and scrolls away with the page, so the hero is kept *(Claude's call)* |

### 6.4 Decoration (no suffix, `aria-hidden`)

Existing: `Shape`, `ShapeMosaic`, `Stamp`.

| Change / new | Source | Behaviour / key props |
|---|---|---|
| `Shape` gains `fill` | BasicMobile | Additive prop `fill?: "solid" \| "outline" \| "pattern"` (default `solid`, so v1 output is unchanged); `outline` = 2px stroke; `pattern` = shape filled with a `Pattern` |
| `Pattern` | BHause, Kandinsky, Mijonju, CJS | Fills its box. `kind`: `hatch-vertical`, `hatch-horizontal`, `checker`, `grid-paper`, `halftone`, `grain`. Pure CSS/SVG, deterministic, no randomness at render (`grain` uses a static inline SVG noise) |
| `Ribbon` | Courageously, CJS | Diagonal band across its container carrying repeated text; `angle` (default −12°), `color` |
| `SkewBar` | Courageously | Parallelogram bar with an optional offset duplicate behind it (the "Bauhaus shadow") in a second colour; `color`, `shadowColor` |
| `KineticRule` | BHause | Horizontal rule with a dot sliding along it, the rule growing and shrinking; loop uses `animate-bh-slide`; static under reduced motion |
| `Composition` | BHause | Absolutely-positioned grid (`cols` × `rows`) of `Shape` and `Pattern` cells placed by a `cells` array (`{ col, row, colSpan?, rowSpan?, node }`); deterministic |

### 6.5 Base + skin structure

```txt
src/components/
  _base/                      # internal; never exported from index.ts
    Button/{ButtonBase.tsx, ButtonBase.test.tsx}
    …one folder per §6.2 row
  playful/ButtonPlayful/{ButtonPlayful.tsx, .test.tsx, .stories.tsx, index.ts}
  soft/ButtonSoft/…
  swiss/ButtonSwiss/…
  primitives/…
  decoration/…
```

- **A base** owns:
  - markup and the polymorphic anchor/button switch
  - React Aria wiring
  - ARIA attributes
  - stripping of look-only props
  - all behaviour
- **The interface:** a base takes a `classes` object of named slots (e.g. `{ root, icon }` for Button; `{ root, list, tab, panel }` for Tabs) plus the consumer's `className`. It merges `className` into `root` last via `cn()`.
  - Slot names are fixed per base and typed.
  - State-dependent classes (selected, disabled, current) are passed as separate slot entries or as React Aria render-prop data attributes (`data-[selected]:…`). They are never interpolated.
- **A skin** owns:
  - its static class maps (looked up by variant, size, colour/tone)
  - its look-specific props (`color: FillColor` for Playful, `tone` for Soft, none for Swiss)
  - nothing else
- **Prop typing** *(Claude's call)*:
  - A base's props are the behaviour props shared by all three skins (variant, size, `href`, `disabled`, slots, state), plus `classes`.
  - A base never sees `color` or `tone`. Each skin declares its own colour prop, resolves it to classes, and passes the rest through.
  - So the public prop type of `CardSoft` is the base's props minus `classes`, plus `tone`.
- **Controlled state** *(Claude's call)*: every stateful widget supports both controlled and uncontrolled use, with React Aria naming:
  - `Tabs`: `selectedKey` / `defaultSelectedKey` / `onSelectionChange`
  - `DateStrip`: `value` / `defaultValue` / `onChange` (`CalendarDate`), plus `minValue`, `maxValue` and `locale`
  - `Carousel`: `index` / `defaultIndex` / `onIndexChange`
  - `MenuOverlay`: `isOpen` / `defaultOpen` / `onOpenChange`
  - `AudioPlayer` takes `src`, `title` (its accessible name), and `children` passed into `<audio>` (for `<track>` captions). It is uncontrolled; it exposes the `<audio>` element through `ref`.
- **v1 refactor:** the six existing Playful components move onto bases.
  - Their tests assert exact class strings (e.g. `ButtonPlayful.test.tsx` checks `rounded-full bg-bh-ink text-bh-paper`), so each skin must emit the **same class strings** as v1.
  - Acceptance: existing tests and stories pass **unchanged**, and `npm run smoke` and `npm run smoke:storybook` pass.
  - If a test can't pass without editing it, stop and raise it with the author. Don't bend the test.
- **Proving the slot interface early** *(Claude's call)*: bases are internal, so `0.3` and `0.4` **may** change a base's slots. The rule is that the Playful skins' tests stay green. While building each base in `0.2`, also sketch the Soft and Swiss slot needs from §6.1/§6.2 (Swiss rules between cells, Soft overlap, the `StackCard` spine). That way slots are added up front instead of late.

**Look-specific prop types** (exported):
- `FillColor` (exists): Playful.
- `SoftTone = "red" | "yellow" | "blue" | "neutral"`: Soft. *(Claude's call: the pairs match v1 `TEXT_ON`.)*

  | Tone | Fill | Text |
  |---|---|---|
  | `red` | `bh-red` | `bh-ink` |
  | `yellow` | `bh-yellow` | `bh-ink` (yellow is only ever a fill) |
  | `blue` | `bh-blue` | `bh-paper` |
  | `neutral` | `bh-charcoal` | `bh-paper` |

  Soft surfaces: `sand` takes `bh-ink` text. Each pair gets a contrast test (≥ 4.5:1). If one fails, adjust the hex value, not the pairing.
- Swiss has no colour prop. Components use `bh-accent` where §6.2 says so. The default accent (red, about 3.9:1 on white) **fails AA for body text**, so `bh-accent` is used only for fills, rules, the `StackCard` spine and text ≥ 24px. It is never used for small text.

### 6.6 Token additions (`theme.css`)

Added inside the existing `@theme static` block. No existing token changes value.

| Token | Value | Used by |
|---|---|---|
| `--color-bh-sand` | `#f5cf8a` | Soft surfaces (BHause) |
| `--color-bh-accent` | `var(--color-bh-red)` | Swiss single accent; consumers override it |
| `--radius-bh-soft` | `20px` | Soft panels → `rounded-bh-soft` |
| `--font-bh-grotesk` | `"Inter Tight", "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif` | Swiss display |
| `--animate-bh-slide` + `@keyframes bh-slide` | 6s linear infinite | `KineticRule` |

- **Contrast:** `sand` and every `SoftTone` pair get palette contrast tests, as v1 did for `FillColor`.
- **`cn()`:** the tailwind-merge config gains the new tokens in their groups:
  - `bg-`/`text-`/`border-` for `bh-sand` and `bh-accent`
  - radius for `bh-soft`
  - font-family for `bh-grotesk`
  - animate for `bh-slide`
  - Each group gets a unit test.
- **Fonts:** `Inter Tight` is added to Storybook dev dependencies, and the README documents loading it. It is still not bundled.
- **Coloured hard shadows** (Courageously): use `shadow-bh-hard` plus a Tailwind shadow-colour utility (`shadow-bh-red`).
  - The builder verifies early that Tailwind 4.3 substitutes the colour inside a custom `@theme` shadow.
  - If it doesn't, add `--shadow-bh-hard-<color>` tokens for the `FillColor` set instead.

### 6.7 Testing

Strict TDD, as in v1. Tests check behaviour, not classes.

- **Base tests** cover all behaviour once:
  - roles and names, anchor vs button
  - keyboard interaction (arrow keys in Tabs/DateStrip, `Esc` and focus trap in MenuOverlay, prev/next and live-region text in Carousel)
  - `aria-current`
  - disabled states
  - `className` merge
- **Skin tests** (each of the 48): renders with the right role and accessible name, forwards `className`, forwards `ref`, and covers any skin-only prop (`tone`, `color`).
- **Primitives and decoration:** same rules as v1 (decoration has `aria-hidden`; `ProgressRule` exposes `progressbar` only when labelled; `Wordmark` renders static text with no client code).
- **Storybook:** one story per variant per look, with the a11y addon on. Each look gets an overview story that shows all of its components on its ground colour.

### 6.8 Public API

- `index.ts` exports every skin, primitive and decoration, grouped by section (Primitives, Playful, Soft, Swiss, Decoration), plus the types `FillColor` and `SoftTone`.
- `_base` is never exported.
- The single `"."` barrel is kept; there are no subpath exports.
- **Client boundaries** *(Claude's call)*: the barrel re-exports `"use client"` files. That works in RSC frameworks as long as every client file's directive survives the build. `npm run smoke` gains a check that each `dist` file built from a `"use client"` source still starts with the directive.

## 7. Left to the builder

- Exact slot names per base, as long as they are typed and fixed.
- Exact sizes, spacing and type steps inside each skin, within §6.1.
- The internal structure of `Carousel` (scroll-snap vs transform), as long as the APG behaviour in §6.2 holds.
- Whether `AudioPlayer` shows a waveform. The default is no.
- The SVG technique for `Pattern` kinds and `grain`.
- Storybook organisation beyond §6.7.

## 8. Releases

One release per look, ordered by the author's apps. Write one implementation plan per release.

| Release | Contents |
|---|---|
| `0.2` (portfolio) | React Aria + `@internationalized/date` dependencies; all token additions (§6.6); all 16 bases; refactor of the six v1 Playful components; the 10 new Playful skins; **all** new primitives (§6.3) and decoration (§6.4) |
| `0.3` (scheduling) | All 16 Soft skins |
| `0.4` (financial) | All 16 Swiss skins |

Shipping every base in `0.2` means `0.3` and `0.4` are mostly skin-only. They may still adjust internal bases, as long as the Playful tests stay green (§6.5). The tokens all ship in `0.2` so that token changes never happen mid-matrix.

## 9. Calls made by Claude (author to confirm while reading)

1. Scope is limited to the analysis: no tables, charts or form inputs (§2).
2. The look rules table, including Swiss's single `bh-accent` defaulting to red, and Soft using `tone` instead of `FillColor` (§6.1, §6.5).
3. The 16-row matrix: what counts as look-specific vs primitive (§6.2, §6.3). `Stepper`, `ProgressRule`, `BigNumber` and `Avatar` are primitives; `Chip`, `Card` and `StackCard` are look components.
4. FAB is `IconButton` size `lg`, not a separate component.
5. React Aria only where native HTML is not enough. Button, IconButton, TextLink and BottomNav stay native, so v1's `onClick` API is unchanged.
6. `Carousel` is hand-built on the WAI-ARIA APG pattern, because React Aria had no carousel at design time (builder re-checks); no autoplay.
7. `Wordmark` uses CSS scroll-driven animation with no JavaScript.
8. `Shape` gets an additive `fill` prop instead of a separate `DecorCircle`.
9. New tokens: `sand`, `accent`, `radius-bh-soft`, `font-bh-grotesk`, `animate-bh-slide` (§6.6).
10. All bases, primitives and decoration ship in `0.2`; `0.3` and `0.4` are mostly skin-only and may adjust internal bases (§8).
11. Skin prop typing, controlled-state naming, and `AudioPlayer` props (§6.5).
12. `SoftTone` pairs, and `bh-accent` restricted to fills, rules and large text (§6.5).
13. `Wordmark` falls back to its giant size (§6.3).
14. The smoke check for `"use client"` directives (§6.8).
