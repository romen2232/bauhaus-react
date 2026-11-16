import type { Meta, StoryObj } from "@storybook/react-vite";
import { MenuOverlaySoft } from "./MenuOverlaySoft";

const meta: Meta<typeof MenuOverlaySoft> = {
  title: "Soft/MenuOverlaySoft",
  component: MenuOverlaySoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof MenuOverlaySoft>;

export const Default: Story = {
  args: {
    triggerLabel: "Menu",
    title: "Site menu",
    links: [
      { href: "#", label: "Today" },
      { href: "#", label: "Rooms", current: true },
      { href: "#", label: "Bookings" },
    ],
    secondary: "Help · Contact",
  },
};
export const Open: Story = { args: { ...Default.args, defaultOpen: true } };
