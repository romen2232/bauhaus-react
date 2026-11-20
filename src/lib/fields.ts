import { RAC_FOCUS, SWISS_LABEL, SWISS_MOTION } from "./styles.js";

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
