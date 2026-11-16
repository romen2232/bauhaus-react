import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLinkPlayful } from "./TextLinkPlayful";

const meta: Meta<typeof TextLinkPlayful> = { title: "Playful/TextLinkPlayful", component: TextLinkPlayful };
export default meta;
type Story = StoryObj<typeof TextLinkPlayful>;

export const Plain: Story = { args: { href: "#", children: "Lorem ipsum" } };
export const WithArrow: Story = { args: { href: "#", children: "Dolor sit amet", arrow: "right" } };
export const External: Story = { args: { href: "#", children: "Consectetur", arrow: "up-right" } };
