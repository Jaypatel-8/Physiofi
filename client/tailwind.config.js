/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Color - #13a581 (Teal Green)
        primary: {
          50: '#e6f5f2',
          100: '#b3e4d6',
          200: '#80d3ba',
          300: '#4dc29e',
          400: '#1ab182',
          500: '#13a581', // Primary - Teal Green
          600: '#0f8a6a',
          700: '#0b6f53',
          800: '#0d5a4a',
          900: '#004a2e',
        },
        // Secondary Color - #177076 (Deep Teal)
        secondary: {
          50: '#e0f0f0',
          100: '#b3d9d9',
          200: '#80c2c2',
          300: '#4dabab',
          400: '#1a9494',
          500: '#177076', // Secondary - Deep Teal
          600: '#125a5a',
          700: '#0d4444',
          800: '#082e2e',
          900: '#031818',
        },
        // Tertiary Color - #28787e (Medium Teal)
        tertiary: {
          50: '#e6f2f3',
          100: '#b3d9dc',
          200: '#80c0c5',
          300: '#4da7ae',
          400: '#1a8e97',
          500: '#28787e', // Tertiary - Medium Teal
          600: '#206066',
          700: '#18484d',
          800: '#103033',
          900: '#08181a',
        },
        // Accent Color - #005d39 (Forest Green)
        accent: {
          50: '#e0f5ed',
          100: '#b3e0d1',
          200: '#80cbb5',
          300: '#4db699',
          400: '#1aa17d',
          500: '#005d39', // Accent - Forest Green
          600: '#004a2e',
          700: '#003723',
          800: '#002418',
          900: '#00110d',
        },
        // Additional Pastel Colors - Harmonious with teal/green palette
        'pastel-blue': {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da7ff',
          400: '#1a8eff',
        },
        'pastel-mint': {
          50: '#e6faf5',
          100: '#b3f0e0',
          200: '#80e6cb',
          300: '#4ddcb6',
          400: '#1ad2a1',
        },
        'pastel-lavender': {
          50: '#f0e6ff',
          100: '#d9b3ff',
          200: '#c280ff',
          300: '#ab4dff',
          400: '#941aff',
        },
        'pastel-peach': {
          50: '#fff0e6',
          100: '#ffd9b3',
          200: '#ffc280',
          300: '#ffab4d',
          400: '#ff941a',
        },
        'pastel-sky': {
          50: '#e6f5ff',
          100: '#b3e0ff',
          200: '#80cbff',
          300: '#4db6ff',
          400: '#1aa1ff',
        },
        'pastel-sage': {
          50: '#f0f5e6',
          100: '#d9e0b3',
          200: '#c2cb80',
          300: '#abb64d',
          400: '#94a11a',
        },
        // Legacy support
        teal: {
          50: '#e6f5f2',
          100: '#b3e4d6',
          200: '#80d3ba',
          300: '#4dc29e',
          400: '#1ab182',
          500: '#13a581',
          600: '#0f8a6a',
          700: '#0b6f53',
          800: '#0d5a4a',
          900: '#005d39',
        },
        deepTeal: {
          DEFAULT: '#177076',
          50: '#e0f0f0',
          100: '#b3d9d9',
          200: '#80c2c2',
          300: '#4dabab',
          400: '#1a9494',
          500: '#177076',
          600: '#125a5a',
          700: '#0d4444',
          800: '#082e2e',
          900: '#031818',
        },
        forest: {
          DEFAULT: '#005d39',
          50: '#e0f5ed',
          100: '#b3e0d1',
          200: '#80cbb5',
          300: '#4db699',
          400: '#1aa17d',
          500: '#005d39',
          600: '#004a2e',
          700: '#003723',
          800: '#002418',
          900: '#00110d',
        },
        background: {
          DEFAULT: '#F8FAF9',
        },
        text: {
          DEFAULT: '#1E1E1E',
          muted: '#707070',
        },
        gray: {
          50: '#F8FAF9', // Background
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#d0d0d0',
          400: '#a0a0a0',
          500: '#707070', // Muted Gray
          600: '#5a5a5a',
          700: '#444444',
          800: '#2e2e2e',
          900: '#1E1E1E', // Text
        },
        white: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'Lato', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
        display: ['Playfair Display', 'Merriweather', 'serif'],
        button: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/hero-pattern.svg')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
