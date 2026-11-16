import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButtonPlayful } from "./IconButtonPlayful";

const meta: Meta<typeof IconButtonPlayful> = { title: "Playful/IconButtonPlayful", component: IconButtonPlayful };
export default meta;

export const Carousel: StoryObj<typeof IconButtonPlayful> = {
  render: () => (
    <div className="flex gap-3">
      <IconButtonPlayful aria-label="Previous" variant="outline">←</IconButtonPlayful>
      <IconButtonPlayful aria-label="Next">→</IconButtonPlayful>
    </div>
  ),
};
