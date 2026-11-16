import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLink } from "./ArrowLink";

const meta: Meta<typeof ArrowLink> = { title: "Primitives/ArrowLink", component: ArrowLink };
export default meta;
type Story = StoryObj<typeof ArrowLink>;

export const Default: Story = { args: { href: "#", children: "Learn more" } };
export const Hero: Story = { args: { href: "#", children: "Get started", direction: "up-right", size: "hero" } };
