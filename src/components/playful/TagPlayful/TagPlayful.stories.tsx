import type { Meta, StoryObj } from "@storybook/react-vite";
import { TagPlayful } from "./TagPlayful";

const meta: Meta<typeof TagPlayful> = { title: "Playful/TagPlayful", component: TagPlayful };
export default meta;

export const Set: StoryObj<typeof TagPlayful> = {
  render: () => (
    <div className="flex gap-2">
      <TagPlayful color="pink">New script</TagPlayful>
      <TagPlayful color="yellow">Daily sketch</TagPlayful>
      <TagPlayful color="blue">WebGL toy</TagPlayful>
    </div>
  ),
};
