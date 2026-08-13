const COLORS = ["var(--color-accent)", "var(--color-accent-secondary)"];

// Deterministic pseudo-random sequence so server and client render identically.
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildBlocks(count: number, seedOffset: number) {
  return Array.from({ length: count }, (_, i) => {
    const seed = i + seedOffset;
    const col = Math.floor(seededRandom(seed * 1.7) * 10);
    const row = Math.floor(seededRandom(seed * 3.1) * 10);
    const baseOpacity = 0.15 + seededRandom(seed * 5.3) * 0.55;
    const color = COLORS[Math.floor(seededRandom(seed * 7.9) * COLORS.length)];
    const duration = 2.5 + seededRandom(seed * 11.3) * 3.5;
    const delay = seededRandom(seed * 13.7) * -6;
    return {
      col,
      row,
      baseOpacity,
      color,
      duration,
      delay,
      key: `${seedOffset}-${i}`,
    };
  });
}

function BlockGrid({
  blocks,
  className,
}: {
  blocks: ReturnType<typeof buildBlocks>;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-10 grid-rows-10 gap-1 ${className ?? ""}`}
    >
      {blocks.map((block) => (
        <span
          key={block.key}
          style={
            {
              gridColumn: block.col + 1,
              gridRow: block.row + 1,
              backgroundColor: block.color,
              "--pulse-opacity": block.baseOpacity,
              animationDuration: `${block.duration}s`,
              animationDelay: `${block.delay}s`,
            } as React.CSSProperties
          }
          className="animate-block-pulse h-2 w-2 rounded-[1px] sm:h-2.5 sm:w-2.5"
        />
      ))}
    </div>
  );
}

export function DataTexture() {
  const topLeft = buildBlocks(28, 1);
  const bottomRight = buildBlocks(28, 97);

  return (
    <div
      aria-hidden
      className="animate-texture-in pointer-events-none absolute inset-0 select-none"
    >
      <BlockGrid
        blocks={topLeft}
        className="absolute -top-8 -left-10 h-56 w-56 sm:h-72 sm:w-72"
      />
      <BlockGrid
        blocks={bottomRight}
        className="absolute -right-10 -bottom-8 h-56 w-56 sm:h-72 sm:w-72"
      />
    </div>
  );
}
