import { CalendarDate } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateStripPlayful } from "./DateStripPlayful";

const meta: Meta<typeof DateStripPlayful> = { title: "Playful/DateStripPlayful", component: DateStripPlayful };
export default meta;
type Story = StoryObj<typeof DateStripPlayful>;

export const Default: Story = {
  args: { label: "Pick a day", start: new CalendarDate(2026, 11, 16), defaultValue: new CalendarDate(2026, 11, 18) },
};
export const YearBoundary: Story = { args: { label: "Pick a day", start: new CalendarDate(2026, 12, 29) } };
export const WithRange: Story = {
  args: {
    label: "Pick a day",
    start: new CalendarDate(2026, 11, 16),
    minValue: new CalendarDate(2026, 11, 18),
    maxValue: new CalendarDate(2026, 11, 20),
  },
};
