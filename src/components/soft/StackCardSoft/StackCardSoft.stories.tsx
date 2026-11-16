import type { Meta, StoryObj } from "@storybook/react-vite";
import { StackCardSoft } from "./StackCardSoft";

const meta: Meta<typeof StackCardSoft> = {
  title: "Soft/StackCardSoft",
  component: StackCardSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof StackCardSoft>;

export const Default: Story = { args: { children: "Room A · 09:00–10:00", className: "max-w-sm" } };
export const Stack: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <StackCardSoft tone="red">Cancelled · Room A</StackCardSoft>
      <StackCardSoft tone="yellow">Pending · Room B</StackCardSoft>
      <StackCardSoft tone="blue" action="+">Confirmed · Room C</StackCardSoft>
    </div>
  ),
};
