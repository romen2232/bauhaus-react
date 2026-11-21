import type { Meta, StoryObj } from "@storybook/react-vite";
import { createToastQueue, toast } from "../../../lib/toast";
import type { FillColor } from "../../../lib/palette";
import { ButtonPlayful } from "../ButtonPlayful/ButtonPlayful";
import { ToastRegionPlayful } from "./ToastRegionPlayful";

const meta: Meta<typeof ToastRegionPlayful> = {
  title: "Playful/ToastRegionPlayful",
  component: ToastRegionPlayful,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof ToastRegionPlayful>;

export const Default: Story = {
  render: (args) => (
    <>
      <ButtonPlayful onClick={() => toast({ title: "Message sent", color: "blue" })}>Show toast</ButtonPlayful>{" "}
      <ButtonPlayful onClick={() => toast({ title: "Item deleted", action: { label: "Undo", onAction: () => {} } })}>
        Show action toast
      </ButtonPlayful>
      <ToastRegionPlayful {...args} />
    </>
  ),
};

const colors: FillColor[] = ["red", "yellow", "blue"];
const colorQueue = createToastQueue();

export const Colors: Story = {
  render: () => (
    <>
      <ButtonPlayful
        onClick={() => {
          for (const color of colors) colorQueue({ title: `${color} toast`, color, timeout: 60000 });
        }}
      >
        Show three fills
      </ButtonPlayful>
      <ToastRegionPlayful queue={colorQueue} />
    </>
  ),
};
