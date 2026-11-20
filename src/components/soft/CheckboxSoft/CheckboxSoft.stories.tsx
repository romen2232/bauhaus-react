import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxSoft } from "./CheckboxSoft";

const meta: Meta<typeof CheckboxSoft> = {
  title: "Soft/CheckboxSoft",
  component: CheckboxSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof CheckboxSoft>;

export const Default: Story = { args: { label: "Subscribe to updates" } };
export const WithDescription: Story = {
  args: { label: "Subscribe", description: "One email a month." },
};
export const Required: Story = { args: { label: "Accept the terms", isRequired: true } };
export const Indeterminate: Story = { args: { label: "Select all", isIndeterminate: true } };
export const Invalid: Story = {
  args: { label: "Accept the terms", isInvalid: true, errorMessage: "Accept to continue." },
};
export const Disabled: Story = { args: { label: "Locked", defaultSelected: true, isDisabled: true } };

const tones = ["neutral", "red", "yellow", "blue"] as const;
export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {tones.map((t) => (
        <CheckboxSoft key={t} label={t} tone={t} defaultSelected />
      ))}
    </div>
  ),
};
