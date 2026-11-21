import type { Meta, StoryObj } from "@storybook/react-vite";
import { DonutChartPlayful } from "./DonutChartPlayful";

const meta: Meta<typeof DonutChartPlayful> = {
  title: "Playful/DonutChartPlayful",
  component: DonutChartPlayful,
  args: {
    title: "Spending by category",
    data: [
      { label: "Rent", value: 40 },
      { label: "Food", value: 30 },
      { label: "Fun", value: 20 },
    ],
    className: "max-w-md",
  },
};
export default meta;
type Story = StoryObj<typeof DonutChartPlayful>;

export const Default: Story = {};
export const Grouped: Story = {
  args: {
    showValues: true,
    data: [
      { label: "Rent", value: 40 },
      { label: "Food", value: 30 },
      { label: "Fun", value: 20 },
      { label: "Travel", value: 15 },
      { label: "Health", value: 10 },
      { label: "Books", value: 6 },
      { label: "Gifts", value: 4 },
      { label: "Misc", value: 2 },
    ],
  },
};
export const CenterLabel: Story = { args: { centerLabel: "100 EUR", centerCaption: "Spent" } };
