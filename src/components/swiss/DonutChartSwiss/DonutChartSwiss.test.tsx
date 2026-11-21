import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import { DonutChartSwiss } from "./DonutChartSwiss";

const data = [
  { label: "A", value: 10 },
  { label: "B", value: 20 },
  { label: "C", value: 30 },
];
const five = ["A", "B", "C", "D", "E"].map((label, i) => ({ label, value: (i + 1) * 10 }));
const marks = (c: HTMLElement) => [...c.querySelectorAll("path[data-chart-mark]")];
const accents = (c: HTMLElement) =>
  [...c.querySelectorAll("*")].filter((el) => (el.getAttribute("class") ?? "").includes("bh-accent"));

it("is a figure named by its title with a Total footer", () => {
  render(<DonutChartSwiss title="Spend" data={data} />);
  expect(screen.getByRole("figure", { name: "Spend" })).toBeInTheDocument();
  const rows = within(screen.getByRole("table", { name: "Spend" })).getAllByRole("row");
  expect(rows[rows.length - 1]).toHaveTextContent("Total60");
});

it("limits to three slices and uses ink, charcoal and the accent only", () => {
  const { container } = render(<DonutChartSwiss title="Spend" data={five} />);
  const m = marks(container);
  expect(m).toHaveLength(3);
  expect(m[0]).toHaveClass("fill-bh-ink");
  expect(m[1]).toHaveClass("fill-bh-charcoal");
  expect(m[2]).toHaveClass("fill-bh-accent");
  const rows = within(screen.getByRole("table")).getAllByRole("row");
  expect(rows[rows.length - 2]).toHaveTextContent("Other");
  for (const slice of m) expect(slice).toHaveClass("stroke-bh-paper-white");
});

it("gives the accent to the highlighted slice and ink then charcoal to the others", () => {
  const { container } = render(<DonutChartSwiss title="Spend" data={data} highlight="A" />);
  const m = marks(container);
  expect(m[0]).toHaveClass("fill-bh-accent");
  expect(m[1]).toHaveClass("fill-bh-ink");
  expect(m[2]).toHaveClass("fill-bh-charcoal");
});

it("never has more than one accent element", () => {
  for (const [d, highlight] of [
    [data, undefined],
    [data, "A"],
    [data, "C"],
    [five, undefined],
    [five, "B"],
  ] as const) {
    const { container, unmount } = render(<DonutChartSwiss title="Spend" data={[...d]} highlight={highlight} showValues />);
    expect(accents(container).length).toBeLessThanOrEqual(1);
    expect(container.innerHTML).not.toContain("text-bh-accent");
    unmount();
  }
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<DonutChartSwiss title="Spend" data={data} className="extra" ref={ref} />);
  expect(screen.getByRole("figure")).toHaveClass("extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
