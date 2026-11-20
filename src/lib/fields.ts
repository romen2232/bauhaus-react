import type { FillColor, SoftTone } from "./palette.js";
import { BOX_FOCUS, RAC_FOCUS, SWISS_LABEL, SWISS_MOTION } from "./styles.js";

export type FieldClassSet = {
  root: string;
  label: string;
  required: string;
  description: string;
  error: string;
  errorMarker: string;
};

export type FormLook = "playful" | "soft" | "swiss";

const DISABLED = "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";

const PLAYFUL_INPUT = `h-11 w-full rounded-none border-2 border-bh-ink bg-bh-paper-white px-4 font-bh-body text-base text-bh-ink placeholder:text-bh-muted-text data-[focused]:shadow-bh-hard ${DISABLED} ${RAC_FOCUS}`;
const SOFT_BASE = `w-full border border-bh-charcoal bg-bh-sand px-5 font-bh-body text-base text-bh-ink placeholder:text-bh-charcoal ${DISABLED} ${RAC_FOCUS}`;
const SOFT_INPUT = `h-11 rounded-full ${SOFT_BASE}`;
const SWISS_INPUT = `h-11 w-full rounded-none border-0 border-b border-bh-ink bg-transparent px-0 font-bh-grotesk text-base font-normal text-bh-ink placeholder:text-bh-muted-text data-[invalid]:border-bh-accent ${DISABLED} ${SWISS_MOTION} ${RAC_FOCUS}`;

/** Class maps for text-like fields, one per look. Static literals only. */
export const FIELD_CLASSES: Record<
  FormLook,
  FieldClassSet & { control: string; input: string; textarea: string }
> = {
  playful: {
    root: "group flex flex-col gap-2",
    label: "font-bh-display text-sm font-black uppercase tracking-wide text-bh-ink",
    required: "ml-1 font-bh-body text-xs font-normal normal-case tracking-normal text-bh-muted-text",
    description: "font-bh-body text-sm text-bh-muted-text",
    control:
      "relative before:absolute before:inset-y-0 before:left-0 before:hidden before:w-1 before:bg-bh-red group-data-[invalid]:before:block",
    input: PLAYFUL_INPUT,
    textarea: `${PLAYFUL_INPUT} h-auto min-h-24 py-3`,
    error: "flex items-start gap-2 font-bh-body text-sm text-bh-ink",
    errorMarker: "mt-1 size-3 shrink-0 bg-bh-red",
  },
  soft: {
    root: "group flex flex-col gap-2",
    label: "font-bh-display text-sm font-normal text-bh-charcoal",
    required: "ml-1 font-bh-body text-xs font-normal normal-case tracking-normal text-bh-muted-text",
    description: "font-bh-body text-sm text-bh-muted-text",
    control: "",
    input: SOFT_INPUT,
    textarea: `rounded-bh-soft ${SOFT_BASE} min-h-24 py-3`,
    error: "flex items-start gap-2 font-bh-body text-sm text-bh-ink",
    errorMarker: "mt-1.5 size-2 shrink-0 rounded-full bg-bh-red",
  },
  swiss: {
    root: "group flex flex-col gap-2",
    label: `${SWISS_LABEL} text-bh-muted-text`,
    required: "ml-1 normal-case tracking-normal",
    description: "font-bh-grotesk text-sm text-bh-muted-text",
    control: "",
    input: SWISS_INPUT,
    textarea: `${SWISS_INPUT} h-auto min-h-24 py-3`,
    error: "font-bh-grotesk text-sm text-bh-ink",
    errorMarker: "",
  },
};

/** Playful checked state: `FILL_CLASSES` behind a `data-[checked]:` prefix (static literals). */
export const PLAYFUL_CHECKED: Record<FillColor, string> = {
  red: "data-[checked]:bg-bh-red data-[checked]:text-bh-ink",
  yellow: "data-[checked]:bg-bh-yellow data-[checked]:text-bh-ink",
  blue: "data-[checked]:bg-bh-blue data-[checked]:text-bh-paper",
  navy: "data-[checked]:bg-bh-navy data-[checked]:text-bh-paper",
  sky: "data-[checked]:bg-bh-sky data-[checked]:text-bh-ink",
  pink: "data-[checked]:bg-bh-pink data-[checked]:text-bh-ink",
  orange: "data-[checked]:bg-bh-orange data-[checked]:text-bh-ink",
  ink: "data-[checked]:bg-bh-ink data-[checked]:text-bh-paper",
  paper: "data-[checked]:bg-bh-paper data-[checked]:text-bh-ink",
};

