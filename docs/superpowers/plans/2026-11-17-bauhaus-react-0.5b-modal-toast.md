# bauhaus-react 0.5b: Modal and Toast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `0.5.0` by adding `Modal` and `Toast` in all three looks (3 Modal skins, 3 `ToastRegion` skins, the `toast` API and `createToastQueue`) on top of the form inputs delivered by the separate 0.5a plan.

**Architecture:** Two internal bases, `ModalBase` and `ToastBase`, under `src/components/_base/`. Each look is a thin skin that owns static class maps (pulled from one new file, `src/lib/overlays.ts`, per spec §6.8) and its colour prop. All `UNSTABLE_Toast*` React Aria imports live in `src/lib/toast.ts` and `ToastBase`, so upstream renames stay internal. The public `toast` API and `createToastQueue` never expose React Aria types.

**Tech Stack:** React 19.3, TypeScript 7, Tailwind CSS 4.3, Vite 8 lib mode, Vitest 5 + jsdom + Testing Library + user-event, Storybook 10, `react-aria-components` 1.22.1, pnpm. **No new dependency.**

**Spec:** `docs/superpowers/specs/2026-11-17-bauhaus-react-forms-overlays-data-design.md` (source of truth: §3, §6.1, §6.3, §6.6 to §6.9, §8). Also `docs/superpowers/specs/2026-11-16-bauhaus-react-full-catalogue-design.md` (§6.1 look rules, §6.5 base + skin, §6.7 testing). Structural model: `docs/superpowers/plans/2026-11-16-bauhaus-react-0.4.md`.

**Runs after:** the 0.5a forms plan. This plan touches `src/index.ts`, `README.md`, `src/smoke.test.ts` and `package.json` only in append-style hunks (new export lines, new README rows, the version bump in Task 12). If 0.5a left those files in a different shape, adapt the hunk, not the intent.

## Verified against React Aria 1.22.1 (installed)

- Exports from `react-aria-components`: `UNSTABLE_ToastQueue`, `UNSTABLE_ToastRegion`, `UNSTABLE_ToastList`, `UNSTABLE_Toast`, `UNSTABLE_ToastContent`, `UNSTABLE_ToastStateContext`; `Text`, `Button` (with `slot="title"`, `slot="description"`, `slot="close"` inside a Toast); types `ToastOptions` (`onClose`, `timeout`), `QueuedToast`.
- `new UNSTABLE_ToastQueue({ maxVisibleToasts })`: the class default is **Infinity**, so the 3-visible cap is not free. There is no default timeout (a toast without `timeout` never closes).
- `UNSTABLE_ToastRegion` requires a `queue` prop, renders **`null` while no toast is visible**, and portals into `document.body`. It has `role="region"` with the default name "Notifications". Each `UNSTABLE_Toast` is `role="alertdialog"` named by its `slot="title"` text; its content wrapper has `role="alert"`; its close button already has `aria-label="Close"`.
- `Pressable` is exported and `Children.only` clones the child with press props and a merged ref. A native `<button>` is valid. The `Button*` skins spread rest props (including `ref`) onto `ButtonBase`'s `<button>`, so they qualify.
- `ModalOverlay` / `Modal` / `Dialog` / `Heading slot="title"` and `DialogTrigger` are used the same way as in `MenuOverlayBase`. `ModalOverlay` accepts `isDismissable`.

## Global Constraints

Copied from spec §3 and §6.1; every task inherits them.

- Baseline release `0.4.0`. `SoftTone`, `bh-accent`, `SWISS_LABEL`, `SWISS_RAC_FOCUS` and `FOCUS_RING` exist and are reused.
- Everything in catalogue §3 still applies: static class literals only (`pnpm smoke` fails on `bh-${`), `preserveModules`, single `"."` barrel plus `./theme.css`, `bh-` token namespace, Strict TDD, `"use client"` on any file using React Aria, state or effects.
- **No new runtime dependency.** `_base` is never exported.
- Toast is `UNSTABLE_` in React Aria 1.22.1; it is wrapped inside `ToastBase` / `src/lib/toast.ts`.
- Colours flow through shared class maps in `src/lib/`; no hex values in components.
- **Modal panel:** Playful `paper`, 2px border, `shadow-bh-hard-lg`; Soft `paper`, `rounded-bh-soft`; Swiss `paper-white`, 2px `ink` top rule.
- **Modal scrim:** solid `ink` at 60% (Playful), solid `charcoal` at 60% (Soft), solid `ink` at 40% (Swiss). **No blurred backdrops.**
- **Toast:** Playful solid fill (`color`, default `blue`), 2px border, hard shadow, uppercase; Soft `charcoal` pill, `paper` text, tone dot; Swiss `paper-white`, 2px `ink` top rule, action as underlined text.
- **Motion:** 150ms ease-out, modal and toast enter with a short drop (Playful); 150-250ms slides/fades (Soft); 150-250ms wipes, no kinetic decoration (Swiss). Every motion is `motion-safe:`.
- Shared by every look: `FOCUS_RING` / `SWISS_RAC_FOCUS`, disabled at 50% with `cursor-not-allowed`, yellow never a text colour.
- Non-text contrast (1.4.11): any meaningful mark, border or state reaches 3:1 against its neighbour, or is outlined in `ink`, or is labelled directly.
- WCAG 2.2.1: a toast with an `action` never auto-dismisses. Default timeout 5000ms. At most 3 visible; older ones queue. Default placement `bottom-end`; also `bottom`, `top-end`, `top`.
- Modal props: `title` (required, the dialog heading), `children`, `footer?`, `trigger?`, `isOpen` / `defaultOpen` / `onOpenChange`, `isDismissable` (default `true`), `role` (`"dialog"` default, `"alertdialog"`), `size` (`sm` / `md` / `lg`). `alertdialog` is never dismissable by clicking the scrim.
- Public API: `index.ts` exports every new skin, `toast`, `createToastQueue`, and the type `ToastOptions`. `_base` is never exported.
- Persona/copy rules: all code, comments, stories and UI strings in English.

