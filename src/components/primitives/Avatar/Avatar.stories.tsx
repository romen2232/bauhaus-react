import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const portrait =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><rect width='10' height='10' fill='%23464646'/><circle cx='5' cy='4' r='2' fill='%23b5b5b5'/></svg>";

const meta: Meta<typeof Avatar> = { title: "Primitives/Avatar", component: Avatar };
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = { args: { src: portrait, alt: "Lorem ipsum" } };
export const WithRings: Story = { args: { src: portrait, alt: "Lorem ipsum", rings: 3, size: "lg" } };
