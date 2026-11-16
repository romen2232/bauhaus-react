import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProjectCardSwiss } from "./ProjectCardSwiss";

const meta: Meta<typeof ProjectCardSwiss> = {
  title: "Swiss/ProjectCardSwiss",
  component: ProjectCardSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof ProjectCardSwiss>;

export const Default: Story = {
  args: {
    href: "#",
    initial: "A",
    title: "Account A",
    description: "Long-term savings with a clear transaction history.",
    tag: { label: "New" },
    className: "max-w-xs",
  },
};
