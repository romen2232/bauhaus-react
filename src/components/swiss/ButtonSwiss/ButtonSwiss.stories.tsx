import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonSwiss } from "./ButtonSwiss";

const meta: Meta<typeof ButtonSwiss> = {
  title: "Swiss/ButtonSwiss",
  component: ButtonSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof ButtonSwiss>;

export const Solid: Story = { args: { children: "Transfer money" } };
export const Outline: Story = { args: { children: "Maybe later", variant: "outline" } };
export const Accent: Story = { args: { children: "Pay now", variant: "color" } };
export const AsLink: Story = { args: { children: "View account", href: "#" } };
export const Disabled: Story = { args: { children: "Account closed", disabled: true } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ButtonSwiss size="sm">Small</ButtonSwiss>
      <ButtonSwiss size="md">Medium</ButtonSwiss>
      <ButtonSwiss size="lg">Large</ButtonSwiss>
    </div>
  ),
};
