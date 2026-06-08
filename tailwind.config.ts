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
        navy: {
          950: '#020815',
          900: '#050A18',
          800: '#0A1628',
          700: '#0F1F3C',
          600: '#152850',
        },
        gold: {
          DEFAULT: '#D4A843',
          light: '#E8C46A',
          dark: '#B8892A',
        },
        apple: {
          blue: '#0A84FF',
          green: '#30D158',
          red: '#FF453A',
          orange: '#FF9F0A',
          purple: '#BF5AF2',
        },
      },
      backgroundImage: {
        'stadium': 'radial-gradient(ellipse at top, #0F1F3C 0%, #050A18 60%, #020815 100%)',
        'card-glass': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4A843 0%, #E8C46A 50%, #B8892A 100%)',
        'predict-gradient': 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'score-tick': 'scoreTick 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-blur-in': 'fadeBlurIn 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'trophy-rise': 'trophyRise 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'star-burst': 'starBurst 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        scoreTick: {
          '0%': { transform: 'scale(1.4)', color: '#30D158' },
          '100%': { transform: 'scale(1)', color: 'inherit' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeBlurIn: {
          '0%': { opacity: '0', filter: 'blur(8px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 50%, 90%': { transform: 'translateX(-4px)' },
          '30%, 70%': { transform: 'translateX(4px)' },
        },
        trophyRise: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.5)' },
          '60%': { transform: 'translateY(-10px) scale(1.1)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        starBurst: {
          '0%': { opacity: '1', transform: 'scale(0) rotate(0deg)' },
          '100%': { opacity: '0', transform: 'scale(2) rotate(180deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sf: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
