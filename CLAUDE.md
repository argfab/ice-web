# CLAUDE.md — working on the ICE website

Hi! This is the website for **ICE — Luxury Weddings & Events**. You'll use this to
tweak and redesign the site. **You don't need to know how to code** — just talk to
**Claude Code** in plain English. It makes the changes and follows the rules in this
file.

> **The whole workflow:** open this folder in Claude Code → say **"set up and start
> the site"** → design by describing what you want → when you're happy, say **"save
> and send my changes for approval."** The site owner reviews and approves before
> anything is accepted.

---

## 1. First time only — set up your Mac

Say to Claude: **“Set up the site.”** It will get everything ready for you (install
the tools it needs, then the project). You only do this once per computer.

<sub>For Claude: ensure **Node 22+** (`node -v`); if missing, install (`brew install node@22`, or nvm). Then `corepack enable && corepack prepare pnpm@9 --activate`, then `pnpm install`.</sub>

## 2. See the site

Say: **“Start the site.”** Claude runs a local preview and gives you a link —
usually **http://localhost:4321**. Keep it running; your edits appear live.

<sub>For Claude: `pnpm dev`.</sub>

## 3. Make changes — just describe them

Talk to Claude like you would a designer-developer. For example:
- “Make the homepage headline bigger and the gold a little warmer.”
- “Add more breathing room above the application form.”
- “Swap the hero photo for a brighter one.”
- “The menu feels cramped on phones — fix the spacing.”
- “Make the buttons more rounded.”

Roughly where things live (Claude handles this — just FYI):
- **Pages** → `src/pages/` (home is `index.astro`)
- **Reusable pieces** (nav, footer, cards) → `src/components/`
- **Colours, fonts, spacing** → `tailwind.config.mjs` + `src/styles/global.css`
- **Photos** → referenced by web address in the page/content files

## 4. When you're happy — send it for approval

Say: **“Save and send my changes for approval.”** Claude saves your work to a new
branch and opens a **pull request** for the site owner to review. Once the owner
approves it, the change is accepted. You never publish directly — the owner has
the final say on every change.

<sub>For Claude: never commit or push to `main` (it's protected and will reject it). Run `pnpm build`, then `git checkout -b design/<short-topic>`, `git add -A && git commit -m "<short description>"`, `git push -u origin HEAD`, and open a PR: `gh pr create --fill --base main` (or share the “Create a pull request” link that `git push` prints). It merges only after the owner's review.</sub>

## 5. If something looks wrong
- *“The site won't start”* (or paste any red error text) → Claude fixes it.
- *“Undo my last change.”* → Claude reverts it.
- The owner always keeps a safe copy, so you can't permanently break anything.

---

## The rules (please keep these)

Change **how it looks** all you want — colours, fonts, spacing, words, images,
layout, animations. Make it beautiful. A few things keep the site fast, findable,
and working, so **leave these alone** (Claude will warn or refuse):

- **Mobile first.** Most visitors are on phones — every change must look and feel
  great on a small screen *first*.
- **Keep it fast.** Huge/uncompressed images, heavy effects, or extra tools that
  slow the page hurt us (speed *and* Google ranking). Smooth beats flashy.
- **The application form's plumbing** — where it sends and what it asks — stays as
  is. Restyle it freely; don't rewire it.
- **Don't touch the technical setup** — the build/security config
  (`astro.config.mjs`) or anything that isn't visual. If Claude says a request is
  “architecture, not cosmetic,” pause and check with the owner.

Ambitious animation and an immersive feel are welcome — just keep them **smooth on
phones** and **gentle for people who prefer reduced motion**.

---

## Notes for Claude Code (technical)

- **Stack:** Astro (static/SSG) + React islands + Tailwind. **Node 22, pnpm 9.** CI runs typecheck + build.
- **Setup/run/build:** `pnpm install` · `pnpm dev` (preview) · `pnpm build` (→ `dist/`) · `pnpm typecheck`. If pnpm is missing, `corepack enable && corepack prepare pnpm@9 --activate`.
- **Scope is cosmetic.** Edit `src/`, `tailwind.config.mjs`, `src/styles/`, content, and images only. Do **not** modify `astro.config.mjs` (especially the CSP), the build setup, or `.github/`. Backend / form-contract / deploy changes are out of scope — surface them to the owner instead of doing them.
- **Strict, hash-based CSP** (in `astro.config.mjs`): **no** inline `<script>`, inline `style=`, or inline `on*` handlers. Use scoped `<style>`, Tailwind classes, and bundled islands. A CSP error in the console means the change is wrong.
- **Priority order, always:** mobile UX → performance (Core Web Vitals: LCP/CLS/INP) → SEO → accessibility → visual flair. Never trade the first four for the last.
- **Animations:** prefer CSS `transform`/`opacity` (GPU); never animate layout properties (width/height/top/left); respect `prefers-reduced-motion`; lazy-load heavy effects (canvas/WebGL) and degrade gracefully; keep JS light. If it janks on a mid-range phone, it's not done.
- **Images:** set width/height or aspect ratio (avoid layout shift), lazy-load below the fold, meaningful `alt`; optimise new ones (WebP/AVIF, sensible size).
- **Application form** (`src/islands/ApplicationForm/`): posts to `/api/contact`; under `import.meta.env.DEV` it simulates success so the flow can be previewed locally. Keep `schema.ts` aligned with the server's validation. Don't change the endpoint or the fields.
- **Before pushing:** ensure `pnpm build` succeeds.
