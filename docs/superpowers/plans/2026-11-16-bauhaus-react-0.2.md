# bauhaus-react 0.2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `0.2.0`, which contains:
- every internal base for the 16-component matrix
- the six v1 Playful components refactored onto bases
- the 10 new Playful skins
- all new primitives and decoration
- the new tokens

**Architecture:** Each matrix component splits in two:
- **An internal base** in `src/components/_base/<Name>/`. It owns markup, behaviour, ARIA and React Aria wiring, and takes a typed `classes` slot object.
- **A thin look skin** in `src/components/playful/<Name>Playful/`. It owns static class maps and its own colour prop, and passes everything else to the base.

Primitives and decoration stay single components with no suffix. The rules come from spec §6.1 (look rules) and §6.5 (base/skin contract).

**Tech Stack:** React 19.3, TypeScript 7, Tailwind CSS 4.3 (`@theme static`), Vite 8 lib mode (`preserveModules`), Vitest 5 + jsdom + Testing Library, Storybook 10, `react-aria-components`, `@internationalized/date`, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-16-bauhaus-react-full-catalogue-design.md`. Release `0.2` is defined in its §8. The v1 spec `docs/superpowers/specs/2026-11-16-bauhaus-react-v1-design.md` still applies.

## Global Constraints

**Classes and tokens**
- **Static class literals only.** Every variant, colour and size maps to a full class string in an object. Never interpolate class names (`` `bg-bh-${x}` ``). `pnpm smoke` fails on `bh-${`.
- Inline `style` is allowed only for continuous numeric values: progress width, carousel offset.
- Every token is prefixed `bh-`. No existing token changes value.
- Yellow is never a text colour.
- **Playful radius is `0` or `full` only.** Use 2px `ink` borders, the hard offset shadow, and `HOVER_LIFT` + `PRESS` from `src/lib/styles.ts` on interactive elements.
- Every interactive element gets `FOCUS_RING`.
- Disabled state is `cursor-not-allowed opacity-50`. Disabled links get `aria-disabled="true"`, `role="link"`, `tabIndex={-1}` and no `href`.
- Every animation is behind `motion-safe:`. Kinetic loops never run under reduced motion.

**Component conventions**
- Function components. `ref` is a regular prop (React 19). Remaining native props spread onto the root. The consumer `className` is merged last, into the `root` slot, via `cn()`.
- Files that import `react-aria-components`, or use state or effects, start with `"use client"`.
- Decorative elements get `aria-hidden="true"`.
- **`_base` is never exported** from `src/index.ts`.
- **Base slots must fit all three looks.** Before finalising each base's `classes` type, check spec §6.1 and §6.2 for what the Soft and Swiss skins will need (Swiss rules between cells, Soft overlap, the `StackCard` spine). Add those slots now, so that `0.3` and `0.4` stay skin-only where possible (spec §6.5).

**Folders and exports**
- Each component folder holds `<Name>.tsx`, `<Name>.test.tsx`, `<Name>.stories.tsx` and `index.ts`.
  - `index.ts` re-exports with `.js` suffixes.
  - Tests import without a suffix.
  - Story titles follow the folder: `Playful/…`, `Primitives/…`, `Decoration/…`.
- Each task adds its public exports to `src/index.ts` under the matching section comment.

**Process**
- Strict TDD: write the failing test first.
- Tests check behaviour (roles, names, attributes, keyboard). The only class assertions allowed are those in v1 tests, plus those this plan states explicitly.
- **v1 tests and stories must pass unchanged.** If one can't, stop and ask the author. Do not edit it.
- Commits use conventional-commit messages with **no AI attribution or Co-Authored-By lines**.

**Test commands**
- One file: `pnpm exec vitest run <path>`
- Full gate: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`

## Review Focus

1. **DateStrip across a month or year boundary.** A strip starting `2026-12-29` shows `29 30 31 1 2 3 4`, and arrow keys move across the boundary (Task 18).
2. **Carousel with one slide.** Previous and next are both disabled, the pager reads `01 / 01`, and nothing throws (Task 16).
3. **MenuOverlay close.** After closing (`Esc`, the close button, or a link click), focus returns to the trigger (Task 15).
4. **AudioPlayer before metadata loads.** The duration is `NaN`/`Infinity`, so the time reads `0:00 / --:--`, never `NaN:NaN` (Task 19).
5. **ProgressRule out of range.** `value` of `-1`, `2` or `NaN` clamps to 0, 1 and 0 respectively. `aria-valuenow` stays within 0–100 (Task 5).

---

## File map

```txt
src/theme.css                          M  new tokens (Task 1)
src/lib/cn.ts, cn.test.ts              M  new token groups (Task 1)
src/lib/palette.ts, palette.test.ts    M  SoftTone, CURRENT_COLOR_CLASSES (Task 1)
src/lib/time.ts, time.test.ts          C  formatTime (Task 19)
vite.config.ts, package.json           M  deps, externals, directives (Task 2)
consumer-smoke/check.mjs               M  new CSS needles, "use client" check (Tasks 1, 2)
src/components/_base/<Name>/<Name>Base.tsx (+ .test.tsx)   C  16 bases
src/components/playful/<Name>Playful/…                      M 6, C 10
src/components/primitives/<New>/…                           C 13
src/components/decoration/{Pattern,Ribbon,SkewBar,KineticRule,Composition}/…  C
src/components/decoration/Shape/Shape.tsx                   M  fill prop
src/index.ts, README.md, .storybook/*                       M
```

Task order: tokens → deps → primitives (Carousel needs `IndexCounter` and `ProgressRule`) → v1 refactors → new matrix components → decoration → release.

---

### Task 1: Token additions, `cn()` groups, Soft palette

**Files:**
- Modify: `src/theme.css`, `src/lib/cn.ts`, `src/lib/cn.test.ts`, `src/lib/palette.ts`, `src/lib/palette.test.ts`, `consumer-smoke/check.mjs`

**Interfaces:**
- Produces:
  - Tokens:
    - `--color-bh-sand: #f5cf8a`
    - `--color-bh-accent: var(--color-bh-red)`
    - `--radius-bh-soft: 20px`
    - `--font-bh-grotesk: "Inter Tight", "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif`
    - `--animate-bh-slide: bh-slide 6s linear infinite`
    - `--animate-bh-grow: bh-grow 6s linear infinite`
    - `--animate-bh-wordmark: bh-wordmark linear both`
  - Keyframes:
    - `bh-slide`: `0%,100% { left: 0% } 50% { left: 100% }`
    - `bh-grow`: `0%,100% { scale: 0.4 1 } 50% { scale: 1 1 }`
    - `bh-wordmark`: `to { scale: 0.25 }`
  - From `palette.ts`:
    - `type SoftTone = "red" | "yellow" | "blue" | "neutral"`
    - `SOFT_TONE_CLASSES: Record<SoftTone, string>`
    - `SOFT_TONE_TEXT_ON: Record<SoftTone, "ink" | "paper">`
    - `SOFT_HEX: Record<SoftTone | "sand", string>`
    - `CURRENT_COLOR_CLASSES: Record<FillColor, string>` (`text-bh-<c>` per colour; for `currentColor` decoration only, never for readable text)
- Note: `bh-grow` and `bh-wordmark` are the plan's additions for `KineticRule`'s growing rule and `Wordmark` (spec §6.3 and §6.4 describe both behaviours).

- [ ] **Step 1: Write the failing tests**

```ts
// palette.test.ts (append)
const softTones = ["red", "yellow", "blue", "neutral"] as const;
it.each(softTones)("soft tone %s meets WCAG AA 4.5:1", (t) => {
  const textHex = SOFT_TONE_TEXT_ON[t] === "ink" ? HEX.ink : HEX.paper;
  expect(contrast(SOFT_HEX[t], textHex)).toBeGreaterThanOrEqual(4.5);
});
it("sand with ink text meets 4.5:1", () => expect(contrast(SOFT_HEX.sand, HEX.ink)).toBeGreaterThanOrEqual(4.5));
it("soft tone classes pair fill and text", () => {
  expect(SOFT_TONE_CLASSES).toEqual({
    red: "bg-bh-red text-bh-ink", yellow: "bg-bh-yellow text-bh-ink",
    blue: "bg-bh-blue text-bh-paper", neutral: "bg-bh-charcoal text-bh-paper",
  });
});
it("SOFT_HEX matches theme.css", () => {
  const css = readFileSync(resolve(import.meta.dirname, "../theme.css"), "utf8").toLowerCase();
  expect(css).toContain(`--color-bh-sand: ${SOFT_HEX.sand.toLowerCase()}`);
  expect(css).toContain(`--color-bh-charcoal: ${SOFT_HEX.neutral.toLowerCase()}`);
});

// cn.test.ts (append): one test per group
expect(cn("bg-bh-red", "bg-bh-sand")).toBe("bg-bh-sand");
expect(cn("text-bh-ink", "text-bh-accent")).toBe("text-bh-accent");
expect(cn("rounded-full", "rounded-bh-soft")).toBe("rounded-bh-soft");
expect(cn("font-bh-display", "font-bh-grotesk")).toBe("font-bh-grotesk");
expect(cn("animate-bh-spin", "animate-bh-slide")).toBe("animate-bh-slide");
```

- [ ] **Step 2: Run them and confirm they fail**

Run: `pnpm exec vitest run src/lib`
Expected: FAIL. `SOFT_TONE_TEXT_ON` is undefined, and the `cn` merges keep both classes.

- [ ] **Step 3: Implement**
- Add the tokens and keyframes inside the existing `@theme static` block.
- Add `sand`, `accent` to the `cn.ts` colour group, `bh-soft` under `radius`, `bh-grotesk` under `font`, and `bh-slide`, `bh-grow`, `bh-wordmark` under `animate`.
- Add the palette exports. `SOFT_HEX.neutral` is `#464646` (charcoal).
- Verify the spec §6.6 coloured hard shadow. In a throwaway story, check that `shadow-bh-hard shadow-bh-red` renders a red offset shadow in the Storybook CSS. If it doesn't, add `--shadow-bh-hard-<color>` tokens for every `FillColor`, plus `cn` shadow entries and a test. Record the outcome in the commit body.
- Append these needles to `expected` in `consumer-smoke/check.mjs`: `"--color-bh-sand:"`, `"--color-bh-accent:"`, `"--radius-bh-soft:"`, `"--font-bh-grotesk:"`, `"@keyframes bh-slide"`.

- [ ] **Step 4: Run and confirm they pass**

Run: `pnpm exec vitest run src/lib && pnpm smoke`
Expected: PASS, with every needle `found`.

- [ ] **Step 5: Commit**: `feat(tokens): add soft, swiss and kinetic tokens with soft tone palette`

---

### Task 2: React Aria dependencies, build externals, `"use client"` survival

**Files:**
- Modify: `package.json`, `vite.config.ts`, `consumer-smoke/check.mjs`

**Interfaces:**
- Produces: `react-aria-components` and `@internationalized/date` as `dependencies` (latest versions, checked with `pnpm view <pkg> version`), externalised in the Vite build. Also a smoke check that every built file whose source starts with `"use client"` still starts with it.

- [ ] **Step 1: Write the failing check.** Append to `consumer-smoke/check.mjs`:
  - Walk `src/` for `.tsx` files whose first line is `"use client";`.
  - Map each one to `dist/<same path>.js`.
  - Fail with `MISSING DIRECTIVE <file>` unless that file's first non-empty line is `"use client";` (or `'use client';`).
  - Add a temporary probe `src/components/_base/__probe.tsx` containing `"use client";` and a component that calls `useState`, re-exported from `src/index.ts`.

- [ ] **Step 2: Install the deps and add the externals**
  - Run `pnpm add react-aria-components @internationalized/date`.
  - Add `/^react-aria-components/`, `/^@internationalized\//` and `/^@react-aria\//` to `rollupOptions.external`.

- [ ] **Step 3: Run the check**

Run: `pnpm smoke`
Expected: either a PASS, or `MISSING DIRECTIVE …__probe.js` if the bundler strips directives.

- [ ] **Step 4: If the directive is stripped, keep it.** Add `rollup-plugin-preserve-directives` (as a dev dependency, in `build.rollupOptions.plugins`), or the Vite 8 / rolldown equivalent. Rerun until it passes.

- [ ] **Step 5: Remove the probe and its export.** Confirm `pnpm smoke` still passes; the check passes trivially with no client files.

- [ ] **Step 6: Commit**: `build: add react-aria dependencies and keep use client directives in dist`

---

### Task 3: `IndexCounter` and `SectionLabel`

**Files:**
- Create: `src/components/primitives/IndexCounter/*`, `src/components/primitives/SectionLabel/*`

**Interfaces:**
- Produces:
  - `IndexCounter(props: ComponentProps<"span"> & { current: number; total?: number; pad?: number })`
    - Default `pad` is 2.
    - Visible text is `aria-hidden`: `01` or `01 / 05`.
    - Screen-reader text in `sr-only`: `1` or `1 of 5`.
  - `SectionLabel(props: ComponentProps<"span"> & { marker: string })`
    - Renders `(marker)` followed by the children.
    - Uppercase micro label.

- [ ] **Step 1: Failing tests**

```tsx
it("pads and announces position", () => {
  render(<IndexCounter current={1} total={5} />);
  expect(screen.getByText("01 / 05")).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByText("1 of 5")).toHaveClass("sr-only");
});
it("respects pad", () => { render(<IndexCounter current={7} pad={3} />); expect(screen.getByText("007")).toBeInTheDocument(); });
it("SectionLabel wraps the marker", () => { render(<SectionLabel marker="P">Projects</SectionLabel>); expect(screen.getByText("(P)")).toBeInTheDocument(); expect(screen.getByText("Projects")).toBeInTheDocument(); });
```

- [ ] **Step 2: Run and confirm they fail.** Run: `pnpm exec vitest run src/components/primitives/IndexCounter src/components/primitives/SectionLabel`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement** both components with stories, and export them.
- [ ] **Step 4: Run and confirm they pass.** Expected: PASS.
- [ ] **Step 5: Commit**: `feat(primitives): add IndexCounter and SectionLabel`

---

### Task 4: `BigNumber`, `NumberStepper`, `StatColumns`

**Files:**
- Create: `src/components/primitives/{BigNumber,NumberStepper,StatColumns}/*`

**Interfaces:**
- Produces:
  - `type NumberColor = "ink" | "red" | "blue"`. Static map to `text-bh-*`; no yellow.
  - `BigNumber(props: ComponentProps<"div"> & { value: ReactNode; label?: ReactNode; caption?: ReactNode; color?: NumberColor })`
    - Default `color` is `ink`.
    - Order: label above the value, caption below.
  - `NumberStepper(props: ComponentProps<"div"> & { value: number; ahead?: 1 | 2; pad?: number })`
    - The current value is visible.
    - The next `ahead` numbers are `aria-hidden` with `text-bh-muted`.
  - `StatColumns(props: ComponentProps<"div"> & { items: Array<{ label: ReactNode; value: ReactNode; title?: ReactNode; list?: ReactNode[] }> })`
    - Ruled columns (`divide-x divide-bh-rule`).
    - Static column map from `items.length` (2/3/4 → `md:grid-cols-2|3|4`).
    - Each `list` renders as a `<ul>`.

- [ ] **Step 1: Failing tests**

```tsx
it("BigNumber orders label, value, caption", () => {
  render(<BigNumber label="Days" value="23" caption="left" />);
  const [a, b, c] = ["Days", "23", "left"].map((t) => screen.getByText(t));
  expect(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(b.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
it("NumberStepper ghosts the next numbers", () => {
  render(<NumberStepper value={23} />);
  expect(screen.getByText("23")).not.toHaveAttribute("aria-hidden");
  expect(screen.getByText("24").closest("[aria-hidden='true']")).not.toBeNull();
  expect(screen.getByText("25").closest("[aria-hidden='true']")).not.toBeNull();
});
it("StatColumns renders one column per item with its list", () => {
  render(<StatColumns items={[{ label: "A", value: "24H", list: ["x", "y"] }, { label: "B", value: "2 DAYS" }]} />);
  expect(screen.getByText("24H")).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});
```

- [ ] **Step 2: Run and confirm they fail.** Expected: FAIL (module not found).
- [ ] **Step 3: Implement** the three components with stories, and export them.
- [ ] **Step 4: Run and confirm they pass.**
- [ ] **Step 5: Commit**: `feat(primitives): add BigNumber, NumberStepper and StatColumns`

---

### Task 5: `ProgressRule`

**Files:**
- Create: `src/components/primitives/ProgressRule/*`

**Interfaces:**
- Produces: `ProgressRule(props: Omit<ComponentProps<"div">, "color"> & { value: number; label?: string; color?: FillColor })`
  - Default `color` is `blue`.
  - A 2px `bg-bh-rule` track with a fill whose width is set by inline style (`${v * 100}%`).
  - `v` is clamped to [0, 1]; `NaN` becomes 0.
  - **With `label`:** `role="progressbar"`, `aria-label`, `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow=Math.round(v*100)`.
  - **Without `label`:** `aria-hidden="true"`.

- [ ] **Step 1: Failing tests** (Review Focus 5 included)

```tsx
it("exposes progress when labelled", () => {
  render(<ProgressRule value={0.4} label="Slides" />);
  expect(screen.getByRole("progressbar", { name: "Slides" })).toHaveAttribute("aria-valuenow", "40");
});
it("is decorative without a label", () => {
  const { container } = render(<ProgressRule value={0.4} />);
  expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
});
it.each([[-1, "0"], [2, "100"], [Number.NaN, "0"]])("clamps %s to %s", (v, now) => {
  render(<ProgressRule value={v} label="p" />);
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", now);
});
```

- [ ] **Step 2: Run and confirm they fail.** **Step 3: Implement** with a story, and export it. **Step 4: Run and confirm they pass.**
- [ ] **Step 5: Commit**: `feat(primitives): add ProgressRule`

---

### Task 6: `RuledList`, `Timeline`, `Stepper`

**Files:**
- Create: `src/components/primitives/{RuledList,Timeline,Stepper}/*`

**Interfaces:**
- Produces:
  - `RuledList(props: ComponentProps<"ul"> & { items: Array<{ content: ReactNode; offset?: 0 | 1 | 2 | 3 }> })`
    - Each `<li>` has `border-b border-bh-rule`.
    - `offset` is a static map: `pl-0`, `pl-[12.5%]`, `pl-[25%]`, `pl-[37.5%]`.
  - `Timeline(props: ComponentProps<"ol"> & { items: Array<{ year: string; content: ReactNode }> })`
    - Each year renders as `<time dateTime={year}>` in display type.
  - `Stepper(props: ComponentProps<"ol"> & { steps: Array<{ label: ReactNode; color?: FillColor }>; current: number })`
    - `current` is 0-based.
    - Each dot shows the 1-based number with `FILL_CLASSES[color ?? "ink"]`.
    - The current `<li>` has `aria-current="step"`.
    - The dashed connector is `aria-hidden`.

- [ ] **Step 1: Failing tests**

```tsx
it("RuledList renders items as list items", () => { render(<RuledList items={[{ content: "Pure" }, { content: "Innovative", offset: 2 }]} />); expect(screen.getAllByRole("listitem")).toHaveLength(2); });
it("Timeline marks years as time", () => { render(<Timeline items={[{ year: "1919", content: "Founded" }]} />); expect(screen.getByText("1919").tagName).toBe("TIME"); expect(screen.getByText("1919")).toHaveAttribute("datetime", "1919"); });
it("Stepper marks the current step", () => {
  render(<Stepper current={1} steps={[{ label: "Arrive" }, { label: "Stay" }, { label: "Leave" }]} />);
  const items = screen.getAllByRole("listitem");
  expect(items[1]).toHaveAttribute("aria-current", "step");
  expect(items[0]).not.toHaveAttribute("aria-current");
  expect(within(items[2]).getByText("3")).toBeInTheDocument();
});
```

- [ ] **Steps 2–4:** Fail, then implement with stories and exports, then pass.
- [ ] **Step 5: Commit**: `feat(primitives): add RuledList, Timeline and Stepper`

---

### Task 7: `Avatar`, `MediaBlock`, `QuoteBlock`

**Files:**
- Create: `src/components/primitives/{Avatar,MediaBlock,QuoteBlock}/*`

**Interfaces:**
- Produces:
  - `Avatar(props: Omit<ComponentProps<"img">, "alt"> & { alt: string; rings?: 0 | 1 | 2 | 3; size?: "sm" | "md" | "lg" })`
    - The circular `<img>` sits inside a wrapper `<span>`.
    - The rings are `aria-hidden` outline circles behind it, at static insets `-inset-2`, `-inset-4` and `-inset-6`.
    - `className` goes on the wrapper.
  - `MediaBlock(props: Omit<ComponentProps<"div">, "color"> & { src: string; alt: string; color?: FillColor })`
    - Default `color` is `blue`.
    - The `<img>` has the `grayscale` class and sits over a `BG_CLASSES[color]` block.
  - `QuoteBlock(props: ComponentProps<"blockquote"> & { cite?: ReactNode })`
    - An `aria-hidden` oversized `“` in `text-bh-muted`.
    - Sans type only.
    - `cite` renders as `<footer><cite>`.

- [ ] **Step 1: Failing tests**

```tsx
it("Avatar exposes the image and hides the rings", () => {
  const { container } = render(<Avatar src="a.jpg" alt="Portrait" rings={2} />);
  expect(screen.getByRole("img", { name: "Portrait" })).toBeInTheDocument();
  expect(container.querySelectorAll("[aria-hidden='true']")).toHaveLength(2);
});
it("MediaBlock renders a grayscale image", () => { render(<MediaBlock src="b.jpg" alt="Building" />); expect(screen.getByRole("img", { name: "Building" })).toHaveClass("grayscale"); });
it("QuoteBlock is a blockquote with a citation", () => {
  render(<QuoteBlock cite="Picabia">The mind is like an umbrella</QuoteBlock>);
  expect(screen.getByText("Picabia").tagName).toBe("CITE");
  expect(screen.getByText("“")).toHaveAttribute("aria-hidden", "true");
});
```

- [ ] **Steps 2–4:** Fail, then implement with stories and exports, then pass.
- [ ] **Step 5: Commit**: `feat(primitives): add Avatar, MediaBlock and QuoteBlock`

---

### Task 8: `Wordmark`

**Files:**
- Create: `src/components/primitives/Wordmark/*`
- Modify: `consumer-smoke/check.mjs`

**Interfaces:**
- Produces: `Wordmark(props: ComponentProps<"h1"> & { as?: "h1" | "p" })`
  - Default `as` is `h1`.
  - Giant display type, `sticky top-0 origin-top-left`.
  - The animation applies only under both `motion-safe:` and `supports-[animation-timeline:scroll()]:`. Use static arbitrary classes that set `animation: var(--animate-bh-wordmark)`, `animation-timeline: scroll()` and `animation-range: 0 40vh`.
  - No `"use client"`, no hooks.
  - Without support, or under reduced motion, it stays giant and scrolls away with the page.

- [ ] **Step 1: Failing tests**

```tsx
it("renders a heading with no client code", () => {
  render(<Wordmark>Off menu</Wordmark>);
  expect(screen.getByRole("heading", { level: 1, name: "Off menu" })).toBeInTheDocument();
  const src = readFileSync(resolve(import.meta.dirname, "Wordmark.tsx"), "utf8");
  expect(src).not.toMatch(/use client|useEffect|useState/);
});
it("only animates behind motion-safe and scroll-timeline support", () => {
  render(<Wordmark>Off</Wordmark>);
  const cls = screen.getByRole("heading").className;
  expect(cls).toMatch(/motion-safe:supports-\[animation-timeline:scroll\(\)\]:/);
});
```

- [ ] **Step 2:** Fail. **Step 3:** Implement, add a story, export it, and append `"@keyframes bh-wordmark"` to the smoke needles. **Step 4:** Run `pnpm exec vitest run src/components/primitives/Wordmark && pnpm smoke`; both pass.
- [ ] **Step 5: Commit**: `feat(primitives): add scroll-driven Wordmark`

---

### Task 9: `ButtonBase` and refactor `ButtonPlayful`

Establishes the base/skin pattern every later matrix task copies.

**Files:**
- Create: `src/components/_base/Button/ButtonBase.tsx`, `ButtonBase.test.tsx`
- Modify: `src/components/playful/ButtonPlayful/ButtonPlayful.tsx`

**Interfaces:**
- Produces:

```ts
// _base/Button/ButtonBase.tsx
export type ButtonBaseClasses = { root: string };
type Shared = { classes: ButtonBaseClasses; disabled?: boolean; className?: string; children: ReactNode };
export type ButtonBaseProps =
  | (Shared & Omit<ComponentProps<"button">, keyof Shared> & { href?: undefined })
  | (Shared & Omit<ComponentProps<"a">, keyof Shared> & { href: string });
export function ButtonBase(props: ButtonBaseProps): JSX.Element;
```

- The base owns:
  - the `<a>`/`<button>` switch
  - `type="button"` default
  - the disabled-link attributes
  - `onClick` dropped when disabled
  - `cn(classes.root, className)`
- `ButtonPlayful` keeps its exact public props. It computes `root` from its existing maps (including the disabled vs `HOVER_LIFT`/`PRESS` branch), strips `variant`/`color`/`size`, and passes the rest to `ButtonBase`.
- **It must emit the same class strings as v1.**

- [ ] **Step 1: Failing base tests.** Move the behaviour cases into `ButtonBase.test.tsx`, rendering with `classes={{ root: "r" }}`:
  - default `type="button"`
  - explicit submit
  - `href` → link
  - disabled link has no `href`, has `aria-disabled`, `tabindex=-1`, and clicking it doesn't call `onClick`
  - disabled button
  - `className` merges after `root`: `expect(el).toHaveClass("r", "x")`
  - ref forwarding: `ref.current` is an `HTMLButtonElement`, or an `HTMLAnchorElement` with `href`

- [ ] **Step 2: Run and confirm they fail.** Run: `pnpm exec vitest run src/components/_base/Button`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement `ButtonBase`, then rewire `ButtonPlayful` onto it.** Do not edit `ButtonPlayful.test.tsx`.
- [ ] **Step 4: Run.** Run: `pnpm exec vitest run src/components/_base/Button src/components/playful/ButtonPlayful`. Expected: PASS, with the v1 test file untouched (`git diff --stat` shows no change to it).
- [ ] **Step 5: Commit**: `refactor(button): move behaviour into internal ButtonBase`

---

### Task 10: `IconButtonBase` and refactor `IconButtonPlayful` (adds `href`)

**Files:**
- Create: `src/components/_base/IconButton/IconButtonBase.tsx`, `.test.tsx`
- Modify: `src/components/playful/IconButtonPlayful/IconButtonPlayful.tsx`

**Interfaces:**
- Consumes: `ButtonBase`, `ButtonBaseProps` (Task 9)
- Produces:
  - `type IconButtonBaseProps = ButtonBaseProps & { "aria-label": string }`
  - `IconButtonBase(props)` delegates to `ButtonBase`.
  - `IconButtonPlayful` gains an optional `href` (an additive anchor branch). `size="lg"` is the FAB. Everything else is unchanged.

- [ ] **Step 1: Failing tests**
  - Base: renders a button named by `aria-label`, and a link named by `aria-label` when given `href`.
  - Playful (new file `IconButtonPlayful.href.test.tsx`, so the v1 file stays untouched): `render(<IconButtonPlayful aria-label="Next" href="/n">→</IconButtonPlayful>)` → `getByRole("link", { name: "Next" })`.
- [ ] **Steps 2–4:** Fail, implement, then pass. The v1 `IconButtonPlayful.test.tsx` passes unchanged.
- [ ] **Step 5: Commit**: `refactor(icon-button): move onto IconButtonBase and support href`

---

### Task 11: `TagBase`, `ProjectCardBase`, and their refactors

**Files:**
- Create: `src/components/_base/{Tag,ProjectCard}/*Base.tsx` + tests
- Modify: `TagPlayful.tsx`, `ProjectCardPlayful.tsx`

**Interfaces:**
- Produces:
  - `TagBase(props: ComponentProps<"span"> & { classes: { root: string } })`
  - `ProjectCardBase(props: Omit<ComponentProps<"a">, "title"> & { href: string; initial: string; title: string; description?: ReactNode; tag?: ReactNode; media?: ReactNode; headingLevel?: 2 | 3; classes: ProjectCardBaseClasses })`
    - `ProjectCardBaseClasses = { root: string; initial: string; body: string; title: string; description: string; tag: string; media: string; arrow: string }`.
    - Move the v1 JSX, the `useId` labelling and the heading switch into the base unchanged.
  - `ProjectCardPlayful` renders its `tag` prop as `<TagPlayful color={tag.color}>{tag.label}</TagPlayful>` and passes that node to the base's `tag`.

- [ ] **Step 1: Failing base tests**
  - `ProjectCardBase`: the whole card is one link named by its title; `headingLevel` 2 renders an `h2`; `tag` and `media` nodes render inside the link.
  - `TagBase`: renders a span with merged `className`.
- [ ] **Steps 2–4:** Fail, implement, then pass. The v1 tests pass unchanged.
- [ ] **Step 5: Commit**: `refactor(tag, project-card): move onto internal bases`

---

### Task 12: `TopBarBase`, `FooterBase`, and their refactors

**Files:**
- Create: `src/components/_base/{TopBar,Footer}/*Base.tsx` + tests
- Modify: `TopBarPlayful.tsx`, `FooterPlayful.tsx`

**Interfaces:**
- Produces:
  - `TopBarBase(props: ComponentProps<"header"> & { brand: ReactNode; meta?: ReactNode[]; action?: ReactNode; classes: { root: string; cell: string; meta: string; action: string } })`
  - `FooterBase(props: ComponentProps<"footer"> & { columns: ReactNode[]; bottom?: ReactNode; classes: { root: string; grid: string; column: string; bottom: string } })`
  - Any class that depends on a count (e.g. `md:grid-cols-6`) stays in the skin's static map and is passed in via `classes.grid`.

- [ ] **Step 1: Failing base tests**
  - `TopBarBase`: role `banner`; brand, every meta item and the action render in order.
  - `FooterBase`: role `contentinfo`; one cell per column; `bottom` renders after the grid.
- [ ] **Steps 2–4:** Fail, implement, then pass. The v1 tests pass unchanged.
- [ ] **Step 5: Commit**: `refactor(top-bar, footer): move onto internal bases`

---

### Task 13: `TextLink` and `Chip` (base + Playful)

**Files:**
- Create: `_base/{TextLink,Chip}/*`, `playful/{TextLinkPlayful,ChipPlayful}/*`

**Interfaces:**
- Produces:
  - `type TextLinkArrow = "right" | "up-right" | "down"`. Glyphs `→`, `↗`, `↓`, rendered `aria-hidden` after the text.
  - `TextLinkBase(props: ComponentProps<"a"> & { href: string; arrow?: TextLinkArrow; classes: { root: string; arrow: string } })`
  - `ChipBase(props: ComponentProps<"span"> & { icon?: ReactNode; classes: { root: string; icon: string } })`. The icon wrapper is `aria-hidden`.
  - **`TextLinkPlayful`:** same props minus `classes`. 2px underline with `underline-offset-4`, bold display type, and `FOCUS_RING`.
  - **`ChipPlayful`:** `bg-bh-ink text-bh-paper rounded-full`, uppercase micro label.

- [ ] **Step 1: Failing tests**
  - Base: the link's name excludes the arrow (`getByRole("link", { name: "See the courses" })` with `arrow="right"`); the chip icon is `aria-hidden`.
  - Each skin: role and name, `className` forwarding, ref forwarding.
- [ ] **Steps 2–4:** Fail, then implement with stories (`Playful/TextLinkPlayful`, `Playful/ChipPlayful`) and exports, then pass.
- [ ] **Step 5: Commit**: `feat(playful): add TextLinkPlayful and ChipPlayful`

---

### Task 14: `Card`, `StackCard`, `BottomNav` (base + Playful)

**Files:**
- Create: `_base/{Card,StackCard,BottomNav}/*`, `playful/{CardPlayful,StackCardPlayful,BottomNavPlayful}/*`

**Interfaces:**
- Produces:
  - **`CardBase`:** `(props: Omit<ComponentProps<"article">, "title"> & { header?: ReactNode; footer?: ReactNode; href?: string; classes: { root: string; header: string; body: string; footer: string } })`
    - The root is `<article>`, or `<a href>` when `href` is set.
  - **`StackCardBase`:** `(props: ComponentProps<"div"> & { action?: ReactNode; classes: { root: string; spine: string; body: string; action: string } })`
    - The spine is an `aria-hidden` span.
  - **`BottomNavBase`:** `(props: Omit<ComponentProps<"nav">, "children"> & { label: string; items: BottomNavItem[]; showLabels?: boolean; classes: { root: string; list: string; item: string; link: string; icon: string; label: string } })`
    - `type BottomNavItem = { href: string; label: string; icon: ReactNode; current?: boolean }`
    - `aria-current="page"` only on the current item.
    - The icon is `aria-hidden`.
    - The label gets `sr-only` when `!showLabels`.
  - **Playful skins:**
    - `CardPlayful`: sharp, `border-2 border-bh-ink`, `shadow-bh-hard`.
    - `StackCardPlayful`: adds `color?: FillColor` for the spine (default `red`).
    - `BottomNavPlayful`: an `ink` bar; the current link gets `aria-[current=page]:bg-bh-yellow aria-[current=page]:text-bh-ink rounded-full`.

- [ ] **Step 1: Failing tests**

```tsx
it("CardBase becomes one link with href", () => { render(<CardBase classes={c} href="/x" header={<h3>Read</h3>}>Body</CardBase>); expect(screen.getByRole("link")).toHaveTextContent("ReadBody"); });
it("CardBase is an article without href", () => { render(<CardBase classes={c}>Body</CardBase>); expect(screen.getByRole("article")).toBeInTheDocument(); });
it("BottomNav marks only the current page", () => {
  render(<BottomNavBase classes={n} label="Main" items={[{ href: "/", label: "Home", icon: "⌂", current: true }, { href: "/s", label: "Search", icon: "⌕" }]} />);
  expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "Search" })).not.toHaveAttribute("aria-current");
});
```

- Each skin also gets: role and name, `className` forwarding, ref forwarding, and the skin-only prop (`StackCardPlayful color="blue"` → the spine has `bg-bh-blue`).
- [ ] **Steps 2–4:** Fail, then implement with stories and exports, then pass.
- [ ] **Step 5: Commit**: `feat(playful): add CardPlayful, StackCardPlayful and BottomNavPlayful`

---

### Task 15: `MenuOverlay` (React Aria dialog, base + Playful)

**Files:**
- Create: `_base/MenuOverlay/*`, `playful/MenuOverlayPlayful/*`

**Interfaces:**
- Produces:
  - `"use client"`. Built from `DialogTrigger`, `Button`, `ModalOverlay`, `Modal` and `Dialog` from `react-aria-components`.
  - **Props:** `MenuOverlayBase(props: { triggerLabel: string; title: string; links: MenuLink[]; secondary?: ReactNode; isOpen?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; className?: string; classes: MenuOverlayBaseClasses })`
    - `type MenuLink = { href: string; label: string; current?: boolean }`
    - `MenuOverlayBaseClasses = { trigger, overlay, panel, close, list, item, link, secondary }`, all strings.
  - **Structure:**
    - The `Dialog` is labelled by a visually hidden heading containing `title`.
    - A close button labelled `Close menu`.
    - Links stacked in a `<ul>`, with `aria-current="page"` on the current one.
    - Activating any link closes the menu.
    - The overlay is solid (`bg-bh-paper`) with no backdrop blur.
  - **`MenuOverlayPlayful`:** a pill trigger, large uppercase display links divided by `border-b-2 border-bh-ink`, and `hover:bg-bh-yellow` on links.

- [ ] **Step 1: Failing tests** (Review Focus 3 included)

```tsx
const links = [{ href: "/work", label: "Work" }, { href: "/about", label: "About", current: true }];
it("opens a labelled dialog from the trigger", async () => {
  render(<MenuOverlayBase classes={m} triggerLabel="Menu" title="Site menu" links={links} />);
  await userEvent.click(screen.getByRole("button", { name: "Menu" }));
  expect(screen.getByRole("dialog", { name: "Site menu" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
});
it.each(["escape", "close", "link"])("closes via %s and returns focus to the trigger", async (how) => {
  render(<MenuOverlayBase classes={m} triggerLabel="Menu" title="Site menu" links={links} />);
  const trigger = screen.getByRole("button", { name: "Menu" });
  await userEvent.click(trigger);
  if (how === "escape") await userEvent.keyboard("{Escape}");
  if (how === "close") await userEvent.click(screen.getByRole("button", { name: "Close menu" }));
  if (how === "link") await userEvent.click(screen.getByRole("link", { name: "Work" }));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(trigger).toHaveFocus();
});
it("is controllable", async () => {
  const onOpenChange = vi.fn();
  render(<MenuOverlayBase classes={m} triggerLabel="Menu" title="t" links={links} isOpen onOpenChange={onOpenChange} />);
  await userEvent.keyboard("{Escape}");
  expect(onOpenChange).toHaveBeenCalledWith(false);
});
```

- The skin also gets: the dialog opens; `className` lands on the trigger. *(Plan's call: the root is the trigger, since the overlay portals out.)*
- [ ] **Steps 2–4:** Fail, then implement with a story and exports, then pass.
- [ ] **Step 5: Commit**: `feat(playful): add MenuOverlayPlayful on React Aria dialog`

---

### Task 16: `Carousel` (APG pattern, base + Playful)

**Files:**
- Create: `_base/Carousel/*`, `playful/CarouselPlayful/*`

**Interfaces:**
- Consumes: `IndexCounter` (Task 3), `ProgressRule` (Task 5), `IconButtonPlayful` (Task 10)
- Produces:
  - `"use client"`.
  - **Props:** `CarouselBase(props: { label: string; children: ReactNode; index?: number; defaultIndex?: number; onIndexChange?: (i: number) => void; renderButton: (p: CarouselButtonProps) => ReactNode; className?: string; classes: { root; viewport; track; slide; controls; pager } })`
    - `type CarouselButtonProps = { direction: "prev" | "next"; label: string; disabled: boolean; onClick: () => void }`
    - The labels are `Previous slide` and `Next slide`.
  - **Structure:**
    - The root is a `<section aria-roledescription="carousel" aria-label={label}>`.
    - Each slide (from `Children.toArray(children)`) is `role="group" aria-roledescription="slide" aria-label="n of m"`.
    - Non-current slides get `inert` and `aria-hidden`.
    - An `aria-live="polite"` region reads `Slide n of m`.
    - The pager is `<IndexCounter current={i+1} total={m} />` plus `<ProgressRule value={(i+1)/m} />`.
    - It doesn't wrap at the ends, and there is no autoplay.
  - **First step:** check `react-aria-components` exports for a carousel. If one exists, raise it with the author before continuing, as spec §9.6 says.
  - **`CarouselPlayful`:** `renderButton` returns `<IconButtonPlayful aria-label={label} variant="outline">`.

- [ ] **Step 1: Failing tests** (Review Focus 2 included)

```tsx
const ui = (n: number, props = {}) => render(<CarouselBase classes={k} label="Projects" renderButton={({ label, disabled, onClick }) => <button aria-label={label} disabled={disabled} onClick={onClick} />} {...props}>{Array.from({ length: n }, (_, i) => <p key={i}>S{i + 1}</p>)}</CarouselBase>);
it("moves forward and announces the slide", async () => {
  ui(3);
  await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(screen.getByText("Slide 2 of 3")).toBeInTheDocument();
  expect(screen.getByRole("group", { name: "2 of 3" })).not.toHaveAttribute("aria-hidden");
  expect(screen.getByText("S1").closest("[role='group']")).toHaveAttribute("aria-hidden", "true");
});
it("disables previous at the start and next at the end", async () => {
  ui(2);
  expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
});
it("handles a single slide", () => {
  ui(1);
  expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  expect(screen.getByText("01 / 01")).toBeInTheDocument();
});
it("is controllable", async () => {
  const onIndexChange = vi.fn();
  ui(3, { index: 0, onIndexChange });
  await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(onIndexChange).toHaveBeenCalledWith(1);
  expect(screen.getByText("Slide 1 of 3")).toBeInTheDocument();
});
```

- The skin also gets: the region is named `Projects`, and its buttons are the Playful icon buttons (role and name).
- [ ] **Steps 2–4:** Fail, then implement with a story and exports, then pass.
- [ ] **Step 5: Commit**: `feat(playful): add CarouselPlayful on the APG carousel pattern`

---

### Task 17: `Tabs` (React Aria, base + Playful)

**Files:**
- Create: `_base/Tabs/*`, `playful/TabsPlayful/*`

**Interfaces:**
- Produces:
  - `"use client"`.
  - **Props:** `TabsBase(props: { label: string; items: TabItem[]; selectedKey?: string; defaultSelectedKey?: string; onSelectionChange?: (key: string) => void; className?: string; classes: { root; list; tab; panel } })`
    - `type TabItem = { id: string; title: ReactNode; content: ReactNode; disabled?: boolean }`
  - **Structure:** built from React Aria `Tabs`, `TabList` (`aria-label={label}`), `Tab` and `TabPanel`. Disabled items go into `disabledKeys`.
  - **`TabsPlayful`:** the selected tab gets `data-selected:bg-bh-ink data-selected:text-bh-paper rounded-full`.

- [ ] **Step 1: Failing tests**

```tsx
const items = [{ id: "a", title: "One", content: "P1" }, { id: "b", title: "Two", content: "P2", disabled: true }, { id: "c", title: "Three", content: "P3" }];
it("switches panels by arrow key and skips disabled tabs", async () => {
  render(<TabsBase classes={t} label="Sections" items={items} />);
  await userEvent.click(screen.getByRole("tab", { name: "One" }));
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("P3");
});
it("reports selection changes", async () => {
  const onSelectionChange = vi.fn();
  render(<TabsBase classes={t} label="Sections" items={items} selectedKey="a" onSelectionChange={onSelectionChange} />);
  await userEvent.click(screen.getByRole("tab", { name: "Three" }));
  expect(onSelectionChange).toHaveBeenCalledWith("c");
});
```

- The skin also gets: a tablist named `Sections`, and `className` on the root.
- [ ] **Steps 2–4:** Fail, then implement with a story and exports, then pass.
- [ ] **Step 5: Commit**: `feat(playful): add TabsPlayful on React Aria tabs`

---

### Task 18: `DateStrip` (React Aria radio group, base + Playful)

**Files:**
- Create: `_base/DateStrip/*`, `playful/DateStripPlayful/*`

**Interfaces:**
- Produces:
  - `"use client"`.
  - **Props:** `DateStripBase(props: { label: string; start: CalendarDate; days?: number; value?: CalendarDate | null; defaultValue?: CalendarDate; onChange?: (d: CalendarDate) => void; minValue?: CalendarDate; maxValue?: CalendarDate; locale?: string; className?: string; classes: { root; day; weekday; number } })`
    - Defaults: `days` 7, `locale` `"en-US"`.
  - **Structure:**
    - React Aria `RadioGroup` (`orientation="horizontal"`, `aria-label={label}`).
    - One `Radio` per day, from `start.add({ days: i })`, with `value={date.toString()}`.
    - Days outside `minValue`/`maxValue` are disabled.
    - **Visible text:** short weekday + day number.
    - **Accessible name:** the full date, from `DateFormatter(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })` applied to `date.toDate("UTC")`.
  - **`DateStripPlayful`:** a sharp tile; the selected one gets `data-selected:bg-bh-yellow data-selected:border-2 data-selected:border-bh-ink`.

- [ ] **Step 1: Failing tests** (Review Focus 1 included)

```tsx
it("crosses a year boundary", async () => {
  const onChange = vi.fn();
  render(<DateStripBase classes={d} label="Pick a day" start={new CalendarDate(2026, 12, 29)} onChange={onChange} />);
  const radios = screen.getAllByRole("radio");
  expect(radios.map((r) => r.closest("label")!.textContent)).toEqual(
    expect.arrayContaining([expect.stringContaining("31"), expect.stringContaining("1")]));
  await userEvent.click(screen.getByRole("radio", { name: "Thursday, December 31, 2026" }));
  await userEvent.keyboard("{ArrowRight}");
  expect(onChange).toHaveBeenLastCalledWith(new CalendarDate(2027, 1, 1));
});
it("disables days outside the range", () => {
  render(<DateStripBase classes={d} label="Pick" start={new CalendarDate(2026, 11, 16)} minValue={new CalendarDate(2026, 11, 18)} />);
  expect(screen.getByRole("radio", { name: /November 16, 2026/ })).toBeDisabled();
  expect(screen.getByRole("radio", { name: /November 18, 2026/ })).toBeEnabled();
});
it("uses the locale for weekday names", () => {
  render(<DateStripBase classes={d} label="Día" locale="es-ES" start={new CalendarDate(2026, 11, 16)} />);
  expect(screen.getByRole("radio", { name: /lunes/ })).toBeInTheDocument();
});
```

- The skin also gets: a radiogroup named `Pick a day`, and `className` on the root.
- [ ] **Steps 2–4:** Fail, then implement with a story and exports, then pass.
- [ ] **Step 5: Commit**: `feat(playful): add DateStripPlayful on React Aria radio group`

---

### Task 19: `AudioPlayer` (React Aria slider, base + Playful)

**Files:**
- Create: `src/lib/time.ts`, `time.test.ts`, `_base/AudioPlayer/*`, `playful/AudioPlayerPlayful/*`

**Interfaces:**
- Produces:
  - **`formatTime(seconds: number): string`** returns `m:ss`. Non-finite input returns `--:--`; negative input returns `0:00`.
  - `"use client"`.
  - **Props:** `AudioPlayerBase(props: { src: string; title: string; children?: ReactNode; ref?: Ref<HTMLAudioElement>; className?: string; classes: { root; play; scrubber; track; thumb; time } })`
  - **Structure:**
    - A native `<audio>` with no `controls`; `children` pass into it (for `<track>`).
    - The play button is labelled `Play {title}`, or `Pause {title}` while playing.
    - A React Aria `Slider` labelled `Seek`, with `minValue=0` and `maxValue=duration` (0 when non-finite).
    - Seeking sets `currentTime`.
    - The time text reads `formatTime(current) / formatTime(duration)`.
  - **`AudioPlayerPlayful`:** an `ink` circular play button, a 2px `ink` track, and a yellow square thumb.

- [ ] **Step 1: Failing tests** (Review Focus 4 included)

```ts
it.each([[0, "0:00"], [65, "1:05"], [3599, "59:59"], [Number.NaN, "--:--"], [Infinity, "--:--"], [-3, "0:00"]])("formatTime(%s)", (s, out) => expect(formatTime(s)).toBe(out));
```
```tsx
beforeEach(() => { vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(); vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {}); });
it("toggles play and pause", async () => {
  render(<AudioPlayerBase classes={a} src="t.mp3" title="Track one" />);
  await userEvent.click(screen.getByRole("button", { name: "Play Track one" }));
  expect(screen.getByRole("button", { name: "Pause Track one" })).toBeInTheDocument();
});
it("shows unknown duration before metadata", () => {
  render(<AudioPlayerBase classes={a} src="t.mp3" title="T" />);
  expect(screen.getByText("0:00 / --:--")).toBeInTheDocument();
  expect(screen.getByRole("slider", { name: "Seek" })).toBeInTheDocument();
});
it("forwards the audio ref", () => { const ref = createRef<HTMLAudioElement>(); render(<AudioPlayerBase classes={a} src="t.mp3" title="T" ref={ref} />); expect(ref.current).toBeInstanceOf(HTMLAudioElement); });
```

- [ ] **Steps 2–4:** Fail, then implement with a story and exports, then pass.
- [ ] **Step 5: Commit**: `feat(playful): add AudioPlayerPlayful with React Aria seek slider`

---

### Task 20: `Pattern` and `Shape` `fill`

**Files:**
- Create: `src/components/decoration/Pattern/*`
- Modify: `src/components/decoration/Shape/Shape.tsx`
- Test: `Shape.fill.test.tsx` (new; the v1 test stays untouched)

**Interfaces:**
- Consumes: `CURRENT_COLOR_CLASSES`, `HEX` (Task 1)
- Produces:
  - `type PatternKind = "hatch-vertical" | "hatch-horizontal" | "checker" | "grid-paper" | "halftone" | "grain"`
  - **`Pattern(props: Omit<ComponentProps<"div">, "color"> & { kind: PatternKind; color?: FillColor })`**
    - Default `color` is `ink`.
    - `aria-hidden`, fills its box.
    - Each kind is one static class string drawing in `currentColor`. Hard-stop `repeating-linear-gradient`, `conic-gradient` and `radial-gradient` give lines and dots, not blends.
    - `grain` is a static inline SVG `feTurbulence` data URI.
  - **`Shape`** gains `fill?: "solid" | "outline" | "pattern"` (default `solid`, identical v1 output) and `pattern?: PatternKind` (default `hatch-vertical`, used when `fill="pattern"`).
    - **Outline:** an inline `<svg viewBox="0 0 100 100" overflow="visible">` with `fill="none"`, `stroke={HEX[color]}`, `strokeWidth={2}` and `vectorEffect="non-scaling-stroke"`. Geometry per kind:
      - `circle`: `<circle cx=50 cy=50 r=50>`
      - `quarter`: `M100 100 H0 A100 100 0 0 1 100 0 Z`
      - `half`: `M0 100 A50 50 0 0 1 100 100 Z`
      - `triangle`: `M50 0 L100 100 L0 100 Z`
      - `square`: `<rect width=100 height=100>`
      - `bar`: `<rect y=37.5 width=100 height=25 rx=12.5>`
    - **Pattern:** the v1 shape mask (radius or clip-path) with a `<Pattern kind={pattern} color={color} />` inside, instead of the background.

- [ ] **Step 1: Failing tests**
  - `Pattern`: renders `aria-hidden` for every kind (`it.each`).
  - `Shape fill="outline"`: renders an `svg` whose stroke equals `HEX.red`, and has no `bg-bh-red` class.
  - `Shape fill="pattern" pattern="checker"`: contains an `aria-hidden` child pattern element.
  - The existing v1 `Shape.test.tsx` passes unchanged.
- [ ] **Steps 2–4:** Fail, then implement with stories and exports, then pass.
- [ ] **Step 5: Commit**: `feat(decoration): add Pattern and Shape outline/pattern fills`

---

### Task 21: `Ribbon`, `SkewBar`, `KineticRule`, `Composition`

**Files:**
- Create: `src/components/decoration/{Ribbon,SkewBar,KineticRule,Composition}/*`
- Modify: `consumer-smoke/check.mjs`

**Interfaces:**
- Produces (all `aria-hidden`):
  - **`Ribbon(props: Omit<ComponentProps<"div">, "color"> & { text: string; angle?: -12 | -6 | 6 | 12; color?: FillColor })`**
    - Defaults: `angle` −12, `color` `red`.
    - The angle uses a static map: `-rotate-12`, `-rotate-6`, `rotate-6`, `rotate-12`.
    - The text repeats 8 times, separated by ` — `, using `FILL_CLASSES[color]`.
  - **`SkewBar(props: Omit<ComponentProps<"div">, "color"> & { color?: FillColor; shadowColor?: FillColor; label?: string })`**
    - `-skew-x-12`.
    - When `shadowColor` is set, an offset duplicate sits behind (`translate-x-2 translate-y-2`) with `BG_CLASSES[shadowColor]`.
  - **`KineticRule(props: Omit<ComponentProps<"div">, "color"> & { color?: FillColor })`**
    - A 2px rule with `motion-safe:animate-bh-grow` (`origin-left`).
    - A dot with `absolute -translate-x-1/2 motion-safe:animate-bh-slide`.
  - **`Composition(props: ComponentProps<"div"> & { cols: 2|3|4|5|6; rows: 2|3|4|5|6; cells: CompositionCell[] })`**
    - `type CompositionCell = { col: 1|2|3|4|5|6; row: 1|2|3|4|5|6; colSpan?: 1|2|3|4|5|6; rowSpan?: 1|2|3|4|5|6; node: ReactNode }`
    - Static maps for `grid-cols-*`, `grid-rows-*`, `col-start-*`, `row-start-*`, `col-span-*` and `row-span-*`.

- [ ] **Step 1: Failing tests**
  - Each component renders with `aria-hidden="true"` on its root.
  - `Ribbon` repeats the text 8 times (`getAllByText` on a split, or a count on `textContent`).
  - `SkewBar` without `shadowColor` renders one bar; with it, two.
  - `KineticRule`'s animated classes all carry `motion-safe:` (assert that `className` matches `/motion-safe:animate-bh-slide/` and does not contain an unprefixed ` animate-bh-slide`).
  - `Composition` renders one child per cell, in order.
- [ ] **Step 2:** Fail. **Step 3:** Implement with stories and exports, and append `".motion-safe\\:animate-bh-slide"` and `"@keyframes bh-grow"` to the smoke needles. **Step 4:** Run the tests plus `pnpm smoke`; all pass.
- [ ] **Step 5: Commit**: `feat(decoration): add Ribbon, SkewBar, KineticRule and Composition`

---

### Task 22: Release 0.2.0

**Files:**
- Modify: `package.json` (`version: "0.2.0"`), `src/index.ts` (`VERSION = "0.2.0"`, section order: Utilities, Primitives, Playful, Decoration; export `SoftTone`)
- Modify: `README.md`, the Storybook preview under `.storybook/` (add `@fontsource/inter-tight` as a dev dependency and import it next to the existing fontsource imports)
- Create: `src/components/playful/PlayfulOverview.stories.tsx`

**Interfaces:**
- Consumes: every export from Tasks 1–21.

- [ ] **Step 1: Failing test.** Add to `src/smoke.test.ts`:

```ts
import * as api from "./index";
it("exports 0.2.0 and no internal bases", () => {
  expect(api.VERSION).toBe("0.2.0");
  expect(Object.keys(api).some((k) => k.endsWith("Base"))).toBe(false);
  for (const name of ["TextLinkPlayful", "ChipPlayful", "CardPlayful", "StackCardPlayful", "BottomNavPlayful", "TabsPlayful", "MenuOverlayPlayful", "CarouselPlayful", "DateStripPlayful", "AudioPlayerPlayful", "Wordmark", "Pattern", "Composition"])
    expect(api).toHaveProperty(name);
});
```

- [ ] **Step 2:** Run `pnpm exec vitest run src/smoke.test.ts`. Expected: FAIL on the `VERSION`.
- [ ] **Step 3: Implement the release changes**
  - Bump the version.
  - **README:**
    - Set the Playful status to `✅ v0.2`.
    - List the new dependencies.
    - Document loading `Inter Tight` alongside Outfit and Inter.
    - Note that `bh-accent` is for fills, rules and text ≥ 24px only.
  - Add an overview story that shows every Playful component on `bg-bh-paper`.
- [ ] **Step 4: Full gate.** Run: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`. Expected: all pass; the Storybook a11y addon reports no violations on the new stories.
- [ ] **Step 5: Commit**: `chore(release): 0.2.0`
