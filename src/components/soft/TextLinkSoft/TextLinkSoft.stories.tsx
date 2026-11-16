import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLinkSoft } from "./TextLinkSoft";

const meta: Meta<typeof TextLinkSoft> = {
  title: "Soft/TextLinkSoft",
  component: TextLinkSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof TextLinkSoft>;

export const Default: Story = { args: { href: "#", children: "See available times" } };
export const UpRight: Story = { args: { href: "#", arrow: "up-right", children: "Open in calendar" } };
export const Down: Story = { args: { href: "#", arrow: "down", children: "More rooms" } };
