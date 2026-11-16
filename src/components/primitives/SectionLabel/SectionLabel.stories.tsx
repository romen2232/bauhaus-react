import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionLabel } from "./SectionLabel";

const meta: Meta<typeof SectionLabel> = { title: "Primitives/SectionLabel", component: SectionLabel };
export default meta;

export const Default: StoryObj<typeof SectionLabel> = { args: { marker: "P", children: "Projects" } };
export const MarkerOnly: StoryObj<typeof SectionLabel> = { args: { marker: "B" } };