/** Soft checked state: `SOFT_TONE_CLASSES` behind a `data-[checked]:` prefix (static literals). */
export const SOFT_CHECKED: Record<SoftTone, string> = {
  red: "data-[checked]:bg-bh-red data-[checked]:text-bh-ink",
  yellow: "data-[checked]:bg-bh-yellow data-[checked]:text-bh-ink",
  blue: "data-[checked]:bg-bh-blue data-[checked]:text-bh-paper",
  neutral: "data-[checked]:bg-bh-charcoal data-[checked]:text-bh-paper",
};

/** Soft unchecked controls: 1px charcoal outline so the boundary reaches 3:1 (WCAG 1.4.11). */
export const SOFT_OFF = {
  checkbox: "border border-bh-charcoal bg-bh-sand",
  radio: "border border-bh-charcoal bg-bh-sand",
  track: "border border-bh-charcoal bg-bh-sand",
  thumb: "bg-bh-charcoal",
};

const TOGGLE_BUTTON = "group flex items-start gap-3 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";
const BOX_BASE = `mt-0.5 flex size-6 shrink-0 items-center justify-center ${BOX_FOCUS}`;

export type CheckboxClassSet = FieldClassSet & { button: string; box: string; indicator: string };

/** Class maps for Checkbox, one per look. The Playful and Soft checked fill is added by the skin. */
export const CHECKBOX_CLASSES: Record<FormLook, CheckboxClassSet> = {
  playful: {
    root: "flex flex-col gap-2",
    button: TOGGLE_BUTTON,
    box: `${BOX_BASE} rounded-none border-2 border-bh-ink bg-bh-paper-white`,
    indicator: "font-bh-body text-base font-black leading-none",
    label: "font-bh-display text-sm font-black uppercase tracking-wide text-bh-ink",
    required: "ml-1 font-bh-body text-xs font-normal normal-case tracking-normal text-bh-muted-text",
    description: "font-bh-body text-sm text-bh-muted-text",
    error: "flex items-start gap-2 font-bh-body text-sm text-bh-ink",
    errorMarker: "mt-1 size-3 shrink-0 bg-bh-red",
  },
  soft: {
    root: "flex flex-col gap-2",
    button: TOGGLE_BUTTON,
    box: `${BOX_BASE} rounded-md ${SOFT_OFF.checkbox}`,
    indicator: "font-bh-body text-base font-bold leading-none",
    label: "font-bh-display text-sm font-normal text-bh-charcoal",
    required: "ml-1 font-bh-body text-xs font-normal normal-case tracking-normal text-bh-muted-text",
    description: "font-bh-body text-sm text-bh-muted-text",
    error: "flex items-start gap-2 font-bh-body text-sm text-bh-ink",
    errorMarker: "mt-1.5 size-2 shrink-0 rounded-full bg-bh-red",
  },
  swiss: {
    root: "flex flex-col gap-2",
    button: TOGGLE_BUTTON,
    box: `${BOX_BASE} rounded-none border border-bh-ink bg-transparent data-[checked]:bg-bh-ink data-[checked]:text-bh-paper-white ${SWISS_MOTION}`,
    indicator: "font-bh-grotesk text-base font-normal leading-none",
    label: `${SWISS_LABEL} text-bh-muted-text`,
    required: "ml-1 normal-case tracking-normal",
    description: "font-bh-grotesk text-sm text-bh-muted-text",
    error: "flex items-start gap-2 font-bh-grotesk text-sm text-bh-ink",
    errorMarker: "mt-1.5 size-2 shrink-0 bg-bh-accent",
  },
};

export type SwitchClassSet = FieldClassSet & { button: string; track: string; thumb: string };

const TRACK_BASE = `mt-0.5 flex shrink-0 items-center ${BOX_FOCUS}`;
const THUMB_MOTION = "motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out";

/**
 * Class maps for Switch, one per look. The Playful and Soft on-fill is added by the skin.
 * Soft and Swiss move the thumb with `ml-auto` (their look rules forbid translate).
 */
