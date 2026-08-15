# LinkedIn audit microsite

Per-prospect site Gemela presents on a discovery call. It is not a PDF and it is not gemelamedia.com.

Round 1 is a branded page plus one dummy prospect so layout can be reviewed on desktop and phone. Later rounds wire HarvestAPI. This repo does not scrape LinkedIn and does not call Apify.

## Round 1 sample

Open the site and you should see **Wren Calder**, founder of a fictional company called Ashgrove. The header uses an invented portrait and a dark-forest/teal cover banner. A teal **Sample** bar stays at the top so nobody confuses this with a live audit.

Dummy data is original posts only (no quote posts, no reposts) for the last 12 months. Numbers are internally consistent: glance stats, weekly trajectory, format mix, and the top/bottom posts all come from the same 47 posts in `data/sample.json`.

## Run locally

Needs Node 18+. From the repo root:

```bash
npm start
```

That serves the folder at [http://localhost:4173](http://localhost:4173). Or:

```bash
npx serve .
```

Do not open `index.html` as a `file://` URL. The page loads `data/sample.json` over HTTP.

## What’s on the page

1. **Header:** cover banner, circular photo, name, headline, role/company, followers, connections. Dummy JSON uses HarvestAPI field names (`photo`, `profilePicture`, `coverPicture`, `banner`) so live wiring is a drop-in later.
2. **Last 12 months at a glance:** totals, cadence, gap, median + P75 engagement, weekly trajectory (posts `#39c9b4`, median reactions `#e4c56a`, median comments `#b794f6`, median shares `#63e4d1`; toggle any mix, including one at a time; works with touch), format mix
3. **Top five posts:** hook, type, date, reactions, comments, shares, URL
4. **Bottom five posts:** same fields
5. **Profile health:** yes/no checklist, AEO read of headline + About, Featured vs what performed. Read-only. No rewrite.

No overall grade, no letter scores, no suggested pillars, no impressions/views/plays.

## Stack

Static HTML, CSS, and vanilla JS. Mock JSON. No framework, no scrape, no API keys.

Brand tokens match live [gemelamedia.com](https://gemelamedia.com) CSS (`:root` paper/ink/accent, Bricolage Grotesque / Public Sans / Spline Sans Mono, film grain, teal glow, 12px primary buttons, 16px cards).

## Dummy data

`data/sample.json` is the source of truth. Rebuild it with:

```bash
npm run data
```

## Preview

This environment could not enable GitHub Pages or log into Vercel. To open the sample on a phone:

1. Import this repo into [Vercel](https://vercel.com/new) (static site, no build command), or
2. On the public dummy copy, GitHub → Settings → Pages → Deploy from branch `main` → `/ (root)` → Save, then open `https://gemela-media.github.io/linkedin-audit-preview/`

Public dummy copy: [Gemela-Media/linkedin-audit-preview](https://github.com/Gemela-Media/linkedin-audit-preview)

`vercel.json` is included for a static Vercel deploy.
