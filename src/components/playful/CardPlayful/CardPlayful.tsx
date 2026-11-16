import { cn } from "../../../lib/cn.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { CardBase, type CardBaseProps } from "../../_base/Card/CardBase.js";

export type CardPlayfulProps = Omit<CardBaseProps, "classes">;

const SLOTS = {
  header: "border-b-2 border-bh-ink p-4 font-bh-display text-lg font-bold uppercase",
  body: "p-4 font-bh-body text-sm",
  footer: "border-t-2 border-bh-ink p-4 font-bh-body text-xs uppercase tracking-[0.1em]",
};

/** Sharp content panel with an ink border and hard shadow. */
export function CardPlayful(props: CardPlayfulProps) {
  const root = cn(
    "flex flex-col rounded-none border-2 border-bh-ink bg-bh-paper text-bh-ink shadow-bh-hard",
    props.href !== undefined &&
      cn(
        "motion-safe:transition-[translate,box-shadow] motion-safe:duration-150 hover:shadow-bh-hard-lg motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5",
        FOCUS_RING,
      ),
  );
  return <CardBase {...props} classes={{ root, ...SLOTS }} />;
}
