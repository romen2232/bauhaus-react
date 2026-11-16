import type { Meta, StoryObj } from "@storybook/react-vite";
import { AudioPlayerSwiss } from "./AudioPlayerSwiss";

const meta: Meta<typeof AudioPlayerSwiss> = {
  title: "Swiss/AudioPlayerSwiss",
  component: AudioPlayerSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof AudioPlayerSwiss>;

export const Default: Story = {
  args: { src: "", title: "Account update", className: "max-w-md" },
};
