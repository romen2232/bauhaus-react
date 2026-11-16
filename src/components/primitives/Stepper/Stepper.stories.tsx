import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./Stepper";

const meta: Meta<typeof Stepper> = { title: "Primitives/Stepper", component: Stepper };
export default meta;

export const TriadCoded: StoryObj<typeof Stepper> = {
  args: {
    current: 1,
    steps: [
      { label: "Lorem ipsum", color: "yellow" },
      { label: "Dolor sit", color: "red" },
      { label: "Amet consectetur", color: "blue" },
    ],
  },
};
