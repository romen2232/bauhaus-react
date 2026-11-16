/** Visible keyboard focus ring shared by every interactive component. */
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bh-ink";

/** Hard-shadow "lift" used on hover by Playful interactive elements. */
export const HOVER_LIFT =
  "hover:shadow-bh-hard motion-safe:transition-[translate,box-shadow] motion-safe:duration-150 motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5";

/** Press-in on click: cancels HOVER_LIFT so the element drops flat and loses its shadow. */
export const PRESS =
  "active:shadow-none motion-safe:active:translate-x-0 motion-safe:active:translate-y-0 motion-safe:active:duration-75";
