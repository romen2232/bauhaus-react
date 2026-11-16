import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonSoft } from "../ButtonSoft/ButtonSoft";
import { TopBarSoft } from "./TopBarSoft";

const meta: Meta<typeof TopBarSoft> = {
  title: "Soft/TopBarSoft",
  component: TopBarSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof TopBarSoft>;

export const Default: Story = {
  args: { brand: "Rooms", meta: ["Monday 16 November", "3 bookings"], action: <ButtonSoft size="sm">Book</ButtonSoft> },
};
