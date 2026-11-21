import {
  ButtonPlayful,
  ButtonSoft,
  ButtonSwiss,
  MenuOverlayPlayful,
  MenuOverlaySoft,
  MenuOverlaySwiss,
  ModalPlayful,
  ModalSoft,
  ModalSwiss,
  ToastRegionPlayful,
  ToastRegionSoft,
  ToastRegionSwiss,
  createToastQueue,
  type ToastQueueHandle,
} from "bauhaus-react";
import type { SingleLook } from "../../look/LookContext";
import { flag, imports, skins, text, type AnyComponent } from "./helpers";
import type { DocEntry } from "./types";

const BUTTON: Record<SingleLook, AnyComponent> = { playful: ButtonPlayful, swiss: ButtonSwiss, soft: ButtonSoft };

// One queue per look, so a toast fired in one row never appears in another.
const QUEUES: Record<SingleLook, ToastQueueHandle> = {
  playful: createToastQueue(),
  swiss: createToastQueue(),
  soft: createToastQueue(),
};

export const OVERLAYS: DocEntry[] = [
  {
    slug: "modal",
    title: "Modal",
    group: "Overlays",
    purpose: "A dialog over the page, opened by a trigger. Focus is trapped inside and returns to the trigger on close.",
    principles: ["p2", "p10"],
    looks: skins(
      "Modal",
      { playful: ModalPlayful, swiss: ModalSwiss, soft: ModalSoft },
      (C, v, look) => {
        const Button = BUTTON[look];
        return (
          <C
            title="Publish project"
            size={text(v, "size")}
            isDismissable={flag(v, "dismissable")}
            trigger={<Button>Open modal</Button>}
            footer={({ close }: { close: () => void }) => <Button onClick={close}>Close</Button>}
          >
            <p>Publishing makes the project visible to everyone with the link.</p>
          </C>
        );
      },
      (n) =>
        `${imports(n, "ButtonPlayful")}\n\n<${n}\n  title="Publish project"\n  trigger={<ButtonPlayful>Open modal</ButtonPlayful>}\n  footer={({ close }) => <ButtonPlayful onClick={close}>Close</ButtonPlayful>}\n>\n  Publishing makes the project visible to everyone with the link.\n</${n}>`,
    ),
    controls: [
      { prop: "size", kind: "select", options: ["sm", "md", "lg"], initial: "md" },
      { prop: "dismissable", kind: "boolean", initial: true },
    ],
    dos: ["Name the dialog with a short title.", "Put the primary action in the footer."],
    donts: ["Do not open a modal on page load.", "Do not stack modals."],
    a11y: ["Focus moves in on open, is trapped, and returns to the trigger on close.", "Escape closes it when isDismissable is true. Use role alertdialog for destructive confirmations."],
  },
  {
    slug: "toast",
    title: "Toast",
    group: "Overlays",
    purpose: "A short message that appears over the page and goes away on its own. Fired from anywhere through a queue.",
    principles: ["p2", "p11"],
    looks: skins(
      "ToastRegion",
      { playful: ToastRegionPlayful, swiss: ToastRegionSwiss, soft: ToastRegionSoft },
      (C, v, look) => {
        const Button = BUTTON[look];
        const queue = QUEUES[look];
        return (
          <>
            <C queue={queue} />
            <Button onClick={() => queue({ title: text(v, "title"), description: "Your draft is safe.", timeout: 4000, color: "yellow", tone: "yellow" })}>
              Show toast
            </Button>
          </>
        );
      },
      (n) =>
        `${imports(n, "toast")}\n\n// Once, near the root of your app:\n<${n} />\n\n// Anywhere:\ntoast({ title: "Saved", description: "Your draft is safe." });`,
    ),
    controls: [{ prop: "title", kind: "text", initial: "Saved" }],
    dos: ["Keep the title to a few words.", "Use an action for anything the person might want to undo."],
    donts: ["Do not put essential information only in a toast: it disappears.", "A toast with an action never auto-dismisses, so do not add one casually."],
    a11y: ["The region is a live region named Notifications; each toast is announced.", "Timers pause on hover and focus."],
  },
  {
    slug: "menu-overlay",
    title: "MenuOverlay",
    group: "Overlays",
    purpose: "A full-screen navigation menu opened from a trigger, for sites that keep the header minimal.",
    principles: ["p8", "p6"],
    looks: skins(
      "MenuOverlay",
      { playful: MenuOverlayPlayful, swiss: MenuOverlaySwiss, soft: MenuOverlaySoft },
      (C, v) => (
        <C
          title="Menu"
          triggerLabel={text(v, "label")}
          links={[
            { href: "#", label: "Work", current: true },
            { href: "#", label: "About" },
            { href: "#", label: "Contact" },
          ]}
        />
      ),
      (n) =>
        `${imports(n)}\n\n<${n}\n  title="Menu"\n  triggerLabel="Open menu"\n  links={[{ href: "/work", label: "Work", current: true }, { href: "/about", label: "About" }]}\n/>`,
    ),
    controls: [{ prop: "label", kind: "text", initial: "Open menu" }],
    dos: ["Mark the current page with current: true."],
    donts: ["Do not hide the only navigation behind it on desktop widths."],
    a11y: ["Focus is trapped while open and returns to the trigger; Escape closes it.", "The current link carries aria-current=\"page\"."],
  },
];
