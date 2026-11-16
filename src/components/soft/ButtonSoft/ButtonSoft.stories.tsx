import type { Meta, StoryObj } from "@storybook/react-vite";
import type { SoftTone } from "../../../lib/palette";
import { ButtonSoft } from "./ButtonSoft";

const meta: Meta<typeof ButtonSoft> = {
  title: "Soft/ButtonSoft",
  component: ButtonSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof ButtonSoft>;

export const Solid: Story = { args: { children: "Book a room" } };
export const Outline: Story = { args: { children: "Maybe later", variant: "outline" } };
export const AsLink: Story = { args: { children: "See schedule", href: "#" } };
export const Disabled: Story = { args: { children: "Fully booked", disabled: true } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ButtonSoft size="sm">Small</ButtonSoft>
      <ButtonSoft size="md">Medium</ButtonSoft>
      <ButtonSoft size="lg">Large</ButtonSoft>
    </div>
  ),
};

const tones: SoftTone[] = ["red", "yellow", "blue", "neutral"];
export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {tones.map((t) => (
        <ButtonSoft key={t} variant="color" tone={t}>
          {t}
        </ButtonSoft>
      ))}
    </div>
  ),
};
