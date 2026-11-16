import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardPlayful } from "./CardPlayful";

const meta: Meta<typeof CardPlayful> = { title: "Playful/CardPlayful", component: CardPlayful };
export default meta;
type Story = StoryObj<typeof CardPlayful>;

export const Article: Story = {
  args: { header: "Lorem ipsum", children: "Dolor sit amet, consectetur adipiscing elit.", footer: "Sed do", className: "max-w-sm" },
};
export const AsLink: Story = {
  args: { href: "#", header: "Lorem ipsum", children: "Dolor sit amet.", className: "max-w-sm" },
};
