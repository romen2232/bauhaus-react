import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "../../../lib/toast";
import { ButtonSwiss } from "../ButtonSwiss/ButtonSwiss";
import { ToastRegionSwiss } from "./ToastRegionSwiss";

const meta: Meta<typeof ToastRegionSwiss> = {
  title: "Swiss/ToastRegionSwiss",
  component: ToastRegionSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof ToastRegionSwiss>;

export const Default: Story = {
  render: (args) => (
    <>
      <ButtonSwiss onClick={() => toast({ title: "Message sent" })}>Show toast</ButtonSwiss>
      <ToastRegionSwiss {...args} />
    </>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <>
      <ButtonSwiss onClick={() => toast({ title: "Item deleted", action: { label: "Undo", onAction: () => {} } })}>
        Show action toast
      </ButtonSwiss>
      <ToastRegionSwiss {...args} />
    </>
  ),
};
