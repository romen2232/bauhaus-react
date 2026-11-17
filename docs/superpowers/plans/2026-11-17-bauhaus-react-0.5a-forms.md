# bauhaus-react 0.5a Forms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the six form inputs (`TextField`, `TextArea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`) in Playful, Soft and Swiss (18 skins) on six internal bases. This is the first half of release `0.5`; the Modal and Toast plan (0.5b) follows.

**Architecture:** Same base + skin structure as `0.2`–`0.4`.
- Each component has one internal base in `src/components/_base/<Name>/` that wraps React Aria and takes a typed `classes` slot object.
- Each look adds a thin skin in `src/components/{playful,soft,swiss}/<Name><Look>/` that owns static class maps and its colour prop (Playful `color: FillColor`, Soft `tone: SoftTone`, Swiss none) and passes everything else to the base.
- Shared label, "(required)", description and error-message markup lives once in `src/components/_base/Field/FieldParts.tsx`.
- Colours for all 18 skins come from named class maps in one new `src/lib/fields.ts` (spec §6.8), so the later dark-mode run touches one file per look.
- **No new dependency.**

**Tech Stack:** React 19.3, TypeScript 7, Tailwind CSS 4.3, Vite 8 lib mode, Vitest 5 + jsdom + Testing Library + user-event, Storybook 10 (a11y addon, `test: "error"`), `react-aria-components` 1.22.1, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-17-bauhaus-react-forms-overlays-data-design.md` (approved; source of truth). Sections used: §3, §6.1, §6.2, §6.6, §6.7, §6.8, §6.9, §8. The earlier `docs/superpowers/specs/2026-11-16-bauhaus-react-full-catalogue-design.md` (§6.1, §6.5, §6.7) still applies. `docs/superpowers/plans/2026-11-16-bauhaus-react-0.4.md` is the structural model.

## Global Constraints

Copied from the spec; every task includes them.

- **Baseline:** release `0.4.0`. `SoftTone`, `bh-accent`, `SWISS_LABEL`, `SWISS_RAC_FOCUS` and `FOCUS_RING` exist and are reused (§3).
- **No new runtime dependency.** Forms use `react-aria-components` (1.22.1 at time of writing) (§3).
- Static class literals only: never interpolate a class name. `pnpm smoke` fails on `bh-${`. Single `"."` barrel plus `./theme.css`, `preserveModules`, `bh-` token namespace, `"use client"` on every file that uses React Aria, state or effects (§3).
- `_base` is never exported. Index exports every new skin (§6.9).
- **Every field has a visible label.** A visually hidden label is allowed only via an explicit `hideLabel` prop (§6.2).
- **Required marker:** the word "(required)" after the label in `muted-text`, not a red asterisk (§6.2).
- **Validation:** React Aria native validation plus `validate` and `errorMessage`. `validationBehavior="aria"` by default. No form-state library (§2, §6.2).
- **Sizes:** `md` only (§6.2).
- **Invalid state never uses red small text** (anti-goal; `bh-red` on `paper` is about 3.3:1). Red appears as a bar, dot or rule next to an `ink` message (§2, §6.1).
- **Invalid `Checkbox` / `RadioGroup` / `Switch`:** the control does not change. The message sits under the control or group in `ink`, with a marker before it: Playful a red square, Soft a red tone dot, Swiss a small `bh-accent` square (§6.2).
- Look table (§6.1), fields: Playful `paper-white` fill, 2px `ink` border, `rounded-none`, focus adds `shadow-bh-hard`; Soft tonal `sand` fill with a 1px `charcoal` outline (author decision A), `rounded-full` (single line) or `rounded-bh-soft` (TextArea); Swiss transparent, 1px `ink` bottom rule only. Labels: Playful display black uppercase, Soft display regular `charcoal`, Swiss `SWISS_LABEL` in `muted-text`. Checked: Playful `color` fill default `ink` + 2px border, Soft `tone` fill default `neutral`, Swiss `ink` (Switch track `ink`). Popover (Select): Playful 2px border + `shadow-bh-hard` + `paper-white`; Soft `rounded-bh-soft` + `sand`, no shadow; Swiss `paper-white` + 1px `rule`, no shadow.
- Shared by every look: `FOCUS_RING` / `SWISS_RAC_FOCUS`, disabled at 50% with `cursor-not-allowed`, every motion `motion-safe:`, yellow never a text colour, no blur (§6.1).
- **Non-text contrast (1.4.11):** any meaningful mark, border or control state must reach 3:1 against its neighbour, or be outlined in `ink`, or be labelled directly (§6.1).
- Playful look: 150ms ease-out. Soft: 150–250ms. Swiss: 150–250ms, colour-only, no kinetic decoration (§6.1).
- Strict TDD. Conventional commits, **no AI attribution, no Co-Authored-By lines.**
- **Every existing test passes unchanged.** The one sanctioned edit of an existing file is appending to `src/smoke.test.ts` and extending the `lookRules` files. `VERSION` stays `"0.4.0"`: this plan does not release (the `0.5.0` bump belongs to the 0.5b plan).

**Test commands** (the project's `test` script is `vitest run`)
- One file or folder: `pnpm exec vitest run <path>`
- Full gate: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`

## Spec deviations (found against the real code)

1. **Plain `Checkbox` and `Switch` cannot express invalid.** In `react-aria-components` 1.22.1, `Checkbox` is marked `@deprecated` ("Use CheckboxField + CheckboxButton instead"), and `SwitchProps` omits `isInvalid`, `isRequired`, `validationBehavior` and `validate`. Spec §6.2 names `Checkbox` and `Switch` as the React Aria components. **This plan builds `CheckboxBase` on `CheckboxField` + `CheckboxButton` + `Text slot="description"` + `FieldError`, and `SwitchBase` on `SwitchField` + `SwitchButton`**, which carry validation and help text. The public API (§6.2) is unchanged.
2. **Soft `muted-text` fails on `sand`:** `#6E6A64` on `#F5CF8A` is 3.63:1 (< 4.5:1). Soft placeholder text therefore uses `charcoal` (6.37:1 on `sand`), and the "(required)" marker is allowed only on the `paper` ground above the field (4.69:1). Pinned in Task 1.
3. **Soft field boundary fails 1.4.11:** `sand` against `paper` is 1.29:1 and the look has no border, so a Soft text field, unchecked checkbox, radio and Switch track have no 3:1 boundary. The spec's "labelled directly" escape clause is written for chart marks. Resolved by the author (decision A): Soft fields and unchecked controls get a 1px `charcoal` outline.
4. **Swiss radio shape:** spec §6.1 allows `rounded-full` only on a few Swiss controls. This plan draws the Swiss radio circle `rounded-full` (a square radio reads as a checkbox) and flags it `{ pill: true }` in `lookRules`. See Open question 2.
5. **`FieldError` inside `Select`** needs the base to render children as a render function so the message works both for `errorMessage` and React Aria's own `validationErrors`. Spec silent; decided in Task 1.

## Plan's calls (author to confirm while reading)

1. **State attribute for "on".** Checkbox box, Radio circle and Switch track each receive `data-checked` from the base (`isSelected || isIndeterminate`). Skins style `data-[checked]:`, never React Aria's own `data-selected`, which sits on the outer label and would need `group-` variants for two states.
2. **Focus.** Text inputs and Select triggers use a new `RAC_FOCUS` (alias of `SWISS_RAC_FOCUS`) because they hide the outline. Toggle boxes use `BOX_FOCUS` (`group-data-[focus-visible]:` form) because the focused element is the label wrapper.
3. **Non-colour cues.** Checked Checkbox shows `✓`, indeterminate `—` (both `aria-hidden`); selected Select option shows `✓`; a Radio dot and a Switch thumb position differ between states. State is never colour-only.
4. **Playful invalid bar** is a 4px red `before:` pseudo-element on a `control` wrapper around the `Input`, shown by `group-data-[invalid]:`. The input's own border stays `ink`.
5. **Controls share one `FieldClasses` shape** (`root`, `label`, `required`, `description`, `error`, `errorMarker`) so `FieldParts` serves all six bases. For text-like inputs the error has no marker in Swiss (§6.1: rule turns accent, message in `ink`); `errorMarker` is `""` there.
6. **`onChange`/`onSelectionChange` signatures** follow existing bases: strings in, strings out (`onChange(value: string)`, `onSelectionChange(key: string | null)`).
7. **`SelectItem` and option types are not exported** from the barrel (same as `TabItem`); consumers infer them from props.
8. **`name` participates in native `FormData`** for every field (contact forms are the portfolio use case); tested.

## Open questions (author to answer; the plan implements the safe default)

1. **Soft control boundaries. RESOLVED (A):** 1px `border-bh-charcoal` on Soft text fields, TextArea, Select trigger, unchecked checkbox/radio and Switch track. Popovers and panels stay borderless. Original note: the default followed the spec literally (sand fill, no outline). It is one string per control in `src/lib/fields.ts` (`SOFT_OFF`), so a decision such as "unchecked boxes get a 2px inset `charcoal` ring" is a one-line change. Which do you want?
2. **Swiss radio `rounded-full`:** keep the circle (plan default) or square radio?

## Review Focus

Spec-implied conditions no spec test names. Each line is pinned by a test in the task shown.

1. **Stale `errorMessage` on a valid field** must not render (a consumer passes a static message while `isInvalid` flips). Task 2 (`FieldParts`/`TextFieldBase`), reused by the other bases.
2. **Native form submit.** A field with `name` inside `<form>` contributes to `FormData` (Select via its hidden select, Checkbox/Radio/Switch via their inputs). Tasks 2, 4, 5, 6, 7.
3. **Empty collections.** `Select items={[]}` and `RadioGroup options={[]}` render and open without throwing. Tasks 6 and 7.
4. **Stale controlled key.** `Select selectedKey` that matches no item shows the placeholder and does not throw. Task 7.
5. **Two fields with the same label** on one page each stay labelled by their own label (no id collision). Task 2.

## File map

```txt
src/lib/styles.ts, styles.test.ts                       M  RAC_FOCUS, BOX_FOCUS (Task 1)
src/lib/fields.ts, fields.test.ts                       C  FIELD_CLASSES (T1), then one map per task (T4–T7)
src/lib/palette.test.ts                                 M  form contrast pairs (Task 1)
src/components/_base/Field/FieldParts.tsx (+ test)      C  Task 1
src/components/_base/{TextField,TextArea,Checkbox,Switch,RadioGroup,Select}/<Name>Base.tsx (+ test)   C
src/components/{playful,soft,swiss}/<Name><Look>/{.tsx,.test.tsx,.stories.tsx,index.ts}                C  18 skins
src/components/playful/lookRules.test.tsx               C  Task 2 (extended by T3–T8)
src/components/soft/lookRules.test.tsx                  M  extended by T2–T8
src/components/swiss/lookRules.test.tsx                 M  extended by T2–T8
src/components/{playful,soft,swiss}/focusRing.test.tsx  M  Playful/Soft/Swiss form cases (T2, T4, T7)
src/components/{playful/PlayfulOverview,soft/SoftOverview,swiss/SwissOverview}.stories.tsx   M  Task 9
src/index.ts, src/smoke.test.ts, README.md              M  each task / Task 9
```

No `_base` file for an existing component, no `theme.css`, no `package.json` change.

## PR slices (chained; ≤ 400 changed lines each, estimates include tests and stories)

| PR | Task | Content | Est. lines |
|---|---|---|---|
| 1 | 1 | Foundation: `fields.ts`, focus strings, `FieldParts`, contrast tests | ~320 |
| 2 | 2 | TextField base + 3 skins | ~390 |
| 3 | 3 | TextArea base + 3 skins | ~300 |
| 4 | 4 | Checkbox base + 3 skins | ~400 |
| 5 | 5 | Switch base + 3 skins | ~330 |
| 6 | 6 | RadioGroup base + 3 skins | ~400 |
| 7 | 7 | Select base + Playful skin | ~340 |
| 8 | 8 | Select Soft + Swiss skins | ~230 |
| 9 | 9 | Overview stories, README, full gate | ~220 |

Each PR leaves the repo green and shippable (the barrel only gains finished components). Strategy (`stacked-to-main` or `feature-branch-chain`) follows the session's cached choice; each task ends with a "PR boundary" line. If a slice measures over 400 on `git diff --stat`, split it at the base/skin line.

---

### Task 1: Class maps, focus strings, `FieldParts` and contrast tests (PR 1)

**Files:**
- Create: `src/lib/fields.ts`, `src/lib/fields.test.ts`, `src/components/_base/Field/FieldParts.tsx`, `src/components/_base/Field/FieldParts.test.tsx`
- Modify: `src/lib/styles.ts`, `src/lib/styles.test.ts`, `src/lib/palette.test.ts`

**Interfaces:**
- Consumes: `FILL_CLASSES`, `TEXT_ON`, `SOFT_TONE_CLASSES`, `HEX`, `SOFT_HEX`, `SWISS_HEX`, `contrast` (already in `palette.test.ts`), `SWISS_RAC_FOCUS`, `SWISS_LABEL`, `SWISS_MOTION`, `SOFT` helpers.
- Produces:
  - `styles.ts`: `RAC_FOCUS = SWISS_RAC_FOCUS` (documented: ink outline for every look's React Aria inputs) and `BOX_FOCUS = "group-data-[focus-visible]:outline-solid group-data-[focus-visible]:outline-2 group-data-[focus-visible]:outline-offset-2 group-data-[focus-visible]:outline-bh-ink"`. Not exported from `index.ts`.
  - `fields.ts` (not exported from `index.ts`):
    - `type FieldClassSet = { root: string; label: string; required: string; description: string; error: string; errorMarker: string }`
    - `type FormLook = "playful" | "soft" | "swiss"`
    - `FIELD_CLASSES: Record<FormLook, FieldClassSet & { control: string; input: string; textarea: string }>`
    - Later tasks append `CHECKBOX_CLASSES`, `SWITCH_CLASSES`, `RADIO_CLASSES`, `SELECT_CLASSES` (each `Record<FormLook, …>`), `PLAYFUL_CHECKED: Record<FillColor, string>`, `SOFT_CHECKED: Record<SoftTone, string>`, and `SOFT_OFF` (Open question 1).
  - Class decisions for `FIELD_CLASSES` (builder fills spacing within these):

    | Slot | Playful | Soft | Swiss |
    |---|---|---|---|
    | `root` | `group flex flex-col gap-2` | `group flex flex-col gap-2` | `group flex flex-col gap-2` |
    | `label` | `font-bh-display text-sm font-black uppercase tracking-wide text-bh-ink` | `font-bh-display text-sm font-normal text-bh-charcoal` | `SWISS_LABEL text-bh-muted-text` |
    | `required` | `ml-1 font-bh-body text-xs font-normal normal-case tracking-normal text-bh-muted-text` | same, `font-bh-body` | `ml-1 normal-case tracking-normal` (inherits `muted-text`) |
    | `description` | `font-bh-body text-sm text-bh-muted-text` | same | `font-bh-grotesk text-sm text-bh-muted-text` |
    | `control` | `relative before:absolute before:inset-y-0 before:left-0 before:hidden before:w-1 before:bg-bh-red group-data-[invalid]:before:block` | `""` | `""` |
    | `input` | `h-11 w-full rounded-none border-2 border-bh-ink bg-bh-paper-white px-4 font-bh-body text-base text-bh-ink placeholder:text-bh-muted-text data-[focused]:shadow-bh-hard data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50` + `RAC_FOCUS` | `h-11 w-full rounded-full border border-bh-charcoal bg-bh-sand px-5 font-bh-body text-base text-bh-ink placeholder:text-bh-charcoal data-[disabled]:…` + `RAC_FOCUS` | `h-11 w-full rounded-none border-0 border-b border-bh-ink bg-transparent px-0 font-bh-grotesk text-base font-normal text-bh-ink placeholder:text-bh-muted-text data-[invalid]:border-bh-accent data-[disabled]:…` + `SWISS_MOTION` + `RAC_FOCUS` |
    | `textarea` | `input` with `h-auto min-h-24 py-3` | `input` with `rounded-bh-soft h-auto min-h-24 py-3` | `input` with `h-auto min-h-24 py-3` |
    | `error` | `flex items-start gap-2 font-bh-body text-sm text-bh-ink` | same | `font-bh-grotesk text-sm text-bh-ink` |
    | `errorMarker` | `mt-1 size-3 shrink-0 bg-bh-red` | `mt-1.5 size-2 shrink-0 rounded-full bg-bh-red` | `""` |
  - `FieldParts.tsx` (`"use client"`):
    - `type FieldCommonProps = { label: ReactNode; hideLabel?: boolean; description?: ReactNode; errorMessage?: ReactNode | ((v: ValidationResult) => ReactNode) }` (`ValidationResult` from `react-aria-components`).
    - `FieldLabel({ classes, hideLabel, isRequired, children }: { classes: Pick<FieldClassSet, "label" | "required">; hideLabel?: boolean; isRequired?: boolean; children: ReactNode })` renders React Aria `Label`; `hideLabel` adds `sr-only`; `isRequired` appends ` <span className={classes.required}>(required)</span>`.
    - `FieldDescription({ classes, children })` renders `<Text slot="description" className={classes.description}>` and nothing when `children` is empty.
    - `FieldMessage({ classes, errorMessage })` renders `<FieldError className={classes.error}>` whose children are a render function: `<span aria-hidden className={classes.errorMarker} />` (omitted when `classes.errorMarker === ""`) followed by `errorMessage` (called when it is a function) or, when absent, `v.validationErrors.join(" ")`.

- [ ] **Step 1: Write the failing tests**

```ts
// styles.test.ts (append)
it("RAC_FOCUS reuses the Swiss ink outline and BOX_FOCUS is its group form", () => {
  expect(RAC_FOCUS).toBe(SWISS_RAC_FOCUS);
  expect(BOX_FOCUS).toContain("group-data-[focus-visible]:outline-solid");
});

// fields.test.ts
it.each(["playful", "soft", "swiss"] as const)("%s fields define every slot", (look) => {
  for (const slot of ["root","label","required","description","control","input","textarea","error","errorMarker"] as const)
    expect(slot in FIELD_CLASSES[look]).toBe(true);
});
it("never styles an error message in red text", () => {
  for (const look of ["playful","soft","swiss"] as const) expect(FIELD_CLASSES[look].error).not.toMatch(/text-bh-(red|accent)/);
});
it("Playful and Soft markers are red, Swiss text fields have no marker", () => {
  expect(FIELD_CLASSES.playful.errorMarker).toContain("bg-bh-red");
  expect(FIELD_CLASSES.soft.errorMarker).toContain("bg-bh-red");
  expect(FIELD_CLASSES.swiss.errorMarker).toBe("");
});
it("Swiss invalid turns the rule to the accent, Playful keeps the ink border", () => {
  expect(FIELD_CLASSES.swiss.input).toContain("data-[invalid]:border-bh-accent");
  expect(FIELD_CLASSES.playful.input).not.toMatch(/data-\[invalid\]:border/);
});
```

```ts
// palette.test.ts (append; `contrast`, HEX, SOFT_HEX, SWISS_HEX already in scope)
it.each([
  ["Playful input text: ink on paper-white", HEX.ink, "#FFFFFF", 4.5],
  ["Playful placeholder: muted-text on paper-white", SWISS_HEX.mutedText, "#FFFFFF", 4.5],
  ["Playful '(required)': muted-text on paper", SWISS_HEX.mutedText, HEX.paper, 4.5],
  ["Soft input text: ink on sand", HEX.ink, SOFT_HEX.sand, 4.5],
  ["Soft placeholder: charcoal on sand", SOFT_HEX.neutral, SOFT_HEX.sand, 4.5],
  ["Soft label: charcoal on paper", SOFT_HEX.neutral, HEX.paper, 4.5],
  ["Soft '(required)': muted-text on paper", SWISS_HEX.mutedText, HEX.paper, 4.5],
  ["Swiss label/placeholder: muted-text on white", SWISS_HEX.mutedText, SWISS_HEX.white, 4.5],
  ["Swiss ink rule on white (1.4.11)", SWISS_HEX.ink, SWISS_HEX.white, 3],
  ["Swiss accent invalid rule on white (1.4.11)", SWISS_HEX.accent, SWISS_HEX.white, 3],
  ["Playful red bar on paper-white (1.4.11)", HEX.red, "#FFFFFF", 3],
  ["Soft red dot on paper (1.4.11)", HEX.red, HEX.paper, 3],
  ["Soft Switch thumb: charcoal on sand (1.4.11)", SOFT_HEX.neutral, SOFT_HEX.sand, 3],
])("form pair %s meets %f:1", (_n, a, b, min) => {
  expect(contrast(a, b)).toBeGreaterThanOrEqual(min);
});
it("documents the Soft limits: muted-text never on sand, sand has no 3:1 edge on paper", () => {
  expect(contrast(SWISS_HEX.mutedText, SOFT_HEX.sand)).toBeLessThan(4.5);
  expect(contrast(SOFT_HEX.sand, HEX.paper)).toBeLessThan(3);
  expect(contrast(HEX.red, SOFT_HEX.sand)).toBeLessThan(3); // markers sit on paper, never on sand
});
```

```tsx
// FieldParts.test.tsx — wraps parts in React Aria's TextField so contexts exist
const c = { label: "L", required: "R", description: "D", error: "E", errorMarker: "M" };
it("FieldLabel appends '(required)' only when required and hides visually on hideLabel", () => { /* getByText("(required)") present/absent; label has class sr-only with hideLabel; input still named by it */ });
it("FieldDescription renders nothing when empty", () => { /* no element with class D */ });
it("FieldMessage shows nothing while valid, the message while invalid, and falls back to validationErrors", () => { /* isInvalid false → queryByText null; true → text; validate returning "Needs @" with no errorMessage → "Needs @" */ });
it("FieldMessage marker is aria-hidden and omitted for an empty marker class", () => { /* span.M aria-hidden; with errorMarker "" no span */ });
```

- [ ] **Step 2: Run, confirm FAIL**

Run: `pnpm exec vitest run src/lib src/components/_base/Field`
Expected: FAIL, modules and exports not found.

- [ ] **Step 3: Implement** the two strings in `styles.ts`, `fields.ts` (`FIELD_CLASSES` per the table, literal strings only), and `FieldParts.tsx` with the signatures above. React Aria `Label`, `Text`, `FieldError` read their context from the parent field, so `FieldParts` must be rendered inside a field component.
- [ ] **Step 4: Run, confirm PASS**: same command. Then `pnpm typecheck`.
- [ ] **Step 5: Commit**: `feat(forms): add shared field class maps, focus strings and field parts`

**PR boundary: PR 1 ends here.**

---

### Task 2: `TextFieldBase` + `TextFieldPlayful`, `TextFieldSoft`, `TextFieldSwiss` (PR 2)

**Files:**
- Create: `src/components/_base/TextField/{TextFieldBase.tsx,TextFieldBase.test.tsx}`, `src/components/{playful,soft,swiss}/TextField<Look>/{TextField<Look>.tsx,.test.tsx,.stories.tsx,index.ts}`, `src/components/playful/lookRules.test.tsx`
- Modify: `src/components/soft/lookRules.test.tsx`, `src/components/swiss/lookRules.test.tsx`, `src/components/{playful,soft,swiss}/focusRing.test.tsx`, `src/index.ts`, `src/smoke.test.ts`

**Interfaces:**
- Consumes: `FieldParts` (`FieldCommonProps`, `FieldLabel`, `FieldDescription`, `FieldMessage`), `FIELD_CLASSES`, `cn`.
- Produces:
  - `type TextFieldBaseClasses = FieldClassSet & { control: string; input: string }`.
  - `type TextFieldBaseProps = FieldCommonProps & { type?: "text"|"email"|"password"|"search"|"url"|"tel"; name?: string; value?: string; defaultValue?: string; onChange?: (value: string) => void; placeholder?: string; autoComplete?: string; isRequired?: boolean; isInvalid?: boolean; isDisabled?: boolean; isReadOnly?: boolean; validate?: (value: string) => string | string[] | true | null | undefined; validationBehavior?: "aria" | "native"; className?: string; ref?: Ref<HTMLDivElement>; classes: TextFieldBaseClasses }`.
  - `TextFieldBase`: React Aria `TextField` (root, gets `className` merged last and the `ref`) containing `FieldLabel`, `<div className={classes.control}><Input/></div>`, `FieldDescription`, `FieldMessage`. `validationBehavior` defaults to `"aria"`; `type` defaults to `"text"`.
  - Skins: `TextField<Look>Props = Omit<TextFieldBaseProps, "classes">`; each is `<TextFieldBase {...props} classes={FIELD_CLASSES.<look>} />`, `"use client"`.
  - Smoke list: `src/smoke.test.ts` gains `it.each(["TextField"])("exports %s in every look", …)` checking `${name}Playful|Soft|Swiss` are functions. Later tasks append their name to the array.

- [ ] **Step 1: Write the failing tests**

```tsx
// TextFieldBase.test.tsx  (classes stub: all "", root "r")
it("names the input by its label and links description and error", () => {
  render(<TextFieldBase classes={t} label="Email" description="We never share it" isInvalid errorMessage="Enter a valid email" />);
  const input = screen.getByRole("textbox", { name: /Email/ });
  expect(input).toBeInvalid();
  const described = input.getAttribute("aria-describedby")!.split(" ").map((id) => document.getElementById(id)?.textContent);
  expect(described).toEqual(expect.arrayContaining(["We never share it", expect.stringContaining("Enter a valid email")]));
});
it("marks a required field with the word (required), not an asterisk", () => {
  render(<TextFieldBase classes={t} label="Name" isRequired />);
  expect(screen.getByText("(required)")).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: /Name/ })).toBeRequired();
  expect(screen.queryByText("*")).toBeNull();
});
it("does not render a stale errorMessage while the field is valid", () => {            // Review Focus 1
  render(<TextFieldBase classes={t} label="Name" errorMessage="Required" />);
  expect(screen.queryByText("Required")).toBeNull();
});
it("hideLabel keeps the label as the accessible name but visually hidden", () => {
  render(<TextFieldBase classes={t} label="Search" hideLabel />);
  expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
  expect(screen.getByText("Search")).toHaveClass("sr-only");
});
it("is controlled: reports the typed value and keeps the given one", async () => {
  const onChange = vi.fn();
  render(<TextFieldBase classes={t} label="Name" value="x" onChange={onChange} />);
  await userEvent.type(screen.getByRole("textbox"), "a");
  expect(onChange).toHaveBeenLastCalledWith("xa");
  expect(screen.getByRole("textbox")).toHaveValue("x");
});
it("is uncontrolled with defaultValue", async () => { /* type "yz" → value "…yz" */ });
it.each(["email", "password", "search", "url", "tel"] as const)("renders type %s", (type) => { /* input[type=…]; password has no textbox role → query container */ });
it("supports disabled and read-only", () => { /* toBeDisabled(); toHaveAttribute("readonly") */ });
it("validates live by default (aria behaviour) with a validate function", async () => {
  render(<TextFieldBase classes={t} label="Email" validate={(v) => (v.includes("@") ? true : "Needs @")} />);
  await userEvent.type(screen.getByRole("textbox"), "abc");
  expect(screen.getByText("Needs @")).toBeInTheDocument();
});
it("two fields with the same label stay labelled by their own label", () => {          // Review Focus 5
  render(<><TextFieldBase classes={t} label="Name" defaultValue="a" /><TextFieldBase classes={t} label="Name" defaultValue="b" /></>);
  const [a, b] = screen.getAllByRole("textbox", { name: "Name" });
  expect(a).toHaveValue("a"); expect(b).toHaveValue("b");
  expect(a.getAttribute("aria-labelledby")).not.toBe(b.getAttribute("aria-labelledby"));
});
it("posts its value in a form under name", () => {                                    // Review Focus 2
  const { container } = render(<form><TextFieldBase classes={t} label="Email" name="email" defaultValue="a@b.c" /></form>);
  expect(new FormData(container.querySelector("form")!).get("email")).toBe("a@b.c");
});
it("sets data-focus-visible on keyboard focus", async () => { await userEvent.tab(); expect(screen.getByRole("textbox")).toHaveAttribute("data-focus-visible"); });
it("merges className onto the root and forwards ref to it", () => { /* root = input.closest("[class~=r]") or parentElement.parentElement; createRef<HTMLDivElement> */ });
```

```tsx
// TextField<Look>.test.tsx — one file per look, same five tests; names below use Playful
it("is a named, required textbox", () => { /* getByRole("textbox", { name: /Email/ }) toBeRequired */ });
it("shows an invalid message in non-red text with a marker", () => {
  render(<TextFieldPlayful label="Email" isInvalid errorMessage="Enter a valid email" />);
  const msg = screen.getByText("Enter a valid email");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  // Playful, Soft: the marker (aria-hidden sibling) has bg-bh-red; Swiss: no marker, input has data-[invalid]:border-bh-accent
});
it("has the look's field surface", () => {
  // Playful: input has "border-2", "border-bh-ink", "rounded-none", "bg-bh-paper-white"
  // Soft: "rounded-full", "bg-bh-sand", "border border-bh-charcoal" (author decision: 1px charcoal boundary for 1.4.11)
  // Swiss: "border-b", "border-bh-ink", "bg-transparent", and no "border-2" / "rounded-"
});
it("merges className onto the root", () => { /* root has "mt-4" */ });
it("forwards ref to the root element", () => { /* createRef<HTMLDivElement> */ });
```

Look rules and focus (extend, do not rewrite):
- `playful/lookRules.test.tsx` (new, same shape as the Swiss file): cases array, `FORBIDDEN = /^(border(-[xytrbl])?|border(-[xytrbl])?-(1|8)|rounded-bh-soft|font-bh-grotesk|text-bh-yellow|backdrop-blur.*)$/` after stripping variants with `token.split(":").pop()`; add `TextFieldPlayful` valid, invalid, disabled.
- `soft/lookRules.test.tsx`: add `TextFieldSoft` (valid and invalid) to `cases`; the existing `FORBIDDEN` already rejects borders, hard shadows, translate, yellow text.
- `swiss/lookRules.test.tsx`: add `TextFieldSwiss` (valid, invalid); accent-count assertion must pass (only the rule carries `bh-accent`, and only in the `data-[invalid]:` variant).
- `{playful,soft,swiss}/focusRing.test.tsx`: add `"TextField<Look> keeps a visible focus ring"`: `killsFocusRing(screen.getByRole("textbox"))` is `false` (helper already defined in each file; Playful's file is the model).

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/_base/TextField src/components/playful/TextFieldPlayful src/components/soft/TextFieldSoft src/components/swiss/TextFieldSwiss`. Expected: FAIL, modules not found.
- [ ] **Step 3: Implement** `TextFieldBase` and the three skins per Interfaces; stories `Playful/TextFieldPlayful`, `Soft/TextFieldSoft`, `Swiss/TextFieldSwiss` (copy each look's `Tabs*.stories.tsx` meta, including `backgrounds`): `Default`, `WithDescription`, `Required`, `Invalid`, `Disabled`, `ReadOnly`, `Password`. Append the three exports to each look's section in `src/index.ts` and the smoke list.
- [ ] **Step 4: Run, confirm PASS**: the command above plus `pnpm exec vitest run src/components/playful src/components/soft src/components/swiss src/smoke.test.ts`.
- [ ] **Step 5: Commit**: `feat(forms): add TextField base and Playful, Soft and Swiss skins`

**PR boundary: PR 2 ends here.**

---

### Task 3: `TextAreaBase` + three skins (PR 3)

**Files:**
- Create: `src/components/_base/TextArea/{TextAreaBase.tsx,TextAreaBase.test.tsx}`, `src/components/{playful,soft,swiss}/TextArea<Look>/*`
- Modify: the three `lookRules` files, three `focusRing` files, `src/index.ts`, `src/smoke.test.ts`

**Interfaces:**
- Consumes: Task 1 and Task 2 pieces (`FieldParts`, `FIELD_CLASSES`).
- Produces:
  - `type TextAreaBaseClasses = FieldClassSet & { control: string; textarea: string }`; `TextAreaBaseProps` = `TextFieldBaseProps` minus `type`, plus `rows?: number` (default `3`), with `classes: TextAreaBaseClasses`. Same wrapper as `TextFieldBase`, with React Aria `TextArea` instead of `Input`.
  - Skins: `TextArea<Look>Props = Omit<TextAreaBaseProps, "classes">`; classes from `FIELD_CLASSES.<look>` (`input` slot replaced by `textarea`).

- [ ] **Step 1: Write the failing tests**
  - Base (stub classes): the same list as `TextFieldBase` (label/description/error association, required, stale error not shown, controlled, uncontrolled, disabled/read-only, `name` in `FormData`, `className`/`ref`), run against `getByRole("textbox", { name: /Notes/ })` whose tag is `TEXTAREA`; plus
    ```tsx
    it("sets the number of rows", () => { render(<TextAreaBase classes={t} label="Notes" rows={6} />); expect(screen.getByRole("textbox")).toHaveAttribute("rows", "6"); });
    it("defaults to 3 rows", () => { /* rows="3" */ });
    ```
  - Skins (per look): named textbox, invalid message in non-red text, `className`, `ref`, plus the look surface: Soft textarea has `rounded-bh-soft` and not `rounded-full`; Playful has `border-2` + `rounded-none`; Swiss has `border-b` + no `rounded-`.
  - `lookRules` and `focusRing`: one case per skin (valid and invalid).
- [ ] **Step 2: Run, confirm FAIL** (`pnpm exec vitest run src/components/_base/TextArea src/components/playful/TextAreaPlayful src/components/soft/TextAreaSoft src/components/swiss/TextAreaSwiss`).
- [ ] **Step 3: Implement** base and skins; stories `Default`, `WithDescription`, `Invalid`, `Disabled`, `Tall` (`rows={8}`); exports; smoke list gains `"TextArea"`.
- [ ] **Step 4: Run, confirm PASS** (the command above plus the `lookRules`/`focusRing` files and `src/smoke.test.ts`).
- [ ] **Step 5: Commit**: `feat(forms): add TextArea base and Playful, Soft and Swiss skins`

**PR boundary: PR 3 ends here.**

---

### Task 4: `CheckboxBase` + three skins (PR 4)

**Files:**
- Create: `src/components/_base/Checkbox/{CheckboxBase.tsx,CheckboxBase.test.tsx}`, `src/components/{playful,soft,swiss}/Checkbox<Look>/*`
- Modify: `src/lib/fields.ts`, `src/lib/fields.test.ts`, the three `lookRules`, three `focusRing`, `src/index.ts`, `src/smoke.test.ts`

**Interfaces:**
- Consumes: `FieldParts` (`FieldLabel`, `FieldDescription`, `FieldMessage`), `BOX_FOCUS`, `FILL_CLASSES`, `SOFT_TONE_CLASSES`, `cn`.
- Produces:
  - `fields.ts` additions:
    - `CHECKBOX_CLASSES: Record<FormLook, FieldClassSet & { button: string; box: string; indicator: string }>`. `button`: `group flex items-center gap-3` + pointer/disabled rules; `box`: the 24px square (Playful `rounded-none border-2 border-bh-ink bg-bh-paper-white`, Soft `rounded-md` + `SOFT_OFF.checkbox`, Swiss `rounded-none border border-bh-ink bg-transparent`) + `BOX_FOCUS`; `indicator`: glyph size and colour.
    - `PLAYFUL_CHECKED: Record<FillColor, string>` where each value is `FILL_CLASSES[c]` with every token prefixed `data-[checked]:` (literal strings written out, not computed).
    - `SOFT_CHECKED: Record<SoftTone, string>`, same from `SOFT_TONE_CLASSES`.
    - `SOFT_OFF: { checkbox: string; radio: string; track: string; thumb: string }` (Open question 1); values `border border-bh-charcoal bg-bh-sand` for box, circle and track and `bg-bh-charcoal` for the thumb (author decision A: 1px charcoal outline, charcoal on paper passes 3:1).
    - Swiss checked: `data-[checked]:bg-bh-ink data-[checked]:text-bh-paper-white` (in `CHECKBOX_CLASSES.swiss.box`).
  - `type CheckboxBaseClasses = FieldClassSet & { button: string; box: string; indicator: string }`.
  - `type CheckboxBaseProps = FieldCommonProps & { isSelected?: boolean; defaultSelected?: boolean; onChange?: (isSelected: boolean) => void; isIndeterminate?: boolean; name?: string; value?: string; isRequired?: boolean; isInvalid?: boolean; isDisabled?: boolean; isReadOnly?: boolean; validate?: (isSelected: boolean) => string | string[] | true | null | undefined; validationBehavior?: "aria" | "native"; className?: string; ref?: Ref<HTMLDivElement>; classes: CheckboxBaseClasses }`.
  - `CheckboxBase` composition: `CheckboxField` (root; `className` merged, `ref`) > `CheckboxButton` (className `classes.button`) > `[<span aria-hidden data-checked={(isSelected||isIndeterminate)||undefined} className={classes.box}><span className={classes.indicator}>{isIndeterminate ? "—" : isSelected ? "✓" : null}</span></span>, <FieldLabel/>]`, then `FieldDescription` and `FieldMessage` as siblings. `hideLabel` is honoured by `FieldLabel`. If React Aria's `CheckboxField` wires the label differently from this sketch, the base tests below are the contract: change the composition, not the tests.
  - Skins: `CheckboxPlayfulProps = Omit<CheckboxBaseProps, "classes"> & { color?: FillColor }` (default `"ink"`); `CheckboxSoftProps = … & { tone?: SoftTone }` (default `"neutral"`); `CheckboxSwissProps = Omit<CheckboxBaseProps, "classes">`. Skin composes `cn(CHECKBOX_CLASSES.<look>.box, PLAYFUL_CHECKED[color])`.

- [ ] **Step 1: Write the failing tests**

```tsx
// fields.test.ts (append)
it.each(Object.keys(FILL_CLASSES) as FillColor[])("PLAYFUL_CHECKED.%s mirrors FILL_CLASSES with a data-[checked] prefix", (c) => {
  expect(PLAYFUL_CHECKED[c]).toBe(FILL_CLASSES[c].split(" ").map((t) => `data-[checked]:${t}`).join(" "));
});
it.each(Object.keys(SOFT_TONE_CLASSES) as SoftTone[])("SOFT_CHECKED.%s mirrors SOFT_TONE_CLASSES", (t) => { /* same derivation */ });
```

```tsx
// CheckboxBase.test.tsx  (classes stub; all "" except box "b")
it("is a named checkbox with a visible (required) marker", () => { /* getByRole("checkbox", { name: /Subscribe/ }) toBeRequired; "(required)" text */ });
it("toggles with Space and reports isSelected", async () => {
  const onChange = vi.fn();
  render(<CheckboxBase classes={t} label="Subscribe" onChange={onChange} />);
  await userEvent.tab(); await userEvent.keyboard(" ");
  expect(onChange).toHaveBeenLastCalledWith(true);
  expect(screen.getByRole("checkbox")).toBeChecked();
});
it("is controlled by isSelected", async () => { /* click keeps checked=false, onChange(true) */ });
it("marks the box data-checked and shows ✓ when selected, — when indeterminate", () => {
  const { rerender, container } = render(<CheckboxBase classes={t} label="All" defaultSelected />);
  expect(container.querySelector(".b")).toHaveAttribute("data-checked");
  expect(container.querySelector(".b")).toHaveTextContent("✓");
  rerender(<CheckboxBase classes={t} label="All" isIndeterminate />);
  expect(container.querySelector(".b")).toHaveTextContent("—");
  expect(screen.getByRole("checkbox")).toBePartiallyChecked();
});
it("the box and its glyph are hidden from assistive tech", () => { /* box aria-hidden="true" */ });
it("shows an error under the control only when invalid, linked to the input", () => {
  /* isInvalid errorMessage="Accept to continue": text present, aria-describedby contains its id, checkbox toBeInvalid();
     same props without isInvalid: text absent  (Review Focus 1) */
});
it("disabled blocks toggling", async () => { /* click does nothing; toBeDisabled */ });
it("posts name and value in a form only when checked", () => {                         // Review Focus 2
  /* <form> with name="news" value="yes": unchecked → FormData.get null; defaultSelected → "yes" */
});
it("shows keyboard focus on the label wrapper", async () => { await userEvent.tab(); expect(screen.getByRole("checkbox").closest("label")).toHaveAttribute("data-focus-visible"); });
it("merges className onto the root and forwards ref", () => { /* … */ });
```

Skins (per look): named checkbox; default colour (Playful `color` default `ink`, Soft `tone` default `neutral`): box class list contains `data-[checked]:bg-bh-ink` / `data-[checked]:bg-bh-charcoal`; `color="red"` → `data-[checked]:bg-bh-red`; `tone="blue"` → `data-[checked]:bg-bh-blue`; invalid message in non-red text with the marker (Playful red square `bg-bh-red`, Soft red dot `bg-bh-red rounded-full`, Swiss `bg-bh-accent` square); box does not change when invalid (same class string as the valid render); Swiss box has `border-bh-ink` and no `rounded-`; `className`; `ref`.
- `lookRules`: cases for each skin (valid, `isInvalid`, and `defaultSelected`; Playful with `color="yellow"` to prove yellow is only a fill). Swiss: invalid case has exactly one `bh-accent` token (the marker). `focusRing`: the box's `BOX_FOCUS` token is present and the wrapper does not `killsFocusRing`.

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/lib/fields.test.ts src/components/_base/Checkbox src/components/playful/CheckboxPlayful src/components/soft/CheckboxSoft src/components/swiss/CheckboxSwiss`.
- [ ] **Step 3: Implement** the `fields.ts` additions, base and skins; stories `Default`, `WithDescription`, `Required`, `Indeterminate`, `Invalid`, `Disabled`, plus `Colors` (Playful, one per `FillColor`) and `Tones` (Soft). Exports; smoke list gains `"Checkbox"`.
- [ ] **Step 4: Run, confirm PASS** (above plus `lookRules`/`focusRing`/smoke).
- [ ] **Step 5: Commit**: `feat(forms): add Checkbox base and Playful, Soft and Swiss skins`

