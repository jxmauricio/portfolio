"use client";

import { useEffect, useRef } from "react";
import styles from "./Constellations.module.css";
import { basketball, oneEyed, twoEyed, type Shape } from "./minions";

const AREA_PER_STAR = 14000; // px² of viewport per loose star
const MARGIN = 40; // how far loose stars drift offscreen before wrapping
const REACH = 180; // how far the cursor reaches out to stars
const SPEED = 0.12; // px per frame
const FIGURE_SPEED = 0.18; // px per frame the minions drift sideways

const WARP_STARS = 260;
const WARP_SPEED = 0.0018; // depth per frame at rest
const WARP_BOOST = 0.03; // most extra speed a fast scroll can add

type Star = { x: number; y: number; vx: number; vy: number; size: number; twinkle: number };
// A star flying toward the viewer: x, y in -1..1 around the centre, z is
// depth from 1 (far) to 0 (passing the screen).
type WarpStar = { x: number; y: number; z: number };
// A constellation figure: where it is, its size in px per shape unit, and
// flip = -1 to face the other way. A figure with a bounce height hops along
// and spins instead of waddling.
type Figure = {
  shape: Shape;
  x: number;
  y: number;
  vx: number;
  scale: number;
  flip: number;
  phase: number;
  bounce?: number;
};

const isDark = () => document.documentElement.dataset.theme === "dark";
const isOff = () => document.documentElement.dataset.bg === "off";

const makeWarpStar = (z = Math.random()): WarpStar => ({
  x: Math.random() * 2 - 1,
  y: Math.random() * 2 - 1,
  z,
});

