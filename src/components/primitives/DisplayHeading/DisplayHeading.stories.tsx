import type { Meta, StoryObj } from "@storybook/react-vite";
import { DisplayHeading } from "./DisplayHeading";

const meta: Meta<typeof DisplayHeading> = { title: "Primitives/DisplayHeading", component: DisplayHeading };
export default meta;
type Story = StoryObj<typeof DisplayHeading>;

export const Default: Story = { args: { children: "Bauhaus" } };
export const Echo: Story = { args: { children: "Graphic design", size: "xl", echo: true } };
export const School: Story = { args: { as: "h1", size: "4xl", children: "School" } };
