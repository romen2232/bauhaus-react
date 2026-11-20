import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonPlayful } from "../ButtonPlayful/ButtonPlayful";
import { ModalPlayful } from "./ModalPlayful";

const meta: Meta<typeof ModalPlayful> = {
  title: "Playful/ModalPlayful",
  component: ModalPlayful,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof ModalPlayful>;

const confirm = ({ close }: { close: () => void }) => (
  <>
    <ButtonPlayful onClick={close}>Cancel</ButtonPlayful>
    <ButtonPlayful onClick={close}>Save</ButtonPlayful>
  </>
);

export const Default: Story = {
  args: {
    title: "Edit profile",
    trigger: <ButtonPlayful>Open modal</ButtonPlayful>,
    children: "Update your display name and contact details.",
    footer: confirm,
  },
};

export const Open: Story = {
  args: { title: "Edit profile", defaultOpen: true, children: "Update your display name and contact details.", footer: confirm },
};

export const Alert: Story = {
  args: {
    title: "Delete project?",
    role: "alertdialog",
    defaultOpen: true,
    children: "This cannot be undone.",
    footer: ({ close }) => <ButtonPlayful onClick={close}>Cancel</ButtonPlayful>,
  },
};

export const LongContent: Story = {
  args: {
    title: "Terms",
    defaultOpen: true,
    size: "sm",
    children: Array.from({ length: 40 }, (_, i) => <p key={i}>Paragraph {i + 1}. The body scrolls while the header and footer stay in place.</p>),
    footer: confirm,
  },
};
