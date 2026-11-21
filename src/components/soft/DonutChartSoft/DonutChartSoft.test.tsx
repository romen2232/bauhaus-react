import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import { DonutChartSoft } from "./DonutChartSoft";

const items = (n: number) => Array.from({ length: n }, (_, i) => ({ label: `Item ${i + 1}`, value: (i + 1) * 10 }));
const marks = (c: HTMLElement) => [...c.querySelectorAll("path[data-chart-mark]")];

it("is a figure named by its title with a Total footer", () => {
  render(<DonutChartSoft title="Spend" data={items(3)} />);
  expect(screen.getByRole("figure", { name: "Spend" })).toBeInTheDocument();
  const rows = within(screen.getByRole("table", { name: "Spend" })).getAllByRole("row");
  expect(rows[rows.length - 1]).toHaveTextContent("Total60");
});

it("uses charcoal tints, separated by paper gaps, and one toned slice", () => {
  const { container } = render(<DonutChartSoft title="Spend" data={items(4)} />);
  const m = marks(container);
  expect(m[0]!.getAttribute("class")).toContain("fill-bh-charcoal ");
  expect(m[1]).toHaveClass("fill-bh-charcoal/80");
  expect(m[2]).toHaveClass("fill-bh-charcoal/65");
  expect(m[3]!.getAttribute("class")).toContain("fill-bh-charcoal ");
  for (const slice of m) expect(slice).toHaveClass("stroke-bh-paper");

  const hi = render(<DonutChartSoft title="Spend" data={items(4)} highlight="Item 2" />);
  const h = marks(hi.container);
  expect(h[1]).toHaveClass("fill-bh-blue");
  expect(h.filter((x) => x.classList.contains("fill-bh-blue"))).toHaveLength(1);
  hi.unmount();

  const red = render(<DonutChartSoft title="Spend" data={items(4)} highlight="Item 2" tone="red" />);
  expect(marks(red.container)[1]).toHaveClass("fill-bh-red");
});

it("allows six slices and groups the rest", () => {
  const { container } = render(<DonutChartSoft title="Spend" data={items(8)} />);
  expect(marks(container)).toHaveLength(6);
});

it("shows the total in the centre", () => {
  const { container } = render(<DonutChartSoft title="Spend" data={items(3)} centerLabel="60 EUR" />);
  expect(container.querySelector("[data-chart-centre]")).toHaveTextContent("60 EUR");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<DonutChartSoft title="Spend" data={items(3)} className="extra" ref={ref} />);
  expect(screen.getByRole("figure")).toHaveClass("extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