export const SWITCH_CLASSES: Record<FormLook, SwitchClassSet> = {
  playful: {
    root: CHECKBOX_CLASSES.playful.root,
    button: TOGGLE_BUTTON,
    track: `${TRACK_BASE} h-7 w-12 rounded-full border-2 border-bh-ink bg-bh-paper-white`,
    thumb: `ml-0.5 size-4 rounded-full border-2 border-bh-ink bg-bh-ink data-[checked]:translate-x-6 data-[checked]:bg-bh-paper-white ${THUMB_MOTION}`,
    label: CHECKBOX_CLASSES.playful.label,
    required: CHECKBOX_CLASSES.playful.required,
    description: CHECKBOX_CLASSES.playful.description,
    error: CHECKBOX_CLASSES.playful.error,
    errorMarker: CHECKBOX_CLASSES.playful.errorMarker,
  },
  soft: {
    root: CHECKBOX_CLASSES.soft.root,
    button: TOGGLE_BUTTON,
    track: `${TRACK_BASE} h-7 w-12 rounded-full ${SOFT_OFF.track}`,
    thumb: `ml-1 size-4 rounded-full border border-bh-charcoal ${SOFT_OFF.thumb} data-[checked]:ml-auto data-[checked]:mr-1 data-[checked]:bg-bh-paper`,
    label: CHECKBOX_CLASSES.soft.label,
    required: CHECKBOX_CLASSES.soft.required,
    description: CHECKBOX_CLASSES.soft.description,
    error: CHECKBOX_CLASSES.soft.error,
    errorMarker: CHECKBOX_CLASSES.soft.errorMarker,
  },
  swiss: {
    root: CHECKBOX_CLASSES.swiss.root,
    button: TOGGLE_BUTTON,
    track: `${TRACK_BASE} h-6 w-11 rounded-none border border-bh-ink bg-transparent data-[checked]:bg-bh-ink ${SWISS_MOTION}`,
    thumb: "ml-1 size-4 bg-bh-ink data-[checked]:ml-auto data-[checked]:mr-1 data-[checked]:bg-bh-paper-white",
    label: CHECKBOX_CLASSES.swiss.label,
    required: CHECKBOX_CLASSES.swiss.required,
    description: CHECKBOX_CLASSES.swiss.description,
    error: CHECKBOX_CLASSES.swiss.error,
    errorMarker: CHECKBOX_CLASSES.swiss.errorMarker,
  },
};

export type RadioClassSet = FieldClassSet & {
  options: string;
  radio: string;
  circle: string;
  dot: string;
  optionLabel: string;
};

const RADIO_ROOT = "group flex flex-col gap-2";
const RADIO_OPTIONS =
  "flex flex-col gap-3 group-data-[orientation=horizontal]:flex-row group-data-[orientation=horizontal]:flex-wrap group-data-[orientation=horizontal]:gap-x-6";
const RADIO_CIRCLE = `mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${BOX_FOCUS}`;
// The checked circle is filled by the skin and sets the text colour; the dot is that colour.
const RADIO_DOT = "hidden size-2.5 rounded-full bg-current data-[checked]:block";

/**
 * Class maps for RadioGroup, one per look. The Playful and Soft checked fill is added to
 * `circle` by the skin. Swiss keeps a round radio (a square one reads as a checkbox).
 */
export const RADIO_CLASSES: Record<FormLook, RadioClassSet> = {
  playful: {
    root: RADIO_ROOT,
    options: RADIO_OPTIONS,
    radio: TOGGLE_BUTTON,
    circle: `${RADIO_CIRCLE} border-2 border-bh-ink bg-bh-paper-white`,
    dot: RADIO_DOT,
    optionLabel: "font-bh-body text-base text-bh-ink",
    label: CHECKBOX_CLASSES.playful.label,
    required: CHECKBOX_CLASSES.playful.required,
    description: CHECKBOX_CLASSES.playful.description,
    error: CHECKBOX_CLASSES.playful.error,
    errorMarker: CHECKBOX_CLASSES.playful.errorMarker,
  },
  soft: {
    root: RADIO_ROOT,
    options: RADIO_OPTIONS,
    radio: TOGGLE_BUTTON,
    circle: `${RADIO_CIRCLE} ${SOFT_OFF.radio}`,
    dot: RADIO_DOT,
    optionLabel: "font-bh-body text-base text-bh-ink",
    label: CHECKBOX_CLASSES.soft.label,
    required: CHECKBOX_CLASSES.soft.required,
    description: CHECKBOX_CLASSES.soft.description,
    error: CHECKBOX_CLASSES.soft.error,
    errorMarker: CHECKBOX_CLASSES.soft.errorMarker,
  },
  swiss: {
    root: RADIO_ROOT,
    options: RADIO_OPTIONS,
    radio: TOGGLE_BUTTON,
    circle: `${RADIO_CIRCLE} border border-bh-ink bg-transparent data-[checked]:bg-bh-ink data-[checked]:text-bh-paper-white ${SWISS_MOTION}`,
    dot: RADIO_DOT,
    optionLabel: "font-bh-grotesk text-base text-bh-ink",
    label: CHECKBOX_CLASSES.swiss.label,
    required: CHECKBOX_CLASSES.swiss.required,
    description: CHECKBOX_CLASSES.swiss.description,
    error: CHECKBOX_CLASSES.swiss.error,
    errorMarker: CHECKBOX_CLASSES.swiss.errorMarker,
  },
};
