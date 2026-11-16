import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardSwiss } from "./CardSwiss";

const meta: Meta<typeof CardSwiss> = {
  title: "Swiss/CardSwiss",
  component: CardSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof CardSwiss>;

export const Default: Story = {
  args: {
    header: "Account summary",
    children: "Your available balance is $12,480.",
    footer: "Updated just now",
    className: "max-w-sm",
  },
};
export const AsLink: Story = { args: { ...Default.args, href: "#" } };
