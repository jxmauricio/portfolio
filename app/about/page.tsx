import type { Metadata } from "next";
import { GitHubIcon, LinkedInIcon } from "@/components/Icons";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { readParagraphs, readText, renderInline, stripInline } from "@/lib/markdown";
import { education, experience, githubUrl, site } from "@/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: stripInline(readText("teaser.md")),
};

export default function AboutPage() {
  const paragraphs = readParagraphs("about.md");
  return (
    <>
      <section className={`container ${styles.intro}`}>
        <PhotoSlot src={site.photos.about} alt={`Portrait of ${site.name}`} initials="JM" priority className={styles.photo} />
        <div>
          <p className="eyebrow">About</p>
          <h1 className={styles.title}>Hi, I&apos;m John.</h1>
          <div className={styles.body}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{renderInline(paragraph)}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className={`container ${styles.facts}`}>
          <Reveal className={`card ${styles.fact}`}>
            <h2 className={styles.factTitle}>Now</h2>
            <p>
              {experience[0].title} on the {experience[0].team} team at {experience[0].company}, since {experience[0].start}.
            </p>
            <p>Building Bankr, an AI-first personal finance app, in private beta.</p>
          </Reveal>
          <Reveal className={`card ${styles.fact}`} delay={80}>
            <h2 className={styles.factTitle}>Education</h2>
            <p>{education.school}</p>
            <p>
              {education.degree}, {education.start} to {education.end}
            </p>
          </Reveal>
          <Reveal className={`card ${styles.fact}`} delay={160}>
            <h2 className={styles.factTitle}>Elsewhere</h2>
            <ul className={styles.links}>
              <li>
                <a href={`mailto:${site.email}`} className="text-link">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.linkedin} className="text-link" target="_blank" rel="noreferrer">
                  <LinkedInIcon size={14} /> LinkedIn
                </a>
              </li>
              <li>
                <a href={githubUrl()} className="text-link" target="_blank" rel="noreferrer">
                  <GitHubIcon size={14} /> GitHub
                </a>
              </li>
              <li>
                <a href={site.resume} className="text-link">
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
