import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButtonSoft } from "./IconButtonSoft";

const meta: Meta<typeof IconButtonSoft> = {
  title: "Soft/IconButtonSoft",
  component: IconButtonSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof IconButtonSoft>;

export const Solid: Story = { args: { "aria-label": "Next", children: "→" } };
export const Outline: Story = { args: { "aria-label": "Previous", variant: "outline", children: "←" } };
export const Fab: Story = { args: { "aria-label": "Add booking", size: "lg", children: "+" } };
