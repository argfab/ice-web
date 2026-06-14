// One-off: rasterize a branded Open Graph card to public/og-cover.png (1200x630).
// Run from web/: `node scripts/make-og.mjs`. Uses sharp (already a dependency).
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="78%" cy="16%" r="62%">
      <stop offset="0%" stop-color="#D4B483" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="#0B1A2F" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#05070A"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(600,196)" fill="none" stroke="#D4B483" stroke-linejoin="round" stroke-linecap="round">
    <circle cx="0" cy="0" r="74" stroke-width="1.4" opacity="0.5"/>
    <path d="M-17 -27 L17 -27 L40 -8 L0 38 L-40 -8 Z" stroke-width="2.4"/>
    <g stroke-width="1.1" opacity="0.7">
      <path d="M-40 -8 H40"/>
      <path d="M-17 -27 L-23 -8"/>
      <path d="M17 -27 L23 -8"/>
      <path d="M-17 -27 L0 -8"/>
      <path d="M17 -27 L0 -8"/>
      <path d="M0 -8 V38"/>
    </g>
  </g>
  <text x="600" y="430" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="132" letter-spacing="24" fill="#F6F8FB">ICE</text>
  <text x="600" y="478" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="10" fill="#9AA4B0">LUXURY WEDDINGS &amp; EVENTS</text>
  <text x="600" y="552" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="#D4B483">Where Dreams Become Legacy</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-cover.png');
console.log('wrote public/og-cover.png');
