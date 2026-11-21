import type { TableBaseClasses } from "../components/_base/Table/tableTypes.js";
import { TABLE_RAC_FOCUS } from "./styles.js";

/** Playful table: framed, yellow header row, 2px ink row rules. Static literals only. */
export const TABLE_PLAYFUL_CLASSES: TableBaseClasses = {
  wrapper: "overflow-x-auto border-2 border-bh-ink bg-bh-paper-white shadow-bh-hard",
  table: "w-full border-collapse font-bh-body text-sm text-bh-ink",
  header: "",
  column: `bg-bh-yellow border-b-2 border-bh-ink px-4 py-3 text-start font-bh-display text-xs font-black uppercase tracking-[0.1em] text-bh-ink ${TABLE_RAC_FOCUS}`,
  columnSorted: "",
  sortIcon: "ml-2",
  body: "",
  row: `border-b-2 border-bh-ink last:border-b-0 ${TABLE_RAC_FOCUS}`,
  rowActionable: "cursor-pointer data-[hovered]:bg-bh-paper",
  cell: `px-4 py-3 ${TABLE_RAC_FOCUS}`,
  rowHeaderCell: "font-bh-display font-black",
  alignEnd: "text-end tabular-nums",
  empty: "p-6 text-center font-bh-body",
};
