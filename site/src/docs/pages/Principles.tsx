import { Children, useEffect, type ComponentProps, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { useLocation } from "react-router";
import remarkGfm from "remark-gfm";
import doc from "../../../../docs/bauhaus-principles.md?raw";

const textOf = (children: ReactNode): string =>
  Children.toArray(children)
    .map((c) => (typeof c === "string" || typeof c === "number" ? String(c) : ""))
    .join("");

const COMPONENTS: Components = {
  h1: ({ children }) => <h1 className="font-bh-display text-4xl font-extrabold tracking-[-0.03em] md:text-6xl">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-10 font-bh-grotesk text-3xl tracking-[-0.02em]">{children}</h2>,
  // "P1. Title" becomes <h3 id="p1">Title</h3>, the anchor the principles strip and docs tags link to.
  h3: ({ children }) => {
    const match = /^P(\d+)\.\s*(.*)$/s.exec(textOf(children));
    return (
      <h3 id={match ? `p${match[1]}` : undefined} className="mt-8 scroll-mt-24 font-bh-grotesk text-xl">
        {match ? match[2] : children}
      </h3>
    );
  },
  p: ({ children }) => <p className="leading-relaxed text-bh-charcoal">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-5 text-bh-charcoal">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 text-bh-charcoal">{children}</ol>,
  hr: () => <hr className="border-bh-rule" />,
  code: ({ children }) => <code className="font-bh-mono text-[0.9em]">{children}</code>,
  a: ({ href, children }: ComponentProps<"a">) =>
    href?.startsWith("http") || href?.startsWith("#") ? (
      <a href={href} className="underline underline-offset-4" {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    ) : (
      // Relative links point at repo files that are not part of the site.
      <span>{children}</span>
    ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-bh-ink py-2 pr-4 font-bh-mono text-xs uppercase tracking-[0.1em]">{children}</th>,
  td: ({ children }) => <td className="border-b border-bh-rule py-2 pr-4 align-top">{children}</td>,
};

/** The research doc, rendered as-is. Scrolls to `#pN` targets. */
export function Principles() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);
  return (
    <article className="flex max-w-4xl flex-col gap-4 px-4 py-8 md:px-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
        {doc}
      </ReactMarkdown>
    </article>
  );
}
