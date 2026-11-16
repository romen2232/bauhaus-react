import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChipSwiss } from "./ChipSwiss";

const meta: Meta<typeof ChipSwiss> = {
  title: "Swiss/ChipSwiss",
  component: ChipSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof ChipSwiss>;

export const Default: Story = { args: { children: "Main account" } };
export const WithIcon: Story = { args: { children: "1 Day", icon: "◷" } };
