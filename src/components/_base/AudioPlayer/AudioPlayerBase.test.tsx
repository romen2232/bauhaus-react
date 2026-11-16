import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, vi } from "vitest";
import { AudioPlayerBase } from "./AudioPlayerBase";

const a = { root: "r", play: "", scrubber: "", track: "", thumb: "", time: "" };

// jsdom has no media playback: emulate a real element, which fires `play`/`pause` events.
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event("pause"));
  });
});

it("follows the media when it is paused from outside (ref, media keys)", async () => {
  const ref = createRef<HTMLAudioElement>();
  render(<AudioPlayerBase classes={a} src="t.mp3" title="T" ref={ref} />);
  await userEvent.click(screen.getByRole("button", { name: "Play T" }));
  fireEvent(ref.current!, new Event("pause"));
  expect(screen.getByRole("button", { name: "Play T" })).toBeInTheDocument();
});

it("stays on Play when playback is refused, without an unhandled rejection", async () => {
  vi.mocked(HTMLMediaElement.prototype.play).mockImplementation(() =>
    Promise.reject(new DOMException("blocked", "NotAllowedError")),
  );
  render(<AudioPlayerBase classes={a} src="t.mp3" title="T" />);
  await userEvent.click(screen.getByRole("button", { name: "Play T" }));
  expect(screen.getByRole("button", { name: "Play T" })).toBeInTheDocument();
});

it("resets to Play when the source is emptied", async () => {
  const ref = createRef<HTMLAudioElement>();
  render(<AudioPlayerBase classes={a} src="t.mp3" title="T" ref={ref} />);
  await userEvent.click(screen.getByRole("button", { name: "Play T" }));
  fireEvent(ref.current!, new Event("emptied"));
  expect(screen.getByRole("button", { name: "Play T" })).toBeInTheDocument();
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

it("renderTime receives formatted elapsed and total", () => {
  render(
    <AudioPlayerBase
      classes={a}
      src="/a.mp3"
      title="Intro"
      renderTime={({ elapsed, total }) => (
        <>
          <b>{elapsed}</b>
          <i>{total}</i>
        </>
      )}
    />,
  );
  expect(screen.getByText("0:00").tagName).toBe("B");
  expect(screen.getByText("--:--").tagName).toBe("I");
});
