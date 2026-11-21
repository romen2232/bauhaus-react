import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BarChartBase, type BarChartBaseProps, type BarChartClasses } from "./BarChartBase";

const classes: BarChartClasses = {
  root: "root",
  caption: "caption",
  plot: "plot",
  tooltip: "tip",
  tick: "tick",
  baseline: "base",
  grid: "grid",
  valueLabel: "vlabel",
  mark: () => "mark",
};
const data = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 40 },
];

const bar = (props: Partial<BarChartBaseProps> = {}) => (
  <BarChartBase title="Visits" data={data} classes={classes} gridlines={false} barRadius={0} {...props} />
);
const renderBar = (props: Partial<BarChartBaseProps> = {}) => render(bar(props));

const q = (c: HTMLElement, sel: string) => [...c.querySelectorAll(sel)];
const num = (el: Element, attr: string) => Number(el.getAttribute(attr));
const svgText = (c: HTMLElement) => q(c, "svg text").map((t) => t.textContent);

it("table matches the data", () => {
  renderBar();
  const tbl = screen.getByRole("table", { name: "Visits" });
  const rows = within(tbl).getAllByRole("row").map((r) => [...r.querySelectorAll("th, td")].map((c) => c.textContent));
  expect(rows).toEqual([["Label", "Value"], ["Jan", "12"], ["Feb", "40"]]);
});

it("draws one bar per datum, with heights proportional to the values", () => {
  const { container } = renderBar({
    data: [{ label: "A", value: 10 }, { label: "B", value: 20 }, { label: "C", value: 40 }],
  });
  const marks = q(container, "rect[data-chart-mark]");
  expect(marks).toHaveLength(3);
  const [a, b, c] = marks.map((m) => num(m, "height"));
  expect(b).toBeCloseTo(a! * 2);
  expect(c).toBeCloseTo(a! * 4);
});

it("draws the value axis with nice ticks and the category labels", () => {
  const { container } = renderBar({ data: [{ label: "Jan", value: 0 }, { label: "Feb", value: 40 }] });
  const texts = svgText(container);
  for (const t of ["0", "10", "20", "30", "40", "Jan", "Feb"]) expect(texts).toContain(t);
});

it("hangs negative bars below the baseline", () => {
  const { container } = renderBar({ data: [{ label: "A", value: -5 }, { label: "B", value: 10 }] });
  const baseline = q(container, "[data-chart-baseline]")[0]!;
  const Y = num(baseline, "y1");
  const [neg, pos] = q(container, "rect[data-chart-mark]");
  expect(num(neg!, "y")).toBeCloseTo(Y);
  expect(num(neg!, "height")).toBeGreaterThan(0);
  expect(num(pos!, "y") + num(pos!, "height")).toBeCloseTo(Y);
});

it("survives all-zero, empty and non-finite data without NaN", () => {
  const zero = renderBar({ data: [{ label: "A", value: 0 }, { label: "B", value: 0 }] });
  expect(q(zero.container, "rect[data-chart-mark]").map((m) => m.getAttribute("height"))).toEqual(["0", "0"]);
  expect(svgText(zero.container)).toEqual(expect.arrayContaining(["0", "1"]));
  expect(zero.container.innerHTML).not.toContain("NaN");
  zero.unmount();

  const empty = renderBar({ data: [] });
  expect(screen.getByRole("figure", { name: "Visits" })).toBeInTheDocument();
  expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(1);
  expect(empty.container.innerHTML).not.toContain("NaN");
  empty.unmount();

  const nan = renderBar({ data: [{ label: "Jan", value: NaN }] });
  expect(within(screen.getByRole("table")).getByRole("cell", { name: "—" })).toBeInTheDocument();
  expect(q(nan.container, "rect[data-chart-mark]")[0]).toHaveAttribute("height", "0");
  expect(nan.container.innerHTML).not.toContain("NaN");
});

