import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChartSwiss } from "./BarChartSwiss";

const meta: Meta<typeof BarChartSwiss> = {
  title: "Swiss/BarChartSwiss",
  component: BarChartSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
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
type Story = StoryObj<typeof BarChartSwiss>;

export const Default: Story = {};
export const Highlight: Story = { args: { highlight: "Feb" } };
export const Negative: Story = {
  args: {
    title: "Net change",
    data: [
      { label: "Q1", value: -8 },
      { label: "Q2", value: 14 },
      { label: "Q3", value: -3 },
      { label: "Q4", value: 20 },
    ],
  },
};