**PR boundary: PR 4 ends here.**

---

### Task 5: `SwitchBase` + three skins (PR 5)

**Files:**
- Create: `src/components/_base/Switch/{SwitchBase.tsx,SwitchBase.test.tsx}`, `src/components/{playful,soft,swiss}/Switch<Look>/*`
- Modify: `src/lib/fields.ts`, `src/lib/fields.test.ts`, the three `lookRules`, three `focusRing`, `src/index.ts`, `src/smoke.test.ts`

**Interfaces:**
- Consumes: Task 4 maps (`PLAYFUL_CHECKED`, `SOFT_CHECKED`, `SOFT_OFF`), `BOX_FOCUS`, `FieldParts`.
- Produces:
  - `SWITCH_CLASSES: Record<FormLook, FieldClassSet & { button: string; track: string; thumb: string }>`. Playful: track `h-7 w-12 rounded-full border-2 border-bh-ink bg-bh-paper-white` with fill from `PLAYFUL_CHECKED`, thumb `size-4 rounded-full bg-bh-ink border-2`. Soft: track `h-7 w-12 rounded-full` + `SOFT_OFF.track` + `SOFT_CHECKED`, thumb `SOFT_OFF.thumb`. Swiss: track `h-6 w-11 rounded-none border border-bh-ink bg-transparent data-[checked]:bg-bh-ink`, thumb square `size-4 bg-bh-ink data-[checked]:bg-bh-paper-white` (square, no radius). Thumb moves with `data-[checked]:translate-x-*` in Playful and Soft only; **Swiss uses `data-[checked]:ml-auto` (no translate, look rule)** by making the track `flex items-center`.
  - `type SwitchBaseClasses = FieldClassSet & { button: string; track: string; thumb: string }`.
  - `type SwitchBaseProps = FieldCommonProps & { isSelected?: boolean; defaultSelected?: boolean; onChange?: (isSelected: boolean) => void; name?: string; value?: string; isRequired?: boolean; isInvalid?: boolean; isDisabled?: boolean; isReadOnly?: boolean; validate?: (isSelected: boolean) => string | string[] | true | null | undefined; validationBehavior?: "aria" | "native"; className?: string; ref?: Ref<HTMLDivElement>; classes: SwitchBaseClasses }`.
  - `SwitchBase`: `SwitchField` (root) > `SwitchButton` (`classes.button`) > `[<span aria-hidden data-checked={isSelected||undefined} className={classes.track}><span className={classes.thumb} data-checked=… /></span>, <FieldLabel/>]` + `FieldDescription` + `FieldMessage`.
  - Skins: `SwitchPlayfulProps = … & { color?: FillColor }` (default `"ink"`), `SwitchSoftProps = … & { tone?: SoftTone }` (default `"neutral"`), `SwitchSwissProps`.

