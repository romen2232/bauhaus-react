import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChipSoft } from "./ChipSoft";

const meta: Meta<typeof ChipSoft> = {
  title: "Soft/ChipSoft",
  component: ChipSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof ChipSoft>;

export const Default: Story = { args: { children: "Double Room" } };
export const WithIcon: Story = { args: { children: "1 Day", icon: "◷" } };
