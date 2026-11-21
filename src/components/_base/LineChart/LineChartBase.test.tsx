import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ChartDatum, ChartSeries } from "../../../lib/chartTypes";
import { LineChartBase, type LineChartBaseProps, type LineChartClasses } from "./LineChartBase";

const classes: LineChartClasses = {
  root: "root",
  caption: "caption",
  plot: "plot",
  tooltip: "tip",
  tick: "tick",
  baseline: "base",
  grid: "grid",
  valueLabel: "vlabel",
  line: () => "line",
  casing: "",
  point: () => "point",
};
const data = [
  { label: "Jan", value: 10 },
  { label: "Feb", value: 20 },
  { label: "Mar", value: 15 },
  { label: "Apr", value: 30 },
];

type TestProps = Partial<Omit<LineChartBaseProps, "data" | "series">> & {
  data?: ChartDatum[];
  series?: ChartSeries[];
};
const line = (props: TestProps = {}) => {
  const merged = { title: "Visits", data, classes, gridlines: false, ...props };
  return <LineChartBase {...(merged as LineChartBaseProps)} />;
};
const renderLine = (props: TestProps = {}) => render(line(props));

const q = (c: HTMLElement, sel: string) => [...c.querySelectorAll(sel)];
const svgText = (c: HTMLElement) => q(c, "svg text").map((t) => t.textContent);
const tableRows = () =>
  within(screen.getByRole("table"))
    .getAllByRole("row")
    .map((r) => [...r.querySelectorAll("th, td")].map((c) => c.textContent));

const visits = { id: "v", label: "Visits", data: [{ label: "Jan", value: 10 }, { label: "Feb", value: 20 }] };
const sales = { id: "s", label: "Sales", data: [{ label: "Jan", value: 5 }, { label: "Feb", value: 8 }] };

it("draws a path through every point of a series", () => {
  const { container } = renderLine();
  const paths = q(container, "path[data-chart-line]");
  expect(paths).toHaveLength(1);
  const d = paths[0]!.getAttribute("d")!;
  expect(d.startsWith("M")).toBe(true);
  expect(d.match(/L/g)).toHaveLength(3);
  expect(q(container, "[data-chart-mark]")).toHaveLength(4);
});

it("caps the chart at three series", () => {
  const four = ["a", "b", "c", "d"].map((id) => ({ id, label: id.toUpperCase(), data }));
  const { container } = renderLine({ data: undefined, series: four });
  expect(q(container, "path[data-chart-line]")).toHaveLength(3);
  expect(tableRows()[0]).toHaveLength(4);
});

it("builds one table row per category with a column per series", () => {
  renderLine({
    data: undefined,
    series: [visits, { id: "s", label: "Sales", data: [{ label: "Jan", value: 5 }] }],
  });
  expect(tableRows()).toEqual([
    ["Label", "Visits", "Sales"],
    ["Jan", "10", "5"],
    ["Feb", "20", "—"],
  ]);
});

it("treats data as a single series labelled Value", () => {
  renderLine();
  expect(tableRows()[0]).toEqual(["Label", "Value"]);
});

it("does not force zero on the value axis", () => {
  const { container } = renderLine({
    data: [{ label: "A", value: 100 }, { label: "B", value: 120 }],
  });
  const ticks = svgText(container).filter((t) => /^\d+$/.test(t!));
  expect(ticks[0]).toBe("100");
  expect(ticks[ticks.length - 1]).toBe("120");
});

it("handles a single point, flat data, empty data and NaN without NaN in the markup", () => {
  const one = renderLine({ data: [{ label: "A", value: 3 }] });
  expect(q(one.container, "[data-chart-mark]")).toHaveLength(1);
  expect(q(one.container, "path[data-chart-line]")).toHaveLength(0);
  expect(one.container.innerHTML).not.toContain("NaN");
  one.unmount();

  const flat = renderLine({ data: [{ label: "A", value: 5 }, { label: "B", value: 5 }, { label: "C", value: 5 }] });
  expect(q(flat.container, "path[data-chart-line]")).toHaveLength(1);
  expect(flat.container.innerHTML).not.toContain("NaN");
  flat.unmount();

  const empty = renderLine({ data: [] });
  expect(tableRows()).toHaveLength(1);
  expect(empty.container.innerHTML).not.toContain("NaN");
  empty.unmount();

  const nan = renderLine({ data: [{ label: "A", value: NaN }, { label: "B", value: 2 }] });
  expect(within(screen.getByRole("table")).getByRole("cell", { name: "—" })).toBeInTheDocument();
  expect(nan.container.innerHTML).not.toContain("NaN");
});

