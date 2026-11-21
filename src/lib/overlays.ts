import { SWISS_DISPLAY, SWISS_LABEL, SWISS_RAC_FOCUS } from "./styles.js";

export type OverlayLook = "playful" | "soft" | "swiss";

export type ModalClassSet = {
  scrim: string;
  panel: string;
  header: string;
  title: string;
  body: string;
  footer: string;
  motion: string;
};

export type ToastClassSet = {
  toast: string;
  content: string;
  title: string;
  description: string;
  action: string;
  close: string;
  motion: string;
};

// Motion rides on React Aria's `data-entering` / `data-exiting` (present on both ModalOverlay and Modal).
const PLAYFUL_MOTION =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-150 motion-safe:ease-out motion-safe:data-[entering]:-translate-y-3 motion-safe:data-[entering]:opacity-0 motion-safe:data-[exiting]:opacity-0";
const SOFT_MOTION =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-200 motion-safe:ease-out motion-safe:data-[entering]:translate-y-2 motion-safe:data-[entering]:opacity-0 motion-safe:data-[exiting]:opacity-0";
const SWISS_WIPE =
  "motion-safe:transition-[clip-path,opacity] motion-safe:duration-200 motion-safe:ease-out motion-safe:data-[entering]:[clip-path:inset(0_0_100%_0)] motion-safe:data-[exiting]:opacity-0";

// Toasts enter with `starting:` (CSS @starting-style) and have no exit animation: React Aria unmounts a closed toast immediately.
const PLAYFUL_TOAST_MOTION =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-150 motion-safe:ease-out motion-safe:starting:opacity-0 motion-safe:starting:-translate-y-3";
const SOFT_TOAST_MOTION =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-200 motion-safe:ease-out motion-safe:starting:opacity-0 motion-safe:starting:translate-y-2";
const SWISS_TOAST_WIPE =
  "motion-safe:transition-[clip-path] motion-safe:duration-200 motion-safe:ease-out motion-safe:starting:[clip-path:inset(0_0_100%_0)]";

// Focus ring for controls inside a toast: it follows the toast's own text colour (Playful) or `paper` (Soft).
const RING_BASE =
  "outline-hidden data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2";
const PLAYFUL_TOAST_RING = `${RING_BASE} data-[focus-visible]:outline-current`;
const SOFT_TOAST_RING = `${RING_BASE} data-[focus-visible]:outline-bh-paper`;

// Focus ring for the scrolling modal body (a plain focusable div). Inset so the panel never clips it.
const BODY_FOCUS =
  "outline-hidden focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-bh-ink";

/** Modal class maps, one per look. Static literals only. */
export const MODAL_CLASSES: Record<OverlayLook, ModalClassSet> = {
  playful: {
    scrim: "bg-bh-ink/60",
    panel: "bg-bh-paper text-bh-ink border-2 border-bh-ink shadow-bh-hard-lg",
    header: "px-6 py-4 border-b-2 border-bh-ink",
    title: "font-bh-display font-black uppercase text-2xl",
    body: `px-6 py-4 font-bh-body text-base ${BODY_FOCUS}`,
    footer: "flex flex-wrap justify-end gap-3 px-6 py-4 border-t-2 border-bh-ink",
    motion: PLAYFUL_MOTION,
  },
  soft: {
    scrim: "bg-bh-charcoal/60",
    panel: "bg-bh-paper text-bh-ink rounded-bh-soft overflow-hidden",
    header: "px-8 pt-6 pb-2",
    title: "font-bh-display font-light text-2xl",
    body: `px-8 py-2 font-bh-body text-base ${BODY_FOCUS}`,
    footer: "flex flex-wrap justify-end gap-3 px-8 pt-2 pb-6",
    motion: SOFT_MOTION,
  },
  swiss: {
    scrim: "bg-bh-ink/40",
    panel: "bg-bh-paper-white text-bh-ink border-t-2 border-bh-ink",
    header: "px-6 py-4 border-b border-bh-rule",
    title: `${SWISS_DISPLAY} text-3xl`,
    body: `px-6 py-4 font-bh-grotesk text-base ${BODY_FOCUS}`,
    footer: "flex flex-wrap justify-end gap-3 px-6 py-4 border-t border-bh-rule",
    motion: SWISS_WIPE,
  },
};

/** Toast class maps, one per look. Static literals only; the Playful fill comes from `FILL_CLASSES` in the skin. */
export const TOAST_CLASSES: Record<OverlayLook, ToastClassSet> = {
  playful: {
    toast: "border-2 border-bh-ink shadow-bh-hard uppercase font-bh-display font-black",
    content: "flex flex-col gap-1 px-5 py-3",
    title: "text-sm tracking-wide",
    description: "font-bh-body text-xs font-normal normal-case",
    action: `${PLAYFUL_TOAST_RING} font-bh-display text-xs font-black uppercase underline underline-offset-4`,
    close: `${PLAYFUL_TOAST_RING} font-bh-display text-lg font-black`,
    motion: PLAYFUL_TOAST_MOTION,
  },
  soft: {
    toast: "rounded-full bg-bh-charcoal text-bh-paper",
    content: "flex flex-col gap-0.5 px-6 py-3",
    title: "font-bh-display text-sm font-normal",
    description: "font-bh-body text-xs font-normal",
    action: `${SOFT_TOAST_RING} font-bh-display text-sm font-normal underline underline-offset-4`,
    close: `${SOFT_TOAST_RING} font-bh-display text-lg font-normal`,
    motion: SOFT_TOAST_MOTION,
  },
  swiss: {
    toast: "bg-bh-paper-white text-bh-ink border-t-2 border-bh-ink",
    content: "flex flex-col gap-1 px-5 py-3",
    title: `${SWISS_DISPLAY} text-base`,
    description: "font-bh-grotesk text-sm",
    action: `${SWISS_RAC_FOCUS} ${SWISS_LABEL} underline underline-offset-4 decoration-1`,
    close: `${SWISS_RAC_FOCUS} font-bh-grotesk text-lg font-normal`,
    motion: SWISS_TOAST_WIPE,
  },
};
