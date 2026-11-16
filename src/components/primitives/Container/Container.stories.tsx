import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "./Container";

const meta: Meta<typeof Container> = { title: "Primitives/Container", component: Container };
export default meta;

export const Default: StoryObj<typeof Container> = {
  args: { children: <div className="h-32 bg-bh-yellow" /> },
};
