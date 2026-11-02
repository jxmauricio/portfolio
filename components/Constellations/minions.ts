// Minion and basketball constellations, in units where the body is 1 wide and the
// figure runs from about y = -1 (hair) to 1.2 (feet), centred on the goggles'
// height. Each shape is the stars plus which pairs of them are joined.

type Pt = [number, number];
type Line = { pts: Pt[]; closed?: boolean };
// tint overrides the line and star colour (as "r, g, b") in each theme.
export type Shape = {
  points: Pt[];
  edges: [number, number][];
  pupils: Pt[];
  tint?: { dark: string; light: string };
};

const PI = Math.PI;

const arc = (cx: number, cy: number, r: number, from: number, to: number, steps: number): Pt[] =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const a = from + ((to - from) * i) / steps;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

const ring = (cx: number, cy: number, r: number, steps: number) => arc(cx, cy, r, 0, PI * 2, steps).slice(0, -1);

// Joins the lines into one star list, so points the lines share (a strap
// meeting a goggle, say) become a single star.
function shape(lines: Line[], pupils: Pt[]): Shape {
  const points: Pt[] = [];
  const edges: [number, number][] = [];
  const index = new Map<string, number>();
  const id = ([x, y]: Pt) => {
    const key = `${Math.round(x * 100)},${Math.round(y * 100)}`;
    let i = index.get(key);
    if (i === undefined) {
      i = points.push([x, y]) - 1;
      index.set(key, i);
    }
    return i;
  };
  for (const { pts, closed } of lines) {
    const ids = pts.map(id);
    for (let i = 1; i < ids.length; i++) edges.push([ids[i - 1], ids[i]]);
    if (closed) edges.push([ids[ids.length - 1], ids[0]]);
  }
  return { points, edges, pupils };
}

// Capsule body: domed top, straight sides, rounded bottom.
const body: Line = { pts: [...arc(0, -0.3, 0.5, PI, PI * 2, 6), ...arc(0, 0.5, 0.5, 0, PI, 5)], closed: true };

const limbs: Line[] = [
  { pts: [[-0.5, 0.2], [-0.78, 0.5], [-0.72, 0.66]] }, // arm at its side
  { pts: [[0.5, 0.2], [0.8, -0.05], [0.86, -0.28]] }, // waving arm
  { pts: [[-0.2, 0.96], [-0.22, 1.16], [-0.38, 1.2]] },
  { pts: [[0.2, 0.96], [0.22, 1.16], [0.38, 1.2]] },
  { pts: [[-0.5, 0.4], [0.5, 0.4]] }, // top of the overalls
  { pts: [[-0.06, -0.8], [-0.12, -1]] }, // hair
  { pts: [[0.08, -0.8], [0.15, -0.98]] },
];

export const oneEyed = shape(
  [
    body,
    { pts: ring(0, -0.3, 0.26, 8), closed: true },
    { pts: [[-0.5, -0.3], [-0.26, -0.3]] }, // goggle strap
    { pts: [[0.26, -0.3], [0.5, -0.3]] },
    { pts: arc(0, -0.05, 0.2, PI * 0.25, PI * 0.75, 3) }, // smile
    ...limbs,
  ],
  [[0, -0.3]],
);

export const twoEyed = shape(
  [
    body,
    { pts: ring(-0.21, -0.3, 0.17, 8), closed: true },
    { pts: ring(0.21, -0.3, 0.17, 8), closed: true },
    { pts: [[-0.04, -0.3], [0.04, -0.3]] }, // goggle bridge
    { pts: [[-0.5, -0.3], [-0.38, -0.3]] }, // goggle strap
    { pts: [[0.38, -0.3], [0.5, -0.3]] },
    { pts: arc(0, -0.08, 0.26, PI * 0.2, PI * 0.8, 4) }, // big grin
    ...limbs,
  ],
  [
    [-0.21, -0.3],
    [0.21, -0.3],
  ],
);

// A basketball: the ring, one seam across each way and two curved side seams
// that end on the ring.
const R = 0.34;
const side = (dir: 1 | -1): Line => ({
  // Arc centred outside the ball, passing through the ring at about +-34deg.
  pts: arc(0.7 * dir * R / 0.4, 0, 0.5 * R / 0.4, dir === 1 ? PI - 0.6 : 0.6, dir === 1 ? PI + 0.6 : -0.6, 4),
});

export const basketball: Shape = {
  ...shape(
    [
      { pts: ring(0, 0, R, 16), closed: true },
      { pts: [[0, -R], [0, 0], [0, R]] },
      { pts: [[-R, 0], [0, 0], [R, 0]] },
      side(-1),
      side(1),
    ],
    [],
  ),
  tint: { dark: "255, 160, 80", light: "210, 100, 20" },
};
