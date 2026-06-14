/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // ICE palette — dark, futuristic luxury.
        midnight: { DEFAULT: '#0B1A2F', deep: '#060F1F', soft: '#13243D' }, // Deep Midnight Navy
        obsidian: { DEFAULT: '#05070A', soft: '#0E1216' }, // Obsidian Black (page base)
        champagne: { DEFAULT: '#D4B483', soft: '#E7D2A8', deep: '#B8975F', bright: '#F0D79B' }, // Champagne Gold
        silver: { DEFAULT: '#C7CDD4', soft: '#9AA4B0', deep: '#6B7480' }, // Brushed Silver
        crystal: { DEFAULT: '#F6F8FB', dim: '#DCE3EC' }, // Crystal White
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Inter Variable"', 'system-ui', '-apple-system', 'sans-serif'],
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
        'champagne-sheen':
          'linear-gradient(110deg, transparent 32%, rgba(231,210,168,0.65) 50%, transparent 68%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        drift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-14px)' },
        },
        'ring-draw': {
          '0%': { strokeDashoffset: '1', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '1' },
        },
        'facet-in': {
          '0%': { opacity: '0', transform: 'scale(0.6) rotate(-8deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both',
        reveal: 'reveal 1.1s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 7s linear infinite',
        drift: 'drift 8s cubic-bezier(0.45,0,0.55,1) infinite alternate',
      },
    },
  },
  plugins: [],
};
