import type { Meta, StoryObj } from "@storybook/react-vite";
import { HighlightText } from "./HighlightText";

const meta: Meta<typeof HighlightText> = { title: "Primitives/HighlightText", component: HighlightText };
export default meta;

export const Default: StoryObj<typeof HighlightText> = {
  render: () => (
    <HighlightText className="max-w-2xl text-4xl leading-tight tracking-tight">
      Lorem ipsum dolor sit amet, <HighlightText.Mark>consectetur adipiscing</HighlightText.Mark> —
      sed do eiusmod tempor and incididunt ut labore <HighlightText.Mark>et dolore magna aliqua.</HighlightText.Mark>
    </HighlightText>
  ),
};
