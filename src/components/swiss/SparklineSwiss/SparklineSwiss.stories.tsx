import type { Meta, StoryObj } from "@storybook/react-vite";
import { BigNumber } from "../../primitives/BigNumber/BigNumber";
import { SparklineSwiss } from "./SparklineSwiss";

const meta: Meta<typeof SparklineSwiss> = {
  title: "Swiss/SparklineSwiss",
  component: SparklineSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
  args: {
    title: "Signups, last 7 days",
    hideTitle: true,
    data: [4, 7, 5, 9, 8, 12, 11].map((value, i) => ({ label: `Day ${i + 1}`, value })),
    className: "w-40",
  },
};
export default meta;
type Story = StoryObj<typeof SparklineSwiss>;

export const Default: Story = {};
export const InText: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      <BigNumber value="1,204" label="Signups" />
      <SparklineSwiss {...args} />
    </div>
  ),
};
