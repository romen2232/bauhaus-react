import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatColumns } from "./StatColumns";

const meta: Meta<typeof StatColumns> = { title: "Primitives/StatColumns", component: StatColumns };
export default meta;

export const ThreeColumns: StoryObj<typeof StatColumns> = {
  args: {
    items: [
      { label: "Lorem", value: "24H", title: "Ipsum dolor", list: ["Sit amet", "Consectetur"] },
      { label: "Ipsum", value: "2 DAYS", title: "Adipiscing elit", list: ["Sed do", "Eiusmod"] },
      { label: "Dolor", value: "1 WEEK", title: "Tempor incididunt", list: ["Ut labore", "Et dolore"] },
    ],
  },
};
