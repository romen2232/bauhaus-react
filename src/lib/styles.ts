/** Visible keyboard focus ring shared by every interactive component. */
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bh-ink";

/** Hard-shadow "lift" used on hover by Playful interactive elements. */
export const HOVER_LIFT =
  "hover:shadow-bh-hard motion-safe:transition-[translate,box-shadow] motion-safe:duration-150 motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5";

/** Press-in on click: cancels HOVER_LIFT so the element drops flat and loses its shadow. */
export const PRESS =
  "active:shadow-none motion-safe:active:translate-x-0 motion-safe:active:translate-y-0 motion-safe:active:duration-75";

/** Swiss look: colour-only transitions, gated behind reduced-motion preferences. */
export const SWISS_MOTION =
  "motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out";

/** Swiss look: uppercase, tracked-out labels. */
export const SWISS_LABEL = "font-bh-grotesk text-[11px] font-normal uppercase tracking-[0.1em]";

/** Swiss look: display text, tightened tracking, regular weight. */
export const SWISS_DISPLAY = "font-bh-grotesk font-normal tracking-[-0.03em]";

/** Swiss look: focus ring for React Aria elements that hide their outline. */
export const SWISS_RAC_FOCUS =
  "outline-hidden data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink";

/** Ink focus outline for every look's React Aria inputs that hide the native outline. */
export const RAC_FOCUS = SWISS_RAC_FOCUS;

/**
 * Focus outline for toggle boxes: the focused element is the label wrapper, so the box reads its group.
 * Un-named `group-data-[focus-visible]` matches the nearest `group` ancestor. This is safe for
 * RadioGroup only because its root (also a `group`) emits no `data-focus-visible`; add a named
 * group (`group/radio`) before putting `group-data-[invalid]` or `group-data-[disabled]` on a
 * radio-level class, or it would match the root and leak to every radio.
 */
export const BOX_FOCUS =
  "group-data-[focus-visible]:outline-solid group-data-[focus-visible]:outline-2 group-data-[focus-visible]:outline-offset-2 group-data-[focus-visible]:outline-bh-ink";
