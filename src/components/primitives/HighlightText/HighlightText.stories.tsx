import type { Meta, StoryObj } from "@storybook/react-vite";
import { HighlightText } from "./HighlightText";

const meta: Meta<typeof HighlightText> = { title: "Primitives/HighlightText", component: HighlightText };
export default meta;

export const Manifesto: StoryObj<typeof HighlightText> = {
  render: () => (
    <HighlightText className="max-w-2xl text-4xl leading-tight tracking-tight">
      In the manifesto, Gropius championed <HighlightText.Mark>the school's mission</HighlightText.Mark> —
      architecture, sculpture and painting were <HighlightText.Mark>to lead back to the crafts.</HighlightText.Mark>
    </HighlightText>
  ),
};
