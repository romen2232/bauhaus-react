import type { Meta, StoryObj } from "@storybook/react-vite";
import { AudioPlayerPlayful } from "./AudioPlayerPlayful";

const meta: Meta<typeof AudioPlayerPlayful> = { title: "Playful/AudioPlayerPlayful", component: AudioPlayerPlayful };
export default meta;

// No audio file ships with the stories: the player shows its "unknown duration" state.
export const Default: StoryObj<typeof AudioPlayerPlayful> = {
  args: { src: "", title: "Lorem ipsum", className: "max-w-md" },
};
