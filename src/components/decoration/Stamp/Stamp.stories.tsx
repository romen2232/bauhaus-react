import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stamp } from "./Stamp";

const meta: Meta<typeof Stamp> = { title: "Decoration/Stamp", component: Stamp };
export default meta;
type Story = StoryObj<typeof Stamp>;

export const Default: Story = { args: { text: "Open source mindset" } };
export const Spinning: Story = { args: { text: "Collecting · connecting · building", color: "ink", spin: true } };
