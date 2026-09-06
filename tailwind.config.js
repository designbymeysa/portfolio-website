/** @type {import('tailwindcss').Config} */
export default {
  // the toggle in NavBar puts `dark` on <html>; theme colours resolve through the
  // CSS variables in globals.css, so this is here for any `dark:` utility that follows
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // ── Breakpoints ──
    // `md` is Tailwind's 768px by default, which lands exactly on an iPad in portrait
    // (768–834px) — so a tablet held upright picked up every desktop layout in the
    // site at its narrowest. Moved past that range, so portrait tablets read as
    // phones: stacked cards, the hamburger menu, clamped copy. Landscape, and the
    // 12.9" iPad's 1024px portrait, still get the wide layouts at `lg`.
    screens: {
      sm: '640px',
      md: '900px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        blue: {
          50:  '#EEF1FF',
          100: '#DADFFF',
          200: '#B5BEFF',
          300: '#8694FF',
          400: '#5C6EFF',
          500: '#3D52FF',
          600: '#2A3FE6',
          700: '#1F30B8',
          800: '#18258A',
          900: '#111A5C',
        },
        ink: {
          0:   '#FFFFFF',
          50:  '#F6F7F9',
          100: '#ECEEF2',
          200: '#DCDFE5',
          300: '#B8BDC7',
          400: '#8A8F9B',
          500: '#6B6F7A',
          600: '#4B4F58',
          700: '#2F323A',
          800: '#1A1C22',
        },
        purple: {
          300: '#C4B5FD',
          500: '#7B5CF5',
          700: '#5B3FD4',
        },
        surface: {
          base:   '#FAFAF9',
          card:   '#E8DDD7',
          ticker: '#1A1A1A',
          footer: '#111111',
        },
        tag: {
          bg:   '#EFEFEF',
          text: '#333333',
        },
        primary: '#1C1C1E',
      },

      fontFamily: {
        display:  ['"Libre Caslon Text"', 'serif'],
        caslon:   ['"Libre Caslon Text"', 'serif'],
        sans:     ['"Open Sans"', 'system-ui', 'sans-serif'],
        heading:  ['"Open Sans"', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'display-hero':    ['72px', { lineHeight: '79px', letterSpacing: '-1.44px', fontWeight: '700' }],
        'display-h1':      ['48px', { lineHeight: '55px', letterSpacing: '-0.48px', fontWeight: '700' }],
        'display-title':   ['40px', { lineHeight: '48px', fontWeight: '700' }],
        'heading-1':       ['52px', { lineHeight: '60px', letterSpacing: '-0.52px', fontWeight: '700' }],
        'heading-2':       ['36px', { lineHeight: '44px', letterSpacing: '-0.36px', fontWeight: '700' }],
        'heading-3':       ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'heading-4':       ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'body':            ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm':         ['12px', { lineHeight: '18px', letterSpacing: '0.24px', fontWeight: '400' }],
        'ui-button':       ['13px', { lineHeight: '18px', letterSpacing: '0.13px', fontWeight: '500' }],
        'ui-tag':          ['11px', { lineHeight: '15px', letterSpacing: '1.5px', fontWeight: '500' }],
        'ui-badge':        ['10px', { lineHeight: '12px', letterSpacing: '1.5px', fontWeight: '600' }],
        'ui-logo':         ['12px', { lineHeight: '16px', letterSpacing: '2px', fontWeight: '600' }],
      },

      spacing: {
        '2xs': '2px',
        'xs':  '4px',
        'sm':  '8px',
        'md-': '12px',
        'md':  '16px',
        'lg':  '24px',
        'xl':  '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '80px',
        '5xl': '96px',
        '6xl': '128px',
      },

      // every curve on the site is a flat 2px — the named steps are kept so
      // existing class names keep working; only the pill tokens stay rounded
      borderRadius: {
        'none':     '2px',
        'xsmall':   '2px',
        'small':    '2px',
        'medium':   '2px',
        'large':    '2px',
        'xlarge':   '2px',
        'section':  '2px',
        'icon-btn': '2px',
        // pills — the VIEW cursor and the tag chips — stay fully rounded
        'badge':    '9999px',
        'full':     '9999px',
        // Tailwind's own scale, flattened to match
        'sm':       '2px',
        DEFAULT:    '2px',
        'md':       '2px',
        'lg':       '2px',
        'xl':       '2px',
        '2xl':      '2px',
        '3xl':      '2px',
      },

      transitionDuration: {
        'short':  '150ms',
        'medium': '250ms',
        'long':   '400ms',
      },

      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'enter':    'cubic-bezier(0, 0, 0.2, 1)',
        'exit':     'cubic-bezier(0.4, 0, 1, 1)',
      },

      animation: {
        'ticker': 'ticker 60s linear infinite',
      },

      keyframes: {
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
