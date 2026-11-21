import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChartSoft } from "./BarChartSoft";

const meta: Meta<typeof BarChartSoft> = {
  title: "Soft/BarChartSoft",
  component: BarChartSoft,
  parameters: { backgrounds: { default: "paper" } },
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
type Story = StoryObj<typeof BarChartSoft>;

export const Default: Story = {};
export const Highlight: Story = { args: { highlight: "Feb" } };
export const ShowValues: Story = { args: { highlight: "Feb", tone: "red", showValues: true } };
