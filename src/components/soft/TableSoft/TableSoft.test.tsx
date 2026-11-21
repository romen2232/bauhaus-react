import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableSoft } from "./TableSoft";
import type { TableColumn } from "../../_base/Table/tableTypes";

type Project = { slug: string; name: string; users: number };

const rows: Project[] = [
  { slug: "a", name: "Aurora", users: 12 },
  { slug: "b", name: "Borealis", users: 3 },
];

const columns: TableColumn<Project>[] = [
  { id: "name", label: "Name", allowsSorting: true },
  {
    id: "users",
    label: "Users",
    align: "end",
    render: (r) => (
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" data-testid="dot" className="size-2 rounded-full bg-bh-blue" />
        {r.users > 5 ? "Live" : "Draft"}
      </span>
    ),
  },
];

const table = (props = {}) => (
  <TableSoft aria-label="Projects" columns={columns} rows={rows} getRowId={(r) => r.slug} {...props} />
);

it("is a named grid whose header click sorts", async () => {
  render(table());
  expect(screen.getByRole("grid", { name: "Projects" })).toBeInTheDocument();
  const name = screen.getByRole("columnheader", { name: "Name" });
  await userEvent.click(name);
  expect(name).toHaveAttribute("aria-sort", "ascending");
});

it("sits on a sand panel with soft radius", () => {
  const { container } = render(table());
  expect(container.firstElementChild).toHaveClass("bg-bh-sand", "rounded-bh-soft", "overflow-x-auto");
});

it("has no rules", () => {
  const { container } = render(table({ onRowAction: () => {} }));
  const tokens = [container, ...container.querySelectorAll("*")].flatMap((el) =>
    (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean),
  );
  const base = (token: string) => token.split(":").pop()!;
  // `border-collapse` / `border-separate` are table layout, not rules.
  const rules = tokens.filter((t) => /^(border|divide)(-|$)/.test(base(t)) && !/^border-(collapse|separate)$/.test(base(t)));
  expect(rules).toEqual([]);
});

it("alternate rows are lightened", () => {
  render(table());
  expect(screen.getAllByRole("row")[1]).toHaveClass("odd:bg-bh-paper/50");
});

it("a tone-dot status cell renders dot and word", () => {
  render(table());
  const cell = screen.getAllByRole("gridcell", { name: "Live" })[0]!;
  expect(cell).toBeInTheDocument();
  expect(cell.querySelector("[data-testid=dot]")).toHaveAttribute("aria-hidden", "true");
});

it("className and ref land on the wrapper", () => {
  const ref = createRef<HTMLDivElement>();
  render(table({ className: "mt-4", ref }));
  expect(ref.current).toHaveClass("rounded-bh-soft", "mt-4");
  expect(ref.current).toContainElement(screen.getByRole("grid"));
});
