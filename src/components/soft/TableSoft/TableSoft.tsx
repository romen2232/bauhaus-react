"use client";
import { TableBase, type TableSkinProps } from "../../_base/Table/TableBase.js";
import { TABLE_SOFT_CLASSES } from "../../../lib/table.js";

export type TableSoftProps<T> = TableSkinProps<T>;

/** Soft table: tonal rows on a sand panel, no rules. */
export function TableSoft<T>(props: TableSoftProps<T>) {
  return <TableBase {...props} classes={TABLE_SOFT_CLASSES} />;
}
