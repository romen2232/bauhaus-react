import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroupSwiss } from "./RadioGroupSwiss";

const meta: Meta<typeof RadioGroupSwiss> = {
  title: "Swiss/RadioGroupSwiss",
  component: RadioGroupSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof RadioGroupSwiss>;

const options = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "post", label: "Post" },
];

export const Default: Story = { args: { label: "Contact by", options, defaultValue: "email" } };
export const Horizontal: Story = { args: { label: "Contact by", options, orientation: "horizontal" } };
export const WithDescription: Story = {
  args: { label: "Contact by", options, description: "We only use this for order updates." },
};
export const Invalid: Story = {
  args: { label: "Contact by", options, isInvalid: true, errorMessage: "Pick one to continue." },
};
export const DisabledOption: Story = {
  args: {
    label: "Contact by",
    options: [options[0]!, { ...options[1]!, isDisabled: true }, options[2]!],
    defaultValue: "email",
  },
};
