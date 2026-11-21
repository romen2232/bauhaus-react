import { render } from "@testing-library/react";
import { BarChartSwiss } from "./BarChartSwiss";

const data = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 40 },
  { label: "Mar", value: 25 },
];
const marks = (c: HTMLElement) => [...c.querySelectorAll("rect[data-chart-mark]")];

it("draws ink bars and one accent bar", () => {
  const plain = render(<BarChartSwiss title="Visits" data={data} />);
  for (const m of marks(plain.container)) expect(m).toHaveClass("fill-bh-ink");
  plain.unmount();

  const { container } = render(<BarChartSwiss title="Visits" data={data} highlight="Feb" />);
  const m = marks(container);
  expect(m.filter((x) => x.classList.contains("fill-bh-accent"))).toHaveLength(1);
  expect(m[1]).toHaveClass("fill-bh-accent");
  expect(container.innerHTML).not.toContain("text-bh-accent");
  expect(container.innerHTML.match(/bh-accent/g)).toHaveLength(1);
});

it("draws 1px rule gridlines and an ink baseline", () => {
  const { container } = render(<BarChartSwiss title="Visits" data={data} />);
  const grid = [...container.querySelectorAll("[data-chart-grid]")];
  // niceTicks(0, 40) gives 0, 10, 20, 30, 40
  expect(grid).toHaveLength(5);
  for (const g of grid) expect(g).toHaveClass("stroke-bh-rule");
  expect(container.querySelector("[data-chart-baseline]")).toHaveClass("stroke-bh-ink");
});

it("hangs negative values below the baseline", () => {
  const { container } = render(
    <BarChartSwiss title="Net" data={[{ label: "A", value: -4 }, { label: "B", value: 6 }]} />,
  );
  expect(container.innerHTML).not.toContain("NaN");
  expect(marks(container)).toHaveLength(2);
});
