import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextFieldSwiss } from "./TextFieldSwiss";

const meta: Meta<typeof TextFieldSwiss> = {
  title: "Swiss/TextFieldSwiss",
  component: TextFieldSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof TextFieldSwiss>;

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
