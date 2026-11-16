import type { Meta, StoryObj } from "@storybook/react-vite";
import { MenuOverlaySwiss } from "./MenuOverlaySwiss";

const meta: Meta<typeof MenuOverlaySwiss> = {
  title: "Swiss/MenuOverlaySwiss",
  component: MenuOverlaySwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof MenuOverlaySwiss>;

export const Default: Story = {
  args: {
    triggerLabel: "Menu",
    title: "Account menu",
    links: [
      { href: "#", label: "Accounts" },
      { href: "#", label: "Payments", current: true },
      { href: "#", label: "Statements" },
    ],
    secondary: "Security · Support",
  },
};
export const Open: Story = { args: { ...Default.args, defaultOpen: true } };
