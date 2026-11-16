import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShapeMosaic, type MosaicTile } from "./ShapeMosaic";

const meta: Meta<typeof ShapeMosaic> = { title: "Decoration/ShapeMosaic", component: ShapeMosaic };
export default meta;

const moduloHero: MosaicTile[] = [
  { kind: "quarter", color: "navy", background: "sky", rotate: 0 },
  { kind: "half", color: "orange", background: "sky", rotate: 180 },
  { kind: "quarter", color: "pink", background: "navy", rotate: 90 },
  { kind: "circle", color: "navy", background: "orange" },
  { kind: "half", color: "navy", background: "sky", rotate: 90 },
  { kind: "quarter", color: "paper", background: "navy", rotate: 180 },
  { kind: "quarter", color: "sky", background: "paper", rotate: 270 },
  { kind: "half", color: "pink", background: "navy", rotate: 270 },
  { kind: "triangle", color: "orange", background: "navy" },
  { kind: "quarter", color: "navy", background: "pink", rotate: 0 },
  { kind: "half", color: "navy", background: "orange", rotate: 0 },
  { kind: "quarter", color: "pink", background: "sky", rotate: 180 },
];

export const ModuloHero: StoryObj<typeof ShapeMosaic> = {
  args: { cols: 4, tiles: moduloHero, className: "max-w-xl" },
};
