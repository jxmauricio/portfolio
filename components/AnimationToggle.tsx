"use client";

import { useSyncExternalStore } from "react";
import { SparkleIcon } from "./Icons";
import styles from "./AnimationToggle.module.css";

// The choice lives on <html data-bg="off"> (set before paint from
// localStorage, see lib/theme.ts); watch it so the button state follows.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-bg"] });
  return () => observer.disconnect();
};
const getOn = () => document.documentElement.dataset.bg !== "off";
const getServerOn = () => null;

// Turns the animated background off (back to the plain page) and on again,
// and remembers the choice.
export function AnimationToggle({ className = "" }: { className?: string }) {
  const on = useSyncExternalStore(subscribe, getOn, getServerOn);

  const toggle = () => {
    const el = document.documentElement;
    const next = getOn() ? "off" : "on";
    if (next === "off") el.dataset.bg = "off";
    else delete el.dataset.bg;
    try {
      localStorage.setItem("bg", next);
    } catch {}
  };

  return (
    <button
      type="button"
      className={`${className} ${styles.button}`}
      aria-label="Background animation"
      aria-pressed={on ?? undefined}
      title={on === false ? "Turn background animation on" : "Turn background animation off"}
      onClick={toggle}
    >
      <SparkleIcon />
    </button>
  );
}
