"use client";

import { useState } from "react";
import type { Education, Role } from "@/content/types";
import styles from "./Experience.module.css";

type Props = {
  roles: Role[];
  education: Education;
};

type Entry = {
  id: string;
  label: string;
  sub: string;
  dates: string;
  heading: string;
  team?: string;
  highlights?: string[];
  current?: boolean;
};

export function Experience({ roles, education }: Props) {
  const entries: Entry[] = [
    ...roles.map((role, i) => ({
      id: `${role.company}-${role.title}`.replace(/\W+/g, "-").toLowerCase(),
      label: role.company,
      sub: role.title,
      dates: role.end ? `${role.start} to ${role.end}` : role.start,
      heading: `${role.title}, ${role.company}`,
      team: role.team && `${role.team} team`,
      highlights: role.highlights,
      // The first role is the current one and starts open.
      current: i === 0,
    })),
    {
      id: "education",
      label: education.school,
      sub: "Education",
      dates: `${education.start} to ${education.end}`,
      heading: education.school,
      team: education.degree,
    },
  ];

  const [openId, setOpenId] = useState<string | null>(entries[0].id);
  const open = entries.find((entry) => entry.id === openId);

  return (
    <div className={styles.layout}>
      <div className={styles.nav} role="tablist" aria-orientation="vertical" aria-label="Experience">
        {entries.map((entry) => {
          const active = entry.id === openId;
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              id={`tab-${entry.id}`}
              aria-selected={active}
              aria-controls="exp-panel"
              className={`${styles.tab} ${active ? styles.tabActive : ""}`}
              onClick={() => setOpenId(active ? null : entry.id)}
            >
              <span className={styles.tabLabel}>
                {entry.label}
                {entry.current && <span className={styles.dot} aria-label="Current" />}
              </span>
              <span className={styles.tabSub}>{entry.sub}</span>
            </button>
          );
        })}
      </div>

      <div
        id="exp-panel"
        role="tabpanel"
        aria-labelledby={open ? `tab-${open.id}` : undefined}
        className={styles.panel}
      >
        {open ? (
          <div key={open.id} className={styles.panelBody}>
            <p className={styles.panelDates}>
              {open.current && "Current · "}
              {open.dates}
            </p>
            <h3 className={styles.panelTitle}>{open.heading}</h3>
            {open.team && <p className={styles.team}>{open.team}</p>}
            {open.highlights && (
              <ul className={styles.highlights}>
                {open.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className={styles.hint}>Select a role to see what I worked on.</p>
        )}
      </div>
    </div>
  );
}
