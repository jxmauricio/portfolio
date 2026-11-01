import Link from "next/link";
import { DemoVideo } from "@/components/DemoVideo";
import { ContributionGraph } from "@/components/ContributionGraph/ContributionGraph";
import { ArrowIcon, GitHubIcon, LinkedInIcon } from "@/components/Icons";
import { EyeButton } from "@/components/EyeButton";
import { Experience } from "@/components/Experience/Experience";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Climber } from "@/components/Climber/Climber";
import { Reveal } from "@/components/Reveal";
import { TypedText } from "@/components/TypedText";
import { readText, renderInline } from "@/lib/markdown";
import { bankr, education, experience, githubUrl, site } from "@/content";
import styles from "./page.module.css";

export default function Home() {
  const intro = readText("intro.md");
  const teaser = readText("teaser.md");
  return (
    <>
      <Climber />
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroText}>
          <p className="eyebrow">{site.hero.eyebrow}</p>
          <h1 className={styles.headline}>
            <TypedText text={site.hero.headline} />
          </h1>
          <p className={styles.intro}>{renderInline(intro)}</p>
          <div className={styles.actions}>
            <Link href="/#projects" className="btn btn-primary">
              See projects
            </Link>
            <EyeButton href={site.resume}>Résumé</EyeButton>
          </div>
        </div>
        <PhotoSlot
          src={site.photos.hero}
          alt={`Portrait of ${site.name}`}
          initials="JM"
          priority
          className={styles.heroPhoto}
        />
      </section>

      <section className="section" id="work">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Experience</p>
            <h2 className="section-title">Where I&apos;ve worked.</h2>
          </Reveal>
          <Experience roles={experience} education={education} />
        </div>
      </section>

      <section className="section section-alt" id="projects">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Projects</p>
            <h2 className="section-title">Things I&apos;m building.</h2>
          </Reveal>
          <Reveal className={`card ${styles.feature}`} delay={80}>
            <div>
              <p className="eyebrow">Side project · {bankr.status}</p>
              <h3 className={styles.projectName}>{bankr.name}</h3>
              <p className="section-lede">{bankr.tagline}</p>
              <ul className={styles.featureList}>
                {bankr.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Link href="/bankr" className="text-link">
                What is this? <ArrowIcon />
              </Link>
            </div>
            <DemoVideo className={styles.featureDemo} />
          </Reveal>
        </div>
      </section>

      <section className="section" id="github">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Building in public</p>
            <h2 className="section-title">What I&apos;ve been shipping.</h2>
            <p className="section-lede">My GitHub activity over the last year.</p>
          </Reveal>
          <Reveal className={styles.graphWrap}>
            <ContributionGraph />
          </Reveal>
        </div>
      </section>

      <section className="section section-alt" id="about">
        <Reveal className={`container ${styles.aboutTeaser}`}>
          <PhotoSlot src={site.photos.about} alt={`${site.name}`} initials="JM" className={styles.aboutPhoto} />
          <div>
            <p className="eyebrow">About</p>
            <h2 className="section-title">A bit about me.</h2>
            <p className="section-lede">{renderInline(teaser)}</p>
            <p className={styles.aboutLink}>
              <Link href="/about" className="text-link">
                More about me <ArrowIcon />
              </Link>
            </p>
          </div>
        </Reveal>
      </section>

      <section className="section" id="contact">
        <Reveal className={`container ${styles.contact}`}>
          <h2 className="section-title">Let&apos;s talk.</h2>
          <p className="section-lede">
            I&apos;m always happy to hear about interesting problems, especially in payments, fintech, or AI products.
          </p>
          <div className={styles.contactActions}>
            <EyeButton href={`mailto:${site.email}`}>{site.email}</EyeButton>
            <a href={site.linkedin} className="btn btn-secondary" target="_blank" rel="noreferrer">
              <LinkedInIcon size={16} /> LinkedIn
            </a>
            <a href={githubUrl()} className="btn btn-secondary" target="_blank" rel="noreferrer">
              <GitHubIcon size={16} /> GitHub
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
