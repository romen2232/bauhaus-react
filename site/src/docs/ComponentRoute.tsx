import { useParams } from "react-router";
import { NotFound } from "../pages/NotFound";
import { ComponentPage } from "./ComponentPage";
import { findEntry } from "./registry";

export function ComponentRoute() {
  const { slug = "" } = useParams();
  const entry = findEntry(slug);
  // Keyed by slug so the playground state resets between components.
  return entry ? <ComponentPage key={entry.slug} entry={entry} /> : <NotFound />;
}
