import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { SparklineSwiss } from "./SparklineSwiss";

const data = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 40 },
  { label: "Mar", value: 25 },
];

it("is a figure named by its title with a data table", () => {
  render(<SparklineSwiss title="Trend" data={data} />);
  expect(screen.getByRole("figure", { name: "Trend" })).toBeInTheDocument();
  expect(screen.getByRole("table", { name: "Trend" })).toBeInTheDocument();
});

it("draws a 1px ink line with a single accent dot", () => {
  const { container } = render(<SparklineSwiss title="Trend" data={data} />);
  expect(container.querySelector("path[data-chart-line]")).toHaveClass("stroke-bh-ink", "stroke-1");
  expect(container.querySelector("[data-chart-mark]")).toHaveClass("fill-bh-accent");
  expect(container.querySelectorAll('[class*="bh-accent"]')).toHaveLength(1);
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<SparklineSwiss title="Trend" data={data} className="extra" ref={ref} />);
  expect(screen.getByRole("figure")).toHaveClass("extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
