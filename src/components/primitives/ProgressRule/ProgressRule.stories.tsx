import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressRule } from "./ProgressRule";

const meta: Meta<typeof ProgressRule> = { title: "Primitives/ProgressRule", component: ProgressRule };
export default meta;
type Story = StoryObj<typeof ProgressRule>;

export const Labelled: Story = { args: { value: 0.35, label: "Lorem progress" } };
export const Decorative: Story = { args: { value: 0.6, color: "red" } };
