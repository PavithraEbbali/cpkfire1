import type { Config } from 'tailwindcss';

/**
 * NEW design system — built for this site, not inherited from the old one.
 *
 * The ONLY carryover from cpkfire.com is `brand.600` (#E42128), sampled from
 * the logo mark itself. Every tint and shade around it is derived here, and the
 * entire neutral scale is new: a cool slate system on a white / #F9FAFB base.
 * The old site's warm-plum neutrals and rose accent are deliberately not used.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FEF3F3',
          100: '#FDE4E5',
          200: '#FBC9CB',
          300: '#F79FA3',
          400: '#F06A70',
          500: '#E93B43',
          600: '#E42128', // logo mark — exact sampled value
          700: '#BE1A20',
          800: '#95171C',
          900: '#71181C',
        },
        slate: {
          50: '#F9FAFB',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Sora', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter2: '-0.035em',
      },
      maxWidth: {
        shell: '82rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 16px 40px -20px rgba(15,23,42,0.16)',
        lift: '0 2px 6px rgba(15,23,42,0.06), 0 30px 60px -24px rgba(228,33,40,0.32)',
        nav: '0 1px 0 rgba(15,23,42,0.06), 0 16px 40px -28px rgba(15,23,42,0.4)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 44s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
