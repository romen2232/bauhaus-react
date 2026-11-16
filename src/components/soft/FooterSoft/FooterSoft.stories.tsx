import type { Meta, StoryObj } from "@storybook/react-vite";
import { FooterSoft } from "./FooterSoft";

const meta: Meta<typeof FooterSoft> = {
  title: "Soft/FooterSoft",
  component: FooterSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof FooterSoft>;

export const Default: Story = {
  args: { columns: ["About the studio", "Help and support", "Opening hours"], bottom: "© 2026 Rooms" },
};
