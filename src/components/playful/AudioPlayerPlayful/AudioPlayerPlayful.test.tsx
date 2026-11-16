import { render, screen } from "@testing-library/react";
import { AudioPlayerPlayful } from "./AudioPlayerPlayful";

it("has a round ink play button and a seek slider", () => {
  render(<AudioPlayerPlayful src="t.mp3" title="Track one" />);
  expect(screen.getByRole("button", { name: "Play Track one" })).toHaveClass("rounded-full", "bg-bh-ink");
  expect(screen.getByRole("slider", { name: "Seek" })).toBeInTheDocument();
});
