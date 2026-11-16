import type { Meta, StoryObj } from "@storybook/react-vite";
import { AudioPlayerSoft } from "./AudioPlayerSoft";

const meta: Meta<typeof AudioPlayerSoft> = {
  title: "Soft/AudioPlayerSoft",
  component: AudioPlayerSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof AudioPlayerSoft>;

export const Default: Story = {
  args: { src: "", title: "Welcome message", className: "max-w-sm" },
};