it("draws a casing path under each line only when the skin gives one", () => {
  const withCasing = renderLine({
    data: undefined,
    series: [visits, sales],
    classes: { ...classes, casing: "stroke-bh-ink", line: (i) => `line${i}` },
  });
  const paths = q(withCasing.container, "path[data-chart-line]");
  expect(paths).toHaveLength(4);
  expect(paths[0]).toHaveClass("stroke-bh-ink");
  expect(paths[1]).toHaveClass("line0");
  expect(paths[2]).toHaveClass("stroke-bh-ink");
  expect(paths[3]).toHaveClass("line1");
  withCasing.unmount();

  const without = renderLine({ data: undefined, series: [visits, sales] });
  expect(q(without.container, "path[data-chart-line]")).toHaveLength(2);
});

it("flags the highlighted point on the first series only", () => {
  const point = vi.fn((_s: number, _h: boolean) => "point");
  const { container } = renderLine({
    data: undefined,
    series: [visits, sales],
    highlight: "Feb",
    classes: { ...classes, point },
  });
  expect(point.mock.calls.filter(([s, h]) => s === 0 && h)).toHaveLength(1);
  expect(point.mock.calls.filter(([s, h]) => s === 1 && h)).toHaveLength(0);
  const labels = q(container, "[data-chart-label]");
  expect(labels).toHaveLength(1);
  expect(labels[0]).toHaveTextContent("20");
});

it("shows one tooltip per hovered category with every series value", async () => {
  const user = userEvent.setup();
  const multi = renderLine({ data: undefined, series: [visits, sales] });
  const hits = q(multi.container, "rect[data-chart-hit]");
  expect(screen.queryByText("Feb: Visits 20, Sales 8")).toBeNull();
  await user.hover(hits[1]!);
  expect(screen.getByText("Feb: Visits 20, Sales 8")).toHaveAttribute("aria-hidden", "true");
  await user.unhover(hits[1]!);
  expect(screen.queryByText("Feb: Visits 20, Sales 8")).toBeNull();
  multi.unmount();

  const single = renderLine({ data: [{ label: "Jan", value: 10 }, { label: "Feb", value: 20 }] });
  await user.hover(q(single.container, "rect[data-chart-hit]")[1]!);
  expect(screen.getByText("Feb: 20")).toBeInTheDocument();
});

it("thins crowded category labels but keeps every table row", () => {
  const many = Array.from({ length: 12 }, (_, i) => ({ label: `September ${i}`, value: i + 1 }));
  const { container } = renderLine({ data: many });
  const cats = q(container, "svg text[data-chart-category]");
  expect(cats.length).toBeGreaterThan(0);
  expect(cats.length).toBeLessThan(12);
  expect(tableRows()).toHaveLength(13);
});

it("draws gridlines only when asked, and always the baseline", () => {
  const withGrid = renderLine({ gridlines: true });
  expect(q(withGrid.container, "[data-chart-grid]").length).toBeGreaterThan(1);
  expect(q(withGrid.container, "[data-chart-baseline]")).toHaveLength(1);
  withGrid.unmount();
  const without = renderLine();
  expect(q(without.container, "[data-chart-grid]")).toHaveLength(0);
});

it("keeps the accessibility contract", () => {
  const { container } = renderLine({ highlight: "Feb" });
  expect(screen.getByRole("figure", { name: "Visits" })).toBeInTheDocument();
  const svg = container.querySelector("svg")!;
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg.querySelectorAll("a, button, [tabindex]")).toHaveLength(0);
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  renderLine({ className: "extra", ref });
  expect(screen.getByRole("figure")).toHaveClass("root", "extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
