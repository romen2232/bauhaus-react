import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { SparklineSoft } from "./SparklineSoft";

const data = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 40 },
  { label: "Mar", value: 25 },
];
const dot = (c: HTMLElement) => c.querySelector("[data-chart-mark]")!;

it("is a figure named by its title with a data table", () => {
  render(<SparklineSoft title="Trend" data={data} />);
  expect(screen.getByRole("figure", { name: "Trend" })).toBeInTheDocument();
  expect(screen.getByRole("table", { name: "Trend" })).toBeInTheDocument();
});

it("draws a charcoal line with a blue end dot by default", () => {
  const { container } = render(<SparklineSoft title="Trend" data={data} />);
  expect(container.querySelector("path[data-chart-line]")).toHaveClass("stroke-bh-charcoal");
  expect(dot(container)).toHaveClass("fill-bh-blue");
});

it("uses the tone prop", () => {
  const { container } = render(<SparklineSoft title="Trend" data={data} tone="red" />);
  expect(dot(container)).toHaveClass("fill-bh-red");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<SparklineSoft title="Trend" data={data} className="extra" ref={ref} />);
  expect(screen.getByRole("figure")).toHaveClass("extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
