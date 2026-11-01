"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./EyeButton.module.css";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

// Pill link with two eyes whose pupils follow the cursor. Ported from the
// "Eye Follow Button" Framer component, without the Framer runtime.
export function EyeButton({ href, children, className = "" }: Props) {
  const eyesRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const eyes = eyesRef.current;
    if (!eyes || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pupils = Array.from(eyes.querySelectorAll<HTMLElement>(`.${styles.pupil}`));
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    const update = () => {
      frame = 0;
      if (!pointer) return;
      for (const pupil of pupils) {
        const eye = pupil.parentElement!.getBoundingClientRect();
        const dx = pointer.x - (eye.left + eye.width / 2);
        const dy = pointer.y - (eye.top + eye.height / 2);
        // Pupils travel up to 90% of the room left between pupil and eye edge.
        const max = ((eye.width - pupil.offsetWidth) / 2) * 0.9;
        const distance = Math.min(Math.hypot(dx, dy), max);
        const angle = Math.atan2(dy, dx);
        pupil.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
      }
    };

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <a href={href} className={`${styles.button} ${className}`}>
      <span className={styles.label}>{children}</span>
      <span ref={eyesRef} className={styles.eyes} aria-hidden="true">
        <span className={styles.eye}>
          <span className={styles.pupil} />
        </span>
        <span className={styles.eye}>
          <span className={styles.pupil} />
        </span>
      </span>
    </a>
  );
}
