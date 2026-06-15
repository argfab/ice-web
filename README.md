# ICE — Luxury Weddings & Events (front-end)

The static marketing site + multi-step private-application form for ICE Luxury
Weddings & Events. Astro (SSG) + React islands + Tailwind. **Front-end only** —
there is no backend in this repo; build your own and wire up the one endpoint
the form needs (below).

## Local development

Requires **Node 22** + **pnpm 9**.

```bash
pnpm install
pnpm dev        # dev server
pnpm build      # production build → dist/
pnpm preview    # serve the build
pnpm typecheck  # astro check
```

## Hosting

It's a static site — `pnpm build` emits `dist/`, deployable to any static host
(S3 + CloudFront, Cloudflare Pages, Netlify, Vercel-static, etc.).

## The application form is a DEMO STUB

The form (`src/islands/ApplicationForm/`) does **not** call a backend. On submit it
validates client-side, then shows the API contract and the exact JSON payload a
backend must accept. To go live, point `submit()` in
`src/islands/ApplicationForm/useApplicationForm.ts` at your endpoint.

### Backend contract to implement

`POST /api/contact` — `Content-Type: application/json`

```jsonc
{
  "story": "string (1–4000)",
  "eventDate": "string; must be a future date",
  "destination": "string",
  "guestCount": "intimate | considered | grand | world",
  "investmentTier": "bespoke | signature | atelier | sans-limites | discuss",
  "fullName": "string",
  "email": "valid email",
  "phone": "string (optional)",       // at least one of phone / whatsapp
  "whatsapp": "string (optional)",
  "instagram": "string (optional)",
  "company_website": "honeypot — reject the request if non-empty",
  "formRenderedAt": 0,                 // number, ms epoch (anti-bot time-trap)
  "submissionId": "uuid"               // use for idempotency
}
```

Success response: `{ "ok": true, "id": "<uuid>" }`

The canonical client schema (zod) is `src/islands/ApplicationForm/schema.ts` —
mirror its rules server-side.

## Architecture notes

- **Static HTML (SSG)** for speed + SEO; interactivity via lazily-hydrated React
  islands (`src/islands/`).
- **Strict, hash-based CSP** (configured in `astro.config.mjs`) — no inline scripts
  or styles. Adding inline `<script>`/`style=`/`on*=` will be blocked.
- **Mobile-first:** the bulk of traffic is mobile; design and test there first.

## Images

Photography lives in `public/images/` and is referenced from the source markup /
content collections. Replace these with your own licensed assets (or point them at
your CDN) before launch.
