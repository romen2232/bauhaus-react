import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import { DonutChartPlayful } from "./DonutChartPlayful";

const items = (n: number) => Array.from({ length: n }, (_, i) => ({ label: `Item ${i + 1}`, value: (i + 1) * 10 }));
const marks = (c: HTMLElement) => [...c.querySelectorAll("path[data-chart-mark]")];

it("is a figure named by its title with a Total footer", () => {
  render(<DonutChartPlayful title="Spend" data={items(3)} />);
  expect(screen.getByRole("figure", { name: "Spend" })).toBeInTheDocument();
  const rows = within(screen.getByRole("table", { name: "Spend" })).getAllByRole("row");
  expect(rows[rows.length - 1]).toHaveTextContent("Total60");
});

it("cycles colours with ink outlines and allows six slices", () => {
  const six = render(<DonutChartPlayful title="Spend" data={items(6)} />);
  const m = marks(six.container);
  expect(m).toHaveLength(6);
  ["red", "blue", "yellow", "red", "blue", "yellow"].forEach((c, i) => expect(m[i]).toHaveClass(`fill-bh-${c}`));
  for (const slice of m) expect(slice).toHaveClass("stroke-bh-ink", "stroke-2");
  six.unmount();

  const seven = render(<DonutChartPlayful title="Spend" data={items(7)} />);
  expect(marks(seven.container)).toHaveLength(6);
  const rows = within(screen.getByRole("table")).getAllByRole("row");
  expect(rows[rows.length - 2]).toHaveTextContent("Other");
});

it("takes a custom colour cycle", () => {
  const { container } = render(<DonutChartPlayful title="Spend" data={items(3)} colors={["navy", "pink"]} />);
  const m = marks(container);
  expect(m[0]).toHaveClass("fill-bh-navy");
  expect(m[1]).toHaveClass("fill-bh-pink");
  expect(m[2]).toHaveClass("fill-bh-navy");
});

it("shows the total in the centre", () => {
  const { container } = render(<DonutChartPlayful title="Spend" data={items(3)} />);
  expect(container.querySelector("[data-chart-centre]")).toHaveTextContent("60");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<DonutChartPlayful title="Spend" data={items(3)} className="extra" ref={ref} />);
  expect(screen.getByRole("figure")).toHaveClass("extra");
  expect(ref.current?.tagName).toBe("FIGURE");
});
