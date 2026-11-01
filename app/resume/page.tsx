import type { Metadata } from "next";
import { site } from "@/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Résumé",
  description: `${site.name}'s résumé.`,
};

// A page rather than a direct PDF link, so résumé opens show up in analytics.
export default function ResumePage() {
  return (
    <section className={`container ${styles.wrap}`}>
      <div className={styles.header}>
        <div>
          <p className="eyebrow">Résumé</p>
          <h1 className={styles.title}>{site.name}</h1>
        </div>
        <a href={site.resumePdf} className="btn btn-primary" download>
          Download PDF
        </a>
      </div>
      <object data={site.resumePdf} type="application/pdf" className={`card ${styles.pdf}`} aria-label={`${site.name}'s résumé`}>
        <p className={styles.fallback}>
          Your browser can&apos;t show the PDF here.{" "}
          <a href={site.resumePdf} className="text-link">
            Open it directly
          </a>
          .
        </p>
      </object>
    </section>
  );
}
