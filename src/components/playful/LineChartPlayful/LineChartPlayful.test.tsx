import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { LineChartPlayful } from "./LineChartPlayful";

const months = ["Jan", "Feb", "Mar"];
const series = (ids: string[]) =>
  ids.map((id, s) => ({ id, label: id, data: months.map((label, i) => ({ label, value: (s + 1) * 10 + i })) }));

const lines = (c: HTMLElement) => [...c.querySelectorAll("path[data-chart-line]")];

it("is a figure named by its title with a data table", () => {
  render(<LineChartPlayful title="Visits" series={series(["A"])} />);
  expect(screen.getByRole("figure", { name: "Visits" })).toBeInTheDocument();
  expect(screen.getByRole("table", { name: "Visits" })).toBeInTheDocument();
});

it("colours each series and casts it in ink", () => {
  const { container } = render(<LineChartPlayful title="Visits" series={series(["A", "B", "C"])} />);
  const l = lines(container);
  expect(l).toHaveLength(6);
  const colours = ["stroke-bh-red", "stroke-bh-blue", "stroke-bh-yellow"];
  colours.forEach((cls, i) => {
    expect(l[i * 2]).toHaveClass("stroke-bh-ink");
    expect(l[i * 2 + 1]).toHaveClass(cls);
  });
  for (const p of container.querySelectorAll("[data-chart-mark]")) expect(p).toHaveClass("stroke-bh-ink");
});

it("takes a custom colour cycle and has no gridlines", () => {
  const { container } = render(
    <LineChartPlayful title="Visits" series={series(["A", "B"])} colors={["navy", "pink"]} />,
  );
  const l = lines(container);
  expect(l[1]).toHaveClass("stroke-bh-navy");
  expect(l[3]).toHaveClass("stroke-bh-pink");
  expect(container.querySelectorAll("[data-chart-grid]")).toHaveLength(0);
  expect(container.querySelectorAll("[data-chart-baseline]")).toHaveLength(1);
});

it("accepts the one-series data shorthand", () => {
  render(<LineChartPlayful title="Visits" data={months.map((label, i) => ({ label, value: i }))} />);
  expect(screen.getByRole("table")).toBeInTheDocument();
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<LineChartPlayful title="Visits" series={series(["A"])} className="extra" ref={ref} />);
  expect(screen.getByRole("figure")).toHaveClass("extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