**Process**
- Strict TDD: failing test, run (expect FAIL), implement, run (expect PASS), commit.
- Commits: conventional commits, **no AI attribution, no Co-Authored-By lines**.
- Tests check behaviour, not classes, except where this plan states a class assertion.
- Every existing test passes unchanged, except the one sanctioned edit in Task 12 (the version string).

**Test commands**
- One file: `pnpm exec vitest run <path>`
- Full gate: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`

## Plan's calls and spec deviations (author to confirm while reading)

1. **Spec addition: `children` and `footer` may be a render function** `(api: { close: () => void }) => ReactNode`. Without it an uncontrolled Modal (trigger only) cannot offer a Cancel/OK button that closes it, because the library's `Button*` skins are native buttons and cannot use React Aria's `slot="close"`.
2. **Spec addition: type `ToastQueueHandle` is exported** next to `ToastOptions`. The region's `queue` prop and the return type of `createToastQueue()` need a public name. It is an opaque callable `((options: ToastOptions) => string) & { close(id: string): void }`; the React Aria queue is hidden behind a module-private `WeakMap`.
3. **`maxVisibleToasts: 3` and the 5000ms default are ours to set.** React Aria's queue defaults to unlimited and no timeout (see "Verified" above). `toast()` ignores a consumer `timeout` when an `action` is present (WCAG 2.2.1).
4. **Pressing a toast action calls `onAction`, then closes the toast** (spec is silent). Otherwise an action toast, which never times out, would stay until the user hits the close button.
5. **Modal `className` and `ref` go to the dialog panel**, not the trigger (`MenuOverlayBase` puts them on the trigger because it owns the trigger; here the trigger is the consumer's element).
6. **Trigger strategy:** `Pressable` works with the native-button skins, so the plan uses it. The controlled API stays available. Task 2's tests are the proof; if the `Button*` trigger test fails, the documented fallback is to hold open state in the base and attach `onClick` via `cloneElement`.
7. **Swiss modal uses a 2px top rule (`border-t-2`)** as spec §6.1 says, although the 0.4 plan's Swiss look rules forbid `border-2`. The new overlay look-rules test (Task 3) carries its own allow-list; the 0.4 `lookRules` files are not touched.
8. **Soft toast tone dot can fall below 3:1 on `charcoal`** (blue is about 1.6:1). It is therefore `aria-hidden` decoration; the title text carries the meaning ("labelled directly", §6.1). Pinned in Task 9.
9. **Focus rings on dark toast surfaces:** a Soft toast's inner controls sit on `charcoal` (the `ink` ring is about 1.9:1 there), so they get a `paper` ring; the toast root sits on the page and keeps `ink`. Playful inner controls use `currentColor` so they always match `TEXT_ON` for the chosen `color`.
10. **Motion uses CSS transitions on React Aria's `data-entering` / `data-exiting`**, so no `theme.css` keyframes or `cn` animate tokens are added. Swiss wipes use `clip-path`, not translate.

## Review Focus

1. **Long Modal content on a short viewport:** body scrolls inside the panel; header and footer stay put (Task 2 class assertions, `LongContent` stories).
2. **Focus ring invisible on dark toast surfaces** (Soft `charcoal`, Playful `ink` / `navy` / `blue`): Tasks 8 and 9 assert the ring colour classes and contrast.
3. **Action toasts stall the queue:** three action toasts fill the 3 visible slots and never time out; the close button must work and reveal the next one (Task 7).
4. **Toast added before any region mounts, and two regions on separate queues:** the early toast appears on mount; each region shows only its own queue (Task 7).
5. **Disabled trigger and unknown ids:** a disabled trigger cannot open the modal (Task 2); `toast.close("nope")` is a no-op, not a throw (Task 6).

---

## File map

```txt
src/lib/overlays.ts, overlays.test.ts                    C  MODAL_CLASSES, TOAST_CLASSES + contrast tests (Task 1)
src/lib/toast.ts, toast.test.ts                          C  toast, createToastQueue, ToastOptions, ToastQueueHandle (Task 6)
src/components/_base/Modal/ModalBase.{tsx,test.tsx}      C  (Task 2)
src/components/_base/Toast/ToastBase.{tsx,test.tsx}      C  (Task 7)
src/components/{playful,soft,swiss}/Modal<Look>/*        C  3 skins (Tasks 3-5)
src/components/{playful,soft,swiss}/ToastRegion<Look>/*  C  3 skins (Tasks 8-10)
src/components/overlayLookRules.test.tsx                 C  (Task 3, extended by 4, 5, 8, 9, 10)
src/components/OverlaysOverview.stories.tsx              C  (Task 11)
src/index.ts, src/smoke.test.ts, package.json, README.md M  (each skin task / Task 12)
```

No existing base, skin or token file changes. Task order: shared maps, Modal base, Modal skins, toast API, Toast base, Toast skins, overview, release.

## PR slices (chained, each near or under 400 changed lines)

| PR | Tasks | Boundary and rollback |
|---|---|---|
| 1 | 1, 2 | Class maps + `ModalBase`. Nothing public yet; revert is clean. |
| 2 | 3, 4, 5 | Three Modal skins with exports. If the diff passes about 450 lines, move Task 5 to its own PR. |
| 3 | 6, 7 | `toast` API + `ToastBase`. Still no public skin; exports of `toast` land in Task 6. |
| 4 | 8, 9, 10 | Three ToastRegion skins with exports. If over 450 lines, move Task 10 out. |
| 5 | 11, 12 | Overview stories + `0.5.0` release. |

Chain strategy (`stacked-to-main` or `feature-branch-chain`) is chosen at execution time. PR 1 targets the last 0.5a branch (or `main` once 0.5a is merged).

---

### Task 1: Overlay class maps and palette checks

**Files:**
- Create: `src/lib/overlays.ts`, `src/lib/overlays.test.ts`

**Interfaces:**
- Consumes: `HEX`, `TEXT_ON`, `SOFT_HEX`, `SWISS_HEX`, `contrast` helper pattern from `src/lib/palette.test.ts` (copy the local helper if it is not exported).
- Produces (not exported from `index.ts`), all values static literals:
  - `type OverlayLook = "playful" | "soft" | "swiss"`
  - `MODAL_CLASSES: Record<OverlayLook, { scrim: string; panel: string; header: string; title: string; body: string; footer: string; motion: string }>`
    - `playful.scrim = "bg-bh-ink/60"`, `soft.scrim = "bg-bh-charcoal/60"`, `swiss.scrim = "bg-bh-ink/40"`
    - `playful.panel = "bg-bh-paper text-bh-ink border-2 border-bh-ink shadow-bh-hard-lg"`; `soft.panel = "bg-bh-paper text-bh-ink rounded-bh-soft"`; `swiss.panel = "bg-bh-paper-white text-bh-ink border-t-2 border-bh-ink"`
    - `title`: Playful `font-bh-display font-black uppercase text-2xl`; Soft `font-bh-display font-light text-2xl`; Swiss `SWISS_DISPLAY text-3xl`. `header`/`body`/`footer`: padding and (Playful only) `border-b-2` / `border-t-2` `border-bh-ink`, Swiss 1px `border-bh-rule`, Soft none.
    - `motion`: Playful `motion-safe:transition-[opacity,translate] motion-safe:duration-150 motion-safe:ease-out motion-safe:data-[entering]:-translate-y-3 motion-safe:data-[entering]:opacity-0 motion-safe:data-[exiting]:opacity-0`; Soft `motion-safe:transition-[opacity,translate] motion-safe:duration-200 motion-safe:ease-out motion-safe:data-[entering]:translate-y-2 motion-safe:data-[entering]:opacity-0 motion-safe:data-[exiting]:opacity-0`; Swiss `motion-safe:transition-[clip-path,opacity] motion-safe:duration-200 motion-safe:ease-out motion-safe:data-[entering]:[clip-path:inset(0_0_100%_0)] motion-safe:data-[exiting]:opacity-0`.
  - `TOAST_CLASSES: Record<OverlayLook, { toast: string; content: string; title: string; description: string; action: string; close: string; motion: string }>` with the spec §6.1 surfaces:
    - Playful `toast = "border-2 border-bh-ink shadow-bh-hard uppercase font-bh-display font-black"` (fill comes from `FILL_CLASSES[color]` in the skin); inner controls `action`/`close` use `data-[focus-visible]:outline-current` (call 9).
    - Soft `toast = "rounded-full bg-bh-charcoal text-bh-paper"`; inner controls `data-[focus-visible]:outline-bh-paper`; toast root focus ring stays `ink` (applied in the skin with `SWISS`-style `data-[focus-visible]` classes).
    - Swiss `toast = "bg-bh-paper-white text-bh-ink border-t-2 border-bh-ink"`; `action` is underlined (`underline underline-offset-4 decoration-1`).
    - `motion` mirrors the modal motion per look.

- [ ] **Step 1: Write the failing tests** (`overlays.test.ts`)

```ts
it.each([
  ["modal ink on paper (Playful, Soft)", HEX.ink, HEX.paper],
  ["modal ink on paper-white (Swiss)", SWISS_HEX.ink, SWISS_HEX.white],
  ["soft toast paper on charcoal", HEX.paper, SOFT_HEX.neutral],
  ["swiss toast ink on paper-white", SWISS_HEX.ink, SWISS_HEX.white],
])("%s meets 4.5:1", (_n, text, bg) => expect(contrast(text, bg)).toBeGreaterThanOrEqual(4.5));
it.each(Object.keys(HEX) as FillColor[])("playful toast text on %s meets 4.5:1", (c) => {
  expect(contrast(HEX[TEXT_ON[c]], HEX[c])).toBeGreaterThanOrEqual(4.5);
});
it("1.4.11: borders and rings that carry meaning reach 3:1", () => {
  expect(contrast(HEX.ink, HEX.paper)).toBeGreaterThanOrEqual(3);          // playful panel border, soft toast root ring
  expect(contrast(HEX.paper, SOFT_HEX.neutral)).toBeGreaterThanOrEqual(3); // soft toast inner ring
  expect(contrast(HEX.ink, SOFT_HEX.neutral)).toBeLessThan(3);             // why the inner ring must not be ink
});
it("scrims are solid colours, never blurred", () => {
  for (const look of ["playful", "soft", "swiss"] as const) {
    expect(MODAL_CLASSES[look].scrim).toMatch(/^bg-bh-(ink|charcoal)\/(40|60)$/);
    expect(JSON.stringify(MODAL_CLASSES[look])).not.toMatch(/backdrop-blur/);
  }
});
it("every motion class is gated behind motion-safe", () => {
  for (const look of ["playful", "soft", "swiss"] as const)
    for (const m of [MODAL_CLASSES[look].motion, TOAST_CLASSES[look].motion])
      expect(m.split(" ").every((c) => c.startsWith("motion-safe:"))).toBe(true);
});
it("swiss maps use no fill colour other than paper-white, ink and rule", () => {
  expect(JSON.stringify(TOAST_CLASSES.swiss) + JSON.stringify(MODAL_CLASSES.swiss)).not.toMatch(/bh-(paper|sand|red|yellow|blue|navy|sky|pink|orange|charcoal)\b(?!-)/);
});
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/lib/overlays.test.ts` (module not found).
- [ ] **Step 3: Implement** `overlays.ts` with the exact values above (compose with `cn`, `SWISS_DISPLAY`, `SWISS_LABEL`, `FOCUS_RING` where noted; keep every class a literal).
- [ ] **Step 4: Run, confirm PASS.**
- [ ] **Step 5: Commit**: `feat(tokens): add modal and toast class maps with contrast checks`

---

### Task 2: `ModalBase`

**Files:**
- Create: `src/components/_base/Modal/ModalBase.tsx`, `src/components/_base/Modal/ModalBase.test.tsx`

**Interfaces:**
- Consumes: React Aria `DialogTrigger`, `ModalOverlay`, `Modal`, `Dialog`, `Heading`, `Pressable`; `cn`.
- Produces (`"use client"`):
  ```ts
  export type ModalSize = "sm" | "md" | "lg";
  export type ModalRenderApi = { close: () => void };
  export type ModalSlot = ReactNode | ((api: ModalRenderApi) => ReactNode);
  export type ModalBaseClasses = { overlay: string; modal: string; header: string; title: string; body: string; footer: string };
  export type ModalBaseProps = {
    title: string; children: ModalSlot; footer?: ModalSlot; trigger?: ReactElement;
    isOpen?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void;
    isDismissable?: boolean;            // default true
    role?: "dialog" | "alertdialog";    // default "dialog"
    size?: ModalSize;                   // default "md"
    className?: string;                 // merged last into the panel (`modal` slot)
    ref?: Ref<HTMLDivElement>;          // the panel
    classes: ModalBaseClasses;
  };
  export function ModalBase(props: ModalBaseProps): ReactElement
  ```
- Base owns structure: overlay `fixed inset-0 z-50 flex items-center justify-center p-4`; panel `flex max-h-full w-full flex-col` + size (`sm` `max-w-sm`, `md` `max-w-lg`, `lg` `max-w-2xl`); dialog `flex min-h-0 flex-1 flex-col outline-none`; header `shrink-0`; body `min-h-0 flex-1 overflow-y-auto`; footer `shrink-0`. Footer is not rendered when `footer` is undefined. `isDismissable` given to `ModalOverlay` is `role !== "alertdialog" && isDismissable`. With a `trigger`, it is wrapped as `<Pressable>{trigger}</Pressable>` inside `DialogTrigger`; without one, `ModalOverlay` is used standalone with `isOpen` / `defaultOpen` / `onOpenChange`.

- [ ] **Step 1: Write the failing tests** (`classes` stub: each slot a distinct token such as `"scrim"`, `"panel"`)

```tsx
it("opens a dialog named by title from a plain <button> trigger", async () => { /* getByRole("dialog",{name:"Edit profile"}) after click */ });
it("closes on Escape and returns focus to the trigger", async () => { /* waitFor(() => expect(trigger).toHaveFocus()) */ });
it("traps Tab focus inside the dialog", async () => { /* footer with 2 buttons; 6 Tab presses; dialog.contains(document.activeElement) every time */ });
it("scrim click closes a dismissable dialog", async () => { /* click `.scrim` */ });
it("isDismissable={false} ignores scrim clicks but Escape still closes", async () => {});
it("alertdialog is named by title, and scrim clicks never close it even with isDismissable", async () => {
  /* getByRole("alertdialog",{name:"Delete project?"}); click scrim; still present */
});
it("controlled isOpen: Escape calls onOpenChange(false) and the dialog stays until the parent flips it", async () => {});
it("works without a trigger (defaultOpen) and without a footer", () => { /* no element with class "footer" */ });
it("a render-function footer receives close() and closes the dialog (onOpenChange(false))", async () => {});
it("a disabled trigger cannot open the dialog", async () => { /* <button disabled> */ });
it("body scrolls, header and footer do not", () => {
  /* body has "overflow-y-auto" and "min-h-0"; header and footer have "shrink-0"; panel has "max-h-full" */
});
it("size maps to a max width and className and ref land on the panel", () => {
  /* size="sm" → "max-w-sm"; lg → "max-w-2xl"; default md → "max-w-lg"; className merged; createRef is the panel div */
});
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/_base/Modal` (module not found).
- [ ] **Step 3: Implement `ModalBase`** as specified. Heading is `<Heading slot="title" className={cn("...", classes.title)}>` inside `classes.header`.
- [ ] **Step 4: Run, confirm PASS.** If the Escape/scrim tests need pointer events jsdom lacks, use `fireEvent.pointerDown` + `pointerUp` on the scrim; do not weaken the assertion.
- [ ] **Step 5: Commit**: `feat(modal): add ModalBase on React Aria dialog`

*(End of PR 1.)*

---

### Task 3: `ModalPlayful` and the overlay look-rules test

**Files:**
- Create: `src/components/playful/ModalPlayful/{ModalPlayful.tsx, ModalPlayful.test.tsx, ModalPlayful.stories.tsx, index.ts}`, `src/components/overlayLookRules.test.tsx`
- Modify: `src/index.ts` (new `// Overlays` section after `// Swiss look`; add `export * from "./components/playful/ModalPlayful/index.js"`)

