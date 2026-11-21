"use client";
import { TableBase, type TableSkinProps } from "../../_base/Table/TableBase.js";
import { TABLE_SWISS_CLASSES } from "../../../lib/table.js";

export type TableSwissProps<T> = TableSkinProps<T>;

/** Swiss table: no frame, hairline rules and tabular numerals. */
export function TableSwiss<T>(props: TableSwissProps<T>) {
  return <TableBase {...props} classes={TABLE_SWISS_CLASSES} />;
}
