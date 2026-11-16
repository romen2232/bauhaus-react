import type { Meta, StoryObj } from "@storybook/react-vite";
import { CarouselSoft } from "./CarouselSoft";

const meta: Meta<typeof CarouselSoft> = {
  title: "Soft/CarouselSoft",
  component: CarouselSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof CarouselSoft>;

const slides = [
  { name: "Room A", tone: "bg-bh-blue text-bh-paper" },
  { name: "Room B", tone: "bg-bh-sand text-bh-ink" },
  { name: "Room C", tone: "bg-bh-charcoal text-bh-paper" },
];

export const Default: Story = {
  render: (args) => (
    <CarouselSoft {...args} className="max-w-md">
      {slides.map((s) => (
        <div key={s.name} className={`flex h-56 items-end p-6 font-bh-display text-4xl font-light ${s.tone}`}>
          {s.name}
        </div>
      ))}
    </CarouselSoft>
  ),
  args: { label: "Rooms" },
};
