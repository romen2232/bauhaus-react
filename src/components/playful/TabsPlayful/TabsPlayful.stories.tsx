import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabsPlayful } from "./TabsPlayful";

const meta: Meta<typeof TabsPlayful> = { title: "Playful/TabsPlayful", component: TabsPlayful };
export default meta;

export const Default: StoryObj<typeof TabsPlayful> = {
  args: {
    label: "Lorem sections",
    items: [
      { id: "lorem", title: "Lorem", content: "Lorem ipsum dolor sit amet." },
      { id: "ipsum", title: "Ipsum", content: "Consectetur adipiscing elit." },
      { id: "dolor", title: "Dolor", content: "Sed do eiusmod.", disabled: true },
    ],
  },
};
