import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabsSoft } from "./TabsSoft";

const meta: Meta<typeof TabsSoft> = {
  title: "Soft/TabsSoft",
  component: TabsSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof TabsSoft>;

export const Default: Story = {
  args: {
    label: "Calendar view",
    items: [
      { id: "day", title: "Day", content: "Three bookings today." },
      { id: "week", title: "Week", content: "Twelve bookings this week." },
      { id: "month", title: "Month", content: "Not available yet.", disabled: true },
    ],
  },
};
