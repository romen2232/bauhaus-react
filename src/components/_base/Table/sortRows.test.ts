import { compareSortValues, sortRows } from "./sortRows";
import type { TableColumn } from "./tableTypes";

it("compares numbers numerically", () => {
  expect(compareSortValues(2, 10)).toBeLessThan(0);
  expect(compareSortValues(10, 2)).toBeGreaterThan(0);
  expect(compareSortValues(5, 5)).toBe(0);
});

it("compares strings with localeCompare", () => {
  expect(compareSortValues("apple", "Banana")).toBeLessThan(0);
  expect(compareSortValues("b", "a", "descending")).toBeLessThan(0);
});

it("compares Dates by time", () => {
  expect(compareSortValues(new Date("2026-01-02"), new Date("2026-01-10"))).toBeLessThan(0);
});

it.each([null, undefined, NaN, new Date("nope")])("missing values sort last in both directions (%s)", (m) => {
  expect(compareSortValues(m, 1, "ascending")).toBeGreaterThan(0);
  expect(compareSortValues(m, 1, "descending")).toBeGreaterThan(0);
  expect(compareSortValues(1, m, "descending")).toBeLessThan(0);
  expect(compareSortValues(m, null)).toBe(0);
});

it("numbers and dates come before strings when kinds are mixed", () => {
  expect(compareSortValues(5, "a")).toBeLessThan(0);
  expect(compareSortValues("a", new Date(0))).toBeGreaterThan(0);
});

type Row = { name: string; rank?: string; v?: number | null };

it("sortRows uses sortValue over the field", () => {
  const rows: Row[] = [
    { name: "b", rank: "high" },
    { name: "a", rank: "low" },
  ];
  const column: TableColumn<Row> = {
    id: "rank",
    label: "Rank",
    sortValue: (r) => (r.rank === "high" ? 1 : 0),
  };
  expect(sortRows(rows, column, "ascending").map((r) => r.name)).toEqual(["a", "b"]);
});

it("sortRows does not fall back to the field when sortValue returns null", () => {
  const rows: Row[] = [
    { name: "a", v: 1 },
    { name: "b", v: 2 },
  ];
  const column: TableColumn<Row> = { id: "v", label: "V", sortValue: (r) => (r.name === "a" ? null : 5) };
  expect(sortRows(rows, column, "ascending").map((r) => r.name)).toEqual(["b", "a"]);
});

it("sortRows falls back to the field and is stable", () => {
  const rows: Row[] = [
    { name: "x", v: 2 },
    { name: "y", v: 1 },
    { name: "z", v: 2 },
  ];
  const column: TableColumn<Row> = { id: "v", label: "V" };
  expect(sortRows(rows, column, "ascending").map((r) => r.name)).toEqual(["y", "x", "z"]);
  expect(sortRows(rows, column, "descending").map((r) => r.name)).toEqual(["x", "z", "y"]);
});

it("sortRows does not mutate its input and handles an undefined column", () => {
  const rows: Row[] = [
    { name: "b", v: 2 },
    { name: "a", v: 1 },
  ];
  const copy = [...rows];
  sortRows(rows, { id: "v", label: "V" }, "ascending");
  expect(rows).toEqual(copy);
  const result = sortRows(rows, undefined, "ascending");
  expect(result).not.toBe(rows);
  expect(result).toEqual(rows);
});

it("sortRows puts missing last descending", () => {
  const rows: Row[] = [{ name: "n", v: null }, { name: "one", v: 1 }, { name: "two", v: 2 }];
  expect(sortRows(rows, { id: "v", label: "V" }, "descending").map((r) => r.v)).toEqual([2, 1, null]);
});
