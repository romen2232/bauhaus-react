import { ButtonBase, type ButtonBaseProps } from "../Button/ButtonBase.js";

/** Icon-only buttons have no visible text, so an accessible name is required. */
export type IconButtonBaseProps = ButtonBaseProps & { "aria-label": string };

/** Internal: behaviour shared by every IconButton skin (button, or link with `href`). */
export function IconButtonBase(props: IconButtonBaseProps) {
  return <ButtonBase {...props} />;
}
