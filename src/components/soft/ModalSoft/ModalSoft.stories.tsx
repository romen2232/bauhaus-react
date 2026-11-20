import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonSoft } from "../ButtonSoft/ButtonSoft";
import { ModalSoft } from "./ModalSoft";

const meta: Meta<typeof ModalSoft> = {
  title: "Soft/ModalSoft",
  component: ModalSoft,
  parameters: { backgrounds: { default: "paper" } },
};
export default meta;
type Story = StoryObj<typeof ModalSoft>;

const confirm = ({ close }: { close: () => void }) => (
  <>
    <ButtonSoft onClick={close}>Cancel</ButtonSoft>
    <ButtonSoft onClick={close}>Save</ButtonSoft>
  </>
);

export const Default: Story = {
  args: {
    title: "Edit profile",
    trigger: <ButtonSoft>Open modal</ButtonSoft>,
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
    footer: ({ close }) => <ButtonSoft onClick={close}>Cancel</ButtonSoft>,
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
