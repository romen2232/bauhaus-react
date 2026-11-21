import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableSwiss } from "./TableSwiss";
import type { TableColumn } from "../../_base/Table/tableTypes";

type Project = { slug: string; name: string; status: "live" | "draft"; users: number };

const rows: Project[] = [
  { slug: "a", name: "Aurora", status: "live", users: 12 },
  { slug: "b", name: "Borealis", status: "draft", users: 3 },
];

const columns: TableColumn<Project>[] = [
  { id: "name", label: "Name", allowsSorting: true },
  {
    id: "status",
    label: "Status",
    render: (r) => (
      <span className={r.status === "live" ? "text-bh-ink" : "text-bh-muted-text"}>
        {r.status === "live" ? "Live" : "Draft"}
      </span>
    ),
  },
  { id: "users", label: "Users", align: "end" },
];

const table = (props = {}) => (
  <TableSwiss aria-label="Projects" columns={columns} rows={rows} getRowId={(r) => r.slug} {...props} />
);

it("is a named grid whose header click sorts", async () => {
  render(table());
  expect(screen.getByRole("grid", { name: "Projects" })).toBeInTheDocument();
  const name = screen.getByRole("columnheader", { name: "Name" });
  await userEvent.click(name);
  expect(name).toHaveAttribute("aria-sort", "ascending");
});

it("the sorted header turns ink", async () => {
  render(table());
  const name = screen.getByRole("columnheader", { name: "Name" });
  expect(name).toHaveClass("text-bh-muted-text");
  await userEvent.click(name);
  expect(name).toHaveClass("text-bh-ink");
  expect(name.querySelector("[aria-hidden]")).toHaveTextContent("↑");
});

it("has no outer frame", () => {
  const { container } = render(table());
  const tokens = (container.firstElementChild!.getAttribute("class") ?? "").split(/\s+/);
  expect(tokens.filter((t) => /^(border|shadow)/.test(t))).toEqual([]);
});

it("has a 1px ink header rule and 1px rule row rules", () => {
  render(table());
  expect(screen.getAllByRole("columnheader")[0]).toHaveClass("border-b", "border-bh-ink");
  expect(screen.getAllByRole("row")[1]).toHaveClass("border-b", "border-bh-rule");
});

it("numeric columns are end-aligned with tabular numerals", () => {
  render(table());
  expect(screen.getByRole("columnheader", { name: "Users" })).toHaveClass("text-end");
  expect(screen.getByRole("gridcell", { name: "12" })).toHaveClass("text-end", "tabular-nums");
});

it("a plain-text status cell moves muted-text to ink", () => {
  render(table());
  expect(screen.getByText("Live")).toHaveClass("text-bh-ink");
  expect(screen.getByText("Draft")).toHaveClass("text-bh-muted-text");
});

it("className and ref land on the wrapper", () => {
  const ref = createRef<HTMLDivElement>();
  render(table({ className: "mt-4", ref }));
  expect(ref.current).toHaveClass("overflow-x-auto", "mt-4");
  expect(ref.current).toContainElement(screen.getByRole("grid"));
});
