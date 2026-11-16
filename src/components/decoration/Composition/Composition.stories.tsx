import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pattern } from "../Pattern/Pattern";
import { Shape } from "../Shape/Shape";
import { Composition } from "./Composition";

const meta: Meta<typeof Composition> = { title: "Decoration/Composition", component: Composition };
export default meta;

export const Hero: StoryObj<typeof Composition> = {
  render: () => (
    <Composition
      cols={4}
      rows={4}
      className="size-96 bg-bh-paper"
      cells={[
        { col: 1, row: 1, rowSpan: 3, node: <Shape kind="square" color="red" /> },
        { col: 2, row: 1, colSpan: 2, rowSpan: 2, node: <Shape kind="half" color="ink" spin /> },
        { col: 4, row: 1, node: <Shape kind="quarter" color="yellow" rotate={90} /> },
        { col: 2, row: 3, colSpan: 2, node: <Pattern kind="hatch-vertical" /> },
        { col: 4, row: 3, rowSpan: 2, node: <Shape kind="circle" fill="outline" color="ink" /> },
        { col: 1, row: 4, colSpan: 3, node: <Pattern kind="halftone" color="red" /> },
      ]}
    />
  ),
};
