import { render, screen } from "@testing-library/react";
import { ButtonPlayful } from "bauhaus-react";

test("resolves the library alias to src", () => {
  render(<ButtonPlayful>Go</ButtonPlayful>);
  expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
});
