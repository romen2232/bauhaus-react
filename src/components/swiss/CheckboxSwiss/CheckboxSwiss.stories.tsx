import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxSwiss } from "./CheckboxSwiss";

const meta: Meta<typeof CheckboxSwiss> = {
  title: "Swiss/CheckboxSwiss",
  component: CheckboxSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof CheckboxSwiss>;

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
