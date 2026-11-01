"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GitHubIcon, LinkedInIcon, MenuIcon } from "./Icons";
import styles from "./Nav.module.css";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

type Props = {
  name: string;
  githubUrl: string;
  linkedinUrl: string;
};

export function Nav({ name, githubUrl, linkedinUrl }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header} data-open={open}>
      <nav className={`container ${styles.nav}`} aria-label="Main">
        <Link href="/" className={styles.brand}>
          {name}
        </Link>

        <ul className={styles.links} id="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={styles.link}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.icons}>
          <a href={githubUrl} className={styles.iconButton} aria-label="GitHub" target="_blank" rel="noreferrer">
            <GitHubIcon />
          </a>
          <a href={linkedinUrl} className={styles.iconButton} aria-label="LinkedIn" target="_blank" rel="noreferrer">
            <LinkedInIcon />
          </a>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.menuButton}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>
    </header>
  );
}
