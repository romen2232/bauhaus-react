import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabsSwiss } from "./TabsSwiss";

const meta: Meta<typeof TabsSwiss> = {
  title: "Swiss/TabsSwiss",
  component: TabsSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof TabsSwiss>;

export const Default: Story = {
  args: {
    label: "Statement period",
    items: [
      { id: "daily", title: "Daily", content: "Eight transactions today." },
      { id: "monthly", title: "Monthly", content: "146 transactions this month." },
      { id: "yearly", title: "Yearly", content: "Not available yet.", disabled: true },
    ],
  },
};