**Interfaces:**
- Consumes: `ModalBase`, `ModalBaseProps`; `MODAL_CLASSES.playful`; `ButtonPlayful` (tests, stories).
- Produces: `"use client"`; `ModalPlayfulProps = Omit<ModalBaseProps, "classes">`; `ModalPlayful(props)`. Playful has no colour prop on Modal (spec §6.1/§6.3 list none). Slots: `overlay = cn(MODAL_CLASSES.playful.scrim, MODAL_CLASSES.playful.motion)`, `modal = panel + motion`, `header/title/body/footer` from the map.
- `overlayLookRules.test.tsx`: `const cases: [string, ReactElement][]` rendered with `defaultOpen`; collects class tokens from `document.body` descendants (overlays portal, so `container` is not enough), stripping variant prefixes (`token.split(":").pop()`), and per look asserts offenders = []:
  - Playful: no `rounded` tokens except `rounded-none`, no `font-medium|semibold|bold` (black or normal only), no `backdrop-*`, no `text-bh-yellow`.
  - Soft: no `border*` tokens, no `shadow-bh-hard*`, no `backdrop-*`, no `text-bh-yellow`.
  - Swiss: no `shadow*`, no `translate`, no `rounded*`, no `backdrop-*`, `border-t-2` allowed only on the panel / toast (the one allowed 2px rule), no `bh-(red|yellow|blue|navy|sky|pink|orange|sand|paper|charcoal)` tokens, no `text-bh-accent`.

