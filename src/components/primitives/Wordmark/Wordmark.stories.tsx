import type { Meta, StoryObj } from "@storybook/react-vite";
import { Wordmark } from "./Wordmark";

const meta: Meta<typeof Wordmark> = { title: "Primitives/Wordmark", component: Wordmark };
export default meta;

export const ScrollToShrink: StoryObj<typeof Wordmark> = {
  render: () => (
    <div>
      <Wordmark className="bg-bh-paper-white">Lorem</Wordmark>
      <div className="h-[200vh] p-8 font-bh-body">Scroll: the wordmark shrinks to header size where supported.</div>
    </div>
  ),
};
