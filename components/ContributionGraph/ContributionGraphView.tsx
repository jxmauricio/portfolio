"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { ContributionCalendar, ContributionData } from "@/lib/github";
import styles from "./ContributionGraph.module.css";

export type GraphView = "all" | "repo";

type Props = {
  data: ContributionData;
  initialView: GraphView;
  profileUrl: string;
};

type Tooltip = { text: string; x: number; y: number };

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function parseDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

function formatDay(date: string) {
  return parseDate(date).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function emptyLike(calendar: ContributionCalendar): ContributionCalendar {
  return { total: 0, weeks: calendar.weeks.map((week) => week.map((day) => ({ ...day, count: 0 }))) };
}

function levelFor(count: number, max: number) {
  if (count === 0 || max === 0) return 0;
  return Math.min(4, Math.ceil((count / max) * 4));
}

// Month label at each week where a new month starts. The first label is
// dropped when the next one is too close to fit.
function monthLabels(calendar: ContributionCalendar) {
  const labels: { week: number; label: string }[] = [];
  let prev = -1;
  calendar.weeks.forEach((week, i) => {
    const month = parseDate(week[0].date).getUTCMonth();
    if (month !== prev) {
      labels.push({
        week: i,
        label: parseDate(week[0].date).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
      });
      prev = month;
    }
  });
  if (labels.length > 1 && labels[1].week - labels[0].week < 3) labels.shift();
  return labels;
}

export function ContributionGraphView({ data, initialView, profileUrl }: Props) {
  const [view, setView] = useState<GraphView>(initialView);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const calendar = view === "repo" ? (data.repo ?? emptyLike(data.all)) : data.all;
  const max = Math.max(0, ...calendar.weeks.flat().map((d) => d.count));
  const unit = view === "repo" ? "commit" : "contribution";
  const plural = (n: number) => `${n.toLocaleString("en-US")} ${unit}${n === 1 ? "" : "s"}`;

  // Start scrolled to the most recent weeks on narrow screens.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  function showTooltip(event: PointerEvent<HTMLDivElement>) {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-date]");
    const frame = frameRef.current;
    if (!cell || !frame) return;
    const cellRect = cell.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    // Keep the tooltip inside the card near the first and last weeks.
    const center = cellRect.left - frameRect.left + cellRect.width / 2;
    setTooltip({
      text: `${formatDay(cell.dataset.date!)} · ${plural(Number(cell.dataset.count))}`,
      x: Math.min(Math.max(center, 72), frameRect.width - 72),
      y: cellRect.top - frameRect.top,
    });
  }

  return (
    <div className={`card ${styles.graph}`}>
      <div className={styles.header}>
        <p className={styles.total}>
          {view === "repo"
            ? `${plural(calendar.total)} to ${data.repoName} in the last year`
            : `${plural(calendar.total)} in the last year`}
        </p>
        <div className={styles.toggle} role="group" aria-label="Contribution source">
          <button type="button" aria-pressed={view === "all"} onClick={() => setView("all")}>
            All GitHub
          </button>
          <button type="button" aria-pressed={view === "repo"} onClick={() => setView("repo")}>
            {data.repoName}
          </button>
        </div>
      </div>

      <div className={styles.frame} ref={frameRef}>
        <div className={styles.days} aria-hidden="true">
          {DAY_LABELS.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>

        <div className={styles.scroll} ref={scrollRef}>
          <div className={styles.months} aria-hidden="true">
            {monthLabels(calendar).map(({ week, label }) => (
              <span key={`${week}-${label}`} style={{ gridColumnStart: week + 1 }}>
                {label}
              </span>
            ))}
          </div>
          <div
            className={styles.cells}
            role="img"
            aria-label={`Contribution graph: ${plural(calendar.total)} in the last year`}
            onPointerOver={showTooltip}
            onPointerLeave={() => setTooltip(null)}
          >
            {calendar.weeks.map((week, w) =>
              week.map((day) => (
                <div
                  key={day.date}
                  className={styles.cell}
                  data-level={levelFor(day.count, max)}
                  data-date={day.date}
                  data-count={day.count}
                  style={{ gridColumnStart: w + 1, gridRowStart: parseDate(day.date).getUTCDay() + 1 }}
                />
              )),
            )}
          </div>
        </div>

        {tooltip && (
          <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }} role="status">
            {tooltip.text}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {data.connected ? (
          <a href={profileUrl} className="text-link" target="_blank" rel="noreferrer">
            View on GitHub
          </a>
        ) : (
          <span>Live data appears once GITHUB_TOKEN is set.</span>
        )}
        <div className={styles.legend} aria-hidden="true">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={styles.cell} data-level={level} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
