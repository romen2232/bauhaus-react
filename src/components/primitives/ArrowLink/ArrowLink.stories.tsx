import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLink } from "./ArrowLink";

const meta: Meta<typeof ArrowLink> = { title: "Primitives/ArrowLink", component: ArrowLink };
export default meta;
type Story = StoryObj<typeof ArrowLink>;

export const Default: Story = { args: { href: "#", children: "Read the manifesto" } };
export const Hero: Story = { args: { href: "#", children: "Manifesto", direction: "up-right", size: "hero" } };
