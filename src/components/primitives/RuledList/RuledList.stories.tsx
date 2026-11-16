import type { Meta, StoryObj } from "@storybook/react-vite";
import { RuledList } from "./RuledList";

const meta: Meta<typeof RuledList> = { title: "Primitives/RuledList", component: RuledList };
export default meta;

export const Staff: StoryObj<typeof RuledList> = {
  args: {
    items: [
      { content: "Lorem" },
      { content: "Ipsum", offset: 1 },
      { content: "Dolor", offset: 3 },
      { content: "Sit amet", offset: 2 },
    ],
  },
};
