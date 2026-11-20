import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroupSoft } from "./RadioGroupSoft";

const meta: Meta<typeof RadioGroupSoft> = {
  title: "Soft/RadioGroupSoft",
  component: RadioGroupSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof RadioGroupSoft>;

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

const tones = ["neutral", "red", "yellow", "blue"] as const;
export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {tones.map((t) => (
        <RadioGroupSoft key={t} label={t} tone={t} options={options} defaultValue="email" />
      ))}
    </div>
  ),
};
