import { Link } from "react-router";

export function NotFound() {
  return (
    <section className="px-4 py-16 md:px-8">
      <h1 className="font-bh-grotesk text-5xl tracking-[-0.03em]">Page not found</h1>
      <p className="mt-4 text-bh-muted-text">That page does not exist.</p>
      <Link to="/" className="mt-6 inline-block border-b border-bh-ink">
        Back to home
      </Link>
    </section>
  );
}
