import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxPlayful } from "./CheckboxPlayful";

const meta: Meta<typeof CheckboxPlayful> = {
  title: "Playful/CheckboxPlayful",
  component: CheckboxPlayful,
};
export default meta;
type Story = StoryObj<typeof CheckboxPlayful>;

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

const colors = ["ink", "red", "yellow", "blue", "navy", "sky", "pink", "orange", "paper"] as const;
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {colors.map((c) => (
        <CheckboxPlayful key={c} label={c} color={c} defaultSelected />
      ))}
    </div>
  ),
};
