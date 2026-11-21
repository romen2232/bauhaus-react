import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider } from "react-aria-components";
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

describe("sorting", () => {
  const sortable: TableColumn<Project>[] = [
    { id: "name", label: "Name", allowsSorting: true },
    { id: "users", label: "Users", allowsSorting: true, align: "end" },
    { id: "shipped", label: "Shipped" },
  ];
  const names = () => screen.getAllByRole("rowheader").map((h) => h.textContent);
  const header = (name: string) => screen.getByRole("columnheader", { name });
  const table = (props: Partial<Parameters<typeof TableBase<Project>>[0]> = {}) => (
    <TableBase aria-label="Projects" columns={sortable} rows={rows} getRowId={getRowId} classes={c} {...props} />
  );

  it("sortable columns expose aria-sort and unsortable ones do not", () => {
    render(table());
    expect(header("Name")).toHaveAttribute("aria-sort", "none");
    expect(header("Users")).toHaveAttribute("aria-sort", "none");
    expect(header("Shipped")).not.toHaveAttribute("aria-sort");
  });

  it("uncontrolled: clicking a header sorts ascending, then toggles descending, then ascending", async () => {
    render(table());
    await userEvent.click(header("Users"));
    expect(header("Users")).toHaveAttribute("aria-sort", "ascending");
    expect(names()).toEqual(["Borealis", "Aurora", "Cirrus"]);
    await userEvent.click(header("Users"));
    expect(header("Users")).toHaveAttribute("aria-sort", "descending");
    expect(names()).toEqual(["Aurora", "Borealis", "Cirrus"]);
    await userEvent.click(header("Users"));
    expect(header("Users")).toHaveAttribute("aria-sort", "ascending");
  });

  it("Enter on a focused sortable header sorts it", async () => {
    render(table());
    header("Name").focus();
    await userEvent.keyboard("{Enter}");
    expect(header("Name")).toHaveAttribute("aria-sort", "ascending");
  });

  it("defaultSortDescriptor sorts on first render", () => {
    render(table({ defaultSortDescriptor: { column: "name", direction: "descending" } }));
    expect(names()).toEqual(["Cirrus", "Borealis", "Aurora"]);
    expect(header("Name")).toHaveAttribute("aria-sort", "descending");
  });

  it("onSortChange is called with a string column and a direction", async () => {
    const onSortChange = vi.fn();
    render(table({ onSortChange }));
    await userEvent.click(header("Users"));
    expect(onSortChange).toHaveBeenCalledWith({ column: "users", direction: "ascending" });
  });

  it("controlled: rows keep the consumer's order and the descriptor drives aria-sort", async () => {
    const onSortChange = vi.fn();
    render(table({ sortDescriptor: { column: "users", direction: "descending" }, onSortChange }));
    expect(names()).toEqual(["Aurora", "Borealis", "Cirrus"]);
    expect(header("Users")).toHaveAttribute("aria-sort", "descending");
    await userEvent.click(header("Users"));
    expect(onSortChange).toHaveBeenCalledWith({ column: "users", direction: "ascending" });
    expect(header("Users")).toHaveAttribute("aria-sort", "descending");
  });

  it("shows a sort icon that follows the direction and marks the sorted column", async () => {
    const { container } = render(table());
    const icon = () => header("Users").querySelector("[aria-hidden]")!;
    expect(icon()).toHaveTextContent("↕");
    expect(icon()).toHaveClass("si");
    expect(header("Users")).not.toHaveClass("cs");
    await userEvent.click(header("Users"));
    expect(icon()).toHaveTextContent("↑");
    expect(header("Users")).toHaveClass("cs");
    await userEvent.click(header("Users"));
    expect(icon()).toHaveTextContent("↓");
    expect(header("Shipped").querySelector("[aria-hidden]")).toBeNull();
    expect(container).toBeTruthy();
  });

  it("a sortValue column sorts by the real value", async () => {
    type Task = { id: string; title: string; level: "high" | "low" };
    const tasks: Task[] = [
      { id: "1", title: "A", level: "high" },
      { id: "2", title: "B", level: "low" },
    ];
    const cols: TableColumn<Task>[] = [
      { id: "title", label: "Title" },
      {
        id: "level",
        label: "Level",
        allowsSorting: true,
        render: (t) => <span>{t.level}</span>,
        sortValue: (t) => (t.level === "high" ? 2 : 1),
      },
    ];
    render(<TableBase aria-label="Tasks" columns={cols} rows={tasks} getRowId={(t) => t.id} classes={c} />);
    await userEvent.click(screen.getByRole("columnheader", { name: "Level" }));
    expect(screen.getAllByRole("rowheader").map((h) => h.textContent)).toEqual(["B", "A"]);
  });

  it("new rows re-sort in place while sorted (uncontrolled)", () => {
    const props = { "aria-label": "Projects", columns: sortable, getRowId, classes: c };
    const { rerender } = render(
      <TableBase {...props} rows={rows} defaultSortDescriptor={{ column: "name", direction: "descending" }} />,
    );
    const extra = { slug: "d", name: "Delta", users: 1, shipped: new Date("2026-04-01") };
    rerender(
      <TableBase
        {...props}
        rows={[...rows, extra]}
        defaultSortDescriptor={{ column: "name", direction: "descending" }}
      />,
    );
    expect(names()).toEqual(["Delta", "Cirrus", "Borealis", "Aurora"]);
  });

  it("a descriptor for an unknown column does not crash", () => {
    const gone = { column: "gone", direction: "ascending" } as const;
    render(table({ defaultSortDescriptor: gone }));
    expect(names()).toEqual(["Aurora", "Borealis", "Cirrus"]);
    expect(header("Name")).toHaveAttribute("aria-sort", "none");
  });
});

