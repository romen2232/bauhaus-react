import type { Meta, StoryObj } from "@storybook/react-vite";
import { IndexCounter } from "./IndexCounter";

const meta: Meta<typeof IndexCounter> = { title: "Primitives/IndexCounter", component: IndexCounter };
export default meta;
type Story = StoryObj<typeof IndexCounter>;

export const Single: Story = { args: { current: 1 } };
export const WithTotal: Story = { args: { current: 3, total: 12 } };
