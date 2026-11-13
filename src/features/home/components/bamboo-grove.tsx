interface Stalk {
  x: number;
  top: number;
  lean: number;
  width: number;
}

const HEIGHT = 900;

const stemPath = ({ x, top, lean, width }: Stalk) => {
  const tip = x + lean;
  const narrow = width * 0.32;
  return `M${x - width / 2} ${HEIGHT}L${tip - narrow} ${top}Q${tip} ${top - 8} ${tip + narrow} ${top}L${x + width / 2} ${HEIGHT}Z`;
};

/** The rings around a stalk, which are what make it read as bamboo. */
const ringsPath = ({ x, top, lean, width }: Stalk) => {
  const rings: string[] = [];
  for (let y = HEIGHT - 70; y > top + 40; y -= 118) {
    const along = (HEIGHT - y) / (HEIGHT - top);
    const centre = x + lean * along;
    const half = (width / 2) * (1 - 0.36 * along) + 1.5;
    rings.push(`M${centre - half} ${y}Q${centre} ${y + 6} ${centre + half} ${y}`);
  }
  return rings.join("");
};

const leafPath = (length: number) => {
  const belly = length * 0.15;
  return `M0 0C${length * 0.3} ${-belly} ${length * 0.72} ${-belly} ${length} 0C${length * 0.72} ${belly * 0.6} ${length * 0.3} ${belly * 0.6} 0 0Z`;
};

const back: Stalk[] = [
  { x: 42, top: -30, lean: 16, width: 24 },
  { x: 150, top: 110, lean: -12, width: 19 },
  { x: 262, top: 310, lean: 20, width: 16 },
  { x: 345, top: 540, lean: -8, width: 13 },
];
const middle: Stalk[] = [
  { x: 96, top: 30, lean: 26, width: 20 },
  { x: 208, top: 250, lean: 10, width: 16 },
];
const front: Stalk = { x: 22, top: 130, lean: 34, width: 28 };

// [x, y, length, angle]
const backLeaves = [
  [160, 150, 92, -18],
  [150, 210, 80, 24],
  [262, 340, 76, -14],
  [272, 400, 62, 28],
  [60, 90, 88, -30],
] as const;
const frontLeaves = [
  [64, 170, 104, -22],
  [62, 196, 92, 12],
  [58, 300, 84, 34],
  [52, 410, 96, -12],
  [50, 436, 74, 26],
  [44, 580, 82, -6],
] as const;

/**
 * A stand of bamboo at the edge of the opening screen, in three layers so that it has
 * depth: dark stalks far back, then lit stalks, then gold leaves nearest the viewer.
 */
export function BambooGrove({ side }: { side: "left" | "right" }) {
  const stem = `grove-stem-${side}`;
  const leaf = `grove-leaf-${side}`;

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 400 ${HEIGHT}`}
      preserveAspectRatio="xMinYMax slice"
      className={`grove grove-${side}`}
    >
      <defs>
        <linearGradient id={stem} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--color-champagne-500)", stopOpacity: 0.34 }} />
          <stop offset="0.5" style={{ stopColor: "var(--color-champagne-300)", stopOpacity: 0.62 }} />
          <stop offset="1" style={{ stopColor: "var(--color-forest-800)", stopOpacity: 0.7 }} />
        </linearGradient>
        <linearGradient id={leaf} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--color-champagne-500)", stopOpacity: 0.85 }} />
          <stop offset="1" style={{ stopColor: "var(--color-champagne-300)", stopOpacity: 0.32 }} />
        </linearGradient>
      </defs>

      <g className="grove-back">
        {back.map((stalk) => (
          <path key={stalk.x} d={stemPath(stalk)} fill="rgb(201 168 106 / 0.1)" />
        ))}
        {backLeaves.map(([x, y, length, angle]) => (
          <path
            key={`${x}-${y}`}
            d={leafPath(length)}
            transform={`translate(${x} ${y}) rotate(${angle})`}
            fill="rgb(201 168 106 / 0.14)"
          />
        ))}
      </g>

      <g className="grove-middle">
        {middle.map((stalk) => (
          <g key={stalk.x}>
            <path d={stemPath(stalk)} fill="rgb(201 168 106 / 0.2)" />
            <path d={ringsPath(stalk)} fill="none" stroke="rgb(222 196 141 / 0.42)" strokeWidth="1.5" />
          </g>
        ))}
      </g>

      <g className="grove-front">
        <path d={stemPath(front)} fill={`url(#${stem})`} />
        <path d={ringsPath(front)} fill="none" stroke="rgb(240 222 180 / 0.78)" strokeWidth="2" />
        <g className="grove-leaves">
          {frontLeaves.map(([x, y, length, angle]) => (
            <path
              key={`${x}-${y}`}
              d={leafPath(length)}
              transform={`translate(${x} ${y}) rotate(${angle})`}
              fill={`url(#${leaf})`}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}

// Fixed positions, so the server and browser agree. [left %, size px, seconds, delay]
const motes = [
  [8, 3, 13, 0],
  [17, 2, 17, 4],
  [24, 4, 15, 8],
  [33, 2, 19, 2],
  [41, 3, 14, 10],
  [49, 2, 18, 6],
  [57, 4, 16, 1],
  [64, 2, 20, 9],
  [72, 3, 14, 5],
  [80, 2, 18, 11],
  [88, 4, 15, 3],
  [94, 2, 17, 7],
] as const;

/** Gold dust drifting up through the light. Hidden for anyone who prefers reduced motion. */
export function GoldDust() {
  return (
    <div aria-hidden="true" className="dust">
      {motes.map(([left, size, seconds, delay]) => (
        <span
          key={left}
          style={
            {
              "--x": `${left}%`,
              "--s": `${size}px`,
              "--t": `${seconds}s`,
              "--d": `-${delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** The crown of the site's arch, above the name. It fades out before reaching the letters. */
export function LitArch() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMax meet"
      className="lit-arch"
    >
      <path pathLength={1} className="lit-arch-line" d="M190 1000V440a310 310 0 0 1 620 0V1000" />
      <path pathLength={1} className="lit-arch-line lit-arch-line-outer" d="M150 1000V440a350 350 0 0 1 700 0V1000" />
    </svg>
  );
}
