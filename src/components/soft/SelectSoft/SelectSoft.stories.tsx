import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectSoft } from "./SelectSoft";

const meta: Meta<typeof SelectSoft> = {
  title: "Soft/SelectSoft",
  component: SelectSoft,
};
export default meta;
type Story = StoryObj<typeof SelectSoft>;

const items = [
  { id: "banana", label: "Banana" },
  { id: "cherry", label: "Cherry" },
  { id: "apple", label: "Apple" },
];

export const Default: Story = { args: { label: "Fruit", items, placeholder: "Choose a fruit" } };
export const WithDescription: Story = {
  args: { label: "Fruit", items, description: "Pick your favourite." },
};
export const Required: Story = { args: { label: "Fruit", items, isRequired: true } };
export const Invalid: Story = {
  args: { label: "Fruit", items, isInvalid: true, errorMessage: "Pick a fruit to continue." },
};
export const Disabled: Story = { args: { label: "Fruit", items, isDisabled: true } };
export const DisabledItem: Story = {
  args: { label: "Fruit", items: [items[0]!, { ...items[1]!, isDisabled: true }, items[2]!] },
};
export const Preselected: Story = { args: { label: "Fruit", items, defaultSelectedKey: "apple" } };
