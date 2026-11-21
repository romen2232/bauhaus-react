import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import { TableBase } from "./TableBase";
import type { TableBaseClasses, TableColumn } from "./tableTypes";

const c: TableBaseClasses = {
  wrapper: "w",
  table: "t",
  header: "h",
  column: "col",
  columnSorted: "cs",
  sortIcon: "si",
  body: "b",
  row: "r",
  rowActionable: "ra",
  cell: "cell",
  rowHeaderCell: "rh",
  alignEnd: "end",
  empty: "e",
};

type Project = { slug: string; name: string; users: number | null; shipped: Date };

const rows: Project[] = [
  { slug: "a", name: "Aurora", users: 12, shipped: new Date("2026-01-02") },
  { slug: "b", name: "Borealis", users: 3, shipped: new Date("2026-02-10") },
  { slug: "c", name: "Cirrus", users: null, shipped: new Date("2026-03-05") },
];

const columns: TableColumn<Project>[] = [
  { id: "name", label: "Name" },
  { id: "users", label: "Users", align: "end" },
  { id: "shipped", label: "Shipped" },
];

const getRowId = (row: Project) => row.slug;

it("renders a named grid with headers and cells", () => {
  render(<TableBase aria-label="Projects" columns={columns} rows={rows} getRowId={getRowId} classes={c} />);
  expect(screen.getByRole("grid", { name: "Projects" })).toBeInTheDocument();
  expect(screen.getAllByRole("columnheader").map((h) => h.textContent)).toEqual(["Name", "Users", "Shipped"]);
  expect(screen.getAllByRole("row")).toHaveLength(rows.length + 1);
  expect(screen.getByRole("gridcell", { name: "12" })).toBeInTheDocument();
});

it("the first column is the row header by default", () => {
  render(<TableBase aria-label="Projects" columns={columns} rows={rows} getRowId={getRowId} classes={c} />);
  expect(screen.getAllByRole("rowheader").map((h) => h.textContent)).toEqual(["Aurora", "Borealis", "Cirrus"]);
});

it("an explicit isRowHeader wins and only the first flagged one counts", () => {
  const flagged: TableColumn<Project>[] = [
    { id: "name", label: "Name" },
    { id: "users", label: "Users", isRowHeader: true },
    { id: "shipped", label: "Shipped", isRowHeader: true },
  ];
  render(<TableBase aria-label="Projects" columns={flagged} rows={rows} getRowId={getRowId} classes={c} />);
  expect(screen.getAllByRole("rowheader").map((h) => h.textContent)).toEqual(["12", "3", ""]);
});

it("align end adds the end class to header and cells", () => {
  render(<TableBase aria-label="Projects" columns={columns} rows={rows} getRowId={getRowId} classes={c} />);
  const [name, users] = screen.getAllByRole("columnheader");
  expect(users).toHaveClass("end");
  expect(name).not.toHaveClass("end");
  expect(screen.getByRole("gridcell", { name: "12" })).toHaveClass("end");
  expect(screen.getAllByRole("rowheader")[0]).not.toHaveClass("end");
});

it("render overrides the field and null renders empty", () => {
  const custom: TableColumn<Project>[] = [
    { id: "name", label: "Name", render: (r) => <b>{r.name}!</b> },
    { id: "users", label: "Users" },
  ];
  render(<TableBase aria-label="Projects" columns={custom} rows={rows} getRowId={getRowId} classes={c} />);
  expect(screen.getByText("Aurora!")).toBeInTheDocument();
  const last = screen.getAllByRole("row")[3]!;
  const cell = within(last).getAllByRole("gridcell")[0]!;
  expect(cell.textContent).toBe("");
  expect(screen.queryByText("null")).not.toBeInTheDocument();
});

it("Date fields render as a locale date", () => {
  render(<TableBase aria-label="Projects" columns={columns} rows={rows} getRowId={getRowId} classes={c} />);
  expect(screen.getAllByRole("gridcell", { name: new Date("2026-01-02").toLocaleDateString() })).toHaveLength(1);
});

it("shows emptyState and keeps the headers when there are no rows", () => {
  render(
    <TableBase
      aria-label="Projects"
      columns={columns}
      rows={[]}
      getRowId={getRowId}
      emptyState="No projects yet"
      classes={c}
    />,
  );
  expect(screen.getByText("No projects yet")).toBeInTheDocument();
  expect(screen.getAllByRole("columnheader")).toHaveLength(3);
});

it("columns=[] does not throw", () => {
  expect(() =>
    render(<TableBase aria-label="Projects" columns={[]} rows={rows} getRowId={getRowId} classes={c} />),
  ).not.toThrow();
});

it("className and ref land on the wrapper", () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <TableBase
      aria-label="Projects"
      columns={columns}
      rows={rows}
      getRowId={getRowId}
      className="mt-4"
      ref={ref}
      classes={c}
    />,
  );
  expect(ref.current).toHaveClass("w", "mt-4");
  expect(ref.current).toContainElement(screen.getByRole("grid"));
});

it("requires an accessible name (type test)", () => {
  // Compile-time only: never rendered.
  const unused = () => (
    // @ts-expect-error a table needs aria-label or aria-labelledby
    <TableBase columns={columns} rows={rows} getRowId={getRowId} classes={c} />
  );
  expect(typeof unused).toBe("function");
});
