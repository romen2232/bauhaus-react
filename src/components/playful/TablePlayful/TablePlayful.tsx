"use client";
import { TableBase, type TableSkinProps } from "../../_base/Table/TableBase.js";
import { TABLE_PLAYFUL_CLASSES } from "../../../lib/table.js";

export type TablePlayfulProps<T> = TableSkinProps<T>;

/** Playful table: framed with a hard shadow, yellow header row and 2px ink rules. */
export function TablePlayful<T>(props: TablePlayfulProps<T>) {
  return <TableBase {...props} classes={TABLE_PLAYFUL_CLASSES} />;
}