- [ ] **Step 1: Write the failing tests**

```tsx
it("opens from ButtonPlayful and returns focus to it on Escape", async () => {
  render(<ModalPlayful title="Edit" trigger={<ButtonPlayful>Open</ButtonPlayful>}>Body</ModalPlayful>);
  const trigger = screen.getByRole("button", { name: "Open" });
  await userEvent.click(trigger);
  expect(screen.getByRole("dialog", { name: "Edit" })).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  await waitFor(() => expect(trigger).toHaveFocus());
});
it("alertdialog role and footer actions", async () => { /* role="alertdialog" name "Delete?"; footer render fn Cancel button closes */ });
it("panel has the hard lg shadow, a 2px ink border and the paper fill", () => { /* defaultOpen; dialog.closest(".shadow-bh-hard-lg") has "border-2","border-bh-ink","bg-bh-paper" */ });
it("scrim is solid ink at 60% with no blur", () => { /* document.querySelector(".bg-bh-ink\\/60") not null; no [class*="backdrop-blur"] */ });
it("forwards className and ref to the panel", () => {});
```
`overlayLookRules`: one `it.each(cases)` per look file; cases for this task: `ModalPlayful` (open, with footer).

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/playful/ModalPlayful src/components/overlayLookRules.test.tsx`.
- [ ] **Step 3: Implement** the skin, `index.ts` (`export { ModalPlayful, type ModalPlayfulProps } from "./ModalPlayful.js";`), the barrel line, and stories `Playful/ModalPlayful`: `Default` (trigger `ButtonPlayful`), `Open` (`defaultOpen`), `Alert` (`role="alertdialog"`), `LongContent` (40 paragraphs, `size="sm"`), each with `parameters.backgrounds.default: "paper"`.
- [ ] **Step 4: Run, confirm PASS.**
- [ ] **Step 5: Commit**: `feat(modal): add ModalPlayful`

---

### Task 4: `ModalSoft`

**Files:**
- Create: `src/components/soft/ModalSoft/{ModalSoft.tsx, ModalSoft.test.tsx, ModalSoft.stories.tsx, index.ts}`
- Modify: `src/components/overlayLookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `ModalBase`; `MODAL_CLASSES.soft`; `ButtonSoft`.
- Produces: `"use client"`; `ModalSoftProps = Omit<ModalBaseProps, "classes">`; `ModalSoft`. Panel `bg-bh-paper rounded-bh-soft`; scrim `bg-bh-charcoal/60`; no borders.

