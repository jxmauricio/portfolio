import "server-only";
import { cacheLife } from "next/cache";

export type ContributionDay = {
  date: string; // YYYY-MM-DD
  count: number;
};

// Each week is Sunday through Saturday. The first and last weeks can be partial.
export type ContributionWeek = ContributionDay[];

export type ContributionCalendar = {
  total: number;
  weeks: ContributionWeek[];
};

export type ContributionData = {
  all: ContributionCalendar;
  repo: ContributionCalendar | null; // commits to the filtered repo, same date grid as `all`
  repoName: string;
  connected: boolean; // false when the token or username is missing, or the request failed
};

const QUERY = `
  query ($login: String!, $after: String) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            name
          }
          contributions(first: 100, after: $after) {
            nodes {
              occurredAt
              commitCount
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    }
  }
`;

type QueryResult = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
        };
        commitContributionsByRepository: {
          repository: { name: string };
          contributions: {
            nodes: { occurredAt: string; commitCount: number }[];
            pageInfo: { hasNextPage: boolean; endCursor: string | null };
          };
        }[];
      };
    } | null;
  };
  errors?: { message: string }[];
};

async function runQuery(token: string, login: string, after: string | null) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { login, after } }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);
  const json = (await res.json()) as QueryResult;
  if (json.errors?.length) throw new Error(json.errors[0].message);
  const collection = json.data?.user?.contributionsCollection;
  if (!collection) throw new Error(`GitHub user "${login}" not found`);
  return collection;
}

// A zero-filled year of weeks ending this week, so the graph renders without a token.
function emptyCalendar(): ContributionCalendar {
  const today = new Date();
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 364 - start.getUTCDay());
  const weeks: ContributionWeek[] = [];
  for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    if (d.getUTCDay() === 0) weeks.push([]);
    weeks[weeks.length - 1].push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  return { total: 0, weeks };
}

/**
 * Contribution calendar for the last year, plus commits to `repoName` on the
 * same grid. Runs on the server only and is cached for a day, so the token is
 * never sent to the browser and GitHub is hit at most once per day.
 */
export async function getContributions(
  login: string,
  repoName: string,
): Promise<ContributionData> {
  "use cache";
  cacheLife("days");

  const token = process.env.GITHUB_TOKEN;
  if (!token || !login || login.includes("PLACEHOLDER")) {
    return { all: emptyCalendar(), repo: null, repoName, connected: false };
  }

  try {
    const first = await runQuery(token, login, null);
    const calendar = first.contributionCalendar;
    const all: ContributionCalendar = {
      total: calendar.totalContributions,
      weeks: calendar.weeks.map((w) =>
        w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
      ),
    };

    // Daily commit counts for the repo. occurredAt is midnight in the user's
    // time zone expressed in UTC, so the date part matches the calendar day
    // for time zones west of UTC.
    const repoCounts = new Map<string, number>();
    const matchRepo = (c: typeof first) =>
      c.commitContributionsByRepository.find(
        (r) => r.repository.name.toLowerCase() === repoName.toLowerCase(),
      );

    let entry = matchRepo(first);
    for (let page = 0; entry && page < 5; page++) {
      for (const node of entry.contributions.nodes) {
        const date = node.occurredAt.slice(0, 10);
        repoCounts.set(date, (repoCounts.get(date) ?? 0) + node.commitCount);
      }
      const { hasNextPage, endCursor } = entry.contributions.pageInfo;
      if (!hasNextPage) break;
      entry = matchRepo(await runQuery(token, login, endCursor));
    }

    let repoTotal = 0;
    const repoWeeks = all.weeks.map((week) =>
      week.map((day) => {
        const count = repoCounts.get(day.date) ?? 0;
        repoTotal += count;
        return { date: day.date, count };
      }),
    );

    return {
      all,
      repo: { total: repoTotal, weeks: repoWeeks },
      repoName,
      connected: true,
    };
  } catch (error) {
    console.warn("[contributions] falling back to empty graph:", error);
    return { all: emptyCalendar(), repo: null, repoName, connected: false };
  }
}
