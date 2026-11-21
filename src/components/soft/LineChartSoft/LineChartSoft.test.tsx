import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { LineChartSoft } from "./LineChartSoft";

const months = ["Jan", "Feb", "Mar"];
const series = (ids: string[]) =>
  ids.map((id, s) => ({ id, label: id, data: months.map((label, i) => ({ label, value: (s + 1) * 10 + i })) }));

const lines = (c: HTMLElement) => [...c.querySelectorAll("path[data-chart-line]")];
const points = (c: HTMLElement) => [...c.querySelectorAll("[data-chart-mark]")];

it("is a figure named by its title with a data table", () => {
  render(<LineChartSoft title="Visits" series={series(["A"])} />);
  expect(screen.getByRole("figure", { name: "Visits" })).toBeInTheDocument();
  expect(screen.getByRole("table", { name: "Visits" })).toBeInTheDocument();
});

it("tells series apart without colour and highlights one point in the tone", () => {
  const { container } = render(<LineChartSoft title="Visits" series={series(["A", "B", "C"])} highlight="Feb" />);
  const l = lines(container);
  expect(l).toHaveLength(3);
  for (const path of l) expect(path).toHaveClass("stroke-bh-charcoal");
  expect(l[0]!.getAttribute("class")).not.toContain("dasharray");
  expect(l[1]!.getAttribute("class")).toContain("[stroke-dasharray:6_4]");
  expect(l[2]!.getAttribute("class")).toContain("[stroke-dasharray:1_4]");

  const p = points(container);
  expect(p.filter((x) => x.classList.contains("fill-bh-blue"))).toHaveLength(1);
  expect(p[1]).toHaveClass("fill-bh-blue");
  expect(container.querySelectorAll("[data-chart-label]")).toHaveLength(1);
});

it("uses the tone prop", () => {
  const { container } = render(<LineChartSoft title="Visits" series={series(["A"])} highlight="Feb" tone="red" />);
  expect(points(container)[1]).toHaveClass("fill-bh-red");
});

it("has no gridlines", () => {
  const { container } = render(<LineChartSoft title="Visits" series={series(["A"])} />);
  expect(container.querySelectorAll("[data-chart-grid]")).toHaveLength(0);
});

it("accepts the one-series data shorthand", () => {
  render(<LineChartSoft title="Visits" data={months.map((label, i) => ({ label, value: i }))} />);
  expect(screen.getByRole("table")).toBeInTheDocument();
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<LineChartSoft title="Visits" series={series(["A"])} className="extra" ref={ref} />);
  expect(screen.getByRole("figure")).toHaveClass("extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
