import type { TableBaseClasses } from "../components/_base/Table/tableTypes.js";
import { SWISS_LABEL, SWISS_MOTION, TABLE_RAC_FOCUS } from "./styles.js";

/** Playful table: framed, yellow header row, 2px ink row rules. Static literals only. */
export const TABLE_PLAYFUL_CLASSES: TableBaseClasses = {
  wrapper: "overflow-x-auto border-2 border-bh-ink bg-bh-paper-white shadow-bh-hard",
  table: "w-full border-collapse font-bh-body text-sm text-bh-ink",
  header: "",
  column: `bg-bh-yellow border-b-2 border-bh-ink px-4 py-3 text-start font-bh-display text-xs font-black uppercase tracking-[0.1em] text-bh-ink ${TABLE_RAC_FOCUS}`,
  columnSorted: "",
  sortIcon: "ms-2",
  body: "",
  row: `border-b-2 border-bh-ink last:border-b-0 ${TABLE_RAC_FOCUS}`,
  rowActionable: "cursor-pointer data-[hovered]:bg-bh-paper",
  cell: `px-4 py-3 ${TABLE_RAC_FOCUS}`,
  rowHeaderCell: "font-bh-display font-black",
  alignEnd: "text-end tabular-nums",
  empty: "p-6 text-center font-bh-body",
};

/** Soft table: rows on a sand panel, alternate rows lightened, no rules. */
export const TABLE_SOFT_CLASSES: TableBaseClasses = {
  wrapper: "overflow-x-auto rounded-bh-soft bg-bh-sand p-2",
  table: "w-full border-collapse font-bh-body text-sm text-bh-ink",
  header: "",
  column: `px-4 py-3 text-start font-bh-display text-sm font-normal text-bh-charcoal ${TABLE_RAC_FOCUS}`,
  columnSorted: "text-bh-ink",
  sortIcon: "ms-2",
  body: "",
  row: `odd:bg-bh-paper/50 ${TABLE_RAC_FOCUS}`,
  rowActionable: "cursor-pointer data-[hovered]:bg-bh-paper/80",
  cell: `px-4 py-3 ${TABLE_RAC_FOCUS}`,
  rowHeaderCell: "font-bh-display",
  alignEnd: "text-end tabular-nums",
  empty: "p-6 text-center font-bh-body",
};

/** Swiss table: no frame, 1px ink header rule, 1px hairline row rules, tabular numerals. */
export const TABLE_SWISS_CLASSES: TableBaseClasses = {
  wrapper: "overflow-x-auto bg-transparent",
  table: "w-full border-collapse font-bh-grotesk text-sm font-normal text-bh-ink",
  header: "",
  column: `border-b border-bh-ink px-4 pt-3 pb-2 text-start text-bh-muted-text ${SWISS_LABEL} ${SWISS_MOTION} ${TABLE_RAC_FOCUS}`,
  columnSorted: "text-bh-ink",
  sortIcon: "ms-2",
  body: "",
  row: `border-b border-bh-rule ${TABLE_RAC_FOCUS}`,
  rowActionable: "cursor-pointer data-[hovered]:bg-bh-rule/50",
  cell: `px-4 py-3 ${TABLE_RAC_FOCUS}`,
  rowHeaderCell: "",
  alignEnd: "text-end tabular-nums",
  empty: "p-6 text-center text-bh-muted-text",
};
