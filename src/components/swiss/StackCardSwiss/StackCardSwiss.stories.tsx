import type { Meta, StoryObj } from "@storybook/react-vite";
import { StackCardSwiss } from "./StackCardSwiss";

const meta: Meta<typeof StackCardSwiss> = {
  title: "Swiss/StackCardSwiss",
  component: StackCardSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof StackCardSwiss>;

export const Default: Story = { args: { children: "Transfer · Account A", className: "max-w-sm" } };
export const Stack: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <StackCardSwiss>Pending · Account A</StackCardSwiss>
      <StackCardSwiss action="+">Scheduled · Account B</StackCardSwiss>
      <StackCardSwiss>Settled · Account C</StackCardSwiss>
    </div>
  ),
};
