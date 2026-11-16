import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomNavSwiss } from "./BottomNavSwiss";

const meta: Meta<typeof BottomNavSwiss> = {
  title: "Swiss/BottomNavSwiss",
  component: BottomNavSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof BottomNavSwiss>;

const items = [
  { href: "#", label: "Home", icon: "⌂", current: true },
  { href: "#", label: "Pay", icon: "+" },
  { href: "#", label: "Cards", icon: "▦" },
];

export const Default: Story = { args: { label: "Main", items, className: "max-w-sm" } };
export const WithLabels: Story = { args: { ...Default.args, showLabels: true } };
