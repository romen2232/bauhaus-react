import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberStepper } from "./NumberStepper";

const meta: Meta<typeof NumberStepper> = { title: "Primitives/NumberStepper", component: NumberStepper };
export default meta;

export const Default: StoryObj<typeof NumberStepper> = { args: { value: 23 } };
export const Padded: StoryObj<typeof NumberStepper> = { args: { value: 7, pad: 2, ahead: 1 } };