- [ ] **Step 1: Write the failing tests**
  - Base: `getByRole("switch", { name: /Notifications/ })`; Space and click toggle and `onChange(true)`; controlled `isSelected`; `aria-checked`; track has `data-checked` when on and not when off; `isDisabled` blocks; invalid message below, linked by `aria-describedby`, absent when valid (Review Focus 1); `name` posts in `FormData` only when on (Review Focus 2); keyboard focus sets `data-focus-visible` on the wrapper; `className`/`ref`.
  - Non-colour cue: thumb element differs between states: `data-checked` is on the thumb only when on (`expect(thumb).toHaveAttribute("data-checked")`).
  - Skins: role/name; default colour and `color`/`tone` produce `data-[checked]:bg-bh-<c>` on the track; Soft off-track has `SOFT_OFF.track` classes and Swiss has no `rounded-` and no `translate` token; invalid message non-red with marker; `className`; `ref`.
  - `lookRules`/`focusRing`: one case per skin (off, on, invalid). Swiss: no `translate` token (existing rule).
- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/_base/Switch src/components/playful/SwitchPlayful src/components/soft/SwitchSoft src/components/swiss/SwitchSwiss`.
- [ ] **Step 3: Implement**; stories `Default`, `On`, `WithDescription`, `Invalid`, `Disabled`, `Colors`/`Tones`; exports; smoke list gains `"Switch"`.
- [ ] **Step 4: Run, confirm PASS.**
- [ ] **Step 5: Commit**: `feat(forms): add Switch base and Playful, Soft and Swiss skins`

**PR boundary: PR 5 ends here.**

---

### Task 6: `RadioGroupBase` + three skins (PR 6)

**Files:**
- Create: `src/components/_base/RadioGroup/{RadioGroupBase.tsx,RadioGroupBase.test.tsx}`, `src/components/{playful,soft,swiss}/RadioGroup<Look>/*`
- Modify: `src/lib/fields.ts`, `src/lib/fields.test.ts`, the three `lookRules`, three `focusRing`, `src/index.ts`, `src/smoke.test.ts`

**Interfaces:**
- Consumes: Task 4 maps, `BOX_FOCUS`, `FieldParts`.
- Produces:
  - `RADIO_CLASSES: Record<FormLook, FieldClassSet & { options: string; radio: string; circle: string; dot: string; optionLabel: string }>`. Circle: Playful `size-6 rounded-full border-2 border-bh-ink bg-bh-paper-white`, Soft `size-6 rounded-full` + `SOFT_OFF.radio`, Swiss `size-6 rounded-full border border-bh-ink bg-transparent` (Open question 2). Dot appears only when `data-checked` (`hidden data-[checked]:block`), filled with the look's checked colour (`PLAYFUL_CHECKED` / `SOFT_CHECKED` / Swiss `ink`). `options`: `flex flex-col gap-3`, with `group-data-[orientation=horizontal]:flex-row group-data-[orientation=horizontal]:flex-wrap`.
  - `type RadioGroupBaseClasses = FieldClassSet & { options: string; radio: string; circle: string; dot: string; optionLabel: string }`.
  - `type RadioOption = { value: string; label: ReactNode; isDisabled?: boolean }`.
  - `type RadioGroupBaseProps = FieldCommonProps & { options: RadioOption[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; orientation?: "vertical" | "horizontal"; name?: string; isRequired?: boolean; isInvalid?: boolean; isDisabled?: boolean; isReadOnly?: boolean; validate?: (value: string | null) => string | string[] | true | null | undefined; validationBehavior?: "aria" | "native"; className?: string; ref?: Ref<HTMLDivElement>; classes: RadioGroupBaseClasses }`.
  - `RadioGroupBase`: React Aria `RadioGroup` (root, `orientation` default `"vertical"`) > `FieldLabel`, `<div className={classes.options}>` of `Radio` (className `classes.radio`; children render-function: `<span aria-hidden data-checked={isSelected||undefined} className={classes.circle}><span className={classes.dot}/></span><span className={classes.optionLabel}>{label}</span>`), then `FieldDescription` and `FieldMessage`.
  - Skins: `RadioGroupPlayfulProps = … & { color?: FillColor }` (default `"ink"`), `RadioGroupSoftProps = … & { tone?: SoftTone }` (default `"neutral"`), `RadioGroupSwissProps`.

- [ ] **Step 1: Write the failing tests**
  - Base:
    ```tsx
    const options = [{ value: "a", label: "Email" }, { value: "b", label: "Phone", isDisabled: true }, { value: "c", label: "Post" }];
    it("is a named radio group whose arrow keys move selection and skip disabled options", async () => {
      const onChange = vi.fn();
      render(<RadioGroupBase classes={t} label="Contact by" options={options} onChange={onChange} />);
      expect(screen.getByRole("radiogroup", { name: /Contact by/ })).toBeInTheDocument();
      await userEvent.click(screen.getByRole("radio", { name: "Email" }));
      await userEvent.keyboard("{ArrowDown}");
      expect(onChange).toHaveBeenLastCalledWith("c");
    });
    it("is one tab stop", async () => { /* tab lands on the checked/first radio; a second tab leaves the group */ });
    it("controls selection through value", async () => { /* value="a": clicking Post calls onChange("c") but Email stays checked */ });
    it("exposes orientation", () => { /* horizontal → radiogroup has data-orientation="horizontal"; default vertical */ });
    it("marks the circle data-checked only on the selected option", () => { /* … */ });
    it("shows an error below the group only when invalid, linked to the group", () => { /* Review Focus 1 */ });
    it("marks the group required with (required)", () => { /* aria-required, text */ });
    it("renders an empty options array without throwing", () => { /* radiogroup present, zero radios */ });   // Review Focus 3
    it("posts the chosen value under name", () => { /* FormData.get("via") === "c" */ });             // Review Focus 2
    it("disabled group blocks selection", async () => { /* … */ });
    it("shows keyboard focus on the focused radio", async () => { /* data-focus-visible on label */ });
    it("merges className and forwards ref", () => { /* … */ });
    ```
  - Skins: role/name; default colour dot class (`data-[checked]:bg-bh-ink` or `…bg-bh-charcoal`), `color="blue"` / `tone="red"` change it; invalid: message non-red + marker, circles unchanged; Playful/Soft circle has `rounded-full`; Swiss circle has `rounded-full` and `border-bh-ink`; `className`; `ref`.
  - `lookRules`: all skins (selected, invalid). Swiss circle case flagged `{ pill: true }`. `focusRing`: radios keep `BOX_FOCUS`.
- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/_base/RadioGroup src/components/playful/RadioGroupPlayful src/components/soft/RadioGroupSoft src/components/swiss/RadioGroupSwiss`.
- [ ] **Step 3: Implement**; stories `Default`, `Horizontal`, `WithDescription`, `Invalid`, `DisabledOption`, `Colors`/`Tones`; exports; smoke list gains `"RadioGroup"`.
- [ ] **Step 4: Run, confirm PASS.**
- [ ] **Step 5: Commit**: `feat(forms): add RadioGroup base and Playful, Soft and Swiss skins`

