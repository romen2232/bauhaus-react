import type { Preview } from "@storybook/react-vite";
import "./preview.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: { paper: { name: "Paper", value: "#F4EFE6" }, white: { name: "White", value: "#FFFFFF" } },
    },
    a11y: { test: "error" },
  },
  initialGlobals: { backgrounds: { value: "paper" } },
};

export default preview;
