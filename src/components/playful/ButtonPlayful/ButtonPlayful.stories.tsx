import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FillColor } from "../../../lib/palette";
import { ButtonPlayful } from "./ButtonPlayful";

const meta: Meta<typeof ButtonPlayful> = { title: "Playful/ButtonPlayful", component: ButtonPlayful };
export default meta;
type Story = StoryObj<typeof ButtonPlayful>;

export const Solid: Story = { args: { children: "Primary action" } };
export const Outline: Story = { args: { children: "Secondary action", variant: "outline" } };
export const AsLink: Story = { args: { children: "Learn more", href: "#" } };
export const Disabled: Story = { args: { children: "Closed", disabled: true } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ButtonPlayful size="sm">Small</ButtonPlayful>
      <ButtonPlayful size="md">Medium</ButtonPlayful>
      <ButtonPlayful size="lg">Large</ButtonPlayful>
    </div>
  ),
};

const colors: FillColor[] = ["red", "yellow", "blue", "navy", "sky", "pink", "orange", "ink", "paper"];
export const ColorPalette: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {colors.map((c) => (
        <ButtonPlayful key={c} variant="color" color={c}>
          {c}
        </ButtonPlayful>
      ))}
    </div>
  ),
};
