import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButtonPlayful } from "../IconButtonPlayful/IconButtonPlayful";
import { TopBarPlayful } from "./TopBarPlayful";

const meta: Meta<typeof TopBarPlayful> = { title: "Playful/TopBarPlayful", component: TopBarPlayful };
export default meta;

export const Mijonju: StoryObj<typeof TopBarPlayful> = {
  args: {
    brand: <a href="#">mijonju.com</a>,
    meta: ["Public notebook · creative database", "Version 0.71 · always in beta", "Index"],
    action: <IconButtonPlayful aria-label="Open menu" variant="outline" size="sm">≡</IconButtonPlayful>,
  },
};
