import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChartPlayful } from "./LineChartPlayful";

const months = ["Jan", "Feb", "Mar", "Apr"];

const meta: Meta<typeof LineChartPlayful> = {
  title: "Playful/LineChartPlayful",
  component: LineChartPlayful,
  args: {
    title: "Visits per month",
    data: [
      { label: "Jan", value: 12 },
      { label: "Feb", value: 40 },
      { label: "Mar", value: 25 },
      { label: "Apr", value: 31 },
    ],
    className: "max-w-md",
  },
};
export default meta;
type Story = StoryObj<typeof LineChartPlayful>;

export const Default: Story = {};
export const ThreeSeries: Story = {
  args: {
    data: undefined,
    series: [
      { id: "visits", label: "Visits", data: months.map((label, i) => ({ label, value: [12, 40, 25, 31][i]! })) },
      { id: "signups", label: "Signups", data: months.map((label, i) => ({ label, value: [8, 22, 18, 27][i]! })) },
      { id: "sales", label: "Sales", data: months.map((label, i) => ({ label, value: [3, 9, 12, 15][i]! })) },
    ],
  },
};
export const HiddenTitle: Story = { args: { hideTitle: true, showValues: true } };
