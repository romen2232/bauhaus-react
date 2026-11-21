import type { SortValue, TableColumn } from "./tableTypes.js";

type Direction = "ascending" | "descending";
type Kind = "missing" | "number" | "string";

function kindOf(value: SortValue): Kind {
  if (value === null || value === undefined) return "missing";
  if (typeof value === "number") return Number.isNaN(value) ? "missing" : "number";
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? "missing" : "number";
  return "string";
}

const numeric = (value: SortValue): number => (value instanceof Date ? value.getTime() : (value as number));

/**
 * Total ordering over sort values. Missing values (`null`, `undefined`, `NaN`, invalid `Date`) sort
 * after every present value in both directions. Numbers and dates come before strings.
 */
export function compareSortValues(a: SortValue, b: SortValue, direction: Direction = "ascending"): number {
  const ka = kindOf(a);
  const kb = kindOf(b);
  if (ka === "missing" || kb === "missing") {
    if (ka === kb) return 0;
    return ka === "missing" ? 1 : -1;
  }
  let result: number;
  if (ka !== kb) result = ka === "number" ? -1 : 1;
  else if (ka === "number") result = numeric(a) - numeric(b);
  else result = (a as string).localeCompare(b as string);
  return direction === "descending" ? -result : result;
}

/** Returns a new, stably sorted array. Without a column, returns a copy in input order. */
export function sortRows<T>(rows: readonly T[], column: TableColumn<T> | undefined, direction: Direction): T[] {
  if (!column) return [...rows];
  const read = (row: T): SortValue =>
    column.sortValue ? column.sortValue(row) : (row[column.id] as SortValue);
  return rows
    .map((row, index) => ({ row, index, value: read(row) }))
    .sort((x, y) => compareSortValues(x.value, y.value, direction) || x.index - y.index)
    .map((entry) => entry.row);
}
