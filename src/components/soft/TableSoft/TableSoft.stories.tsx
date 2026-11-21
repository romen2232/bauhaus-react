import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableSoft } from "./TableSoft";
import type { TableColumn } from "../../_base/Table/tableTypes";

type Project = { slug: string; name: string; status: "live" | "draft"; users: number | null; shipped: Date };

const meta: Meta<typeof TableSoft<Project>> = {
  title: "Soft/TableSoft",
  component: TableSoft<Project>,
};
export default meta;
type Story = StoryObj<typeof TableSoft<Project>>;

const rows: Project[] = [
  { slug: "aurora", name: "Aurora", status: "live", users: 1240, shipped: new Date("2026-01-12") },
  { slug: "borealis", name: "Borealis", status: "draft", users: 86, shipped: new Date("2026-03-04") },
  { slug: "cirrus", name: "Cirrus", status: "live", users: null, shipped: new Date("2026-05-21") },
  { slug: "delta", name: "Delta", status: "draft", users: 412, shipped: new Date("2026-02-02") },
];

const plain: TableColumn<Project>[] = [
  { id: "name", label: "Name", allowsSorting: true },
  { id: "users", label: "Users", align: "end", allowsSorting: true },
  { id: "shipped", label: "Shipped", allowsSorting: true },
];

const withStatus: TableColumn<Project>[] = [
  plain[0]!,
  {
    id: "status",
    label: "Status",
    allowsSorting: true,
    sortValue: (r) => (r.status === "live" ? 2 : 1),
    render: (r) => (
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className={r.status === "live" ? "size-2 rounded-full bg-bh-blue" : "size-2 rounded-full bg-bh-yellow"}
        />
        {r.status === "live" ? "Live" : "Draft"}
      </span>
    ),
  },
  plain[1]!,
  plain[2]!,
];

const base = { "aria-label": "Projects", rows, getRowId: (r: Project) => r.slug } as const;

export const Default: Story = { args: { ...base, columns: plain.map((c) => ({ ...c, allowsSorting: false })) } };
export const Sortable: Story = {
  args: { ...base, columns: plain, defaultSortDescriptor: { column: "users", direction: "descending" } },
};
export const StatusDots: Story = { args: { ...base, columns: withStatus } };
export const RowActions: Story = {
  args: { ...base, columns: plain, onRowAction: (row) => window.alert(`Open ${row.name}`) },
};
export const Empty: Story = { args: { ...base, columns: plain, rows: [], emptyState: "No projects yet." } };
