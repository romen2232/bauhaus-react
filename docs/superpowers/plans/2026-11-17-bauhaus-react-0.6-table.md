# bauhaus-react 0.6 (Table) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `0.6.0`, which adds a data-driven, sortable `Table` in all three looks (`TablePlayful`, `TableSoft`, `TableSwiss`) on one shared base.

**Architecture:** One internal base, `src/components/_base/Table/TableBase.tsx`, wraps React Aria's `Table`, `TableHeader`, `Column`, `TableBody`, `Row` and `Cell` as dynamic collections (`columns` / `items`). It owns sorting, row-header normalisation, the empty state, row links/actions and the horizontal-scroll wrapper. Each look is a thin skin that owns a named slot-class map in `src/lib/tableClasses.ts` (spec §6.8) and passes it to the base. Comparison logic lives in a pure, separately tested `sortRows.ts`.

**Tech Stack:** React 19.3, TypeScript 7, Tailwind CSS 4.3 (`@theme static`), Vite 8 lib mode, Vitest 5 + jsdom + Testing Library + user-event, Storybook 10, `react-aria-components` 1.22.1, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-17-bauhaus-react-forms-overlays-data-design.md`. This plan implements release `0.6` (§8) and the Table family (§6.4), using the look matrix in §6.1, testing in §6.7, class maps in §6.8 and the public API in §6.9. The earlier `docs/superpowers/specs/2026-11-16-bauhaus-react-full-catalogue-design.md` (§6.1 look rules, §6.5 base + skin structure, §6.7 testing) stays in force. The structural model is `docs/superpowers/plans/2026-11-16-bauhaus-react-0.4.md`.

**Baseline:** release `0.5.0` (forms, Modal, Toast) has shipped. This plan changes no `0.5` file except the sanctioned release edits in Task 9. If `0.5` introduced a different home or naming for per-look class maps than `src/lib/<family>Classes.ts`, follow its convention and keep the exported names below.

## Global Constraints

**Spec rules for Table** (§6.1, §6.4)
- Playful: `paper-white` body, 2px `ink` border + `shadow-bh-hard`, `yellow` header row, 2px `ink` row rules. Status cell: filled pill with 2px border (Tag-like).
- Soft: rows sit on a `sand` panel (`rounded-bh-soft`), alternate rows lightened, no rules. Status cell: tone dot + word.
- Swiss: no outer frame, 1px `ink` header rule, 1px `rule` row rules, tabular numerals. Status cell: plain text, emphasis `muted-text` → `ink`. Swiss never uses `paper`, `sand`, `shadow-*`, `border-2`, `rounded`, or a bold weight.
- Numeric columns use `align: "end"` and tabular numerals.
- `aria-label` or `aria-labelledby` is required (enforced by the types). Exactly one column is the row header; default is the first.
- A table has `onRowAction` or per-row `href`, never both (enforced by the types). No selection checkboxes in `0.6`.
- Narrow screens: the table scrolls horizontally inside its own wrapper; the page never scrolls sideways.
- Status cells are rendered through `render` with the existing Tag/Chip skins or plain text. **No new status component.**

**Shared by every look**
- Every interactive element is visibly focusable. React Aria elements that hide the outline carry `data-[focus-visible]:outline-solid` (the Tailwind 4.3 bug guarded by `src/components/playful/focusRing.test.tsx`).
- Disabled controls: `cursor-not-allowed opacity-50`. Every motion is `motion-safe:`. Yellow is never a text colour.
- **Static class literals only.** Never interpolate a class name. `pnpm smoke` fails on `bh-${`.
- Colours come from the named maps in `src/lib/tableClasses.ts`, no hex values in components (§6.8).
- 1.4.11: any border or mark carrying meaning reaches 3:1, or is outlined in `ink`, or labelled directly (§6.1).

**Component conventions** (unchanged from 0.2 to 0.5)
- Skin folder: `src/components/<look>/Table<Look>/{Table<Look>.tsx, .test.tsx, .stories.tsx, index.ts}`. `index.ts` re-exports with `.js` suffixes; tests import without a suffix. Story titles `Playful/TablePlayful`, `Soft/TableSoft`, `Swiss/TableSwiss`; backgrounds `paper` / `paper` / `white` as in the sibling stories.
- Both the base and the skins start with `"use client"`.
- `_base` and `sortRows.ts` are never exported from `src/index.ts`.
- `ref` is a regular prop; `className` merges last into the wrapper slot.

**Process**
- Strict TDD: failing test, run (expect FAIL), implement, run (expect PASS), commit.
- Every existing test (0.2 to 0.5) passes unchanged. The only sanctioned edit of an existing test is the version assertion in `src/smoke.test.ts` (Task 9).
- Commits: conventional commits, **no AI attribution, no Co-Authored-By lines.** One commit per task (work-unit commits, tests with the code they verify).
- Delivery: chained PRs, each at or below about 400 changed lines. Boundaries are marked `PR n` below. The chain strategy (`stacked-to-main` or `feature-branch-chain`) is the author's choice when the first PR opens.

**Test commands** (from `package.json`)
- One file: `pnpm exec vitest run <path>`
- Types: `pnpm typecheck` (includes test files, so `@ts-expect-error` type tests run here)
- Full gate: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`

## Verified against React Aria 1.22.1

These facts were checked in `node_modules/react-aria-components` and `react-stately` before the plan was written. The plan depends on them.

- `Table` (renders `<table role="grid">`) takes `sortDescriptor` (`{ column: Key; direction: "ascending" | "descending" }`) and `onSortChange`, and `onRowAction(key: Key)` at **table** level. There is **no** `defaultSortDescriptor`, so the base holds uncontrolled sort state itself.
- Pressing a sortable column calls `onSortChange` with `direction: "ascending"` when that column is not the sorted one, otherwise the opposite direction. **It toggles ascending/descending and never returns to unsorted.**
- A sortable column header gets `aria-sort="none" | "ascending" | "descending"`. Column render props include `sortDirection` and `allowsSorting`, and the element gets `data-sort-direction`.
- `Row` accepts `href` (`LinkDOMProps`), `id`, `columns` and a cell render function. `TableHeader` takes `columns` plus a column render function. `TableBody` takes `items`, a row render function and `renderEmptyState`. Rows and header cache by item, so pass `dependencies={[columns]}` wherever the render function closes over `columns` or `render` callbacks.
- A row link navigates through the router context: `RouterProvider` from `react-aria-components` receives `navigate(href)`, which makes the link behaviour testable in jsdom.
- When the table has no rows, column headers become untabbable (`tabIndex=-1`).

## Spec deviations and open points

1. **`TableColumn.sortValue` is missing from the §6.4 type snippet** although the prose requires it. The plan adds `sortValue?: (row: T) => SortValue`.
2. **"A row has either `href` or `onRowAction`" does not map onto React Aria.** `onRowAction` is table-level, `href` is row-level. The plan exposes table-level `getRowHref?: (row: T) => string` **or** `onRowAction?: (row: T) => void`, mutually exclusive in the types (`never` on the other). A single table cannot mix both.
3. **Sort "cycles" are a toggle.** React Aria never returns to unsorted (verified above). Tests assert ascending then descending then ascending. The initial unsorted state comes only from omitting `defaultSortDescriptor`.
4. **`id: keyof T & string` rules out display-only columns** (e.g. an "actions" column with no matching field). Kept as the spec says; such a column needs a real key on `T`.
5. **Type extras in the public API.** §6.9 lists only `TableColumn`. The plan also exports `TableSortDescriptor` (own type, so React Aria's `Key`-typed descriptor never leaks), and the skin props types, as every other skin does.
6. **Overview story scope.** §6.7 asks for a dashboard composition (table + chart + form + toast + modal). Charts only exist in `0.7`, so `0.6` adds the Table section and the 0.7 plan completes the composition. Confirm with the author.
7. **`Omit` on a union type collapses it.** `Omit<TableBaseProps<T>, "classes">` would lose the `href`/`onRowAction` and label unions. The plan defines `TableSkinProps<T>` explicitly to avoid it.

## Review Focus

Failure modes the spec implies but no obvious task exercises. Each has a test in the task named in brackets.

1. **Missing values sort last, in both directions, and never crash.** `null`, `undefined`, `NaN` and an invalid `Date` come after every real value ascending **and** descending. [Task 1]
2. **Mixed value types are deterministic.** A column holding numbers and strings never throws and never yields an inconsistent comparator. [Task 1]
3. **Rows change while sorted.** New `rows` re-sort in place when uncontrolled; the sorted column disappearing from `columns` degrades to unsorted, not a crash. [Task 3]
4. **Empty and degenerate input.** No rows shows `emptyState` with headers intact; `columns=[]` renders without throwing; a `render` cell and a plain `null` cell both render. [Task 2]
5. **Focus ring is not clipped by the scroll wrapper.** The wrapper uses `overflow-x-auto`, so focus outlines on columns, rows and cells are drawn inside (negative offset) in all three skins. [Tasks 5 to 7]

---

## File map

```txt
src/components/_base/Table/tableTypes.ts            C  TableColumn, SortValue, TableSortDescriptor, TableBaseClasses (Task 1)
src/components/_base/Table/sortRows.ts, .test.ts    C  comparator + stable sort (Task 1)
src/components/_base/Table/TableBase.tsx, .test.tsx C  base (Tasks 2 to 4)
src/lib/tableClasses.ts                             C  TABLE_PLAYFUL_CLASSES (5), TABLE_SOFT_CLASSES (6), TABLE_SWISS_CLASSES (7)
src/lib/styles.ts, styles.test.ts                   M  TABLE_RAC_FOCUS (Task 5)
src/lib/palette.test.ts                             M  Table pairings (Tasks 5 to 7)
src/components/playful/TablePlayful/…               C  skin (Task 5)
src/components/soft/TableSoft/…                     C  skin (Task 6)
src/components/swiss/TableSwiss/…                   C  skin (Task 7)
src/components/{playful,soft,swiss}/focusRing.test.tsx   M  one test each (Tasks 5 to 7)
src/components/swiss/lookRules.test.tsx             M  one case (Task 7)
src/components/{Playful,Soft,Swiss}Overview.stories.tsx  M  Data section (Task 8)
src/index.ts, src/smoke.test.ts, package.json, README.md M  exports (5 to 7), release (9)
```

No file under `primitives/`, `decoration/` or any other `_base/` folder changes.

Task order: pure sort logic, static base, sorting wiring, row actions, Playful, Soft, Swiss, overview, release.

---

## PR 1: static base (Tasks 1 and 2, about 380 lines)

### Task 1: Types and `sortRows`

**Files:**
- Create: `src/components/_base/Table/tableTypes.ts`, `src/components/_base/Table/sortRows.ts`
- Test: `src/components/_base/Table/sortRows.test.ts`

**Interfaces:**
- Produces, in `tableTypes.ts`:
  - `type SortValue = string | number | Date | null | undefined`
  - `type TableColumn<T> = { id: keyof T & string; label: string; align?: "start" | "end"; isRowHeader?: boolean; allowsSorting?: boolean; sortValue?: (row: T) => SortValue; render?: (row: T) => ReactNode }`
  - `type TableSortDescriptor = { column: string; direction: "ascending" | "descending" }`
  - `type TableBaseClasses = { wrapper: string; table: string; header: string; column: string; columnSorted: string; sortIcon: string; body: string; row: string; rowActionable: string; cell: string; rowHeaderCell: string; alignEnd: string; empty: string }`
- Produces, in `sortRows.ts` (never exported from `index.ts`):
  - `compareSortValues(a: SortValue, b: SortValue, direction?: "ascending" | "descending"): number`
  - `sortRows<T>(rows: readonly T[], column: TableColumn<T> | undefined, direction: "ascending" | "descending"): T[]`
- Rules (decisions, not left to the implementer):
  - **Missing:** `null`, `undefined`, `NaN` and an invalid `Date` are missing. A missing value sorts after every present one **regardless of direction**; two missing values compare equal.
  - **Present values:** numbers and `Date` (by `getTime()`) compare numerically; strings compare with `a.localeCompare(b)`; when kinds differ, numbers/dates come before strings. `direction: "descending"` negates the result for present pairs only.
  - `sortRows` returns a new array, is stable (equal values keep input order), reads `column.sortValue ? column.sortValue(row) : row[column.id]` (spec §6.4 writes `??`, but a `sortValue` that deliberately returns `null` or `undefined` must stay missing and not fall back to the field), and returns the input order copy when `column` is `undefined`.

- [ ] **Step 1: Write the failing tests** (`sortRows.test.ts`)

Tests, with these exact names and assertions:
- `compares numbers numerically`: `compareSortValues(2, 10) < 0`, `compareSortValues(10, 2) > 0`, `compareSortValues(5, 5) === 0`.
- `compares strings with localeCompare`: `compareSortValues("apple", "Banana") < 0` (code-unit order would put "Banana" first), and `compareSortValues("b", "a", "descending") < 0`.
- `compares Dates by time`: `compareSortValues(new Date("2026-01-02"), new Date("2026-01-10")) < 0`.
- `missing values sort last in both directions` (`it.each` over `[null, undefined, NaN, new Date("nope")]`): for each `m`, `compareSortValues(m, 1, "ascending") > 0`, `compareSortValues(m, 1, "descending") > 0`, `compareSortValues(1, m, "descending") < 0`, and `compareSortValues(m, null) === 0`.
- `numbers and dates come before strings when kinds are mixed`: `compareSortValues(5, "a") < 0`, `compareSortValues("a", new Date(0)) > 0`.
- `sortRows uses sortValue over the field`: rows `{ name: "a", rank: "low" }`, `{ name: "b", rank: "high" }` with `sortValue: (r) => (r.rank === "high" ? 1 : 0)`; ascending gives `["a", "b"]` by name.
- `sortRows falls back to the field and is stable`: three rows, two with equal values, keep input order of the equal pair.
- `sortRows does not mutate its input and handles an undefined column`: input array unchanged; `undefined` column returns a different array with equal contents.
- `sortRows puts missing last descending`: `[{v:null},{v:1},{v:2}]` descending gives `[2, 1, null]`.

- [ ] **Step 2: Run, confirm FAIL**

Run: `pnpm exec vitest run src/components/_base/Table/sortRows.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 3: Implement** `tableTypes.ts` with the exact types above and `sortRows.ts` per the rules. A kind helper (`"missing" | "number" | "string"`) keeps the comparator total.

- [ ] **Step 4: Run, confirm PASS** (same command), then `pnpm typecheck`.

- [ ] **Step 5: Commit**: `feat(table): add table types and sort comparison`

---

### Task 2: `TableBase` static rendering

**Files:**
- Create: `src/components/_base/Table/TableBase.tsx`
- Test: `src/components/_base/Table/TableBase.test.tsx`

**Interfaces:**
- Consumes: `TableColumn`, `TableSortDescriptor`, `TableBaseClasses` (Task 1); `cn`.
- Produces, in `TableBase.tsx`:
  - `TableBaseOwnProps<T>`: `{ columns: TableColumn<T>[]; rows: T[]; getRowId: (row: T) => string; emptyState?: ReactNode; className?: string; ref?: Ref<HTMLDivElement>; classes: TableBaseClasses }`. Sorting props are added in Task 3, row actions in Task 4.
  - `TableLabelProps = { "aria-label": string; "aria-labelledby"?: string } | { "aria-labelledby": string; "aria-label"?: string }`.
  - `TableBaseProps<T> = TableBaseOwnProps<T> & TableLabelProps`.
  - `TableSkinProps<T> = Omit<TableBaseOwnProps<T>, "classes"> & TableLabelProps` (the shape every skin aliases).
  - `function TableBase<T>(props: TableBaseProps<T>): JSX.Element`.
- Behaviour:
  - Root is `<div className={cn(classes.wrapper, className)} ref={ref}>` containing the React Aria `Table` (`className={classes.table}`).
  - Header: `TableHeader columns={columns}` (`classes.header`), one `Column` per column (`id`, `allowsSorting`, `isRowHeader`, `className={classes.column}` plus `classes.alignEnd` when `align === "end"`). Label text is `column.label`; the column's `textValue` is `column.label`.
  - **Row header:** only the first column with `isRowHeader: true` is the row header; when none, the first column. Other `isRowHeader` flags are ignored.
  - Body: `TableBody items={rows}` with `renderEmptyState` returning `<div className={classes.empty}>{emptyState}</div>` when `emptyState` is given, otherwise nothing. Each `Row` has `id={getRowId(row)}`, `columns={columns}`, `dependencies={[columns]}`, `className={classes.row}`.
  - Cell content: `column.render ? column.render(row) : defaultText(row[column.id])`. `defaultText`: `null`/`undefined` becomes `""`, `Date` becomes `toLocaleDateString()`, everything else `String(value)`. The row-header cell gets `classes.rowHeaderCell` besides `classes.cell`; `align: "end"` cells add `classes.alignEnd`.
  - `columns=[]` renders only the wrapper and an empty table, and does not throw.

- [ ] **Step 1: Write the failing tests** (sentinel classes: `const c = { wrapper: "w", table: "t", header: "h", column: "col", columnSorted: "cs", sortIcon: "si", body: "b", row: "r", rowActionable: "ra", cell: "cell", rowHeaderCell: "rh", alignEnd: "end", empty: "e" }`; fixture `rows = [{ slug: "a", name: "Aurora", users: 12, shipped: new Date("2026-01-02") }, …3 rows]`)
  - `renders a named grid with headers and cells`: `getByRole("grid", { name: "Projects" })`, `getAllByRole("columnheader")` names equal the labels, `getAllByRole("row")` length is rows + 1, `getByRole("gridcell", { name: "12" })`.
  - `the first column is the row header by default`: `getAllByRole("rowheader")` has one per row, text "Aurora".
  - `an explicit isRowHeader wins and only the first flagged one counts`: columns flag `users` and `shipped`; `rowheader` cells contain the `users` values only.
  - `align end adds the end class to header and cells`: `users` column header and its cells have class `end`; the `name` column's do not.
  - `render overrides the field and null renders empty`: a `render: (r) => <b>{r.name}!</b>` column shows "Aurora!"; a row with `users: null` yields a cell with empty text and no "null".
  - `Date fields render as a locale date`: the `shipped` cell text equals `new Date("2026-01-02").toLocaleDateString()`.
  - `shows emptyState and keeps the headers when there are no rows`: `rows={[]}` `emptyState="No projects yet"`; text present and `columnheader`s still rendered.
  - `columns=[] does not throw`.
  - `className and ref land on the wrapper`: `className="mt-4"` plus `createRef<HTMLDivElement>()`; `ref.current` has classes `w` and `mt-4` and contains the `grid`.
  - Type tests in the same file (run by `pnpm typecheck`): `// @ts-expect-error` on a `<TableBase>` without any `aria-label` or `aria-labelledby`.

- [ ] **Step 2: Run, confirm FAIL**

Run: `pnpm exec vitest run src/components/_base/Table/TableBase.test.tsx`
Expected: FAIL, `TableBase` not defined.

- [ ] **Step 3: Implement** `TableBase<T>` as specified. Cell dependencies: pass `dependencies={[columns]}` to `TableHeader` and every `Row` so `render` callbacks are not served from the collection cache.

- [ ] **Step 4: Run, confirm PASS**, then `pnpm typecheck`.

- [ ] **Step 5: Commit**: `feat(table): add TableBase with columns, row header and empty state`

---

## PR 2: sorting and row actions (Tasks 3 and 4, about 300 lines)

### Task 3: Sorting in `TableBase`

**Files:**
- Modify: `src/components/_base/Table/TableBase.tsx`, `src/components/_base/Table/TableBase.test.tsx`

**Interfaces:**
- Consumes: `sortRows`, `TableSortDescriptor`.
- Produces: `TableBaseOwnProps<T>` gains `sortDescriptor?: TableSortDescriptor`, `defaultSortDescriptor?: TableSortDescriptor`, `onSortChange?: (descriptor: TableSortDescriptor) => void`.
- Behaviour:
  - **Controlled** (`sortDescriptor` provided): the base **does not reorder** `rows` (the consumer owns the order); it only reflects the descriptor in `aria-sort`/`data-sort-direction` and reports presses through `onSortChange`.
  - **Uncontrolled:** holds `useState(defaultSortDescriptor)`, sorts locally with `sortRows` (memoised on `rows`, `columns`, descriptor), updates state on press and also calls `onSortChange`.
  - A column is sortable only when `allowsSorting` is true. The sort icon (`classes.sortIcon`, `aria-hidden`) shows `↑` ascending, `↓` descending and `↕` unsorted; the column gets `classes.columnSorted` when it is the sorted one.
  - A descriptor whose `column` is not in `columns` is treated as unsorted (rows in input order, no crash).
  - Descriptor columns arrive from React Aria as `Key`; convert with `String(...)` before calling `onSortChange`.

- [ ] **Step 1: Write the failing tests** (rows with `users: 12 | 3 | null`, columns with `allowsSorting` on `name` and `users`)
  - `sortable columns expose aria-sort and unsortable ones do not`: `name` and `users` headers have `aria-sort="none"`; a column without `allowsSorting` has no `aria-sort`.
  - `uncontrolled: clicking a header sorts ascending, then toggles descending, then ascending`: after click 1 the `users` header has `aria-sort="ascending"` and the `rowheader` order is by ascending `users` with the `null` row last; after click 2 `descending` with the `null` row **still last**; after click 3 `ascending`. (Documents deviation 3: no return to unsorted.)
  - `Enter on a focused sortable header sorts it`: `header.focus()` then `await userEvent.keyboard("{Enter}")` gives `aria-sort="ascending"`.
  - `defaultSortDescriptor sorts on first render`: `{ column: "name", direction: "descending" }` renders names in reverse `localeCompare` order and `name` is `aria-sort="descending"`.
  - `onSortChange is called with a string column and a direction`: `toHaveBeenCalledWith({ column: "users", direction: "ascending" })` after one click.
  - `controlled: rows keep the consumer's order and the descriptor drives aria-sort`: `sortDescriptor={{ column: "users", direction: "descending" }}` with rows given unsorted: DOM order equals the input order, `aria-sort="descending"` on `users`; clicking calls `onSortChange` and the header does **not** change by itself.
  - `a sortValue column sorts by the real value`: a status column with `render` returning a `<span>` and `sortValue` mapping `"high"` to 2 and `"low"` to 1 sorts by those numbers.
  - `new rows re-sort in place while sorted (uncontrolled)`: `rerender` with an extra row keeps the sorted order.
  - `a descriptor for an unknown column does not crash` (`defaultSortDescriptor={{ column: "gone" as any, … }}` through a cast): rows in input order.

- [ ] **Step 2: Run, confirm FAIL**

Run: `pnpm exec vitest run src/components/_base/Table/TableBase.test.tsx`
Expected: FAIL on the new tests; Task 2's tests still pass.

- [ ] **Step 3: Implement** the sorting props and sort-icon rendering in `TableBase.tsx`. Pass the effective descriptor to React Aria's `Table` as `sortDescriptor` and wire `onSortChange` to the state setter plus the callback.

- [ ] **Step 4: Run, confirm PASS**, then `pnpm typecheck`.

- [ ] **Step 5: Commit**: `feat(table): add controlled and uncontrolled sorting to TableBase`

---

### Task 4: Row links and row actions

**Files:**
- Modify: `src/components/_base/Table/TableBase.tsx`, `src/components/_base/Table/TableBase.test.tsx`

**Interfaces:**
- Produces:
  - `type TableRowActions<T> = { getRowHref?: (row: T) => string; onRowAction?: never } | { onRowAction?: (row: T) => void; getRowHref?: never }`.
  - `TableBaseProps<T> = TableBaseOwnProps<T> & TableLabelProps & TableRowActions<T>`; `TableSkinProps<T>` gains the same `& TableRowActions<T>`.
- Behaviour:
  - `getRowHref` sets `href` on each `Row`. `onRowAction` is passed to React Aria's `Table` as `onRowAction={(key) => …}` and the base resolves the row from `rows` by `getRowId(row) === String(key)` before calling the consumer.
  - A row is "actionable" when either prop is present; actionable rows add `classes.rowActionable` to `classes.row` (via a `className` function or `cn`). Plain rows never get it.
  - No `selectionMode`: no checkboxes (spec §6.4).

- [ ] **Step 1: Write the failing tests**
  - `clicking a row calls onRowAction with the row object`: `toHaveBeenCalledWith(rows[1])`; `Enter` on a focused row calls it too.
  - `onRowAction is not called for a row id that no longer exists` (resolves to nothing, no crash): rerender with fewer rows, no throw.
  - `getRowHref navigates through the router`: wrap in `<RouterProvider navigate={navigate}>` from `react-aria-components`; clicking the row calls `navigate` with `"/p/aurora"`.
  - `only actionable rows carry rowActionable`: with `onRowAction` every `row` (excluding the header row) has class `ra`; without either prop none do.
  - `no selection checkboxes are rendered`: `queryAllByRole("checkbox")` is empty.
  - Type tests: `// @ts-expect-error` on a table passing both `getRowHref` and `onRowAction`.

- [ ] **Step 2: Run, confirm FAIL**

Run: `pnpm exec vitest run src/components/_base/Table/TableBase.test.tsx`
Expected: FAIL on the new tests.

- [ ] **Step 3: Implement** the union types and wiring in `TableBase.tsx`.

- [ ] **Step 4: Run, confirm PASS**, then `pnpm typecheck`.

- [ ] **Step 5: Commit**: `feat(table): add row links and row actions to TableBase`

---

## PR 3: Playful and Soft skins (Tasks 5 and 6, about 380 lines)

### Task 5: `TablePlayful`

**Files:**
- Create: `src/lib/tableClasses.ts`, `src/components/playful/TablePlayful/{TablePlayful.tsx, TablePlayful.test.tsx, TablePlayful.stories.tsx, index.ts}`
- Modify: `src/lib/styles.ts`, `src/lib/styles.test.ts`, `src/lib/palette.test.ts`, `src/components/playful/focusRing.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `TableBase`, `TableSkinProps`, `TableBaseClasses` (Tasks 1 to 4).
- Produces:
  - `styles.ts`: `TABLE_RAC_FOCUS = "outline-hidden data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:-outline-offset-2 data-[focus-visible]:outline-bh-ink"` (negative offset keeps the ring inside the scroll wrapper; shared by the three skins).
  - `tableClasses.ts`: `TABLE_PLAYFUL_CLASSES: TableBaseClasses`:
    - `wrapper`: `overflow-x-auto border-2 border-bh-ink bg-bh-paper-white shadow-bh-hard`
    - `table`: `w-full border-collapse font-bh-body text-sm text-bh-ink`
    - `column`: `bg-bh-yellow border-b-2 border-bh-ink px-4 py-3 text-start font-bh-display text-xs font-black uppercase tracking-[0.1em] text-bh-ink` + `TABLE_RAC_FOCUS`; `columnSorted: ""`; `sortIcon: "ml-2"`
    - `row`: `border-b-2 border-bh-ink last:border-b-0` + `TABLE_RAC_FOCUS`; `rowActionable`: `cursor-pointer data-[hovered]:bg-bh-paper`
    - `cell`: `px-4 py-3` + `TABLE_RAC_FOCUS`; `rowHeaderCell`: `font-bh-display font-black`; `alignEnd`: `text-end tabular-nums`
    - `header: ""`, `body: ""`, `empty: "p-6 text-center font-bh-body"`
  - `TablePlayfulProps<T> = TableSkinProps<T>`; `TablePlayful<T>(props)` passes the map to the base. No colour prop in `0.6` (spec lists none for Table).
  - Exports `TablePlayful`, `type TablePlayfulProps` from `src/index.ts` under `// Playful look`.

- [ ] **Step 1: Write the failing tests**
  - `styles.test.ts`: `TABLE_RAC_FOCUS` contains `data-[focus-visible]:outline-solid` and `-outline-offset-2`.
  - `palette.test.ts` (reuse `contrast`, `HEX`): `ink on yellow header` and `ink on paper hover row` are at least 4.5:1; a `paper-white` literal `#FFFFFF` with `HEX.ink` is at least 4.5:1.
  - `TablePlayful.test.tsx`:
    - `is a named grid with sortable headers`: `getByRole("grid", { name: "Projects" })`; clicking a sortable header sets `aria-sort`.
    - `has the Playful frame, yellow header and 2px rules`: wrapper `toHaveClass("border-2", "border-bh-ink", "shadow-bh-hard", "overflow-x-auto")`; column header `toHaveClass("bg-bh-yellow")`; a body row `toHaveClass("border-b-2")`.
    - `numeric columns use tabular numerals`: an `align: "end"` cell has `tabular-nums`.
    - `a status render cell using TagPlayful with a 2px border renders as a pill` (compose `<TagPlayful className="border-2 border-bh-ink">Live</TagPlayful>` in `render`): text visible, and column sorts by `sortValue`.
    - `className and ref land on the wrapper`.
  - `playful/focusRing.test.tsx`: add `it("TablePlayful keeps a visible focus ring on columns, rows and cells")` asserting `killsFocusRing` is `false` for every `columnheader`, `row` and `gridcell` (the helper already exists in that file).

- [ ] **Step 2: Run, confirm FAIL**

Run: `pnpm exec vitest run src/lib src/components/playful/TablePlayful src/components/playful/focusRing.test.tsx`
Expected: FAIL, modules and exports missing.

- [ ] **Step 3: Implement** the shared string, the class map, the skin, its story file (`Default`, `Sortable` with `defaultSortDescriptor`, `StatusPills`, `RowLinks`, `Empty`, `NarrowScroll` with a 360px decorator) and the export. All stories use a generic `Project` row type defined in the story.

- [ ] **Step 4: Run, confirm PASS** (same command), then `pnpm typecheck`.

- [ ] **Step 5: Commit**: `feat(table): add TablePlayful`

---

### Task 6: `TableSoft`

**Files:**
- Create: `src/components/soft/TableSoft/{TableSoft.tsx, TableSoft.test.tsx, TableSoft.stories.tsx, index.ts}`
- Modify: `src/lib/tableClasses.ts`, `src/lib/palette.test.ts`, `src/components/soft/focusRing.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: as Task 5, plus `TABLE_RAC_FOCUS`.
- Produces:
  - `TABLE_SOFT_CLASSES: TableBaseClasses`:
    - `wrapper`: `overflow-x-auto rounded-bh-soft bg-bh-sand p-2`
    - `table`: `w-full border-collapse font-bh-body text-sm text-bh-ink`
    - `column`: `px-4 py-3 text-start font-bh-display text-sm font-normal text-bh-charcoal` + `TABLE_RAC_FOCUS`; `columnSorted: "text-bh-ink"`; `sortIcon: "ml-2"`
    - `row`: `odd:bg-bh-paper/50` + `TABLE_RAC_FOCUS` (no rules, so no `border-*` on rows); `rowActionable`: `cursor-pointer data-[hovered]:bg-bh-paper/80`
    - `cell`: `px-4 py-3` + `TABLE_RAC_FOCUS`; `rowHeaderCell`: `font-bh-display`; `alignEnd`: `text-end tabular-nums`
    - `header: ""`, `body: ""`, `empty: "p-6 text-center font-bh-body"`
  - `TableSoftProps<T> = TableSkinProps<T>`; no `tone` prop (status tone dots come from consumer `render`, per §6.1).
  - Exports `TableSoft`, `type TableSoftProps` under `// Soft look`.
- Contrast note: the "lightened" row is `paper` at 50% over `sand`; its luminance sits between two backgrounds that both carry `ink` text at AA, so `ink` text stays AA on it.

- [ ] **Step 1: Write the failing tests**
  - `palette.test.ts`: `ink on sand` at least 4.5:1; `charcoal (SOFT_HEX.neutral) on sand` at least 4.5:1 (header text); `ink on paper` at least 4.5:1.
  - `TableSoft.test.tsx`:
    - `is a named grid whose header click sorts`.
    - `sits on a sand panel with soft radius`: wrapper `toHaveClass("bg-bh-sand", "rounded-bh-soft", "overflow-x-auto")`.
    - `has no rules`: no element in the table has a class matching `/(^|:)(border|divide)(-[xytrbl])?(-\d+)?$/` or `border-bh-*` (collect tokens the way `swiss/lookRules.test.tsx` does).
    - `alternate rows are lightened`: a body row `toHaveClass("odd:bg-bh-paper/50")`.
    - `a tone-dot status cell renders dot and word` (compose a coloured dot `<span aria-hidden className="size-2 rounded-full bg-bh-blue" />` plus `Live` in `render`): the word is in the accessible name of the cell; the dot is `aria-hidden`.
    - `className and ref land on the wrapper`.
  - `soft/focusRing.test.tsx`: add a Table focus-ring test identical in shape to Task 5's.

- [ ] **Step 2: Run, confirm FAIL**

Run: `pnpm exec vitest run src/lib/palette.test.ts src/components/soft/TableSoft src/components/soft/focusRing.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement** the class map, skin, stories (`Default`, `Sortable`, `StatusDots`, `RowActions`, `Empty`) and export.

- [ ] **Step 4: Run, confirm PASS** (same command), then `pnpm typecheck`.

- [ ] **Step 5: Commit**: `feat(table): add TableSoft`

---

## PR 4: Swiss skin (Task 7, about 230 lines)

### Task 7: `TableSwiss`

**Files:**
- Create: `src/components/swiss/TableSwiss/{TableSwiss.tsx, TableSwiss.test.tsx, TableSwiss.stories.tsx, index.ts}`
- Modify: `src/lib/tableClasses.ts`, `src/lib/palette.test.ts`, `src/components/swiss/focusRing.test.tsx`, `src/components/swiss/lookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: as Task 5, plus `SWISS_LABEL`, `SWISS_MOTION`, `SWISS_DISPLAY` from `styles.ts`.
- Produces:
  - `TABLE_SWISS_CLASSES: TableBaseClasses`:
    - `wrapper`: `overflow-x-auto bg-transparent` (no outer frame)
    - `table`: `w-full border-collapse font-bh-grotesk text-sm font-normal text-bh-ink`
    - `column`: `border-b border-bh-ink px-4 pt-3 pb-2 text-start text-bh-muted-text` + `SWISS_LABEL` + `SWISS_MOTION` + `TABLE_RAC_FOCUS`; `columnSorted: "text-bh-ink"`; `sortIcon: "ml-2"`
    - `row`: `border-b border-bh-rule` + `TABLE_RAC_FOCUS`; `rowActionable`: `cursor-pointer data-[hovered]:bg-bh-rule/50`
    - `cell`: `px-4 py-3` + `TABLE_RAC_FOCUS`; `rowHeaderCell: ""`; `alignEnd`: `text-end tabular-nums`
    - `header: ""`, `body: ""`, `empty: "p-6 text-center text-bh-muted-text"`
  - `TableSwissProps<T> = TableSkinProps<T>`; no colour prop. The single `bh-accent` is not used by the Table (status emphasis is `muted-text` to `ink`).
  - Exports `TableSwiss`, `type TableSwissProps` under `// Swiss look`.

- [ ] **Step 1: Write the failing tests**
  - `palette.test.ts`: `SWISS_HEX.mutedText on white` and `ink on white` at least 4.5:1 (header, cells); document that `rule` is decorative (row rules are hairlines, content stays readable without them).
  - `TableSwiss.test.tsx`:
    - `is a named grid whose header click sorts` and `the sorted header turns ink` (`columnheader` has `text-bh-ink` after sorting, and the sort icon shows `↑`).
    - `has no outer frame`: wrapper has no `border` token and no `shadow-*`.
    - `has a 1px ink header rule and 1px rule row rules`: column `toHaveClass("border-b", "border-bh-ink")`; body row `toHaveClass("border-b", "border-bh-rule")`.
    - `numeric columns are end-aligned with tabular numerals`.
    - `a plain-text status cell moves muted-text to ink` (consumer `render` returning `<span className="text-bh-muted-text">` for "Draft" and `text-bh-ink` for "Live"; the table does not alter them).
    - `className and ref land on the wrapper`.
  - `swiss/focusRing.test.tsx`: add the Table focus-ring test.
  - `swiss/lookRules.test.tsx`: add `["TableSwiss", <TableSwiss aria-label="Projects" columns={…} rows={…} getRowId={…} />]` (two columns, one `align: "end"`, `allowsSorting` on one, `onRowAction` set so `rowActionable` is covered). The forbidden-token regex must stay unchanged and green.

- [ ] **Step 2: Run, confirm FAIL**

Run: `pnpm exec vitest run src/lib/palette.test.ts src/components/swiss/TableSwiss src/components/swiss/focusRing.test.tsx src/components/swiss/lookRules.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement** the class map, skin, stories (`Default`, `Sortable`, `PlainStatus`, `RowLinks`, `Empty`, `NarrowScroll`) and export. Stories set `parameters.backgrounds.default: "white"`.

- [ ] **Step 4: Run, confirm PASS** (same command), then `pnpm typecheck`.

- [ ] **Step 5: Commit**: `feat(table): add TableSwiss`

---

## PR 5: overview stories and release (Tasks 8 and 9, about 150 lines)

### Task 8: Overview stories gain a Data section

**Files:**
- Modify: `src/components/playful/PlayfulOverview.stories.tsx`, `src/components/soft/SoftOverview.stories.tsx`, `src/components/swiss/SwissOverview.stories.tsx`

**Interfaces:**
- Consumes: the three skins; `TagPlayful` (with `className="border-2 border-bh-ink"`), a Soft tone-dot span, plain `muted-text`/`ink` text for the status column; if `0.5` already added a dashboard composition to an overview, put the table inside it.

- [ ] **Step 1: Write the failing check.** Stories have no unit tests, so the check is a grep that the section is missing.

- [ ] **Step 2: Run it**: `grep -c "Table" src/components/playful/PlayfulOverview.stories.tsx src/components/soft/SoftOverview.stories.tsx src/components/swiss/SwissOverview.stories.tsx`. Expected: `:0` for each file.

- [ ] **Step 3: Implement.** Each overview gets a `Data` section (Playful and Soft use their own section helper; Swiss uses the `border-t border-bh-rule` one) with one table: columns `name` (row header, sortable), `status` (`render` through the look's status treatment, `sortValue` mapping status to a number), `users` (`align: "end"`, sortable), `shipped` (`Date`, sortable). Four rows, one with `users: null` to show missing-last. `aria-label="Projects"`. The full dashboard composition is completed by the `0.7` plan (deviation 6).

- [ ] **Step 4: Verify.** `pnpm typecheck`, then `pnpm smoke:storybook` (builds Storybook, checks classes). Expected: pass. The a11y addon (`test: "error"`) reports no violations on `*/Overview`; if axe flags a scrollable region without a focusable child on the narrow viewport, give the wrapper `tabIndex={0}` plus a role-region name in the base and add a base test for it, then re-run.

- [ ] **Step 5: Commit**: `docs(storybook): add table to the look overviews`

---

### Task 9: Release 0.6.0

**Files:**
- Modify: `package.json` (`version: "0.6.0"`), `src/index.ts` (`VERSION = "0.6.0"`, plus the type exports below), `src/smoke.test.ts`, `README.md`

**Interfaces:**
- Produces in `src/index.ts`: `export type { TableColumn, TableSortDescriptor } from "./components/_base/Table/tableTypes.js"`. This is the **only** `_base` path exported, and only types (spec §6.9). The three skins were exported in Tasks 5 to 7.

- [ ] **Step 1: Write the failing tests** in `src/smoke.test.ts`. Change the existing `expect(lib.VERSION).toBe("0.5.0")` to `"0.6.0"` (the sanctioned edit, as in the 0.4.0 release commit `3ba4d81`) and add:

```ts
it.each(["Playful", "Soft", "Swiss"])("exports Table%s", (look) => {
  expect(typeof (lib as Record<string, unknown>)[`Table${look}`]).toBe("function");
});
it("does not export the Table base or the sort helpers", () => {
  expect(lib).not.toHaveProperty("TableBase");
  expect(lib).not.toHaveProperty("sortRows");
});
it("exposes the Table column type", () => {
  const column: lib.TableColumn<{ name: string }> = { id: "name", label: "Name", allowsSorting: true };
  const sort: lib.TableSortDescriptor = { column: "name", direction: "ascending" };
  expect([column.id, sort.direction]).toEqual(["name", "ascending"]);
});
```

- [ ] **Step 2: Run, confirm FAIL**

Run: `pnpm exec vitest run src/smoke.test.ts`
Expected: FAIL on the version and the missing type exports (`pnpm typecheck` also fails on `lib.TableColumn`).

- [ ] **Step 3: Implement the release changes** (mirrors `3ba4d81`):
  - Bump `package.json` and `VERSION`; add the type export.
  - **README:** add three rows to the Components table, one per look (`TablePlayful`: framed table with a yellow header and hard shadow; `TableSoft`: tonal rows on a sand panel; `TableSwiss`: hairline table with tabular numerals). Add a short "Table" section after the look sections: `columns` / `rows` / `getRowId`, `TableColumn` fields (`render`, `sortValue`, `align`, `isRowHeader`, `allowsSorting`), sorting (controlled `sortDescriptor` + `onSortChange`, or uncontrolled `defaultSortDescriptor`; missing values always last; sorting toggles ascending/descending), `getRowHref` or `onRowAction` (not both), required `aria-label`, horizontal scroll inside the wrapper, and that status cells go through `render` using Tag/Chip or plain text.

- [ ] **Step 4: Full gate.** Run: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`
Expected: all pass; no `Table*` story reports an a11y violation.

- [ ] **Step 5: Commit**: `chore(release): 0.6.0`

---

## Self-review

- **Spec coverage:** §6.4 (columns, `render`, sorting controlled/uncontrolled, `sortValue`, nulls last, `Date`/`localeCompare`, row `href` xor `onRowAction`, labels, row header, numeric alignment, no selection, scroll wrapper, status cells) maps to Tasks 1 to 4 and the skins; §6.1 Table and status-cell rows map to Tasks 5 to 7 and the Task 8 stories; §6.6 structure to the file map; §6.7 (sort cycles and `aria-sort`, row header, empty state, skin tests, palette pairings, Storybook per look and overview) to Tasks 2 to 8; §6.8 to `tableClasses.ts`; §6.9 to Tasks 5 to 7 and 9; §8 `0.6` to the whole plan.
- **Type consistency:** `TableColumn`, `SortValue`, `TableSortDescriptor` and `TableBaseClasses` are defined in Task 1 and used unchanged; `TableSkinProps` grows in Tasks 3 and 4 (props added to `TableBaseOwnProps`, `TableRowActions` joined) and every skin aliases it, so skins never need edits.
- **Proportion:** the plan states signatures, class maps (the look contract), test names and assertions; component bodies are left to the implementer.
