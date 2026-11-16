import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stamp } from "./Stamp";

const meta: Meta<typeof Stamp> = { title: "Decoration/Stamp", component: Stamp };
export default meta;
type Story = StoryObj<typeof Stamp>;

export const Default: Story = { args: { text: "Lorem ipsum dolor" } };
export const Spinning: Story = { args: { text: "Lorem · ipsum · dolor", color: "ink", spin: true } };