// Minion-shaped constellations (and a bouncing basketball) bobbing across a field of drifting stars,
// over a slow starfield warp that speeds up while the page scrolls. Stars
// reach toward the cursor. Paused offscreen and still under reduced motion.
export function Constellations() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const stars: Star[] = [];
    let figures: Figure[] = [];
    const warp = Array.from({ length: WARP_STARS }, () => makeWarpStar());
    let boost = 0;
    let lastScroll = scrollY;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let mouse: { x: number; y: number } | null = null;

    const makeStar = (): Star => {
      const angle = Math.random() * Math.PI * 2;
      const speed = SPEED * (0.4 + Math.random() * 0.8);
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 0.8 + Math.random() * 1.4,
        twinkle: Math.random() * Math.PI * 2,
      };
    };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Keep the density steady: top up or trim to fit the new size.
      const count = Math.round((w * h) / AREA_PER_STAR);
      while (stars.length < count) stars.push(makeStar());
      stars.length = count;

      // One minion per ~600px of width, spread across the screen.
      const scale = Math.min(Math.max(Math.min(w, h) * 0.1, 50), 90);
      const minions = Math.min(Math.max(Math.round(w / 600), 1), 3);
      figures = Array.from({ length: minions }, (_, i) => {
        const flip = i % 2 ? -1 : 1;
        return {
          shape: i % 2 ? twoEyed : oneEyed,
          x: ((i + 0.5) / minions) * w,
          y: h * (0.3 + Math.random() * 0.4),
          vx: -FIGURE_SPEED * flip, // drifts away from its waving arm
          scale,
          flip,
          phase: Math.random() * Math.PI * 2,
        };
      });
      figures.push({
        shape: basketball,
        x: w * 0.3,
        y: h * 0.72,
        vx: FIGURE_SPEED * 2,
        scale: scale * 1.1,
        flip: 1,
        phase: 0,
        bounce: h * 0.12,
      });
    };

    const draw = (time: number) => {
      const t = reduced.matches ? 0 : time / 1000;
      const dark = isDark();
      const line = dark ? "150, 170, 255" : "60, 80, 180";
      const dot = dark ? "235, 238, 255" : "40, 50, 110";
      ctx.clearRect(0, 0, w, h);

      // Warp: scrolling kicks the speed up, then it eases back to cruising.
      const scrolled = Math.abs(scrollY - lastScroll);
      lastScroll = scrollY;
      boost = Math.max(boost * 0.93, Math.min(scrolled * 0.0006, WARP_BOOST));
      const speed = reduced.matches ? 0 : WARP_SPEED + boost;
      const cx = w / 2;
      const cy = h / 2;
      const spread = Math.max(w, h) / 2;
      ctx.lineCap = "round";
      for (const s of warp) {
        s.z -= speed;
        let x = cx + (s.x / s.z) * spread;
        let y = cy + (s.y / s.z) * spread;
        if (s.z <= 0.02 || x < 0 || x > w || y < 0 || y > h) {
          Object.assign(s, makeWarpStar(1));
          x = cx + s.x * spread;
          y = cy + s.y * spread;
        }
        // Each star trails a streak back to where it was a few frames ago,
        // so the lines stretch as the warp speeds up.
        const tail = s.z + speed * 6 + 0.004;
        const near = 1 - s.z;
        ctx.strokeStyle = dark
          ? `rgba(200, 210, 255, ${near * 0.7})`
          : `rgba(50, 60, 130, ${near * 0.35})`;
        ctx.lineWidth = 0.4 + near * 1.6;
        ctx.beginPath();
        ctx.moveTo(cx + (s.x / tail) * spread, cy + (s.y / tail) * spread);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      if (!reduced.matches) {
        for (const s of stars) {
          s.x += s.vx;
          s.y += s.vy;
          // Wrap around the edges so the field never thins out.
          if (s.x < -MARGIN) s.x += w + MARGIN * 2;
          else if (s.x > w + MARGIN) s.x -= w + MARGIN * 2;
          if (s.y < -MARGIN) s.y += h + MARGIN * 2;
          else if (s.y > h + MARGIN) s.y -= h + MARGIN * 2;
        }
      }

      // Every star the cursor can reach: the loose ones plus the minions'.
      const reachable: { x: number; y: number }[] = [...stars];

      ctx.lineWidth = 1.2;
      for (const f of figures) {
        const width = f.scale * 1.8;
        if (!reduced.matches) {
          f.x += f.vx;
          if (f.x < -width) f.x = w + width;
          else if (f.x > w + width) f.x = -width;
        }
        // Minions bob and sway as if waddling through space; the ball hops
        // in arcs and rolls as it goes.
        const y = f.bounce
          ? f.y - Math.abs(Math.sin(t * 1.6 + f.phase)) * f.bounce
          : f.y + Math.sin(t * 0.8 + f.phase) * 8;
        const tilt = f.bounce ? t * 1.2 : Math.sin(t * 0.6 + f.phase) * 0.08;
        const tint = f.shape.tint?.[dark ? "dark" : "light"];
        const cos = Math.cos(tilt);
        const sin = Math.sin(tilt);
        const place = ([px, py]: [number, number]) => {
          px *= f.flip;
          return { x: f.x + (px * cos - py * sin) * f.scale, y: y + (px * sin + py * cos) * f.scale };
        };
        const points = f.shape.points.map(place);

        ctx.strokeStyle = `rgba(${tint ?? line}, ${dark ? 0.6 : 0.45})`;
        ctx.beginPath();
        for (const [a, b] of f.shape.edges) {
          ctx.moveTo(points[a].x, points[a].y);
          ctx.lineTo(points[b].x, points[b].y);
        }
        ctx.stroke();

        f.shape.points.forEach((_, i) => {
          const glow = 0.65 + 0.35 * Math.sin(t * 1.5 + f.phase + i);
          ctx.fillStyle = `rgba(${tint ?? dot}, ${(dark ? 0.95 : 0.6) * glow})`;
          ctx.beginPath();
          ctx.arc(points[i].x, points[i].y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        });
        // Pupils are the brightest stars, so the eyes read first.
        for (const pupil of f.shape.pupils) {
          const p = place(pupil);
          ctx.fillStyle = `rgba(${dot}, ${dark ? 1 : 0.75})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        reachable.push(...points);
      }

      ctx.lineWidth = 1;
      if (mouse) {
        for (const s of reachable) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > REACH) continue;
          const alpha = (1 - d / REACH) * (dark ? 0.6 : 0.4);
          ctx.strokeStyle = `rgba(${line}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        }
      }

      for (const s of stars) {
        const glow = 0.6 + 0.4 * Math.sin(t * 1.5 + s.twinkle);
        ctx.fillStyle = `rgba(${dot}, ${(dark ? 0.9 : 0.55) * glow})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (time: number) => {
      raf = 0;
      if (isOff()) {
        // Background switched off: leave the canvas blank and stop the loop.
        ctx.clearRect(0, 0, w, h);
        return;
      }
      draw(time);
      if (visible && !reduced.matches) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) start();
    };
    const onResize = () => {
      resize();
      start();
    };
    const onPointerMove = (e: PointerEvent) => {
      mouse = e.pointerType === "mouse" ? { x: e.clientX, y: e.clientY } : null;
      start();
    };
    const onPointerLeave = () => {
      mouse = null;
      start();
    };

    resize();
    start();
    addEventListener("resize", onResize);
    addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", start);
    // Redraw right away on a theme flip, and start or stop with the background toggle.
    const themeObserver = new MutationObserver(start);
    themeObserver.observe(document.documentElement, { attributeFilter: ["data-theme", "data-bg"] });
    return () => {
      themeObserver.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={ref} className={styles.sky} aria-hidden="true" />;
}
