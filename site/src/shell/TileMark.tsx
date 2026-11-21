export type TileMarkProps = { size?: number; onDark?: boolean };

/** The bauhaus-react mark: red square, blue quarter circle, yellow triangle, ink circle. */
export function TileMark({ size = 24, onDark = false }: TileMarkProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100" className="shrink-0">
      <rect width="50" height="50" fill="#ea4535" />
      <path d="M50 50 V0 A50 50 0 0 1 100 50z" fill="#1f5fd8" />
      <polygon points="0,100 25,50 50,100" fill="#f5b62a" />
      <circle cx="75" cy="75" r="18" fill={onDark ? "#f4efe6" : "#111"} />
    </svg>
  );
}
