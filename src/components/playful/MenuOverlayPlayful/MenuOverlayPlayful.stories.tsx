import type { Meta, StoryObj } from "@storybook/react-vite";
import { MenuOverlayPlayful } from "./MenuOverlayPlayful";

const meta: Meta<typeof MenuOverlayPlayful> = { title: "Playful/MenuOverlayPlayful", component: MenuOverlayPlayful };
export default meta;

export const Default: StoryObj<typeof MenuOverlayPlayful> = {
  args: {
    triggerLabel: "Menu",
    title: "Site menu",
    links: [
      { href: "#lorem", label: "Lorem", current: true },
      { href: "#ipsum", label: "Ipsum" },
      { href: "#dolor", label: "Dolor" },
    ],
    secondary: "Sit amet · Consectetur · Adipiscing",
  },
};
