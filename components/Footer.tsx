import Link from "next/link";
import { githubUrl, site } from "@/content";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>{site.name}</p>
        <ul className={styles.links}>
          <li>
            <Link href="/bankr">Bankr</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <a href={githubUrl()} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.resume}>Résumé</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
