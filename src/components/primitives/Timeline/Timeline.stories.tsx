import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "./Timeline";

const meta: Meta<typeof Timeline> = { title: "Primitives/Timeline", component: Timeline };
export default meta;

export const Default: StoryObj<typeof Timeline> = {
  args: {
    items: [
      { year: "1915", content: "Lorem ipsum dolor sit amet." },
      { year: "1919", content: "Consectetur adipiscing elit." },
      { year: "1925", content: "Sed do eiusmod tempor." },
    ],
  },
};
