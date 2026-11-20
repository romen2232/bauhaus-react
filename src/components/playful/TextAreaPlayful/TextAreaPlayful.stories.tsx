import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextAreaPlayful } from "./TextAreaPlayful";

const meta: Meta<typeof TextAreaPlayful> = {
  title: "Playful/TextAreaPlayful",
  component: TextAreaPlayful,
};
export default meta;
type Story = StoryObj<typeof TextAreaPlayful>;

export const Default: Story = { args: { label: "Notes", placeholder: "Tell us more" } };
export const WithDescription: Story = {
  args: { label: "Message", description: "We reply within two working days." },
};
export const Invalid: Story = {
  args: { label: "Message", isInvalid: true, errorMessage: "Enter a message." },
};
export const Disabled: Story = { args: { label: "Notes", defaultValue: "Locked", isDisabled: true } };
export const Tall: Story = { args: { label: "Notes", rows: 8 } };
