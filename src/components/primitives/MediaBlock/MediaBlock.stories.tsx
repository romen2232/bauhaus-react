import type { Meta, StoryObj } from "@storybook/react-vite";
import { MediaBlock } from "./MediaBlock";

const photo =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 30'><rect width='40' height='30' fill='%23f4efe6' fill-opacity='0'/><rect x='8' y='6' width='24' height='24' fill='%23464646'/><rect x='12' y='10' width='4' height='4' fill='%23b5b5b5'/><rect x='22' y='10' width='4' height='4' fill='%23b5b5b5'/></svg>";

const meta: Meta<typeof MediaBlock> = { title: "Primitives/MediaBlock", component: MediaBlock };
export default meta;

export const Blue: StoryObj<typeof MediaBlock> = { args: { src: photo, alt: "Lorem ipsum", className: "w-80" } };
export const Red: StoryObj<typeof MediaBlock> = { args: { src: photo, alt: "Lorem ipsum", color: "red", className: "w-80" } };
