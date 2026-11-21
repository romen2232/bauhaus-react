import type { Meta, StoryObj } from "@storybook/react-vite";
import { createToastQueue, toast } from "../../../lib/toast";
import type { SoftTone } from "../../../lib/palette";
import { ButtonSoft } from "../ButtonSoft/ButtonSoft";
import { ToastRegionSoft } from "./ToastRegionSoft";

const meta: Meta<typeof ToastRegionSoft> = {
  title: "Soft/ToastRegionSoft",
  component: ToastRegionSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof ToastRegionSoft>;

export const Default: Story = {
  render: (args) => (
    <>
      <ButtonSoft onClick={() => toast({ title: "Message sent" })}>Show toast</ButtonSoft>
      <ToastRegionSoft {...args} />
    </>
  ),
};

const tones: SoftTone[] = ["red", "yellow", "blue"];
const toneQueue = createToastQueue();

export const Tones: Story = {
  render: () => (
    <>
      <ButtonSoft
        onClick={() => {
          for (const tone of tones) toneQueue({ title: `${tone} tone`, tone, timeout: 60000 });
        }}
      >
        Show tones
      </ButtonSoft>
      <ToastRegionSoft queue={toneQueue} />
    </>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <>
      <ButtonSoft onClick={() => toast({ title: "Item deleted", action: { label: "Undo", onAction: () => {} } })}>
        Show action toast
      </ButtonSoft>
      <ToastRegionSoft {...args} />
    </>
  ),
};
