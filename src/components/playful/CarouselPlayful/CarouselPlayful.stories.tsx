import type { Meta, StoryObj } from "@storybook/react-vite";
import { CarouselPlayful } from "./CarouselPlayful";

const meta: Meta<typeof CarouselPlayful> = { title: "Playful/CarouselPlayful", component: CarouselPlayful };
export default meta;

const fills = ["bg-bh-red", "bg-bh-yellow", "bg-bh-blue", "bg-bh-pink"];

export const Default: StoryObj<typeof CarouselPlayful> = {
  render: () => (
    <CarouselPlayful label="Lorem projects" className="max-w-xl">
      {fills.map((f, i) => (
        <div key={f} className={`flex h-64 items-center justify-center font-bh-display text-6xl font-extrabold ${f}`}>
          {i + 1}
        </div>
      ))}
    </CarouselPlayful>
  ),
};

export const SingleSlide: StoryObj<typeof CarouselPlayful> = {
  render: () => (
    <CarouselPlayful label="Lorem" className="max-w-xl">
      <div className="flex h-64 items-center justify-center bg-bh-sky font-bh-display text-6xl">1</div>
    </CarouselPlayful>
  ),
};
