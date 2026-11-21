import {
  BarChartPlayful,
  BarChartSoft,
  BarChartSwiss,
  BigNumber,
  DonutChartPlayful,
  DonutChartSoft,
  DonutChartSwiss,
  IndexCounter,
  LineChartPlayful,
  LineChartSoft,
  LineChartSwiss,
  ProgressRule,
  SparklinePlayful,
  SparklineSoft,
  SparklineSwiss,
  StatColumns,
  TablePlayful,
  TableSoft,
  TableSwiss,
  Timeline,
} from "bauhaus-react";
import { flag, imports, skins, text } from "./helpers";
import type { DocEntry } from "./types";

// One dataset across looks, so the rows are directly comparable.
const WEEK = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 15 },
  { label: "Thu", value: 26 },
  { label: "Fri", value: 22 },
  { label: "Sat", value: 34 },
  { label: "Sun", value: 31 },
];
const SOURCES = [
  { label: "Direct", value: 48 },
  { label: "Search", value: 32 },
  { label: "Social", value: 20 },
];
const PROJECTS = [
  { id: "modulo", name: "Modulo", visits: 1204, status: "Live" },
  { id: "mijonju", name: "Mijonju", visits: 860, status: "Draft" },
  { id: "offmenu", name: "OffMenu", visits: 312, status: "Down" },
];

const highlight = (v: Record<string, unknown>) => (text(v, "highlight") === "none" ? undefined : text(v, "highlight"));
const DATA_SNIPPET = `const data = [{ label: "Mon", value: 12 }, { label: "Tue", value: 18 }];`;

