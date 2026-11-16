import { SWISS_DISPLAY, SWISS_LABEL, SWISS_MOTION, SWISS_RAC_FOCUS } from "./styles";

it("Swiss strings carry the spec'd type and focus rules", () => {
  expect(SWISS_LABEL).toContain("tracking-[0.1em]");
  expect(SWISS_DISPLAY).toContain("tracking-[-0.03em]");
  expect(SWISS_RAC_FOCUS).toContain("data-[focus-visible]:outline-solid");
  expect(SWISS_MOTION).toContain("motion-safe:");
});
