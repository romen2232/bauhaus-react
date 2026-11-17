# bauhaus-react forms, overlays and data — Design

Status: draft, awaiting approval
Date: 2026-11-17
Related:
- `docs/superpowers/specs/2026-11-16-bauhaus-react-full-catalogue-design.md` (catalogue design; its look rules §6.1, base + skin structure §6.5 and testing §6.7 stay in force)
- `docs/superpowers/specs/2026-11-16-bauhaus-react-v1-design.md` (v1 constraints)

---

## 1. Intent

The catalogue design deliberately left out data tables, charts, form inputs and toasts (catalogue §2, non-goals) because the style analysis had no reference for them. This design adds them, plus modals.

- **Why:** the author builds **portfolio sites and small dashboards for their own projects**. Portfolios need contact forms, confirmations and dialogs. Dashboards need tables, charts, filters and feedback.
- **Who it serves:** the author. This is not an enterprise kit.
- **Any look, any context:** all three looks (Playful, Soft, Swiss) may appear on both portfolios and dashboards, so every family ships in all three looks.
- **Visual direction:** approved by the author from a mockup of one small dashboard per look (`.superpowers/brainstorm/*/content/looks-overview.html`), described in §6.

## 2. Goals, non-goals, anti-goals

**Goals**
- Five new families, each in all three looks on a shared headless base:
  1. **Form inputs:** `TextField`, `TextArea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`
  2. **Modal**
  3. **Toast**
  4. **Table**
  5. **Charts:** `BarChart`, `LineChart`, `DonutChart`, `Sparkline`
- Every family is designed from the catalogue look rules (§6.1) alone, so it reads as the same library.
- WCAG 2.2 AA, including non-text contrast (1.4.11) for chart marks and input borders.
- Colours flow through shared class maps in `src/lib/`, never as literals scattered in skins, so the later dark-mode run touches one place per look (§6.8).

**Non-goals**
- **Dark mode.** It moves to a later run. The exploration so far is recorded in Appendix A.
- **Decoration reusability** (mixing geometric decorations into reusable identities). It moves to a later run.
- Data-grid features: virtualization, server pagination, column resizing or reordering, inline editing, frozen columns.
- Chart zoom, brushing, panning, legends with toggling, stacked or grouped multi-axis charts, and animated data transitions.
- Other inputs: combobox/autocomplete, date picker, slider, file upload, rich text.
- A form-state library. Validation uses React Aria's built-in validation only.

**Anti-goals**
- A heavy data-grid or chart library hidden under a Bauhaus skin.
- Any catalogue anti-goal: a `look` prop, global look config, or a re-skinning wrapper class.
- Blurred backdrops (catalogue §6.1 "reference deviations dropped").
- Red text for small error messages: `bh-red` on `paper` is about 3.3:1 and fails AA for body text.

## 3. Constraints

- **Baseline:** release `0.4.0` (branch `feat/0.4`, or `main` once merged). All Playful, Soft and Swiss skins, `SoftTone`, `bh-accent`, `SWISS_LABEL`, `SWISS_RAC_FOCUS` and `FOCUS_RING` already exist and are reused.
- Everything in catalogue §3 still applies: stack, peer deps, static class literals only, `preserveModules`, single `"."` barrel plus `./theme.css`, `bh-` token namespace, Strict TDD, `"use client"` on any file using React Aria, state or effects.
- **No new runtime dependency.** Forms, Modal, Toast and Table use `react-aria-components` (already a dependency, 1.22.1 at time of writing). Charts are hand-drawn SVG.
- **Toast is `UNSTABLE_` in React Aria 1.22.1** (`UNSTABLE_ToastQueue`, `UNSTABLE_ToastRegion`, `UNSTABLE_Toast`). All of it is wrapped inside `ToastBase`, so upstream renames stay internal. The public API in §6.3 never exposes React Aria toast types.
- Chart SVG colours use Tailwind `fill-bh-*` / `stroke-bh-*` classes (or `currentColor`), never `HEX` values, so tokens stay overridable.

## 4. Approaches considered

The author picked **B with hand-drawn SVG charts**.

