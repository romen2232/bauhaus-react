import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButtonSwiss } from "./IconButtonSwiss";

const meta: Meta<typeof IconButtonSwiss> = {
  title: "Swiss/IconButtonSwiss",
  component: IconButtonSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof IconButtonSwiss>;

export const Outline: Story = { args: { "aria-label": "Previous", children: "←" } };
export const Solid: Story = { args: { "aria-label": "Next", variant: "solid", children: "→" } };
export const Fab: Story = { args: { "aria-label": "Add transfer", size: "lg", children: "+" } };
