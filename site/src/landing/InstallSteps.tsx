import { CopyButton } from "../shell/CopyButton";

const STEPS = [
  { title: "Install", code: "pnpm add bauhaus-react" },
  {
    title: "Add the theme",
    code: '@import "tailwindcss";\n@import "bauhaus-react/theme.css";\n@source "../node_modules/bauhaus-react/dist";',
  },
  { title: "Use a component", code: 'import { ButtonPlayful } from "bauhaus-react";\n\n<ButtonPlayful href="/start">Get started</ButtonPlayful>' },
] as const;

export function InstallSteps() {
  return (
    <section aria-label="Install in 3 steps" className="border-t border-bh-ink bg-bh-paper px-4 py-12 md:px-8">
      <h2 className="font-bh-grotesk text-4xl tracking-[-0.03em] md:text-6xl">Install in 3 steps</h2>
      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-3">
            <span className="flex items-baseline justify-between font-bh-grotesk">
              <span className="text-lg">
                <span className="mr-2 text-bh-muted-text">0{i + 1}</span>
                {step.title}
              </span>
              <CopyButton text={step.code} />
            </span>
            <pre className="grow overflow-x-auto border-2 border-bh-ink bg-bh-ink p-4 font-bh-mono text-xs leading-relaxed text-bh-paper">
              <code>{step.code}</code>
            </pre>
          </li>
        ))}
      </ol>
    </section>
  );
}
