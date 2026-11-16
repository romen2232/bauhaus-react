import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomNavPlayful } from "./BottomNavPlayful";

const meta: Meta<typeof BottomNavPlayful> = { title: "Playful/BottomNavPlayful", component: BottomNavPlayful };
export default meta;
type Story = StoryObj<typeof BottomNavPlayful>;

const items = [
  { href: "#home", label: "Lorem", icon: "■", current: true },
  { href: "#search", label: "Ipsum", icon: "●" },
  { href: "#saved", label: "Dolor", icon: "▲" },
];

export const IconOnly: Story = { args: { label: "Main", items, className: "max-w-sm" } };
export const WithLabels: Story = { args: { label: "Main", items, showLabels: true, className: "max-w-sm" } };
