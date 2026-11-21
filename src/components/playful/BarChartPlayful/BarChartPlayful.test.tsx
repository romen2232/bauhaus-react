import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { BarChartPlayful } from "./BarChartPlayful";

const data = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 40 },
  { label: "Mar", value: 25 },
  { label: "Apr", value: 31 },
];
const marks = (c: HTMLElement) => [...c.querySelectorAll("rect[data-chart-mark]")];

it("is a figure named by its title with a data table", () => {
  render(<BarChartPlayful title="Visits" data={data} />);
  expect(screen.getByRole("figure", { name: "Visits" })).toBeInTheDocument();
  expect(screen.getByRole("table", { name: "Visits" })).toBeInTheDocument();
});

it("cycles the colours, each bar outlined in ink", () => {
  const { container } = render(<BarChartPlayful title="Visits" data={data} />);
  const m = marks(container);
  expect(m[0]).toHaveClass("fill-bh-red");
  expect(m[1]).toHaveClass("fill-bh-blue");
  expect(m[2]).toHaveClass("fill-bh-yellow");
  expect(m[3]).toHaveClass("fill-bh-red");
  for (const bar of m) expect(bar).toHaveClass("stroke-bh-ink", "stroke-2");
});

it("takes a custom colour cycle", () => {
  const { container } = render(<BarChartPlayful title="Visits" data={data} colors={["navy", "pink"]} />);
  const m = marks(container);
  expect(m[0]).toHaveClass("fill-bh-navy");
  expect(m[1]).toHaveClass("fill-bh-pink");
  expect(m[2]).toHaveClass("fill-bh-navy");
});

it("falls back to the default colours for an empty cycle", () => {
  const { container } = render(<BarChartPlayful title="Visits" data={data} colors={[]} />);
  expect(marks(container)[0]).toHaveClass("fill-bh-red");
});

it("has the baseline but no gridlines", () => {
  const { container } = render(<BarChartPlayful title="Visits" data={data} />);
  expect(container.querySelectorAll("[data-chart-baseline]")).toHaveLength(1);
  expect(container.querySelectorAll("[data-chart-grid]")).toHaveLength(0);
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<BarChartPlayful title="Visits" data={data} className="extra" ref={ref} />);
  expect(screen.getByRole("figure")).toHaveClass("extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
