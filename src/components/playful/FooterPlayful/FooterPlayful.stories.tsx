import type { Meta, StoryObj } from "@storybook/react-vite";
import { FooterPlayful } from "./FooterPlayful";

const meta: Meta<typeof FooterPlayful> = { title: "Playful/FooterPlayful", component: FooterPlayful };
export default meta;

export const Default: StoryObj<typeof FooterPlayful> = {
  args: {
    columns: [
      <p key="r">Lorem ipsum dolor sit amet.</p>,
      <p key="s">Consectetur adipiscing elit.</p>,
      <ul key="l"><li>About</li><li>Contact</li><li>Privacy</li></ul>,
    ],
    bottom: "Sed do eiusmod tempor.",
  },
};