| | Approach | Tradeoff | Outcome |
|---|---|---|---|
| A | One big `0.5` release with all five families | One coherent release, but several thousand lines in one go, far beyond the 400-line review budget, and nothing usable until the end | Rejected |
| **B** | **Phased releases by family: forms + modal + toast → table → charts** | Three planning and review rounds; each ships something usable, and later skins learn from earlier dense-UI work | **Chosen** |
| C | Charts via a library (e.g. Recharts), skinned per look | Less chart code, but a heavy dependency whose defaults fight hard edges, hairlines and hard shadows | Rejected: bar, line, donut and sparkline are simple geometry |

## 5. Decided by the author

1. Scope: tables, charts, form inputs, toasts **and modals**.
2. Audience: their own portfolio sites and small dashboards.
3. All three looks are available for both contexts.
4. Visual direction per look as in the approved mockup. The mockup's spacing was off; spacing follows the existing component scale instead.
5. Dark mode and decoration reusability are deferred to later runs.
6. Approach B (phased releases), charts drawn by hand in SVG.

## 6. Design

### 6.1 How each look applies to the new families

Derived from catalogue §6.1. A combination not listed here is designed from that table.

| | Playful | Soft | Swiss |
|---|---|---|---|
| **Field surface** | `paper-white` fill, 2px `ink` border, `rounded-none`; focus adds `shadow-bh-hard` | Tonal `sand` fill with a 1px `charcoal` outline (author decision: sand on paper is 1.29:1, below 1.4.11's 3:1), `rounded-full` (single-line) or `rounded-bh-soft` (TextArea). Unchecked checkbox, radio and Switch track get the same outline; popovers and panels stay borderless | Transparent, 1px `ink` bottom rule only |
| **Labels** | Display, black weight, uppercase | Display, regular, `charcoal` | `SWISS_LABEL` in `muted-text` |
| **Checked / on state** | Fill from `color: FillColor` (default `ink`), 2px border | Fill from `tone` (default `neutral`) | `ink` fill; Switch track `ink` |
| **Invalid state** | Border stays `ink`; a `red` 4px bar on the field's leading edge; message in `ink` with a red square marker | Red tone dot before an `ink` message; field fill unchanged | 1px rule turns `bh-accent` (the component's single accent); message in `ink` |
| **Popover (Select)** | 2px border, `shadow-bh-hard`, `paper-white` | `rounded-bh-soft`, `sand`, no shadow | `paper-white`, 1px `rule` border, no shadow |
| **Modal panel** | `paper`, 2px border, `shadow-bh-hard-lg` | `paper`, `rounded-bh-soft` | `paper-white`, 2px `ink` top rule |
| **Modal scrim** | Solid `ink` at 60% | Solid `charcoal` at 60% | Solid `ink` at 40% |
| **Toast** | Solid fill (`color`, default `blue`), 2px border, hard shadow, uppercase | `charcoal` pill, `paper` text, tone dot | `paper-white`, 2px `ink` top rule, action as underlined text |
| **Table** | `paper-white` body, 2px border + `shadow-bh-hard`, `yellow` header row, 2px row rules | Rows sit on a `sand` panel (`rounded-bh-soft`), alternate rows lightened, no rules | No outer frame, 1px `ink` header rule, 1px `rule` row rules, tabular numerals |
| **Table status cell** | Filled pill with 2px border (Tag-like) | Tone dot + word | Plain text; emphasis by `muted-text` → `ink` |
| **Chart marks** | `FillColor` fills with 2px `ink` outlines | `charcoal` marks, one highlighted mark in a `tone` | `ink` marks, one highlighted mark in `bh-accent` |
| **Motion** | 150ms ease-out; modal and toast enter with a short drop | 150–250ms slides / fades | 150–250ms wipes; no kinetic decoration |

Shared by every look (catalogue §6.1): `FOCUS_RING` / `SWISS_RAC_FOCUS`, disabled at 50% with `cursor-not-allowed`, every motion `motion-safe:`, yellow never a text colour.

**Non-text contrast (1.4.11):** any mark, border or control state that carries meaning must reach 3:1 against its neighbour, or be outlined in `ink`, or be labelled directly. This is why Playful marks keep their 2px `ink` outline (yellow on paper is about 1.7:1) and why Soft's yellow is only used next to a text label.

### 6.2 Form inputs (release `0.5`)

