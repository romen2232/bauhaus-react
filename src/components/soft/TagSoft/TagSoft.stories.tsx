import type { Meta, StoryObj } from "@storybook/react-vite";
import type { SoftTone } from "../../../lib/palette";
import { TagSoft } from "./TagSoft";

const meta: Meta<typeof TagSoft> = {
  title: "Soft/TagSoft",
  component: TagSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof TagSoft>;

export const Default: Story = { args: { children: "Open" } };

const tones: SoftTone[] = ["red", "yellow", "blue", "neutral"];
export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {tones.map((t) => (
        <TagSoft key={t} tone={t}>
          {t}
        </TagSoft>
      ))}
    </div>
  ),
};
