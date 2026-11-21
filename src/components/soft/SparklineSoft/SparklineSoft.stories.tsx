import type { Meta, StoryObj } from "@storybook/react-vite";
import { BigNumber } from "../../primitives/BigNumber/BigNumber";
import { SparklineSoft } from "./SparklineSoft";

const meta: Meta<typeof SparklineSoft> = {
  title: "Soft/SparklineSoft",
  component: SparklineSoft,
  parameters: { backgrounds: { default: "paper" } },
  args: {
    title: "Signups, last 7 days",
    hideTitle: true,
    data: [4, 7, 5, 9, 8, 12, 11].map((value, i) => ({ label: `Day ${i + 1}`, value })),
    className: "w-40",
  },
};
export default meta;
type Story = StoryObj<typeof SparklineSoft>;

export const Default: Story = {};
export const InText: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      <BigNumber value="1,204" label="Signups" />
      <SparklineSoft {...args} />
    </div>
  ),
};
