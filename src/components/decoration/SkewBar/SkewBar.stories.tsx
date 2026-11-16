import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkewBar } from "./SkewBar";

const meta: Meta<typeof SkewBar> = { title: "Decoration/SkewBar", component: SkewBar };
export default meta;

export const Stack: StoryObj<typeof SkewBar> = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <SkewBar color="orange" shadowColor="navy" label="lorem" />
      <SkewBar color="yellow" shadowColor="navy" label="ipsum" />
      <SkewBar color="sky" label="dolor" />
    </div>
  ),
};
