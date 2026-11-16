import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { AudioPlayerSoft } from "./AudioPlayerSoft";

it("shows a big elapsed numeral and the total before metadata loads", () => {
  render(<AudioPlayerSoft src="/a.mp3" title="Intro" />);
  expect(screen.getByText("0:00")).toHaveClass("text-6xl");
  expect(screen.getByText(/--:--/)).toBeInTheDocument();
  expect(document.body.textContent).not.toMatch(/NaN/);
});

it("has a named play button and seek slider", () => {
  render(<AudioPlayerSoft src="/a.mp3" title="Intro" />);
  expect(screen.getByRole("button", { name: "Play Intro" })).toHaveClass("rounded-full", "bg-bh-paper");
  expect(screen.getByRole("slider", { name: "Seek" })).toBeInTheDocument();
});

it("merges className onto a rounded charcoal root and forwards the audio ref", () => {
  const ref = createRef<HTMLAudioElement>();
  render(<AudioPlayerSoft src="/a.mp3" title="Intro" className="max-w-md" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLAudioElement);
  expect(ref.current!.parentElement).toHaveClass("max-w-md", "rounded-bh-soft", "bg-bh-charcoal");
});
