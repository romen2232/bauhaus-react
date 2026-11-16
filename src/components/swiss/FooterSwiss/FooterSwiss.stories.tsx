import type { Meta, StoryObj } from "@storybook/react-vite";
import { FooterSwiss } from "./FooterSwiss";

const meta: Meta<typeof FooterSwiss> = {
  title: "Swiss/FooterSwiss",
  component: FooterSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof FooterSwiss>;

export const Default: Story = {
  args: {
    columns: ["Accounts and cards", "Help and security", "Legal information"],
    bottom: "© 2026 Konto",
  },
};