**PR boundary: PR 6 ends here.**

---

### Task 7: `SelectBase` + `SelectPlayful` (PR 7)

**Files:**
- Create: `src/components/_base/Select/{SelectBase.tsx,SelectBase.test.tsx}`, `src/components/playful/SelectPlayful/*`
- Modify: `src/lib/fields.ts`, `src/lib/fields.test.ts`, `src/components/playful/lookRules.test.tsx`, `src/components/playful/focusRing.test.tsx`, `src/index.ts`, `src/smoke.test.ts` (Playful only for now: the smoke list gets a `Select` entry in Task 8, when all three exist)

**Interfaces:**
- Consumes: `FieldParts`, `FIELD_CLASSES` (trigger reuses `input`), `RAC_FOCUS`.
- Produces:
  - `SELECT_CLASSES: Record<FormLook, FieldClassSet & { control: string; trigger: string; value: string; chevron: string; popover: string; listbox: string; option: string; check: string }>`. This task fills `playful` and sets `soft`/`swiss` to the shape with `""` placeholders so the type is complete; Task 8 replaces them.
  - Playful: `trigger` = the Playful `input` string + `flex items-center justify-between text-left`; `value`: `data-[placeholder]:text-bh-muted-text`; `chevron`: `ml-2 shrink-0`; `popover`: `min-w-(--trigger-width) border-2 border-bh-ink bg-bh-paper-white shadow-bh-hard motion-safe:transition-opacity motion-safe:duration-150`; `listbox`: `max-h-64 overflow-auto outline-hidden`; `option`: `flex items-center justify-between px-4 py-2 font-bh-body text-sm text-bh-ink data-[focused]:bg-bh-yellow data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50` + `RAC_FOCUS`; `check`: `ml-2`.
  - `type SelectBaseClasses = FieldClassSet & { control: string; trigger: string; value: string; chevron: string; popover: string; listbox: string; option: string; check: string }`.
  - `type SelectBaseItem = { id: string; label: string; isDisabled?: boolean }`.
  - `type SelectBaseProps = FieldCommonProps & { items: SelectBaseItem[]; selectedKey?: string | null; defaultSelectedKey?: string; onSelectionChange?: (key: string | null) => void; placeholder?: string; name?: string; isRequired?: boolean; isInvalid?: boolean; isDisabled?: boolean; validate?: (key: string | null) => string | string[] | true | null | undefined; validationBehavior?: "aria" | "native"; className?: string; ref?: Ref<HTMLDivElement>; classes: SelectBaseClasses }`.
  - `SelectBase`: React Aria `Select` (root; `selectedKey`/`defaultSelectedKey` mapped `string | null`, `onSelectionChange` wrapped to `String(key)` or `null`; `disabledKeys` from `items`) > `FieldLabel`, `<div className={classes.control}><Button className={classes.trigger}><SelectValue className={classes.value}/><span aria-hidden className={classes.chevron}>▾</span></Button></div>`, `FieldDescription`, `FieldMessage`, `<Popover className={classes.popover}><ListBox className={classes.listbox} items={items}>` of `ListBoxItem` (`id`, `textValue={label}`, `className={classes.option}`, children render-function showing the label and, when selected, `<span aria-hidden className={classes.check}>✓</span>`). `placeholder` default `"Select an option"`.
  - `SelectPlayfulProps = Omit<SelectBaseProps, "classes">` (the spec gives Select no colour prop).

