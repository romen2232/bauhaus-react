import { useParams } from "react-router";
import { NotFound } from "../../pages/NotFound";
import { Install } from "./Install";
import { MixingLooks } from "./MixingLooks";
import { Theme } from "./Theme";

const PAGES: Record<string, () => React.JSX.Element> = {
  install: Install,
  theme: Theme,
  "mixing-looks": MixingLooks,
};

export function GettingStarted() {
  const { page = "" } = useParams();
  const Page = PAGES[page];
  return Page ? <Page /> : <NotFound />;
}
