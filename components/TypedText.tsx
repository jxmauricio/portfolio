"use client";

import { useEffect, useState } from "react";
import styles from "./TypedText.module.css";

type Props = {
  text: string;
  startDelay?: number;
  speed?: number;
};

// Types `text` out one character at a time behind a blinking caret. A hidden
// copy of the full text holds the final size so nothing shifts while typing,
// and screen readers get the full text straight away.
export function TypedText({ text, startDelay = 500, speed = 90 }: Props) {
  const [count, setCount] = useState(0);
  const typing = count < text.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const step = (n: number) => {
      setCount(n);
      if (n < text.length) timer = setTimeout(() => step(n + 1), speed * (0.6 + Math.random() * 0.8));
    };
    timer = setTimeout(() => step(1), startDelay);
    return () => clearTimeout(timer);
  }, [text, startDelay, speed]);

  return (
    <span className={styles.root}>
      <span className={styles.sizer}>{text}</span>
      <span className={styles.typed} aria-hidden="true">
        {text.slice(0, count)}
        <span className={`${styles.caret} ${typing ? styles.solid : ""}`} />
      </span>
      <span className={styles.srOnly}>{text}</span>
    </span>
  );
}
