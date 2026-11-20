import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonSwiss } from "../ButtonSwiss/ButtonSwiss";
import { ModalSwiss } from "./ModalSwiss";

const meta: Meta<typeof ModalSwiss> = {
  title: "Swiss/ModalSwiss",
  component: ModalSwiss,
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;
type Story = StoryObj<typeof ModalSwiss>;

const confirm = ({ close }: { close: () => void }) => (
  <>
    <ButtonSwiss onClick={close}>Cancel</ButtonSwiss>
    <ButtonSwiss onClick={close}>Save</ButtonSwiss>
  </>
);

export const Default: Story = {
  args: {
    title: "Edit profile",
    trigger: <ButtonSwiss>Open modal</ButtonSwiss>,
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
    footer: ({ close }) => <ButtonSwiss onClick={close}>Cancel</ButtonSwiss>,
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
