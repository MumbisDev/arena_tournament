/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Japanese Brutalist Palette
        brutal: {
          black: '#0A0A0A',
          white: '#F7F5F0', // Warm paper white
          cream: '#EDE8DF',
          vermillion: '#D93025', // 朱色 - Traditional Japanese red
          vermillionDark: '#B71C1C',
          ink: '#1A1A1A',
        },
        neutral: {
          100: '#F0ECE3',
          200: '#D9D3C7',
          300: '#B8B0A0',
          400: '#8A8279',
          500: '#5C574F',
          600: '#3D3A34',
          700: '#2A2824',
          800: '#1A1917',
        },
        accent: {
          red: '#D93025',
          gold: '#C9A227',
          indigo: '#3D4F7C',
        },
        semantic: {
          error: '#D93025',
          success: '#2E7D32',
          warning: '#EF6C00',
        },
      },
      fontFamily: {
        mono: ['"Space Mono"', '"Courier New"', 'monospace'],
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        jp: ['"Noto Sans JP"', '"Yu Gothic"', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['96px', { lineHeight: '0.9', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-lg': ['72px', { lineHeight: '0.9', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display': ['48px', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '400' }],
        'heading': ['32px', { lineHeight: '1.1', letterSpacing: '0', fontWeight: '500' }],
        'subheading': ['20px', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '500' }],
        'body': ['14px', { lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '400' }],
        'mono-sm': ['12px', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '400' }],
        'mono-xs': ['10px', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '400' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      maxWidth: {
        'container': '1440px',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #0A0A0A',
        'brutal-sm': '2px 2px 0px 0px #0A0A0A',
        'brutal-lg': '8px 8px 0px 0px #0A0A0A',
        'brutal-red': '4px 4px 0px 0px #D93025',
        'brutal-inset': 'inset 2px 2px 0px 0px #0A0A0A',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      transitionDuration: {
        'fast': '100ms',
        'normal': '200ms',
        'slow': '400ms',
      },
      transitionTimingFunction: {
        'brutal': 'cubic-bezier(0.2, 0, 0, 1)',
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(to right, rgba(10, 10, 10, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(10, 10, 10, 0.05) 1px, transparent 1px)
        `,
        'diagonal-lines': `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 10px,
          rgba(10, 10, 10, 0.03) 10px,
          rgba(10, 10, 10, 0.03) 11px
        )`,
      },
      backgroundSize: {
        'grid': '24px 24px',
      },
      animation: {
        'glitch': 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) both',
        'scan': 'scan 8s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        scan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
      },
    },
  },
  plugins: [],
}