- [ ] **Step 1: Write the failing tests**: same trigger/focus-return test with `ButtonSoft`; panel is inside a `.rounded-bh-soft` element with `bg-bh-paper` and no `border` token; scrim `.bg-bh-charcoal\/60`; `size` maps; `className`/`ref`. Add the Soft case to `overlayLookRules`.
- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/soft/ModalSoft`.
- [ ] **Step 3: Implement** skin, `index.ts`, barrel line (`// Overlays` section), stories `Soft/ModalSoft` (`Default`, `Open`, `Alert`, `LongContent`, `backgrounds.default: "paper"`).
- [ ] **Step 4: Run, confirm PASS.**
- [ ] **Step 5: Commit**: `feat(modal): add ModalSoft`

---

### Task 5: `ModalSwiss`

**Files:**
- Create: `src/components/swiss/ModalSwiss/{ModalSwiss.tsx, ModalSwiss.test.tsx, ModalSwiss.stories.tsx, index.ts}`
- Modify: `src/components/overlayLookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `ModalBase`; `MODAL_CLASSES.swiss`; `ButtonSwiss`.
- Produces: `"use client"`; `ModalSwissProps = Omit<ModalBaseProps, "classes">`; `ModalSwiss`. Panel `bg-bh-paper-white border-t-2 border-bh-ink`; scrim `bg-bh-ink/40`; header/footer hairlines `border-bh-rule`.

- [ ] **Step 1: Write the failing tests**: trigger/focus-return with `ButtonSwiss`; panel has `bg-bh-paper-white`, `border-t-2`, `border-bh-ink` and no `rounded`/`shadow` token; scrim `.bg-bh-ink\/40`; title uses the grotesk font (`font-bh-grotesk`) and not `font-bh-display`; `className`/`ref`. Add the Swiss case to `overlayLookRules`.
- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/swiss/ModalSwiss`.
- [ ] **Step 3: Implement** skin, `index.ts`, barrel line, stories `Swiss/ModalSwiss` (`Default`, `Open`, `Alert`, `LongContent`, `backgrounds.default: "white"`).
- [ ] **Step 4: Run, confirm PASS**, then `pnpm typecheck`.
- [ ] **Step 5: Commit**: `feat(modal): add ModalSwiss`

*(End of PR 2.)*

---

### Task 6: `toast` API and `createToastQueue`

**Files:**
- Create: `src/lib/toast.ts`, `src/lib/toast.test.ts`
- Modify: `src/index.ts` (export `toast`, `createToastQueue`, `type ToastOptions`, `type ToastQueueHandle` under `// Overlays`)

**Interfaces:**
- Consumes: `UNSTABLE_ToastQueue` from `react-aria-components`; `FillColor`, `SoftTone`.
- Produces (`"use client"` at the top):
  ```ts
  export type ToastOptions = {
    title: string; description?: string;
    action?: { label: string; onAction: () => void };
    timeout?: number; color?: FillColor; tone?: SoftTone;
  };
  export type ToastContentValue = Omit<ToastOptions, "timeout">;   // stored in the queue, not exported from index
  export type ToastQueueHandle = ((options: ToastOptions) => string) & { close(id: string): void };
  export function createToastQueue(): ToastQueueHandle;
  export const toast: ToastQueueHandle;                             // the default shared queue
  export function getRacQueue(handle: ToastQueueHandle): UNSTABLE_ToastQueue<ToastContentValue>; // internal, not exported from index
  ```
