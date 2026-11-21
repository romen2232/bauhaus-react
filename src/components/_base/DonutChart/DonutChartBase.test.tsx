import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DonutChartBase, type DonutChartBaseProps, type DonutChartClasses } from "./DonutChartBase";

const classes: DonutChartClasses = {
  root: "root",
  caption: "caption",
  plot: "plot",
  tooltip: "tip",
  valueLabel: "vlabel",
  centre: "centre",
  centreCaption: "ccap",
  legend: "legend",
  mark: () => "mark",
  track: "track",
};
const data = [
  { label: "Rent", value: 40 },
  { label: "Food", value: 30 },
  { label: "Fun", value: 30 },
];

const donut = (props: Partial<DonutChartBaseProps> = {}) => (
  <DonutChartBase title="Spend" data={data} classes={classes} maxSlices={6} {...props} />
);
const renderDonut = (props: Partial<DonutChartBaseProps> = {}) => render(donut(props));

const q = (c: HTMLElement, sel: string) => [...c.querySelectorAll(sel)];
const tableRows = () =>
  within(screen.getByRole("table"))
    .getAllByRole("row")
    .map((r) => [...r.querySelectorAll("th, td")].map((c) => c.textContent));

it("draws one slice per datum and lists the same values in the table", () => {
  const { container } = renderDonut();
  expect(q(container, "path[data-chart-mark]")).toHaveLength(3);
  expect(tableRows()).toEqual([
    ["Label", "Value"],
    ["Rent", "40"],
    ["Food", "30"],
    ["Fun", "30"],
    ["Total", "100"],
  ]);
});

it("groups past the limit into Other, in the table too", () => {
  const many = Array.from({ length: 8 }, (_, i) => ({ label: `Item ${i + 1}`, value: (i + 1) * 10 }));
  const six = renderDonut({ data: many });
  expect(q(six.container, "path[data-chart-mark]")).toHaveLength(6);
  const rows = tableRows();
  // Rows: header, 6 slices, footer. The last slice row is the grouped one: items 1, 2 and 3 are the smallest.
  expect(rows[rows.length - 2]).toEqual(["Other", "60"]);
  six.unmount();

  const three = renderDonut({ data: many, maxSlices: 3 });
  expect(q(three.container, "path[data-chart-mark]")).toHaveLength(3);
});

it("shows the total in the centre unless overridden", () => {
  const plain = renderDonut();
  expect(q(plain.container, "text[data-chart-centre]")[0]).toHaveTextContent("100");
  plain.unmount();

  const custom = renderDonut({ centerLabel: "€100", centerCaption: "Spent" });
  expect(q(custom.container, "text[data-chart-centre]")[0]).toHaveTextContent("€100");
  expect(q(custom.container, "svg text").map((t) => t.textContent)).toContain("Spent");
});

it("draws an empty track and no slices when everything is zero", () => {
  const { container } = renderDonut({ data: [{ label: "A", value: 0 }, { label: "B", value: 0 }] });
  expect(q(container, "path[data-chart-mark]")).toHaveLength(0);
  expect(q(container, "[data-chart-track]")).toHaveLength(1);
  expect(q(container, "text[data-chart-centre]")[0]).toHaveTextContent("0");
  expect(container.innerHTML).not.toContain("NaN");
});

it("draws a single full slice without collapsing", () => {
  const { container } = renderDonut({ data: [{ label: "A", value: 5 }] });
  const marks = q(container, "path[data-chart-mark]");
  expect(marks).toHaveLength(1);
  expect(marks[0]!.getAttribute("d")!.match(/A/g)).toHaveLength(4);
  expect(container.innerHTML).not.toContain("NaN");
});

it("treats negative and non-finite values as zero", () => {
  const { container } = renderDonut({
    data: [{ label: "A", value: -5 }, { label: "B", value: 5 }, { label: "C", value: NaN }],
  });
  const rows = tableRows();
  expect(rows[3]).toEqual(["C", "—"]);
  expect(rows[2]).toEqual(["B", "5"]);
  expect(q(container, "path[data-chart-mark]")).toHaveLength(1);
  expect(container.innerHTML).not.toContain("NaN");
});

it("handles empty data", () => {
  const { container } = renderDonut({ data: [] });
  expect(tableRows()).toEqual([["Label", "Value"], ["Total", "0"]]);
  expect(q(container, "[data-chart-track]")).toHaveLength(1);
  expect(q(container, "text[data-chart-centre]")[0]).toHaveTextContent("0");
  expect(container.innerHTML).not.toContain("NaN");
});

it("asks the skin for each slice class and flags the highlighted slice", () => {
  const mark = vi.fn((_i: number, h: boolean) => (h ? "hi" : "lo"));
  const withMark = { ...classes, mark };
  const a = renderDonut({ classes: withMark, highlight: "Food" });
  const marks = q(a.container, "path[data-chart-mark]");
  expect(marks[0]).toHaveClass("lo");
  expect(marks[1]).toHaveClass("hi");
  a.unmount();

  const many = Array.from({ length: 8 }, (_, i) => ({ label: `Item ${i + 1}`, value: (i + 1) * 10 }));
  const b = renderDonut({ classes: withMark, data: many, highlight: "Item 1" });
  expect(q(b.container, "path[data-chart-mark].hi")).toHaveLength(0);
});

it("shows a tooltip on slice hover", async () => {
  const user = userEvent.setup();
  const { container } = renderDonut();
  expect(screen.queryByText("Rent: 40")).toBeNull();
  const marks = q(container, "path[data-chart-mark]");
  await user.hover(marks[0]!);
  expect(screen.getByText("Rent: 40")).toHaveAttribute("aria-hidden", "true");
  await user.unhover(marks[0]!);
  expect(screen.queryByText("Rent: 40")).toBeNull();
});

it("renders an aria-hidden legend, with values only on request", () => {
  const plain = renderDonut();
  const items = q(plain.container, "li[data-chart-legend]");
  expect(items).toHaveLength(3);
  expect(items[0]!.closest("[aria-hidden='true']")).not.toBeNull();
  expect(items[0]).toHaveTextContent("Rent");
  expect(items[0]).not.toHaveTextContent("40");
  plain.unmount();

  const withValues = renderDonut({ showValues: true });
  expect(q(withValues.container, "li[data-chart-legend]")[0]).toHaveTextContent("40");
});

it("keeps the accessibility contract", () => {
  const { container } = renderDonut({ highlight: "Rent", showValues: true });
  expect(screen.getByRole("figure", { name: "Spend" })).toBeInTheDocument();
  const svg = container.querySelector("svg")!;
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg.querySelectorAll("a, button, [tabindex]")).toHaveLength(0);
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  renderDonut({ className: "extra", ref });
  expect(screen.getByRole("figure")).toHaveClass("root", "extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
