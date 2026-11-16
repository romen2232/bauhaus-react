import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButtonPlayful } from "../IconButtonPlayful/IconButtonPlayful";
import { StackCardPlayful } from "./StackCardPlayful";

const meta: Meta<typeof StackCardPlayful> = { title: "Playful/StackCardPlayful", component: StackCardPlayful };
export default meta;

export const Stack: StoryObj<typeof StackCardPlayful> = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      {(["yellow", "red", "blue"] as const).map((c) => (
        <StackCardPlayful
          key={c}
          color={c}
          action={
            <IconButtonPlayful aria-label="Add lorem" size="sm">
              +
            </IconButtonPlayful>
          }
        >
          Lorem ipsum dolor
        </StackCardPlayful>
      ))}
    </div>
  ),
};
