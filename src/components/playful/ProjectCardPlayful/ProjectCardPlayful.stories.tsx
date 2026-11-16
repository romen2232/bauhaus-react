import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FillColor } from "../../../lib/palette";
import { Grid } from "../../primitives/Grid/Grid";
import { ProjectCardPlayful } from "./ProjectCardPlayful";

const meta: Meta<typeof ProjectCardPlayful> = { title: "Playful/ProjectCardPlayful", component: ProjectCardPlayful };
export default meta;
type Story = StoryObj<typeof ProjectCardPlayful>;

export const Single: Story = {
  args: { href: "#", initial: "T", title: "Tools", description: "Scripts, plugins and generators.", color: "pink" },
};

const row: Array<[string, string, FillColor]> = [
  ["T", "Tools", "pink"],
  ["A", "Archive", "yellow"],
  ["P", "Projects", "orange"],
  ["E", "Experiments", "blue"],
  ["R", "Resources", "paper"],
];

export const MijonjuRow: Story = {
  render: () => (
    <Grid cols={5} gap="sm">
      {row.map(([initial, title, color]) => (
        <ProjectCardPlayful key={title} href="#" initial={initial} title={title} color={color} description="Short description." />
      ))}
    </Grid>
  ),
};