- [ ] **Step 1: Write the failing tests**

```tsx
// SelectBase.test.tsx  (classes stub all ""; items = banana, cherry (disabled), apple)
const items = [{ id: "banana", label: "Banana" }, { id: "cherry", label: "Cherry", isDisabled: true }, { id: "apple", label: "Apple" }];
it("shows the placeholder, named by its label, until something is picked", () => {
  render(<SelectBase classes={t} label="Fruit" items={items} placeholder="Choose a fruit" />);
  expect(screen.getByRole("button", { name: /Fruit/ })).toHaveTextContent("Choose a fruit");
});
it("opens a listbox on click and selects with the pointer", async () => {
  const onSelectionChange = vi.fn();
  render(<SelectBase classes={t} label="Fruit" items={items} onSelectionChange={onSelectionChange} />);
  await userEvent.click(screen.getByRole("button", { name: /Fruit/ }));
  await userEvent.click(screen.getByRole("option", { name: "Apple" }));
  expect(onSelectionChange).toHaveBeenLastCalledWith("apple");
  expect(screen.getByRole("button", { name: /Fruit/ })).toHaveTextContent("Apple");
  expect(screen.queryByRole("listbox")).toBeNull();
});
it("opens with ArrowDown and picks with Enter", async () => { /* tab, ArrowDown opens, ArrowDown, Enter → "Apple" (Cherry disabled is skipped) */ });
it("jumps by typeahead", async () => { /* open, type "a" → Apple option has data-focused; Enter selects */ });
it("Escape closes and returns focus to the trigger", async () => { /* … toHaveFocus */ });
it("marks the selected option with a ✓ and aria-selected", async () => { /* open with defaultSelectedKey="banana" */ });
it("does not select a disabled option", async () => { /* click Cherry: option aria-disabled, onSelectionChange not called */ });
it("is controlled by selectedKey", async () => { /* selectedKey="banana": pick Apple → callback, trigger still "Banana" */ });
it("shows the placeholder for a selectedKey that matches no item", () => {            // Review Focus 4
  render(<SelectBase classes={t} label="Fruit" items={items} selectedKey="zzz" placeholder="Choose a fruit" />);
  expect(screen.getByRole("button", { name: /Fruit/ })).toHaveTextContent("Choose a fruit");
});
it("opens with empty items without throwing", async () => {                          // Review Focus 3
  render(<SelectBase classes={t} label="Fruit" items={[]} />);
  await userEvent.click(screen.getByRole("button", { name: /Fruit/ }));
});
it("disabled select does not open", async () => { /* toBeDisabled; click → no listbox */ });
it("links description and error to the trigger; the error only while invalid", () => { /* Review Focus 1 */ });
it("marks required with (required)", () => { /* … */ });
it("posts the chosen key in a form under name", async () => {                         // Review Focus 2
  /* <form><SelectBase name="fruit" defaultSelectedKey="apple"/></form> → FormData.get("fruit") === "apple" */
});
it("merges className onto the root and forwards ref", () => { /* … */ });
```

