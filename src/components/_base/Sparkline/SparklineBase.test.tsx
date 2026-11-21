import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SparklineBase, type SparklineClasses, type SparklineProps } from "./SparklineBase";

const classes: SparklineClasses = {
  root: "root",
  caption: "caption",
  plot: "plot",
  line: "line",
  casing: "",
  dot: (isHighlighted) => (isHighlighted ? "dot-hi" : "dot"),
};
const data = [
  { label: "Jan", value: 10 },
  { label: "Feb", value: 20 },
  { label: "Mar", value: 15 },
];

const renderSpark = (props: Partial<SparklineProps> = {}, extra: Partial<SparklineClasses> = {}) =>
  render(<SparklineBase title="Trend" data={data} {...props} classes={{ ...classes, ...extra }} />);

const q = (c: HTMLElement, sel: string) => [...c.querySelectorAll(sel)];
const tableRows = () =>
  within(screen.getByRole("table"))
    .getAllByRole("row")
    .map((r) => [...r.querySelectorAll("th, td")].map((c) => c.textContent));

it("draws a line and an end dot, with the same values in a table", () => {
  const { container } = renderSpark();
  expect(q(container, "path[data-chart-line]")).toHaveLength(1);
  expect(q(container, "[data-chart-mark]")).toHaveLength(1);
  expect(tableRows()).toEqual([
    ["Label", "Value"],
    ["Jan", "10"],
    ["Feb", "20"],
    ["Mar", "15"],
  ]);
});

it("draws a casing path under the line when the skin asks for one", () => {
  const { container } = renderSpark({}, { casing: "casing" });
  expect(q(container, "path[data-chart-line]")).toHaveLength(2);
});

it("puts the dot on the highlighted label and ignores unknown labels", () => {
  const at = (props: Partial<SparklineProps>) => {
    const r = renderSpark(props);
    const mark = q(r.container, "[data-chart-mark]")[0]!;
    const cx = mark.getAttribute("cx");
    const flagged = mark.getAttribute("class");
    r.unmount();
    return { cx, flagged };
  };
  const first = at({ highlight: "Jan" });
  const middle = at({ highlight: "Feb" });
  const last = at({});
  expect(middle.cx).not.toBe(first.cx);
  expect(middle.cx).not.toBe(last.cx);
  expect(first.flagged).toBe("dot-hi");
  expect(at({ highlight: "Nope" }).cx).toBe(last.cx);
});

it("survives one point, flat data, empty data and NaN", () => {
  const one = renderSpark({ data: [{ label: "A", value: 3 }] });
  expect(q(one.container, "[data-chart-mark]")).toHaveLength(1);
  expect(one.container.innerHTML).not.toContain("NaN");
  one.unmount();

  const flat = renderSpark({ data: [5, 5, 5].map((value, i) => ({ label: `P${i}`, value })) });
  const d = flat.container.querySelector("path[data-chart-line]")!.getAttribute("d")!;
  const ys = [...d.matchAll(/[ML][^,]+,([^ML]+)/g)].map((m) => m[1]);
  expect(ys).toHaveLength(3);
  expect(new Set(ys).size).toBe(1);
  expect(flat.container.innerHTML).not.toContain("NaN");
  flat.unmount();

  const empty = renderSpark({ data: [] });
  expect(q(empty.container, "[data-chart-mark]")).toHaveLength(0);
  expect(tableRows()).toEqual([["Label", "Value"]]);
  expect(empty.container.innerHTML).not.toContain("NaN");
  empty.unmount();

  const nan = renderSpark({ data: [{ label: "A", value: 1 }, { label: "B", value: NaN }, { label: "C", value: 3 }] });
  expect(tableRows()[2]).toEqual(["B", "—"]);
  expect(nan.container.innerHTML).not.toContain("NaN");
});

it("applies formatValue to the table", () => {
  renderSpark({ formatValue: (n) => `${n}%` });
  expect(tableRows()[1]).toEqual(["Jan", "10%"]);
});

it("has no tooltip, axes or hit areas", async () => {
  const user = userEvent.setup();
  const { container } = renderSpark();
  expect(q(container, "[data-chart-hit]")).toHaveLength(0);
  expect(q(container, "svg text")).toHaveLength(0);
  await user.hover(q(container, "svg")[0]!);
  await user.hover(q(container, "[data-chart-mark]")[0]!);
  expect(container.querySelector('[aria-hidden="true"]:not(svg)')).toBeNull();
});

it("is 32px high by default and keeps the accessibility contract", () => {
  const { container } = renderSpark();
  expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 320 32");
  expect(screen.getByRole("figure", { name: "Trend" })).toBeInTheDocument();
  const svg = container.querySelector("svg")!;
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg.querySelectorAll("[tabindex], a, button")).toHaveLength(0);
});

it("hides the title visually on request", () => {
  renderSpark({ hideTitle: true });
  expect(screen.getByText("Trend", { selector: "figcaption" })).toHaveClass("sr-only");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  renderSpark({ className: "extra", ref });
  expect(screen.getByRole("figure")).toHaveClass("extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