- Rules: each handle owns `new UNSTABLE_ToastQueue<ToastContentValue>({ maxVisibleToasts: 3 })`, kept in a module-private `WeakMap<ToastQueueHandle, ...>`. `handle(options)` adds `{ title, description, action, color, tone }` with `timeout = options.action ? undefined : (options.timeout ?? 5000)` and returns the id. `handle.close(id)` calls the queue's `close(id)`.

- [ ] **Step 1: Write the failing tests** (`vi.useFakeTimers()` in `beforeEach`, `useRealTimers` after; read state with `getRacQueue(h).visibleToasts`)

```ts
it("returns an id and shows the toast", () => { const id = h({ title: "Saved" }); expect(typeof id).toBe("string"); expect(visible(h).map((t) => t.key)).toContain(id); });
it("auto-dismisses at 5000ms by default", () => { h({ title: "Saved" }); vi.advanceTimersByTime(4999); expect(visible(h)).toHaveLength(1); vi.advanceTimersByTime(1); expect(visible(h)).toHaveLength(0); });
it("honours a custom timeout", () => { /* timeout: 1000 */ });
it("a toast with an action never auto-dismisses, even with a timeout", () => { h({ title: "Undo?", action: { label: "Undo", onAction() {} }, timeout: 1000 }); vi.advanceTimersByTime(60_000); expect(visible(h)).toHaveLength(1); });
it("toast.close removes by id", () => {});
it("close with an unknown id is a no-op", () => { expect(() => h.close("nope")).not.toThrow(); });
it("shows at most 3 and queues the rest", () => { /* add 4; length 3; close first; 4th now visible */ });
it("createToastQueue handles are independent of each other and of the default toast", () => {});
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/lib/toast.test.ts`.
- [ ] **Step 3: Implement** as above.
- [ ] **Step 4: Run, confirm PASS.** Also add to `src/smoke.test.ts`-style check later (Task 12).
- [ ] **Step 5: Commit**: `feat(toast): add toast API and createToastQueue`

---

### Task 7: `ToastBase`

**Files:**
- Create: `src/components/_base/Toast/ToastBase.tsx`, `src/components/_base/Toast/ToastBase.test.tsx`

**Interfaces:**
- Consumes: `UNSTABLE_ToastRegion`, `UNSTABLE_ToastList`, `UNSTABLE_Toast`, `UNSTABLE_ToastContent`, `Text`, `Button` from `react-aria-components`; `getRacQueue`, `toast`, `ToastContentValue`, `ToastQueueHandle` from `src/lib/toast.ts`.
- Produces (`"use client"`):
  ```ts
  export type ToastPlacement = "bottom-end" | "bottom" | "top-end" | "top";
  export type ToastBaseClasses = {
    region: string; list: string;
    toast: (content: ToastContentValue) => string;
    marker?: (content: ToastContentValue) => string;   // when present, renders <span aria-hidden> before the text
    content: string; title: string; description: string; action: string; close: string;
  };
  export type ToastBaseProps = {
    queue?: ToastQueueHandle;           // default: the shared `toast`
    placement?: ToastPlacement;         // default "bottom-end"
    "aria-label"?: string;              // default: React Aria's "Notifications"
    className?: string; ref?: Ref<HTMLDivElement>; classes: ToastBaseClasses;
  };
  export function ToastBase(props: ToastBaseProps): ReactElement
  ```
- Base owns layout: region `fixed z-50 flex flex-col gap-3 p-4 outline-none` + placement (`bottom-end`: `bottom-0 end-0 items-end`; `bottom`: `bottom-0 inset-x-0 items-center`; `top-end`: `top-0 end-0 items-end`; `top`: `top-0 inset-x-0 items-center`); list `flex flex-col gap-3`. Each toast: `<UNSTABLE_Toast toast={t} className={classes.toast(t.content)}>` containing `UNSTABLE_ToastContent`, `<Text slot="title">`, optional `<Text slot="description">`, an action `<Button>` (runs `action.onAction()` then `queue.close(t.key)`), and a `<Button slot="close">` whose child is `<span aria-hidden>×</span>`.

- [ ] **Step 1: Write the failing tests** (`classes` stub; `createToastQueue()` per test; fake timers where noted; wrap queue calls in `act`)

```tsx
it("renders nothing while the queue is empty", () => { expect(screen.queryByRole("region")).toBeNull(); });
it("shows title and description in a region named Notifications", () => { act(() => { q({ title: "Message sent", description: "We will reply soon" }); }); expect(screen.getByRole("region", { name: "Notifications" })).toBeInTheDocument(); /* texts present */ });
it("the close button is named Close and removes the toast", async () => {});
it("the action button runs onAction and closes the toast", async () => {});
it("auto-dismisses after 5000ms (fake timers)", () => {});
it("an action toast is still there after 60s", () => {});
it("shows at most 3 toasts and reveals the 4th when one closes", async () => {});
it("three action toasts do not stall the queue: closing one reveals the fourth", async () => {});   // Review Focus 3
it("a toast added before the region mounts appears on mount", () => {});                            // Review Focus 4
it("two regions on separate queues each show only their own toasts", () => {});
it("placement maps to edge classes", () => { /* default has "bottom-0" and "end-0"; "top" has "top-0" and "inset-x-0" */ });
it("renders classes.marker as an aria-hidden span only when provided, and passes the toast content to classes.toast", () => {});
it("forwards className and ref to the region", () => {});
```

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/_base/Toast`.
- [ ] **Step 3: Implement `ToastBase`.** Use `userEvent` with real timers for click tests; use `fireEvent` plus `act` in the fake-timer tests.
- [ ] **Step 4: Run, confirm PASS.**
- [ ] **Step 5: Commit**: `feat(toast): add ToastBase on React Aria toast region`

*(End of PR 3.)*

---

### Task 8: `ToastRegionPlayful`

**Files:**
- Create: `src/components/playful/ToastRegionPlayful/{ToastRegionPlayful.tsx, ToastRegionPlayful.test.tsx, ToastRegionPlayful.stories.tsx, index.ts}`
- Modify: `src/components/overlayLookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `ToastBase`, `ToastBaseProps`; `TOAST_CLASSES.playful`; `FILL_CLASSES`; `FOCUS_RING`.
- Produces: `"use client"`; `ToastRegionPlayfulProps = Omit<ToastBaseProps, "classes">`; `ToastRegionPlayful`. `classes.toast(c) = cn(FILL_CLASSES[c.color ?? "blue"], TOAST_CLASSES.playful.toast, motion)`. Inner `action`/`close` carry `data-[focus-visible]:outline-current` (+ `outline-hidden data-[focus-visible]:outline-solid data-[focus-visible]:outline-2` as in `SWISS_RAC_FOCUS`), so the ring always matches `TEXT_ON` text. The toast root keeps `FOCUS_RING`. `tone` is ignored; no `marker`.

