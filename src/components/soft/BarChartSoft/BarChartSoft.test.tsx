import { render } from "@testing-library/react";
import { BarChartSoft } from "./BarChartSoft";

const data = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 40 },
];
const marks = (c: HTMLElement) => [...c.querySelectorAll("rect[data-chart-mark]")];

it("draws charcoal bars and one highlighted bar in the default blue tone, labelled", () => {
  const { container } = render(<BarChartSoft title="Visits" data={data} highlight="Feb" />);
  const m = marks(container);
  expect(m[1]).toHaveClass("fill-bh-blue");
  expect(m[0]).toHaveClass("fill-bh-charcoal");
  const labels = container.querySelectorAll("[data-chart-label]");
  expect(labels).toHaveLength(1);
  expect(labels[0]).toHaveTextContent("40");
});

it("uses the tone prop", () => {
  const { container } = render(<BarChartSoft title="Visits" data={data} highlight="Feb" tone="red" />);
  expect(marks(container)[1]).toHaveClass("fill-bh-red");
});

it("draws every bar in charcoal without a highlight", () => {
  const { container } = render(<BarChartSoft title="Visits" data={data} />);
  for (const m of marks(container)) expect(m).toHaveClass("fill-bh-charcoal");
});

it("has no gridlines", () => {
  const { container } = render(<BarChartSoft title="Visits" data={data} />);
  expect(container.querySelectorAll("[data-chart-grid]")).toHaveLength(0);
});
