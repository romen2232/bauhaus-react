import { StackCardBase, type StackCardBaseProps } from "../../_base/StackCard/StackCardBase.js";

export type StackCardSwissProps = Omit<StackCardBaseProps, "classes">;

const CLASSES = {
  root: "relative flex items-center gap-4 border border-bh-rule py-4 pr-4 pl-6 text-bh-ink",
  spine: "absolute inset-y-0 left-0 w-0.5 bg-bh-accent",
  body: "flex-1 font-bh-grotesk",
  action: "shrink-0",
};

/** Swiss list card with one 2px accent spine. */
export function StackCardSwiss(props: StackCardSwissProps) {
  return <StackCardBase {...props} classes={CLASSES} />;
}
