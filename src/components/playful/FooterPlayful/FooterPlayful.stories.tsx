import type { Meta, StoryObj } from "@storybook/react-vite";
import { FooterPlayful } from "./FooterPlayful";

const meta: Meta<typeof FooterPlayful> = { title: "Playful/FooterPlayful", component: FooterPlayful };
export default meta;

export const Default: StoryObj<typeof FooterPlayful> = {
  args: {
    columns: [
      <p key="r">Ideas are cheap. Execution is expensive.</p>,
      <p key="s">mijonju.com — always in beta.</p>,
      <ul key="l"><li>About</li><li>Contact</li><li>Privacy</li></ul>,
    ],
    bottom: "Collecting, connecting, building.",
  },
};
