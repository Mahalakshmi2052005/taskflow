/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        ink: '#0D0D0D',
        paper: '#F7F4EF',
        accent: '#FF5C3A',
        muted: '#A09B94',
        surface: '#EDEBE6',
        border: '#D9D5CE'
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'scale-in': 'scaleIn 0.2s ease forwards'
      },
      keyframes: {
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } }
      }
    }
  },
  plugins: []
}