`SelectPlayful.test.tsx`: trigger is a named button (`/Fruit/`); invalid message non-red + red square marker, trigger border stays `border-bh-ink`; opened popover has `border-2 border-bh-ink shadow-bh-hard bg-bh-paper-white`; trigger has `rounded-none`; `className`; `ref`. `lookRules`: `SelectPlayful` valid/invalid (popover content is outside the container, so render with `defaultSelectedKey` and also assert the closed trigger; the opened popover is checked in the skin test). `focusRing`: trigger does not `killsFocusRing`.

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/_base/Select src/components/playful/SelectPlayful`.
- [ ] **Step 3: Implement** `SELECT_CLASSES` (Playful filled, the rest typed placeholders), `SelectBase`, `SelectPlayful`; stories `Default`, `WithDescription`, `Required`, `Invalid`, `Disabled`, `DisabledItem`, `Preselected`; export from the Playful section of `src/index.ts`.
- [ ] **Step 4: Run, confirm PASS**: above plus `pnpm typecheck`.
- [ ] **Step 5: Commit**: `feat(forms): add Select base and Playful skin`

**PR boundary: PR 7 ends here.**

---

### Task 8: `SelectSoft` and `SelectSwiss` (PR 8)

**Files:**
- Create: `src/components/{soft,swiss}/Select<Look>/{Select<Look>.tsx,.test.tsx,.stories.tsx,index.ts}`
- Modify: `src/lib/fields.ts` (fill `SELECT_CLASSES.soft` and `.swiss`), `src/lib/fields.test.ts`, `src/components/soft/lookRules.test.tsx`, `src/components/swiss/lookRules.test.tsx`, `src/components/{soft,swiss}/focusRing.test.tsx`, `src/index.ts`, `src/smoke.test.ts`

**Interfaces:**
- Consumes: `SelectBase`, `SelectBaseProps` (Task 7), `SELECT_CLASSES`.
- Produces:
  - `SELECT_CLASSES.soft`: trigger = Soft `input` string + `flex items-center justify-between text-left`; popover `min-w-(--trigger-width) rounded-bh-soft bg-bh-sand p-1 motion-safe:transition-opacity motion-safe:duration-200` (no border, no shadow); option `rounded-full px-4 py-2 text-sm text-bh-ink data-[focused]:bg-bh-charcoal data-[focused]:text-bh-paper data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50` + `RAC_FOCUS`.
  - `SELECT_CLASSES.swiss`: trigger = Swiss `input` string + `flex items-center justify-between text-left`; popover `min-w-(--trigger-width) rounded-none border border-bh-rule bg-bh-paper-white motion-safe:transition-opacity motion-safe:duration-200`; option `px-3 py-2 font-bh-grotesk text-sm text-bh-muted-text data-[focused]:text-bh-ink data-[selected]:text-bh-ink data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50` + `RAC_FOCUS`; selected option additionally carries the `✓` check (non-colour cue).
  - `SelectSoftProps`, `SelectSwissProps` = `Omit<SelectBaseProps, "classes">`.

- [ ] **Step 1: Write the failing tests**
  - Per skin: trigger is a named button; opening shows a listbox and options (`getByRole("option", { name: "Apple" })`); picking updates the value and fires `onSelectionChange`; invalid message non-red with marker (Soft red dot, Swiss none; trigger has `data-[invalid]:border-bh-accent`); `className`; `ref`.
  - Soft: trigger `rounded-full border border-bh-charcoal bg-bh-sand`; opened popover has `rounded-bh-soft bg-bh-sand` and no `shadow-` token. Swiss: trigger `border-b border-bh-ink bg-transparent`, no `rounded-`; opened popover `border border-bh-rule bg-bh-paper-white`, no `shadow-`; selected option has `✓` and `data-[selected]:text-bh-ink`.
  - `lookRules` (closed trigger) and `focusRing` (trigger) per skin. `fields.test.ts`: `SELECT_CLASSES.soft.popover` and `.swiss.popover` contain no `shadow`.
  - `smoke.test.ts`: append `"Select"` to the forms export list (now all three looks exist).
- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/soft/SelectSoft src/components/swiss/SelectSwiss src/lib/fields.test.ts`.
- [ ] **Step 3: Implement** both skins and the two class sets; stories as in Task 7; exports in the Soft and Swiss sections.
- [ ] **Step 4: Run, confirm PASS**: above plus `pnpm exec vitest run src/components src/smoke.test.ts`.
- [ ] **Step 5: Commit**: `feat(forms): add Soft and Swiss Select skins`

