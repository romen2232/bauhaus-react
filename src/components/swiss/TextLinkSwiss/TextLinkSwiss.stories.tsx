import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLinkSwiss } from "./TextLinkSwiss";

const meta: Meta<typeof TextLinkSwiss> = {
  title: "Swiss/TextLinkSwiss",
  component: TextLinkSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof TextLinkSwiss>;

export const Default: Story = { args: { href: "#", children: "See transactions" } };
export const UpRight: Story = { args: { href: "#", arrow: "up-right", children: "Open account" } };
export const Down: Story = { args: { href: "#", arrow: "down", children: "More activity" } };
