# John Mauricio · Portfolio

Personal site built with Next.js (App Router), TypeScript, and plain CSS modules. Deploys to Vercel.

Pages: `/` (home), `/bankr` (case study), `/about`.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev
```

Open http://localhost:3000. Without a token the contribution graph renders an empty year so everything else works.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Environment

| Variable | Purpose |
| --- | --- |
| `GITHUB_TOKEN` | GitHub personal access token used on the server to read your contribution calendar. A classic token with no scopes reads public activity; add `repo` to count private contributions (needed for the Bankr view while the repo is private). Never exposed to the browser. |
| `GITHUB_USERNAME` | Your GitHub login. Also used for the GitHub links in the nav, contact section, and footer. |

The graph data is fetched in `lib/github.ts` inside a `"use cache"` function with `cacheLife("days")`, so it is built at deploy time and refreshed at most once a day.

## Editing content

All copy lives in `content/`:

- `site.ts`: name, contact links, hero and about copy, photo paths, GitHub username fallback
- `stats.ts`: the numbers strip
- `experience.ts`: roles and education
- `bankr.ts`: Bankr tagline, highlights, case study points, stack, repo and article links

Search for `[PLACEHOLDER]` to find what still needs filling in: GitHub username, photos, the Bankr repo URL, the LinkedIn article URL, and one line on the About page.

## Assets

Drop these into `public/`:

- `photo-hero.jpg`: hero portrait (4:5 works best). Then set `site.photos.hero = "/photo-hero.jpg"`.
- `photo-about.jpg`: About portrait. Then set `site.photos.about = "/photo-about.jpg"`.
- `resume.pdf`: linked from the hero, footer, and About page.

## Design tokens

Colors, radii, and spacing are CSS variables at the top of `app/globals.css`, with a dark palette under `prefers-color-scheme: dark`. Change `--accent` to retheme buttons, links, and the contribution graph.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, import the repo. The Next.js preset needs no changes.
3. Add `GITHUB_TOKEN` and `GITHUB_USERNAME` under Project Settings, Environment Variables.
4. Deploy. The graph refreshes on its own once a day; redeploy to refresh it sooner.
