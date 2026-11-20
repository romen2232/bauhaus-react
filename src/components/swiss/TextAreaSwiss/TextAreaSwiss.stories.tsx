import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextAreaSwiss } from "./TextAreaSwiss";

const meta: Meta<typeof TextAreaSwiss> = {
  title: "Swiss/TextAreaSwiss",
  component: TextAreaSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof TextAreaSwiss>;

export const Default: Story = { args: { label: "Notes", placeholder: "Tell us more" } };
export const WithDescription: Story = {
  args: { label: "Message", description: "We reply within two working days." },
};
export const Invalid: Story = {
  args: { label: "Message", isInvalid: true, errorMessage: "Enter a message." },
};
export const Disabled: Story = { args: { label: "Notes", defaultValue: "Locked", isDisabled: true } };
export const Tall: Story = { args: { label: "Notes", rows: 8 } };
