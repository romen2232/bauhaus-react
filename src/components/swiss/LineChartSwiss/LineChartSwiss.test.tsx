import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { LineChartSwiss } from "./LineChartSwiss";

const months = ["Jan", "Feb", "Mar"];
const series = (ids: string[]) =>
  ids.map((id, s) => ({ id, label: id, data: months.map((label, i) => ({ label, value: (s + 1) * 10 + i })) }));

const lines = (c: HTMLElement) => [...c.querySelectorAll("path[data-chart-line]")];
const withAccent = (c: HTMLElement) =>
  [...c.querySelectorAll("*")].filter((el) => (el.getAttribute("class") ?? "").includes("bh-accent"));

it("is a figure named by its title with a data table", () => {
  render(<LineChartSwiss title="Visits" series={series(["A"])} />);
  expect(screen.getByRole("figure", { name: "Visits" })).toBeInTheDocument();
  expect(screen.getByRole("table", { name: "Visits" })).toBeInTheDocument();
});

it("uses ink, charcoal and muted-text lines and a single accent point", () => {
  const { container } = render(<LineChartSwiss title="Visits" series={series(["A", "B", "C"])} highlight="Feb" />);
  const l = lines(container);
  expect(l).toHaveLength(3);
  expect(l[0]).toHaveClass("stroke-bh-ink", "stroke-1");
  expect(l[1]).toHaveClass("stroke-bh-charcoal");
  expect(l[1]!.getAttribute("class")).toContain("[stroke-dasharray:6_4]");
  expect(l[2]).toHaveClass("stroke-bh-muted-text");
  expect(l[2]!.getAttribute("class")).toContain("[stroke-dasharray:1_4]");

  const accents = withAccent(container);
  expect(accents).toHaveLength(1);
  expect(accents[0]).toHaveClass("fill-bh-accent");
  expect(accents[0]).toBe(container.querySelectorAll("[data-chart-mark]")[1]);
  expect(container.innerHTML).not.toContain("text-bh-accent");
});

it("has no accent without a highlight", () => {
  const { container } = render(<LineChartSwiss title="Visits" series={series(["A"])} />);
  expect(withAccent(container)).toHaveLength(0);
});

it("draws 1px rule gridlines", () => {
  const { container } = render(<LineChartSwiss title="Visits" series={series(["A"])} />);
  const grid = [...container.querySelectorAll("[data-chart-grid]")];
  expect(grid.length).toBeGreaterThan(1);
  for (const g of grid) expect(g).toHaveClass("stroke-bh-rule");
});

it("accepts the one-series data shorthand", () => {
  render(<LineChartSwiss title="Visits" data={months.map((label, i) => ({ label, value: i }))} />);
  expect(screen.getByRole("table")).toBeInTheDocument();
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<LineChartSwiss title="Visits" series={series(["A"])} className="extra" ref={ref} />);
  expect(screen.getByRole("figure")).toHaveClass("extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
