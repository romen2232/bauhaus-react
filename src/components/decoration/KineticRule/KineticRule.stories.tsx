import type { Meta, StoryObj } from "@storybook/react-vite";
import { KineticRule } from "./KineticRule";

const meta: Meta<typeof KineticRule> = { title: "Decoration/KineticRule", component: KineticRule };
export default meta;

export const Default: StoryObj<typeof KineticRule> = { args: { className: "max-w-md" } };
export const Red: StoryObj<typeof KineticRule> = { args: { color: "red", className: "max-w-md" } };
