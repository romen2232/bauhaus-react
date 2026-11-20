import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroupPlayful } from "./RadioGroupPlayful";

const meta: Meta<typeof RadioGroupPlayful> = {
  title: "Playful/RadioGroupPlayful",
  component: RadioGroupPlayful,
};
export default meta;
type Story = StoryObj<typeof RadioGroupPlayful>;

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

const colors = ["ink", "red", "yellow", "blue", "navy", "sky", "pink", "orange", "paper"] as const;
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {colors.map((c) => (
        <RadioGroupPlayful key={c} label={c} color={c} options={options} defaultValue="email" />
      ))}
    </div>
  ),
};
