/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // ── Backgrounds: pure black ──────────────────────────────────────────
        obsidian: { DEFAULT: '#0D0D0D', soft: '#141414' },
        midnight: { DEFAULT: '#111111', deep: '#080808', soft: '#181818' },

        // ── Primary text accent: Champagne gold (stays) ───────────────────────
        champagne: {
          DEFAULT: '#C7AE7B', // Warm gold — eyebrows, labels, logo tint
          soft:    '#D4BC8F', // Lighter gold — secondary accents
          deep:    '#9E8355', // Deeper gold — muted accents
          bright:  '#E8D4A8', // Bright champagne — highlights
        },

        // ── Secondary accent: Royal Blue ─────────────────────────────────────
        // Used for: button hover fills, active borders, glows, underlines.
        // NEVER as text on dark backgrounds.
        burgundy: {
          DEFAULT: '#1B3A8C', // Royal Blue
          soft:    '#2D5ACA', // Mid royal blue — borders, indicators
          deep:    '#0D2159', // Deepest — shadows
          bright:  '#4169E1', // Classic royal blue — lighter highlights
        },

        // ── Text: Pure White / warm ivory ────────────────────────────────────
        crystal: { DEFAULT: '#F4F0EB', dim: '#DDD5CB' },
        silver:  { DEFAULT: '#C8BEB4', soft: '#988E84', deep: '#6B6058' },
      },
      fontFamily: {
        // H1 / hero headlines — editorial high-contrast serif
        display: ['Advercase', 'Georgia', 'Cambria', 'serif'],
        // H2 / H3 / section labels — stylized rounded display
        subhead: ['Nativera', 'Trebuchet MS', 'sans-serif'],
        // Body / UI / nav / buttons / captions — legible geometric sans
        body:    ['Glancyr', 'Helvetica Neue', 'Arial', 'sans-serif'],
        sans:    ['Glancyr', 'Helvetica Neue', 'Arial', 'sans-serif'],
        // Accent callouts / badges / highlights — bold angular, use sparingly
        accent:  ['Abode', 'Arial Black', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.32em',
        wordmark: '0.42em',
      },
      maxWidth: {
        prose: '64ch',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
        glide: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backgroundImage: {
        // Warm gold shimmer for buttons and interactive surfaces
        'champagne-sheen':
          'linear-gradient(110deg, transparent 32%, rgba(255, 235, 190, 0.14) 50%, transparent 68%)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%':   { opacity: '0', transform: 'translateY(40px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        drift: {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-14px)' },
        },
        'ring-draw': {
          '0%':   { strokeDashoffset: '1', opacity: '0' },
          '30%':  { opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '1' },
        },
        'facet-in': {
          '0%':   { opacity: '0', transform: 'scale(0.6) rotate(-8deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both',
        reveal:    'reveal 1.1s cubic-bezier(0.16,1,0.3,1) both',
        shimmer:   'shimmer 7s linear infinite',
        drift:     'drift 8s cubic-bezier(0.45,0,0.55,1) infinite alternate',
      },
    },
  },
  plugins: [],
};
