import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomNavSoft } from "./BottomNavSoft";

const meta: Meta<typeof BottomNavSoft> = {
  title: "Soft/BottomNavSoft",
  component: BottomNavSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof BottomNavSoft>;

const items = [
  { href: "#", label: "Home", icon: "⌂", current: true },
  { href: "#", label: "Book", icon: "+" },
  { href: "#", label: "Calendar", icon: "▦" },
];
export const Default: Story = { args: { label: "Main", items, className: "max-w-sm" } };
export const WithLabels: Story = { args: { ...Default.args, showLabels: true } };
