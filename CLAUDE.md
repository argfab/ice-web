# CLAUDE.md — ICE Luxury Weddings & Events (front-end)

This file is written **for you, Claude Code.** It is the authoritative brief for this
repository — the design intent, the architecture, and the hard constraints. Read it
before you change anything.

**Who you're working for:** the people editing this site are the studio's graphic
designers, not engineers. They describe changes in plain language — *"warmer gold,"
"more breathing room above the form," "the menu feels cramped on phones."* Your job is
to translate that into correct, on-brand code that respects the constraints below, and
to **push back in plain English** when a request would break the architecture,
performance, or the security policy. Explain trade-offs the way you'd explain them to a
smart designer, not an engineer.

---

## What this repository is

The **front-end only** of the ICE website — an Astro static site. There is **no backend
here**: no server code, no AWS, no deploy credentials, no secrets. The backend (the
`/api/contact` Lambda and all infrastructure) lives in a separate private repository
owned by the studio.

You **cannot and must not** deploy, and you should never add deploy/AWS/secret logic
here. Releasing is external and owner-gated (see *Releasing*). Your work ends at: **the
build is correct and looks right in the preview server.**

---

## Design intent

ICE is an ultra-luxury destination-wedding studio — Bali-based, global reach, **"by
application only,"** selling six-figure celebrations. The brand voice is *Apple ×
Louis Vuitton × Aman*: restrained, cinematic, editorial — confident enough to leave
space. It is a mother-and-son house: founder **Nicky** (creative direction, decades of
Bali experience) and her son **Tayne** (innovation and technology).

The site is a dark, immersive, single-scroll **journey**, not a brochure. Anchors:

- **Palette** (source of truth: `tailwind.config.mjs`): near-black **obsidian / midnight**
  base; **champagne gold** + **royal-blue** accents; **crystal** (warm off-white) text;
  **silver** secondary. ⚠️ The Tailwind token literally named **`burgundy` holds royal-blue
  values** — a rename that was never propagated. Treat `burgundy-*` as royal blue.
- **Type:** couture serif display (Fraunces variable) + Inter body, both self-hosted
  (keeps `font-src 'self'`).
- **Texture & motion:** glass / backdrop-blur cards, a particle field, a gold
  diamond / constellation motif, scroll reveals, an animated logo opener. Ambitious and
  immersive — but it must stay **smooth on a phone** and calm under reduced motion.
- **Hero video:** the full-screen background video on the home page is **intentional and
  stays full quality.** It doubles as a soft pre-screen — serious clients have the
  devices and connections for it. **Never shrink, re-encode, or "optimize" it to save
  bytes.** Its only performance treatment is the existing **poster + deferred load**
  (`preload="none"`, played on idle, skipped under reduced motion) so it doesn't block
  first paint — preserve that pattern.

`tailwind.config.mjs` and `src/styles/global.css` are the **source of truth** for tokens,
fonts, and shared classes. Reuse them; don't hard-code colours or spacing.

---

## Architecture

- **Stack:** Astro 5 static (`output: 'static'`) + React **islands** (hydrated with
  `client:idle` / `client:visible` / `client:load`) + Tailwind 3. **Node 22, pnpm 9.**
- **Layout:** pages in `src/pages/` (home = `index.astro`); shared markup in
  `src/components/` (`.astro`); interactive pieces in `src/islands/` (React `.tsx`);
  plain browser scripts in `src/scripts/`; tokens/styles in `tailwind.config.mjs` +
  `src/styles/`.
- **Images** load from the original Supabase source
  (`qtrypzzcjebvfcihiynt.supabase.co`), which is whitelisted in the CSP `img-src`. Keep
  existing imagery on that origin; a *new* external image host would need a CSP change
  (out of scope — see below).
- **Application form** (`src/islands/ApplicationForm/`) posts to the same-origin
  **`/api/contact`** (served by the backend in production). Under `import.meta.env.DEV`
  it **simulates success**, so the full flow previews locally with no backend.
  `schema.ts` mirrors the server's validation contract — keep them aligned; do not change
  the endpoint or the fields.
- **Production domain:** the Astro `site` reads `process.env.SITE_URL` (release builds
  inject the real domain; dev/preview fall back to `example.com`). Never hard-code a
  domain.

