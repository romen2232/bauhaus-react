import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardSoft } from "./CardSoft";

const meta: Meta<typeof CardSoft> = {
  title: "Soft/CardSoft",
  component: CardSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof CardSoft>;

export const Default: Story = {
  args: { header: "Today", children: "Two rooms are free after 14:00.", footer: "Updated 5 min ago", className: "max-w-sm" },
};
export const AsLink: Story = { args: { ...Default.args, href: "#" } };
