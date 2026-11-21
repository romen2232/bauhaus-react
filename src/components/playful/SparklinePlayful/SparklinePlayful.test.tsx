import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { SparklinePlayful } from "./SparklinePlayful";

const data = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 40 },
  { label: "Mar", value: 25 },
];
const dot = (c: HTMLElement) => c.querySelector("[data-chart-mark]")!;
const line = (c: HTMLElement) => c.querySelector("path[data-chart-line]")!;

it("is a figure named by its title with a data table", () => {
  render(<SparklinePlayful title="Trend" data={data} />);
  expect(screen.getByRole("figure", { name: "Trend" })).toBeInTheDocument();
  expect(screen.getByRole("table", { name: "Trend" })).toBeInTheDocument();
});

it("draws an ink line with a red outlined end dot by default", () => {
  const { container } = render(<SparklinePlayful title="Trend" data={data} />);
  expect(line(container)).toHaveClass("stroke-bh-ink");
  expect(dot(container)).toHaveClass("fill-bh-red", "stroke-bh-ink");
});

it("uses the color prop", () => {
  const { container } = render(<SparklinePlayful title="Trend" data={data} color="blue" />);
  expect(dot(container)).toHaveClass("fill-bh-blue");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<SparklinePlayful title="Trend" data={data} className="extra" ref={ref} />);
  expect(screen.getByRole("figure")).toHaveClass("extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
