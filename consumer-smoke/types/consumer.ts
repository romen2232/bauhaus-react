// Type-level consumer check under Node's strict ESM resolution (nodenext).
import {
  ButtonPlayful,
  Shape,
  type FillColor,
  type ButtonPlayfulProps,
  type ChartDatum,
  type ChartSeries,
} from "bauhaus-react";

const color: FillColor = "navy";
// @ts-expect-error not a FillColor: proves FillColor resolved to a real union, not `any`
const bad: FillColor = "purple";
const props: ButtonPlayfulProps = { children: "Go", variant: "color", color };

const datum: ChartDatum = { label: "Jan", value: 1 };
const series: ChartSeries = { id: "a", label: "A", data: [datum] };
// @ts-expect-error value must be a number
const badDatum: ChartDatum = { label: "Jan", value: "1" };

export { ButtonPlayful, Shape, bad, props, datum, series, badDatum };
