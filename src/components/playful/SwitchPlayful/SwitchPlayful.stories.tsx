import type { Meta, StoryObj } from "@storybook/react-vite";
import { SwitchPlayful } from "./SwitchPlayful";

const meta: Meta<typeof SwitchPlayful> = {
  title: "Playful/SwitchPlayful",
  component: SwitchPlayful,
};
export default meta;
type Story = StoryObj<typeof SwitchPlayful>;

export const Default: Story = { args: { label: "Notifications" } };
export const On: Story = { args: { label: "Notifications", defaultSelected: true } };
export const WithDescription: Story = {
  args: { label: "Notifications", description: "Sent by email." },
};
export const Invalid: Story = {
  args: { label: "Accept the terms", isInvalid: true, errorMessage: "Turn on to continue." },
};
export const Disabled: Story = { args: { label: "Locked", defaultSelected: true, isDisabled: true } };

const colors = ["ink", "red", "yellow", "blue", "navy", "sky", "pink", "orange", "paper"] as const;
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {colors.map((c) => (
        <SwitchPlayful key={c} label={c} color={c} defaultSelected />
      ))}
    </div>
  ),
};
