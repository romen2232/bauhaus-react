import type { Meta, StoryObj } from "@storybook/react-vite";
import { SwitchSoft } from "./SwitchSoft";

const meta: Meta<typeof SwitchSoft> = {
  title: "Soft/SwitchSoft",
  component: SwitchSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof SwitchSoft>;

export const Default: Story = { args: { label: "Notifications" } };
export const On: Story = { args: { label: "Notifications", defaultSelected: true } };
export const WithDescription: Story = {
  args: { label: "Notifications", description: "Sent by email." },
};
export const Invalid: Story = {
  args: { label: "Accept the terms", isInvalid: true, errorMessage: "Turn on to continue." },
};
export const Disabled: Story = { args: { label: "Locked", defaultSelected: true, isDisabled: true } };

const tones = ["neutral", "red", "yellow", "blue"] as const;
export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {tones.map((t) => (
        <SwitchSoft key={t} label={t} tone={t} defaultSelected />
      ))}
    </div>
  ),
};
