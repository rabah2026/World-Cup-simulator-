import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          dark: '#05070D',
          surface: 'rgba(255,255,255,0.06)',
          border: 'rgba(255,255,255,0.12)',
          green: '#00D084',
          deepGreen: '#003B2F',
          gold: '#D6A84F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'confetti': 'confetti 1s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(214,168,79,0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(214,168,79,0.8)' },
        },
      },
      backgroundImage: {
        'stadium': "radial-gradient(circle at top, rgba(0,208,132,0.18) 0%, transparent 32rem), radial-gradient(circle at 80% 20%, rgba(214,168,79,0.12) 0%, transparent 28rem), linear-gradient(180deg, #05070D 0%, #07110D 100%)",
      },
    },
  },
  plugins: [],
}

export default config
