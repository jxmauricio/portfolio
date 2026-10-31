import Link from "next/link";
import { ContributionGraph } from "@/components/ContributionGraph/ContributionGraph";
import { ArrowIcon, GitHubIcon, LinkedInIcon } from "@/components/Icons";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { bankr, education, experience, githubUrl, site, stats } from "@/content";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroText}>
          <p className="eyebrow">{site.hero.eyebrow}</p>
          <h1 className={styles.headline}>{site.hero.headline}</h1>
          <p className={styles.intro}>{site.hero.intro}</p>
          <div className={styles.actions}>
            <Link href="/bankr" className="btn btn-primary">
              See Bankr
            </Link>
            <a href={site.resume} className="btn btn-secondary">
              Résumé
            </a>
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

      <section className="container" aria-label="By the numbers">
        <ul className={styles.stats}>
          {stats.map((stat, i) => (
            <Reveal as="li" key={stat.value} className={styles.stat} delay={i * 80}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="section" id="bankr">
        <div className="container">
          <Reveal className={`card ${styles.feature}`}>
            <div>
              <p className="eyebrow">Side project · {bankr.status}</p>
              <h2 className="section-title">{bankr.name}</h2>
              <p className="section-lede">{bankr.tagline}</p>
              <ul className={styles.featureList}>
                {bankr.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Link href="/bankr" className="text-link">
                Read the case study <ArrowIcon />
              </Link>
            </div>
            <ul className={`chips ${styles.featureStack}`} aria-label="Stack">
              {bankr.stack.map((tech) => (
                <li key={tech} className="chip">
                  {tech}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt" id="github">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Building in public</p>
            <h2 className="section-title">What I&apos;ve been shipping.</h2>
            <p className="section-lede">My GitHub activity over the last year. Switch to Bankr to see just that repo.</p>
          </Reveal>
          <Reveal className={styles.graphWrap}>
            <ContributionGraph />
          </Reveal>
        </div>
      </section>

      <section className="section" id="work">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Experience</p>
            <h2 className="section-title">Where I&apos;ve worked.</h2>
          </Reveal>
          <ol className={styles.roles}>
            {experience.map((role) => (
              <Reveal as="li" key={`${role.company}-${role.title}`} className={styles.role}>
                <div className={styles.roleMeta}>
                  <span>{role.end ? `${role.start} to ${role.end}` : role.start}</span>
                </div>
                <div>
                  <h3 className={styles.roleTitle}>
                    {role.title}, {role.company}
                  </h3>
                  {role.team && <p className={styles.roleTeam}>{role.team} team</p>}
                  <ul className={styles.roleHighlights}>
                    {role.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
            <Reveal as="li" className={styles.role}>
              <div className={styles.roleMeta}>
                <span>
                  {education.start} to {education.end}
                </span>
              </div>
              <div>
                <h3 className={styles.roleTitle}>{education.school}</h3>
                <p className={styles.roleTeam}>{education.degree}</p>
              </div>
            </Reveal>
          </ol>
        </div>
      </section>

      <section className="section section-alt" id="about">
        <Reveal className={`container ${styles.aboutTeaser}`}>
          <PhotoSlot src={site.photos.about} alt={`${site.name}`} initials="JM" className={styles.aboutPhoto} />
          <div>
            <p className="eyebrow">About</p>
            <h2 className="section-title">A bit about me.</h2>
            <p className="section-lede">{site.about.teaser}</p>
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
            <a href={`mailto:${site.email}`} className="btn btn-primary">
              {site.email}
            </a>
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
