import type { Meta, StoryObj } from "@storybook/react-vite";
import { SwitchSwiss } from "./SwitchSwiss";

const meta: Meta<typeof SwitchSwiss> = {
  title: "Swiss/SwitchSwiss",
  component: SwitchSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof SwitchSwiss>;

export const Default: Story = { args: { label: "Notifications" } };
export const On: Story = { args: { label: "Notifications", defaultSelected: true } };
export const WithDescription: Story = {
  args: { label: "Notifications", description: "Sent by email." },
};
export const Invalid: Story = {
  args: { label: "Accept the terms", isInvalid: true, errorMessage: "Turn on to continue." },
};
export const Disabled: Story = { args: { label: "Locked", defaultSelected: true, isDisabled: true } };
