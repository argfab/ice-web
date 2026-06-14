# ICE — Luxury Weddings & Events (front-end)

The public, static front-end for ICE Luxury Weddings & Events — built with
[Astro](https://astro.build) + React islands + Tailwind.

## Local development

```bash
pnpm install
pnpm dev        # local dev server
pnpm build      # production build → ./dist
pnpm preview    # serve the production build
pnpm typecheck  # astro check
```

Requires Node 22 + pnpm 9.

## Deployment

Pushing to **`main`** deploys the site automatically (GitHub Actions →
`.github/workflows/deploy.yml`): it builds, then publishes `dist/` to the live
site's S3 bucket and invalidates the CDN. Authentication uses GitHub OIDC (no
stored AWS keys); the role it assumes can **only** write the website bucket and
invalidate the CDN — it cannot touch any backend resource.

Deploys are gated by the repo Actions variable `DEPLOY_ENABLED=true`.

## Scope — front-end only

This repository contains **only the website**. The backend (the application/
enquiry API, database, email, and all AWS infrastructure) lives in a separate,
private repository and is deployed independently. Changes here can never affect
the backend.

### One cross-repo contract to keep in sync

The client-side form validation in
[`src/islands/ApplicationForm/schema.ts`](src/islands/ApplicationForm/schema.ts)
mirrors the server's validation rules. If the application form's fields or rules
change, the backend's validator must be updated to match (and vice-versa).
