import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButtonPlayful } from "../IconButtonPlayful/IconButtonPlayful";
import { TopBarPlayful } from "./TopBarPlayful";

const meta: Meta<typeof TopBarPlayful> = { title: "Playful/TopBarPlayful", component: TopBarPlayful };
export default meta;

export const Default: StoryObj<typeof TopBarPlayful> = {
  args: {
    brand: <a href="#">Brand</a>,
    meta: ["Lorem ipsum dolor sit amet", "Consectetur adipiscing elit", "Menu"],
    action: <IconButtonPlayful aria-label="Open menu" variant="outline" size="sm">≡</IconButtonPlayful>,
  },
};
