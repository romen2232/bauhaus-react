import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonSwiss } from "../ButtonSwiss/ButtonSwiss";
import { TopBarSwiss } from "./TopBarSwiss";

const meta: Meta<typeof TopBarSwiss> = {
  title: "Swiss/TopBarSwiss",
  component: TopBarSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof TopBarSwiss>;

export const Default: Story = {
  args: {
    brand: "Konto",
    meta: ["Personal account", "CHF 12,480"],
    action: <ButtonSwiss size="sm">Menu</ButtonSwiss>,
  },
};
