import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChartPlayful } from "./BarChartPlayful";

const meta: Meta<typeof BarChartPlayful> = {
  title: "Playful/BarChartPlayful",
  component: BarChartPlayful,
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
type Story = StoryObj<typeof BarChartPlayful>;

export const Default: Story = {};
export const CustomColors: Story = { args: { colors: ["navy", "pink", "orange"] } };
export const HiddenTitle: Story = { args: { hideTitle: true, showValues: true } };
