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
  connected: boolean; // false when the token or username is missing, or the request failed
};

const QUERY = `
  query ($login: String!) {
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
      };
    } | null;
  };
  errors?: { message: string }[];
};

async function runQuery(token: string, login: string) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
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
 * Contribution calendar for the last year. Runs on the server only and is
 * cached for a day, so the token is never sent to the browser and GitHub is
 * hit at most once per day.
 */
export async function getContributions(login: string): Promise<ContributionData> {
  "use cache";
  cacheLife("days");

  const token = process.env.GITHUB_TOKEN;
  if (!token || !login || login.includes("PLACEHOLDER")) {
    return { all: emptyCalendar(), connected: false };
  }

  try {
    const calendar = (await runQuery(token, login)).contributionCalendar;
    const all: ContributionCalendar = {
      total: calendar.totalContributions,
      weeks: calendar.weeks.map((w) =>
        w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
      ),
    };

    return { all, connected: true };
  } catch (error) {
    console.warn("[contributions] falling back to empty graph:", error);
    return { all: emptyCalendar(), connected: false };
  }
}