export const DATA: DocEntry[] = [
  {
    slug: "table",
    title: "Table",
    group: "Data & charts",
    purpose: "Rows and columns with optional sorting. Built on React Aria, so keyboard and screen readers work.",
    principles: ["p2", "p8"],
    looks: skins(
      "Table",
      { playful: TablePlayful, swiss: TableSwiss, soft: TableSoft },
      (C, v) => (
        <C
          aria-label="Projects"
          columns={[
            { id: "name", label: "Project", isRowHeader: true, allowsSorting: flag(v, "sortable") },
            { id: "visits", label: "Visits", align: "end", allowsSorting: flag(v, "sortable") },
            { id: "status", label: "Status" },
          ]}
          rows={flag(v, "empty") ? [] : PROJECTS}
          getRowId={(row: { id: string }) => row.id}
          emptyState="No projects yet."
        />
      ),
      (n) =>
        `${imports(n)}\n\n<${n}\n  aria-label="Projects"\n  columns={[{ id: "name", label: "Project", isRowHeader: true, allowsSorting: true }]}\n  rows={projects}\n  getRowId={(row) => row.id}\n/>`,
    ),
    controls: [
      { prop: "sortable", kind: "boolean", initial: true },
      { prop: "empty", kind: "boolean", initial: false },
    ],
    dos: ["Mark one column as the row header.", "Right-align numbers."],
    donts: ["Do not use a table for layout.", "A table has row links or a row action, never both."],
    a11y: ["Sortable headers are buttons; the sort direction is announced.", "Always pass aria-label or aria-labelledby."],
  },
  {
    slug: "bar-chart",
    title: "BarChart",
    group: "Data & charts",
    purpose: "Compare values across categories. Every chart ships its data as a table for assistive tech.",
    principles: ["p9", "p5"],
    looks: skins(
      "BarChart",
      { playful: BarChartPlayful, swiss: BarChartSwiss, soft: BarChartSoft },
      (C, v) => <C title="Sessions per day" data={WEEK} height={200} showValues={flag(v, "showValues")} highlight={highlight(v)} className="w-full" />,
      (n) => `${imports(n)}\n\n${DATA_SNIPPET}\n<${n} title="Sessions per day" data={data} highlight="Thu" />`,
    ),
    controls: [
      { prop: "showValues", kind: "boolean", initial: false },
      { prop: "highlight", kind: "select", options: ["none", "Thu", "Sat"], initial: "Sat" },
    ],
    dos: ["Highlight the one bar the reader should compare against.", "Keep the value axis starting at zero."],
    donts: ["Do not use more than about twelve bars.", "Do not use colour as the only way to tell bars apart."],
    a11y: ["The figure has a caption and a hidden data table with the same values.", "Hovering a category shows a tooltip; marks are not focusable, the table carries the data."],
  },
  {
    slug: "line-chart",
    title: "LineChart",
    group: "Data & charts",
    purpose: "Show a trend over an ordered axis, as one series or several.",
    principles: ["p9", "p5"],
    looks: skins(
      "LineChart",
      { playful: LineChartPlayful, swiss: LineChartSwiss, soft: LineChartSoft },
      (C, v) => <C title="Sessions per day" data={WEEK} height={200} showValues={flag(v, "showValues")} highlight={highlight(v)} className="w-full" />,
      (n) => `${imports(n)}\n\n${DATA_SNIPPET}\n<${n} title="Sessions per day" data={data} />\n// or several lines: series={[{ id: "a", label: "A", data }]}`,
    ),
    controls: [
      { prop: "showValues", kind: "boolean", initial: false },
      { prop: "highlight", kind: "select", options: ["none", "Thu", "Sat"], initial: "none" },
    ],
    dos: ["Use for ordered data such as time."],
    donts: ["Do not connect categories that have no order."],
    a11y: ["Same figure and data table pattern as BarChart."],
  },
  {
    slug: "donut-chart",
    title: "DonutChart",
    group: "Data & charts",
    purpose: "Show parts of a whole. Slices beyond the limit are grouped into Other.",
    principles: ["p4", "p5"],
    looks: skins(
      "DonutChart",
      { playful: DonutChartPlayful, swiss: DonutChartSwiss, soft: DonutChartSoft },
      (C, v) => <C title="Traffic sources" data={SOURCES} centerCaption={text(v, "caption")} highlight={highlight(v)} />,
      (n) => `${imports(n)}\n\n<${n} title="Traffic sources" data={[{ label: "Direct", value: 48 }]} centerCaption="visits" />`,
    ),
    controls: [
      { prop: "caption", kind: "text", initial: "visits" },
      { prop: "highlight", kind: "select", options: ["none", "Direct", "Search"], initial: "none" },
    ],
    dos: ["Keep to five slices or fewer."],
    donts: ["Do not compare two donuts by eye; use a bar chart."],
    a11y: ["A legend and a data table list every slice with its value."],
  },
  {
    slug: "sparkline",
    title: "Sparkline",
    group: "Data & charts",
    purpose: "A tiny trend line with a dot on the latest point, for stat cards.",
    principles: ["p9", "p2"],
    looks: skins(
      "Sparkline",
      { playful: SparklinePlayful, swiss: SparklineSwiss, soft: SparklineSoft },
      (C, v) => <C title="Visits per day" hideTitle={flag(v, "hideTitle")} data={WEEK} highlight={highlight(v)} className="w-48" />,
      (n) => `${imports(n)}\n\n<${n} title="Visits per day" hideTitle data={data} />`,
    ),
    controls: [
      { prop: "hideTitle", kind: "boolean", initial: true },
      { prop: "highlight", kind: "select", options: ["none", "Thu"], initial: "none" },
    ],
    dos: ["Pair it with a number: the line alone has no scale."],
    donts: ["Do not use it to compare more than one series."],
    a11y: ["The title names the figure even when hidden; a data table carries the values."],
  },
  {
    slug: "big-number",
    title: "BigNumber",
    group: "Data & charts",
    purpose: "A numeral as the hero, with an optional label above and a caption below.",
    principles: ["p6", "p9"],
    agnostic: {
      exportNames: ["BigNumber"],
      demo: (v) => <BigNumber value={text(v, "value")} label="Visits" caption="this week" color={text(v, "color") as "red" | "blue" | "ink"} />,
      snippet: `${imports("BigNumber")}\n\n<BigNumber value="2,376" label="Visits" caption="this week" color="red" />`,
    },
    controls: [
      { prop: "value", kind: "text", initial: "2,376" },
      { prop: "color", kind: "select", options: ["ink", "red", "blue"], initial: "ink" },
    ],
    dos: ["Show one number per block."],
    donts: ["Do not show a number without saying what it counts."],
    a11y: ["Plain text: the label and caption give it meaning."],
  },
  {
    slug: "stat-columns",
    title: "StatColumns",
    group: "Data & charts",
    purpose: "A ruled row of stat columns: label, big value, title and sub-list.",
    principles: ["p8", "p6"],
    agnostic: {
      exportNames: ["StatColumns"],
      demo: () => (
        <StatColumns
          className="w-full"
          items={[
            { label: "Projects", value: "48", title: "Shipped" },
            { label: "Years", value: "12", list: ["Brand", "Product", "Print"] },
            { label: "Awards", value: "9" },
          ]}
        />
      ),
      snippet: `${imports("StatColumns")}\n\n<StatColumns items={[{ label: "Projects", value: "48", title: "Shipped" }]} />`,
    },
    controls: [],
    dos: ["Use two to four columns."],
    donts: ["Do not mix units across columns without labelling them."],
    a11y: ["Columns stack on narrow screens, keeping reading order."],
  },
  {
    slug: "progress-rule",
    title: "ProgressRule",
    group: "Data & charts",
    purpose: "A thin track with a filled segment.",
    principles: ["p9", "p4"],
    agnostic: {
      exportNames: ["ProgressRule"],
      demo: (v) => <ProgressRule value={Number(text(v, "value")) || 0} label="Upload progress" color={text(v, "color") as "red" | "blue" | "yellow"} />,
      snippet: `${imports("ProgressRule")}\n\n<ProgressRule value={40} label="Upload progress" color="blue" />`,
    },
    controls: [
      { prop: "value", kind: "text", initial: "40" },
      { prop: "color", kind: "select", options: ["blue", "red", "yellow"], initial: "blue" },
    ],
    dos: ["Give it a label that says what is progressing."],
    donts: ["Do not use it for indeterminate waiting."],
    a11y: ["Exposes the value to assistive tech through its label."],
  },
  {
    slug: "index-counter",
    title: "IndexCounter",
    group: "Data & charts",
    purpose: "A zero-padded index like 01 or 01 / 12, announced as \"1 of 12\".",
    principles: ["p6", "p9"],
    agnostic: {
      exportNames: ["IndexCounter"],
      demo: (v) => <IndexCounter current={Number(text(v, "current")) || 1} total={Number(text(v, "total")) || 12} />,
      snippet: `${imports("IndexCounter")}\n\n<IndexCounter current={1} total={12} />`,
    },
    controls: [
      { prop: "current", kind: "text", initial: "1" },
      { prop: "total", kind: "text", initial: "12" },
    ],
    dos: ["Keep it next to the thing it counts."],
    donts: ["Do not use it as the only way to move between items."],
    a11y: ["Announced as \"1 of 12\". Pair it with real navigation."],
  },
  {
    slug: "timeline",
    title: "Timeline",
    group: "Data & charts",
    purpose: "An ordered list of years in large type, each with its content.",
    principles: ["p8", "p6"],
    agnostic: {
      exportNames: ["Timeline"],
      demo: () => (
        <Timeline
          className="w-full"
          items={[
            { year: "1919", content: "Weimar: the school opens." },
            { year: "1925", content: "Dessau: a purpose-built home." },
            { year: "1933", content: "Berlin: closed under pressure." },
          ]}
        />
      ),
      snippet: `${imports("Timeline")}\n\n<Timeline items={[{ year: "1919", content: "Weimar: the school opens." }]} />`,
    },
    controls: [],
    dos: ["Keep entries in chronological order."],
    donts: ["Do not fill every year: leave gaps that mean something."],
    a11y: ["An ordered list: years are read before their content."],
  },
];