| Component | React Aria | Base behaviour |
|---|---|---|
| `TextField` | `TextField`, `Input`, `Label`, `Text`, `FieldError` | `label`, `description`, `errorMessage`, `isRequired`, `isInvalid`, `isDisabled`, `isReadOnly`, `type` (`text`/`email`/`password`/`search`/`url`/`tel`), controlled/uncontrolled `value` |
| `TextArea` | `TextField` + `TextArea` | as `TextField`, plus `rows` |
| `Select` | `Select`, `Button`, `SelectValue`, `Popover`, `ListBox`, `ListBoxItem` | `items: { id, label, isDisabled? }[]`, `selectedKey` / `defaultSelectedKey` / `onSelectionChange`, `placeholder` |
| `Checkbox` | `Checkbox` | `isSelected` / `defaultSelected` / `onChange`, `isIndeterminate` |
| `RadioGroup` | `RadioGroup`, `Radio` | `options: { value, label, isDisabled? }[]`, `value` / `defaultValue` / `onChange`, `orientation` |
| `Switch` | `Switch` | `isSelected` / `defaultSelected` / `onChange` |

- **Every field has a visible label.** A visually hidden label is allowed only via an explicit `hideLabel` prop.
- **Invalid `Checkbox` / `RadioGroup` / `Switch`:** the control itself doesn't change. The error message sits under the control or group, in `ink`, with the look's marker before it: Playful a red square, Soft a red tone dot, Swiss a small `bh-accent` square (its one accent) *(Claude's call)*.
- **Required marker:** the word "(required)" after the label in `muted-text`, not a red asterisk.
- **Validation:** React Aria native validation plus `validate` and `errorMessage`. `validationBehavior="aria"` by default *(Claude's call: live feedback suits small dashboard filters; contact forms still work)*.
- **Skin props:** Playful `Checkbox`/`RadioGroup`/`Switch` take `color: FillColor`; Soft takes `tone`; Swiss has none.
- **Sizes:** `md` only in `0.5` *(Claude's call: the author's forms are small; `sm` can follow later)*.

### 6.3 Modal and Toast (release `0.5`)

**Modal** (`ModalPlayful` / `ModalSoft` / `ModalSwiss`) on React Aria `DialogTrigger`, `ModalOverlay`, `Modal`, `Dialog`, `Heading`.

- Props: `title` (rendered as the dialog heading, required), `children` (body), `footer?: ReactNode` (actions), `trigger?: ReactElement`, `isOpen` / `defaultOpen` / `onOpenChange`, `isDismissable` (default `true`), `role` (`"dialog"` default, `"alertdialog"` for confirmations), `size` (`sm` / `md` / `lg`).
- Behaviour from React Aria: focus trap, `Esc` closes, focus returns to the trigger, page scroll locked. `alertdialog` is never dismissable by clicking the scrim.
- **Trigger compatibility:** `ButtonBase` renders a native `<button>`, while React Aria's `DialogTrigger` expects a pressable child. The `trigger` prop stays in the public API *(Claude's call)*. The Modal base makes any element work as a trigger, by wrapping it in React Aria's `Pressable` if that works with a native button, or otherwise by holding open state itself and attaching `onClick`. A test proves `ButtonPlayful`, `ButtonSoft` and `ButtonSwiss` all open the modal and get focus back on close. The controlled API (`isOpen` / `onOpenChange`) is always available too.
- Body scrolls inside the panel when content is taller than the viewport; the header and footer stay fixed.

**Toast** (`ToastRegionPlayful` / `ToastRegionSoft` / `ToastRegionSwiss`).

- One shared queue, exported as `toast`:
  ```ts
  toast({ title: "Message sent", description?: string, action?: { label: string, onAction: () => void },
          timeout?: number, color?: FillColor, tone?: SoftTone }) // returns an id
  toast.close(id)
  ```
  The consumer mounts one `ToastRegion<Look>` near the app root. `color` is read only by Playful and `tone` only by Soft; the others ignore them.
- **Timeout:** 5000ms by default. A toast with an `action` never auto-dismisses (WCAG 2.2.1).
- **Placement:** bottom-end by default; `placement` prop on the region (`bottom-end`, `bottom`, `top-end`, `top`).
- **Stack:** at most 3 visible; older toasts queue. Toasts with an action count toward the 3. They always have a close button, so the queue can't stall forever.
- **Several regions:** the default `toast` queue serves one mounted region. For more than one region on a page (e.g. a Storybook overview showing all three looks), `createToastQueue()` is exported and each region takes an optional `queue` prop *(Claude's call)*.
- Each toast has a close button with an accessible name. Announcements come from React Aria's region (`role="region"`, live announcements).

### 6.4 Table (release `0.6`)

`TablePlayful` / `TableSoft` / `TableSwiss` on React Aria `Table`, `TableHeader`, `Column`, `TableBody`, `Row`, `Cell`.

- Data-driven API:
  ```ts
  type TableColumn<T> = { id: keyof T & string; label: string; align?: "start" | "end";
                          isRowHeader?: boolean; allowsSorting?: boolean;
                          render?: (row: T) => ReactNode };
  <TableSwiss aria-label="Projects" columns={cols} rows={rows} getRowId={(r) => r.slug}
              sortDescriptor={…} onSortChange={…} emptyState="No projects yet" />
  ```
- **Sorting:** controlled or uncontrolled. When uncontrolled, the base sorts locally on `column.sortValue?.(row) ?? row[column.id]` *(Claude's call)*. That value may be a number, string (`localeCompare`) or `Date`, and `null`/`undefined` always sort last. `sortValue` exists so cells shown through `render` (e.g. a status pill) still sort by their real value.
- **Row links:** a row has either `href` or `onRowAction`, never both (enforced by the types).
- `aria-label` or `aria-labelledby` required. Exactly one column has `isRowHeader` (default: the first).
- Numeric columns use `align: "end"` and tabular numerals.
- **Rows:** optional `onRowAction` or `href` per row. No selection checkboxes in `0.6` *(Claude's call: small dashboards don't need bulk actions)*.
- **Narrow screens:** the table scrolls horizontally inside its own wrapper; the page never scrolls sideways.
- **Status cells** are rendered through `render` using existing Tag/Chip skins or plain text, per §6.1. No new status component.

### 6.5 Charts (release `0.7`)

`BarChart`, `LineChart`, `DonutChart` and `Sparkline`, each as `<Name>Playful` / `<Name>Soft` / `<Name>Swiss`.

- **Hand-drawn SVG.** A small internal `src/lib/chart.ts` holds the math: linear scale, "nice" tick generation, bar band layout, line path, and arc path for donut slices. It has its own unit tests. No d3.
- **Data:** `data: { label: string; value: number }[]`. `LineChart` also accepts up to 3 series: `series: { id, label, data }[]`.
- **Highlight:** `highlight?: string` (a label) picks the mark that gets the accent (Soft tone, Swiss `bh-accent`). Playful colours each mark from a `colors?: FillColor[]` cycle (default red, blue, yellow).
- **Accessibility:** each chart is a `<figure>` with a required `title` (visible `<figcaption>` or `hideTitle`) and a visually hidden data `<table>` with the same values, which is exposed to assistive tech. The SVG itself is `aria-hidden` and contains **nothing focusable**.
- **Values:** bar and line points show their value in a tooltip on pointer hover. Keyboard and screen-reader users get the same values from the data table. A `showValues` prop prints values directly on the marks for anyone who needs them always visible *(Claude's call: this avoids a focusable `aria-hidden` subtree)*. `Sparkline` has no tooltip or axes.
- **Sizing:** charts fill their container's width; height is a prop (default by kind). Text and stroke widths must not distort when the chart scales (render text in SVG at the measured width, or use `vector-effect: non-scaling-stroke`; left to the builder).
- **Axes:** bar and line show a value axis with nice ticks and a category axis. Gridlines follow the look: Playful 2px `ink` baseline only; Soft none; Swiss 1px `rule` gridlines.
- **Donut:** at most 6 slices; a centre label (big numeral, Soft-style heroes). Swiss donuts use `ink`, `charcoal` and `bh-accent` only, so at most 3 slices, with the rest grouped as "Other".

### 6.6 Base + skin structure

Exactly catalogue §6.5: an internal base per component under `src/components/_base/`, skins under `playful/`, `soft/`, `swiss/`, `classes` slot objects, skins own only static class maps and their colour prop. Controlled and uncontrolled state with React Aria naming everywhere.

### 6.7 Testing

Strict TDD, as in catalogue §6.7. Tests check behaviour, not classes.

- **Base tests:** label/description/error association, required and invalid states, keyboard use (Select arrow keys and typeahead, RadioGroup arrows, Switch/Checkbox Space), Modal focus trap + `Esc` + focus return + `alertdialog` not dismissable, Toast auto-dismiss timing (fake timers), no auto-dismiss with an action, max 3 visible, Table sort cycles and `aria-sort`, row header, empty state.
- **`lib/chart.ts` unit tests:** nice ticks for awkward ranges (0–7, 0–1234, negative values, all zeros), band layout, arc angles summing to 360°.
- **Chart tests:** hidden data table matches the data, title is the figure's name, the SVG contains nothing focusable.
- **Skin tests:** role and name, `className` and `ref` forwarding, the skin's colour prop.
- **Palette tests:** every new pairing used for text, plus 1.4.11 checks for meaningful marks and borders.
- **Storybook:** one story per variant per look with the a11y addon, and each look's overview story gains a small dashboard composition (table + chart + form + toast trigger + modal trigger).

### 6.8 Preparing for the dark-mode run

Not dark mode itself, only what keeps it cheap later:

- New skins take colours from named class maps in `src/lib/` (e.g. a `FIELD_CLASSES` map per look, extending `palette.ts` / `styles.ts`), not inline literals spread across files.
- No hex values in components; SVG uses `fill-bh-*` / `stroke-bh-*` classes.

### 6.9 Public API

- `index.ts` exports every new skin, plus `toast` and the types `TableColumn`, `ChartDatum`, `ChartSeries`, `ToastOptions`.
- `_base` and `lib/chart.ts` are never exported.
- The single `"."` barrel stays.

## 7. Left to the builder

- Exact slot names per base, typed and fixed.
- Exact sizes, spacing and type steps inside each skin, within §6.1 and the existing component scale.
- How chart text stays crisp while the SVG scales (§6.5).
- Select popover placement and width rules.
- Storybook organisation beyond §6.7.

## 8. Releases

`0.5` gets two implementation plans (forms, then modal + toast); `0.6` and `0.7` get one each *(Claude's call)*. Each plan is delivered as chained PRs if it exceeds the 400-line review budget.

| Release | Contents |
|---|---|
| `0.5` (portfolio-facing) | Form input bases + 18 skins (6 × 3), Modal base + 3 skins, Toast base + 3 regions + `toast` API |
| `0.6` | Table base + 3 skins |
| `0.7` | `lib/chart.ts`, 4 chart bases + 12 skins |

## 9. Calls made by Claude (author to confirm while reading)

1. Invalid states never use red small text; red appears as a bar, dot or rule next to an `ink` message (§6.1).
2. Required fields say "(required)" instead of showing an asterisk (§6.2).
3. `validationBehavior="aria"` by default (§6.2).
4. Only the `md` size in `0.5` (§6.2).
5. Modal scrim is solid colour at 40–60%, no blur (§6.1).
6. Toast: 5s timeout, no auto-dismiss with an action, max 3 visible, bottom-end (§6.3).
7. One shared `toast()` queue; looks ignore colour props that aren't theirs (§6.3).
8. Table: no row selection in `0.6` (§6.4).
9. Charts: data table fallback for screen readers; Swiss donut limited to 3 slices (§6.5).
10. No new runtime dependency (§3).
11. Modal keeps a `trigger` prop that works with the library's native-button skins (§6.3).
12. `createToastQueue()` + a `queue` prop when more than one region is mounted (§6.3).
13. Table `sortValue` per column; `href` and `onRowAction` are mutually exclusive (§6.4).
14. Chart marks are not focusable; values come from hover tooltips, the data table, or `showValues` (§6.5).
15. Invalid Checkbox/RadioGroup/Switch use a look-specific marker before the message (§6.2).
16. `0.5` is split into two plans (§8).

## Appendix A. Notes for the dark-mode run (not in scope)

Explored on 2026-11-17 in `.superpowers/brainstorm/*/content/dark-mode.html`. The author deferred it without choosing.

- Tokens would move from literal names (`paper`, `ink`) to roles (`surface`, `on-surface`, `line`, …) that each look remaps.
- Mechanism idea: follow `prefers-color-scheme`, with a `data-theme="dark|light"` override, matching Tailwind v4's `dark:` variant.
- Per-look strategies sketched:
  - **Playful, "night navy":** `navy` ground; borders and hard shadows flip to `paper`; `blue` swaps to `sky` (blue on navy is unreadable).
  - **Soft, "warm dusk":** warm near-black ground; surfaces step lighter for depth; `sand` retires; toast inverts to `paper`.
  - **Swiss:** straight inversion; the single `bh-accent` stays.
- Open question at deferral: whether paper-coloured hard shadows still read as Playful.
