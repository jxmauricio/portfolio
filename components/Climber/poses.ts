// Joint positions for the climber, in the SVG's 40×64 viewBox, seen from
// behind. Shoulders and hips are fixed; each pose places elbows, hands,
// knees and feet, and can lift (px, negative is up) or tilt (degrees around
// the hips) the whole body.
export type Point = [number, number];
export type Limb = "leftArm" | "rightArm" | "leftLeg" | "rightLeg";

export type Pose = Record<Limb, [Point, Point]> & {
  lift: number;
  tilt: number;
};

export const shoulders = { left: [15, 17] as Point, right: [25, 17] as Point };
export const hips = { left: [17.5, 34] as Point, right: [22.5, 34] as Point };

const mirror = (pose: Pose): Pose => {
  const flip = ([[ax, ay], [bx, by]]: [Point, Point]): [Point, Point] => [
    [40 - ax, ay],
    [40 - bx, by],
  ];
  return {
    leftArm: flip(pose.rightArm),
    rightArm: flip(pose.leftArm),
    leftLeg: flip(pose.rightLeg),
    rightLeg: flip(pose.leftLeg),
    lift: pose.lift,
    tilt: -pose.tilt,
  };
};

// Left hand reaching high while the right foot is high.
const reachLeft: Pose = {
  leftArm: [[10, 10], [12, 2]],
  rightArm: [[31, 21], [33, 14]],
  leftLeg: [[15, 45], [14, 55]],
  rightLeg: [[31, 38], [26, 45]],
  lift: 0,
  tilt: 0,
};
const reachRight = mirror(reachLeft);

// Right knee turned in and dropped below the hips, foot pressing out right,
// so the left hand can go long.
const dropKnee: Pose = {
  leftArm: [[11, 8], [13, -1]],
  rightArm: [[30, 23], [33, 18]],
  leftLeg: [[11, 40], [13, 47]],
  rightLeg: [[21, 47], [31, 43]],
  lift: -2,
  tilt: -12,
};

// Mini dyno: sag and crouch, spring up with both hands, latch one and swing.
const dynoLoad: Pose = {
  leftArm: [[13, 10], [14, 3]],
  rightArm: [[27, 10], [26, 3]],
  leftLeg: [[9, 33], [15, 41]],
  rightLeg: [[31, 33], [25, 41]],
  lift: 7,
  tilt: 0,
};
const dynoFly: Pose = {
  leftArm: [[13, 7], [12, -2]],
  rightArm: [[27, 7], [28, -2]],
  leftLeg: [[16, 45], [15, 56]],
  rightLeg: [[24, 45], [25, 56]],
  lift: -10,
  tilt: 0,
};
const dynoCatch: Pose = {
  leftArm: [[12, 8], [11, -1]],
  rightArm: [[30, 12], [32, 5]],
  leftLeg: [[13, 45], [9, 54]],
  rightLeg: [[21, 46], [17, 56]],
  lift: -4,
  tilt: 7,
};

// Flagging: left leg sticks straight out to the left as a counterweight
// while the right hand reaches.
const flag: Pose = {
  leftArm: [[9, 21], [7, 15]],
  rightArm: [[29, 9], [28, 0]],
  leftLeg: [[7, 37], [-4, 39]],
  rightLeg: [[27, 42], [23, 49]],
  lift: -2,
  tilt: 9,
};

// Right heel hooked up by the right hand, pulling the hips in.
const heelHook: Pose = {
  leftArm: [[10, 10], [12, 2]],
  rightArm: [[30, 15], [33, 9]],
  leftLeg: [[15, 45], [14, 55]],
  rightLeg: [[33, 30], [34, 18]],
  lift: 0,
  tilt: -6,
};

// One pose per scroll step. Scrolling up plays it backwards, which reads as
// down-climbing.
export const climbSequence: Pose[] = [
  reachLeft, reachRight, reachLeft, reachRight,
  dropKnee, reachRight,
  dynoLoad, dynoFly, dynoCatch, reachLeft,
  flag, reachLeft, reachRight,
  heelHook, reachRight,
  mirror(dropKnee), reachLeft,
  mirror(flag), reachRight,
];

// Topped out: one arm waving, feet together on the last hold.
export const summit: Pose = {
  leftArm: [[9, 12], [7, 3]],
  rightArm: [[30, 24], [28, 30]],
  leftLeg: [[16, 45], [16, 56]],
  rightLeg: [[24, 45], [24, 56]],
  lift: 0,
  tilt: 0,
};
