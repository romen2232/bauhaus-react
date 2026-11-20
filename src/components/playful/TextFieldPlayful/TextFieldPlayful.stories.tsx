import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextFieldPlayful } from "./TextFieldPlayful";

const meta: Meta<typeof TextFieldPlayful> = {
  title: "Playful/TextFieldPlayful",
  component: TextFieldPlayful,
};
export default meta;
type Story = StoryObj<typeof TextFieldPlayful>;

export const Default: Story = { args: { label: "Full name", placeholder: "Ada Lovelace" } };
export const WithDescription: Story = {
  args: { label: "Email", type: "email", description: "We only use it to reply." },
};
export const Required: Story = { args: { label: "Full name", isRequired: true } };
export const Invalid: Story = {
  args: { label: "Email", type: "email", defaultValue: "ada", isInvalid: true, errorMessage: "Enter a valid email address." },
};
export const Disabled: Story = { args: { label: "Full name", defaultValue: "Ada Lovelace", isDisabled: true } };
export const ReadOnly: Story = { args: { label: "Full name", defaultValue: "Ada Lovelace", isReadOnly: true } };
export const Password: Story = { args: { label: "Password", type: "password", defaultValue: "secret" } };
