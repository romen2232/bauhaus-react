import type { ReactNode } from "react";

export type SortValue = string | number | Date | null | undefined;

export type TableColumn<T> = {
  id: keyof T & string;
  label: string;
  align?: "start" | "end";
  isRowHeader?: boolean;
  allowsSorting?: boolean;
  /** Value used for sorting. Defaults to the row field. Return `null` or `undefined` to mark it missing. */
  sortValue?: (row: T) => SortValue;
  render?: (row: T) => ReactNode;
};

export type TableSortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

export type TableBaseClasses = {
  wrapper: string;
  table: string;
  header: string;
  column: string;
  columnSorted: string;
  sortIcon: string;
  body: string;
  row: string;
  rowActionable: string;
  cell: string;
  rowHeaderCell: string;
  alignEnd: string;
  empty: string;
};
