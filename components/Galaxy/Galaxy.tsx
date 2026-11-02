"use client";

import { useEffect, useRef } from "react";
import styles from "./Galaxy.module.css";

const ARMS = 4;
const STARS = 3600;
const TILT = 0.42; // squashes the disc so it reads as seen at an angle

type Star = { arm: number; r: number; wobble: number; size: number; hue: number; twinkle: number };

// Seeded PRNG so the galaxy is the same on every load.
function random(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Glowing stars on the dark theme; on the light theme the same galaxy is
// drawn as faint ink, like a star chart.
const isDark = () => document.documentElement.dataset.theme === "dark";

// A slowly turning spiral galaxy on a fixed canvas behind the page. Paused
// offscreen and under reduced motion.
export function Galaxy() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rand = random(11);
    const stars: Star[] = Array.from({ length: STARS }, () => ({
      arm: Math.floor(rand() * ARMS),
      r: Math.pow(rand(), 1.6),
      wobble: (rand() + rand() + rand() - 1.5) * 0.5,
      size: 0.7 + rand() * 1.6,
      hue: rand(),
      twinkle: rand() * Math.PI * 2,
    }));
    const dust = Array.from({ length: 220 }, () => ({
      x: rand(),
      y: rand(),
      size: 0.3 + rand() * 0.7,
      twinkle: rand() * Math.PI * 2,
    }));

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const t = reduced.matches ? 0 : time / 1000;
      const dark = isDark();
      ctx.clearRect(0, 0, w, h);

      // The galaxy drifts up slower than the page, for depth.
      const cx = w * 0.5;
      const cy = h * 0.5 - scrollY * 0.05;
      const radius = Math.max(w, h) * 0.62;
      const spin = t * 0.02;

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.35);
      if (dark) {
        core.addColorStop(0, "rgba(255, 236, 205, 0.5)");
        core.addColorStop(0.35, "rgba(150, 130, 255, 0.2)");
        core.addColorStop(1, "rgba(60, 40, 160, 0)");
      } else {
        core.addColorStop(0, "rgba(255, 190, 140, 0.35)");
        core.addColorStop(0.35, "rgba(140, 120, 240, 0.14)");
        core.addColorStop(1, "rgba(140, 120, 240, 0)");
      }
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, TILT);
      ctx.translate(-cx, -cy);
      ctx.fillStyle = core;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.restore();

      for (const s of stars) {
        const angle = (s.arm / ARMS) * Math.PI * 2 + s.r * 5.2 + s.wobble + spin;
        const dist = s.r * radius;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist * TILT;
        const glow = 0.55 + 0.45 * Math.sin(t * 1.4 + s.twinkle);
        const alpha = (1 - s.r * 0.45) * glow;
        // Warm in the core, blue-violet toward the rim.
        const hue = s.hue < (1 - s.r) * 0.7 ? 25 + s.hue * 25 : 220 + s.hue * 50;
        ctx.fillStyle = dark
          ? `hsla(${hue}, 80%, ${78 - s.r * 10}%, ${alpha})`
          : `hsla(${hue}, 55%, ${42 + s.r * 10}%, ${alpha * 0.5})`;
        ctx.fillRect(x, y, s.size, s.size);
      }

      for (const d of dust) {
        const a = 0.25 + 0.25 * Math.sin(t + d.twinkle);
        ctx.fillStyle = dark ? `rgba(255, 255, 255, ${a})` : `rgba(60, 60, 110, ${a * 0.6})`;
        ctx.fillRect(d.x * w, d.y * h, d.size, d.size);
      }
    };

    const frame = (time: number) => {
      raf = 0;
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

    resize();
    start();
    addEventListener("resize", onResize);
    addEventListener("scroll", start, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", start);
    // Redraw right away on a theme flip (matters when the animation is paused).
    const themeObserver = new MutationObserver(start);
    themeObserver.observe(document.documentElement, { attributeFilter: ["data-theme"] });
    return () => {
      themeObserver.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      removeEventListener("scroll", start);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={ref} className={styles.galaxy} aria-hidden="true" />;
}
