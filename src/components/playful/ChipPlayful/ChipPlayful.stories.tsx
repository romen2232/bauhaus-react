import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChipPlayful } from "./ChipPlayful";

const meta: Meta<typeof ChipPlayful> = { title: "Playful/ChipPlayful", component: ChipPlayful };
export default meta;

export const Default: StoryObj<typeof ChipPlayful> = { args: { children: "Lorem ipsum" } };
export const WithIcon: StoryObj<typeof ChipPlayful> = { args: { children: "Dolor", icon: "●" } };
