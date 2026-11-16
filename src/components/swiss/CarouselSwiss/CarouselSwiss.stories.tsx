import type { Meta, StoryObj } from "@storybook/react-vite";
import { CarouselSwiss } from "./CarouselSwiss";

const meta: Meta<typeof CarouselSwiss> = {
  title: "Swiss/CarouselSwiss",
  component: CarouselSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof CarouselSwiss>;

export const Default: Story = {
  render: (args) => (
    <CarouselSwiss {...args} className="max-w-md">
      <div className="flex h-56 items-end border border-bh-rule p-6 font-bh-grotesk text-4xl">
        Account A
      </div>
      <div className="flex h-56 items-end border border-bh-rule p-6 font-bh-grotesk text-4xl">
        Savings B
      </div>
      <div className="flex h-56 items-end border border-bh-rule p-6 font-bh-grotesk text-4xl">
        Investment C
      </div>
    </CarouselSwiss>
  ),
  args: { label: "Accounts" },
};