it("prints value labels only on request, and always on the highlighted bar", () => {
  const plain = renderBar();
  expect(q(plain.container, "[data-chart-label]")).toHaveLength(0);
  plain.unmount();

  const hi = renderBar({ highlight: "Feb" });
  const labels = q(hi.container, "[data-chart-label]");
  expect(labels).toHaveLength(1);
  expect(labels[0]).toHaveTextContent("40");
  hi.unmount();

  const all = renderBar({ showValues: true });
  expect(q(all.container, "[data-chart-label]").map((l) => l.textContent)).toEqual(["12", "40"]);
});

it("asks the skin for each mark class, flagging only the highlighted one", () => {
  const mark = vi.fn((_i: number, h: boolean) => (h ? "hi" : "lo"));
  const withMark = { ...classes, mark };
  const a = renderBar({ classes: withMark, highlight: "Feb" });
  const marks = q(a.container, "rect[data-chart-mark]");
  expect(marks[0]).toHaveClass("lo");
  expect(marks[1]).toHaveClass("hi");
  a.unmount();

  const b = renderBar({ classes: withMark, highlight: "Nope" });
  expect(q(b.container, "rect[data-chart-mark].hi")).toHaveLength(0);
  b.unmount();

  const dup = [{ label: "X", value: 1 }, { label: "X", value: 2 }];
  const c = renderBar({ classes: withMark, data: dup, highlight: "X" });
  expect(q(c.container, "rect[data-chart-mark].hi")).toHaveLength(1);
  expect(q(c.container, "rect[data-chart-mark]")[0]).toHaveClass("hi");
});

it("shows a tooltip on pointer hover and removes it on leave", async () => {
  const user = userEvent.setup();
  const { container } = renderBar();
  expect(screen.queryByText("Feb: 40")).toBeNull();
  const hits = q(container, "rect[data-chart-hit]");
  await user.hover(hits[1]!);
  expect(screen.getByText("Feb: 40")).toHaveAttribute("aria-hidden", "true");
  await user.unhover(hits[1]!);
  expect(screen.queryByText("Feb: 40")).toBeNull();
});

it("formats values with formatValue", async () => {
  const user = userEvent.setup();
  const { container } = renderBar({ formatValue: (v) => "$" + v });
  await user.hover(q(container, "rect[data-chart-hit]")[1]!);
  expect(screen.getByText("Feb: $40")).toBeInTheDocument();
});

it("thins crowded category labels but keeps every table row", () => {
  const many = Array.from({ length: 12 }, (_, i) => ({ label: "September", value: i + 1 }));
  const { container } = renderBar({ data: many });
  const cats = q(container, "svg text[data-chart-category]");
  expect(cats.length).toBeGreaterThan(0);
  expect(cats.length).toBeLessThan(12);
  expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(13);
});

it("draws gridlines only when asked, and always the baseline", () => {
  const withGrid = renderBar({ gridlines: true, data: [{ label: "Jan", value: 0 }, { label: "Feb", value: 40 }] });
  expect(q(withGrid.container, "[data-chart-grid]")).toHaveLength(5);
  expect(q(withGrid.container, "[data-chart-baseline]")).toHaveLength(1);
  withGrid.unmount();
  const without = renderBar();
  expect(q(without.container, "[data-chart-grid]")).toHaveLength(0);
  expect(q(without.container, "[data-chart-baseline]")).toHaveLength(1);
});

it("applies barRadius as rx", () => {
  const { container } = renderBar({ barRadius: 6 });
  for (const m of q(container, "rect[data-chart-mark]")) expect(m).toHaveAttribute("rx", "6");
});

it("keeps the accessibility contract", () => {
  const { container } = renderBar({ highlight: "Feb", showValues: true });
  expect(screen.getByRole("figure", { name: "Visits" })).toBeInTheDocument();
  const svg = container.querySelector("svg")!;
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg.querySelectorAll("a, button, [tabindex]")).toHaveLength(0);
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  renderBar({ className: "extra", ref });
  expect(screen.getByRole("figure")).toHaveClass("root", "extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