---

## Releasing (you don't deploy — context only)

This repo's CI builds `dist/` on a `vX.Y.Z` git tag and publishes it as a
**checksum-verified artifact.** The studio's private backend repo **pins that artifact by
sha256** and deploys it to S3 / CloudFront behind an owner approval gate. So the division
of labour is: **you build and open PRs; the owner reviews, tags releases, and approves
deploys.** Do not add deploy logic, AWS, CI release wiring, or secrets to this repo.

---

## Hard constraints

**1. CSP is strict — and it is the #1 way to break this site.** A hash-based
Content-Security-Policy (`style-src 'self'` + hashes, `script-src 'self'` + hashes,
**no `unsafe-inline`**) is delivered via a `<meta>` tag configured in `astro.config.mjs`.
Consequences you must design around:
- **No inline `style="..."` attributes.** Use Tailwind classes or **scoped `<style>`
  blocks** (Astro hashes those). For values computed at runtime, set a **CSS custom
  property via the CSSOM** — `el.style.setProperty('--x', value)` — and read it in CSS.
  Programmatic styling is allowed; inline style *attributes* are not. **This includes
  React:** `style={{}}` on a server-rendered island emits an inline attribute and will be
  blocked — use a `ref` + CSSOM, or toggle classes, instead.
- **No hand-authored inline `<script>`** as raw HTML, and **no inline `on*=` handlers.**
  Use Astro's bundled `<script>` (it hashes them) or island components.
- A CSP violation in the **preview** console means the change is wrong. **Fix the change —
  never relax the policy.** (Loosening CSP requires editing `astro.config.mjs`, which is
  out of scope.)

**2. Scope is the front-end's appearance and content.** Freely edit `src/`,
`tailwind.config.mjs`, `src/styles/`, content, and `public/` assets. **Do not modify**
`astro.config.mjs` (especially the CSP), the build config, the `package.json` build
wiring, or `.github/`. Anything that needs a new external origin (image/script/font/
connect host), a CSP change, a form-contract change, or backend/deploy work is **out of
scope** — explain it to the owner rather than doing it.

**3. Priority order, always:** mobile UX → performance (Core Web Vitals: **LCP < 2.5 s,
CLS < 0.1, INP < 200 ms**) → SEO → accessibility → visual flair. Never trade the first
four for the last. Most visitors are on phones; design mobile-first.

**4. Animation discipline:** animate only `transform` / `opacity` (GPU-friendly); never
animate layout properties (width/height/top/left). Respect `prefers-reduced-motion` with
a calm/static fallback. Lazy-load heavy effects (canvas/particles) and degrade
gracefully. Keep JS light. If it janks on a mid-range phone, it isn't done.

**5. Images:** always set width/height or an aspect ratio (avoid layout shift);
lazy-load below the fold; meaningful `alt`; optimise new ones (WebP/AVIF, sensible
dimensions). The hero video is the one deliberate exception to "keep it small."

---

## Working in this repo

- **Setup:** Node 22 (`node -v`; if missing: `brew install node@22`, or nvm), then
  `corepack enable && corepack prepare pnpm@9 --activate`, then `pnpm install`.
- **Develop:** `pnpm dev` → http://localhost:4321. ⚠️ **CSP is NOT enforced in
  `astro dev`** — the dev server will happily run inline styles/scripts that production
  blocks. Never judge CSP from dev.
- **Verify before every PR:** `pnpm build`, then `pnpm preview` — **the preview server
  enforces the real CSP.** Open it, confirm **zero CSP violations** in the console, and
  sanity-check that the page is fast (LCP). Also run `pnpm typecheck` (astro check). If
  `pnpm build` fails, the change is not done.

---

## Publishing changes

**Never commit or push to `main`** (it is protected and will reject it). When the work
builds clean and looks right in preview:

1. `git checkout -b design/<short-topic>`
2. `git add -A && git commit -m "<short, plain description>"`
3. `git push -u origin HEAD`
4. Open a PR for the owner's review: `gh pr create --fill --base main` (or share the
   link `git push` prints).

The owner reviews and approves **every** change — that is the only path to the live site.
Tell the designer their work has been **"sent for approval,"** not "published."