- [ ] **Step 1: Write the failing tests** (`createToastQueue()` per test)

```tsx
it("shows a toast with its text in a Notifications region", () => {});
it("default colour is blue with paper text; color='yellow' gives yellow with ink text", () => {
  /* toast element has "bg-bh-blue","text-bh-paper" / "bg-bh-yellow","text-bh-ink" */
});
it("has a 2px ink border, the hard shadow and uppercase text", () => {});
it("ignores tone", () => { q({ title: "x", tone: "red" }); /* no bh-red class on the toast */ });
it("inner controls keep a visible ring in the toast's own text colour", () => {
  /* action and close buttons: have "data-[focus-visible]:outline-current" and "data-[focus-visible]:outline-solid" */
});   // Review Focus 2
it("forwards className and ref to the region", () => {});
```
`overlayLookRules`: add `ToastRegionPlayful` (toast added in an `act`).

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/playful/ToastRegionPlayful`.
- [ ] **Step 3: Implement** skin, `index.ts`, barrel line, stories `Playful/ToastRegionPlayful`: a `Default` story with a `ButtonPlayful` calling `toast({ title: "Message sent", color: "blue" })` and a second button for an action toast. One story per `color` is not needed; `Colors` story fires one toast per fill from a local `createToastQueue()`.
- [ ] **Step 4: Run, confirm PASS.**
- [ ] **Step 5: Commit**: `feat(toast): add ToastRegionPlayful`

---

### Task 9: `ToastRegionSoft`

**Files:**
- Create: `src/components/soft/ToastRegionSoft/{ToastRegionSoft.tsx, ToastRegionSoft.test.tsx, ToastRegionSoft.stories.tsx, index.ts}`
- Modify: `src/components/overlayLookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `ToastBase`; `TOAST_CLASSES.soft`; `SOFT_TONE_CLASSES`-style dot colours via literal `bg-bh-red|bg-bh-yellow|bg-bh-blue|bg-bh-paper` map `TONE_DOT: Record<SoftTone, string>` (default `neutral`, whose dot is `bg-bh-paper`).
- Produces: `"use client"`; `ToastRegionSoftProps = Omit<ToastBaseProps, "classes">`; `ToastRegionSoft`. Toast root `rounded-full bg-bh-charcoal text-bh-paper` with root focus ring `ink` (`FOCUS_RING`); inner `action`/`close` use `data-[focus-visible]:outline-bh-paper`. `marker(c)` renders the dot `size-2 shrink-0 rounded-full` + `TONE_DOT[c.tone ?? "neutral"]`. `color` is ignored.

- [ ] **Step 1: Write the failing tests**

