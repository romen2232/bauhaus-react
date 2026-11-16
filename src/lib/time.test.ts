import { formatTime } from "./time";

it.each([
  [0, "0:00"],
  [65, "1:05"],
  [65.9, "1:05"],
  [3599, "59:59"],
  [3600, "60:00"],
  [Number.NaN, "--:--"],
  [Infinity, "--:--"],
  [-3, "0:00"],
])("formatTime(%s) is %s", (s, out) => {
  expect(formatTime(s)).toBe(out);
});
