import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, vi } from "vitest";
import { AudioPlayerBase } from "./AudioPlayerBase";

const a = { root: "r", play: "", scrubber: "", track: "", thumb: "", time: "" };

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

it("toggles play and pause", async () => {
  render(<AudioPlayerBase classes={a} src="t.mp3" title="Track one" />);
  await userEvent.click(screen.getByRole("button", { name: "Play Track one" }));
  expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: "Pause Track one" }));
  expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Play Track one" })).toBeInTheDocument();
});

it("shows unknown duration before metadata loads", () => {
  render(<AudioPlayerBase classes={a} src="t.mp3" title="T" />);
  expect(screen.getByText("0:00 / --:--")).toBeInTheDocument();
  expect(screen.getByRole("slider", { name: "Seek" })).toBeInTheDocument();
});

it("shows the duration once metadata loads and follows playback time", () => {
  const ref = createRef<HTMLAudioElement>();
  render(<AudioPlayerBase classes={a} src="t.mp3" title="T" ref={ref} />);
  const audio = ref.current!;
  Object.defineProperty(audio, "duration", { configurable: true, value: 125 });
  fireEvent(audio, new Event("loadedmetadata"));
  audio.currentTime = 65;
  fireEvent(audio, new Event("timeupdate"));
  expect(screen.getByText("1:05 / 2:05")).toBeInTheDocument();
});

it("returns to play state when the track ends", async () => {
  const ref = createRef<HTMLAudioElement>();
  render(<AudioPlayerBase classes={a} src="t.mp3" title="T" ref={ref} />);
  await userEvent.click(screen.getByRole("button", { name: "Play T" }));
  fireEvent(ref.current!, new Event("ended"));
  expect(screen.getByRole("button", { name: "Play T" })).toBeInTheDocument();
});

it("passes children into the audio element and merges className", () => {
  const ref = createRef<HTMLAudioElement>();
  const { container } = render(
    <AudioPlayerBase classes={a} src="t.mp3" title="T" ref={ref} className="x">
      <track kind="captions" src="t.vtt" />
    </AudioPlayerBase>,
  );
  expect(ref.current).toBeInstanceOf(HTMLAudioElement);
  expect(ref.current!.querySelector("track")).not.toBeNull();
  expect(container.querySelector(".r")).toHaveClass("x");
});
