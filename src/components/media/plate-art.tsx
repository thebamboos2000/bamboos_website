import type { ArtKind } from "@/types/domain";

/**
 * Original line drawings for frames awaiting real photography. They are
 * deliberately abstract, so they can't be mistaken for pictures of the venue.
 */

const range = (count: number) => Array.from({ length: count }, (_, index) => index);

function ArchArt() {
  return (
    <>
      {range(6).map((i) => {
        const half = 330 - i * 48;
        const top = 300 + i * 46;
        return (
          <path
            key={i}
            className="art-line"
            strokeOpacity={1 - i * 0.12}
            d={`M${400 - half} 800V${top + half}A${half} ${half} 0 0 1 ${400 + half} ${top + half}V800`}
          />
        );
      })}
      <path className="art-line" d="M0 800H800" />
      {range(9).map((i) => (
        <path
          key={i}
          className="art-line"
          strokeOpacity="0.45"
          d={`M${400 + (i - 4) * 36} 800L${400 + (i - 4) * 190} 1000`}
        />
      ))}
    </>
  );
}

function AisleArt() {
  const rows = range(11);
  return (
    <>
      <path className="art-line" d="M270 300A130 130 0 0 1 530 300V430H270Z" />
      <path className="art-line" strokeOpacity="0.5" d="M0 430H800" />
      {rows.flatMap((row) => {
        const depth = (row + 1) / rows.length;
        const y = 450 + depth * depth * 540;
        const spacing = 16 + depth * 62;
        const radius = 1.4 + depth * 4.6;
        return range(5).flatMap((seat) => {
          const offset = 34 + depth * 90 + seat * spacing;
          return [-1, 1].map((side) => (
            <circle
              key={`${row}-${seat}-${side}`}
              cx={400 + side * offset}
              cy={y}
              r={radius}
              fill="currentColor"
              fillOpacity={0.35 + depth * 0.55}
            />
          ));
        });
      })}
      <path className="art-line" strokeOpacity="0.45" d="M380 430L290 1000M420 430L510 1000" />
    </>
  );
}

function CanopyArt() {
  const strands = [60, 130, 195, 265, 330, 400, 470, 535, 605, 670, 740];
  const drops = [420, 300, 520, 360, 610, 460, 680, 340, 560, 280, 450];
  return (
    <>
      <path className="art-line" strokeOpacity="0.6" d="M0 40Q400 150 800 40" />
      {strands.map((x, i) => {
        const y = drops[i] ?? 400;
        const start = 40 + 110 * (1 - ((x - 400) / 400) ** 2) * 0.5;
        return (
          <g key={x}>
            <path className="art-line" strokeOpacity="0.55" d={`M${x} ${start}V${y}`} />
            <circle cx={x} cy={y + 10} r="10" fill="currentColor" fillOpacity="0.14" />
            <circle cx={x} cy={y + 10} r="3.5" fill="currentColor" />
          </g>
        );
      })}
      <path className="art-line" strokeOpacity="0.4" d="M120 880Q400 800 680 880" />
      <path className="art-line" strokeOpacity="0.25" d="M40 950Q400 860 760 950" />
    </>
  );
}

function TablesArt() {
  const tables = [
    [190, 390, 62],
    [400, 370, 58],
    [610, 390, 62],
    [120, 570, 92],
    [400, 545, 86],
    [680, 570, 92],
    [230, 800, 128],
    [590, 800, 128],
  ] as const;
  return (
    <>
      <path className="art-line" strokeOpacity="0.45" d="M0 260H800" />
      {tables.map(([cx, cy, r]) => (
        <g key={`${cx}-${cy}`}>
          <ellipse className="art-line" cx={cx} cy={cy} rx={r} ry={r * 0.36} />
          <ellipse
            className="art-line"
            strokeOpacity="0.4"
            cx={cx}
            cy={cy}
            rx={r * 0.72}
            ry={r * 0.24}
          />
          {range(8).map((seat) => {
            const angle = (seat / 8) * Math.PI * 2;
            return (
              <circle
                key={seat}
                cx={cx + Math.cos(angle) * r * 1.22}
                cy={cy + Math.sin(angle) * r * 0.52}
                r={r * 0.07}
                fill="currentColor"
                fillOpacity="0.7"
              />
            );
          })}
        </g>
      ))}
    </>
  );
}

function StageArt() {
  return (
    <>
      {[210, 400, 590].map((x, i) => (
        <path
          key={x}
          d={`M${x} 0L${x - 150 + i * 20} 720H${x + 150 + i * -20}Z`}
          fill="currentColor"
          fillOpacity="0.07"
        />
      ))}
      <path className="art-line" d="M90 130H710" />
      {range(7).map((i) => (
        <path
          key={i}
          className="art-line"
          strokeOpacity={0.75 - i * 0.08}
          d={`M${100 + i * 16} 130C${108 + i * 16} 330 ${88 + i * 18} 520 ${104 + i * 18} 720M${700 - i * 16} 130C${692 - i * 16} 330 ${712 - i * 18} 520 ${696 - i * 18} 720`}
        />
      ))}
      <path className="art-line" d="M60 720H740L800 830H0Z" />
      {range(5).map((i) => (
        <path
          key={i}
          className="art-line"
          strokeOpacity={0.5 - i * 0.07}
          d={`M0 ${850 + i * 34}Q400 ${800 + i * 34} 800 ${850 + i * 34}`}
        />
      ))}
    </>
  );
}

function StalksArt() {
  const stalks = [
    [90, 16],
    [190, 26],
    [330, 18],
    [455, 30],
    [590, 20],
    [705, 24],
  ] as const;
  return (
    <>
      {stalks.map(([x, width], i) => (
        <g key={x}>
          <path className="art-line" d={`M${x} 1000V0M${x + width} 1000V0`} />
          {range(7).map((node) => {
            const y = 70 + i * 34 + node * 152;
            return (
              <path
                key={node}
                className="art-line"
                d={`M${x - 3} ${y}H${x + width + 3}M${x - 3} ${y + 6}H${x + width + 3}`}
              />
            );
          })}
          <path
            className="art-line"
            strokeOpacity="0.6"
            d={`M${x + width} ${220 + i * 96}q60 -40 118 -22q-54 34 -118 22`}
          />
        </g>
      ))}
    </>
  );
}

const artwork: Record<ArtKind, () => React.JSX.Element> = {
  arch: ArchArt,
  aisle: AisleArt,
  canopy: CanopyArt,
  tables: TablesArt,
  stage: StageArt,
  stalks: StalksArt,
};

export function PlateArt({ kind, className }: { kind: ArtKind; className?: string }) {
  const Art = artwork[kind];
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid slice"
      strokeWidth="1"
    >
      <Art />
    </svg>
  );
}
