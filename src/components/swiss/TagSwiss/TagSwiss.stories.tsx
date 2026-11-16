import type { Meta, StoryObj } from "@storybook/react-vite";
import { TagSwiss } from "./TagSwiss";

const meta: Meta<typeof TagSwiss> = {
  title: "Swiss/TagSwiss",
  component: TagSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof TagSwiss>;

export const Default: Story = { args: { children: "Verified" } };
