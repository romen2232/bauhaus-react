import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProjectCardSoft } from "./ProjectCardSoft";

const meta: Meta<typeof ProjectCardSoft> = {
  title: "Soft/ProjectCardSoft",
  component: ProjectCardSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof ProjectCardSoft>;

export const Default: Story = {
  args: {
    href: "#",
    initial: "A",
    title: "Room A",
    description: "Seats eight, with a projector.",
    tag: { label: "Free" },
    className: "max-w-xs",
  },
};
export const Yellow: Story = { args: { ...Default.args, tone: "yellow", tag: { label: "Busy", tone: "red" } } };
