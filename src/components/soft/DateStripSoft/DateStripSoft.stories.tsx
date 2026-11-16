import { CalendarDate } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateStripSoft } from "./DateStripSoft";

const meta: Meta<typeof DateStripSoft> = {
  title: "Soft/DateStripSoft",
  component: DateStripSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof DateStripSoft>;

export const Default: Story = {
  args: { label: "Pick a day", start: new CalendarDate(2026, 11, 16), defaultValue: new CalendarDate(2026, 11, 17) },
};
export const AcrossMonthBoundary: Story = { args: { label: "Pick a day", start: new CalendarDate(2026, 12, 29) } };
export const WithRange: Story = {
  args: { ...Default.args, minValue: new CalendarDate(2026, 11, 17), maxValue: new CalendarDate(2026, 11, 20) },
};
