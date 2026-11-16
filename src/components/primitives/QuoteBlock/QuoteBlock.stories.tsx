import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuoteBlock } from "./QuoteBlock";

const meta: Meta<typeof QuoteBlock> = { title: "Primitives/QuoteBlock", component: QuoteBlock };
export default meta;

export const Default: StoryObj<typeof QuoteBlock> = {
  args: { children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", cite: "Lorem Ipsum", className: "max-w-xl" },
};
