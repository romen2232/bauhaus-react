import { CalendarDate } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateStripSwiss } from "./DateStripSwiss";

const meta: Meta<typeof DateStripSwiss> = {
  title: "Swiss/DateStripSwiss",
  component: DateStripSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof DateStripSwiss>;

export const Default: Story = {
  args: {
    label: "Payment date",
    start: new CalendarDate(2026, 11, 16),
    defaultValue: new CalendarDate(2026, 11, 17),
  },
};
export const AcrossMonthBoundary: Story = {
  args: { label: "Payment date", start: new CalendarDate(2026, 12, 29) },
};
export const WithRange: Story = {
  args: {
    ...Default.args,
    minValue: new CalendarDate(2026, 11, 17),
    maxValue: new CalendarDate(2026, 11, 20),
  },
};
