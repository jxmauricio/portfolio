import { useId, useMemo } from "react";
import styles from "./Climber.module.css";

type Props = { width: number; height: number };

// Gym-style hold colors.
const HOLD_COLORS = ["#e5484d", "#f5a524", "#30a46c", "#3e63dd", "#8e4ec6", "#f76b15", "#e93d82", "#12a594"];

// Seeded PRNG so the wall looks the same on every render and resize.
function random(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const toPath = (points: [number, number][]) =>
  "M" + points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L") + " Z";

// A lumpy closed shape around (cx, cy), for holds and rock facets.
function blob(rand: () => number, cx: number, cy: number, rx: number, ry: number, corners = 7) {
  const points: [number, number][] = [];
  const turn = rand() * Math.PI;
  for (let i = 0; i < corners; i++) {
    const a = turn + (i / corners) * Math.PI * 2;
    const k = 0.7 + rand() * 0.45;
    points.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return toPath(points);
}

// A rock face drawn for the wall's actual pixel size: jagged edges, shaded
// facets, cracks, ledges every ~200px and colored holds in between.
export function RockWall({ width: w, height: h }: Props) {
  const clipId = useId();
  const shapes = useMemo(() => {
    const rand = random(7);

    // Jagged outline: left edge going down, right edge coming back up.
    const left: [number, number][] = [];
    const right: [number, number][] = [];
    for (let y = 0; y <= h; y += 22) {
      left.push([2 + rand() * 7, y]);
      right.push([w - 2 - rand() * 7, y]);
    }
    left.push([4, h]);
    right.push([w - 4, h]);
    const face = toPath([...left, ...right.reverse()]);

    const facets = [];
    for (let y = 10; y < h; y += 34) {
      facets.push({
        d: blob(rand, 10 + rand() * (w - 20), y + rand() * 20, 10 + rand() * 12, 8 + rand() * 12, 5),
        light: rand() > 0.5,
      });
    }

    const cracks = [];
    for (let y = 40; y < h; y += 90 + rand() * 80) {
      const points: [number, number][] = [];
      let x = 12 + rand() * (w - 24);
      for (let cy = y; cy < y + 30 + rand() * 40; cy += 7) {
        x += (rand() - 0.5) * 6;
        points.push([x, cy]);
      }
      cracks.push("M" + points.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join(" L"));
    }

    const ledges = [];
    for (let y = 150 + rand() * 40; y < h - 60; y += 180 + rand() * 60) {
      const top: [number, number][] = [];
      for (let x = -4; x <= w + 4; x += 8) top.push([x, y + (rand() - 0.5) * 3]);
      const lip = 5 + rand() * 3;
      const bottom = top.map(([x, ty]): [number, number] => [x, ty + lip + rand() * 2]).reverse();
      ledges.push({
        y,
        surface: toPath([...top, ...top.map(([x, ty]): [number, number] => [x, ty + 2.5]).reverse()]),
        front: toPath([...top, ...bottom]),
        shadow: `M-4 ${y + lip + 1} H${w + 4} V${y + lip + 9} H-4 Z`,
      });
    }

    const holds = [];
    for (let y = 18; y < h - 8; y += 20 + rand() * 14) {
      if (ledges.some((l) => Math.abs(l.y - y) < 16)) continue;
      const count = rand() > 0.55 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const half = count === 2 ? (i === 0 ? [12, w / 2 - 4] : [w / 2 + 4, w - 12]) : [14, w - 14];
        const cx = half[0] + rand() * (half[1] - half[0]);
        const cy = y + (rand() - 0.5) * 8;
        const size = 3 + rand() * 3.5;
        holds.push({
          d: blob(rand, cx, cy, size * (1 + rand() * 0.6), size),
          color: HOLD_COLORS[Math.floor(rand() * HOLD_COLORS.length)],
          cx,
          cy,
        });
      }
    }

    return { face, facets, cracks, ledges, holds };
  }, [w, h]);

  return (
    <svg className={styles.rock} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <clipPath id={clipId}>
        <path d={shapes.face} />
      </clipPath>
      <path d={shapes.face} className={styles.face} />
      <g clipPath={`url(#${clipId})`}>
        {shapes.facets.map((f, i) => (
          <path key={i} d={f.d} className={f.light ? styles.facetLight : styles.facetDark} />
        ))}
        {shapes.cracks.map((d, i) => (
          <path key={i} d={d} className={styles.crack} />
        ))}
      </g>
      {shapes.holds.map((hold, i) => (
        <g key={i}>
          <path d={hold.d} fill={hold.color} className={styles.hold} />
          <circle cx={hold.cx} cy={hold.cy} r={0.9} className={styles.bolt} />
        </g>
      ))}
      {shapes.ledges.map((l, i) => (
        <g key={i}>
          <path d={l.shadow} className={styles.ledgeShadow} />
          <path d={l.front} className={styles.ledgeFront} />
          <path d={l.surface} className={styles.ledgeTop} />
        </g>
      ))}
    </svg>
  );
}
