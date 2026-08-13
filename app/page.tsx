import { DataTexture } from "./components/DataTexture";

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
      <section className="relative flex min-h-[85vh] w-full flex-col justify-center overflow-hidden px-6">
        <DataTexture />

        <div className="animate-fade-up relative mx-auto w-full max-w-3xl text-center">
          <p className="font-display text-xs font-medium tracking-[0.25em] text-accent uppercase">
            AI Strategy &amp; Engineering
          </p>
          <h1 className="mt-6 font-display text-4xl leading-[1.15] font-medium tracking-tight text-text sm:text-5xl">
            20+ years turning ambition into shipped systems.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-muted">
            I help teams move past AI experiments into production —
            strategy, engineering, and the judgment to know the difference.
          </p>
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
