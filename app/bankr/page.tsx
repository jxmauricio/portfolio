import type { Metadata } from "next";
import Link from "next/link";
import { ContributionGraph } from "@/components/ContributionGraph/ContributionGraph";
import { ArrowIcon, GitHubIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { bankr } from "@/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Bankr",
  description: bankr.tagline,
};

export default function BankrPage() {
  return (
    <>
      <section className={`container ${styles.hero}`}>
        <p className="eyebrow">Case study · {bankr.status}</p>
        <h1 className={styles.title}>{bankr.name}</h1>
        <p className={styles.tagline}>{bankr.tagline}</p>
        <p className={styles.summary}>{bankr.summary}</p>
        <div className={styles.actions}>
          {bankr.repoUrl ? (
            <a href={bankr.repoUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
              <GitHubIcon size={16} /> View the code
            </a>
          ) : (
            <span className={`btn btn-secondary ${styles.disabled}`} aria-disabled="true">
              Repo going public soon
            </span>
          )}
          <Link href="/#contact" className="btn btn-secondary">
            Ask about the beta
          </Link>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 className="section-title">Built to be right first.</h2>
            <p className="section-lede">
              A finance assistant that gets the math wrong is worse than none. Most of the work went into making answers checkable.
            </p>
          </Reveal>
          <ul className={styles.points}>
            {bankr.points.map((point, i) => (
              <Reveal as="li" key={point.title} className={`card ${styles.point}`} delay={(i % 3) * 80}>
                <span className={styles.pointIndex}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.pointTitle}>{point.title}</h3>
                <p className={styles.pointBody}>{point.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.stackSection}`}>
          <Reveal>
            <p className="eyebrow">Stack</p>
            <h2 className="section-title">What it runs on.</h2>
            <p className="section-lede">
              A FastAPI backend, a React and Vite web app, and an Expo mobile app, all on Postgres through Supabase. Bank data comes from Plaid. The API runs on Render and the web app on Vercel.
            </p>
          </Reveal>
          <Reveal>
            <ul className="chips" aria-label="Stack">
              {bankr.stack.map((tech) => (
                <li key={tech} className="chip">
                  {tech}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Progress</p>
            <h2 className="section-title">Commits to Bankr.</h2>
          </Reveal>
          <Reveal className={styles.graphWrap}>
            <ContributionGraph initialView="repo" />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <Reveal className={`container ${styles.writing}`}>
          <p className="eyebrow">Writing</p>
          <h2 className="section-title">{bankr.articleTitle}</h2>
          <p className="section-lede">
            A write-up on the eval harness, and how checking answers against a golden ledger fixed the chatbot&apos;s math.
          </p>
          {bankr.articleUrl && (
            <p className={styles.writingLink}>
              <a href={bankr.articleUrl} className="text-link" target="_blank" rel="noreferrer">
                Read it on LinkedIn <ArrowIcon />
              </a>
            </p>
          )}
        </Reveal>
      </section>
    </>
  );
}
