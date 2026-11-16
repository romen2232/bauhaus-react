import type { Meta, StoryObj } from "@storybook/react-vite";
import { BigNumber } from "./BigNumber";

const meta: Meta<typeof BigNumber> = { title: "Primitives/BigNumber", component: BigNumber };
export default meta;
type Story = StoryObj<typeof BigNumber>;

export const Default: Story = { args: { label: "Lorem", value: "23", caption: "Ipsum dolor" } };
export const Red: Story = { args: { value: "07", color: "red" } };