**PR boundary: PR 8 ends here.**

---

### Task 9: Overview stories, README, full gate (PR 9)

**Files:**
- Modify: `src/components/playful/PlayfulOverview.stories.tsx`, `src/components/soft/SoftOverview.stories.tsx`, `src/components/swiss/SwissOverview.stories.tsx`, `README.md`, `consumer-smoke/check.mjs`, `consumer-smoke/check-storybook.mjs`

**Interfaces:**
- Consumes: all 18 skins.
- Produces: a `Forms` section in each overview story; README rows. **No version bump** (0.5.0 ships with the 0.5b plan).

- [ ] **Step 1: Failing check.** Add needles to `consumer-smoke/check.mjs` `expected`: one literal class that only forms use per look, the escaped selector as Tailwind emits it (run `pnpm smoke` once to read the emitted form): `data-[checked]:bg-bh-ink` (Playful default checked fill), `data-[checked]:bg-bh-charcoal` (Soft), `data-[invalid]:border-bh-accent` (Swiss), and `min-w-(--trigger-width)`. Add `check-storybook.mjs` a `checks` entry for the form `Forms` heading text per overview. Run `pnpm smoke` and `pnpm smoke:storybook`. Expected: FAIL before the stories exist (storybook check) or PASS for the class needles (they exist since Tasks 2–8: if a needle already passes, keep it as a regression guard).
- [ ] **Step 2: Implement the overview sections.** In each overview add a `Forms` `Section` (same `Section` helper as the file already defines) holding, in one column on `max-w-md`: a `TextField` (with description), an invalid `TextField` (`isInvalid errorMessage="Enter a valid email"`), a `TextArea`, a `Select`, two `Checkbox`es (one selected, one indeterminate), a `RadioGroup` (three options), and two `Switch`es (off, on), all with realistic labels. Place the section after `Widgets`. The 0.5b plan later adds the modal/toast triggers to this section.
- [ ] **Step 3: README.** Add 18 rows to the Components table (one line each, mirroring the existing rows) under a "Forms" heading, and a "Forms" note: `validationBehavior="aria"` by default, visible labels required (`hideLabel` only for visually hidden), "(required)" marker, invalid messages are never red text. Mark the section "0.5 (in progress, forms first)". Document that Soft muted text is never placed on `sand` and, if Open question 1 is resolved, the boundary treatment.
- [ ] **Step 4: Full gate.** Run: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`. Expected: all pass; the Storybook a11y addon (`test: "error"`) reports no violations on any form story, including `Invalid` and `Disabled`.
- [ ] **Step 5: Commit**: `docs(forms): add forms to the overview stories and README`

**PR boundary: PR 9 ends here. Release `0.5.0` waits for the 0.5b plan.**

---

## Self-review

- **Spec coverage:** §6.2 table (six components, props, label/required/invalid rules, validation default, `md` only) → Tasks 1–8. §6.1 form rows (surface, labels, checked, invalid, popover) → Task 1 maps and per-skin tests. §6.6 base + skin → Architecture and every task. §6.7 base/skin/palette/Storybook tests → each task and Task 1 palette pairs; overview additions → Task 9 (modal/toast triggers deferred to 0.5b by §8). §6.8 class maps in `src/lib` → `fields.ts`. §6.9 exports → per-task `index.ts` lines; `_base` unexported. §3 constraints → Global Constraints. §8 → 0.5a scope and no version bump.
- **Step scan:** every task gives file paths, signatures, class decisions where the spec fixes them, test names and assertions; bodies left to the implementer.
- **Type consistency:** `FieldClassSet` slots (Task 1) are the common subset of every base's `classes`; `FieldCommonProps` is used identically in all six bases; `data-checked` is the single "on" attribute (Checkbox box, Radio circle, Switch track); `PLAYFUL_CHECKED`/`SOFT_CHECKED` are consumed identically in Tasks 4–6; `SelectBaseItem` is defined once (Task 7) and consumed in Task 8.
- **Review Focus:** all five lines have an owning test (Tasks 2, 4–7).
- **Proportion:** per-task test lists are the bulk; no component body is written out.
