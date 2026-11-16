import type { Meta, StoryObj } from "@storybook/react-vite";
import { Ribbon } from "./Ribbon";

const meta: Meta<typeof Ribbon> = { title: "Decoration/Ribbon", component: Ribbon };
export default meta;
type Story = StoryObj<typeof Ribbon>;

export const Default: Story = { args: { text: "Lorem ipsum", className: "h-64 w-full bg-bh-paper" } };
export const Yellow: Story = { args: { text: "Dolor", angle: 6, color: "yellow", className: "h-64 w-full bg-bh-navy" } };
