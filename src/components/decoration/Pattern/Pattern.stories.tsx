import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pattern, type PatternKind } from "./Pattern";

const meta: Meta<typeof Pattern> = { title: "Decoration/Pattern", component: Pattern };
export default meta;

const kinds: PatternKind[] = ["hatch-vertical", "hatch-horizontal", "checker", "grid-paper", "halftone", "grain"];

export const AllKinds: StoryObj<typeof Pattern> = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {kinds.map((k) => (
        <div key={k} className="flex flex-col gap-2">
          <div className="size-32 border border-bh-rule bg-bh-paper">
            <Pattern kind={k} />
          </div>
          <span className="font-bh-body text-xs">{k}</span>
        </div>
      ))}
    </div>
  ),
};

export const Coloured: StoryObj<typeof Pattern> = {
  render: () => (
    <div className="size-48 bg-bh-sand">
      <Pattern kind="hatch-vertical" color="ink" />
    </div>
  ),
};
