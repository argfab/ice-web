import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

/**
 * Dev-only API stub. During `astro dev` this answers POST /api/contact with a
 * success response so designers can exercise the full application-form UX with
 * zero AWS credentials. It never runs in the static build (`apply: 'serve'`).
 */
function devApiStub() {
  return {
    name: 'ice-dev-api-stub',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          let id = `dev-${Date.now()}`;
          try {
            const payload = JSON.parse(body);
            if (payload && typeof payload.submissionId === 'string') id = payload.submissionId;
            console.log('[dev api stub] POST /api/contact', payload);
          } catch {
            /* ignore parse errors in the stub */
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true, id }));
        });
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // Canonical + absolute Open Graph URLs. Release builds inject the real production
  // domain via the SITE_URL env var (set as a repo Actions variable); local dev and
  // previews fall back to example.com.
  site: process.env.SITE_URL || 'https://example.com',
  output: 'static',
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  // Keep all CSS external so style-src can stay 'self' (no inline styles to allow).
  build: { inlineStylesheets: 'never' },
  // Hash-based Content-Security-Policy: Astro emits per-page hashes for its inline
  // hydration scripts, so script-src stays strict ('self' + hashes, no unsafe-inline).
  // This CSP is delivered via a <meta> tag; CloudFront no longer sends a CSP header.
  experimental: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://qtrypzzcjebvfcihiynt.supabase.co",
        "font-src 'self'",
        "connect-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
  vite: {
    plugins: [devApiStub()],
  },
});
