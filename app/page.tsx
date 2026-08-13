const CAPABILITIES = [
  {
    label: "Strategy",
    title: "AI roadmapping",
    description:
      "Where AI actually moves the needle for your business, and where it doesn't.",
  },
  {
    label: "Build",
    title: "Applied AI systems",
    description:
      "Production-grade agents, pipelines, and integrations — not demos.",
  },
  {
    label: "Scale",
    title: "Team enablement",
    description:
      "Getting your team fluent in the tools, not dependent on a vendor.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative flex min-h-[90vh] w-full flex-col justify-center overflow-hidden px-6">
        <p
          aria-hidden
          className="animate-ghost-in pointer-events-none absolute inset-x-0 top-[18%] text-center font-display text-[13vw] leading-none font-semibold tracking-tight whitespace-nowrap text-text/[0.07] select-none sm:top-[20%] sm:text-[11vw]"
        >
          RAGHU AKULA
        </p>

        <div className="relative mx-auto w-full max-w-5xl">
          <div className="animate-card-settle max-w-xl rounded-lg border border-panel-border bg-panel/95 p-8 shadow-2xl shadow-black/50 backdrop-blur-sm sm:p-10">
            <p className="font-display text-xs font-medium tracking-[0.25em] text-accent uppercase">
              AI Strategy &amp; Engineering
            </p>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] font-medium tracking-tight text-text sm:text-5xl">
              Building AI systems that ship.
            </h1>
            <p className="mt-5 text-base text-text-muted">
              I help teams move past AI experiments into production —
              strategy, engineering, and the judgment to know the difference.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-panel-border/60">
        <div className="mx-auto grid max-w-5xl gap-px bg-panel-border/60 px-6 sm:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <div key={item.title} className="bg-base px-2 py-10 sm:px-6">
              <p className="font-display text-xs font-medium tracking-[0.2em] text-accent uppercase">
                {item.label}
              </p>
              <h2 className="mt-4 text-lg font-medium text-text">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
