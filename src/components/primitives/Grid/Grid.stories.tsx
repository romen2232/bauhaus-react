import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid } from "./Grid";

const meta: Meta<typeof Grid> = { title: "Primitives/Grid", component: Grid };
export default meta;
type Story = StoryObj<typeof Grid>;

const cells = (n: number) =>
  Array.from({ length: n }, (_, i) => (
    <div key={i} className="min-h-24 p-4 font-bh-body text-sm">
      {String(i + 1).padStart(2, "0")}
    </div>
  ));

export const Plain: Story = { args: { cols: 4, children: cells(8) } };
export const RuledLikeAboutUs: Story = { args: { cols: 5, ruled: true, children: cells(20) } };