```tsx
it("shows a charcoal pill with paper text", () => {});
it("tone selects the dot colour and the dot is aria-hidden decoration; default tone is neutral", () => {
  /* tone "red" → dot has "bg-bh-red" and aria-hidden="true"; no tone → "bg-bh-paper"; title text carries the meaning */
});
it("ignores color", () => {});
it("inner controls use a paper ring, the toast root keeps the ink ring", () => {
  /* action/close: "data-[focus-visible]:outline-bh-paper"; toast: "focus-visible:outline-bh-ink" */
});   // Review Focus 2, spec deviation 9
it("has no borders and no hard shadow", () => {});
it("forwards className and ref to the region", () => {});
```
`overlayLookRules`: add `ToastRegionSoft`.

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/soft/ToastRegionSoft`.
- [ ] **Step 3: Implement** skin, `index.ts`, barrel line, stories `Soft/ToastRegionSoft` (`Default`, `Tones`, `WithAction`; `backgrounds.default: "paper"`).
- [ ] **Step 4: Run, confirm PASS.**
- [ ] **Step 5: Commit**: `feat(toast): add ToastRegionSoft`

---

### Task 10: `ToastRegionSwiss`

**Files:**
- Create: `src/components/swiss/ToastRegionSwiss/{ToastRegionSwiss.tsx, ToastRegionSwiss.test.tsx, ToastRegionSwiss.stories.tsx, index.ts}`
- Modify: `src/components/overlayLookRules.test.tsx`, `src/index.ts`

**Interfaces:**
- Consumes: `ToastBase`; `TOAST_CLASSES.swiss`; `SWISS_RAC_FOCUS`, `SWISS_LABEL`, `SWISS_MOTION`.
- Produces: `"use client"`; `ToastRegionSwissProps = Omit<ToastBaseProps, "classes">`; `ToastRegionSwiss`. Toast `bg-bh-paper-white text-bh-ink border-t-2 border-bh-ink`; `action` is underlined text (`underline underline-offset-4 decoration-1`), `close` is plain text `×`; title/description in grotesk. `color` and `tone` are ignored; no `marker`.

- [ ] **Step 1: Write the failing tests**

```tsx
it("shows a paper-white toast with a 2px ink top rule", () => {});
it("the action is underlined text, not a filled button", () => { /* action has "underline" and no "bg-bh-" token */ });
it("ignores color and tone", () => {});
it("uses the Swiss focus ring on action and close", () => { /* "data-[focus-visible]:outline-solid","data-[focus-visible]:outline-bh-ink" */ });
it("has no radius, shadow or translate", () => {});
it("forwards className and ref to the region", () => {});
```
`overlayLookRules`: add `ToastRegionSwiss`.

- [ ] **Step 2: Run, confirm FAIL**: `pnpm exec vitest run src/components/swiss/ToastRegionSwiss`.
- [ ] **Step 3: Implement** skin, `index.ts`, barrel line, stories `Swiss/ToastRegionSwiss` (`Default`, `WithAction`; `backgrounds.default: "white"`).
- [ ] **Step 4: Run, confirm PASS**, then `pnpm typecheck`.
- [ ] **Step 5: Commit**: `feat(toast): add ToastRegionSwiss`

*(End of PR 4.)*

---

### Task 11: Overlays overview story

**Files:**
- Create: `src/components/OverlaysOverview.stories.tsx`

**Interfaces:**
- Consumes: the three Modal skins, the three `ToastRegion` skins, `createToastQueue`, the matching `Button*` skins.
- Produces: `title: "Overlays/Overview"`, story `AllLooks`: three columns (Playful, Soft, Swiss), each with a trigger that opens that look's Modal and a button that fires a toast on that look's own `createToastQueue()` (one queue and one region per look, which is why the multi-region API exists, spec §6.3). `parameters.backgrounds.default: "paper"`.
- Per-look dashboard compositions (table, chart, form) belong to 0.6, 0.7 and 0.5a, not here.

- [ ] **Step 1: Write the story** (stories are the test here: the a11y addon runs with `test: "error"`).
- [ ] **Step 2: Run** `pnpm typecheck && pnpm smoke:storybook`. Expected: pass (the Storybook build contains the new stories; no a11y error on the `Open` stories from Tasks 3-5 and 8-10).
- [ ] **Step 3: Commit**: `docs(storybook): add overlays overview story`

---

### Task 12: Release `0.5.0`

**Files:**
- Modify: `package.json`, `src/index.ts`, `src/smoke.test.ts`, `README.md`

Matches how `3ba4d81` released `0.4.0`: four files (`package.json`, `src/index.ts` `VERSION`, `src/smoke.test.ts`, `README.md`) in one `chore(release)` commit. There is no CHANGELOG in this repo.

- [ ] **Step 1: Write the failing tests** (`src/smoke.test.ts`). Change the one sanctioned existing assertion `expect(lib.VERSION).toBe("0.4.0")` to `"0.5.0"`, and append:

```ts
it.each(["ModalPlayful", "ModalSoft", "ModalSwiss", "ToastRegionPlayful", "ToastRegionSoft", "ToastRegionSwiss"])(
  "exports %s", (name) => expect(typeof (lib as Record<string, unknown>)[name]).toBe("function"));
it("exports the toast API", () => {
  expect(typeof lib.toast).toBe("function");
  expect(typeof lib.toast.close).toBe("function");
  expect(typeof lib.createToastQueue).toBe("function");
});
it("does not leak React Aria toast internals", () => {
  expect(Object.keys(lib)).not.toContain("getRacQueue");
  expect(Object.keys(lib).some((k) => k.startsWith("UNSTABLE_"))).toBe(false);
});
```
(The existing "does not export internal bases" test already covers `*Base` names.)

- [ ] **Step 2:** Run `pnpm exec vitest run src/smoke.test.ts`. Expected: FAIL on the version (and on any export Task 6-10 missed).
- [ ] **Step 3: Implement the release changes**
  - Bump `package.json` and `VERSION` to `0.5.0`.
  - **README:** add one row per new component to the Components table, mirroring the existing rows (`ModalPlayful`, `ModalSoft`, `ModalSwiss`, `ToastRegionPlayful`, `ToastRegionSoft`, `ToastRegionSwiss`), after the form rows 0.5a added. Add a short "Overlays" section: Modal props (`title`, `footer`, `trigger` with any `Button*` skin, `role="alertdialog"` for confirmations, `size`) and Toast usage (mount one `ToastRegion<Look>` near the root, call `toast({ title, description?, action?, timeout?, color?, tone? })`; 5s default, an action keeps the toast until closed; max 3 visible; `createToastQueue()` + the region's `queue` prop for several regions; `color` is read by Playful only and `tone` by Soft only). Say that Toast is built on React Aria's `UNSTABLE_` toast API, which can change in a React Aria minor.
  - If 0.5a has not already updated the status table or intro for `0.5`, add that line; do not duplicate it if it exists.
- [ ] **Step 4: Full gate.** Run: `pnpm test && pnpm typecheck && pnpm smoke && pnpm smoke:storybook`. Expected: all pass; the Storybook a11y addon reports no violations on any new story.
- [ ] **Step 5: Commit**: `chore(release): 0.5.0`

*(End of PR 5.)*

---

## Self-review

- **Spec coverage:** §3 (no dependency, `UNSTABLE_` wrapped) Tasks 6-7; §6.1 Modal/scrim/Toast/motion rows Tasks 1, 3-5, 8-10; §6.3 Modal props, trigger compatibility, alertdialog, scroll, Toast API/timeout/placement/stack/`createToastQueue`/close button Tasks 2, 6, 7; §6.6 base + skin Tasks 2, 7; §6.7 Modal and Toast tests Tasks 2, 6, 7 plus skin and palette tests Tasks 1, 3-5, 8-10; §6.8 class maps Task 1; §6.9 exports Tasks 3-6, 12; §8 release Task 12. Table, charts and form inputs are out of scope (0.5a, 0.6, 0.7).
- **Type consistency:** `ToastQueueHandle`, `ToastContentValue`, `ToastPlacement`, `ModalSlot`, `ModalBaseClasses` are defined once (Tasks 2, 6, 7) and used with the same names later; skin props are always `Omit<…BaseProps, "classes">`.
- **Open points for the author:** deviations 1, 2, 4 and 5 above; whether the spec's "hard shadow" on a Playful `ink` toast (invisible against the border) should switch to the page colour (left as-is).
