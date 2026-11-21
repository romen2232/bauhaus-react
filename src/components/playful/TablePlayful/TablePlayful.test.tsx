import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TablePlayful } from "./TablePlayful";
import { TagPlayful } from "../TagPlayful/TagPlayful";
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
    allowsSorting: true,
    sortValue: (r) => (r.status === "live" ? 2 : 1),
    render: (r) => <TagPlayful className="border-2 border-bh-ink">{r.status === "live" ? "Live" : "Draft"}</TagPlayful>,
  },
  { id: "users", label: "Users", align: "end", allowsSorting: true },
];

const table = (props = {}) => (
  <TablePlayful aria-label="Projects" columns={columns} rows={rows} getRowId={(r) => r.slug} {...props} />
);

it("is a named grid with sortable headers", async () => {
  render(table());
  expect(screen.getByRole("grid", { name: "Projects" })).toBeInTheDocument();
  const users = screen.getByRole("columnheader", { name: "Users" });
  await userEvent.click(users);
  expect(users).toHaveAttribute("aria-sort", "ascending");
});

it("has the Playful frame, yellow header and 2px rules", () => {
  const { container } = render(table());
  expect(container.firstElementChild).toHaveClass("border-2", "border-bh-ink", "shadow-bh-hard", "overflow-x-auto");
  expect(screen.getAllByRole("columnheader")[0]).toHaveClass("bg-bh-yellow");
  expect(screen.getAllByRole("row")[1]).toHaveClass("border-b-2");
});

it("numeric columns use tabular numerals", () => {
  render(table());
  expect(screen.getByRole("gridcell", { name: "12" })).toHaveClass("tabular-nums", "text-end");
});

it("a status render cell using TagPlayful with a 2px border renders as a pill and sorts by sortValue", async () => {
  render(table());
  expect(screen.getByText("Live")).toBeVisible();
  expect(screen.getByText("Live")).toHaveClass("border-2");
  await userEvent.click(screen.getByRole("columnheader", { name: "Status" }));
  expect(screen.getAllByRole("rowheader").map((h) => h.textContent)).toEqual(["Borealis", "Aurora"]);
});

it("className and ref land on the wrapper", () => {
  const ref = createRef<HTMLDivElement>();
  render(table({ className: "mt-4", ref }));
  expect(ref.current).toHaveClass("overflow-x-auto", "mt-4");
  expect(ref.current).toContainElement(screen.getByRole("grid"));
});
