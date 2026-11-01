"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "./Icons";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

// The theme lives on <html data-theme>; watch it so the button state follows.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};
const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
const getServerTheme = () => null;

// Sun/moon button that flips the theme and remembers the choice. Both icons
// are rendered and CSS shows the right one, so the server markup never has to
// know the theme.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  const toggle = () => {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      className={className}
      aria-label="Dark mode"
      aria-pressed={theme ? theme === "dark" : undefined}
      onClick={toggle}
    >
      <span className={styles.moon}>
        <MoonIcon />
      </span>
      <span className={styles.sun}>
        <SunIcon />
      </span>
    </button>
  );
}
