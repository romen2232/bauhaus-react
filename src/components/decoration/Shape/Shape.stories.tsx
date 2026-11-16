import type { Meta, StoryObj } from "@storybook/react-vite";
import { Shape, type ShapeKind, type ShapeRotation } from "./Shape";

const meta: Meta<typeof Shape> = { title: "Decoration/Shape", component: Shape };
export default meta;
type Story = StoryObj<typeof Shape>;

const kinds: ShapeKind[] = ["circle", "quarter", "half", "triangle", "square", "bar"];
const rotations: ShapeRotation[] = [0, 90, 180, 270];

export const AllKindsAndRotations: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {kinds.flatMap((kind) =>
        rotations.map((r) => <Shape key={`${kind}-${r}`} kind={kind} rotate={r} color="navy" className="size-20" />),
      )}
    </div>
  ),
};

export const PrimaryShapes: Story = {
  render: () => (
    <div className="flex gap-6">
      <Shape kind="triangle" color="yellow" className="size-24" />
      <Shape kind="square" color="red" className="size-24" />
      <Shape kind="circle" color="blue" className="size-24" />
    </div>
  ),
};

export const Spinning: Story = { args: { kind: "half", color: "ink", spin: true, className: "size-24" } };

export const Outlines: Story = {
  render: () => (
    <div className="flex gap-6">
      {(["circle", "quarter", "half", "triangle", "square", "bar"] as const).map((k) => (
        <Shape key={k} kind={k} fill="outline" color="ink" className="size-24" />
      ))}
    </div>
  ),
};

export const PatternFills: Story = {
  render: () => (
    <div className="flex gap-6">
      <Shape kind="circle" fill="pattern" pattern="halftone" color="red" className="size-24" />
      <Shape kind="square" fill="pattern" pattern="hatch-vertical" color="ink" className="size-24" />
      <Shape kind="triangle" fill="pattern" pattern="checker" color="blue" className="size-24" />
    </div>
  ),
};
