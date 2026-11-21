import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { BarChartSwiss } from "./BarChartSwiss/BarChartSwiss";
import { LineChartSwiss } from "./LineChartSwiss/LineChartSwiss";
import { DonutChartSwiss } from "./DonutChartSwiss/DonutChartSwiss";
import { SparklineSwiss } from "./SparklineSwiss/SparklineSwiss";

/** Swiss charts: no other look's colours, no radius, shadow, translate, heavy weights or thick strokes. */
const FORBIDDEN_SWISS_CHART =
  /^((fill|stroke)-bh-(red|yellow|blue|navy|sky|pink|orange|sand|paper|teal|khaki)|text-bh-yellow|rounded.*|shadow.*|-?translate-.*|font-bh-(display|body)|font-(medium|semibold|bold|extrabold|black)|border-(2|4|8)|stroke-(2|3|4)|stroke-\[[2-9]px\])$/;

const data = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 40 },
  { label: "Mar", value: 25 },
];

const series = ["A", "B", "C"].map((id) => ({ id, label: id, data }));

const many = Array.from({ length: 8 }, (_, i) => ({ label: `Item ${i + 1}`, value: i + 1 }));

const cases: [string, ReactElement][] = [
  ["BarChartSwiss", <BarChartSwiss title="Visits" data={data} />],
  ["BarChartSwiss highlighted", <BarChartSwiss title="Visits" data={data} highlight="Feb" showValues />],
  ["BarChartSwiss negative", <BarChartSwiss title="Net" data={[{ label: "A", value: -4 }, { label: "B", value: 6 }]} />],
  ["BarChartSwiss empty", <BarChartSwiss title="Visits" data={[]} />],
  ["LineChartSwiss", <LineChartSwiss title="Visits" data={data} />],
  ["LineChartSwiss 3 series", <LineChartSwiss title="Visits" series={series} />],
  ["LineChartSwiss highlighted", <LineChartSwiss title="Visits" series={series} highlight="Feb" showValues />],
  ["LineChartSwiss empty", <LineChartSwiss title="Visits" data={[]} />],
  ["DonutChartSwiss", <DonutChartSwiss title="Spend" data={data} />],
  ["DonutChartSwiss highlighted", <DonutChartSwiss title="Spend" data={data} highlight="Feb" showValues />],
  ["DonutChartSwiss grouped", <DonutChartSwiss title="Spend" data={many} highlight="Item 8" />],
  ["DonutChartSwiss empty", <DonutChartSwiss title="Spend" data={[]} />],
  ["SparklineSwiss", <SparklineSwiss title="Trend" data={data} />],
  ["SparklineSwiss highlighted", <SparklineSwiss title="Trend" data={data} highlight="Jan" />],
  ["SparklineSwiss empty", <SparklineSwiss title="Trend" data={[]} />],
];

it.each(cases)("%s follows the Swiss chart look rules", (_name, element) => {
  const { container } = render(element);
  const elements = [...container.querySelectorAll("*")];
  const tokens = elements.flatMap((el) => (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean));
  const offending = tokens.filter((token) => FORBIDDEN_SWISS_CHART.test(token.split(":").pop()!));
  expect(offending).toEqual([]);

  const accents = tokens.filter((token) => token.includes("bh-accent"));
  expect(accents.length).toBeLessThanOrEqual(1);
});
