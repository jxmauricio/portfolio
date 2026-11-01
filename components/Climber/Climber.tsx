"use client";

import { useEffect, useRef, useState } from "react";
import { climbSequence, hips, shoulders, summit, type Limb, type Point, type Pose } from "./poses";
import { RockWall } from "./RockWall";
import styles from "./Climber.module.css";

// Scroll distance (px) per hand move.
const STEP = 56;
// How long limbs take to move between poses (ms).
const TWEEN = 160;
const CLIMBER_HEIGHT = 64;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const mix = (pa: [Point, Point], pb: [Point, Point]): [Point, Point] => [
    [lerp(pa[0][0], pb[0][0], t), lerp(pa[0][1], pb[0][1], t)],
    [lerp(pa[1][0], pb[1][0], t), lerp(pa[1][1], pb[1][1], t)],
  ];
  return {
    leftArm: mix(a.leftArm, b.leftArm),
    rightArm: mix(a.rightArm, b.rightArm),
    leftLeg: mix(a.leftLeg, b.leftLeg),
    rightLeg: mix(a.rightLeg, b.rightLeg),
    lift: lerp(a.lift, b.lift, t),
    tilt: lerp(a.tilt, b.tilt, t),
  };
};
const limb = (start: Point, [joint, end]: [Point, Point]) => [start, joint, end].map((p) => p.join(",")).join(" ");

// A climber on a wall down the right edge of the page. Scrolling down climbs
// up the wall through a sequence of moves (drop knees, a mini dyno, flags, a
// heel hook); the limbs only move while the page scrolls, and scrolling back
// up down-climbs. Topping out at the end of the page triggers a wave.
export function Climber() {
  const wallRef = useRef<HTMLDivElement>(null);
  const [wallSize, setWallSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const climberRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<SVGGElement>(null);
  const limbRefs = useRef<Record<Limb, SVGPolylineElement | null>>({
    leftArm: null,
    rightArm: null,
    leftLeg: null,
    rightLeg: null,
  });

  useEffect(() => {
    const wall = wallRef.current;
    const climber = climberRef.current;
    const rope = ropeRef.current;
    if (!wall || !climber || !rope) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let shown: Pose = climbSequence[0];
    let target: Pose = climbSequence[0];
    let from: Pose = climbSequence[0];
    let tweenStart = 0;
    let frame = 0;

    const drawPose = (pose: Pose) => {
      const refs = limbRefs.current;
      refs.leftArm?.setAttribute("points", limb(shoulders.left, pose.leftArm));
      refs.rightArm?.setAttribute("points", limb(shoulders.right, pose.rightArm));
      refs.leftLeg?.setAttribute("points", limb(hips.left, pose.leftLeg));
      refs.rightLeg?.setAttribute("points", limb(hips.right, pose.rightLeg));
      figureRef.current?.setAttribute("transform", `translate(0 ${pose.lift}) rotate(${pose.tilt} 20 34)`);
    };

    const tick = (now: number) => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      const travel = wall.clientHeight - CLIMBER_HEIGHT;
      const y = (1 - progress) * travel;
      climber.style.transform = `translateY(${y}px)`;
      rope.style.height = `${y + 4}px`;

      const next = progress > 0.985 ? summit : climbSequence[Math.floor(window.scrollY / STEP) % climbSequence.length];
      if (next !== target) {
        from = shown;
        target = next;
        tweenStart = now;
      }
      const t = reduceMotion ? 1 : Math.min((now - tweenStart) / TWEEN, 1);
      shown = t >= 1 ? target : lerpPose(from, target, 1 - (1 - t) * (1 - t));
      drawPose(shown);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // The rock is drawn at the wall's pixel size, so redraw it when that changes.
    const resize = new ResizeObserver(() => {
      if (wall.clientHeight) setWallSize({ width: wall.clientWidth, height: wall.clientHeight });
      schedule();
    });
    resize.observe(wall);

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.rail} aria-hidden="true">
      <div className={styles.anchor} />
      <div ref={wallRef} className={styles.wall}>
        {wallSize && <RockWall {...wallSize} />}
        <div ref={ropeRef} className={styles.rope} />
        <div ref={climberRef} className={styles.climber}>
          <svg viewBox="0 0 40 64" width="40" height={CLIMBER_HEIGHT}>
            <g ref={figureRef}>
              <g className={styles.body}>
                <polyline
                  ref={(el) => {
                    limbRefs.current.leftArm = el;
                  }}
                />
                <polyline
                  ref={(el) => {
                    limbRefs.current.rightArm = el;
                  }}
                />
                <polyline
                  ref={(el) => {
                    limbRefs.current.leftLeg = el;
                  }}
                />
                <polyline
                  ref={(el) => {
                    limbRefs.current.rightLeg = el;
                  }}
                />
                <path d="M15 17 L25 17 L22.5 34 L17.5 34 Z" className={styles.torso} />
              </g>
              <circle cx="20" cy="10" r="5" className={styles.helmet} />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