describe("row actions", () => {
  const base = { "aria-label": "Projects", columns, getRowId, classes: c } as const;
  const bodyRows = () => screen.getAllByRole("row").slice(1);

  it("clicking a row calls onRowAction with the row object, and so does Enter", async () => {
    const onRowAction = vi.fn();
    render(<TableBase {...base} rows={rows} onRowAction={onRowAction} />);
    await userEvent.click(screen.getByRole("rowheader", { name: "Borealis" }));
    expect(onRowAction).toHaveBeenCalledWith(rows[1]);
    onRowAction.mockClear();
    bodyRows()[0]!.focus();
    await userEvent.keyboard("{Enter}");
    expect(onRowAction).toHaveBeenCalledWith(rows[0]);
  });

  it("onRowAction is not called for a row id that no longer exists", async () => {
    const onRowAction = vi.fn();
    const { rerender } = render(<TableBase {...base} rows={rows} onRowAction={onRowAction} />);
    rerender(<TableBase {...base} rows={rows.slice(0, 1)} onRowAction={onRowAction} />);
    expect(() => bodyRows()).not.toThrow();
    expect(onRowAction).not.toHaveBeenCalled();
  });

  it("getRowHref navigates through the router", async () => {
    const navigate = vi.fn();
    render(
      <RouterProvider navigate={navigate}>
        <TableBase {...base} rows={rows} getRowHref={(r) => `/p/${r.name.toLowerCase()}`} />
      </RouterProvider>,
    );
    await userEvent.click(screen.getByRole("rowheader", { name: "Aurora" }));
    expect(navigate).toHaveBeenCalledWith("/p/aurora", undefined);
  });

  it("only actionable rows carry rowActionable", () => {
    const plain = render(<TableBase {...base} rows={rows} />);
    for (const row of bodyRows()) expect(row).not.toHaveClass("ra");
    plain.unmount();
    render(<TableBase {...base} rows={rows} onRowAction={() => {}} />);
    for (const row of bodyRows()) expect(row).toHaveClass("ra");
    expect(screen.getAllByRole("row")[0]).not.toHaveClass("ra");
  });

  it("no selection checkboxes are rendered", () => {
    render(<TableBase {...base} rows={rows} onRowAction={() => {}} />);
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });

  it("rejects both getRowHref and onRowAction (type test)", () => {
    const unused = () => (
      // @ts-expect-error a table has links or actions, never both
      <TableBase {...base} rows={rows} getRowHref={() => "/x"} onRowAction={() => {}} />
    );
    expect(typeof unused).toBe("function");
  });
});
