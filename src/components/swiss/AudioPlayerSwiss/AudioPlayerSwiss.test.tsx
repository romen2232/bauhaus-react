import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { AudioPlayerSwiss } from "./AudioPlayerSwiss";

it("reads 0:00 / --:-- before metadata loads, never NaN", () => {
  render(<AudioPlayerSwiss src="/a.mp3" title="Intro" />);
  expect(screen.getByText("0:00 / --:--")).toBeInTheDocument();
  expect(document.body.textContent).not.toMatch(/NaN/);
});

it("has a square thumb and a hairline track", () => {
  const { container } = render(<AudioPlayerSwiss src="/a.mp3" title="Intro" />);
  expect(container.querySelector(".before\\:h-px")).not.toBeNull();
  expect(container.querySelector(".size-3")?.className).not.toMatch(/rounded/);
});

it("has a named play button and seek slider", () => {
  render(<AudioPlayerSwiss src="/a.mp3" title="Intro" />);
  expect(screen.getByRole("button", { name: "Play Intro" })).toHaveClass("rounded-full", "border-bh-ink");
  expect(screen.getByRole("slider", { name: "Seek" })).toBeInTheDocument();
});

it("merges className onto the root and forwards the audio ref", () => {
  const ref = createRef<HTMLAudioElement>();
  render(<AudioPlayerSwiss src="/a.mp3" title="Intro" className="max-w-md" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLAudioElement);
  expect(ref.current!.parentElement).toHaveClass("max-w-md", "text-bh-ink");
});
